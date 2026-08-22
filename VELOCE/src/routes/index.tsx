import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Search, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play, ShieldCheck, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { SiteChrome } from "@/components/chrome";
import { ProductCard } from "@/components/ProductCard";
import { useCatalog } from "@/lib/catalog-store";
import { useTeams } from "@/lib/teams";
import { getShortTeamName } from "@/lib/logos";
import { useShop } from "@/lib/store";
import { useSiteImages } from "@/lib/site-images";
import { slugify } from "@/lib/slugify";

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
      { title: "Buy Football Jerseys Online India | 1:1 Authentic Player & Fan Kits — Veloce Wear" },
      {
        name: "description",
        content:
          "Shop 1:1 authentic football jerseys online in India. Real Madrid, Barcelona, Arsenal, Man United, Liverpool, retro kits, F1 shirts & cricket jerseys. Fast Pan-India shipping & COD available.",
      },
      {
        name: "keywords",
        content:
          "football jerseys, buy football jersey india, real madrid jersey, barcelona jersey, arsenal jersey, new football kits 2026/27, retro jerseys india, f1 t shirts india, cheap football jerseys, player version jerseys, cricket jerseys india",
      },
      { property: "og:title", content: "Buy Football Jerseys Online India | 1:1 Authentic Player & Fan Kits — Veloce Wear" },
      {
        property: "og:description",
        content: "Shop 1:1 authentic football jerseys, Formula 1 team tees, and cricket gear online in India with free express shipping & COD.",
      },
      { property: "og:image", content: "https://velocewear.shop/logo.png" },
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

const BESTSELLER_SLUGS = [
  "puma-x-rcb-2026-men-s-vk18-official-jersey",
  "puma-x-rcb-2026-men-s-relaxed-fit-shirt",
  "real-madrid-mens-home-authentic-jersey-26-27-white",
  "barcelona-ucl-men-s-home-jersey-26-27-fc-barcelona",
  "manchester-city-home-long-sleeve-jersey-26-27",
  "bayern-munich-men-authentic-jersey-home-26-27",
  "arsenal-adidas-26-27-authentic-away-shirt",
  "lewis-hamilton-ferrari-f1-oversized-t-shirt",
  "lewis-hamilton-ferrari-f1-polo-shirt",
  "dhoni-csk-match-jersey-2026",
  "mumbai-indians-home-kit-2026",
  "puma-x-rcb-2026-men-s-official-match-jersey-green",
  "psg-nike-home-stadium-shirt-26-27",
  "bayern-munich-men-authentic-long-sleeve-jersey-away-26-27",
  "japan-away-player-version-26-27",
  "argentina-50th-anniversary-player-version-24-25",
  "lamine-yamal-version-spain-away-jersey-26-27",
  "puma-x-rcb-2026-men-s-printed-vintage-tee-red",
  "indian-cricket-jersey-one-day-champion-s-trophy-25",
  "mbappe-france-home-2024-kit",
  "juventus-away-player-version-24-25",
  "real-madrid-mens-away-authentic-jersey-long-sleeve-green-26-27",
];

interface BannerItem {
  id: string;
  url: string;
  fallback: string;
  link: string;
  title: string;
  isVideo: boolean;
}

