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
  ChevronDown,
  X,
  Lock,
  Banknote,
  Minus,
  Plus,
} from "lucide-react";
import { SiteChrome } from "@/components/chrome";
import { ProductCard } from "@/components/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselDots } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { CATEGORY_LABEL } from "@/lib/catalog";
import { useCatalog, getLiveProductBySlug } from "@/lib/catalog-store";
import { slugify } from "@/lib/slugify";
import { formatINR } from "@/lib/format";
import { useShop } from "@/lib/store";
import { useSiteImage } from "@/lib/site-images";
import { TEAM_LOGOS } from "@/lib/logos";

export const Route = createFileRoute("/$category/$slug")({
  loader: ({ params }) => ({ slug: params.slug, product: getLiveProductBySlug(params.slug) ?? null }),
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    const scripts = [];
    if (product) {
      const productSchema: any = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.images?.[0] ?? "https://velocewear.shop/logo.png",
        "description": product.description ?? `${product.name} - Veloce Wear`,
        "sku": product.id,
        "category": product.category,
        "brand": {
          "@type": "Brand",
          "name": "Veloce Wear"
        },
        "offers": {
          "@type": "Offer",
          "url": `https://velocewear.shop/${product.category}/${product.slug}`,
          "priceCurrency": "INR",
          "price": product.price,
          "itemCondition": "https://schema.org/NewCondition",
          "availability": (product.stock > 0 || (product.stockBySize && Object.values(product.stockBySize).some((v: any) => v > 0))) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
      };

      if (product.rating > 0 && product.reviews > 0) {
        productSchema.aggregateRating = {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "reviewCount": product.reviews
        };
      }

      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify(productSchema)
      });
    }

    const title = product ? `${product.name} | Premium ${product.team} Kit | Veloce Wear` : "Product Not Found | Veloce Wear";
    const description = product?.description ?? "Premium match-day kits and gear from Veloce Wear.";
    const image = product?.images?.[0] ?? "https://velocewear.shop/logo.png";
    const url = product ? `https://velocewear.shop/${product.category}/${product.slug}` : "https://velocewear.shop";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: image },
        { property: "og:url", content: url },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: image },
      ],
      scripts
    };
  },
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

