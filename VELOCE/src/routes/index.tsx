import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { ArrowUpRight, ChevronRight, ShieldCheck, CheckCircle2, ArrowRight, Zap, Trophy, Flame } from "lucide-react";
import { SiteChrome } from "@/components/chrome";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/lib/catalog-store";
import { useHotSelling } from "@/lib/hot-selling";
import { useTeams } from "@/lib/teams";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Veloce Wear — Built For The Game | Men's Sportswear & Matchwear" },
      {
        name: "description",
        content:
          "Men's performance sportswear and matchwear for Cricket, Football, Basketball & Formula 1. Premium breathable fabrics, athletic tailored fit, and museum-grade craftsmanship.",
      },
      { property: "og:title", content: "Veloce Wear — Built For The Game" },
      {
        property: "og:description",
        content: "Men's performance sportswear and matchwear for Cricket, Football, Basketball & Formula 1.",
      },
    ],
  }),
});

const SPORTS_COLLECTION = [
  {
    id: "cricket",
    name: "CRICKET",
    subtitle: "Matchday Kits",
    description: "Official team jerseys, player editions & training kits.",
    link: "/shop/cricket",
    image: "/images/nav-grid-cricket.webp",
    fallback: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=85",
    badge: "IPL & INTL",
    count: "40+ KITS",
  },
  {
    id: "football",
    name: "FOOTBALL",
    subtitle: "Club & National",
    description: "Authentic match-grade club kits and national jerseys.",
    link: "/shop/football",
    image: "/images/nav-grid-football.webp",
    fallback: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=85",
    badge: "2026/27 DROP",
    count: "150+ KITS",
  },
  {
    id: "basketball",
    name: "BASKETBALL",
    subtitle: "Court Editions",
    description: "Iconic swingman jerseys and oversized court matchwear.",
    link: "/shop/basketball",
    image: "/images/nav-grid-basketball.webp",
    fallback: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=85",
    badge: "CITY EDITIONS",
    count: "30+ KITS",
  },
  {
    id: "f1",
    name: "FORMULA 1",
    subtitle: "Paddock Teamwear",
    description: "Constructors jackets, driver polos & race day tees.",
    link: "/shop/f1",
    image: "/images/nav-grid-f1.webp",
    fallback: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=85",
    badge: "TEAM POLOS & TEES",
    count: "45+ KITS",
  },
];

const TRUST_POINTS = [
  { label: "COD AVAILABLE", sub: "Pay on delivery PAN India" },
  { label: "EASY EXCHANGE", sub: "7-Day hassle-free swap" },
  { label: "PREMIUM FABRIC", sub: "High-density breathable weave" },
  { label: "SECURE PAYMENTS", sub: "100% Encrypted UPI & cards" },
];

function Index() {
  return (
    <SiteChrome>
      <Home />
    </SiteChrome>
  );
}