function MobileHeroCarousel({
  siteImages,
  isVideoUrl,
}: {
  siteImages: ReturnType<typeof useSiteImages>;
  isVideoUrl: (url?: string) => boolean;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // 5 Mobile Banners configured via site images / defaults
  const banners = useMemo<BannerItem[]>(() => {
    const raw1 = siteImages.get("hero-video-mobile") || siteImages.get("hero-video-mobile-1") || siteImages.get("hero-video");
    const raw2 = siteImages.get("hero-video-mobile-2");
    const raw3 = siteImages.get("hero-video-mobile-3");
    const raw4 = siteImages.get("hero-video-mobile-4");
    const raw5 = siteImages.get("hero-video-mobile-5");

    const fallback1 = "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/hero-video-mobile/1787332663765.webp";
    const fallback2 = "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/banner:football/1786005500700.webp";
    const fallback3 = "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/banner:f1/1786005520068.webp";
    const fallback4 = "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/team-Real%20Madrid-mobile/1786463974553.webp";
    const fallback5 = "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/category-new-kits-mobile/1786464263659.webp";

    const url1 = raw1 || fallback1;
    const url2 = raw2 || fallback2;
    const url3 = raw3 || fallback3;
    const url4 = raw4 || fallback4;
    const url5 = raw5 || fallback5;

    return [
      {
        id: "banner-1",
        url: url1,
        fallback: dualFootball,
        link: "/new-kits",
        title: "New 2026/27 Kits",
        isVideo: isVideoUrl(url1),
      },
      {
        id: "banner-2",
        url: url2,
        fallback: dualFootball,
        link: "/shop/football",
        title: "Football Kits",
        isVideo: isVideoUrl(url2),
      },
      {
        id: "banner-3",
        url: url3,
        fallback: dualF1,
        link: "/shop/f1",
        title: "Formula 1 Store",
        isVideo: isVideoUrl(url3),
      },
      {
        id: "banner-4",
        url: url4,
        fallback: product1,
        link: "/shop/cricket",
        title: "Cricket Matchwear",
        isVideo: isVideoUrl(url4),
      },
      {
        id: "banner-5",
        url: url5,
        fallback: product3,
        link: "/player-version",
        title: "Player Version",
        isVideo: isVideoUrl(url5),
      },
    ];
  }, [siteImages, isVideoUrl]);

  const nextSlide = useCallback(() => {
    setProgress(0);
    setActiveIdx((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setProgress(0);
    setActiveIdx((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Video play/pause on slide change or pause toggle
  useEffect(() => {
    const currentBanner = banners[activeIdx];
    const vid = videoRefs.current[activeIdx];
    if (vid && currentBanner?.isVideo) {
      if (isPaused) {
        vid.pause();
      } else {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
    }
  }, [activeIdx, isPaused, banners]);

  // Slide countdown & progress animation
  useEffect(() => {
    if (isPaused) return;

    const currentBanner = banners[activeIdx];
    const isVideo = currentBanner?.isVideo;
    const duration = isVideo ? 15000 : 3000;
    const intervalTime = 30;
    const step = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          nextSlide();
          return 0;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [activeIdx, isPaused, banners, nextSlide]);

  const handleVideoEnded = () => {
    nextSlide();
  };

  const handleVideoError = () => {
    nextSlide();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // SVG circular circumference for r=11: 2 * PI * 11 ≈ 69.115
  const circumference = 69.115;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 5 Fade Banners Carousel */}
      <div className="relative w-full h-full">
        {banners.map((b, idx) => {
          const isActive = idx === activeIdx;
          return (
            <div
              key={b.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              <Link to={b.link} className="block w-full h-full relative cursor-pointer group">
                {b.isVideo ? (
                  <video
                    ref={(el) => {
                      videoRefs.current[idx] = el;
                    }}
                    src={b.url}
                    autoPlay={isActive && !isPaused}
                    muted
                    playsInline
                    preload="auto"
                    poster={b.fallback}
                    onEnded={handleVideoEnded}
                    onError={handleVideoError}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={b.url || b.fallback}
                    alt={b.title}
                    className="w-full h-full object-cover object-center"
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                )}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Circular Carousel Controls: [Pause/Play with Progress Ring] [< Prev] [> Next] */}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-30 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {/* Pause / Play Button with Animated Countdown Progress Ring */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsPaused((prev) => !prev);
          }}
          className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-md text-white shadow-md active:scale-90 transition cursor-pointer"
          aria-label={isPaused ? "Play hero carousel" : "Pause hero carousel"}
        >
          <svg className="absolute inset-0 w-full h-full -rotate-90 p-[1px]" viewBox="0 0 28 28">
            <circle
              cx="14"
              cy="14"
              r="11"
              fill="none"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth="2"
            />
            <circle
              cx="14"
              cy="14"
              r="11"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-75 ease-linear"
            />
          </svg>
          {isPaused ? (
            <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white ml-0.5 fill-white" />
          ) : (
            <Pause className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white fill-white" />
          )}
        </button>

        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
          }}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/80 hover:bg-white text-black backdrop-blur-md shadow-md active:scale-90 transition cursor-pointer"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
        </button>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
          }}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/80 hover:bg-white text-black backdrop-blur-md shadow-md active:scale-90 transition cursor-pointer"
          aria-label="Next slide"
        >
          <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
}

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

  const featured1PcMediaUrl = siteImages.get("featured-1-pc") || siteImages.get("featured-1");
  const featured1MobileMediaUrl = siteImages.get("featured-1-mobile");

  const featured2PcMediaUrl = siteImages.get("featured-2-pc") || siteImages.get("featured-2");
  const featured2MobileMediaUrl = siteImages.get("featured-2-mobile");

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

  // Fixed static Bestsellers list with the 21 specified products in exact order
  const bestsellers = useMemo(() => {
    if (!products.length) return [];

    const productMap = new Map<string, (typeof products)[0]>();
    for (const p of products) {
      if (p.id) productMap.set(p.id.toLowerCase(), p);
      if (p.slug) productMap.set(p.slug.toLowerCase(), p);
      if (p.name) productMap.set(slugify(p.name).toLowerCase(), p);
    }

    return BESTSELLER_SLUGS.map((slug) => productMap.get(slug.toLowerCase())).filter(
      (p): p is (typeof products)[0] => p !== undefined
    );
  }, [products]);

  const curatedProducts = useMemo(() => {
    if (!products.length) return [];
    
    const nonAccessories = products.filter(
      (p) =>
        p.category !== "accessories" &&
        (!p.tag || !p.tag.toLowerCase().includes("accessories"))
    );

    if (selectedSportTab === "cricket") {
      const isRCB = (p: (typeof products)[0]) => {
        const t = (p.team || "").toLowerCase();
        const n = (p.name || "").toLowerCase();
        const id = (p.id || "").toLowerCase();
        return (
          t.includes("rcb") ||
          t.includes("royal challengers") ||
          t.includes("bengaluru") ||
          t.includes("bangalore") ||
          n.includes("rcb") ||
          n.includes("royal challengers") ||
          id.includes("rcb") ||
          id.includes("royal-challengers")
        );
      };
      const cricketAll = nonAccessories.filter((p) => p.category === "cricket");
      const rcb = cricketAll.filter(isRCB);
      const rest = cricketAll.filter((p) => !isRCB(p));
      return [...rcb, ...rest].slice(0, 12);
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
        MAIN HERO SECTION
        - Mobile View: 5 Scrolling Banners Carousel (3s for images, onEnded for videos)
        - Desktop / PC View: Full Viewport Height (h-[95vh]) Edge-to-Edge Hero Banner
        ========================================================================
      */}
      <section className="relative w-full h-[62vh] sm:h-[75vh] md:h-[88vh] lg:h-[95vh] min-h-[480px] sm:min-h-[540px] md:min-h-[600px] max-h-[580px] sm:max-h-none bg-black overflow-hidden group">
        {/* Mobile View: 5 Scrolling Banners Carousel */}
        <div className="block md:hidden w-full h-full">
          <MobileHeroCarousel siteImages={siteImages} isVideoUrl={isVideoUrl} />
        </div>

        {/* PC / Desktop View Hero Banner */}
        <div className="hidden md:block w-full h-full">
          <Link to="/new-kits" className="block w-full h-full cursor-pointer">
            {heroPcMediaUrl && isVideoUrl(heroPcMediaUrl) ? (
              <video
                src={heroPcMediaUrl}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster={dualFootball}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
              />
            ) : (
              <img
                src={heroPcMediaUrl || dualFootball}
                alt="Veloce Wear Campaign Hero Desktop"
                className="w-full h-full object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
                loading="eager"
                decoding="async"
              />
            )}
          </Link>
        </div>
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
                  preload="auto"
                  poster={dualF1}
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <img
                  src={featured1MobileMediaUrl || dualF1}
                  alt="Formula 1 Store Mobile"
                  loading="eager"
                  decoding="async"
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
                  preload="auto"
                  poster={dualF1}
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <img
                  src={featured1PcMediaUrl || dualF1}
                  alt="Formula 1 Store Desktop"
                  loading="eager"
                  decoding="async"
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
                  preload="auto"
                  poster={dualFootball}
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <img
                  src={featured2MobileMediaUrl || dualFootball}
                  alt="Cricket Section Mobile"
                  loading="eager"
                  decoding="async"
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
                  preload="auto"
                  poster={dualFootball}
                  className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.05] group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <img
                  src={featured2PcMediaUrl || dualFootball}
                  alt="Cricket Section Desktop"
                  loading="eager"
                  decoding="async"
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
        SHOP BY TEAM (Continuous Marquee)
        ========================================================================
      */}
      <div className="w-full bg-white py-6 border-b border-black/10">
        <UnifiedShopByTeam />
      </div>

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
        CERTIFIED AUTHENTIC & VERIFIED REVIEWS
        ========================================================================
      */}
      <section className="max-w-3xl mx-auto my-12 sm:my-16 px-4 sm:px-6 text-center">
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
          {/* Review 1 - Arun Choudhary */}
          <div className="rounded-2xl border border-black/15 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex gap-1 text-amber-400 mb-2 text-sm">
              ★ ★ ★ ★ ★
            </div>
            <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-medium mb-3">
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

          {/* Review 2 - Arjun */}
          <div className="rounded-2xl border border-black/15 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex gap-1 text-amber-400 mb-2 text-sm">
              ★ ★ ★ ★ ★
            </div>
            <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-medium mb-3">
              "Ordered the Real Madrid Player Version and Red Bull Racing polo. The fabric quality, breathability, and authentic badge stitching exceeded all expectations. Quick Pan-India delivery!"
            </p>
            <div className="flex items-center justify-between border-t border-black/5 pt-3">
              <div>
                <div className="text-xs sm:text-sm font-bold text-black">Arjun</div>
                <div className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 mt-0.5">
                  VERIFIED BUYER
                </div>
              </div>
            </div>
          </div>

          {/* Review 3 - Priyanka */}
          <div className="rounded-2xl border border-black/15 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex gap-1 text-amber-400 mb-2 text-sm">
              ★ ★ ★ ★ ★
            </div>
            <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-medium mb-3">
              "Got an oversized Mumbai Indians jersey as a birthday gift and the material is premium and super soft. Customer support was polite and exchange policy gave me full peace of mind."
            </p>
            <div className="flex items-center justify-between border-t border-black/5 pt-3">
              <div>
                <div className="text-xs sm:text-sm font-bold text-black">Priyanka</div>
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteractingRef = useRef(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 1st Football, 2nd Cricket, 3rd F1, 4th Basketball
  const allTeams = useMemo(() => {
    return [
      ...combinedFootball.map(([n, url]) => ({ name: n, logoUrl: url, category: "Football" })),
      ...combinedCricketIPL.map(([n, url]) => ({ name: n, logoUrl: url, category: "Cricket" })),
      ...combinedF1.map(([n, url]) => ({ name: n, logoUrl: url, category: "F1" })),
      ...combinedB.map(([n, url]) => ({ name: n, logoUrl: url, category: "Basketball" })),
    ];
  }, [combinedFootball, combinedCricketIPL, combinedF1, combinedB]);

  // Seamless infinite loop list
  const displayTeams = useMemo(() => [...allTeams, ...allTeams, ...allTeams], [allTeams]);

  const pauseAutoScroll = useCallback((durationMs = 2500) => {
    isInteractingRef.current = true;
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false;
    }, durationMs);
  }, []);

  const updateScrollButtons = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  // Continuous auto-glide that automatically runs 24/7 across all devices
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animId: number;
    let accumulated = 0;

    const step = () => {
      if (!isInteractingRef.current && el) {
        accumulated += 0.85; // Continuous smooth running speed
        if (accumulated >= 1) {
          const px = Math.floor(accumulated);
          el.scrollLeft += px;
          accumulated -= px;

          const loopThreshold = (el.scrollWidth * 2) / 3;
          if (loopThreshold > 200 && el.scrollLeft >= loopThreshold) {
            el.scrollLeft -= el.scrollWidth / 3;
          }
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [displayTeams]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [updateScrollButtons, displayTeams]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    pauseAutoScroll(3000);
    const offset = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -offset : offset,
      behavior: "smooth",
    });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    isInteractingRef.current = true;
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollStart(scrollRef.current.scrollLeft);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    scrollRef.current.scrollLeft = scrollStart - walk;
  };

  const onMouseUpOrLeave = () => {
    setIsDragging(false);
    pauseAutoScroll(2000);
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 group relative">
      <div className="flex items-end justify-between mb-3">
        <div>
          <h2 className="font-display text-base sm:text-xl font-black tracking-wide text-black uppercase">
            SHOP BY TEAM & CREST
          </h2>
          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-[#d32f2f] font-bold mt-0.5">
            TAP A BADGE TO EXPLORE
          </p>
        </div>

        {/* PC / Tablet Scroll Buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleScroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className="w-8 h-8 rounded-full border border-neutral-300 bg-white hover:border-black hover:bg-neutral-50 flex items-center justify-center text-black disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className="w-8 h-8 rounded-full border border-neutral-300 bg-white hover:border-black hover:bg-neutral-50 flex items-center justify-center text-black disabled:opacity-30 disabled:pointer-events-none transition-all shadow-xs cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative w-full">
        {/* Floating Side Arrows for Desktop */}
        <div className="hidden md:block">
          {canScrollLeft && (
            <button
              onClick={() => handleScroll("left")}
              aria-label="Scroll left"
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-neutral-300 shadow-md flex items-center justify-center text-black hover:scale-110 hover:border-black transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => handleScroll("right")}
              aria-label="Scroll right"
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm border border-neutral-300 shadow-md flex items-center justify-center text-black hover:scale-110 hover:border-black transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Badges Track with Touch & Mouse Support */}
        <div
          ref={scrollRef}
          onTouchStart={() => pauseAutoScroll(3000)}
          onTouchMove={() => pauseAutoScroll(3000)}
          onTouchEnd={() => pauseAutoScroll(2500)}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUpOrLeave}
          onMouseLeave={onMouseUpOrLeave}
          className={`flex gap-3 sm:gap-5 overflow-x-auto overflow-y-hidden pb-3 pt-1 px-1 select-none cursor-grab active:cursor-grabbing ${
            isDragging ? "scroll-auto" : ""
          }`}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {displayTeams.map((t, i) => {
            let shopPath = "/shop/football";
            if (t.category === "Cricket") shopPath = "/shop/cricket";
            else if (t.category === "Basketball") shopPath = "/shop/basketball";
            else if (t.category === "F1") shopPath = "/shop/f1";

            return (
              <Link
                key={`${t.name}-${i}`}
                to={shopPath as never}
                search={{ team: t.name } as never}
                preload="intent"
                onClick={(e) => {
                  if (hasDragged) {
                    e.preventDefault();
                  }
                }}
                className="shrink-0 flex flex-col items-center gap-1.5 group/item w-[64px] sm:w-[86px]"
              >
                <div className="w-[64px] h-[64px] sm:w-[86px] sm:h-[86px] rounded-full bg-white border border-neutral-300 flex items-center justify-center p-2.5 sm:p-3.5 transition-all duration-300 group-hover/item:border-[#d32f2f] group-hover/item:scale-105 shadow-2xs">
                  <img
                    src={t.logoUrl}
                    alt={t.name}
                    loading="eager"
                    decoding="sync"
                    draggable={false}
                    className="max-w-full max-h-full object-contain filter drop-shadow-xs transition-transform group-hover/item:scale-110 pointer-events-none"
                  />
                </div>
                <span className="text-[9px] sm:text-[11px] text-center font-bold text-neutral-800 group-hover/item:text-[#d32f2f] leading-tight truncate w-full" title={t.name}>
                  {getShortTeamName(t.name)}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
});
