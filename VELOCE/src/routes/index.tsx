import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useMemo } from "react";
import { Search, ArrowUpRight, ChevronRight, Pause, Play, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SiteChrome } from "@/components/chrome";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/lib/catalog-store";
import { useHotSelling } from "@/lib/hot-selling";
import { useTeams } from "@/lib/teams";
import { useShop } from "@/lib/store";
import { useSiteImages } from "@/lib/site-images";

import dualFootball from "@/assets/dual-football.jpg";
import dualF1 from "@/assets/dual-f1.jpg";
import heroBg from "@/assets/hero-bg.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Veloce Wear — Wear The Game | Authentic Sports & Matchday Jerseys" },
      {
        name: "description",
        content:
          "Men's authentic performance sportswear and matchwear for Football, Cricket, Basketball & Formula 1. Engineered for movement, comfort, and identity.",
      },
      { property: "og:title", content: "Veloce Wear — Wear The Game" },
      {
        property: "og:description",
        content: "Men's authentic performance sportswear for Football, Cricket, Basketball & Formula 1.",
      },
    ],
  }),
});

const SPOTLIGHT_CATEGORIES = [
  {
    id: "football",
    title: "Football Kits",
    link: "/shop/football",
    image: "/products/standardized/arsenal-home-player-version-26-27-main.webp",
    fallback: dualFootball,
  },
  {
    id: "cricket",
    title: "Cricket Kits",
    link: "/shop/cricket",
    image: "/products/standardized/india-t20-cricket-jersey-2026-main.webp",
    fallback: product1,
  },
  {
    id: "f1",
    title: "Formula 1 Tees",
    link: "/shop/f1",
    image: "/products/standardized/carlos-sainz-f1-oversized-t-shirt-smooth-operator-0.webp",
    fallback: dualF1,
  },
  {
    id: "basketball",
    title: "Basketball Jerseys",
    link: "/shop/basketball",
    image: "/products/standardized/boston-celtics-jayson-tatum-dri-fit-nba-swingman-icon-edition-jersey-green-0.webp",
    fallback: product2,
  },
  {
    id: "player",
    title: "Player Editions",
    link: "/shop?tag=player-version",
    image: "/products/standardized/ac-milan-home-player-version-26-27-main.webp",
    fallback: product3,
  },
  {
    id: "worldcup",
    title: "World Cup Kits",
    link: "/shop/worldcup",
    image: "/products/standardized/argentina-home-player-version-wc-26-27-main.webp",
    fallback: product4,
  },
  {
    id: "retro",
    title: "Retro Classics",
    link: "/shop/retro",
    image: "/products/standardized/argentina-home-2006-retro-main.webp",
    fallback: dualFootball,
  },
  {
    id: "caps",
    title: "Caps & Accessories",
    link: "/shop/accessories",
    image: "/products/standardized/cricket-australia-t20-25-26-cap-main.webp",
    fallback: product1,
  },
  {
    id: "oversized",
    title: "Oversized Tees",
    link: "/shop?tag=oversized",
    image: "/products/standardized/chicago-bulls-nba-championship-oversized-t-shirt-black-main.webp",
    fallback: product2,
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
  const { openSearch } = useShop();
  const siteImages = useSiteImages();
  const navigate = useNavigate();
  const [selectedSportTab, setSelectedSportTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const heroMediaUrl = siteImages.get("hero-video");
  const featured1MediaUrl = siteImages.get("featured-1");
  const featured2MediaUrl = siteImages.get("featured-2");

  const isVideoUrl = (url?: string) => {
    if (!url) return false;
    const clean = url.toLowerCase();
    return (
      clean.endsWith(".mp4") ||
      clean.endsWith(".webm") ||
      clean.endsWith(".ogg") ||
      clean.endsWith(".mov") ||
      clean.includes("player.vimeo.com") ||
      clean.includes("youtube.com/embed") ||
      clean.startsWith("data:video/")
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/shop", search: { q: searchQuery.trim() } as never });
    } else {
      openSearch();
    }
  };

  const bestsellers = useMemo(() => {
    if (!products.length) return [];
    return products.slice(0, 8);
  }, [products]);

  const curatedProducts = useMemo(() => {
    if (!products.length) return [];
    
    const nonAccessories = products.filter(
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

    const cricket = nonAccessories.filter((p) => p.category === "cricket").slice(0, 4);
    const football = nonAccessories.filter((p) => p.category === "football").slice(0, 6);
    const basketball = nonAccessories.filter((p) => p.category === "basketball").slice(0, 2);
    const f1 = nonAccessories.filter((p) => p.category === "f1").slice(0, 2);
    
    const combined = [...cricket, ...football, ...basketball, ...f1, ...nonAccessories];
    const seen = new Set<string>();
    return combined.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    }).slice(0, 12);
  }, [products, selectedSportTab]);

  return (
    <div className="min-h-screen bg-white text-black selection:bg-[#d32f2f] selection:text-white">
      <h1 className="sr-only">Veloce Wear — Wear The Game | Premium Sports Jerseys</h1>

      {/* 
        ========================================================================
        MAIN HERO SECTION (Clean Full-Width Full-Height Video / Media Banner)
        - Video / Photo background support (admin panel configurable via 'hero-video' slot)
        - Full viewport height on PC version (h-[95vh])
        - Clean edge-to-edge video player with autoPlay, loop, muted & playsInline
        ========================================================================
      */}
      <section className="relative w-full h-[70vh] sm:h-[88vh] lg:h-[95vh] min-h-[500px] bg-black overflow-hidden">
        {heroMediaUrl && isVideoUrl(heroMediaUrl) ? (
          <video
            src={heroMediaUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={heroMediaUrl || dualFootball}
            alt="Veloce Wear Campaign Hero"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
        )}
      </section>

      {/* 
        ========================================================================
        FEATURED SECTION (Directly below Hero - Configurable via 'featured-1' & 'featured-2' Admin Slots)
        - 100% FULL-WIDTH EDGE-TO-EDGE VIDEO OR PHOTO
        - NO ROUNDED CORNERS (rounded-none), NO MARGINS, NO PADDING, NO GAPS
        ========================================================================
      */}
      <section className="w-full bg-white py-0 my-0">
        <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-black tracking-tight px-6 pt-8 pb-4">
          Featured
        </h2>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 p-0 m-0">
          
          {/* Featured Card 1 (Edge to Edge, Video or Photo support) */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] overflow-hidden bg-neutral-900 flex flex-col justify-end p-6 sm:p-10 border-0 rounded-none m-0">
            {featured1MediaUrl && isVideoUrl(featured1MediaUrl) ? (
              <video
                src={featured1MediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
              />
            ) : (
              <img
                src={featured1MediaUrl || dualFootball}
                alt="Training Apparel"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            <div className="relative z-10 text-white">
              <span className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-wider block mb-1">
                Training Apparel
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4">
                All Work, No Sweat
              </h3>
              <Link
                to="/shop/football"
                className="px-6 py-2.5 bg-white text-black hover:bg-neutral-200 text-xs sm:text-sm font-bold rounded-full transition-transform active:scale-95 inline-block cursor-pointer shadow-md"
              >
                Shop
              </Link>
            </div>
          </div>

          {/* Featured Card 2 (Edge to Edge, Video or Photo support) */}
          <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] overflow-hidden bg-neutral-900 flex flex-col justify-end p-6 sm:p-10 border-0 rounded-none m-0">
            {featured2MediaUrl && isVideoUrl(featured2MediaUrl) ? (
              <video
                src={featured2MediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
              />
            ) : (
              <img
                src={featured2MediaUrl || dualF1}
                alt="Studio Matchwear"
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.85] contrast-[1.05]"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            <div className="relative z-10 text-white">
              <span className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-wider block mb-1">
                It's Just a Matchwear Until It's Not
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4">
                Studio Matchwear
              </h3>
              <Link
                to="/shop/f1"
                className="px-6 py-2.5 bg-white text-black hover:bg-neutral-200 text-xs sm:text-sm font-bold rounded-full transition-transform active:scale-95 inline-block cursor-pointer shadow-md"
              >
                Shop
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 
        ========================================================================
        BESTSELLERS SECTION (Matching Nike Reference Screenshot 2)
        - Headline: Bestsellers
        - Product cards carousel / grid with price ₹ formatting
        ========================================================================
      */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 border-t border-black/10">
        <h2 className="font-display text-3xl sm:text-4xl font-black text-black tracking-tight mb-6 sm:mb-8">
          Bestsellers
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((p, i) => (
            <ProductCard key={p.id} p={p} priority={i < 4} />
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        TRUST STRIP
        ========================================================================
      */}
      <section className="w-full bg-neutral-50 border-y border-black/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {TRUST_POINTS.map((pt, i) => (
              <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white border border-black/5">
                <div className="w-7 h-7 rounded-full bg-[#d32f2f]/10 text-[#d32f2f] flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-black truncate">
                    {pt.label}
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-medium text-neutral-500 truncate">
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
        SHOP BY TEAM (Continuous Marquee)
        ========================================================================
      */}
      <div className="w-full bg-white py-6 border-b border-black/10">
        <UnifiedShopByTeam />
      </div>

      {/* 
        ========================================================================
        HOT SELLING SECTION
        ========================================================================
      */}
      <HotSellingSection />

      {/* 
        ========================================================================
        BRAND STATEMENT ("MOVE DIFFERENT.")
        ========================================================================
      */}
      <section className="max-w-5xl mx-auto my-12 sm:my-18 px-6 text-center border-y border-black/10 py-12 sm:py-16">
        <div className="text-[11px] uppercase tracking-[0.3em] font-black text-[#d32f2f] mb-3">
          BRAND STATEMENT
        </div>

        <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-black mb-4">
          MOVE DIFFERENT.
        </h2>

        <p className="font-display text-lg sm:text-3xl leading-snug tracking-tight text-balance text-black font-bold max-w-3xl mx-auto">
          "Veloce is built for people who don't just watch the game. They wear it."
        </p>

        <div className="mt-6 text-xs uppercase tracking-[0.25em] text-neutral-600 font-semibold">
          — VELOCE SPORTS ATELIER
        </div>
      </section>

      {/* 
        ========================================================================
        CERTIFIED AUTHENTIC & VERIFIED REVIEWS
        ========================================================================
      */}
      <section className="max-w-2xl mx-auto my-12 sm:my-16 px-4 sm:px-6 text-center">
        <div className="mb-8 flex flex-col items-center">
          <div className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-600 mb-5">
            CERTIFIED AUTHENTIC & SAFE
          </div>

          <div className="flex items-center justify-center gap-12 sm:gap-16 w-full mb-6">
            <div className="flex flex-col items-center">
              <span className="font-display text-3xl font-black text-black">4.9 / 5</span>
              <div className="mt-1 flex items-center gap-1 text-[#00b67a] text-xs font-bold">
                <span className="text-[#00b67a] text-base leading-none">★</span>
                <span>Trustpilot</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <span className="font-display text-3xl font-black text-black">100/100</span>
              <div className="mt-1 flex items-center gap-1 text-[#f59e0b] text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-[#f59e0b]" />
                <span>Scamadviser</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-left">
          <div className="rounded-2xl border border-black/15 bg-white p-6 shadow-xs">
            <div className="flex gap-1 text-amber-400 mb-3 text-sm">
              ★ ★ ★ ★ ★
            </div>
            <p className="text-xs sm:text-base text-neutral-800 leading-relaxed font-medium mb-4">
              "Honestly didn't expect much for the price, but the Virat Kohli Cricket Kit blew me away. The embroidery is spot on and the fit is perfect for 5-a-side."
            </p>
            <div className="flex items-center justify-between border-t border-black/5 pt-3">
              <div>
                <div className="text-xs sm:text-sm font-bold text-black">Arun Choudhary</div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 mt-0.5">
                  VERIFIED BUYER
                </div>
              </div>
            </div>
          </div>
        </div>
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
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 group">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-3">
        <div>
          <h2 className="font-display text-base sm:text-xl font-black tracking-wide text-black uppercase">
            SHOP BY TEAM & CREST
          </h2>
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#d32f2f] font-bold mt-0.5">
            TAP A BADGE TO EXPLORE
          </p>
        </div>
      </div>

      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] pb-1">
        <div 
          className="flex w-max animate-team-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused] cursor-pointer"
        >
          {[0, 1].map((copyIdx) => (
            <div key={copyIdx} className="flex shrink-0 gap-3 sm:gap-5 pr-3 sm:pr-5" aria-hidden={copyIdx > 0}>
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
                    className="shrink-0 flex flex-col items-center gap-1.5 group/item w-[64px] sm:w-[86px]"
                  >
                    <div className="w-[64px] h-[64px] sm:w-[86px] sm:h-[86px] rounded-full bg-white border border-neutral-300 flex items-center justify-center p-2.5 sm:p-3.5 transition-all duration-300 group-hover/item:border-[#d32f2f] group-hover/item:scale-105 shadow-2xs">
                      <img
                        src={t.logoUrl}
                        alt={t.name}
                        loading="eager"
                        decoding="sync"
                        className="max-w-full max-h-full object-contain filter drop-shadow-xs transition-transform group-hover/item:scale-110"
                      />
                    </div>
                    <span className="text-[9px] sm:text-[11px] text-center font-bold text-neutral-800 group-hover/item:text-[#d32f2f] leading-tight truncate w-full">
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
    return products.slice(0, 10);
  }, [products, hotSellingIds]);

  if (!loaded && !products.length) return null;
  if (!hotProducts.length) return null;

  return (
    <section className="w-full bg-[#0a0a0a] text-white py-6 sm:py-10 overflow-hidden border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 text-center">
        <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-1">
          TRENDING NOW
        </div>
        <h2 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
          HOT <span className="italic font-black text-[#d32f2f]">SELLING</span>
        </h2>
      </div>

      <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] pb-2">
        <div className="flex w-max animate-team-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused] cursor-pointer">
          {[0, 1].map((copyIdx) => (
            <div key={copyIdx} className="flex shrink-0 gap-3 sm:gap-4.5 pr-3 sm:pr-4.5" aria-hidden={copyIdx > 0}>
              {hotProducts.map((p, i) => (
                <div
                  key={`${p.id}-${copyIdx}-${i}`}
                  className="w-[180px] sm:w-[240px] shrink-0 rounded-2xl bg-[#141414] border border-white/10 hover:border-white/40 transition-all p-3 sm:p-3.5 flex flex-col justify-between group shadow-xl"
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
                      <h3 className="font-black text-xs sm:text-base uppercase text-white tracking-tight leading-tight truncate">
                        {p.team || p.name}
                      </h3>
                      <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400 truncate mt-0.5">
                        {p.name}
                      </p>
                    </div>

                    <div className="mt-2.5 sm:mt-[#d32f2f] pt-2 sm:pt-2.5 border-t border-white/10 flex items-center justify-between">
                      <span className="font-mono text-xs sm:text-base font-bold text-white">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                      <Link
                        to="/product/$id"
                        params={{ id: p.id }}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-[#d32f2f] hover:text-white transition group-hover:scale-105 shadow-md active:scale-95 cursor-pointer"
                        aria-label="View product"
                      >
                        <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
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