function MobilePdp({
  product, wishlist, toggleWishlist, addToCart, isAdmin,
  color, size, setSize, qty, setQty,
  canCustomise, customiseOpen, setCustomiseOpen,
  customName, setCustomName, customNumber, setCustomNumber,
  inlineAddRef, sizeGuideOpen, setSizeGuideOpen, related, showStickyAdd
}: any) {
  const wished = wishlist.includes(product.id);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("description");
  
  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="md:hidden bg-[#f9f9f9] min-h-screen pb-24">
      {/* GALLERY */}
      <div className="relative w-full bg-[#f4f4f4] overflow-hidden">
        <Carousel opts={{ loop: true }} plugins={[Autoplay({ delay: 3000 }), Fade()]}>
          <CarouselContent className="ml-0">
            {product.images.map((img: string, i: number) => (
              <CarouselItem key={i} className="pl-0">
                <div className="relative w-full aspect-square flex items-center justify-center p-2">
                  <img src={img} alt="" className="w-full h-full object-contain scale-[1.05]" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center z-10 pointer-events-none">
             <CarouselDots className="gap-1.5" /> 
          </div>
        </Carousel>
        
        {product.badge && product.badge.toUpperCase() !== "VELOCE" && (
          <div className="absolute top-4 left-4 z-20">
            <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1.5 text-[9px] font-bold text-black uppercase tracking-[0.2em] shadow-sm">
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* HEADER EXACTLY LIKE IMAGE 3 */}
      <div className="bg-white px-5 py-6 shadow-sm relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex flex-col flex-1 pr-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gray-500 font-bold mb-2">{CATEGORY_LABEL[product.category as keyof typeof CATEGORY_LABEL] || product.category}</span>
            <h1 className="text-[22px] font-bold text-black leading-tight tracking-tight">{product.name}</h1>
          </div>
          {product.team && TEAM_LOGOS[product.team] && (
            <div className="shrink-0 mt-1">
              <img src={TEAM_LOGOS[product.team]} alt={product.team} className="w-12 h-12 object-contain bg-white rounded-[6px] border border-gray-100 p-1" />
            </div>
          )}
        </div>
        
        {(product.rating > 0 || product.reviews > 0) && (
          <div className="mt-4 flex items-center gap-1.5">
            <div className="flex items-center gap-1 text-black">
              <Star className="w-3.5 h-3.5 fill-black text-black" />
              <span className="text-[13px] font-bold">{product.rating}</span>
            </div>
            <span className="text-gray-400 text-[13px]">·</span>
            <span className="text-[13px] text-gray-700">{product.reviews} reviews</span>
          </div>
        )}

        <div className="mt-5 flex items-baseline gap-2.5">
           <span className="text-[28px] font-display font-bold tracking-tight text-black">{formatINR(product.price)}</span>
           {product.compareAt && product.compareAt > product.price && (
             <span className="text-[13px] font-medium text-gray-400 line-through decoration-gray-300">{formatINR(product.compareAt)}</span>
           )}
        </div>
        
        
      </div>

      {/* SIZE AND QUANTITY */}
      <div className="bg-white px-5 py-6 mt-2 shadow-sm">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">SIZE</h3>
           <button onClick={() => setSizeGuideOpen(true)} className="text-[10px] font-bold tracking-[0.1em] text-gray-600 hover:text-black transition-colors">Size guide</button>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {product.sizes.map((s: string) => {
             const sizeStock = product.stockBySize?.[s];
             const isOos = (sizeStock !== undefined ? sizeStock : product.stock) <= 0;
             return (
                <button
                  key={s}
                  disabled={isOos}
                  onClick={() => {
                     setSize(s);
                     setQty(1);
                  }}
                  className={`h-[42px] min-w-[54px] rounded-[4px] flex items-center justify-center text-[13px] font-bold transition-all active:scale-95 px-3 ${
                    isOos ? "border border-gray-100 text-gray-300 line-through bg-gray-50" :
                    size === s ? "bg-black text-white" :
                    "border border-gray-200 text-black hover:border-black bg-white"
                  }`}
                >
                  {s}
                </button>
             )
          })}
        </div>

        {/* QUANTITY AND STOCK */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex items-center border border-gray-200 rounded-full h-[42px] w-[110px]">
            <button 
              disabled={qty <= 1}
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="flex-1 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center text-[13px] font-bold text-black">{qty}</span>
            <button 
              disabled={size ? qty >= (product.stockBySize?.[size] ?? product.stock) : qty >= product.stock}
              onClick={() => setQty(qty + 1)}
              className="flex-1 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-[12px] text-gray-600 font-medium">
            {size 
              ? `${product.stockBySize?.[size] ?? product.stock} in stock` 
              : `${product.stock} in stock`}
          </span>
        </div>
      </div>

      {/* INLINE ADD TO CART & WISHLIST */}
      <div className="bg-white px-5 pb-8 pt-4 flex items-center gap-3" ref={inlineAddRef}>
        {!isAdmin && (
          <button 
            onClick={() => toggleWishlist(product.id)} 
            className="w-[56px] h-[56px] rounded-[4px] bg-[#f7f7f7] border border-gray-100 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          >
             <Heart className={`w-5 h-5 ${wished ? 'fill-black text-black' : 'text-black'}`} />
          </button>
        )}
        {!isAdmin && (
          product.stock <= 0 ? (
            <div className="flex-1 h-[56px] bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-[13px] tracking-widest uppercase rounded-[4px]">
              Out of Stock
            </div>
          ) : (
            <button
              onClick={() => {
                if (!size) {
                  alert("Please select a size first.");
                  return;
                }
                addToCart(
                  { id: product.id, qty, size, color, customName: canCustomise && customiseOpen && customName.trim() ? customName.trim().toUpperCase() : undefined, customNumber: canCustomise && customiseOpen && customNumber.trim() ? customNumber.trim() : undefined },
                  product.stockBySize?.[size] !== undefined ? product.stockBySize[size] : product.stock
                )
              }}
              className="flex-1 h-[56px] bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-[14px] tracking-widest uppercase rounded-[4px] active:scale-[0.98] transition-all duration-300 shadow-md"
            >
              {size ? "Add To Cart" : "Select Size"}
            </button>
          )
        )}
      </div>

      {/* TRUST SIGNALS */}
      <div className="px-5 py-8 mt-2 bg-white">
         <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center justify-center text-center gap-2 p-5 bg-[#fafafa] rounded-2xl border border-gray-100">
               <ShieldCheck className="w-6 h-6 text-black" strokeWidth={1.5} />
               <span className="text-[9px] uppercase tracking-widest font-bold text-gray-600">Premium Quality</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-2 p-5 bg-[#fafafa] rounded-2xl border border-gray-100">
               <RotateCw className="w-6 h-6 text-black" strokeWidth={1.5} />
               <span className="text-[9px] uppercase tracking-widest font-bold text-gray-600">4-Day Returns</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-2 p-5 bg-[#fafafa] rounded-2xl border border-gray-100">
               <Lock className="w-6 h-6 text-black" strokeWidth={1.5} />
               <span className="text-[9px] uppercase tracking-widest font-bold text-gray-600">Secure Checkout</span>
            </div>
            <div className="flex flex-col items-center justify-center text-center gap-2 p-5 bg-[#fafafa] rounded-2xl border border-gray-100">
               <Banknote className="w-6 h-6 text-black" strokeWidth={1.5} />
               <span className="text-[9px] uppercase tracking-widest font-bold text-gray-600">Cash on Delivery</span>
            </div>
         </div>
      </div>

      {/* ACCORDIONS */}
      <div className="bg-white px-5 py-4 mt-2">
        <MobileAccordion id="description" title="Details" active={activeAccordion} toggle={toggleAccordion}>
          {product.description}
        </MobileAccordion>
        <MobileAccordion id="specs" title="Specifications" active={activeAccordion} toggle={toggleAccordion}>
          <dl className="space-y-2 text-sm text-gray-600">
            <SpecRow k="Material" v={product.material} />
            <SpecRow k="Team" v={product.team} />
            {product.driver && <SpecRow k="Driver" v={product.driver} />}
            <SpecRow k="Category" v={CATEGORY_LABEL[product.category as keyof typeof CATEGORY_LABEL]} />
          </dl>
        </MobileAccordion>
        <MobileAccordion id="shipping" title="Shipping & Returns" active={activeAccordion} toggle={toggleAccordion}>
          Orders are dispatched within 24-48 hours. Free express shipping across India via Bluedart/Delhivery. 4-day easy returns policy with instant refunds.
        </MobileAccordion>
        <MobileAccordion id="care" title="Care Instructions" active={activeAccordion} toggle={toggleAccordion}>
          Machine wash cold. Do not iron on print. Do not tumble dry. Wash inside out to preserve badge and sponsor quality.
        </MobileAccordion>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <div className="bg-white px-4 sm:px-5 py-12 mt-2">
           <div className="text-center mb-8">
             <div className="text-[10px] uppercase tracking-[0.24em] text-brand font-bold mb-2">You may also like</div>
             <h2 className="font-display text-3xl font-bold text-black">Related Pieces</h2>
           </div>
           <div className="grid grid-cols-2 gap-3 sm:gap-4">
             {related.map((p: any) => <ProductCard key={p.id} p={p} />)}
           </div>
        </div>
      )}
            {/* STICKY ADD TO CART */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-4 pb-8 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-out flex gap-3 ${showStickyAdd ? 'translate-y-0' : 'translate-y-full'}`}>
        {!isAdmin && (
          <button 
            onClick={() => toggleWishlist(product.id)} 
            className="w-[56px] h-[56px] rounded-[4px] bg-[#f7f7f7] border border-gray-100 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          >
             <Heart className={`w-5 h-5 ${wished ? 'fill-black text-black' : 'text-black'}`} />
          </button>
        )}
        {!isAdmin && (
          product.stock <= 0 ? (
            <div className="flex-1 h-[56px] bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-[13px] tracking-widest uppercase rounded-[4px]">
              Out of Stock
            </div>
          ) : (
            <button
              onClick={() => {
                if (!size) {
                  alert("Please select a size first.");
                  const sizeHeader = document.getElementById("size-guide-modal");
                  if(sizeHeader) sizeHeader.scrollIntoView({ behavior: "smooth" });
                  return;
                }
                addToCart(
                  { id: product.id, qty, size, color, customName: canCustomise && customiseOpen && customName.trim() ? customName.trim().toUpperCase() : undefined, customNumber: canCustomise && customiseOpen && customNumber.trim() ? customNumber.trim() : undefined },
                  product.stockBySize?.[size] !== undefined ? product.stockBySize[size] : product.stock
                )
              }}
              className="flex-1 h-[56px] bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-[14px] tracking-widest uppercase rounded-[4px] active:scale-[0.98] transition-all duration-300 shadow-md"
            >
              {size ? "Add To Cart" : "Select Size"}
            </button>
          )
        )}
      </div>

      {/* SIZE GUIDE MODAL */}
      {sizeGuideOpen && (
        <div id="size-guide-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[16px] w-full max-w-sm overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-bold text-[15px] uppercase tracking-widest">Size Guide</h3>
              <button onClick={() => setSizeGuideOpen(false)} className="p-1 rounded-full bg-gray-100 active:scale-95 transition-transform">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-5 overflow-auto max-h-[60vh]">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="pb-3 font-bold text-gray-500">Size</th>
                    <th className="pb-3 font-bold text-gray-500">Chest (in)</th>
                    <th className="pb-3 font-bold text-gray-500">Length (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="py-3 font-bold">S</td><td className="py-3 text-gray-600">38</td><td className="py-3 text-gray-600">27</td></tr>
                  <tr><td className="py-3 font-bold">M</td><td className="py-3 text-gray-600">40</td><td className="py-3 text-gray-600">28</td></tr>
                  <tr><td className="py-3 font-bold">L</td><td className="py-3 text-gray-600">42</td><td className="py-3 text-gray-600">29</td></tr>
                  <tr><td className="py-3 font-bold">XL</td><td className="py-3 text-gray-600">44</td><td className="py-3 text-gray-600">30</td></tr>
                  <tr><td className="py-3 font-bold">XXL</td><td className="py-3 text-gray-600">46</td><td className="py-3 text-gray-600">31</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pdp() {
  const { slug, product: seed } = Route.useLoaderData() as {
    slug: string;
    product: import("@/lib/catalog").Product | null;
  };
  const { products } = useCatalog();
  const target = (slug || "").toLowerCase();
  const product =
    products.find(
      (p: any) =>
        p.id?.toLowerCase() === target ||
        p.slug?.toLowerCase() === target ||
        (p.name && slugify(p.name).toLowerCase() === target)
    ) ?? seed;
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
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes.includes("S") ? "S" : product.sizes[0]);
  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [rot, setRot] = useState(0);
  const [spin, setSpin] = useState(false);
  const dragRef = useRef<{ x: number; r: number } | null>(null);

  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [customiseOpen, setCustomiseOpen] = useState(false);
  const canCustomise = ["football", "cricket", "f1"].includes(product.category);

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
      products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 6),
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
    <>
      <MobilePdp
        product={product}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        addToCart={addToCart}
        isAdmin={isAdmin}
        color={color}
        size={size}
        setSize={setSize}
        qty={qty}
        setQty={setQty}
        canCustomise={canCustomise}
        customiseOpen={customiseOpen}
        setCustomiseOpen={setCustomiseOpen}
        customName={customName}
        setCustomName={setCustomName}
        customNumber={customNumber}
        setCustomNumber={setCustomNumber}
        inlineAddRef={inlineAddRef}
        sizeGuideOpen={sizeGuideOpen}
        setSizeGuideOpen={setSizeGuideOpen}
        related={related}
        showStickyAdd={showStickyAdd}
      />
      <div className="hidden md:block mx-auto max-w-7xl px-4 pt-6 sm:px-6">
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
                ? "/shop"
                : product.category === "f1"
                  ? "/shop/f1"
                  : "/shop/football"
          }
          className="hover:text-foreground"
        >
          {CATEGORY_LABEL[product.category as keyof typeof CATEGORY_LABEL]}
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
                {product.images.map((img: string, i: number) => (
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
              {product.images.map((img: string, i: number) => (
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
                <SpecRow k="Category" v={CATEGORY_LABEL[product.category as keyof typeof CATEGORY_LABEL]} />
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
                {product.colors.map((c: string) => (
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
                {product.sizes.map((s: string) => {
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
            <div className="mt-6 flex flex-col gap-3">
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
                            customName: canCustomise && customiseOpen && customName.trim() ? customName.trim().toUpperCase() : undefined,
                            customNumber: canCustomise && customiseOpen && customNumber.trim() ? customNumber.trim() : undefined,
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
                  <SpecRow k="Category" v={CATEGORY_LABEL[product.category as keyof typeof CATEGORY_LABEL]} />
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

            {/* STICKY ADD TO CART */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-4 pb-8 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-out flex gap-3 ${showStickyAdd ? 'translate-y-0' : 'translate-y-full'}`}>
        {!isAdmin && (
          <button 
            onClick={() => toggleWishlist(product.id)} 
            className="w-[56px] h-[56px] rounded-[4px] bg-[#f7f7f7] border border-gray-100 flex items-center justify-center shrink-0 active:scale-95 transition-transform"
          >
             <Heart className={`w-5 h-5 ${wished ? 'fill-black text-black' : 'text-black'}`} />
          </button>
        )}
        {!isAdmin && (
          product.stock <= 0 ? (
            <div className="flex-1 h-[56px] bg-gray-100 text-gray-400 flex items-center justify-center font-bold text-[13px] tracking-widest uppercase rounded-[4px]">
              Out of Stock
            </div>
          ) : (
            <button
              onClick={() => {
                if (!size) {
                  alert("Please select a size first.");
                  const sizeHeader = document.getElementById("size-guide-modal");
                  if(sizeHeader) sizeHeader.scrollIntoView({ behavior: "smooth" });
                  return;
                }
                addToCart(
                  { id: product.id, qty, size, color, customName: canCustomise && customiseOpen && customName.trim() ? customName.trim().toUpperCase() : undefined, customNumber: canCustomise && customiseOpen && customNumber.trim() ? customNumber.trim() : undefined },
                  product.stockBySize?.[size] !== undefined ? product.stockBySize[size] : product.stock
                )
              }}
              className="flex-1 h-[56px] bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-[14px] tracking-widest uppercase rounded-[4px] active:scale-[0.98] transition-all duration-300 shadow-md"
            >
              {size ? "Add To Cart" : "Select Size"}
            </button>
          )
        )}
      </div>

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
    </>
  );
}

function MobileAccordion({ id, title, active, toggle, children }: any) {
  const isOpen = active === id;
  return (
    <div className="border-b border-border/40">
      <button onClick={() => toggle(id)} className="w-full flex items-center justify-between py-5 text-left bg-transparent active:opacity-70 transition-opacity">
        <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-foreground">{title}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 pb-5 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="text-sm text-muted-foreground leading-relaxed">
          {children}
        </div>
      </div>
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
