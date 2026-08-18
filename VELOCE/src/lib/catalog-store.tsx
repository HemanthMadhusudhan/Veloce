import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { type Category, type Product } from "./catalog";
import defaultProductsRaw from "./default-products.json";

type Override = Partial<
  Pick<
    Product,
    | "price"
    | "compareAt"
    | "stock"
    | "stockBySize"
    | "badge"
    | "name"
    | "tag"
    | "images"
    | "description"
    | "team"
    | "colors"
    | "sizes"
    | "material"
    | "rating"
    | "reviews"
    | "category"
    | "driver"
    | "player"
  >
>;

type Ctx = {
  products: Product[];
  getById: (id: string) => Product | undefined;
  updateProduct: (id: string, patch: Override) => Promise<void>;
  addProduct: (p: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  deductStock: (items: { id: string; size?: string; qty: number }[]) => Promise<void>;
};

const C = createContext<Ctx | null>(null);

const NATURAL_IMG_MAP: Record<string, string[]> = {};
(defaultProductsRaw as any[]).forEach((p) => {
  if (p.id && p.images && p.images.length > 0) {
    NATURAL_IMG_MAP[p.id] = p.images;
  }
});

import { generateProductSlug, slugify } from "./slugify";

// Helper to map DB row to Product object
function mapDbRowToProduct(r: any): Product {
  const localImgs = NATURAL_IMG_MAP[r.id];
  const images = (localImgs && localImgs.length > 0 && localImgs[0].startsWith("/products/natural"))
    ? localImgs
    : (r.images || []);

  const name = r.name || "Jersey";
  const slug = r.slug || generateProductSlug(name) || r.id;

  return {
    id: r.id,
    slug: slug,
    name: name,
    category: r.category as Category,
    series: r.series || undefined,
    zone: r.zone || undefined,
    team: r.team,
    driver: r.driver || undefined,
    tag: r.tag,
    price: Number(r.price),
    compareAt: r.compare_at ? Number(r.compare_at) : undefined,
    badge: r.badge || undefined,
    colors: r.colors || [],
    sizes: r.sizes || [],
    images: images,
    description: r.description,
    material: r.material,
    rating: Number(r.rating || 5),
    reviews: Number(r.reviews || 0),
    stock: Number(r.stock ?? 0),
    stockBySize: typeof r.stock_by_size === "object" && r.stock_by_size !== null ? r.stock_by_size : undefined,
    hasVideo: r.has_video || false,
    has360: r.has_360 || false,
  };
}

let cachedRaw = null;
if (typeof window !== "undefined") {
  try {
    const c = localStorage.getItem("veloce_products_cache_v10");
    if (c) cachedRaw = JSON.parse(c);
  } catch (e) {}
}

let LIVE: Product[] = (cachedRaw || defaultProductsRaw as any[]).map(mapDbRowToProduct);
let listeners: (() => void)[] = [];

export function getLiveProducts(): Product[] {
  return LIVE;
}
export function getLiveProductBySlug(slug: string): Product | undefined {
  if (!slug) return undefined;
  const s = slug.toLowerCase();
  return LIVE.find(
    (p) =>
      p.id?.toLowerCase() === s ||
      p.slug?.toLowerCase() === s ||
      (p.name && slugify(p.name).toLowerCase() === s)
  );
}
export function getLiveProduct(id: string): Product | undefined {
  if (!id) return undefined;
  const target = id.toLowerCase();
  return LIVE.find(
    (p) =>
      p.id?.toLowerCase() === target ||
      p.slug?.toLowerCase() === target ||
      (p.name && slugify(p.name).toLowerCase() === target)
  );
}

// Helper to map Product object to DB row fields
function mapProductToDbRow(p: Product): any {
  return {
    id: p.id,
    slug: p.slug || generateProductSlug(p.name) || p.id,
    name: p.name,
    category: p.category,
    series: p.series || null,
    zone: p.zone || null,
    team: p.team,
    driver: p.driver || null,
    tag: p.tag,
    price: p.price,
    compare_at: p.compareAt || null,
    badge: p.badge || null,
    colors: p.colors,
    sizes: p.sizes,
    images: p.images,
    description: p.description,
    material: p.material,
    rating: p.rating,
    reviews: p.reviews,
    stock: p.stock,
    stock_by_size: p.stockBySize || null,
    has_video: p.hasVideo || false,
    has_360: p.has360 || false,
  };
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(LIVE);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const mapped = (data || []).map(mapDbRowToProduct);
      
      const demoProductRaw = defaultProductsRaw.find((p: any) => p.id === "demo-product-1rs");
      if (demoProductRaw && !mapped.some(p => p.id === "demo-product-1rs")) {
        mapped.push(mapDbRowToProduct(demoProductRaw));
      }

      setProducts(mapped);
      LIVE = mapped;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("veloce_products_cache_v10", JSON.stringify(data));
        } catch (e) {}
      }
      listeners.forEach((l) => l());
    } catch (e) {
      console.error("Failed to load products from Supabase:", e);
    }
  }, []);

  useEffect(() => {
    refresh().then(() => setLoaded(true));

    // Listen for Realtime stock & product updates across the whole site
    const channel = supabase
      .channel("public:products_stock_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const updateProduct = useCallback(
    async (id: string, patch: Override) => {
      // Optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? ({ ...p, ...patch } as Product) : p))
      );
      LIVE = LIVE.map((p) =>
        p.id === id ? ({ ...p, ...patch } as Product) : p
      );

      try {
        const dbPatch: any = {};
        if (patch.name !== undefined) dbPatch.name = patch.name;
        if (patch.price !== undefined) dbPatch.price = patch.price;
        if (patch.compareAt !== undefined) dbPatch.compare_at = patch.compareAt;
        if (patch.stock !== undefined) {
          dbPatch.stock = patch.stock;
          if (patch.stockBySize === undefined) {
            const existing = LIVE.find((p) => p.id === id);
            if (existing && existing.sizes && existing.sizes.length > 0) {
              const res: Record<string, number> = {};
              existing.sizes.forEach((s) => (res[s] = 0));
              for (let i = 0; i < patch.stock; i++) {
                res[existing.sizes[Math.floor(Math.random() * existing.sizes.length)]]++;
              }
              dbPatch.stock_by_size = res;
            }
          }
        }
        if (patch.stockBySize !== undefined) dbPatch.stock_by_size = patch.stockBySize;
        if (patch.badge !== undefined) dbPatch.badge = patch.badge;
        if (patch.tag !== undefined) dbPatch.tag = patch.tag;
        if (patch.images !== undefined) dbPatch.images = patch.images;
        if (patch.description !== undefined) dbPatch.description = patch.description;
        if (patch.team !== undefined) dbPatch.team = patch.team;
        if (patch.colors !== undefined) dbPatch.colors = patch.colors;
        if (patch.sizes !== undefined) dbPatch.sizes = patch.sizes;
        if (patch.material !== undefined) dbPatch.material = patch.material;
        if (patch.rating !== undefined) dbPatch.rating = patch.rating;
        if (patch.reviews !== undefined) dbPatch.reviews = patch.reviews;
        if (patch.category !== undefined) dbPatch.category = patch.category;
        if (patch.driver !== undefined) dbPatch.driver = patch.driver;

        const { error } = await supabase.from("products").update(dbPatch).eq("id", id);
        if (error) throw new Error(error.message || "Failed to update product");
        refresh(); // Refresh asynchronously to keep UI fast
      } catch (e: any) {
        console.error("Failed to update product in Supabase:", e);
        refresh(); // Revert on failure
        throw e instanceof Error ? e : new Error(e.message || "Failed to update product");
      }
    },
    [refresh],
  );

  const addProduct = useCallback(
    async (p: Product) => {
      // Optimistic update
      setProducts((prev) => [p, ...prev]);
      LIVE = [p, ...LIVE];

      try {
        if (p.stock > 0 && (!p.stockBySize || Object.keys(p.stockBySize).length === 0) && p.sizes && p.sizes.length > 0) {
          const res: Record<string, number> = {};
          p.sizes.forEach((s) => (res[s] = 0));
          for (let i = 0; i < p.stock; i++) {
            res[p.sizes[Math.floor(Math.random() * p.sizes.length)]]++;
          }
          p.stockBySize = res;
        }
        const dbRow = mapProductToDbRow(p);
        const { error } = await supabase.from("products").insert(dbRow);
        if (error) throw new Error(error.message || "Failed to add product");
        refresh(); // Refresh asynchronously
      } catch (e: any) {
        console.error("Failed to add product to Supabase:", e);
        refresh(); // Revert on failure
        throw e instanceof Error ? e : new Error(e.message || "Failed to add product");
      }
    },
    [refresh],
  );

  const removeProduct = useCallback(
    async (id: string) => {
      // Optimistic update
      setProducts((prev) => prev.filter((p) => p.id !== id));
      LIVE = LIVE.filter((p) => p.id !== id);

      try {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw new Error(error.message || "Failed to remove product");
        refresh(); // Refresh asynchronously
      } catch (e: any) {
        console.error("Failed to remove product from Supabase:", e);
        refresh(); // Revert on failure
        throw e instanceof Error ? e : new Error(e.message || "Failed to remove product");
      }
    },
    [refresh],
  );

  const deductStock = useCallback(
    async (items: { id: string; size?: string; qty: number }[]) => {
      if (!items || items.length === 0) return;

      // Optimistically deduct in memory and update local cache
      setProducts((prev) =>
        prev.map((p) => {
          const matchingItems = items.filter((it) => it.id === p.id);
          if (matchingItems.length === 0) return p;

          const updatedStockBySize = { ...(p.stockBySize || {}) };
          let updatedTotalStock = p.stock;

          matchingItems.forEach((it) => {
            const size = it.size;
            const qty = it.qty || 1;
            if (size) {
              const currentSizeStock =
                updatedStockBySize[size] !== undefined
                  ? updatedStockBySize[size]
                  : updatedTotalStock;
              updatedStockBySize[size] = Math.max(0, currentSizeStock - qty);
            } else {
              updatedTotalStock = Math.max(0, updatedTotalStock - qty);
            }
          });

          if (Object.keys(updatedStockBySize).length > 0) {
            updatedTotalStock = Object.values(updatedStockBySize).reduce((a, b) => a + b, 0);
          }

          return {
            ...p,
            stock: updatedTotalStock,
            stockBySize: updatedStockBySize,
          };
        })
      );

      LIVE = LIVE.map((p) => {
        const matchingItems = items.filter((it) => it.id === p.id);
        if (matchingItems.length === 0) return p;

        const updatedStockBySize = { ...(p.stockBySize || {}) };
        let updatedTotalStock = p.stock;

        matchingItems.forEach((it) => {
          const size = it.size;
          const qty = it.qty || 1;
          if (size) {
            const currentSizeStock =
              updatedStockBySize[size] !== undefined
                ? updatedStockBySize[size]
                : updatedTotalStock;
            updatedStockBySize[size] = Math.max(0, currentSizeStock - qty);
          } else {
            updatedTotalStock = Math.max(0, updatedTotalStock - qty);
          }
        });

        if (Object.keys(updatedStockBySize).length > 0) {
          updatedTotalStock = Object.values(updatedStockBySize).reduce((a, b) => a + b, 0);
        }

        return {
          ...p,
          stock: updatedTotalStock,
          stockBySize: updatedStockBySize,
        };
      });

      listeners.forEach((l) => l());

      // Update directly in Supabase products table
      for (const it of items) {
        try {
          const { data: prodData } = await supabase
            .from("products")
            .select("stock, stock_by_size")
            .eq("id", it.id)
            .maybeSingle();

          if (prodData) {
            let currentStockBySize: Record<string, number> = prodData.stock_by_size || {};
            let currentTotalStock = Number(prodData.stock || 0);
            const size = it.size;
            const qty = it.qty || 1;

            if (size) {
              const currentSizeVal =
                currentStockBySize[size] !== undefined
                  ? currentStockBySize[size]
                  : currentTotalStock;
              const newSizeVal = Math.max(0, currentSizeVal - qty);
              currentStockBySize = {
                ...currentStockBySize,
                [size]: newSizeVal,
              };
              currentTotalStock = Object.values(currentStockBySize).reduce((a, b) => a + b, 0);
            } else {
              currentTotalStock = Math.max(0, currentTotalStock - qty);
            }

            await supabase
              .from("products")
              .update({
                stock: currentTotalStock,
                stock_by_size: currentStockBySize,
              })
              .eq("id", it.id);
          }
        } catch (err) {
          console.error("Error updating stock in Supabase for item:", it.id, err);
        }
      }

      refresh();
    },
    [refresh]
  );

  const value: Ctx = {
    products,
    getById: (id) => products.find((p) => p.id === id),
    updateProduct,
    addProduct,
    removeProduct,
    refresh,
    deductStock,
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useCatalog() {
  const v = useContext(C);
  if (!v) throw new Error("useCatalog must be inside CatalogProvider");
  return v;
}

export function useProductsByCategory(cat?: Category): Product[] {
  const { products } = useCatalog();
  if (!cat) return products;
  return products.filter((p) => p.category === cat);
}
