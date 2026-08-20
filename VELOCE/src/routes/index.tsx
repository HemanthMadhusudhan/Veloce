import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useMemo } from "react";
import { Search, ArrowUpRight, ChevronRight, Pause, Play, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SiteChrome } from "@/components/chrome";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/lib/catalog-store";
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

  const heroPcMediaUrl = siteImages.get("hero-video-pc") || siteImages.get("hero-video");
  const heroMobileMediaUrl = siteImages.get("hero-video-mobile") || heroPcMediaUrl;

  const featured1PcMediaUrl = siteImages.get("featured-1-pc") || siteImages.get("featured-1");
  const featured1MobileMediaUrl = siteImages.get("featured-1-mobile") || featured1PcMediaUrl;

  const featured2PcMediaUrl = siteImages.get("featured-2-pc") || siteImages.get("featured-2");
  const featured2MobileMediaUrl = siteImages.get("featured-2-mobile") || featured2PcMediaUrl;

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
      <section className="relative w-full h-[70vh] sm:h-[88vh] lg:h-[95vh] min-h-[500px] bg-black overflow-hidden group">
        <Link to="/new-kits" className="block w-full h-full cursor-pointer">
          {/* Mobile View Hero Banner */}
          <div className="block md:hidden w-full h-full">
            {heroMobileMediaUrl && isVideoUrl(heroMobileMediaUrl) ? (
              <video
                src={heroMobileMediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
              />
            ) : (
              <img
                src={heroMobileMediaUrl || dualFootball}
                alt="Veloce Wear Campaign Hero Mobile"
                className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
                loading="eager"
              />
            )}
          </div>

          {/* PC / Desktop View Hero Banner */}
          <div className="hidden md:block w-full h-full">
            {heroPcMediaUrl && isVideoUrl(heroPcMediaUrl) ? (
              <video
                src={heroPcMediaUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
              />
            ) : (
              <img
                src={heroPcMediaUrl || dualFootball}
                alt="Veloce Wear Campaign Hero Desktop"
                className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
                loading="eager"
              />
            )}
          </div>
        </Link>
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
          
          {/* Featured Card 1 - Formula 1 (Edge to Edge, Video or Photo support) */}
          <Link to="/shop/f1" className="relative w-full aspect-[4/5] sm:aspect-[4/3] overflow-hidden bg-neutral-900 flex flex-col justify-end p-6 sm:p-10 border-0 rounded-none m-0 group cursor-pointer">
            {/* Mobile View Media */}
            <div className="block md:hidden absolute inset-0 w-full h-full">
              {featured1MobileMediaUrl && isVideoUrl(featured1MobileMediaUrl) ? (
                <video
                  src={featured1MobileMediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <img
                  src={featured1MobileMediaUrl || dualF1}
                  alt="Formula 1 Store Mobile"
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
              )}
            </div>

            {/* PC / Desktop View Media */}
            <div className="hidden md:block absolute inset-0 w-full h-full">
              {featured1PcMediaUrl && isVideoUrl(featured1PcMediaUrl) ? (
                <video
                  src={featured1PcMediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <img
                  src={featured1PcMediaUrl || dualF1}
                  alt="Formula 1 Store Desktop"
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            <div className="relative z-10 text-white">
              <span className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-wider block mb-1">
                Formula 1 Collection
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4">
                Formula 1 Store
              </h3>
              <span className="px-6 py-2.5 bg-white text-black group-hover:bg-neutral-200 text-xs sm:text-sm font-bold rounded-full transition-transform active:scale-95 inline-block shadow-md">
                Shop Formula 1
              </span>
            </div>
          </Link>

          {/* Featured Card 2 - Cricket Section (Edge to Edge, Video or Photo support) */}
          <Link to="/shop/cricket" className="relative w-full aspect-[4/5] sm:aspect-[4/3] overflow-hidden bg-neutral-900 flex flex-col justify-end p-6 sm:p-10 border-0 rounded-none m-0 group cursor-pointer">
            {/* Mobile View Media */}
            <div className="block md:hidden absolute inset-0 w-full h-full">
              {featured2MobileMediaUrl && isVideoUrl(featured2MobileMediaUrl) ? (
                <video
                  src={featured2MobileMediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <img
                  src={featured2MobileMediaUrl || dualFootball}
                  alt="Cricket Section Mobile"
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
              )}
            </div>

            {/* PC / Desktop View Media */}
            <div className="hidden md:block absolute inset-0 w-full h-full">
              {featured2PcMediaUrl && isVideoUrl(featured2PcMediaUrl) ? (
                <video
                  src={featured2PcMediaUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <img
                  src={featured2PcMediaUrl || dualFootball}
                  alt="Cricket Section Desktop"
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
              )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            <div className="relative z-10 text-white">
              <span className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-wider block mb-1">
                Official Cricket Apparel
              </span>
              <h3 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-4">
                Cricket Section
              </h3>
              <span className="px-6 py-2.5 bg-white text-black group-hover:bg-neutral-200 text-xs sm:text-sm font-bold rounded-full transition-transform active:scale-95 inline-block shadow-md">
                Shop Cricket
              </span>
            </div>
          </Link>

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
        SHOP BY TEAM (Continuous Marquee)
        ========================================================================
      */}
      <div className="w-full bg-white py-6 border-b border-black/10">
        <UnifiedShopByTeam />
      </div>

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
