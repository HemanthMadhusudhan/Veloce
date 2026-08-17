import { Link } from "@tanstack/react-router";
import { Heart, Plus, Star, ShoppingBag } from "lucide-react";
import { useShop } from "@/lib/store";
import type { Product } from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import { Picture } from "./Picture";
import { toast } from "sonner";
import { useState } from "react";

const GRID_SIZES =
  "(min-width: 1280px) 320px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";
const LIST_SIZES = "(min-width: 640px) 160px, 128px";

export function ProductCard({ p, view = "grid", priority = false }: { p: Product; view?: "grid" | "list"; priority?: boolean }) {
  const { wishlist, toggleWishlist, addToCart, isAdmin } = useShop();
  const wished = wishlist.includes(p.id);
  const [showSizes, setShowSizes] = useState(false);
  const quickAdd = () => {
    if (p.sizes.length > 1) {
      setShowSizes(true);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("overlay-change", { detail: { open: true } }));
      }
    } else {
      const size = p.sizes[0];
      const maxStock = p.stockBySize?.[size] !== undefined ? p.stockBySize[size] : p.stock;
      addToCart({ id: p.id, qty: 1, size, color: p.colors[0] }, maxStock);
    }
  };
  
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  
  const handleSizeAdd = (s: string) => {
    const maxStock = p.stockBySize?.[s] !== undefined ? p.stockBySize[s] : p.stock;
    addToCart({ id: p.id, qty: 1, size: s, color: p.colors[0] }, maxStock);
    setShowSizes(false);
    setSelectedSize(null);
  };

  if (view === "list") {
    return (
      <div className="group relative flex gap-4 rounded-2xl border border-border/40 bg-card/40 p-3 transition-colors hover:border-border sm:gap-6 sm:p-4">
        <Link
          to="/product/$id"
          params={{ id: p.id }}
          className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-xl bg-surface sm:w-40"
        >
          <Picture
            src={p.images[0]}
            alt={p.name}
            sizes={LIST_SIZES}
            imgClassName="h-full w-full object-cover transition-transform duration-700 lg:group-hover:scale-105"
            loading="eager"
            fetchPriority="high"
          />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              {p.tag}
            </div>
            <Link
              to="/product/$id"
              params={{ id: p.id }}
              className="mt-1 block truncate font-display text-lg font-semibold hover:text-brand"
            >
              {p.name}
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span>
                {p.team}
                {p.driver ? ` · ${p.driver}` : ""}
              </span>
              {(p.rating > 0 || p.reviews > 0) && (
                <>
                  <span>·</span>
                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-brand text-brand" />
                    <span className="text-foreground">{p.rating}</span>
                  </div>
                  <span>({p.reviews})</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="font-mono text-base">{formatINR(p.price)}</div>
            <div className="flex gap-2">
              {!isAdmin && (
                <IconBtn active={wished} onClick={() => toggleWishlist(p.id)} label="Wishlist">
                  <Heart className="h-4 w-4" />
                </IconBtn>
              )}
              {!isAdmin && (
                <div className="relative z-20">
                  <button
                    onClick={(e) => { e.preventDefault(); quickAdd(); }}
                    className="inline-flex h-9 items-center gap-1 rounded-full bg-foreground px-4 text-xs font-semibold text-background transition hover:bg-brand hover:text-foreground"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="group relative bg-white rounded-2xl border border-black/10 hover:border-black/30 p-2 sm:p-2.5 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
        {/* Product Image Box */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-white/70 flex items-center justify-center">
          <Link
            to="/product/$id"
            params={{ id: p.id }}
            className="absolute inset-0 h-full w-full flex items-center justify-center p-0"
          >
            <Picture
              src={p.images[0]}
              alt={p.name}
              sizes={GRID_SIZES}
              className="h-full w-full flex items-center justify-center overflow-hidden"
              imgClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading={priority ? "eager" : "lazy"}
            />
          </Link>
          
          {/* Top Left Discount Badge: Save X% */}
          {p.compareAt && p.compareAt > p.price && (
            <span className="absolute left-2 top-2 z-10 rounded-md bg-[#e62e2d] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs tracking-tight pointer-events-none">
              Save {Math.round((1 - p.price / p.compareAt) * 100)}%
            </span>
          )}

          {/* Top Right Wishlist Button */}
          {!isAdmin && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(p.id);
              }}
              className="absolute right-2 top-2 z-20 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/95 border border-black/10 shadow-xs transition-transform active:scale-75 hover:bg-white cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${wished ? "fill-[#d32f2f] text-[#d32f2f]" : "text-neutral-700"}`} />
            </button>
          )}

          {/* Bottom Right Floating Black Bag Button */}
          {!isAdmin && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                quickAdd();
              }}
              className="absolute right-2 bottom-2 z-20 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-black text-white hover:bg-[#d32f2f] shadow-md transition-all active:scale-90 cursor-pointer"
              aria-label="Quick add"
            >
              <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          )}
        </div>

        {/* Card Body - Centered details */}
        <div className="flex flex-col items-center text-center px-1 pt-2.5 pb-1">
          <Link
            to="/product/$id"
            params={{ id: p.id }}
            className="block text-xs sm:text-[13px] font-medium text-[#0b1d3a] hover:text-[#d32f2f] line-clamp-2 leading-snug transition-colors text-center w-full min-h-[2rem]"
          >
            {p.name}
          </Link>

          {/* Rating & Reviews */}
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-black mt-1">
            <Star className="h-3 w-3 fill-black text-black inline-block" />
            <span>{p.rating > 0 ? p.rating.toFixed(1) : "4.8"}</span>
            <span className="text-neutral-600 font-normal">({p.reviews || 45})</span>
          </div>

          {/* Pricing */}
          <div className="flex items-center justify-center gap-2 mt-1.5 font-bold">
            <span className="text-sm sm:text-base text-black font-mono">
              ₹{p.price.toLocaleString("en-IN")}
            </span>
            {p.compareAt && p.compareAt > p.price && (
              <span className="text-xs text-neutral-400 line-through font-mono font-normal">
                ₹{p.compareAt.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>
      </div>
    {/* QUICK ADD MODAL */}
      {showSizes && (
        <div 
          className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            e.preventDefault();
            setShowSizes(false);
            setSelectedSize(null);
            if (typeof window !== "undefined") {
              window.dispatchEvent(new CustomEvent("overlay-change", { detail: { open: false } }));
            }
          }}
        >
          <div 
            className="bg-white w-full max-w-sm rounded-3xl border border-black/20 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-200 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-52 bg-white/70 m-3 mb-0 rounded-2xl border border-black/10 flex items-center justify-center p-3 overflow-hidden">
              <Picture
                src={p.images[0]}
                alt={p.name}
                sizes="300px"
                className="h-full w-full flex items-center justify-center"
                imgClassName="h-full w-full object-contain"
              />
              <button 
                onClick={(e) => { 
                  e.preventDefault(); 
                  setShowSizes(false); 
                  setSelectedSize(null); 
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("overlay-change", { detail: { open: false } }));
                  }
                }}
                className="absolute top-2.5 right-2.5 bg-white/95 text-black border border-black/10 rounded-full w-7 h-7 flex items-center justify-center shadow-xs font-bold text-xs hover:bg-white cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 flex flex-col gap-3.5">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-black mb-0.5 leading-snug line-clamp-1">{p.name}</h3>
                <div className="text-black font-bold text-sm font-mono">{formatINR(p.price)}</div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mb-2">Select Size</div>
                <div className="flex flex-wrap gap-2">
                  {p.sizes.map(s => {
                    const sizeStock = p.stockBySize?.[s];
                    const isOos = (sizeStock !== undefined ? sizeStock : p.stock) <= 0;
                    return (
                      <button 
                        key={s} 
                        onClick={(e) => { 
                          e.preventDefault(); 
                          if (!isOos) setSelectedSize(s); 
                        }} 
                        disabled={isOos}
                        className={`h-11 w-11 flex items-center justify-center border font-bold text-xs transition-all rounded-xl cursor-pointer
                          ${isOos ? 'border-black/10 text-neutral-300 line-through cursor-not-allowed bg-black/5' : 
                            selectedSize === s ? 'border-[#d32f2f] bg-[#d32f2f] text-white shadow-sm font-black' : 'border-black/20 text-black bg-white/80 hover:border-black'}`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                onClick={(e) => { 
                  e.preventDefault(); 
                  if (selectedSize) {
                    handleSizeAdd(selectedSize);
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("overlay-change", { detail: { open: false } }));
                    }
                  } else {
                    toast.error("Please select a size", { duration: 1500 });
                  }
                }}
                className="w-full bg-black text-white font-bold uppercase tracking-widest py-3.5 text-xs rounded-full mt-1 hover:bg-[#d32f2f] transition-all active:scale-95 shadow-md cursor-pointer disabled:opacity-50"
              >
                {selectedSize ? `Add to Cart - ${selectedSize}` : "Select a size to add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function IconBtn({
  children,
  onClick,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  active?: boolean;
  label: string;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition ${active ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground hover:border-foreground"}`}
    >
      {children}
    </button>
  );
}
