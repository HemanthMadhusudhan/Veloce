import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { ArrowUpRight, Gift, ChevronRight, ChevronDown, Search, ShieldCheck } from "lucide-react";
import { SiteChrome } from "@/components/chrome";
import { ProductCard } from "@/components/ProductCard";
import { Picture } from "@/components/Picture";
import { useCatalog } from "@/lib/catalog-store";
import { useHotSelling } from "@/lib/hot-selling";
import { formatINR } from "@/lib/format";
import { ZONES, type Zone } from "@/lib/catalog";
import { DEFAULT_DROPS, useDrops, type Drop } from "@/lib/drops";
import { useSiteImage } from "@/lib/site-images";
import { useShop } from "@/lib/store";
import { TEAM_LOGOS, f1TeamsList, basketballTeamsList, cricketTeamsList } from "@/lib/logos";
import { useTeams } from "@/lib/teams";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SportSwitcher, SPORT_HEROES, type Sport } from "@/components/SportSwitcher";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Veloce Wear — Four Worlds. One Atelier. | Premium Sports Merchandise" },
      { name: "description", content: "Discover authentic football jerseys, Formula 1 teamwear, cricket kits, and basketball classics. Engineered for fans with museum-grade craftsmanship." },
      { property: "og:title", content: "Veloce Wear — Four Worlds. One Atelier." },
      { property: "og:description", content: "Discover authentic football jerseys, Formula 1 teamwear, cricket kits, and basketball classics." },
    ],
  }),
});

const MARQUEE = [
  "Scuderia Ferrari",
  "Real Madrid",
  "Oracle Red Bull Racing",
  "Manchester City",
  "Mercedes-AMG Petronas",
  "Paris Saint-Germain",
  "McLaren F1",
  "Arsenal FC",
  "Aston Martin Aramco",
  "Bayern München",
  "FC Barcelona",
];

const REVIEWS = [
  {
    name: "Rohan M.",
    rating: 5,
    text: "Honestly didn't expect much for the price, but the Arsenal away kit blew me away. The embroidery is spot on and the fit is perfect for 5-a-side.",
    product: "Arsenal Away 24/25",
    date: "July 2026",
  },
  {
    name: "Karan S.",
    rating: 5,
    text: "Took advantage of the B2G1 offer. The material breathes really well, wore it for a full day tournament in the Mumbai heat and it held up great.",
    product: "Real Madrid Home 24/25",
    date: "June 2026",
  },
  {
    name: "Vikram R.",
    rating: 4,
    text: "Delivery took an extra day but the Ferrari polo is gorgeous. Fits nicely around the shoulders. Will definitely be getting the Mercedes one next.",
    product: "Ferrari Team Polo 2026",
    date: "July 2026",
  },
  {
    name: "Sneha P.",
    rating: 5,
    text: "Got the retro 1998 France jersey for my boyfriend. He was genuinely speechless. The detailing on the crest is unbelievable. So happy with this purchase!",
    product: "France Retro 1998",
    date: "May 2026",
  },
  {
    name: "Aditya V.",
    rating: 5,
    text: "I've bought jerseys from a lot of places but Veloce's player issue kits are actually 1:1. The heat-pressed logos don't peel after washing.",
    product: "Manchester City Player Issue",
    date: "June 2026",
  },
  {
    name: "Arjun N.",
    rating: 5,
    text: "The McLaren tee fits my son perfectly. True to size and the colors haven't faded at all after multiple washes. Really solid quality.",
    product: "McLaren Driver Tee",
    date: "May 2026",
  },
];

function useCountdown(target: Date | number) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const targetTime = target instanceof Date ? target.getTime() : new Date(target).getTime();
  const diff = Math.max(0, targetTime - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs, total: diff };
}

