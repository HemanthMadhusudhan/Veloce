import { Link } from "@tanstack/react-router";
import { Heart, Plus, Star } from "lucide-react";
import { useShop } from "@/lib/store";
import type { Product } from "@/lib/catalog";
import { formatINR } from "@/lib/format";
import { Picture } from "./Picture";

const GRID_SIZES = "(min-width: 1280px) 320px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";
const LIST_SIZES = "(min-width: 640px) 160px, 128px";

export function ProductCard({ p, view = "grid" }: { p: Product; view?: "grid" | "list" }) {
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const wished = wishlist.includes(p.id);
  const quickAdd = () => addToCart({ id: p.id, qty: 1, size: p.sizes[0], color: p.colors[0] });

  if (view === "list") {
    return (
      <div className="group relative flex gap-4 rounded-2xl border border-border/40 bg-card/40 p-3 transition-colors hover:border-border sm:gap-6 sm:p-4">
        <Link to="/product/$id" params={{ id: p.id }} className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-xl bg-surface sm:w-40">
          <Picture
            src={p.images[0]}
            alt={p.name}
            sizes={LIST_SIZES}
            imgClassName="h-full w-full object-cover transition-transform duration-700 lg:group-hover:scale-105"
          />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">{p.tag}</div>
            <Link to="/product/$id" params={{ id: p.id }} className="mt-1 block truncate font-display text-lg font-semibold hover:text-brand">{p.name}</Link>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <span>{p.team}{p.driver ? ` · ${p.driver}` : ""}</span>
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
              <IconBtn active={wished} onClick={() => toggleWishlist(p.id)} label="Wishlist"><Heart className="h-4 w-4" /></IconBtn>
              <button onClick={quickAdd} className="inline-flex h-9 items-center gap-1 rounded-full bg-foreground px-4 text-xs font-semibold text-background transition hover:bg-brand hover:text-foreground">
                <Plus className="h-3.5 w-3.5" /> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white pb-3 flex flex-col shadow-sm">
      <Link to="/product/$id" params={{ id: p.id }} className="relative block aspect-[4/5] overflow-hidden bg-gray-100">
        <Picture
          src={p.images[0]}
          alt={p.name}
          sizes={GRID_SIZES}
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover transition-transform duration-[900ms] ease-out lg:group-hover:scale-[1.06]"
        />
        {p.images[1] && (
          <Picture
            src={p.images[1]}
            alt=""
            sizes={GRID_SIZES}
            className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 hidden lg:block lg:group-hover:opacity-100"
            imgClassName="h-full w-full object-cover"
          />
        )}
        
        {/* Save Badge */}
        {p.compareAt && p.compareAt > p.price && (
          <span className="absolute left-3 top-3 rounded-full bg-[#E51E4E] px-2 py-0.5 text-[9px] font-bold text-white z-10 shadow-sm">
            Save {Math.round((1 - p.price / p.compareAt) * 100)}%
          </span>
        )}
        
        {/* Sold Out or Shopping Bag */}
        {p.stock === 0 ? (
          <div className="absolute inset-x-0 bottom-4 flex justify-center z-10 pointer-events-none">
            <span className="bg-[#b5ff14]/90 backdrop-blur text-black text-[10px] sm:text-xs font-bold px-4 py-1.5 border border-black/10">SOLD OUT</span>
          </div>
        ) : (
          <button onClick={(e) => { e.preventDefault(); quickAdd(); }} className="absolute right-0 bottom-0 bg-[#b5ff14] p-2.5 z-20 hover:bg-[#a3eb12] transition shadow-md">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
        )}
      </Link>
      
      <div className="mt-3 flex flex-col items-center px-2 text-center bg-white">
        <Link to="/product/$id" params={{ id: p.id }} className="block text-[11px] sm:text-xs text-black font-medium leading-snug hover:text-gray-700">
          {p.name}
        </Link>
        {(p.rating > 0 || p.reviews > 0) && (
          <div className="mt-1 flex items-center justify-center gap-1 text-[9px] sm:text-[10px] text-gray-500">
            <div className="flex items-center gap-0.5">
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-brand text-brand" />
              <span className="font-semibold text-black">{p.rating}</span>
            </div>
            <span>({p.reviews})</span>
          </div>
        )}
        <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1.5">
          <div className="text-[12px] sm:text-[13px] text-[#E51E4E]">Rs. {p.price.toLocaleString("en-IN")}.00</div>
          {p.compareAt && (
            <div className="text-[10px] sm:text-[11px] text-gray-500 relative inline-block">
              <span className="invisible">Rs. {p.compareAt.toLocaleString("en-IN")}.00</span>
              <div className="absolute inset-0 flex items-center justify-center">Rs. {p.compareAt.toLocaleString("en-IN")}.00</div>
              <div className="absolute top-1/2 left-0 right-0 h-px bg-[#E51E4E] rotate-[-8deg] origin-center opacity-80"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, onClick, active, label }: { children: React.ReactNode; onClick: (e: React.MouseEvent) => void; active?: boolean; label: string }) {
  return (
    <button aria-label={label} onClick={onClick} className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border backdrop-blur transition ${active ? "border-brand bg-brand text-foreground" : "border-white/20 bg-background/60 text-foreground hover:border-white/50"}`}>
      {children}
    </button>
  );
}
