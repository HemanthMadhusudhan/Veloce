import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Boxes,
  LayoutGrid,
  Timer,
  Search,
  Trash2,
  Plus,
  AlertCircle,
  RotateCcw,
  Pencil,
  X,
  ClipboardList,
  Image as ImageIcon,
  Users,
  Shield,
  ShieldOff,
  Ban,
  CheckCircle2,
  User,
} from "lucide-react";
import { SiteChrome } from "@/components/chrome";
import { useCatalog } from "@/lib/catalog-store";
import { CATEGORY_LABEL, type Category, type Product } from "@/lib/catalog";
import { DEFAULT_DROPS, useDrops, type Drop } from "@/lib/drops";
import { uploadImage } from "@/lib/upload";
import { formatOrderId } from "@/lib/format";
import { formatINR } from "@/lib/format";
import { useShop, type OrderStatus } from "@/lib/store";
import {
  useSiteImages,
  uploadSiteImageFile,
  SITE_IMAGE_META,
  type SiteImageSlot,
} from "@/lib/site-images";
import {
  listUsers,
  setUserRole,
  deleteUser,
  setUserDisabled,
  updateUserProfile,
} from "@/lib/admin-users.functions";
import { useServerFn } from "@tanstack/react-start";
import { ImageCropper } from "@/components/ImageCropper";
import { TEAM_LOGOS, f1Teams, basketballTeams, cricketTeams, footballTeams, worldCupTeams, allLogoEntries } from "@/lib/logos";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Veloce Wear" }, { name: "robots", content: "noindex" }] }),
  component: () => (
    <SiteChrome>
      <AdminGate />
    </SiteChrome>
  ),
});

function AdminGate() {
  const { isAdmin } = useShop();
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <div className="text-[10px] uppercase tracking-[0.28em] text-brand">Restricted</div>
        <h1 className="mt-2 font-display text-3xl font-bold">Admin sign-in required</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This area is only visible to authorised operators.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-none bg-black px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white"
        >
          Sign in
        </Link>
      </div>
    );
  }
  return <Admin />;
}

type Tab =
  "products" | "inventory" | "orders" | "users" | "images" | "categories" | "drops" | "hotSelling";

