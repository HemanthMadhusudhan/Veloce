import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Heart, ShoppingBag, Truck, ShieldCheck, RotateCw, Play, Star, ChevronRight, X } from "lucide-react";
import { SiteChrome } from "@/components/chrome";
import { ProductCard } from "@/components/ProductCard";
import { CATEGORY_LABEL } from "@/lib/catalog";
import { useCatalog, getLiveProduct } from "@/lib/catalog-store";
import { formatINR } from "@/lib/format";
import { useShop } from "@/lib/store";
import { useSiteImage } from "@/lib/site-images";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => ({ id: params.id, product: getLiveProduct(params.id) ?? null }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.product ? `${loaderData.product.name} — Veloce` : "Product — Veloce" },
      { name: "description", content: loaderData?.product?.description ?? "Veloce product." },
      { property: "og:title", content: loaderData?.product?.name ?? "Veloce" },
      { property: "og:description", content: loaderData?.product?.description ?? "" },
    ],
  }),
  notFoundComponent: () => <SiteChrome><div className="mx-auto max-w-xl px-6 py-20 text-center"><h1 className="font-display text-3xl">Product not found</h1><Link to="/shop" className="mt-4 inline-block text-sm text-brand">Back to shop</Link></div></SiteChrome>,
  errorComponent: ({ error }) => <SiteChrome><div className="mx-auto max-w-xl px-6 py-20 text-center text-sm text-muted-foreground">{error.message}</div></SiteChrome>,
  component: PdpPage,
});

function PdpPage() {
  return <SiteChrome><Pdp /></SiteChrome>;
}