function useMarquee(speed = 0.5, dependencies: any[] = []) {
  const containerRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasMoved = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let frameId: number;
    let pos = el.scrollLeft;

    const tick = () => {
      if (!isPaused && !isDragging.current && setRef.current) {
        const setWidth = setRef.current.offsetWidth;
        if (setWidth > 0) {
          pos += speed;
          if (pos >= setWidth) {
            pos -= setWidth;
          }
          el.scrollLeft = pos;
        }
      } else {
        pos = el.scrollLeft;
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [speed, isPaused, ...dependencies]);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    hasMoved.current = false;
    startX.current = e.pageX - (containerRef.current?.offsetLeft || 0);
    scrollLeft.current = containerRef.current?.scrollLeft || 0;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - (containerRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    if (Math.abs(walk) > 5) hasMoved.current = true;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
  };

  return {
    containerRef,
    setRef,
    handlers: {
      onMouseEnter: () => setIsPaused(true),
      onMouseLeave: () => {
        setIsPaused(false);
        isDragging.current = false;
      },
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onClickCapture: (e: React.MouseEvent) => {
        if (hasMoved.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
    },
  };
}

function Star({ filled }: { filled?: boolean }) {
  return (
    <svg
      className={`h-3.5 w-3.5 ${filled ? "fill-[#eab308] text-[#eab308]" : "fill-transparent text-neutral-600"}`}
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function Index() {
  return (
    <SiteChrome>
      <Home />
    </SiteChrome>
  );
}

function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  return (
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".ogg") ||
    url.startsWith("data:video/")
  );
}

function Home() {
  const { products } = useCatalog();
  const { drops } = useDrops();
  const [showAllReviews, setShowAllReviews] = useState(false);

  const curatedProducts = useMemo(() => {
    if (!products.length) return [];
    // Pick products across sports excluding accessories
    const nonAccessories = products.filter(
      (p) =>
        p.category !== "accessories" &&
        (!p.tag || !p.tag.toLowerCase().includes("accessories"))
    );
    return nonAccessories.slice(0, 14);
  }, [products]);

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#d32f2f] selection:text-white">
      <h1 className="sr-only">Veloce Wear — Premium Sports Merchandise & Oversized Streetwear</h1>
      
      <style>{`
        .drag-scroll-container a, .drag-scroll-container img {
          -webkit-user-drag: none;
          user-select: none;
        }
      `}</style>

      {/* 
        ========================================================================
        1. STREETWEAR EDITORIAL HERO BANNER (Matching Image 3)
        Cream background with high impact jersey showcase & red pill CTA
        ========================================================================
      */}
      <section className="relative w-full overflow-hidden bg-white border-b border-black/10 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black/5 border border-black/10 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#d32f2f]">
                <span>NEW CLOTHING DROP 2026/27</span>
              </div>

              <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black leading-[0.95]">
                BLUE <br />
                <span className="text-[#d32f2f]">WONDER</span>
              </h2>

              <p className="text-xs sm:text-base text-neutral-700 font-medium leading-relaxed max-w-md">
                Official F1 Teamwear, Authentic Club Kits & Oversized Matchday Tees. Built for true fans across India.
              </p>

              <div className="pt-2 sm:pt-4 flex items-center gap-4">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-[#d32f2f] text-white hover:bg-red-700 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-all rounded-full shadow-lg active:scale-95 cursor-pointer"
                >
                  Shop Now
                </Link>
                <Link
                  to="/shop/f1"
                  className="inline-flex items-center justify-center px-6 py-3.5 bg-transparent border border-black/30 hover:border-black text-black text-xs sm:text-sm font-bold uppercase tracking-[0.16em] transition-all rounded-full"
                >
                  Explore F1
                </Link>
              </div>

              <div className="pt-4 flex items-center gap-6 text-[10px] font-bold uppercase tracking-wider text-neutral-600">
                <span>✓ COD Available</span>
                <span>✓ 7-Day Easy Exchange</span>
                <span>✓ Premium Fabric</span>
              </div>
            </div>

            {/* Right Visual Jersey Collage Column */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-black/5 p-4 sm:p-6 flex items-center justify-center border border-black/10 shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80"
                  alt="Sports Jersey Drop"
                  className="w-full h-full object-cover rounded-2xl shadow-md"
                  onError={(e) => {
                    e.currentTarget.src = "/images/nav-grid-f1.webp";
                  }}
                />
                <div className="absolute bottom-6 left-6 right-6 p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-black/10 flex items-center justify-between shadow-lg">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[#d32f2f]">Featured Release</span>
                    <div className="text-xs sm:text-sm font-black uppercase text-black">Mercedes-AMG & Red Bull Drop</div>
                  </div>
                  <Link
                    to="/shop/f1"
                    className="px-3.5 py-1.5 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-wider hover:bg-[#d32f2f] transition"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        2. SHOP BY TEAM (Continuous Marquee on Cream)
        ========================================================================
      */}
      <div className="w-full bg-white py-4 sm:py-5 border-b border-black/10">
        <UnifiedShopByTeam />
      </div>

      {/* 
        ========================================================================
        2.5 HOT SELLING SECTION (Placed right under Shop by Team)
        ========================================================================
      */}
      <HotSellingSection />

      {/* 
        ========================================================================
        3. CURATED THIS WEEK (12-14 curated products across sports except accessories)
        ========================================================================
      */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-black/10 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#d32f2f]">
              CURATED CATALOG
            </div>
            <h2 className="mt-1 font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
              CURATED THIS WEEK
            </h2>
          </div>

          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-neutral-800 hover:text-[#d32f2f] transition-colors"
          >
            Explore All Drops →
          </Link>
        </div>

        {/* Product Cards Grid with big, prominent images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {curatedProducts.map((p, i) => (
            <ProductCard key={p.id} p={p} priority={i < 4} />
          ))}
          {curatedProducts.length === 0 && (
            <div className="col-span-full py-16 text-center text-neutral-600 bg-black/5 rounded-3xl border border-black/10">
              No products found.
            </div>
          )}
        </div>
      </section>

      {/* 
        ========================================================================
        4. THE VELOCE STANDARD (Brand Storytelling)
        ========================================================================
      */}
      <section className="max-w-4xl mx-auto my-8 sm:my-20 px-6 text-center border-y border-black/10 py-12 sm:py-16">
        <div className="text-[10px] uppercase tracking-[0.32em] font-bold text-[#d32f2f]">
          The Veloce Standard
        </div>
        <p className="mt-4 font-display text-xl sm:text-3xl leading-snug tracking-tight text-balance text-black font-bold">
          "We treat every jersey and oversized fan tee like a piece of art. Designed with premium fabrics for unmatched matchday comfort."
        </p>
        <div className="mt-4 text-xs uppercase tracking-[0.24em] text-neutral-600 font-semibold">
          — Veloce Atelier
        </div>
      </section>

      {/* 
        ========================================================================
        5. CERTIFIED AUTHENTIC & SAFE REVIEWS (Matching Image 1)
        ========================================================================
      */}
      <section className="max-w-xl mx-auto my-12 sm:my-20 px-4 sm:px-6 text-center">
        {/* Trust Badges Header */}
        <div className="mb-8 flex flex-col items-center">
          <div className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-600 mb-5">
            CERTIFIED AUTHENTIC & SAFE
          </div>

          <div className="flex items-center justify-center gap-12 sm:gap-16 w-full mb-6">
            {/* Trustpilot */}
            <div className="flex flex-col items-center">
              <span className="font-display text-2xl sm:text-3xl font-black text-black">4.9 / 5</span>
              <div className="mt-1 flex items-center gap-1 text-[#00b67a] text-xs sm:text-sm font-bold">
                <span className="text-[#00b67a] text-base leading-none">★</span>
                <span>Trustpilot</span>
              </div>
            </div>

            {/* Scamadviser */}
            <div className="flex flex-col items-center">
              <span className="font-display text-2xl sm:text-3xl font-black text-black">100/100</span>
              <div className="mt-1 flex items-center gap-1 text-[#f59e0b] text-xs sm:text-sm font-bold">
                <ShieldCheck className="w-4 h-4 text-[#f59e0b]" />
                <span>Scamadviser</span>
              </div>
            </div>
          </div>

          {/* Google Verified */}
          <div className="flex flex-col items-center border-t border-black/10 pt-4 w-48">
            <span className="font-display text-2xl sm:text-3xl font-black text-black">4.8 / 5</span>
            <div className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm font-bold text-neutral-800">
              <GoogleGIcon />
              <span>Google Verified</span>
            </div>
          </div>
        </div>

        {/* 2 Exact Reviews */}
        <div className="flex flex-col gap-4 text-left">
          {/* Review 1 */}
          <div className="rounded-3xl border border-black/15 bg-white/80 backdrop-blur-xs p-6 shadow-xs">
            <div className="flex gap-1 text-amber-400 mb-3 text-sm">
              ★ ★ ★ ★ ★
            </div>
            <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-medium mb-5">
              "Honestly didn't expect much for the price, but the Virat Kohli Kit blew me away. The embroidery is spot on and the fit is perfect for 5-a-side."
            </p>
            <div className="flex items-center justify-between border-t border-black/5 pt-3">
              <div>
                <div className="text-sm font-bold text-black">Arun Choudhary</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mt-0.5">
                  VERIFIED BUYER
                </div>
              </div>
              <GoogleGIcon />
            </div>
          </div>

          {/* Review 2 */}
          <div className="rounded-3xl border border-black/15 bg-white/80 backdrop-blur-xs p-6 shadow-xs">
            <div className="flex gap-1 text-amber-400 mb-3 text-sm">
              ★ ★ ★ ★ ★
            </div>
            <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-medium mb-5">
              "Took advantage of the B2G1 offer. The material breathes really well, wore it for a full day tournament in the Mumbai heat and it held up great."
            </p>
            <div className="flex items-center justify-between border-t border-black/5 pt-3">
              <div>
                <div className="text-sm font-bold text-black">Karan S.</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mt-0.5">
                  VERIFIED BUYER
                </div>
              </div>
              <GoogleGIcon />
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        6. NEWSLETTER / VIP ACCESS
        ========================================================================
      */}
      <section className="max-w-2xl mx-auto my-12 sm:my-20 px-6 text-center">
        <div className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#d32f2f]">VIP CLUB</div>
        <h3 className="mt-2 font-display text-2xl sm:text-4xl font-black uppercase text-black leading-tight">
          GET 200rs Wallet Cash For your first order
        </h3>
        <p className="text-xs text-neutral-600 mt-1 mb-4 font-medium">Subscribe for early drop alerts, secret discount codes and restocks.</p>
        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const email = (form.elements.namedItem("newsletter_email") as HTMLInputElement)?.value;
            if (email) {
              alert("Welcome to the club! Check your inbox.");
              form.reset();
            }
          }}
        >
          <input
            name="newsletter_email"
            type="email"
            required
            placeholder="Enter your email address"
            className="flex-1 rounded-full border border-black/20 bg-white px-5 py-3 text-sm text-black outline-none focus:border-[#d32f2f] transition-colors"
          />
          <button
            type="submit"
            className="rounded-full bg-[#d32f2f] text-white px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-red-700 transition-colors shadow-md active:scale-95"
          >
            Join VIP
          </button>
        </form>
      </section>
    </div>
  );
}

const UnifiedShopByTeam = React.memo(function UnifiedShopByTeam() {
  const { combinedFootball, combinedF1, combinedB, combinedCricketIPL } = useTeams();
  const allTeams = useMemo(() => {
    return [
      ...combinedF1.map(([n, url]) => ({ name: n, logoUrl: url, category: "F1" })),
      ...combinedFootball.map(([n, url]) => ({ name: n, logoUrl: url, category: "Football" })),
      ...combinedCricketIPL.map(([n, url]) => ({ name: n, logoUrl: url, category: "Cricket" })),
      ...combinedB.map(([n, url]) => ({ name: n, logoUrl: url, category: "Basketball" })),
    ];
  }, [combinedFootball, combinedF1, combinedB, combinedCricketIPL]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 group">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-black tracking-wide text-black uppercase">
            SHOP BY TEAM
          </h2>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#d32f2f] font-bold mt-0.5">
            TAP A BADGE TO EXPLORE
          </p>
        </div>
      </div>

      {/* Continuously moving infinite marquee with eager-loaded logos */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] pb-1">
        <div 
          className="flex w-max animate-team-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused] cursor-pointer"
        >
          {[0, 1].map((copyIdx) => (
            <div key={copyIdx} className="flex shrink-0 gap-3.5 sm:gap-5 pr-3.5 sm:pr-5" aria-hidden={copyIdx > 0}>
              {allTeams.map((t, i) => {
                let shopPath = "/shop/football";
                if (t.category === "F1") shopPath = "/shop/f1";
                else if (t.category === "Basketball") shopPath = "/shop/basketball";
                else if (t.category === "Cricket") shopPath = "/shop/cricket";
                
                return (
                  <Link
                    key={`${t.name}-${copyIdx}-${i}`}
                    to={shopPath as never}
                    search={{ team: t.name } as never}
                    className="shrink-0 flex flex-col items-center gap-1.5 group/item w-[68px] sm:w-[86px]"
                  >
                    <div className="w-[68px] h-[68px] sm:w-[86px] sm:h-[86px] rounded-full bg-white border border-neutral-300 flex items-center justify-center p-3 sm:p-3.5 transition-all duration-300 group-hover/item:border-[#d32f2f] group-hover/item:scale-105 shadow-2xs">
                      <img
                        src={t.logoUrl}
                        alt={t.name}
                        loading="eager"
                        decoding="sync"
                        className="max-w-full max-h-full object-contain filter drop-shadow-xs transition-transform group-hover/item:scale-110"
                      />
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-center font-bold text-neutral-800 group-hover/item:text-[#d32f2f] leading-tight truncate w-full">
                      {t.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

function GoogleGIcon() {
  return (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function HotSellingSection() {
  const { products } = useCatalog();
  const { hotSellingIds, loaded } = useHotSelling();
  
  const hotProducts = useMemo(() => {
    if (!products.length) return [];
    if (hotSellingIds.length > 0) {
      const matched = hotSellingIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean) as typeof products;
      if (matched.length > 0) return matched;
    }
    // Fallback to top popular picks from products
    return products.slice(0, 10);
  }, [products, hotSellingIds]);

  if (!loaded && !products.length) return null;
  if (!hotProducts.length) return null;

  return (
    <section className="w-full bg-[#0a0a0a] text-white py-6 sm:py-8 overflow-hidden border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-4 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-neutral-400 mb-1">
          TRENDING NOW
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
          HOT <span className="italic font-black text-white">SELLING</span>
        </h2>
      </div>

      {/* Continuously Running Black Product Banner with immediate eager image loading */}
      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] pb-2">
        <div className="flex w-max animate-team-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused] cursor-pointer">
          {[0, 1].map((copyIdx) => (
            <div key={copyIdx} className="flex shrink-0 gap-3 sm:gap-4.5 pr-3 sm:pr-4.5" aria-hidden={copyIdx > 0}>
              {hotProducts.map((p, i) => (
                <div
                  key={`${p.id}-${copyIdx}-${i}`}
                  className="w-[200px] sm:w-[240px] shrink-0 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/40 transition-all p-3 sm:p-3.5 flex flex-col justify-between group shadow-xl"
                >
                  <Link
                    to="/product/$id"
                    params={{ id: p.id }}
                    className="relative aspect-square w-full rounded-xl bg-neutral-900 overflow-hidden flex items-center justify-center p-2 mb-2.5 cursor-pointer"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      loading="eager"
                      decoding="sync"
                      className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <div className="flex flex-col flex-1 justify-between px-0.5">
                    <div>
                      <h3 className="font-black text-sm sm:text-base uppercase text-white tracking-tight leading-tight truncate">
                        {p.team || p.name}
                      </h3>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 truncate mt-0.5">
                        {p.name}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
                      <span className="font-mono text-sm sm:text-base font-bold text-white">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                      <Link
                        to="/product/$id"
                        params={{ id: p.id }}
                        className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#d32f2f] hover:text-white transition group-hover:scale-105 shadow-md active:scale-95 cursor-pointer"
                        aria-label="View product"
                      >
                        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
