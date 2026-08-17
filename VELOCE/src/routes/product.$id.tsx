import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState, useEffect } from "react";
import {
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCw,
  Star,
  ChevronRight,
  ChevronDown,
  X,
  Lock,
  Banknote,
  Minus,
  Plus,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { SiteChrome } from "@/components/chrome";
import { ProductCard } from "@/components/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselDots } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { CATEGORY_LABEL } from "@/lib/catalog";
import { useCatalog, getLiveProduct } from "@/lib/catalog-store";
import { formatINR } from "@/lib/format";
import { useShop } from "@/lib/store";
import { TEAM_LOGOS } from "@/lib/logos";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => ({ id: params.id, product: getLiveProduct(params.id) ?? null }),
  head: ({ loaderData }) => {
    const product = loaderData?.product;
    const scripts = [];
    if (product) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": product.name,
          "image": product.images?.[0] ?? "https://velocewear.shop/logo.png",
          "description": product.description ?? `${product.name} - Veloce Wear`,
          "sku": product.id,
          "offers": {
            "@type": "Offer",
            "url": `https://velocewear.shop/product/${product.id}`,
            "priceCurrency": "INR",
            "price": product.price,
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock"
          }
        })
      });
    }

    return {
      meta: [
        { title: product ? `${product.name} — Veloce Wear` : "Product — Veloce Wear" },
        { name: "description", content: product?.description ?? "Veloce Wear product." },
        { property: "og:title", content: product?.name ?? "Veloce Wear" },
        { property: "og:description", content: product?.description ?? "" },
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

// Helper to resolve team crest/logo
function resolveTeamLogo(teamName: string) {
  if (!teamName) return null;
  if (TEAM_LOGOS[teamName]) return TEAM_LOGOS[teamName];
  const lower = teamName.toLowerCase().trim();
  const found = Object.entries(TEAM_LOGOS).find(([k]) => {
    const kLow = k.toLowerCase();
    return kLow === lower || kLow.includes(lower) || lower.includes(kLow);
  });
  return found ? found[1] : null;
}

// Helper to resolve exact team shop category route
function getTeamShopRoute(team: string, category: string) {
  if (!team) return { to: "/shop" as const, search: {} };
  const cat = category?.toLowerCase();
  if (cat === "football") return { to: "/shop/football" as const, search: { team } };
  if (cat === "f1") return { to: "/shop/f1" as const, search: { team } };
  if (cat === "cricket") return { to: "/shop/cricket" as const, search: { team } };
  if (cat === "basketball") return { to: "/shop/basketball" as const, search: { team } };
  if (cat === "worldcup") return { to: "/shop/worldcup" as const, search: { team } };
  if (cat === "retro") return { to: "/shop/retro" as const, search: { team } };
  return { to: "/shop" as const, search: { team } };
}

// Interactive Size Guide Modal (Works on Mobile & Desktop)
function SizeGuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [unit, setUnit] = useState<"in" | "cm">("in");

  if (!open) return null;

  const measurements = [
    { size: "S", chestIn: '38"', chestCm: "96 cm", lenIn: '27"', lenCm: "68 cm", shoulderIn: '17"', shoulderCm: "43 cm" },
    { size: "M", chestIn: '40"', chestCm: "101 cm", lenIn: '28"', lenCm: "71 cm", shoulderIn: '18"', shoulderCm: "45 cm" },
    { size: "L", chestIn: '42"', chestCm: "106 cm", lenIn: '29"', lenCm: "74 cm", shoulderIn: '19"', shoulderCm: "48 cm" },
    { size: "XL", chestIn: '44"', chestCm: "112 cm", lenIn: '30"', lenCm: "76 cm", shoulderIn: '20"', shoulderCm: "51 cm" },
    { size: "XXL", chestIn: '46"', chestCm: "117 cm", lenIn: '31"', lenCm: "79 cm", shoulderIn: '21"', shoulderCm: "53 cm" },
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200" role="dialog">
      <div className="absolute inset-0 -z-10" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-neutral-200 shadow-2xl p-5 sm:p-7 animate-in zoom-in-95 duration-200 text-neutral-900 font-sans max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
          <div>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-neutral-900">Official Size Guide</h3>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">Find your perfect match-day fit</p>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-full p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 transition cursor-pointer"
            aria-label="Close size guide"
          >
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Unit Switcher */}
        <div className="my-4 flex items-center justify-between">
          <span className="text-xs text-neutral-600 font-bold">Measurement Unit:</span>
          <div className="flex bg-neutral-100 p-1 rounded-full border border-neutral-200">
            <button
              onClick={() => setUnit("in")}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${unit === "in" ? "bg-black text-white shadow-xs" : "text-neutral-600 hover:text-black"}`}
            >
              Inches (in)
            </button>
            <button
              onClick={() => setUnit("cm")}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${unit === "cm" ? "bg-black text-white shadow-xs" : "text-neutral-600 hover:text-black"}`}
            >
              Centimeters (cm)
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50/50 mb-5">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-100 text-neutral-600 border-b border-neutral-200">
              <tr>
                <th className="py-3 px-3.5 font-bold uppercase text-[11px] tracking-wider text-neutral-900">Size</th>
                <th className="py-3 px-3.5 font-bold uppercase text-[11px] tracking-wider text-neutral-900">Chest</th>
                <th className="py-3 px-3.5 font-bold uppercase text-[11px] tracking-wider text-neutral-900">Length</th>
                <th className="py-3 px-3.5 font-bold uppercase text-[11px] tracking-wider text-neutral-900">Shoulder</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/80 bg-white">
              {measurements.map((m) => (
                <tr key={m.size} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-2.5 px-3.5 font-black text-neutral-900 text-sm">{m.size}</td>
                  <td className="py-2.5 px-3.5 font-medium text-neutral-700">{unit === "in" ? m.chestIn : m.chestCm}</td>
                  <td className="py-2.5 px-3.5 font-medium text-neutral-700">{unit === "in" ? m.lenIn : m.lenCm}</td>
                  <td className="py-2.5 px-3.5 font-medium text-neutral-700">{unit === "in" ? m.shoulderIn : m.shoulderCm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tips Box */}
        <div className="bg-[#f7fdfa] border border-[#a3e4c4] p-3.5 rounded-2xl text-xs space-y-1">
          <div className="font-bold text-[#0fa958] flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>Pro Fitting Tip:</span>
          </div>
          <p className="text-neutral-700 font-medium leading-relaxed">
            For regular fan wear, choose your standard T-shirt size. For Player Version jerseys (athletic slim fit), we recommend going <strong>one size up</strong> for maximum comfort.
          </p>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full bg-black text-white py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition cursor-pointer"
        >
          Got It, Back to Product
        </button>
      </div>
    </div>
  );
}

// Smooth Cross-Fade Image Slider (Auto-slides every 2s, loops infinitely, supports manual swipe & dot clicks)
function ProductImageFadeSlider({ images, badge, isAdmin, wished, toggleWishlist, productId }: {
  images: string[];
  badge?: string;
  isAdmin?: boolean;
  wished?: boolean;
  toggleWishlist?: (id: string) => void;
  productId?: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide every 3.5 seconds in an infinite loop
  useEffect(() => {
    if (!images || images.length <= 1) return;

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images, currentIndex]);

  const goToNext = () => {
    if (!images || images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    if (!images || images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 30) {
      goToNext();
    } else if (distance < -30) {
      goToPrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div 
      className="relative w-full aspect-square bg-white overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Stacked Images with Smooth Cross-Fade Animation */}
      {images.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 flex items-center justify-center p-2 transition-all duration-700 ease-in-out ${
            i === currentIndex 
              ? "opacity-100 scale-100 z-10 pointer-events-auto" 
              : "opacity-0 scale-[1.02] z-0 pointer-events-none"
          }`}
        >
          <img 
            src={img} 
            alt={`Product view ${i + 1}`} 
            className="w-full h-full object-contain scale-[1.03]"
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Wishlist Floating Button */}
      {!isAdmin && toggleWishlist && productId && (
        <div className="absolute top-3 right-3 z-20">
          <button 
            onClick={() => toggleWishlist(productId)} 
            className="w-10 h-10 rounded-full bg-white/90 border border-neutral-200 backdrop-blur-md flex items-center justify-center shadow-xs active:scale-90 transition-transform cursor-pointer"
            aria-label="Toggle wishlist"
          >
            <Heart className={`w-5 h-5 ${wished ? 'fill-[#d32f2f] text-[#d32f2f]' : 'text-neutral-800'}`} />
          </button>
        </div>
      )}

      {/* Year / Tag Badge */}
      <div className="absolute top-3 left-3 z-20">
        <span className="rounded-full bg-black/80 backdrop-blur-sm text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-xs">
          {badge || "2026"}
        </span>
      </div>

      {/* Pagination Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-2.5 left-0 right-0 z-20 flex justify-center items-center gap-1.5 pointer-events-auto">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentIndex 
                  ? "w-5 bg-black" 
                  : "w-1.5 bg-neutral-300 hover:bg-neutral-500"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}


// Mobile Product Detail Component
function MobilePdp({
  product, wishlist, toggleWishlist, addToCart, isAdmin,
  color, size, setSize, qty, setQty,
  canCustomise, customiseOpen, setCustomiseOpen,
  customName, setCustomName, customNumber, setCustomNumber,
  inlineAddRef, sizeSectionRef, sizeError, setSizeError,
  setSizeGuideOpen, related, showStickyAdd, handleAddToCart
}: any) {
  const wished = wishlist.includes(product.id);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("description");
  const nav = useNavigate();

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  const teamLogoUrl = resolveTeamLogo(product.team);

  const ratingVal = product.rating > 0 ? product.rating : 4.7;
  const reviewCount = product.reviews > 0 ? product.reviews : 146;

  return (
    <div className="md:hidden bg-white min-h-screen pb-28 font-sans">
      {/* 2-SEC AUTO-SLIDING GALLERY WITH SMOOTH CROSS-FADE & TOUCH SWIPE */}
      <ProductImageFadeSlider
        images={product.images}
        badge={product.badge}
        isAdmin={isAdmin}
        wished={wished}
        toggleWishlist={toggleWishlist}
        productId={product.id}
      />

      {/* PRODUCT TITLE, TEAM CREST & PRICING */}
      <div className="bg-white px-4.5 py-4 border-t border-neutral-100 relative z-10">
        <div className="text-[11px] uppercase tracking-wider text-neutral-500 font-bold mb-1">
          {product.team || product.category}
        </div>

        {/* Title row + Team Logo Badge */}
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 leading-snug">
            {product.name}
          </h1>

          {teamLogoUrl && (
            <button
              onClick={() => {
                const route = getTeamShopRoute(product.team, product.category);
                nav({ to: route.to as any, search: route.search as any });
              }}
              className="shrink-0 w-13 h-13 bg-white rounded-2xl border border-neutral-200 p-1.5 shadow-xs flex items-center justify-center hover:border-black active:scale-95 transition-all cursor-pointer group"
              title={`View ${product.team} collection`}
            >
              <img 
                src={teamLogoUrl} 
                alt={product.team} 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
              />
            </button>
          )}
        </div>
        
        {/* Star Rating Line */}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-700 font-bold">
          <div className="flex items-center gap-1 text-black">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-black text-sm">{ratingVal}</span>
          </div>
          <span className="text-neutral-500 font-medium">({reviewCount} reviews)</span>
        </div>

        {/* Price Line */}
        <div className="mt-3 flex items-baseline gap-2.5">
           <span className="text-2xl font-black tracking-tight text-neutral-900">
             {formatINR(product.price)}
           </span>
           {product.compareAt && product.compareAt > product.price && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-400 line-through font-mono">
                  {formatINR(product.compareAt)}
                </span>
                <span className="text-[10px] font-bold text-neutral-700 bg-neutral-100 border border-neutral-200/80 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  -{Math.round((1 - product.price / product.compareAt) * 100)}%
                </span>
              </div>
           )}
        </div>
      </div>

      {/* SIZE SELECTION & QUANTITY & ADD TO CART (ref={sizeSectionRef}) */}
      <div 
        ref={sizeSectionRef} 
        className={`bg-white px-4.5 py-5 border-t transition-colors ${
          sizeError ? "border-red-500 bg-red-50/20" : "border-neutral-100"
        }`}
      >
        <div className="flex items-center justify-between mb-3">
           <div className="flex items-center gap-2">
             <h3 className="text-xs font-black uppercase tracking-wider text-neutral-900">Select Size</h3>
             {sizeError && !size && (
               <span className="text-[11px] font-bold text-red-500 flex items-center gap-1 animate-pulse">
                 <AlertCircle className="h-3 w-3" /> Select a size
               </span>
             )}
           </div>
           <button 
             onClick={() => setSizeGuideOpen(true)} 
             className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 hover:text-black transition-colors underline underline-offset-4 cursor-pointer"
           >
             Size Guide
           </button>
        </div>

        {/* Size Pills Grid */}
        <div className="grid grid-cols-5 gap-2">
          {product.sizes.map((s: string) => {
             const sizeStock = product.stockBySize?.[s];
             const isOos = (sizeStock !== undefined ? sizeStock : product.stock) <= 0;
             const isSelected = size === s;

             return (
                <button
                  key={s}
                  disabled={isOos}
                  onClick={() => {
                     setSize(s);
                     setSizeError(false);
                     setQty(Math.min(qty, sizeStock !== undefined ? sizeStock : product.stock));
                  }}
                  className={`h-12 rounded-xl flex items-center justify-center text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                    isOos ? "border border-neutral-200 text-neutral-300 line-through bg-neutral-50 cursor-not-allowed" :
                    isSelected ? "border-2 border-black bg-white text-black font-black shadow-xs ring-1 ring-black" :
                    "border border-neutral-300/90 text-neutral-800 hover:border-black bg-white"
                  }`}
                >
                  {s}
                </button>
             );
          })}
        </div>

        {/* Quantity Stepper Row */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-neutral-100">
          <span className="text-xs font-black uppercase tracking-wider text-neutral-900">Quantity</span>
          <div className="flex items-center gap-3 bg-neutral-100 rounded-xl px-3 py-1.5 border border-neutral-200/80">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="p-1 text-neutral-600 hover:text-black transition cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
            <span className="w-5 text-center font-bold text-xs text-neutral-900">{qty}</span>
            <button
              onClick={() => {
                const maxStock = product.stockBySize?.[size] !== undefined ? product.stockBySize[size] : product.stock;
                setQty(Math.min(maxStock || 10, qty + 1));
              }}
              className="p-1 text-neutral-600 hover:text-black transition cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* INLINE ACTION ROW (Wishlist + In-page ADD TO CART) */}
        <div className="mt-4 flex items-center gap-2.5" ref={inlineAddRef}>
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`w-13 h-13 shrink-0 rounded-2xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
              wished ? "border-[#d32f2f] text-[#d32f2f] bg-[#d32f2f]/5" : "border-neutral-300 bg-white text-neutral-800 hover:border-black"
            }`}
            aria-label="Save for later"
          >
            <Heart className={`w-5 h-5 ${wished ? "fill-[#d32f2f]" : ""}`} strokeWidth={2} />
          </button>

          {!isAdmin && (
            product.stock <= 0 ? (
              <div className="flex-1 h-13 bg-neutral-100 text-neutral-400 flex items-center justify-center font-bold text-xs tracking-wider uppercase rounded-2xl">
                Out of Stock
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex-1 h-13 bg-black text-white flex items-center justify-center font-bold text-xs uppercase tracking-wider rounded-2xl shadow-md active:scale-98 transition-all cursor-pointer gap-2 hover:bg-neutral-800"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add To Cart</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* CUSTOMISATION ACCORDION */}
      {canCustomise && (
        <div className="bg-white px-4.5 py-4 border-t border-neutral-100">
          <div className="rounded-2xl border border-neutral-200 overflow-hidden bg-neutral-50/60">
            <button 
              onClick={() => {
                setCustomiseOpen(!customiseOpen);
                if (customiseOpen) { setCustomName(""); setCustomNumber(""); }
              }}
              className="w-full flex items-center justify-between p-4 text-left active:bg-neutral-100 transition-colors cursor-pointer"
            >
              <span className="text-xs uppercase tracking-wider font-bold text-neutral-900">
                {customiseOpen ? "Remove Customisation" : "Add Custom Name & Number"}
              </span>
              <span className="text-xs uppercase tracking-wider text-neutral-600 font-bold">
                {customiseOpen ? "− ₹100" : "+ ₹100"}
              </span>
            </button>
            
            {customiseOpen && (
              <div className="p-4 pt-0 animate-in slide-in-from-top-2 fade-in duration-200 border-t border-neutral-200/80">
                <div className="flex flex-col gap-3 mt-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">Name (Max 14)</label>
                    <input
                      type="text"
                      maxLength={14}
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                      placeholder="e.g. MESSI"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-black uppercase font-bold text-neutral-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">Number (Max 3)</label>
                    <input
                      type="text"
                      maxLength={3}
                      value={customNumber}
                      onChange={(e) => setCustomNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 10"
                      className="w-full bg-white border border-neutral-300 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-black font-bold text-neutral-900"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4-GRID TRUST SIGNALS */}
      <div className="px-4.5 py-5 border-t border-neutral-100 bg-white">
         <div className="grid grid-cols-2 gap-2.5">
            <div className="flex items-center gap-2.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60">
               <ShieldCheck className="w-4 h-4 text-neutral-900 shrink-0" />
               <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-800">Premium Quality</span>
            </div>
            <div className="flex items-center gap-2.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60">
               <RotateCw className="w-4 h-4 text-neutral-900 shrink-0" />
               <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-800">4-Day Returns</span>
            </div>
            <div className="flex items-center gap-2.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60">
               <Lock className="w-4 h-4 text-neutral-900 shrink-0" />
               <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-800">Secure Checkout</span>
            </div>
            <div className="flex items-center gap-2.5 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/60">
               <Banknote className="w-4 h-4 text-neutral-900 shrink-0" />
               <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-800">Cash on Delivery</span>
            </div>
         </div>
      </div>

      {/* ACCORDIONS (DETAILS, SPECS, SHIPPING, CARE) */}
      <div className="bg-white px-4.5 py-2 border-t border-neutral-100">
        <MobileAccordion id="description" title="Details" active={activeAccordion} toggle={toggleAccordion}>
          {product.description || `Experience the authentic spirit of ${product.team || "the club"} with this official match-day jersey. Engineered with breathable moisture-wicking technology and premium team badges.`}
        </MobileAccordion>
        <MobileAccordion id="specs" title="Specifications" active={activeAccordion} toggle={toggleAccordion}>
          <dl className="space-y-1.5 text-xs text-neutral-700 font-medium">
            <SpecRow k="Material" v={product.material || "100% Breathable Recycled Polyester"} />
            <SpecRow k="Team" v={product.team || "Official Matchwear"} />
            {product.driver && <SpecRow k="Driver" v={product.driver} />}
            <SpecRow k="Category" v={CATEGORY_LABEL[product.category as keyof typeof CATEGORY_LABEL] || product.category} />
          </dl>
        </MobileAccordion>
        <MobileAccordion id="shipping" title="Shipping & Returns" active={activeAccordion} toggle={toggleAccordion}>
          Orders are dispatched within 24-48 hours. Free express shipping across India via BlueDart & Delhivery. 4-day easy exchange and returns policy.
        </MobileAccordion>
        <MobileAccordion id="care" title="Care Instructions" active={activeAccordion} toggle={toggleAccordion}>
          Machine wash cold inside out. Do not iron directly on print or badge. Do not bleach or tumble dry.
        </MobileAccordion>
      </div>

      {/* RATINGS & REVIEWS SECTION */}
      <div className="bg-white px-4.5 py-6 border-t border-neutral-100">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="text-4xl sm:text-5xl font-black text-neutral-900 leading-none">
              {ratingVal}
            </div>
            <div className="flex items-center gap-1 my-1.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            <div className="text-xs text-neutral-500 font-semibold">
              Based on {reviewCount} reviews
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-col gap-1.5 text-right">
            <div className="inline-flex items-center justify-end gap-1.5 text-[10px] font-bold text-neutral-800">
              <span>VERIFIED BY</span>
              <svg className="w-3.5 h-3.5 inline" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
            </div>

            <div className="inline-flex items-center justify-end gap-1 text-[10px] font-bold text-[#00b67a]">
              <span>EXCELLENT ON</span>
              <span className="bg-[#00b67a] text-white px-1 rounded text-[9px] font-black">★ Trustpilot</span>
            </div>

            <div className="inline-flex items-center justify-end gap-1 text-[10px] font-bold text-[#ff6a00]">
              <span>100% SAFE</span>
              <span className="font-extrabold text-neutral-800">Scamadviser</span>
            </div>
          </div>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="space-y-1.5 text-xs font-bold text-neutral-600">
          {[
            { stars: 5, pct: 85 },
            { stars: 4, pct: 10 },
            { stars: 3, pct: 3 },
            { stars: 2, pct: 1 },
            { stars: 1, pct: 1 },
          ].map((row) => (
            <div key={row.stars} className="flex items-center gap-2">
              <span className="w-5 text-neutral-800 font-bold">{row.stars} ★</span>
              <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 rounded-full" 
                  style={{ width: `${row.pct}%` }} 
                />
              </div>
              <span className="w-8 text-right text-[11px] font-medium text-neutral-500">{row.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* RELATED PIECES */}
      {related.length > 0 && (
        <div className="bg-white px-4.5 py-6 border-t border-neutral-100">
           <div className="text-center mb-5">
             <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-1">You may also like</div>
             <h2 className="text-2xl font-black text-neutral-900">Related Pieces</h2>
           </div>
           <div className="grid grid-cols-2 gap-3">
             {related.map((p: any) => <ProductCard key={p.id} p={p} />)}
           </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM BAR - Synced to only show when inline button is scrolled away */}
      {!isAdmin && product.stock > 0 && (
        <div className={`md:hidden fixed bottom-0 left-0 right-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-neutral-200 z-50 shadow-lg flex items-center justify-between gap-3 transition-all duration-300 ${
          showStickyAdd ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
        }`}>
          <div>
            <div className="text-[10px] uppercase font-bold text-neutral-500">Price</div>
            <div className="font-black text-base text-neutral-900">{formatINR(product.price)}</div>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-black text-white h-12 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Add To Cart</span>
          </button>
        </div>
      )}
    </div>
  );
}

function Pdp() {
  const { id, product: seed } = Route.useLoaderData() as {
    id: string;
    product: import("@/lib/catalog").Product | null;
  };
  const { getById, products } = useCatalog();
  const product = getById(id) ?? seed;
  const nav = useNavigate();

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
  
  // DEFAULT: No size selected by default
  const [size, setSize] = useState<string>("");
  const [sizeError, setSizeError] = useState(false);

  const [qty, setQty] = useState(1);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [rot, setRot] = useState(0);
  const [spin, setSpin] = useState(false);
  const dragRef = useRef<{ x: number; r: number } | null>(null);

  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");
  const [customiseOpen, setCustomiseOpen] = useState(false);
  const canCustomise = ["football", "cricket", "f1"].includes(product.category);

  // Dual-Button Sync
  const [showStickyAdd, setShowStickyAdd] = useState(false);
  const inlineAddRef = useRef<HTMLDivElement>(null);
  const sizeSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = inlineAddRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyAdd(!entry.isIntersecting);
      },
      { threshold: 0.1 }
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

  const teamLogoUrl = resolveTeamLogo(product.team);

  // Validation: If no size is selected, auto scroll to size section and prompt user
  const handleAddToCart = () => {
    if (!size) {
      setSizeError(true);
      sizeSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.error("Please select a size to continue");
      return;
    }

    setSizeError(false);
    addToCart(
      {
        id: product.id,
        qty,
        size,
        color,
        customName: canCustomise && customiseOpen && customName.trim() ? customName.trim().toUpperCase() : undefined,
        customNumber: canCustomise && customiseOpen && customNumber.trim() ? customNumber.trim() : undefined,
      },
      product.stockBySize?.[size] !== undefined ? product.stockBySize[size] : product.stock
    );
  };

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
      {/* MOBILE PDP */}
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
        sizeSectionRef={sizeSectionRef}
        sizeError={sizeError}
        setSizeError={setSizeError}
        setSizeGuideOpen={setSizeGuideOpen}
        related={related}
        showStickyAdd={showStickyAdd}
        handleAddToCart={handleAddToCart}
      />

      {/* DESKTOP PDP */}
      <div className="hidden md:block mx-auto max-w-7xl px-4 pt-6 sm:px-6 font-sans pb-16">
        <nav className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-neutral-500">
          <Link to="/shop" className="hover:text-black">
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
            className="hover:text-black"
          >
            {CATEGORY_LABEL[product.category] || product.category}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate text-black font-bold">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(340px,440px)]">
          <div>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Desktop Gallery with 2s Auto-Slide & Cross-Fade */}
              <div className="w-full rounded-3xl overflow-hidden border border-neutral-200/60 bg-neutral-50 p-4">
                <ProductImageFadeSlider
                  images={product.images}
                  badge={product.badge}
                />
              </div>
            </div>

            {/* Desktop Reviews Block */}
            <div className="mt-12 border-t border-neutral-200 pt-8">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">Ratings & Customer Reviews</h3>
                  <div className="flex items-baseline gap-3 mt-2">
                    <span className="text-4xl font-black">{product.rating || 4.7}</span>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500 font-semibold">({product.reviews || 146} verified reviews)</span>
                  </div>
                </div>
              </div>

              {/* Progress bars */}
              <div className="max-w-md space-y-2 text-xs font-bold text-neutral-600">
                {[
                  { stars: 5, pct: 85 },
                  { stars: 4, pct: 10 },
                  { stars: 3, pct: 3 },
                  { stars: 2, pct: 1 },
                  { stars: 1, pct: 1 },
                ].map((row) => (
                  <div key={row.stars} className="flex items-center gap-2">
                    <span className="w-6 text-neutral-800 font-bold">{row.stars} ★</span>
                    <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span className="w-8 text-right text-xs font-medium text-neutral-500">{row.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Right Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xs space-y-5">
              <div className="text-xs uppercase tracking-wider text-neutral-500 font-bold">
                {product.team || product.category}
              </div>

              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-black tracking-tight text-neutral-900">{product.name}</h1>
                {teamLogoUrl && (
                  <button
                    onClick={() => {
                      const route = getTeamShopRoute(product.team, product.category);
                      nav({ to: route.to as any, search: route.search as any });
                    }}
                    className="w-14 h-14 bg-white rounded-2xl border border-neutral-200 p-2 shadow-2xs shrink-0 flex items-center justify-center hover:border-black cursor-pointer group"
                    title={`View ${product.team} collection`}
                  >
                    <img src={teamLogoUrl} alt={product.team} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                  </button>
                )}
              </div>

              <div className="flex items-baseline gap-3">
                <div className="text-3xl font-black text-neutral-900">{formatINR(product.price)}</div>
                {product.compareAt && (
                  <div className="text-sm font-medium text-neutral-400 line-through font-mono">
                    {formatINR(product.compareAt)}
                  </div>
                )}
              </div>

              {/* Desktop Size Selector */}
              <div className={`p-4 rounded-2xl border transition-colors ${sizeError ? "border-red-500 bg-red-50/30" : "border-neutral-200 bg-neutral-50/50"}`}>
                <div className="mb-2.5 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                    Size {sizeError && !size && <span className="text-red-500 font-bold">(Select a size)</span>}
                  </span>
                  <button onClick={() => setSizeGuideOpen(true)} className="text-xs font-bold text-neutral-800 hover:underline uppercase tracking-wider cursor-pointer">
                    Size Guide
                  </button>
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
                          setSizeError(false);
                          const newSizeStock = product.stockBySize?.[s] !== undefined ? product.stockBySize[s] : product.stock;
                          setQty((q) => Math.min(q, newSizeStock));
                        }}
                        disabled={isOos}
                        className={`rounded-xl py-2.5 text-xs font-bold transition cursor-pointer ${
                          isOos ? "border border-neutral-200 text-neutral-300 line-through cursor-not-allowed bg-white" :
                          size === s ? "border-2 border-black bg-white text-black font-black shadow-xs ring-1 ring-black" :
                          "border border-neutral-300 bg-white text-neutral-800 hover:border-black"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Desktop Add to Cart */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex h-13 w-13 shrink-0 items-center justify-center border rounded-2xl transition cursor-pointer ${
                    wished ? "border-[#d32f2f] text-[#d32f2f] bg-[#d32f2f]/5" : "border-neutral-300 hover:border-black bg-white"
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`h-5 w-5 ${wished ? "fill-[#d32f2f]" : ""}`} strokeWidth={2} />
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex h-13 flex-1 items-center justify-center bg-black text-xs font-bold uppercase tracking-wider text-white transition hover:bg-neutral-800 active:scale-98 rounded-2xl shadow-md cursor-pointer gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add To Cart</span>
                </button>
              </div>

              <ul className="mt-4 space-y-2.5 border-t border-neutral-100 pt-4 text-xs font-semibold text-neutral-700">
                <li className="flex items-center gap-2.5">
                  <Truck className="h-4 w-4 text-[#d32f2f]" /> Free express shipping across India
                </li>
                <li className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-[#d32f2f]" /> 100% Authentic official matchwear
                </li>
                <li className="flex items-center gap-2.5">
                  <RotateCw className="h-4 w-4 text-[#d32f2f]" /> 4-day easy returns & exchange
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Desktop Related Pieces */}
        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-500 font-bold">You may also like</div>
              <h2 className="mt-1 text-2xl font-bold text-neutral-900">Related Pieces</h2>
            </div>
            <Link to="/shop" className="text-xs uppercase tracking-wider font-bold text-[#d32f2f] hover:underline">
              View all &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      </div>

      {/* GLOBAL SIZE GUIDE MODAL */}
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
}

function MobileAccordion({ id, title, active, toggle, children }: any) {
  const isOpen = active === id;
  return (
    <div className="border-b border-neutral-100">
      <button 
        onClick={() => toggle(id)} 
        className="w-full flex items-center justify-between py-4 text-left bg-transparent active:opacity-70 transition-opacity cursor-pointer"
      >
        <span className="text-xs uppercase tracking-wider font-black text-neutral-900">{title}</span>
        <ChevronDown className={`w-4 h-4 text-neutral-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="text-xs text-neutral-600 leading-relaxed font-medium">
          {children}
        </div>
      </div>
    </div>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-neutral-100 py-1.5 text-xs font-medium">
      <dt className="text-neutral-500">{k}</dt>
      <dd className="text-neutral-900 font-semibold text-right">{v}</dd>
    </div>
  );
}