function Home() {
  const { products } = useCatalog();
  const [selectedSportTab, setSelectedSportTab] = useState<string>("all");

  const curatedProducts = useMemo(() => {
    if (!products.length) return [];
    
    // Filter out accessories from main sport showcase
    let nonAccessories = products.filter(
      (p) =>
        p.category !== "accessories" &&
        (!p.tag || !p.tag.toLowerCase().includes("accessories"))
    );

    if (selectedSportTab === "cricket") {
      return nonAccessories.filter((p) => p.category === "cricket").slice(0, 12);
    }
    if (selectedSportTab === "football") {
      return nonAccessories.filter((p) => p.category === "football" || p.category === "worldcup").slice(0, 12);
    }
    if (selectedSportTab === "basketball") {
      return nonAccessories.filter((p) => p.category === "basketball").slice(0, 12);
    }
    if (selectedSportTab === "f1") {
      return nonAccessories.filter((p) => p.category === "f1").slice(0, 12);
    }

    // Default "all" - balanced mix across all 4 sports
    const cricket = nonAccessories.filter((p) => p.category === "cricket").slice(0, 3);
    const football = nonAccessories.filter((p) => p.category === "football").slice(0, 4);
    const basketball = nonAccessories.filter((p) => p.category === "basketball").slice(0, 2);
    const f1 = nonAccessories.filter((p) => p.category === "f1").slice(0, 3);
    
    const combined = [...cricket, ...football, ...basketball, ...f1];
    // Remove duplicates
    const seen = new Set<string>();
    return combined.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    }).slice(0, 12);
  }, [products, selectedSportTab]);

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#d32f2f] selection:text-white">
      <h1 className="sr-only">Veloce Wear — Built For The Game | Men's Sportswear</h1>

      {/* 
        ========================================================================
        1. HERO SECTION (Fully Tailored Responsive Hierarchy)
        - Compact, instant-impact 2x2 grid on Mobile
        - Widescreen editorial campaign on Desktop
        ========================================================================
      */}
      <section className="relative w-full overflow-hidden bg-[#fafafa] border-b border-black/10 pt-6 pb-8 sm:py-12 lg:py-16">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Desktop & Tablet Top Headline Block */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 sm:pb-8 border-b border-black/10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#d32f2f] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d32f2f] animate-pulse" />
                <span>MEN'S ATHLETIC & MATCHWEAR</span>
              </div>

              <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-black leading-[0.92]">
                BUILT FOR <br />
                <span className="text-[#d32f2f]">THE GAME.</span>
              </h2>

              <p className="mt-3 text-xs sm:text-base text-neutral-700 font-medium leading-relaxed max-w-xl">
                Men's performance wear for <strong className="text-black font-bold">Cricket, Football, Basketball & Formula 1</strong>. Engineered with matchday-grade breathable fabrics for athletic performance.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-2 px-7 sm:px-9 py-3.5 bg-[#d32f2f] text-white hover:bg-red-700 text-xs sm:text-sm font-bold uppercase tracking-[0.2em] transition-all rounded-full shadow-lg hover:shadow-red-500/20 active:scale-95 cursor-pointer"
              >
                <span>SHOP MEN'S</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#sports-grid"
                className="inline-flex items-center justify-center px-6 sm:px-7 py-3.5 bg-white border border-black/20 hover:border-black text-black text-xs sm:text-sm font-bold uppercase tracking-[0.16em] transition-all rounded-full active:scale-95"
              >
                EXPLORE SPORTS
              </a>
            </div>
          </div>

          {/* 
            ====================================================================
            FOUR SPORTS CARDS:
            - Mobile: Clean, compact 2x2 grid (all 4 sports visible immediately)
            - Desktop: High-impact 4-column cards with action imagery
            ====================================================================
          */}
          <div id="sports-grid" className="pt-6 sm:pt-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-600">
                FOUR DISCIPLINES • ONE ATELIER
              </div>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider text-[#d32f2f]">
                OFFICIAL MATCHWEAR
              </span>
            </div>

            {/* 2x2 Grid on Mobile, 4-Cols on Desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {SPORTS_COLLECTION.map((sport, index) => (
                <Link
                  key={sport.id}
                  to={sport.link as never}
                  className="group relative flex flex-col justify-end aspect-[4/5] sm:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-900 border border-black/10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Background Athlete Image */}
                  <img
                    src={sport.image}
                    alt={`${sport.name} Mens Sportswear`}
                    loading="eager"
                    decoding="sync"
                    className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.9] contrast-[1.05] group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      if (sport.fallback && e.currentTarget.src !== sport.fallback) {
                        e.currentTarget.src = sport.fallback;
                      }
                    }}
                  />

                  {/* Dark Gradient Overlay for Maximum Contrast & Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white">
                      {sport.badge}
                    </span>
                  </div>

                  {/* Bottom Content Plate */}
                  <div className="relative z-10 p-3 sm:p-5 flex flex-col">
                    <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-[#d32f2f] drop-shadow-sm">
                      {sport.subtitle}
                    </span>
                    
                    <div className="flex items-center justify-between mt-0.5 sm:mt-1">
                      <h3 className="font-display text-lg sm:text-2xl font-black uppercase text-white tracking-tight leading-none group-hover:text-red-400 transition-colors">
                        {sport.name}
                      </h3>
                      
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center group-hover:bg-[#d32f2f] group-hover:text-white transition-all duration-300 shrink-0">
                        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>

                    {/* Subtle "SHOP NOW" indicator */}
                    <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-neutral-300 group-hover:text-white transition-colors">
                      <span>SHOP COLLECTION</span>
                      <span className="text-[9px] text-neutral-400 font-mono hidden sm:inline">{sport.count}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        2. TRUST STRIP (Compact, high-confidence brand assurance)
        ========================================================================
      */}
      <section className="w-full bg-white border-b border-black/10 py-3.5 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {TRUST_POINTS.map((pt, i) => (
              <div key={i} className="flex items-center gap-2.5 py-1 px-2 rounded-xl bg-black/[0.02]">
                <div className="w-6 h-6 rounded-full bg-black/5 text-[#d32f2f] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-black truncate">
                    {pt.label}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-medium text-neutral-500 truncate">
                    {pt.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        3. SHOP THE GAME / FEATURED COLLECTION (Cross-Sport Products Showcase)
        ========================================================================
      */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-black/10 gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#d32f2f]">
              MATCHDAY PERFORMANCE
            </div>
            <h2 className="mt-1 font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-black">
              SHOP THE GAME
            </h2>
          </div>

          {/* Sport Filter Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: "all", label: "ALL SPORTS" },
              { id: "cricket", label: "CRICKET" },
              { id: "football", label: "FOOTBALL" },
              { id: "basketball", label: "BASKETBALL" },
              { id: "f1", label: "FORMULA 1" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedSportTab(tab.id)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedSportTab === tab.id
                    ? "bg-black text-white shadow-sm"
                    : "bg-black/5 hover:bg-black/10 text-neutral-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {curatedProducts.map((p, i) => (
            <ProductCard key={p.id} p={p} priority={i < 4} />
          ))}
          {curatedProducts.length === 0 && (
            <div className="col-span-full py-16 text-center text-neutral-600 bg-black/5 rounded-3xl border border-black/10">
              No products found in this category. Check back soon for new drops!
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-white hover:bg-[#d32f2f] text-xs font-bold uppercase tracking-[0.2em] transition-all rounded-full shadow-md active:scale-95"
          >
            <span>VIEW ALL MEN'S SPORTSWEAR</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 
        ========================================================================
        4. SHOP BY TEAM (Continuous Marquee)
        ========================================================================
      */}
      <div className="w-full bg-white py-4 sm:py-5 border-y border-black/10">
        <UnifiedShopByTeam />
      </div>

      {/* 
        ========================================================================
        5. HOT SELLING SECTION
        ========================================================================
      */}
      <HotSellingSection />

      {/* 
        ========================================================================
        6. THE VELOCE STANDARD (Brand Storytelling)
        ========================================================================
      */}
      <section className="max-w-4xl mx-auto my-8 sm:my-16 px-6 text-center border-y border-black/10 py-12 sm:py-16">
        <div className="text-[10px] uppercase tracking-[0.32em] font-bold text-[#d32f2f]">
          The Veloce Standard
        </div>
        <p className="mt-4 font-display text-xl sm:text-3xl leading-snug tracking-tight text-balance text-black font-bold">
          "Engineered for intense matchdays and everyday athletic lifestyle. Built with high-grade breathable weaves, precision crest embroidery and player-tailored ergonomics."
        </p>
        <div className="mt-4 text-xs uppercase tracking-[0.24em] text-neutral-600 font-semibold">
          — Veloce Sports Atelier
        </div>
      </section>

      {/* 
        ========================================================================
        7. CERTIFIED AUTHENTIC & SAFE REVIEWS
        ========================================================================
      */}
      <section className="max-w-xl mx-auto my-12 sm:my-16 px-4 sm:px-6 text-center">
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

        {/* 2 Exact Verified Reviews */}
        <div className="flex flex-col gap-4 text-left">
          {/* Review 1 */}
          <div className="rounded-3xl border border-black/15 bg-white/80 backdrop-blur-xs p-6 shadow-xs">
            <div className="flex gap-1 text-amber-400 mb-3 text-sm">
              ★ ★ ★ ★ ★
            </div>
            <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-medium mb-5">
              "Honestly didn't expect much for the price, but the Virat Kohli Cricket Kit blew me away. The embroidery is spot on and the fit is perfect for 5-a-side."
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
              "Took advantage of the B2G1 offer. The material breathes really well, wore it for a full day match in the Mumbai heat and it held up great."
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
        8. VIP ACCESS / NEWSLETTER
        ========================================================================
      */}
      <section className="max-w-2xl mx-auto my-12 sm:my-20 px-6 text-center">
        <div className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#d32f2f]">VIP CLUB</div>
        <h3 className="mt-2 font-display text-2xl sm:text-4xl font-black uppercase text-black leading-tight">
          GET ₹200 WALLET CASH FOR YOUR FIRST ORDER
        </h3>
        <p className="text-xs text-neutral-600 mt-1 mb-4 font-medium">
          Subscribe for early matchwear drop alerts, secret discount codes and restocks.
        </p>
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
            className="rounded-full bg-[#d32f2f] text-white px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-red-700 transition-colors shadow-md active:scale-95 cursor-pointer"
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
      ...combinedCricketIPL.map(([n, url]) => ({ name: n, logoUrl: url, category: "Cricket" })),
      ...combinedFootball.map(([n, url]) => ({ name: n, logoUrl: url, category: "Football" })),
      ...combinedB.map(([n, url]) => ({ name: n, logoUrl: url, category: "Basketball" })),
      ...combinedF1.map(([n, url]) => ({ name: n, logoUrl: url, category: "F1" })),
    ];
  }, [combinedFootball, combinedF1, combinedB, combinedCricketIPL]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 group">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3">
        <div>
          <h2 className="font-display text-lg sm:text-xl font-black tracking-wide text-black uppercase">
            SHOP BY TEAM & CREST
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
                if (t.category === "Cricket") shopPath = "/shop/cricket";
                else if (t.category === "Basketball") shopPath = "/shop/basketball";
                else if (t.category === "F1") shopPath = "/shop/f1";
                
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
          HOT <span className="italic font-black text-[#d32f2f]">SELLING</span>
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
