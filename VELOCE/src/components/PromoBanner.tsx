import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";

const KEY = "veloce.promo.b2g1.dismissed";

export function PromoBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      setShow(sessionStorage.getItem(KEY) !== "1");
    } catch {
      setShow(true);
    }
  }, []);
  if (!show) return null;

  return (
    <div className="sticky inset-x-0 top-0 z-[60] overflow-hidden border-b border-brand/40 bg-gradient-to-r from-brand/25 via-background/80 to-brand/25 backdrop-blur">
      <div className="relative flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-foreground sm:gap-3 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.22em]">
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/30 sm:h-6 sm:w-6">
          <Sparkles className="h-3 w-3" />
        </span>
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-8 font-mono sm:gap-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="flex items-center gap-8 sm:gap-12">
                <span>BUY 2 GET 1 FREE</span>
                <span className="text-brand">·</span>
                <span>
                  CODE <b className="text-brand">B2G1</b> AT 3 JERSEYS
                </span>
                <span className="text-brand">✕</span>
              </span>
            ))}
          </div>
        </div>
        <button
          aria-label="Dismiss"
          onClick={() => {
            try {
              sessionStorage.setItem(KEY, "1");
            } catch {}
            setShow(false);
          }}
          className="shrink-0 rounded-full p-1 text-foreground/70 hover:bg-white/10 hover:text-foreground"
        >
          <X className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        </button>
      </div>
    </div>
  );
}
