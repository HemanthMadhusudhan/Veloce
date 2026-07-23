import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState, useEffect } from "react";
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCw,
  Play,
  Star,
  ChevronRight,
  X,
} from "lucide-react";
import { SiteChrome } from "@/components/chrome";
import { ProductCard } from "@/components/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselDots } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { CATEGORY_LABEL } from "@/lib/catalog";
import { useCatalog, getLiveProduct } from "@/lib/catalog-store";
import { formatINR } from "@/lib/format";
import { useShop } from "@/lib/store";
import { useSiteImage } from "@/lib/site-images";
import { TEAM_LOGOS } from "@/lib/logos";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => ({ id: params.id, product: getLiveProduct(params.id) ?? null }),
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.product ? `${loaderData.product.name} — Veloce Wear` : "Product — Veloce Wear" },
      { name: "description", content: loaderData?.product?.description ?? "Veloce Wear product." },
      { property: "og:title", content: loaderData?.product?.name ?? "Veloce Wear" },
      { property: "og:description", content: loaderData?.product?.description ?? "" },
    ],
  }),
  notFoundComponent: () => (
    <SiteChrome>
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="font-display text-3xl">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-sm text-brand">
          Back to shop
        </Link>
      </div>
    </SiteChrome>
  ),
  errorComponent: ({ error }) => (
    <SiteChrome>
      <div className="mx-auto max-w-xl px-6 py-20 text-center text-sm text-muted-foreground">
        {error.message}
      </div>
    </SiteChrome>
  ),
  component: PdpPage,
});

function PdpPage() {
  return (
    <SiteChrome>
      <Pdp />
    </SiteChrome>
  );
}

