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
import { useSiteImages, type SiteImageSlot } from "@/lib/site-images";
import { useHomepageFeatured } from "@/lib/homepage-featured";
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
  link: string;
  title: string;
  isVideo: boolean;
  hasBuiltInTypography?: boolean;
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

  // Dynamic Mobile Banners: Only display banners that have an uploaded/configured image or video
  const banners = useMemo<BannerItem[]>(() => {
    const raw1 = siteImages.get("hero-video-mobile") || siteImages.get("hero-video-mobile-1") || siteImages.get("hero-video");
    const raw2 = siteImages.get("hero-video-mobile-2");
    const raw3 = siteImages.get("hero-video-mobile-3");
    const raw4 = siteImages.get("hero-video-mobile-4");
    const raw5 = siteImages.get("hero-video-mobile-5");

    const fallback1 = "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/hero-video-mobile/1787332663765.webp";

    const candidateSlots: { slotVal: string; item: BannerItem }[] = [
      {
        slotVal: raw1 || fallback1,
        item: {
          id: "banner-1",
          url: raw1 || fallback1,
          link: "/shop",
          title: "Veloce Shop All",
          isVideo: isVideoUrl(raw1 || fallback1),
          hasBuiltInTypography: false,
        },
      },
      {
        slotVal: raw2,
        item: {
          id: "banner-2",
          url: raw2,
          link: "/shop",
          title: "Veloce Shop All",
          isVideo: isVideoUrl(raw2),
          hasBuiltInTypography: false,
        },
      },
      {
        slotVal: raw3,
        item: {
          id: "banner-3",
          url: raw3,
          link: "/shop",
          title: "Veloce Shop All",
          isVideo: isVideoUrl(raw3),
          hasBuiltInTypography: false,
        },
      },
      {
        slotVal: raw4,
        item: {
          id: "banner-4",
          url: raw4,
          link: "/shop",
          title: "Veloce Shop All",
          isVideo: isVideoUrl(raw4),
          hasBuiltInTypography: true,
        },
      },
      {
        slotVal: raw5,
        item: {
          id: "banner-5",
          url: raw5,
          link: "/shop",
          title: "Veloce Shop All",
          isVideo: isVideoUrl(raw5),
          hasBuiltInTypography: true,
        },
      },
    ];

    // Only include banner if the slot has an uploaded/configured media URL
    const active = candidateSlots
      .filter((entry) => Boolean(entry.slotVal && entry.slotVal.trim() !== ""))
      .map((entry) => entry.item);

    return active.length > 0 ? active : [candidateSlots[0].item];
  }, [siteImages, isVideoUrl]);

  const numBanners = banners.length;

  const nextSlide = useCallback(() => {
    setProgress(0);
    setActiveIdx((prev) => (prev + 1) % (banners.length || 1));
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setProgress(0);
    setActiveIdx((prev) => (prev - 1 + (banners.length || 1)) % (banners.length || 1));
  }, [banners.length]);

  const goToSlide = useCallback(
    (idx: number) => {
      setProgress(0);
      setActiveIdx(idx % (banners.length || 1));
    },
    [banners.length]
  );

  // Video play/pause & reset handling for active slide
  useEffect(() => {
    videoRefs.current.forEach((vid, idx) => {
      if (!vid) return;
      if (idx === activeIdx) {
        if (isPaused) {
          vid.pause();
        } else {
          vid.currentTime = 0;
          vid.play().catch(() => {});
        }
      } else {
        vid.pause();
        vid.currentTime = 0;
      }
    });
  }, [activeIdx, isPaused]);

  // Robust, Strictly Sequential Auto-Advance Timer (0 -> 1 -> 2 -> 3 -> 4)
  useEffect(() => {
    if (isPaused) return;

    const currentBanner = banners[activeIdx];
    const isVideo = currentBanner?.isVideo;

    if (isVideo) {
      // For video slides, progress is driven by active video's onTimeUpdate
      // Safety timeout: 15 seconds in case video playback stalls
      const safetyTimer = setTimeout(() => {
        nextSlide();
      }, 15000);
      return () => clearTimeout(safetyTimer);
    }

    // Exact 3.0s countdown for image slides with smooth linear progress
    const duration = 3000;
    const startTime = Date.now();
    setProgress(0);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);

      if (elapsed >= duration) {
        clearInterval(interval);
        nextSlide();
      }
    }, 33);

    return () => clearInterval(interval);
  }, [activeIdx, isPaused, banners, nextSlide]);

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
                    onTimeUpdate={(e) => {
                      if (isActive && !isPaused) {
                        const vid = e.currentTarget;
                        if (vid.duration) {
                          setProgress((vid.currentTime / vid.duration) * 100);
                        }
                      }
                    }}
                    onEnded={() => {
                      if (isActive) {
                        nextSlide();
                      }
                    }}
                    onError={() => {
                      if (isActive) {
                        nextSlide();
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={b.url}
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

      {/* Seamless Organic Radial Vignette (Only visible on clean photo slides without built-in typography) */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,0,0,0.5)_0%,_rgba(0,0,0,0.2)_25%,_rgba(0,0,0,0)_60%)] pointer-events-none z-15 transition-opacity duration-400 ease-out ${
          !banners[activeIdx]?.hasBuiltInTypography ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Editorial Hero Messaging Safe Zone (Smoothly adapts per slide; hides over campaign artwork) */}
      <div
        className={`absolute bottom-6 left-3.5 sm:bottom-8 sm:left-5 z-25 max-w-[175px] sm:max-w-[220px] select-none pointer-events-none transition-all duration-400 ease-out motion-reduce:transition-none ${
          !banners[activeIdx]?.hasBuiltInTypography
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2"
        }`}
      >
        <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.02em] text-white leading-tight drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)]">
          THE GAME. THE JERSEY.
        </h2>
        <p className="text-[11px] sm:text-xs text-white/85 font-normal tracking-normal mt-1 sm:mt-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.75)]">
          Wear the moments that matter.
        </p>
      </div>

      {/* Minimal Premium Hero Carousel Controls (Shown only when multiple uploaded banners exist) */}
      {banners.length > 1 && (
        <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 z-30 flex items-center bg-black/20 backdrop-blur-[2px] px-1.75 py-0.75 rounded-full border border-white/6 shadow-none pointer-events-auto select-none gap-1.5">
          {/* Minimal Indicators (● ━━━ ○ ○ ○) */}
          <div className="flex items-center gap-1.25">
            {banners.map((_, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    goToSlide(idx);
                  }}
                  className="relative flex items-center justify-center p-0.5 cursor-pointer focus:outline-none"
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  {isActive ? (
                    /* Active Elongated Line with Subtle Autoplay Progress Fill */
                    <div className="relative h-0.75 sm:h-1 w-3.5 sm:w-4.5 rounded-full bg-white/20 overflow-hidden transition-all duration-400 ease-out motion-reduce:transition-none">
                      <div
                        className="absolute inset-y-0 left-0 bg-white rounded-full transition-[width] duration-75 ease-linear"
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      />
                    </div>
                  ) : (
                    /* Inactive Small Circular Dot */
                    <div className="h-0.75 w-0.75 sm:h-1 sm:w-1 rounded-full bg-white/30 hover:bg-white/60 transition-all duration-400 ease-out motion-reduce:transition-none" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Subtle Divider */}
          <div className="h-2 w-px bg-white/10" />

          {/* Lightweight Arrow Controls */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
              }}
              className="p-0.5 rounded-full text-white/60 hover:text-white active:opacity-50 transition-colors duration-200 cursor-pointer focus:outline-none"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[1.5]" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
              }}
              className="p-0.5 rounded-full text-white/60 hover:text-white active:opacity-50 transition-colors duration-200 cursor-pointer focus:outline-none"
              aria-label="Next slide"
            >
              <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[1.5]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CategoryCampaignBanner({
  mobileSlot,
  pcSlot,
  fallbackUrl,
  categoryName,
  headline,
  description,
  buttonText,
  linkTo,
  siteImages,
  isVideoUrl,
}: {
  mobileSlot: SiteImageSlot;
  pcSlot: SiteImageSlot;
  fallbackUrl: string;
  categoryName: string;
  headline: string;
  description: string;
  buttonText: string;
  linkTo: string;
  siteImages: ReturnType<typeof useSiteImages>;
  isVideoUrl: (url?: string) => boolean;
}) {
  const pcUrl = siteImages.get(pcSlot) || siteImages.get(mobileSlot) || fallbackUrl;
  const mobileUrl = siteImages.get(mobileSlot) || siteImages.get(pcSlot) || fallbackUrl;

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[4/3] md:aspect-[16/7] lg:aspect-[21/9] bg-neutral-900 overflow-hidden border-0 rounded-none m-0 p-0 group">
      <Link
        to={linkTo as any}
        className="relative w-full h-full flex flex-col justify-end p-6 sm:p-10 lg:p-12 border-0 rounded-none m-0 group cursor-pointer overflow-hidden"
      >
        {/* Mobile View Media */}
        <div className="block md:hidden absolute inset-0 w-full h-full">
          {isVideoUrl(mobileUrl) ? (
            <video
              src={mobileUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.88] contrast-[1.05]"
            />
          ) : (
            <img
              src={mobileUrl}
              alt={categoryName}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.88] contrast-[1.05]"
            />
          )}
        </div>

        {/* PC / Desktop View Media */}
        <div className="hidden md:block absolute inset-0 w-full h-full">
          {isVideoUrl(pcUrl) ? (
            <video
              src={pcUrl}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.88] contrast-[1.05]"
            />
          ) : (
            <img
              src={pcUrl}
              alt={categoryName}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-[0.88] contrast-[1.05]"
            />
          )}
        </div>

        {/* Seamless Organic Gradient for Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none z-10" />

        {/* Editorial Campaign Messaging Safe Zone */}
        <div className="relative z-20 text-white max-w-sm sm:max-w-md lg:max-w-xl pointer-events-auto select-none">
          <span className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-wider block mb-1">
            {categoryName}
          </span>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-2 sm:mb-3">
            {headline}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-white/85 font-normal tracking-wide mb-4 drop-shadow-sm">
            {description}
          </p>
          <div>
            <span className="px-6 py-2.5 bg-white text-black group-hover:bg-neutral-200 text-xs sm:text-sm font-bold rounded-full transition-transform active:scale-95 inline-block shadow-md">
              {buttonText}
            </span>
          </div>
        </div>
      </Link>
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

  const { featured: homepageFeatured } = useHomepageFeatured();

  // Curated category products with admin override or smart category fallback
  const footballProducts = useMemo(() => {
    if (homepageFeatured.football && homepageFeatured.football.length > 0) {
      const byId = new Map(products.map((p) => [p.id, p]));
      const curated = homepageFeatured.football
        .map((id) => byId.get(id))
        .filter((p): p is (typeof products)[0] => !!p);
      if (curated.length > 0) return curated;
    }
    return products.filter((p) => p.category === "football" || p.category === "worldcup").slice(0, 4);
  }, [products, homepageFeatured.football]);

  const cricketProducts = useMemo(() => {
    if (homepageFeatured.cricket && homepageFeatured.cricket.length > 0) {
      const byId = new Map(products.map((p) => [p.id, p]));
      const curated = homepageFeatured.cricket
        .map((id) => byId.get(id))
        .filter((p): p is (typeof products)[0] => !!p);
      if (curated.length > 0) return curated;
    }
    return products.filter((p) => p.category === "cricket").slice(0, 4);
  }, [products, homepageFeatured.cricket]);

  const f1Products = useMemo(() => {
    if (homepageFeatured.f1 && homepageFeatured.f1.length > 0) {
      const byId = new Map(products.map((p) => [p.id, p]));
      const curated = homepageFeatured.f1
        .map((id) => byId.get(id))
        .filter((p): p is (typeof products)[0] => !!p);
      if (curated.length > 0) return curated;
    }
    return products.filter((p) => p.category === "f1").slice(0, 4);
  }, [products, homepageFeatured.f1]);

  const basketballProducts = useMemo(() => {
    if (homepageFeatured.basketball && homepageFeatured.basketball.length > 0) {
      const byId = new Map(products.map((p) => [p.id, p]));
      const curated = homepageFeatured.basketball
        .map((id) => byId.get(id))
        .filter((p): p is (typeof products)[0] => !!p);
      if (curated.length > 0) return curated;
    }
    return products.filter((p) => p.category === "basketball").slice(0, 4);
  }, [products, homepageFeatured.basketball]);

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
        <div className="hidden md:block w-full h-full relative">
          <Link to="/shop" className="block w-full h-full cursor-pointer">
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

          {/* Desktop Seamless Organic Radial Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(0,0,0,0.65)_0%,_rgba(0,0,0,0.3)_35%,_rgba(0,0,0,0)_70%)] pointer-events-none z-10" />

          {/* Desktop Editorial Hero Messaging Safe Zone (Bottom-Left) */}
          <div className="absolute bottom-8 left-8 lg:bottom-12 lg:left-12 z-20 max-w-md pointer-events-none select-none">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-[0.05em] text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              THE GAME. THE JERSEY.
            </h2>
            <p className="text-sm md:text-base text-white/90 font-normal tracking-wide mt-1.5 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              Wear the moments that matter.
            </p>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        1. FOOTBALL CATEGORY SECTION
        - Full-width Football Campaign Banner (Configurable via Admin 'featured-football-pc' & 'featured-football-mobile')
        - 4 Curated Football Products
        ========================================================================
      */}
      <section className="w-full my-0 py-0">
        <CategoryCampaignBanner
          mobileSlot="featured-football-mobile"
          pcSlot="featured-football-pc"
          fallbackUrl={
            siteImages.get("featured-2-pc") ||
            "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/banner:football/1786005500700.webp"
          }
          categoryName="Football Collection"
          headline="THE BEAUTIFUL GAME"
          description="Authentic matchday club & national team jerseys."
          buttonText="Shop Football"
          linkTo="/shop/football"
          siteImages={siteImages}
          isVideoUrl={isVideoUrl}
        />

        {/* Curated Football Products */}
        {footballProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-black tracking-tight">
                  Featured Football Kits
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Top match-day authentic editions</p>
              </div>
              <Link
                to="/shop/football"
                className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-black hover:opacity-75 transition-opacity"
              >
                <span>View All Football</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {footballProducts.map((p, i) => (
                <ProductCard key={p.id} p={p} priority={i < 4} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 
        ========================================================================
        2. CRICKET CATEGORY SECTION
        - Full-width Cricket Campaign Banner (Configurable via Admin 'featured-cricket-pc' & 'featured-cricket-mobile')
        - 4 Curated Cricket Products
        ========================================================================
      */}
      <section className="w-full my-0 py-0 border-t border-black/10">
        <CategoryCampaignBanner
          mobileSlot="featured-cricket-mobile"
          pcSlot="featured-cricket-pc"
          fallbackUrl={
            siteImages.get("featured-2-pc") ||
            "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/banner:football/1786005500700.webp"
          }
          categoryName="Cricket Collection"
          headline="CRICKET ATELIER"
          description="Official national team jerseys & IPL matchwear."
          buttonText="Shop Cricket"
          linkTo="/shop/cricket"
          siteImages={siteImages}
          isVideoUrl={isVideoUrl}
        />

        {/* Curated Cricket Products */}
        {cricketProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-black tracking-tight">
                  Featured Cricket Kits
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">International & League Matchwear</p>
              </div>
              <Link
                to="/shop/cricket"
                className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-black hover:opacity-75 transition-opacity"
              >
                <span>View All Cricket</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {cricketProducts.map((p, i) => (
                <ProductCard key={p.id} p={p} priority={i < 4} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 
        ========================================================================
        3. FORMULA 1 CATEGORY SECTION
        - Full-width Formula 1 Campaign Banner (Configurable via Admin 'featured-f1-pc' & 'featured-f1-mobile')
        - 4 Curated F1 Products
        ========================================================================
      */}
      <section className="w-full my-0 py-0 border-t border-black/10">
        <CategoryCampaignBanner
          mobileSlot="featured-f1-mobile"
          pcSlot="featured-f1-pc"
          fallbackUrl={
            siteImages.get("featured-1-pc") ||
            "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/banner:f1/1786005520068.webp"
          }
          categoryName="Motorsport Collection"
          headline="FORMULA 1 STORE"
          description="Official team paddock polos, jerseys, and fan tees."
          buttonText="Shop Formula 1"
          linkTo="/shop/f1"
          siteImages={siteImages}
          isVideoUrl={isVideoUrl}
        />

        {/* Curated F1 Products */}
        {f1Products.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-black tracking-tight">
                  Featured Formula 1 Apparel
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">High-speed teamwear & racing tees</p>
              </div>
              <Link
                to="/shop/f1"
                className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-black hover:opacity-75 transition-opacity"
              >
                <span>View All F1</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {f1Products.map((p, i) => (
                <ProductCard key={p.id} p={p} priority={i < 4} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 
        ========================================================================
        4. BASKETBALL CATEGORY SECTION
        - Full-width Basketball Campaign Banner (Configurable via Admin 'featured-basketball-pc' & 'featured-basketball-mobile')
        - 4 Curated Basketball Products
        ========================================================================
      */}
      <section className="w-full my-0 py-0 border-t border-black/10">
        <CategoryCampaignBanner
          mobileSlot="featured-basketball-mobile"
          pcSlot="featured-basketball-pc"
          fallbackUrl={
            siteImages.get("featured-1-pc") ||
            "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/nav-grid-basketball/1784609699446.webp"
          }
          categoryName="Basketball Collection"
          headline="COURT CULTURE"
          description="Iconic NBA & street-ready athletic silhouettes."
          buttonText="Shop Basketball"
          linkTo="/shop/basketball"
          siteImages={siteImages}
          isVideoUrl={isVideoUrl}
        />

        {/* Curated Basketball Products */}
        {basketballProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-black tracking-tight">
                  Featured Basketball Kits
                </h3>
                <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">Classic hardwood & court editions</p>
              </div>
              <Link
                to="/shop/basketball"
                className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-black hover:opacity-75 transition-opacity"
              >
                <span>View All Basketball</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {basketballProducts.map((p, i) => (
                <ProductCard key={p.id} p={p} priority={i < 4} />
              ))}
            </div>
          </div>
        )}
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