function Pdp() {
  const { id, product: seed } = Route.useLoaderData() as { id: string; product: import("@/lib/catalog").Product | null };
  const { getById, products } = useCatalog();
  const product = getById(id) ?? seed;
  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="font-display text-3xl">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-sm text-brand">Back to shop</Link>
      </div>
    );
  }
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const filmVideo = useSiteImage("film-video");
  const [videoOpen, setVideoOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [rot, setRot] = useState(0);
  const [spin, setSpin] = useState(false);
  const dragRef = useRef<{ x: number; r: number } | null>(null);

  const [customized, setCustomized] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");

  const wished = wishlist.includes(product.id);
  const related = useMemo(() => products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4), [product, products]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const startDrag = (e: React.PointerEvent) => { dragRef.current = { x: e.clientX, r: rot }; (e.target as HTMLElement).setPointerCapture(e.pointerId); };
  const moveDrag = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const delta = e.clientX - dragRef.current.x;
    setRot((dragRef.current.r + delta / 2) % 360);
  };
  const endDrag = () => { dragRef.current = null; };
  const frameIdx = ((Math.round(rot / 90) % 4) + 4) % 4;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          to={
            product.category === "worldcup" ? "/shop/worldcup"
            : product.category === "retro" ? "/shop/retro"
            : product.category === "f1" ? "/shop/f1"
            : "/shop/football"
          }
          className="hover:text-foreground"
        >{CATEGORY_LABEL[product.category]}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_minmax(320px,420px)]">
        <div>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* MOBILE ONLY GALLERY */}
            <div className="flex w-full overflow-x-auto snap-x snap-mandatory gap-3 pb-2 sm:hidden scrollbar-hide">
              {product.images.map((img, i) => (
                <div key={i} className="relative aspect-[4/5] w-[90%] shrink-0 snap-center overflow-hidden rounded-2xl bg-surface">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
              {product.has360 && (
                <div className="relative aspect-[4/5] w-[90%] shrink-0 snap-center flex items-center justify-center overflow-hidden rounded-2xl bg-surface border border-border/50">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <RotateCw className="h-8 w-8" />
                    <span className="text-[10px] uppercase tracking-[0.15em]">360° Desktop View</span>
                  </div>
                </div>
              )}
            </div>

            {/* DESKTOP ONLY SIDEBAR & MAIN IMAGE */}
            <div className="hidden w-20 shrink-0 flex-col gap-3 sm:flex">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => { setActive(i); setSpin(false); }} className={`aspect-square overflow-hidden rounded-lg border ${active === i ? "border-foreground" : "border-border/50"}`}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
              {product.has360 && (
                <button onClick={() => setSpin((s) => !s)} className={`flex aspect-square items-center justify-center rounded-lg border text-[10px] uppercase tracking-[0.15em] ${spin ? "border-brand text-brand" : "border-border/50 text-muted-foreground"}`}>
                  <div className="flex flex-col items-center gap-1"><RotateCw className="h-4 w-4" /><span>360°</span></div>
                </button>
              )}
            </div>
            <div
              className="relative aspect-[4/5] flex-1 overflow-hidden rounded-2xl bg-surface hidden sm:block"
              onMouseMove={onMouseMove}
              onMouseLeave={() => setZoom(null)}
              onPointerDown={spin ? startDrag : undefined}
              onPointerMove={spin ? moveDrag : undefined}
              onPointerUp={spin ? endDrag : undefined}
              style={{ cursor: spin ? "grab" : zoom ? "zoom-in" : "default" }}
            >
              <img
                src={spin ? product.images[frameIdx] : product.images[active]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300"
                style={zoom && !spin ? { transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: "scale(1.8)" } : undefined}
                draggable={false}
              />
              {spin && <div className="absolute bottom-4 left-4 rounded-full bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur">Drag to rotate</div>}
              {product.badge && <span className="absolute left-4 top-4 rounded-full bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur">{product.badge}</span>}
            </div>
          </div>

          {product.hasVideo && (
            <section className="mt-10 overflow-hidden rounded-2xl border border-border/50 bg-surface">
              <div className="relative aspect-video">
                <img src={product.images[1]} alt="" className="h-full w-full object-cover opacity-70" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setVideoOpen(true)}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/90 text-background transition hover:scale-110 cursor-pointer animate-pulse"
                    aria-label="Play film"
                  >
                    <Play className="h-6 w-6 pl-0.5" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.2em] text-foreground">The Film · 00:47</div>
              </div>
            </section>
          )}

          <section className="hidden sm:grid sm:mt-12 sm:gap-8 sm:grid-cols-2">
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-brand">Details</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-brand">Specifications</div>
              <dl className="mt-3 space-y-2 text-sm">
                <SpecRow k="Material" v={product.material} />
                <SpecRow k="Team" v={product.team} />
                {product.driver && <SpecRow k="Driver" v={product.driver} />}
                <SpecRow k="Category" v={CATEGORY_LABEL[product.category]} />
              </dl>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-2xl border border-border/50 bg-card/40 p-6 pb-8 sm:pb-6 backdrop-blur">
            <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{product.tag}</div>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-brand text-brand" /><span className="font-mono">{product.rating}</span></div>
              <span>·</span><span>{product.reviews.toLocaleString()} reviews</span>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <div className="font-display text-3xl font-bold">{formatINR(product.price)}</div>
              {product.compareAt && <div className="font-mono text-sm text-muted-foreground line-through">{formatINR(product.compareAt)}</div>}
            </div>

            <div className="mt-6">
              <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Colour · <span className="text-foreground">{color}</span></div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setColor(c)} className={`rounded-full border px-3 py-1.5 text-xs ${color === c ? "border-foreground bg-foreground text-background" : "border-border/70 hover:border-foreground"}`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-muted-foreground"><span>Size</span><button className="text-brand">Size guide</button></div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((s) => {
                  const sizeStock = product.stockBySize?.[s];
                  const isOos = sizeStock !== undefined && sizeStock <= 0;
                  return (
                    <button
                      key={s}
                      onClick={() => !isOos && setSize(s)}
                      disabled={isOos}
                      className={`rounded-lg border py-2 text-xs transition ${isOos ? "border-border/30 text-muted-foreground/40 line-through cursor-not-allowed" : size === s ? "border-foreground bg-foreground text-background" : "border-border/70 hover:border-foreground"}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-border/70">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2">−</button>
                <span className="w-6 text-center font-mono text-sm">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2">+</button>
              </div>
              <div className="text-xs text-muted-foreground"><span className="font-mono text-foreground">{product.stockBySize?.[size] !== undefined ? product.stockBySize[size] : product.stock}</span> in stock</div>
            </div>

            {/* Custom Printing Option */}
            {product.category !== "f1" && (
              <div className="mt-5 border-t border-border/40 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={customized}
                  onChange={(e) => {
                    setCustomized(e.target.checked);
                    if (!e.target.checked) {
                      setCustomName("");
                      setCustomNumber("");
                    }
                  }}
                  className="accent-brand rounded border-border"
                />
                <span className="text-[10px] uppercase tracking-[0.24em] text-foreground">Add Custom Name & Number</span>
              </label>

              {customized && (
                <div className="mt-3 grid grid-cols-[1fr_80px] gap-2 animate-in slide-in-from-top-2 duration-200">
                  <div>
                    <div className="mb-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Custom Name</div>
                    <input
                      type="text"
                      maxLength={12}
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value.toUpperCase().replace(/[^A-Z\s]/g, ""))}
                      placeholder="e.g. MESSI"
                      className="w-full rounded-lg border border-border/70 bg-transparent px-3 py-2 text-xs outline-none focus:border-foreground uppercase font-mono tracking-widest"
                    />
                  </div>
                  <div>
                    <div className="mb-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Number</div>
                    <input
                      type="text"
                      maxLength={2}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      value={customNumber}
                      onChange={(e) => setCustomNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="10"
                      className="w-full rounded-lg border border-border/70 bg-transparent px-3 py-2 text-center text-xs outline-none focus:border-foreground font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
            )}

            {/* ADD TO BAG & WISHLIST BUTTONS */}
            <div className="mt-6 flex flex-col gap-3">
              <button onClick={() => addToCart({ id: product.id, qty, size, color, ...(customized && customName ? { customName } : {}), ...(customized && customNumber ? { customNumber } : {}) })} className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-4 sm:py-3.5 text-[13px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-brand hover:text-foreground active:bg-brand active:text-foreground">
                <ShoppingBag className="h-5 w-5 sm:h-4 sm:w-4" /> Add to Bag · {formatINR(product.price * qty)}
              </button>
              <button onClick={() => toggleWishlist(product.id)} className={`inline-flex w-full items-center justify-center gap-2 rounded-full border py-3 sm:py-2.5 text-[12px] sm:text-[11px] uppercase tracking-[0.2em] transition ${wished ? "border-brand text-brand bg-brand/5" : "border-border/70 hover:border-foreground active:border-foreground bg-surface/50 sm:bg-transparent"}`}>
                <Heart className={`h-4 w-4 sm:h-3.5 sm:w-3.5 ${wished ? "fill-brand" : ""}`} /> {wished ? "Saved" : "Add to Wishlist"}
              </button>
            </div>

            <ul className="mt-6 space-y-3 border-t border-border/50 pt-5 text-xs text-muted-foreground">
              <li className="flex items-center gap-3"><Truck className="h-4 w-4 text-foreground" /> Free express shipping over ₹499</li>
              <li className="flex items-center gap-3"><ShieldCheck className="h-4 w-4 text-foreground" /> Verified authentic · lifetime guarantee</li>
              <li className="flex items-center gap-3"><RotateCw className="h-4 w-4 text-foreground" /> 30-day free returns</li>
            </ul>

            {/* MOBILE DETAILS & SPECS (Hidden on Desktop) */}
            <div className="mt-8 flex flex-col gap-8 border-t border-border/50 pt-8 sm:hidden">
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-brand">Details</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-brand">Specifications</div>
                <dl className="mt-3 space-y-2 text-sm">
                  <SpecRow k="Material" v={product.material} />
                  <SpecRow k="Team" v={product.team} />
                  {product.driver && <SpecRow k="Driver" v={product.driver} />}
                  <SpecRow k="Category" v={CATEGORY_LABEL[product.category]} />
                </dl>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-12 sm:mt-24">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-brand">You may also like</div>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Related pieces</h2>
          </div>
          <Link to="/shop" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-4">
          {related.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </section>

      {/* PRODUCT FILM MODAL */}
      {videoOpen && filmVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/10 bg-background shadow-2xl animate-in zoom-in-95">
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white/80 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <video
              src={filmVideo}
              autoPlay
              controls
              playsInline
              className="h-full w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between border-b border-border/40 py-1.5 text-xs"><dt className="text-muted-foreground">{k}</dt><dd>{v}</dd></div>;
}
