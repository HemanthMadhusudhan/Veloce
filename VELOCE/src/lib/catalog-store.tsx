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
  >
>;

type Ctx = {
  products: Product[];
  getById: (id: string) => Product | undefined;
  updateProduct: (id: string, patch: Override) => Promise<void>;
  addProduct: (p: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const C = createContext<Ctx | null>(null);

// Helper to map DB row to Product object
function mapDbRowToProduct(r: any): Product {
  return {
    id: r.id,
    name: r.name,
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
    images: r.images || [],
    description: r.description,
    material: r.material,
    rating: Number(r.rating || 5),
    reviews: Number(r.reviews || 0),
    stock: Number(r.stock || 0),
    stockBySize: r.stock_by_size || undefined,
    hasVideo: r.has_video || false,
    has360: r.has_360 || false,
  };
}

let cachedRaw = null;
if (typeof window !== "undefined") {
  try {
    const c = localStorage.getItem("veloce_products_cache");
    if (c) cachedRaw = JSON.parse(c);
  } catch (e) {}
}

let LIVE: Product[] = (cachedRaw || defaultProductsRaw as any[]).map(mapDbRowToProduct);
let listeners: (() => void)[] = [];

export function getLiveProducts(): Product[] {
  return LIVE;
}
export function getLiveProduct(id: string): Product | undefined {
  return LIVE.find((p) => p.id === id);
}

// Helper to map Product object to DB row fields
function mapProductToDbRow(p: Product): any {
  return {
    id: p.id,
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
          localStorage.setItem("veloce_products_cache", JSON.stringify(data));
        } catch (e) {}
      }
      listeners.forEach((l) => l());
    } catch (e) {
      console.error("Failed to load products from Supabase:", e);
    }
  }, []);

  useEffect(() => {
    refresh().then(() => setLoaded(true));
  }, [refresh]);

  const updateProduct = useCallback(
    async (id: string, patch: Override) => {
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

        const { error } = await supabase.from("products").update(dbPatch).eq("id", id);
        if (error) throw error;
        await refresh();
      } catch (e) {
        console.error("Failed to update product in Supabase:", e);
        throw e;
      }
    },
    [refresh],
  );

  const addProduct = useCallback(
    async (p: Product) => {
      try {
        const dbRow = mapProductToDbRow(p);
        const { error } = await supabase.from("products").insert(dbRow);
        if (error) throw error;
        await refresh();
      } catch (e) {
        console.error("Failed to add product to Supabase:", e);
        throw e;
      }
    },
    [refresh],
  );

  const removeProduct = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) throw error;
        await refresh();
      } catch (e) {
        console.error("Failed to remove product from Supabase:", e);
        throw e;
      }
    },
    [refresh],
  );

  const value: Ctx = {
    products,
    getById: (id) => products.find((p) => p.id === id),
    updateProduct,
    addProduct,
    removeProduct,
    refresh,
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