function Admin() {
  const [tab, setTab] = useState<Tab>("products");
  const { products } = useCatalog();

  return (
    <div className="mx-auto max-w-7xl px-6 pt-4">
      <div className="flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.28em] text-brand">Atelier control</div>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">Admin Panel</h1>
        <p className="text-xs text-muted-foreground">
          {products.length} products live. Changes apply globally.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-gray-300 pb-2">
        <TabBtn
          active={tab === "products"}
          onClick={() => setTab("products")}
          icon={<Package className="h-3.5 w-3.5" />}
        >
          Products
        </TabBtn>
        <TabBtn
          active={tab === "inventory"}
          onClick={() => setTab("inventory")}
          icon={<Boxes className="h-3.5 w-3.5" />}
        >
          Inventory
        </TabBtn>
        <TabBtn
          active={tab === "orders"}
          onClick={() => setTab("orders")}
          icon={<ClipboardList className="h-3.5 w-3.5" />}
        >
          Orders
        </TabBtn>
        <TabBtn
          active={tab === "users"}
          onClick={() => setTab("users")}
          icon={<Users className="h-3.5 w-3.5" />}
        >
          Users
        </TabBtn>
        <TabBtn
          active={tab === "images"}
          onClick={() => setTab("images")}
          icon={<ImageIcon className="h-3.5 w-3.5" />}
        >
          Site Images
        </TabBtn>
        <TabBtn
          active={tab === "categories"}
          onClick={() => setTab("categories")}
          icon={<LayoutGrid className="h-3.5 w-3.5" />}
        >
          Categories
        </TabBtn>
        <TabBtn
          active={tab === "drops"}
          onClick={() => setTab("drops")}
          icon={<Timer className="h-3.5 w-3.5" />}
        >
          Schedules
        </TabBtn>
        <TabBtn
          active={tab === "hotSelling"}
          onClick={() => setTab("hotSelling")}
          icon={<Package className="h-3.5 w-3.5" />}
        >
          Hot Selling
        </TabBtn>
      </div>

      <div className="mt-8">
        {tab === "products" && <ProductsTab />}
        {tab === "inventory" && <InventoryTab />}
        {tab === "orders" && <OrdersTab />}
        {tab === "users" && <UsersTab />}
        {tab === "images" && <SiteImagesTab />}
        {tab === "categories" && <CategoriesTab />}
        {tab === "drops" && <DropsTab />}
        {tab === "hotSelling" && <HotSellingTab />}
      </div>
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-none px-6 py-3 text-[13px] font-bold uppercase tracking-widest transition ${active ? "bg-black text-white" : "border border-gray-300 text-black hover:border-black hover:bg-gray-50"}`}
    >
      {icon}
      {children}
    </button>
  );
}

/* ---------- PRODUCTS TAB ---------- */
function ProductsTab() {
  const { products, updateProduct, addProduct, removeProduct } = useCatalog();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const searchOptions = useMemo(() => {
    let list = allLogoEntries;
    if (cat === "f1") list = f1Teams;
    else if (cat === "basketball") list = basketballTeams;
    else if (cat === "cricket") list = cricketTeams;
    else if (cat === "football" || cat === "worldcup") list = [...footballTeams, ...worldCupTeams];

    if (!q) return [];
    return list.filter(([t]) => t.toLowerCase().includes(q.toLowerCase()));
  }, [cat, q]);

  const list = useMemo(() => {
    return products.filter((p) => {
      if (cat !== "all" && p.category !== cat) return false;
      if (
        q &&
        !(
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.team.toLowerCase().includes(q.toLowerCase())
        )
      )
        return false;
      return true;
    });
  }, [products, q, cat]);

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-none bg-black px-6 py-3 text-[13px] font-bold uppercase tracking-widest text-white hover:bg-gray-900 transition-colors"
        >
          <Plus className="h-4 w-4" /> New
        </button>
      </div>

      {adding && (
        <NewProductRow
          onSave={async (p) => {
            await addProduct(p);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative w-80">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => { if (q) setSearchOpen(true); }}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            placeholder="Search name or team"
            className="w-full rounded-none border border-gray-300 bg-white py-3 pl-12 pr-4 text-[14px] text-black outline-none focus:border-black transition-colors"
          />
          {searchOpen && searchOptions.length > 0 && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-none border border-gray-300 bg-white shadow-lg">
              {searchOptions.map(([t, logo]) => (
                <div
                  key={t}
                  onMouseDown={(e) => { e.preventDefault(); setQ(t); setSearchOpen(false); }}
                  className="flex cursor-pointer items-center gap-3 px-4 py-3 text-[14px] hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  <img src={logo} alt="" className="h-6 w-6 object-contain" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value as Category | "all")}
          className="rounded-none border border-gray-300 bg-white px-4 py-3 text-[14px] text-black outline-none focus:border-black transition-colors"
        >
          <option value="all">All categories</option>
          <option value="football">Football</option>
          <option value="f1">Formula 1</option>
          <option value="worldcup">World Cup</option>
          <option value="basketball">Basketball</option>
          <option value="cricket">Cricket</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      <div className="mt-6 rounded-none border border-gray-300">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id} className="border-t border-border/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="h-10 w-8 rounded object-cover" />
                    <div className="min-w-0">
                      <div className="truncate font-medium">{p.name}</div>
                      <div className="text-[10px] text-muted-foreground">{p.team}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {CATEGORY_LABEL[p.category]}
                  
                  {p.series ? ` · Legends` : ""}
                </td>
                <td className="px-4 py-3 text-right">
                  <input
                    type="number"
                    value={p.price}
                    onChange={(e) => updateProduct(p.id, { price: Number(e.target.value) })}
                    className="w-24 rounded border border-gray-300 bg-transparent px-2 py-1 text-right font-mono text-xs"
                  />
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditing(p.id)}
                      className="text-muted-foreground hover:text-black flex items-center gap-1 text-xs font-semibold"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={() => confirm(`Remove ${p.name}?`) && removeProduct(p.id)}
                      className="text-muted-foreground hover:text-brand flex items-center gap-1 text-xs font-semibold"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-xs text-muted-foreground">
                  No products match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing &&
        (() => {
          const p = products.find((x) => x.id === editing);
          if (!p) return null;
          return (
            <EditProductDrawer
              product={p}
              onClose={() => setEditing(null)}
              onSave={async (patch) => {
                await updateProduct(p.id, patch);
                setEditing(null);
              }}
            />
          );
        })()}
    </>
  );
}

function EditProductDrawer({
  product,
  onClose,
  onSave,
}: {
  product: Product;
  onClose: () => void;
  onSave: (patch: Partial<Product>) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [f, setF] = useState({
    name: product.name,
    team: product.team,
    driver: product.driver || "",
    player: product.player || "",
    tag: product.tag,
    price: product.price,
    compareAt: product.compareAt ?? 0,
    stock: product.stock,
    badge: product.badge ?? "",
    material: product.material,
    description: product.description,
    colors: product.colors.join(", "),
    sizes: product.sizes.join(", "),
    images: [...product.images],
    rating: product.rating ?? 4.8,
    reviews: product.reviews ?? 0,
    stockBySize: product.stockBySize || {},
    category: product.category,
  });
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);

  const handleCropComplete = (croppedImageUrl: string) => {
    setF((s) => ({ ...s, images: [...s.images, croppedImageUrl] }));
    setCropImageUrl(null);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-background/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-lg overflow-y-auto border-l border-gray-300 bg-background p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-brand">Editing</div>
            <div className="font-display text-xl font-semibold">{product.name}</div>
          </div>
          <button onClick={onClose} className="rounded-none border border-gray-300 p-2">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 space-y-4 text-sm">
          <Field label="Name">
            <input
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Category">
              <select
                value={f.category}
                onChange={(e) => setF({ ...f, category: e.target.value as any })}
                className={inputCls}
              >
                <option value="football">Football</option>
                <option value="f1">Formula 1</option>
                <option value="worldcup">World Cup</option>
                <option value="basketball">Basketball</option>
                <option value="cricket">Cricket</option>
                <option value="accessories">Accessories</option>
              </select>
            </Field>
            {f.category !== "accessories" && (
              <>
                <Field label="Team">
                  <TeamCombobox
                    value={f.team}
                    onChange={(v) => setF({ ...f, team: v })}
                    category={f.category}
                  />
                </Field>
                <Field label={f.category === "f1" ? "Driver Name" : "Player Name"}>
                  <input
                    value={f.category === "f1" ? f.driver : f.player}
                    onChange={(e) => {
                      if (f.category === "f1") {
                        setF({ ...f, driver: e.target.value });
                      } else {
                        setF({ ...f, player: e.target.value });
                      }
                    }}
                    className={inputCls}
                    placeholder={`Optional ${f.category === "f1" ? "driver" : "player"} name`}
                  />
                </Field>
              </>
            )}
            <Field label="Tag">
              <input
                value={f.tag}
                onChange={(e) => setF({ ...f, tag: e.target.value.toUpperCase() })}
                className={`${inputCls} font-bold uppercase`}
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Field label="Price ₹">
              <input
                type="number"
                value={f.price ?? ""}
                onChange={(e) => setF({ ...f, price: e.target.value === "" ? ("" as any) : Number(e.target.value) })}
                className={inputCls}
              />
            </Field>
            <Field label="Compare At ₹">
              <input
                type="number"
                value={f.compareAt ?? ""}
                onChange={(e) => setF({ ...f, compareAt: e.target.value === "" ? ("" as any) : Number(e.target.value) })}
                className={inputCls}
              />
            </Field>
            <Field label="Stock">
              <input
                type="number"
                value={f.stock ?? ""}
                onChange={(e) => setF({ ...f, stock: e.target.value === "" ? ("" as any) : Number(e.target.value) })}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {f.category !== "accessories" ? (
              <Field label="Sizes (comma separated)">
                <input
                  value={f.sizes}
                  onChange={(e) => setF({ ...f, sizes: e.target.value })}
                  className={inputCls}
                />
              </Field>
            ) : (
              <div />
            )}
            <Field label="Colors (comma separated)">
              <input
                value={f.colors}
                onChange={(e) => setF({ ...f, colors: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
          
          {f.sizes && (
            <div className="rounded-lg border border-border/50 p-4 bg-muted/20">
              <div className="mb-3 text-[10px] uppercase tracking-[0.2em] font-bold text-foreground">Stock by Size</div>
              <div className="grid grid-cols-2 gap-2">
                {f.sizes.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                  <label key={s} className="flex items-center gap-2 text-xs font-mono">
                    <span className="w-8 text-right font-bold text-muted-foreground">{s}</span>
                    <input
                      type="number"
                      value={f.stockBySize[s] ?? 0}
                      onChange={(e) => setF(prev => ({
                        ...prev,
                        stockBySize: {
                          ...prev.stockBySize,
                          [s]: Number(e.target.value)
                        }
                      }))}
                      className={inputCls}
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          <Field label="Material">
            <input
              value={f.material}
              onChange={(e) => setF({ ...f, material: e.target.value })}
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Badge">
              <input
                value={f.badge}
                onChange={(e) => setF({ ...f, badge: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Rating (0-5)">
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={f.rating ?? ""}
                onChange={(e) => setF({ ...f, rating: e.target.value === "" ? ("" as any) : Number(e.target.value) })}
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              rows={4}
              value={f.description}
              onChange={(e) => setF({ ...f, description: e.target.value })}
              className={inputCls}
            />
          </Field>

          <div>
            <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Images (Drag or use buttons to reorder)
            </div>
            <div className="flex flex-wrap gap-2">
              {f.images.map((u, i) => (
                <div key={i} className="relative group">
                  <img src={u} alt="" className="h-24 w-20 shrink-0 rounded object-cover" />
                  <button
                    type="button"
                    onClick={() => setF(s => ({ ...s, images: s.images.filter((_, idx) => idx !== i) }))}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-1 flex w-full justify-between px-1 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100">
                    <button
                      type="button"
                      onClick={() => {
                        if (i === 0) return;
                        const imgs = [...f.images];
                        [imgs[i - 1], imgs[i]] = [imgs[i], imgs[i - 1]];
                        setF(s => ({ ...s, images: imgs }));
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded bg-black/70 text-white hover:bg-black"
                    >
                      <span className="text-[10px]">◀</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (i === f.images.length - 1) return;
                        const imgs = [...f.images];
                        [imgs[i], imgs[i + 1]] = [imgs[i + 1], imgs[i]];
                        setF(s => ({ ...s, images: imgs }));
                      }}
                      className="flex h-6 w-6 items-center justify-center rounded bg-black/70 text-white hover:bg-black"
                    >
                      <span className="text-[10px]">▶</span>
                    </button>
                  </div>
                </div>
              ))}
              <label className="flex h-24 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded border border-dashed border-gray-300 text-[9px] uppercase tracking-[0.18em] text-muted-foreground hover:border-black hover:text-black">
                <Plus className="h-4 w-4" /> Upload
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (e) => {
                    const files = Array.from(e.target.files ?? []);
                    if (files.length > 0) {
                      const url = await fileToDataUrl(files[0]);
                      setCropImageUrl(url);
                    }
                    e.target.value = "";
                  }}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  const u = prompt("Paste an image URL");
                  if (u) setF(s => ({ ...s, images: [...s.images, u.trim()] }));
                }}
                className="flex h-24 w-20 flex-col items-center justify-center gap-1 rounded border border-dashed border-gray-300 text-[9px] uppercase tracking-[0.18em] text-muted-foreground hover:border-black hover:text-black"
              >
                <ImageIcon className="h-4 w-4" /> URL
              </button>
            </div>
          </div>
        </div>
        {err && (
          <div className="mt-4 rounded-none border border-brand/40 bg-brand/10 px-3 py-2 text-xs text-brand">
            {err}
          </div>
        )}
        <div className="mt-6 flex gap-2">
          <button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              setErr(null);
              try {
                await onSave({
                  name: f.name,
                  team: f.team,
                  tag: f.tag,
                  player: f.player || undefined,
                  price: Number(f.price) || 0,
                  compareAt: f.compareAt ? Number(f.compareAt) : undefined,
                  stock: Number(f.stock) || 0,
                  badge: f.badge || undefined,
                  material: f.material,
                  description: f.description,
                  colors: f.colors
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  sizes: f.category === "accessories" ? ["One Size"] : f.sizes
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                  images: f.images
                    .map((s) => s.trim())
                    .filter(Boolean),
                  rating: f.rating,
                  reviews: f.reviews,
                  stockBySize: f.stockBySize,
                  category: f.category,
                  driver: f.driver || undefined,
                });
                onClose();
              } catch (e) {
                setErr(e instanceof Error ? e.message : "Failed to save changes");
              } finally {
                setLoading(false);
              }
            }}
            className="flex-1 rounded-none bg-black py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save changes"}
          </button>
          <button
            onClick={onClose}
            className="rounded-none border border-gray-300 px-5 py-3 text-xs uppercase tracking-[0.24em]"
          >
            Cancel
          </button>
        </div>
      </div>
      {cropImageUrl && (
        <ImageCropper
          imageUrl={cropImageUrl}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImageUrl(null)}
        />
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-none border border-gray-300 bg-white px-4 py-3 text-[14px] text-black outline-none focus:border-black transition-colors";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </div>
      {children}
    </label>
  );
}

/* ---------- SITE IMAGES TAB ---------- */
function SiteImagesTab() {
  const { get, getDefault, set, overrides, reset } = useSiteImages();
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-xs text-muted-foreground">
          Replace any homepage or editorial image with your own. Paste an image URL — hosted
          uploads, CDN, or a data URL. Leave blank to restore the shipped default. Product images
          are managed per-product from the Products tab.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-none border border-gray-300 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-brand"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset all
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {SITE_IMAGE_META.map(({ slot, label, description }) => (
          <SiteImageRow
            key={slot}
            slot={slot}
            label={label}
            description={description}
            current={get(slot)}
            defaultUrl={getDefault(slot)}
            overridden={!!overrides[slot]}
            onSave={(url) => set(slot, url)}
          />
        ))}
      </div>
    </>
  );
}

function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  return (
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".ogg") ||
    url.includes("player.vimeo.com") ||
    url.includes("youtube.com/embed") ||
    url.startsWith("data:video/")
  );
}

function SiteImageRow({
  slot,
  label,
  description,
  current,
  defaultUrl,
  overridden,
  onSave,
}: {
  slot: SiteImageSlot;
  label: string;
  description: string;
  current: string;
  defaultUrl: string;
  overridden: boolean;
  onSave: (url: string | null) => void;
}) {
  const [draft, setDraft] = useState(overridden ? current : "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);

  const onFile = async (f: File | null) => {
    if (!f) return;
    try {
      const dataUrl = await fileToDataUrl(f);
      setCropImageUrl(dataUrl);
    } catch (err: any) {
      setUploadError(err.message || "Failed to read file");
    }
  };

  const handleCropComplete = async (croppedDataUrl: string) => {
    setCropImageUrl(null);
    setUploading(true);
    setUploadError(null);
    try {
      const res = await fetch(croppedDataUrl);
      const blob = await res.blob();
      const file = new File([blob], "cropped.webp", { type: "image/webp" });
      const publicUrl = await uploadSiteImageFile(slot, file);
      setDraft(publicUrl);
      onSave(publicUrl);
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
      console.error("File upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-none border border-gray-300 p-4">
      <div className="flex items-start gap-4">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-none border border-border/40 bg-surface">
          {isVideoUrl(current) ? (
            <video
              src={current}
              muted
              autoPlay
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          ) : current ? (
            <img src={current} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground/50">
              Empty
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="font-display text-sm font-semibold">{label}</div>
            {overridden && (
              <span className="rounded-none border border-brand/50 bg-brand/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-brand">
                Custom
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[11px] text-muted-foreground">{description}</div>
          <div className="mt-0.5 font-mono text-[10px] text-muted-foreground/70">slot: {slot}</div>
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="https://… or paste an image URL"
          className={inputCls + " font-mono text-xs"}
        />
        {uploadError && <div className="text-xs text-red-400">{uploadError}</div>}
        <div className="flex flex-wrap items-center gap-2">
          <label
            className={`inline-flex cursor-pointer items-center gap-2 rounded-none border border-gray-300 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-black ${uploading ? "pointer-events-none opacity-50" : ""}`}
          >
            {uploading ? "Uploading…" : "Upload file"}
            <input
              type="file"
              accept="image/*,video/*"
              hidden
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              disabled={uploading}
            />
          </label>
          <button
            onClick={() => onSave(draft || null)}
            className="rounded-none bg-black px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-white"
          >
            Save
          </button>
          <button
            onClick={() => {
              setDraft("");
              onSave(null);
            }}
            disabled={!overridden}
            className="rounded-none border border-gray-300 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground disabled:opacity-40"
          >
            Reset
          </button>
          <a
            href={defaultUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-auto text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-black"
          >
            Default ↗
          </a>
        </div>
      </div>
      {cropImageUrl && (
        <ImageCropper
          imageUrl={cropImageUrl}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImageUrl(null)}
        />
      )}
    </div>
  );
}

/* ---------- ORDERS TAB ---------- */
const STATUS_STYLE: Record<OrderStatus, string> = {
  awaiting_payment: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40",
  pending: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  processing: "bg-sky-500/20 text-sky-300 border-sky-500/40",
  shipped: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
  delivered: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  cancelled: "bg-rose-500/20 text-rose-300 border-rose-500/40",
};
function OrdersTab() {
  const { orders, updateOrderStatus, removeOrder } = useShop();
  const { getById } = useCatalog();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const list = orders.filter((o) => filter === "all" || o.status === filter);
  const stats: Record<OrderStatus | "all", number> = {
    all: orders.length,
    awaiting_payment: orders.filter((o) => o.status === "awaiting_payment").length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };
  const statuses: (OrderStatus | "all")[] = [
    "all",
    "awaiting_payment",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-none border px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] ${filter === s ? "border-black bg-black text-white" : "border-gray-300 text-muted-foreground"}`}
          >
            {s} · {stats[s]}
          </button>
        ))}
      </div>

      {list.length === 0 && (
        <div className="mt-10 rounded-none border border-dashed border-gray-300 p-10 text-center text-sm text-muted-foreground">
          No orders yet. Place one from the storefront and it will appear here.
        </div>
      )}

      <div className="mt-6 grid gap-3">
        {list.map((o) => (
          <div key={o.id} className="rounded-none border border-gray-300 p-4 sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">{formatOrderId(o.id)}</span>
                  <span
                    className={`rounded-none border px-2 py-0.5 text-[9px] uppercase tracking-[0.22em] ${STATUS_STYLE[o.status]}`}
                  >
                    {o.status}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {new Date(o.createdAt).toLocaleString()} · {o.customer.name || "—"} ·{" "}
                  {o.customer.email || "no email"} · {o.customer.phone || "no phone"}
                  <br />
                  {o.customer.address || "—"}, {o.customer.city || "—"}, {o.customer.state || "—"} -{" "}
                  {o.customer.pincode || "—"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={o.status}
                  onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                  className="rounded-none border border-gray-300 bg-transparent px-3 py-1.5 text-[11px] uppercase tracking-[0.2em]"
                >
                  <option value="awaiting_payment">Awaiting payment</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => confirm(`Delete order ${formatOrderId(o.id)}?`) && removeOrder(o.id)}
                  className="text-muted-foreground hover:text-brand"
                  aria-label="Delete order"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-3 grid gap-2 border-t border-border/40 pt-3">
              {o.items.map((it, i) => {
                const p = getById(it.id);
                return (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    {p?.images[0] && (
                      <img src={p.images[0]} alt="" className="h-10 w-8 rounded object-cover" />
                    )}
                    <div className="min-w-0 flex-1 truncate">
                      <div>
                        {p?.name ?? it.id} · {it.size} · {it.color}
                      </div>
                      {(it.customName || it.customNumber) && (
                        <div className="font-mono text-[10px] text-brand uppercase tracking-wider font-semibold">
                          Print: {it.customName || "NO NAME"} #{it.customNumber || "00"}
                        </div>
                      )}
                    </div>
                    <div className="text-muted-foreground">× {it.qty}</div>
                    <div className="w-20 text-right font-mono">
                      {formatINR((p?.price ?? 0) * it.qty)}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex justify-end gap-6 border-t border-border/40 pt-3 text-xs">
              <div>
                <span className="text-muted-foreground">Subtotal</span>{" "}
                <span className="font-mono">{formatINR(o.subtotal)}</span>
              </div>
              {o.discount > 0 && (
                <div className="text-brand">
                  <span>B2G1</span> <span className="font-mono">−{formatINR(o.discount)}</span>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Ship</span>{" "}
                <span className="font-mono">
                  {o.shipping === 0 ? "Free" : formatINR(o.shipping)}
                </span>
              </div>

              <div className="font-semibold">
                <span>Total</span> <span className="font-mono">{formatINR(o.total)}</span>
              </div>
            </div>
            {o.payment?.method === "upi" && (
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-none border border-border/40 bg-gray-50 px-3 py-2 text-[11px]">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="uppercase tracking-[0.22em] text-muted-foreground">
                    {o.payment.mode === "cod" ? "COD (₹80 Prepaid)" : "UPI"}
                  </span>
                  <span>
                    <span className="text-muted-foreground">VPA</span>{" "}
                    <span className="font-mono">{o.payment.vpa}</span>
                  </span>
                  <span>
                    <span className="text-muted-foreground">UTR</span>{" "}
                    <span className="font-mono">{o.payment.txnId}</span>
                  </span>
                  <span>
                    <span className="text-muted-foreground">Paid</span>{" "}
                    <span className="font-mono">{formatINR(o.payment.paidNow ?? o.total)}</span>
                  </span>
                  {(o.payment.codDue ?? 0) > 0 && (
                    <span className="text-amber-300">
                      <span className="text-muted-foreground">COD due</span>{" "}
                      <span className="font-mono">{formatINR(o.payment.codDue)}</span>
                    </span>
                  )}
                </div>
                {o.status === "awaiting_payment" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateOrderStatus(o.id, "processing")}
                      className="rounded-none border border-emerald-500/50 bg-emerald-500/15 px-3 py-1 uppercase tracking-[0.2em] text-emerald-300 hover:bg-emerald-500/25"
                    >
                      Mark paid
                    </button>
                    <button
                      onClick={() => updateOrderStatus(o.id, "cancelled")}
                      className="rounded-none border border-rose-500/50 bg-rose-500/10 px-3 py-1 uppercase tracking-[0.2em] text-rose-300 hover:bg-rose-500/20"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function TeamCombobox({ value, onChange, category }: { value: string, onChange: (v: string) => void, category: Category }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  const options = useMemo(() => {
    let list = allLogoEntries;
    if (category === "f1") list = f1Teams;
    else if (category === "basketball") list = basketballTeams;
    else if (category === "cricket") list = cricketTeams;
    else if (category === "football" || category === "worldcup") list = [...footballTeams, ...worldCupTeams];

    if (!search) return list;
    return list.filter(([t]) => t.toLowerCase().includes(search.toLowerCase()));
  }, [category, search]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={open ? search : value}
        onChange={(e) => {
          setSearch(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => { setOpen(true); setSearch(value); }}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder="Type or select a team..."
        className="w-full rounded-none border border-gray-300 bg-white px-4 py-3 text-[14px] text-black outline-none focus:border-black transition-colors"
      />
      {open && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-none border border-gray-300 bg-white shadow-lg">
          {options.length === 0 ? (
            <div className="p-4 text-[13px] text-gray-500 text-center">No matching logos. You can still use this custom name.</div>
          ) : (
            options.map(([t, logo]) => (
              <div
                key={t}
                onMouseDown={(e) => { e.preventDefault(); onChange(t); setOpen(false); }}
                className="flex cursor-pointer items-center gap-3 px-4 py-3 text-[14px] hover:bg-gray-50 border-b border-gray-100 last:border-0"
              >
                <img src={logo} alt="" className="h-6 w-6 object-contain" />
                <span>{t}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function NewProductRow({
  onSave,
  onCancel,
}: {
  onSave: (p: Product) => Promise<void>;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [f, setF] = useState({
    id: "",
    name: "",
    team: "",
    driver: "",
    player: "",
    category: "football" as Category,
    
    series: "" as "" | "legends",
    price: "" as any,
    compareAt: [4599, 5999, 3599, 3499, 5499, 4499, 3999, 4999][Math.floor(Math.random() * 8)],
    stock: 10 + Math.floor(Math.random() * 41),
    tag: "FOOTBALL",
    badge: "VELOCE",
    material: "Premium cotton",
    description: "",
    colors: "Default",
    sizes: "S, M, L, XL",
    images: [] as string[],
    rating: Number((4.0 + Math.random() * 1).toFixed(1)),
    reviews: Math.floor(Math.random() * 200) + 10,
  });
  const [cropImageUrl, setCropImageUrl] = useState<string | null>(null);

  const addFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    // Just handle the first file for cropping to keep UX simple
    const url = await fileToDataUrl(files[0]);
    setCropImageUrl(url);
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setF((s) => ({ ...s, images: [...s.images, croppedImageUrl] }));
    setCropImageUrl(null);
  };

  const removeImg = (i: number) =>
    setF((s) => ({ ...s, images: s.images.filter((_, idx) => idx !== i) }));
  const addUrl = () => {
    const u = prompt("Paste an image URL");
    if (u) setF((s) => ({ ...s, images: [...s.images, u.trim()] }));
  };
  const slug = (v: string) =>
    v
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return (
    <div className="mt-4 rounded-none border border-brand/40 bg-gray-50 p-5">
      <div className="mb-3 text-[10px] uppercase tracking-[0.24em] text-brand">New product</div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {/* ID is auto-generated on save */}
        <Field label="Name">
          <input
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
            className={inputCls}
          />
        </Field>
        {f.category !== "accessories" && (
          <Field label="Team">
            <TeamCombobox
              value={f.team}
              onChange={(v) => setF({ ...f, team: v })}
              category={f.category}
            />
          </Field>
        )}
        <Field label="Category">
          <select
            value={f.category}
            onChange={(e) => setF({ ...f, category: e.target.value as Category, tag: e.target.value.toUpperCase() })}
            className={inputCls}
          >
            <option value="football">Football</option>
            <option value="f1">Formula 1</option>
            <option value="worldcup">World Cup</option>
            <option value="basketball">Basketball</option>
            <option value="cricket">Cricket</option>
            <option value="accessories">Accessories</option>
          </select>
        </Field>
        
        <Field label="Special edition">
          <select
            value={f.series}
            onChange={(e) => setF({ ...f, series: e.target.value as "" | "legends" })}
            className={inputCls}
          >
            <option value="">— None —</option>
            <option value="legends">Legends Series</option>
          </select>
        </Field>
        {f.category !== "accessories" && (
          <Field label={f.category === "f1" ? "Driver Name" : "Player Name"}>
            <input
              value={f.category === "f1" ? f.driver : f.player}
              onChange={(e) => {
                if (f.category === "f1") {
                  setF({ ...f, driver: e.target.value });
                } else {
                  setF({ ...f, player: e.target.value });
                }
              }}
              className={inputCls}
              placeholder={`Optional ${f.category === "f1" ? "driver" : "player"} name`}
            />
          </Field>
        )}
        <Field label="Tag">
          <input
            value={f.tag}
            onChange={(e) => setF({ ...f, tag: e.target.value.toUpperCase() })}
            className={`${inputCls} font-bold uppercase`}
          />
        </Field>
        <Field label="Badge">
          <input
            value={f.badge}
            onChange={(e) => setF({ ...f, badge: e.target.value })}
            placeholder="e.g. New, Limited"
            className={inputCls}
          />
        </Field>
        <Field label="Price ₹">
          <input
            type="number"
            value={f.price ?? ""}
            onChange={(e) => setF({ ...f, price: e.target.value === "" ? ("" as any) : Number(e.target.value) })}
            className={inputCls}
          />
        </Field>
        <Field label="Compare ₹">
          <input
            type="number"
            value={f.compareAt ?? ""}
            onChange={(e) => setF({ ...f, compareAt: e.target.value === "" ? ("" as any) : Number(e.target.value) })}
            className={inputCls}
          />
        </Field>
        <Field label="Stock">
          <input
            type="number"
            value={f.stock ?? ""}
            onChange={(e) => setF({ ...f, stock: e.target.value === "" ? ("" as any) : Number(e.target.value) })}
            className={inputCls}
          />
        </Field>
        <Field label="Rating (0-5)">
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={f.rating ?? ""}
            onChange={(e) => setF({ ...f, rating: e.target.value === "" ? ("" as any) : Number(e.target.value) })}
            className={inputCls}
          />
        </Field>
        <Field label="Reviews Count">
          <input
            type="number"
            min="0"
            value={f.reviews ?? ""}
            onChange={(e) => setF({ ...f, reviews: e.target.value === "" ? ("" as any) : Number(e.target.value) })}
            className={inputCls}
          />
        </Field>
        <Field label="Material">
          <input
            value={f.material}
            onChange={(e) => setF({ ...f, material: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Colors (comma-sep)">
          <input
            value={f.colors}
            onChange={(e) => setF({ ...f, colors: e.target.value })}
            className={inputCls}
          />
        </Field>
        <Field label="Sizes (comma-sep)">
          <input
            value={f.sizes}
            onChange={(e) => setF({ ...f, sizes: e.target.value })}
            className={inputCls}
          />
        </Field>
      </div>
      <div className="mt-3">
        <Field label="Description">
          <textarea
            rows={3}
            value={f.description}
            onChange={(e) => setF({ ...f, description: e.target.value })}
            className={inputCls}
          />
        </Field>
      </div>
      <div className="mt-3">
        <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          Images
        </div>
        <div className="flex flex-wrap gap-2">
          {f.images.map((u, i) => (
            <div key={i} className="relative">
              <img src={u} alt="" className="h-20 w-16 rounded object-cover" />
              <button
                onClick={() => removeImg(i)}
                className="absolute -right-1 -top-1 rounded-none bg-background/90 p-0.5 shadow"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="flex h-20 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded border border-dashed border-gray-300 text-[9px] uppercase tracking-[0.18em] text-muted-foreground hover:border-black hover:text-black">
            <Plus className="h-4 w-4" /> Upload
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
          <button
            type="button"
            onClick={addUrl}
            className="flex h-20 w-16 flex-col items-center justify-center gap-1 rounded border border-dashed border-gray-300 text-[9px] uppercase tracking-[0.18em] text-muted-foreground hover:border-black hover:text-black"
          >
            <ImageIcon className="h-4 w-4" /> URL
          </button>
        </div>
      </div>
      {cropImageUrl && (
        <ImageCropper
          imageUrl={cropImageUrl}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImageUrl(null)}
        />
      )}
      {err && (
        <div className="mt-3 rounded-none border border-brand/40 bg-brand/10 px-3 py-2 text-xs text-brand">
          {err}
        </div>
      )}
      <div className="mt-4 flex gap-2">
        <button
          disabled={loading}
          onClick={async () => {
            const id = f.id || slug(f.name);
            if (!id || !f.name || (f.category !== "accessories" && !f.team)) return alert(f.category === "accessories" ? "Name is required" : "Name and team are required");
            if (f.images.length === 0) return alert("Add at least one image");
            setLoading(true);
            setErr(null);
            try {
              const generatedId = f.id || slug(f.name);
              await onSave({
                id: generatedId,
                name: f.name,
                category: f.category,
                
                series: f.series || undefined,
                team: f.team,
                driver: f.category === "f1" ? f.driver || undefined : undefined,
                player: f.category !== "f1" ? f.player || undefined : undefined,
                tag: f.tag,
                price: Number(f.price) || 0,
                compareAt: f.compareAt ? Number(f.compareAt) : undefined,
                stock: Number(f.stock) || 0,
                badge: f.badge || undefined,
                colors: f.colors
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
                sizes: f.sizes
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
                images: f.images,
                description: f.description || "Custom piece added via Admin.",
                material: f.material || "—",
                rating: f.rating,
                reviews: f.reviews,
              });
            } catch (e) {
              setErr(e instanceof Error ? e.message : "Failed to save product");
            } finally {
              setLoading(false);
            }
          }}
          className="rounded-none bg-black px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-white disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save product"}
        </button>
        <button
          onClick={onCancel}
          className="rounded-none border border-gray-300 px-5 py-2 text-[11px] uppercase tracking-[0.22em]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result || ""));
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

/* ---------- INVENTORY TAB ---------- */
function InventoryTab() {
  const { products, updateProduct } = useCatalog();
  const low = products.filter((p) => p.stock < 10);

  const getSizeStock = (p: Product, size: string): number => {
    if (p.stockBySize && p.stockBySize[size] !== undefined) return p.stockBySize[size];
    // Fallback: distribute total stock evenly across sizes if stockBySize not set
    return p.sizes.length > 0 ? Math.floor(p.stock / p.sizes.length) : p.stock;
  };

  const updateSizeStock = (p: Product, size: string, newVal: number) => {
    const current = p.stockBySize || {};
    // Initialize all sizes if first time
    const updated: Record<string, number> = {};
    for (const s of p.sizes) {
      updated[s] = current[s] !== undefined ? current[s] : getSizeStock(p, s);
    }
    updated[size] = Math.max(0, newVal);
    const totalStock = Object.values(updated).reduce((a, b) => a + b, 0);
    updateProduct(p.id, { stockBySize: updated, stock: totalStock }).catch((err) => {
      alert(
        "Failed to update stock: " +
          err.message +
          "\n\nMake sure 'stock_by_size' column (type JSONB) exists in Supabase products table.",
      );
    });
  };

  return (
    <>
      {low.length > 0 && (
        <div className="mb-6 flex items-start gap-3 rounded-none border border-brand/40 bg-brand/10 p-4 text-xs">
          <AlertCircle className="h-4 w-4 text-brand" />
          <div>
            <b className="text-brand">Low stock alert · {low.length} items</b>
            <div className="text-muted-foreground">{low.map((p) => p.name).join(" · ")}</div>
          </div>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.id}
            className={`rounded-none border p-4 ${p.stock < 10 ? "border-brand/60" : "border-gray-300"}`}
          >
            <div className="flex items-start gap-3">
              <img src={p.images[0]} alt="" className="h-14 w-11 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{p.name}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {CATEGORY_LABEL[p.category]}
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs">{formatINR(p.price)}</div>
                <div className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Total: <span className="font-mono text-black">{p.stock}</span>
                </div>
              </div>
            </div>
            {p.sizes.length > 0 ? (
              <div className="mt-3 space-y-1.5">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Stock by Size
                </div>
                <div className="grid gap-1.5">
                  {p.sizes.map((size) => {
                    const sizeVal = getSizeStock(p, size);
                    return (
                      <div
                        key={size}
                        className="flex items-center justify-between rounded-none border border-border/40 px-3 py-1.5"
                      >
                        <span className="text-xs font-medium w-10">{size}</span>
                        <div className="inline-flex items-center rounded-none border border-gray-300">
                          <button
                            onClick={() => updateSizeStock(p, size, sizeVal - 1)}
                            className="px-2.5 py-0.5 text-sm"
                          >
                            −
                          </button>
                          <span
                            className={`w-8 text-center font-mono text-xs ${sizeVal < 5 ? "text-brand" : ""}`}
                          >
                            {sizeVal}
                          </span>
                          <button
                            onClick={() => updateSizeStock(p, size, sizeVal + 1)}
                            className="px-2.5 py-0.5 text-sm"
                          >
                            +
                          </button>
                          <button
                            onClick={() => updateSizeStock(p, size, sizeVal + 10)}
                            className="border-l border-gray-300 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em]"
                          >
                            +10
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between">
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Stock
                </div>
                <div className="inline-flex items-center rounded-none border border-gray-300">
                  <button
                    onClick={() =>
                      updateProduct(p.id, { stock: Math.max(0, p.stock - 1) }).catch((e) =>
                        alert(e.message),
                      )
                    }
                    className="px-3 py-1"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-mono text-sm">{p.stock}</span>
                  <button
                    onClick={() =>
                      updateProduct(p.id, { stock: p.stock + 1 }).catch((e) => alert(e.message))
                    }
                    className="px-3 py-1"
                  >
                    +
                  </button>
                  <button
                    onClick={() =>
                      updateProduct(p.id, { stock: p.stock + 10 }).catch((e) => alert(e.message))
                    }
                    className="border-l border-gray-300 px-3 py-1 text-[10px] uppercase tracking-[0.2em]"
                  >
                    +10
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- CATEGORIES TAB ---------- */
function CategoriesTab() {
  const { products } = useCatalog();
  const cats: Category[] = ["football", "f1", "basketball", "cricket", "worldcup"];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cats.map((c) => {
        const items = products.filter((p) => p.category === c);
        const stock = items.reduce((a, b) => a + b.stock, 0);
        return (
          <div key={c} className="rounded-none border border-gray-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-brand">Category</div>
                <div className="mt-1 font-display text-2xl font-semibold">{CATEGORY_LABEL[c]}</div>
              </div>
              <div className="text-right">
                <div className="font-mono text-3xl">{items.length}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Products
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border/40 pt-4 text-xs">
              <div>
                <div className="text-muted-foreground">Units in stock</div>
                <div className="mt-1 font-mono">{stock}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Avg. price</div>
                <div className="mt-1 font-mono">
                  {items.length
                    ? formatINR(items.reduce((a, b) => a + b.price, 0) / items.length)
                    : "—"}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Teams</div>
                <div className="mt-1 font-mono">{new Set(items.map((i) => i.team)).size}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- DROPS TAB ---------- */
function toLocalInput(ts: number) {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function DropsTab() {
  const { products } = useCatalog();
  const { drops, setDrops } = useDrops();

  const update = (id: string, patch: Partial<Drop>) =>
    setDrops(drops.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const add = () =>
    setDrops([
      ...drops,
      {
        id: `drop-${Date.now()}`,
        name: "New Drop",
        eyebrow: "Capsule",
        productId: products[0]?.id ?? "",
        endsAt: Date.now() + 7 * 86400000,
      },
    ]);
  const remove = (id: string) => setDrops(drops.filter((x) => x.id !== id));

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={add}
          className="inline-flex items-center gap-2 rounded-none bg-black px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white"
        >
          <Plus className="h-3.5 w-3.5" /> New drop
        </button>
      </div>
      <div className="grid gap-4">
        {drops.map((d) => {
          const p = products.find((x) => x.id === d.productId);
          const left = d.endsAt - Date.now();
          const days = Math.max(0, Math.floor(left / 86400000));
          const hours = Math.max(0, Math.floor((left / 3600000) % 24));
          return (
            <div
              key={d.id}
              className="grid gap-4 rounded-none border border-gray-300 p-5 md:grid-cols-[1fr_auto]"
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Name
                  </label>
                  <input
                    value={d.name}
                    onChange={(e) => update(d.id, { name: e.target.value })}
                    className="mt-1 w-full rounded border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Eyebrow
                  </label>
                  <input
                    value={d.eyebrow}
                    onChange={(e) => update(d.id, { eyebrow: e.target.value })}
                    className="mt-1 w-full rounded border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Product
                  </label>
                  <select
                    value={d.productId}
                    onChange={(e) => update(d.id, { productId: e.target.value })}
                    className="mt-1 w-full rounded border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  >
                    {products.map((x) => (
                      <option key={x.id} value={x.id}>
                        {x.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    Ends at
                  </label>
                  <input
                    type="datetime-local"
                    value={toLocalInput(d.endsAt)}
                    onChange={(e) => update(d.id, { endsAt: new Date(e.target.value).getTime() })}
                    className="mt-1 w-full rounded border border-gray-300 bg-transparent px-3 py-2 text-sm"
                  />
                </div>
                <div className="sm:col-span-2 text-[11px] text-muted-foreground">
                  {p ? (
                    <>
                      Preview: <b className="text-black">{p.name}</b> · {formatINR(p.price)} ·{" "}
                      {days}d {hours}h remaining
                    </>
                  ) : (
                    <span className="text-brand">Select a product</span>
                  )}
                </div>
              </div>
              <div className="flex md:flex-col items-start gap-2">
                <button
                  onClick={() => remove(d.id)}
                  className="inline-flex items-center gap-2 rounded-none border border-gray-300 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-brand"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
/* ---------- USERS TAB ---------- */
type AdminUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  lastSignInAt: string | null;
  provider: string;
  roles: string[];
  disabled: boolean;
  fullName: string;
  phone: string;
  city: string;
  state: string;
  addressLine1: string;
  postalCode: string;
};

function UsersTab() {
  const list = useServerFn(listUsers);
  const setRole = useServerFn(setUserRole);
  const del = useServerFn(deleteUser);
  const setDisabled = useServerFn(setUserDisabled);
  const updProfile = useServerFn(updateUserProfile);

  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [editing, setEditing] = useState<AdminUser | null>(null);
  const { userId: myId, isOwner } = useShop();

  const reload = async () => {
    setErr(null);
    try {
      const data = await list();
      setUsers(data as AdminUser[]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load users");
    }
  };
  useEffect(() => {
    reload(); /* eslint-disable-next-line */
  }, []);

  const doAction = async (id: string, fn: () => Promise<unknown>) => {
    setBusy(id);
    setErr(null);
    try {
      await fn();
      await reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(null);
    }
  };

  const filtered = (users ?? []).filter((u) => {
    if (!q) return true;
    const s = q.toLowerCase();
    return u.email.toLowerCase().includes(s) || u.fullName.toLowerCase().includes(s);
  });

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search email or name"
            className="w-72 rounded-none border border-gray-300 bg-transparent py-2 pl-9 pr-4 text-xs outline-none focus:border-black"
          />
        </div>
        <button
          onClick={reload}
          className="ml-auto inline-flex items-center gap-2 rounded-none border border-gray-300 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-black"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {err && (
        <div className="mt-4 rounded-none border border-brand/40 bg-brand/10 px-3 py-2 text-xs text-brand">
          {err}
        </div>
      )}

      {users === null && !err && (
        <div className="mt-10 text-center text-xs text-muted-foreground">Loading users…</div>
      )}

      {users !== null && (
        <div className="mt-6 rounded-none border border-gray-300">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Provider</th>
                <th className="px-4 py-3 text-left">Roles</th>
                <th className="px-4 py-3 text-left">Verified</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const isAdmin = u.roles.includes("admin");
                const isMe = u.id === myId;
                const isTargetOwner = u.email === import.meta.env.VITE_OWNER_EMAIL;
                const b = busy === u.id;
                return (
                  <tr
                    key={u.id}
                    className={`border-t border-border/40 ${u.disabled ? "opacity-60" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {u.email}
                        {isMe && <span className="ml-2 text-[10px] text-brand">(you)</span>}
                      </div>
                      <div className="text-[10px] text-muted-foreground">
                        {u.fullName || "—"} · {u.city || "no city"}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs capitalize text-muted-foreground">
                      {u.provider}
                    </td>
                    <td className="px-4 py-3">
                      {isTargetOwner ? (
                        <span className="inline-flex items-center gap-1 rounded-none border border-[#ffd700]/50 bg-[#ffd700]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffd700]">
                          <Shield className="h-3 w-3" />
                          Owner
                        </span>
                      ) : isAdmin ? (
                        <span className="inline-flex items-center gap-1 rounded-none border border-brand/50 bg-brand/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand">
                          <Shield className="h-3 w-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-none border border-border bg-surface px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          <User className="h-3 w-3" />
                          Customer
                        </span>
                      )}
                      {u.disabled && (
                        <span className="ml-2 rounded-none border border-rose-500/50 bg-rose-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-rose-400">
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {u.emailVerified ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <span className="text-[10px] uppercase tracking-[0.2em] text-amber-400">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          disabled={b}
                          onClick={() => setEditing(u)}
                          className="text-muted-foreground hover:text-black disabled:opacity-40"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          disabled={b || isMe || !isOwner || isTargetOwner}
                          onClick={() =>
                            doAction(u.id, () =>
                              setRole({ data: { userId: u.id, role: "admin", grant: !isAdmin } }),
                            )
                          }
                          className={`text-muted-foreground hover:text-brand disabled:opacity-40 ${!isOwner && "opacity-40 cursor-not-allowed"}`}
                          title={!isOwner ? "Only owner can manage roles" : isAdmin ? "Revoke admin" : "Make admin"}
                        >
                          {isAdmin ? (
                            <ShieldOff className="h-4 w-4" />
                          ) : (
                            <Shield className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          disabled={b || isMe || isTargetOwner}
                          onClick={() =>
                            doAction(u.id, () =>
                              setDisabled({ data: { userId: u.id, disabled: !u.disabled } }),
                            )
                          }
                          className="text-muted-foreground hover:text-amber-400 disabled:opacity-40"
                          title={isTargetOwner ? "Cannot disable owner" : u.disabled ? "Enable account" : "Disable account"}
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                        <button
                          disabled={b || isMe || isTargetOwner}
                          onClick={() => {
                            if (confirm(`Permanently delete ${u.email}?`))
                              doAction(u.id, () => del({ data: { userId: u.id } }));
                          }}
                          className="text-muted-foreground hover:text-brand disabled:opacity-40"
                          title={isTargetOwner ? "Cannot delete owner" : "Delete account"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-muted-foreground">
                    No users match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditUserDrawer
          user={editing}
          onClose={() => setEditing(null)}
          onSave={async (patch) => {
            try {
              await updProfile({ data: { userId: editing.id, ...patch } });
              setEditing(null);
              await reload();
            } catch (e) {
              setErr(e instanceof Error ? e.message : "Save failed");
            }
          }}
        />
      )}
    </>
  );
}

function EditUserDrawer({
  user,
  onClose,
  onSave,
}: {
  user: AdminUser;
  onClose: () => void;
  onSave: (patch: {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    state: string;
    postalCode: string;
  }) => void;
}) {
  const [f, setF] = useState({
    fullName: user.fullName,
    phone: user.phone,
    addressLine1: user.addressLine1,
    city: user.city,
    state: user.state,
    postalCode: user.postalCode,
  });
  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-background/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="h-full w-full max-w-md overflow-y-auto border-l border-gray-300 bg-background p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-brand">
              Editing profile
            </div>
            <div className="font-display text-lg font-semibold">{user.email}</div>
          </div>
          <button onClick={onClose} className="rounded-none border border-gray-300 p-2">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 space-y-4 text-sm">
          <Field label="Full name">
            <input
              value={f.fullName}
              onChange={(e) => setF({ ...f, fullName: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Phone">
            <input
              value={f.phone}
              onChange={(e) => setF({ ...f, phone: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Address">
            <input
              value={f.addressLine1}
              onChange={(e) => setF({ ...f, addressLine1: e.target.value })}
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="City">
              <input
                value={f.city}
                onChange={(e) => setF({ ...f, city: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="State">
              <input
                value={f.state}
                onChange={(e) => setF({ ...f, state: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Postal code">
            <input
              value={f.postalCode}
              onChange={(e) => setF({ ...f, postalCode: e.target.value })}
              className={inputCls}
            />
          </Field>
        </div>
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => onSave(f)}
            className="flex-1 rounded-none bg-black py-3 text-xs font-semibold uppercase tracking-[0.24em] text-white"
          >
            Save changes
          </button>
          <button
            onClick={onClose}
            className="rounded-none border border-gray-300 px-5 py-3 text-xs uppercase tracking-[0.24em]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- HOT SELLING TAB ---------- */
import { useHotSelling } from "@/lib/hot-selling";

function HotSellingTab() {
  const { products } = useCatalog();
  const { hotSellingIds, setHotSellingIds } = useHotSelling();

  const selectedProducts = hotSellingIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as import("@/lib/catalog").Product[];

  const availableProducts = products.filter((p) => !hotSellingIds.includes(p.id));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-none border border-gray-300 p-6">
        <h2 className="font-display text-xl font-bold">Current Hot Selling Kits</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          These appear in the mobile app carousel (maximum 15).
        </p>
        <div className="mt-4 space-y-2">
          {selectedProducts.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-none border border-border/40 p-2 bg-gray-50"
            >
              <div className="flex items-center gap-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground w-4">{i + 1}.</span>
                {p.images[0] && <img src={p.images[0]} className="h-10 w-8 rounded object-cover" />}
                <span className="font-medium truncate max-w-[150px]">{p.name}</span>
              </div>
              <button
                onClick={() => setHotSellingIds(hotSellingIds.filter((id) => id !== p.id))}
                className="rounded-none bg-brand/10 p-2 text-brand hover:bg-brand/20 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {selectedProducts.length === 0 && (
            <div className="rounded-none border border-dashed border-gray-300 p-6 text-center text-xs text-muted-foreground">
              No kits selected. Default logic will be used.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-none border border-gray-300 p-6">
        <h2 className="font-display text-xl font-bold">Add Kits</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Select kits to feature on the homepage.
        </p>
        {selectedProducts.length >= 15 ? (
          <div className="mt-4 rounded border border-brand/50 bg-brand/10 p-3 text-xs text-brand">
            You have reached the maximum of 15 featured kits. Remove some to add others.
          </div>
        ) : (
          <div className="mt-4 h-[400px] overflow-y-auto pr-2 space-y-2">
            {availableProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-none border border-border/40 p-2"
              >
                <div className="flex items-center gap-3 text-sm">
                  {p.images[0] && (
                    <img src={p.images[0]} className="h-10 w-8 rounded object-cover" />
                  )}
                  <div className="truncate w-[180px] text-xs">
                    <div className="font-medium truncate">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground">{p.team}</div>
                  </div>
                </div>
                <button
                  onClick={() => setHotSellingIds([...hotSellingIds, p.id])}
                  className="rounded-none bg-black px-3 py-1 text-[10px] uppercase tracking-wider text-white hover:bg-black/80 transition-colors"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