function Pdp() {
  const { id, product: seed } = Route.useLoaderData() as {
    id: string;
    product: import("@/lib/catalog").Product | null;
  };
  const { getById, products } = useCatalog();
  const product = getById(id) ?? seed;
  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h1 className="font-display text-3xl">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-sm text-brand">
          Back to shop
        </Link>
      </div>
    );
  }
  const { addToCart, toggleWishlist, wishlist, isAdmin } = useShop();
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

  const [showStickyAdd, setShowStickyAdd] = useState(false);
  const inlineAddRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = inlineAddRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyAdd(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const wished = wishlist.includes(product.id);
  const related = useMemo(
    () =>
      products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4),
    [product, products],
  );

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  const startDrag = (e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, r: rot };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const moveDrag = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const delta = e.clientX - dragRef.current.x;
    setRot((dragRef.current.r + delta / 2) % 360);
  };
  const endDrag = () => {
    dragRef.current = null;
  };
  const frameIdx = ((Math.round(rot / 90) % 4) + 4) % 4;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
      <nav className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        <Link to="/shop" className="hover:text-foreground">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          to={
            product.category === "worldcup"
              ? "/shop/worldcup"
              : product.category === "retro"
                ? "/shop/retro"
                : product.category === "f1"
                  ? "/shop/f1"
                  : "/shop/football"
          }
          className="hover:text-foreground"
        >
          {CATEGORY_LABEL[product.category]}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1fr_minmax(320px,420px)]">
        <div>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* CAROUSEL GALLERY */}
            <Carousel
              opts={{
                loop: true,
                duration: 40,
              }}
              plugins={[
                Autoplay({
                  delay: 3000,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]}
              className="w-full relative group"
            >
              <CarouselContent className="ml-0">
                {product.images.map((img, i) => (
                  <CarouselItem key={i} className="pl-0">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface rounded-xl sm:rounded-2xl">
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </div>
                  </CarouselItem>
                ))}
                {product.has360 && (
                  <CarouselItem className="pl-0">
                    <div className="relative aspect-[4/5] w-full flex items-center justify-center overflow-hidden bg-surface rounded-xl sm:rounded-2xl border border-border/50">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <RotateCw className="h-8 w-8" />
                        <span className="text-[10px] uppercase tracking-[0.15em]">
                          360° Desktop View
                        </span>
                      </div>
                    </div>
                  </CarouselItem>
                )}
              </CarouselContent>
              <CarouselDots className="mt-4 pb-2" />
              <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <CarouselPrevious className="left-4 bg-background/80 hover:bg-background/100 backdrop-blur" />
                <CarouselNext className="right-4 bg-background/80 hover:bg-background/100 backdrop-blur" />
              </div>
            </Carousel>

            {/* DESKTOP ONLY SIDEBAR & MAIN IMAGE */}
            <div className="hidden">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActive(i);
                    setSpin(false);
                  }}
                  className={`aspect-square overflow-hidden rounded-lg border ${active === i ? "border-foreground" : "border-border/50"}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
              {product.has360 && (
                <button
                  onClick={() => setSpin((s) => !s)}
                  className={`flex aspect-square items-center justify-center rounded-lg border text-[10px] uppercase tracking-[0.15em] ${spin ? "border-brand text-brand" : "border-border/50 text-muted-foreground"}`}
                >
                  <div className="flex flex-col items-center gap-1">
                    <RotateCw className="h-4 w-4" />
                    <span>360°</span>
                  </div>
                </button>
              )}
            </div>
            <div
              className="hidden"
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
                style={
                  zoom && !spin
                    ? { transformOrigin: `${zoom.x}% ${zoom.y}%`, transform: "scale(1.8)" }
                    : undefined
                }
                draggable={false}
              />
              {spin && (
                <div className="absolute bottom-4 left-4 rounded-full bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur">
                  Drag to rotate
                </div>
              )}
              {product.badge && (
                <span className="absolute left-4 top-4 rounded-full bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur">
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {product.hasVideo && (
            <section className="mt-10 overflow-hidden rounded-2xl border border-border/50 bg-surface">
              <div className="relative aspect-video">
                <img
                  src={product.images[1]}
                  alt=""
                  className="h-full w-full object-cover opacity-70"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setVideoOpen(true)}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-foreground/90 text-background transition hover:scale-110 cursor-pointer animate-pulse"
                    aria-label="Play film"
                  >
                    <Play className="h-6 w-6 pl-0.5" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 text-xs uppercase tracking-[0.2em] text-foreground">
                  The Film · 00:47
                </div>
              </div>
            </section>
          )}

          <section className="hidden">
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-brand">Details</div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.24em] text-brand">
                Specifications
              </div>
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
            <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {product.tag}
            </div>
            <div className="flex items-start justify-between gap-4 mt-1">
              <h1 className="font-display text-3xl font-bold tracking-tight">{product.name}</h1>
              {TEAM_LOGOS[product.team] && (
                <div className="w-14 h-14 bg-white rounded-xl border border-border/40 p-2 shadow-sm shrink-0 flex items-center justify-center">
                  <img src={TEAM_LOGOS[product.team]} alt={product.team} className="w-full h-full object-contain filter drop-shadow-sm" />
                </div>
              )}
            </div>
            <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-brand text-brand" />
                <span className="font-mono">{product.rating}</span>
              </div>
              <span>·</span>
              <span>{product.reviews.toLocaleString()} reviews</span>
            </div>
            <div className="mt-4 flex items-baseline gap-3">
              <div className="font-display text-3xl font-bold">{formatINR(product.price)}</div>
              {product.compareAt && (
                <div className="font-mono text-sm text-muted-foreground line-through">
                  {formatINR(product.compareAt)}
                </div>
              )}
            </div>

            <div className="mt-6">
              <div className="mb-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                Colour · <span className="text-foreground">{color}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-full border px-3 py-1.5 text-xs ${color === c ? "border-foreground bg-foreground text-background" : "border-border/70 hover:border-foreground"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                <span>Size</span>
                {product.category !== "accessories" && (
                  <button onClick={() => setSizeGuideOpen(true)} className="text-brand hover:underline transition">Size guide</button>
                )}
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((s) => {
                  const sizeStock = product.stockBySize?.[s];
                  const isOos = (sizeStock !== undefined ? sizeStock : product.stock) <= 0;
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        if (isOos) return;
                        setSize(s);
                        const newSizeStock =
                          product.stockBySize?.[s] !== undefined
                            ? product.stockBySize[s]
                            : product.stock;
                        setQty((q) => Math.min(q, newSizeStock));
                      }}
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
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2">
                  −
                </button>
                <span className="w-6 text-center font-mono text-sm">{qty}</span>
                <button
                  onClick={() =>
                    setQty((q) =>
                      Math.min(
                        product.stockBySize?.[size] !== undefined
                          ? product.stockBySize[size]
                          : product.stock,
                        q + 1,
                      ),
                    )
                  }
                  className="px-3 py-2"
                >
                  +
                </button>
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-mono text-foreground">
                  {product.stockBySize?.[size] !== undefined
                    ? product.stockBySize[size]
                    : product.stock}
                </span>{" "}
                in stock
              </div>
            </div>

            {/* ADD TO BAG & WISHLIST BUTTONS (INLINE) */}
            <div ref={inlineAddRef} className="mt-6 flex flex-col gap-3">
              {!isAdmin && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center border transition rounded-sm ${wished ? "border-brand text-brand bg-brand/5" : "border-border/70 hover:border-foreground active:border-foreground bg-surface/50 sm:bg-transparent"}`}
                  >
                    <Heart className={`h-6 w-6 ${wished ? "fill-brand" : ""}`} strokeWidth={1.5} />
                  </button>
                  {product.stock <= 0 ? (
                    <div className="flex h-[52px] flex-1 items-center justify-center border border-border/50 bg-surface/50 text-[13px] font-semibold uppercase tracking-[0.24em] text-muted-foreground rounded-sm cursor-not-allowed">
                      Out of Stock
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        addToCart(
                          {
                            id: product.id,
                            qty,
                            size,
                            color,
                          },
                          product.stockBySize?.[size] !== undefined
                            ? product.stockBySize[size]
                            : product.stock,
                        )
                      }
                      className="flex h-[52px] flex-1 items-center justify-center bg-[#181818] text-[15px] font-bold uppercase tracking-widest text-white transition hover:bg-black active:bg-black rounded-sm"
                    >
                      ADD TO CART
                    </button>
                  )}
                </div>
              )}
            </div>

            <ul className="mt-6 space-y-3 border-t border-border/50 pt-5 text-xs text-muted-foreground">
              <li className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-foreground" /> Free express shipping on all orders
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="h-4 w-4 text-foreground" /> Verified authentic · lifetime
                guarantee
              </li>
              <li className="flex items-center gap-3">
                <RotateCw className="h-4 w-4 text-foreground" /> 30-day free returns
              </li>
            </ul>

            {/* MOBILE DETAILS & SPECS (Hidden on Desktop) */}
            <div className="mt-8 flex flex-col gap-8 border-t border-border/50 pt-8">
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-brand">Details</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-brand">
                  Specifications
                </div>
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
            <div className="text-[10px] uppercase tracking-[0.24em] text-brand">
              You may also like
            </div>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">Related pieces</h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
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
            <video src={filmVideo} autoPlay controls playsInline className="h-full w-full" />
          </div>
        </div>
      )}

      {/* SMART STICKY ADD TO CART BAR (MOBILE ONLY) */}
      {!isAdmin && (
        <div 
          className={`fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border/30 px-4 py-3 sm:px-6 sm:py-4 transition-transform duration-300 shadow-[0_-10px_20px_rgba(0,0,0,0.08)] ${showStickyAdd ? "translate-y-0" : "translate-y-full"}`}
        >
          {product.stock <= 0 ? (
            <div className="flex h-[52px] w-full items-center justify-center border border-border/50 bg-surface/50 text-[13px] font-semibold uppercase tracking-[0.24em] text-muted-foreground rounded-sm cursor-not-allowed">
              Out of Stock
            </div>
          ) : (
            <button
              onClick={() => {
                addToCart(
                  {
                    id: product.id,
                    qty,
                    size,
                    color,
                  },
                  product.stockBySize?.[size] !== undefined
                    ? product.stockBySize[size]
                    : product.stock,
                );
                window.scrollTo({ top: 0, behavior: 'smooth' }); // Optional UX enhancement
              }}
              className="flex h-[52px] w-full items-center justify-center bg-[#181818] text-[15px] font-bold uppercase tracking-widest text-white transition active:bg-black rounded-sm"
            >
              ADD TO CART
            </button>
          )}
        </div>
      )}

      {/* SIZE GUIDE MODAL */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-background border border-border/50 shadow-2xl p-6 animate-in zoom-in-95">
            <button onClick={() => setSizeGuideOpen(false)} className="absolute right-4 top-4 rounded-full p-2 hover:bg-surface text-muted-foreground hover:text-foreground transition">
              <X className="h-4 w-4" />
            </button>
            <h3 className="text-xl font-bold font-display uppercase tracking-wider mb-4">Size Guide</h3>
            <p className="text-sm text-muted-foreground mb-6">Measurements are in inches. For player versions, we recommend going one size up as they have a tighter, athletic fit.</p>
            
            <div className="overflow-hidden rounded-xl border border-border/50">
              <table className="w-full text-sm">
                <thead className="bg-surface text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium uppercase text-[10px] tracking-widest">Size</th>
                    <th className="py-3 px-4 text-left font-medium uppercase text-[10px] tracking-widest">Chest</th>
                    <th className="py-3 px-4 text-left font-medium uppercase text-[10px] tracking-widest">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-3 px-4 font-bold">S</td><td className="py-3 px-4 text-muted-foreground">38"</td><td className="py-3 px-4 text-muted-foreground">27"</td></tr>
                  <tr><td className="py-3 px-4 font-bold">M</td><td className="py-3 px-4 text-muted-foreground">40"</td><td className="py-3 px-4 text-muted-foreground">28"</td></tr>
                  <tr><td className="py-3 px-4 font-bold">L</td><td className="py-3 px-4 text-muted-foreground">42"</td><td className="py-3 px-4 text-muted-foreground">29"</td></tr>
                  <tr><td className="py-3 px-4 font-bold">XL</td><td className="py-3 px-4 text-muted-foreground">44"</td><td className="py-3 px-4 text-muted-foreground">30"</td></tr>
                  <tr><td className="py-3 px-4 font-bold">XXL</td><td className="py-3 px-4 text-muted-foreground">46"</td><td className="py-3 px-4 text-muted-foreground">31"</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border/40 py-1.5 text-xs">
      <dt className="text-muted-foreground">{k}</dt>
      <dd>{v}</dd>
    </div>
  );
}
