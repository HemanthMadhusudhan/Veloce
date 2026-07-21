import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { ArrowUpRight, Play, Gift, X, ChevronRight, ChevronDown } from "lucide-react";
import { SiteChrome, PerksStrip } from "@/components/chrome";
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

export const Route = createFileRoute("/")({
  component: Index,
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
    product: "McLaren Team Tee 2026",
    date: "July 2026",
  },
  {
    name: "Priya K.",
    rating: 5,
    text: "Ordered a custom name print for my brother's birthday. The vinyl quality is top notch and it arrived exactly on time. Highly recommend!",
    product: "Custom Print Kit",
    date: "July 2026",
  },
  {
    name: "Rahul D.",
    rating: 4,
    text: "The RCB retro jersey is pure nostalgia. Fabric is soft. Giving it 4 stars only because I wish they had more sizes in stock.",
    product: "RCB Retro Classic",
    date: "June 2026",
  },
  {
    name: "Ananya S.",
    rating: 5,
    text: "Amazing customer service! Had an issue with sizing and their team on Telegram replaced it within 2 days. The new one fits beautifully.",
    product: "FC Barcelona Home",
    date: "July 2026",
  },
  {
    name: "Dev M.",
    rating: 5,
    text: "Best quality replicas in India hands down. The detailing on the Aston Martin F1 jacket is exactly like the original. Will buy again.",
    product: "Aston Martin Team Jacket",
    date: "August 2026",
  },
  {
    name: "Siddharth B.",
    rating: 5,
    text: "The fabric of the AC Milan away jersey feels incredibly premium. It's lightweight and looks authentic. Shipping to Pune was super fast.",
    product: "AC Milan Away 24/25",
    date: "July 2026",
  },
  {
    name: "Neha G.",
    rating: 4,
    text: "Gifted the Red Bull Racing cap and polo to my dad. He loved the vibrant colors. Fits perfectly, but packaging could be slightly better.",
    product: "Red Bull Racing Polo",
    date: "June 2026",
  },
  {
    name: "Vishal P.",
    rating: 5,
    text: "Purchased the Argentina 3-star jersey. The golden embroidery is flawless. It breathes well even during intense turf matches.",
    product: "Argentina Home Kit 2026",
    date: "August 2026",
  },
  {
    name: "Meera T.",
    rating: 5,
    text: "I was skeptical about buying F1 merch online but Veloce delivered beyond my expectations. The Alpine tee is so comfortable.",
    product: "Alpine Team Tee",
    date: "July 2026",
  },
  {
    name: "Kabir S.",
    rating: 5,
    text: "The retro 2007 Manchester United jersey brought back so many memories. Excellent stitching and the sponsor logo doesn't feel cheap at all.",
    product: "Man Utd Retro 2007",
    date: "May 2026",
  },
  {
    name: "Tanya C.",
    rating: 5,
    text: "Ordered a customized Real Madrid jersey for my friend. The name printing is very high quality and looks just like the real deal.",
    product: "Real Madrid Custom Print",
    date: "August 2026",
  },
  {
    name: "Harsh J.",
    rating: 4,
    text: "The fabric on the Bayern München home kit is fantastic. Only issue was a slight delay in delivery by the courier, but the product is solid.",
    product: "Bayern München Home",
    date: "July 2026",
  },
  {
    name: "Aisha R.",
    rating: 5,
    text: "Honestly the best place in India for football jerseys. The PSG away kit is stunning and the fit is tailored, not baggy.",
    product: "PSG Away 24/25",
    date: "August 2026",
  },
  {
    name: "Manish K.",
    rating: 5,
    text: "Got the Mercedes-AMG Petronas jacket. It feels very premium and blocks the wind nicely. Great for evening rides.",
    product: "Mercedes Team Jacket",
    date: "June 2026",
  },
  {
    name: "Simran K.",
    rating: 5,
    text: "Loved the quality of the Arsenal third kit. It's exactly as shown in the pictures. The colors really pop and the material is super soft.",
    product: "Arsenal Third Kit",
    date: "August 2026",
  },
  {
    name: "Gaurav H.",
    rating: 5,
    text: "The vintage AC Milan 2006 jersey is absolute perfection. The collar details and the gold text are spot on. Very happy.",
    product: "AC Milan Retro 2006",
    date: "July 2026",
  },
  {
    name: "Ritika M.",
    rating: 4,
    text: "Good stuff! The McLaren hoodie is cozy and the prints haven't cracked after three washes. Will definitely purchase more.",
    product: "McLaren Team Hoodie",
    date: "May 2026",
  },
  {
    name: "Akhil D.",
    rating: 5,
    text: "Player issue kits are usually a hit or miss in India, but Veloce absolutely nailed the Juventus away kit. Highly recommended for actual players.",
    product: "Juventus Player Issue",
    date: "August 2026",
  },
  {
    name: "Shreya V.",
    rating: 5,
    text: "The print quality on the Chennai Super Kings fan jersey is amazing. The fabric is very airy and comfortable for the summer.",
    product: "CSK Fan Edition",
    date: "June 2026",
  },
  {
    name: "Kunal F.",
    rating: 5,
    text: "Bought the Inter Miami away kit. The pink accents are vibrant and the fabric wicks sweat perfectly during games. Great value.",
    product: "Inter Miami Away",
    date: "July 2026",
  },
  {
    name: "Pratiksha B.",
    rating: 5,
    text: "Really impressed with the packaging and the product. The Ferrari cap feels authentic and fits nicely. Great customer support on WhatsApp too.",
    product: "Ferrari Team Cap",
    date: "August 2026",
  },
  {
    name: "Naveen P.",
    rating: 4,
    text: "The Chelsea home kit is good. The blue is slightly darker than I expected, but the overall material and stitching are excellent.",
    product: "Chelsea Home Kit",
    date: "July 2026",
  },
  {
    name: "Zara M.",
    rating: 5,
    text: "Got a customized kit for a corporate tournament. The whole team loved the quality. Veloce made the bulk ordering process super easy.",
    product: "Custom Team Kit",
    date: "May 2026",
  },
  {
    name: "Rishi A.",
    rating: 5,
    text: "The retro Brazil 2002 jersey is a masterpiece. The fabric feels exactly like the jerseys from that era. Pure nostalgia!",
    product: "Brazil Retro 2002",
    date: "August 2026",
  },
  {
    name: "Alok N.",
    rating: 5,
    text: "Superb quality on the Aston Martin polo. Wore it to a watch party and got so many compliments. It looks incredibly sharp.",
    product: "Aston Martin Polo",
    date: "July 2026",
  }
];

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-3 w-3 sm:h-4 sm:w-4 ${filled ? "text-yellow-400" : "text-border/60"}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function useCountdown(target: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const d = Math.max(0, target - now);
  const days = Math.floor(d / 86400000);
  const hours = Math.floor((d / 3600000) % 24);
  const mins = Math.floor((d / 60000) % 60);
  const secs = Math.floor((d / 1000) % 60);
  return { days, hours, mins, secs };
}

function Index() {
  const { isAdmin } = useShop();
  const nav = useNavigate();
  useEffect(() => {
    if (isAdmin) nav({ to: "/admin", replace: true });
  }, [isAdmin, nav]);
  if (isAdmin) return null;
  return (
    <SiteChrome>
      <Home />
    </SiteChrome>
  );
}

function useMarquee(speed = 1, deps: any[] = []) {
  const containerRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    offset: 0,
    isDragging: false,
    lastClientX: 0,
    lastTime: 0,
    dragDistance: 0,
  });

  useEffect(() => {
    let animationFrameId: number;
    let initialized = false;

    const tick = (time: number) => {
      const s = state.current;
      if (!s.lastTime) s.lastTime = time;
      const delta = Math.min(time - s.lastTime, 50);
      s.lastTime = time;

      const container = containerRef.current;
      const setElem = setRef.current;

      if (container && setElem) {
        const jumpDistance = setElem.offsetWidth;
        if (jumpDistance > 0) {
          if (!initialized) {
            s.offset = jumpDistance; // Start perfectly in the middle set to allow bi-directional scroll
            initialized = true;
          }

          if (!s.isDragging) {
            s.offset += speed * (delta / 16.66);
          }

          // Loop seamlessly
          if (s.offset >= jumpDistance * 2) {
            s.offset -= jumpDistance;
          } else if (s.offset <= 0) {
            s.offset += jumpDistance;
          }

          // Apply sub-pixel GPU accelerated transform for buttery smoothness
          container.style.transform = `translate3d(${-s.offset}px, 0, 0)`;
          container.style.willChange = 'transform';
          container.style.backfaceVisibility = 'hidden';
        }
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    const timeout = setTimeout(() => {
      state.current.lastTime = performance.now();
      animationFrameId = requestAnimationFrame(tick);
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [speed, ...deps]);

  const onPointerDown = (e: React.PointerEvent) => {
    const s = state.current;
    s.isDragging = true;
    s.lastClientX = e.clientX;
    s.dragDistance = 0;
    if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = state.current;
    if (!s.isDragging) return;
    const deltaX = e.clientX - s.lastClientX;
    s.dragDistance += Math.abs(deltaX);
    s.offset -= deltaX;
    s.lastClientX = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    state.current.isDragging = false;
    if (e.currentTarget.releasePointerCapture) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (state.current.dragDistance > 5) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return {
    containerRef,
    setRef,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClickCapture,
      style: { touchAction: "pan-y" } as React.CSSProperties,
    },
  };
}

function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  return (
    url.endsWith(".mp4") ||
    url.endsWith(".webm") ||
    url.endsWith(".ogg") ||
    url.includes("player.vimeo.com") ||
    url.includes("youtube.com/embed") ||
    url.startsWith("data:video/")
  );
}

function Home() {
  const { products } = useCatalog();
  const { drops } = useDrops();
  const heroBg = useSiteImage("hero");
  const filmVideo = useSiteImage("film-video");
  const [filmOpen, setFilmOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const worldCupImg = useSiteImage("worldcup-banner");
  const catFootball = useSiteImage("category-football");
  const catF1 = useSiteImage("category-f1");
  const navFootball = useSiteImage("nav-grid-football");
  const navF1 = useSiteImage("nav-grid-f1");
  const navBasketball = useSiteImage("nav-grid-basketball");
  const navCricket = useSiteImage("nav-grid-cricket");

  const activeDrop = drops[0] ?? DEFAULT_DROPS[0];
  const c = useCountdown(activeDrop.endsAt);
  const featured = useMemo(() => {
    if (!products.length) return [];
    const currentHour = Math.floor(Date.now() / (1000 * 60 * 60));
    let seed = currentHour;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    return [...products].sort(() => random() - 0.5).slice(0, 16);
  }, [products]);
  const drop =
    products.find((p) => p.id === activeDrop.productId) ??
    products.find((p) => p.badge === "Limited") ??
    products[0];

  return (
    <>
      <style>{`
        .drag-scroll-container a, .drag-scroll-container img {
          -webkit-user-drag: none;
          user-select: none;
        }
      `}</style>
      {/* PUMA INSPIRED HERO SECTION */}
      <section className="w-full bg-[#f6ece4]">
        <div className="relative w-full aspect-square sm:aspect-square overflow-hidden">
          {isVideoUrl(heroBg) ? (
            <video
              src={heroBg}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Picture
              src={heroBg}
              alt=""
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          )}
        </div>
        <div className="w-full bg-white px-2 py-3 sm:py-4">
          <div className="grid grid-cols-2 gap-2 w-full max-w-md mx-auto sm:max-w-7xl sm:gap-4 sm:px-6">
            <Link
              to="/shop/football"
              className="relative w-full h-[75px] sm:h-[180px] lg:h-[220px] bg-[#f0f0f0] border border-gray-200 block transition-opacity hover:opacity-80 overflow-hidden"
            >
              {navFootball && (
                <Picture
                  src={navFootball}
                  alt="Football"
                  loading="eager"
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              )}
            </Link>
            <Link
              to="/shop/f1"
              className="relative w-full h-[75px] sm:h-[180px] lg:h-[220px] bg-[#f0f0f0] border border-gray-200 block transition-opacity hover:opacity-80 overflow-hidden"
            >
              {navF1 && (
                <Picture
                  src={navF1}
                  alt="F1"
                  loading="eager"
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              )}
            </Link>
            <Link
              to="/shop/basketball"
              className="relative w-full h-[75px] sm:h-[180px] lg:h-[220px] bg-[#f0f0f0] border border-gray-200 block transition-opacity hover:opacity-80 overflow-hidden"
            >
              {navBasketball && (
                <Picture
                  src={navBasketball}
                  alt="Basketball"
                  loading="eager"
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              )}
            </Link>
            <Link
              to="/shop/cricket"
              className="relative w-full h-[75px] sm:h-[180px] lg:h-[220px] bg-[#f0f0f0] border border-gray-200 block transition-opacity hover:opacity-80 overflow-hidden"
            >
              {navCricket && (
                <Picture
                  src={navCricket}
                  alt="Cricket"
                  loading="eager"
                  fetchPriority="high"
                  className="absolute inset-0 h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
              )}
            </Link>
          </div>
        </div>
        <div className="w-full bg-[#b73232] text-white py-2 px-4 flex flex-col items-center text-center">
          <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-wide mb-1">
            BUY 2 GET 1
          </h3>
          <Link
            to="/shop"
            className="text-[10px] sm:text-xs font-bold uppercase tracking-wider border-b border-white hover:text-white/80 hover:border-white/80 transition-colors mb-2 inline-block pb-0.5"
          >
            SHOP NOW
          </Link>
          <p className="text-[9px] sm:text-[10px]">Auto-applied at checkout</p>
        </div>
      </section>

      {/* MOBILE LAYOUT SCALED TO DESKTOP */}
      <div className="w-full">
        {/* SHOP BY TEAM */}
        <ShopByTeam />

        {/* BEST OF INTERNATIONAL HOME KITS CAROUSEL */}
        <MobileKitsCarousel />
      </div>

      {/* CATEGORIES — 4 worlds */}
      <section
        id="worlds"
        className="mx-auto mt-12 hidden max-w-7xl px-5 sm:mt-24 sm:px-6"
      >
        <div className="mb-6 sm:mb-10 flex items-end justify-between">
          <div>
            <div className="text-[9px] uppercase tracking-[0.28em] text-brand sm:text-[10px]">
              Four worlds. One atelier.
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-5xl">Choose your grid.</h2>
          </div>
          <Link
            to="/shop"
            className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground sm:block"
          >
            Shop all
          </Link>
        </div>
        <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
          <CategoryCard
            href="/shop/football"
            img={catFootball}
            eyebrow="The Pitch"
            title="Football Jerseys"
            desc="Match-day kits from Madrid to München. Includes FIFA World Cup & Retro collections."
          />
          <CategoryCard
            href="/shop/f1"
            img={catF1}
            eyebrow="The Paddock"
            title="Formula 1 Merch"
            desc="Paddock-grade teamwear from every constructor — and the Legends series."
          />
        </div>
      </section>

      {/* PERKS STRIP — trust bar */}
      <PerksStrip />

      {/* TYPOGRAPHIC BANNER — inspired by editorial headline pattern */}
      <section className="relative mx-auto mt-14 hidden max-w-7xl overflow-hidden rounded-3xl border border-border/40 sm:mt-24">
        <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
          {isVideoUrl(worldCupImg) ? (
            <video
              src={worldCupImg}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <Picture
              src={worldCupImg}
              alt=""
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="absolute inset-0 h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          )}

          <div className="relative z-10 flex h-full flex-col items-center justify-between px-5 pt-8 pb-2 text-center sm:pt-10 sm:pb-3">
            <div className="font-display text-2xl font-bold tracking-tight text-white sm:text-5xl">
              FIFA World Cup 2026
            </div>
            <div className="flex-1" />
            <Link
              to="/shop/worldcup"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-brand hover:text-foreground sm:px-6 sm:py-3 sm:text-xs"
            >
              Shop World Cup
            </Link>
          </div>
        </div>
      </section>

      {/* SHOP BY TEAM (DESKTOP) */}
      <div className="hidden max-w-7xl mx-auto mt-12 sm:mt-24 px-6">
        <ShopByTeam />
      </div>

      {/* EOSS BANNER */}
      <section className="w-full mt-14 sm:mt-20">
        <div className="w-full relative overflow-hidden bg-[#ffcd00] py-4 sm:py-6 flex items-center justify-center">
          <div className="absolute top-0 inset-x-0 h-3 sm:h-4 opacity-90" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 15px, transparent 15px, transparent 30px)' }} />
          <div className="absolute bottom-0 inset-x-0 h-3 sm:h-4 opacity-90" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 15px, transparent 15px, transparent 30px)' }} />
          
          <h2 className="relative z-10 font-display text-[26px] sm:text-5xl font-black text-black uppercase tracking-tighter" style={{ transform: 'scaleY(1.2)' }}>
            BUY 2 GET 1 FREE - EOSS
          </h2>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto mt-6 sm:mt-20 max-w-7xl px-5 sm:px-6">
        <div className="mb-6 sm:mb-10 flex items-end justify-between">
          <div>
            <div className="text-[9px] uppercase tracking-[0.28em] text-brand sm:text-[10px]">
              Editors' Selection
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-5xl">Curated this week.</h2>
          </div>
          <Link
            to="/shop"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            All products →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-y-6 gap-x-3 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} p={p} priority={i < 4} />
          ))}
        </div>
      </section>

      {/* LIMITED DROP */}
      {drop && (
        <section className="mx-auto mt-14 max-w-7xl sm:mt-24">
          <div className="relative overflow-hidden border-y border-border/40 bg-surface/30 py-6 sm:py-8 px-5 sm:px-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                <div className="relative h-24 w-20 sm:h-28 sm:w-24 overflow-hidden rounded shadow-sm shrink-0">
                  <Picture
                    src={drop.images[0]}
                    alt={drop.name}
                    className="absolute inset-0 h-full w-full"
                    imgClassName="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-1 sm:mt-2">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-brand font-semibold">
                    {activeDrop.eyebrow}
                  </div>
                  <h2 className="mt-1 font-display text-xl sm:text-2xl font-bold leading-tight">
                    {drop.name}
                  </h2>
                  <p className="mt-1.5 max-w-xs text-xs text-muted-foreground">
                    Numbered edition. Individually authenticated.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center md:items-end gap-5">
                <div className="flex gap-4 sm:gap-5">
                  {[
                    ["Days", c.days],
                    ["Hrs", c.hours],
                    ["Min", c.mins],
                    ["Sec", c.secs],
                  ].map(([k, v]) => (
                    <div key={k as string} className="flex flex-col items-center">
                      <div className="font-mono text-xl sm:text-2xl font-bold tracking-tighter">
                        {String(v).padStart(2, "0")}
                      </div>
                      <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-1">
                        {k}
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/product/$id"
                  params={{ id: drop.id }}
                  className="inline-flex items-center gap-1.5 border-b border-foreground text-[11px] font-bold uppercase tracking-[0.2em] hover:text-brand hover:border-brand transition-colors pb-1"
                >
                  ORDER NOW <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* BRAND STORY */}
      <section className="mx-auto mt-12 sm:mt-32 max-w-4xl px-6 text-center">
        <div className="text-[10px] uppercase tracking-[0.32em] text-brand">
          The Veloce Standard
        </div>
        <p className="mt-6 font-display text-xl leading-snug tracking-tight text-balance sm:text-5xl">
          "We treat every jersey and every team suit like a museum piece. Because to the fans who
          wear them, that's exactly what they are."
        </p>
        <div className="mt-6 text-xs uppercase tracking-[0.24em] text-muted-foreground">
          — Alessandro Vega · Founder
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="mx-auto mt-8 sm:mt-24 max-w-7xl px-5 sm:px-6">
        <div className="mb-6 sm:mb-10 text-center">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-brand">
            Trusted by fans
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-5xl">
            What our customers say.
          </h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} filled />
              ))}
            </div>
            <span className="font-mono text-sm text-muted-foreground">4.9 / 5</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              · 2,847 reviews
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {(showAllReviews ? REVIEWS : REVIEWS.slice(0, 6)).map((r, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/50 bg-card/40 p-4 sm:p-6 space-y-3 transition hover:border-border/80"
            >
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} filled={j < r.rating} />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">"{r.text}"</p>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-border/40 font-mono text-xs font-bold text-foreground">
                  {r.name[0]}
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">{r.name}</div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground/80">
                    {r.product} · {r.date}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {!showAllReviews && REVIEWS.length > 6 && (
          <div className="mt-8 sm:mt-10 flex justify-center">
            <button
              onClick={() => setShowAllReviews(true)}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-transparent px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-foreground hover:bg-foreground hover:text-background transition-colors"
            >
              More Reviews <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto mt-10 sm:mt-24 max-w-2xl px-6 text-center">
        <div className="text-[10px] uppercase tracking-[0.28em] text-brand">Members' Preview</div>
        <h3 className="mt-2 font-display text-2xl font-bold sm:text-4xl">
          Drops. Delivered first.
        </h3>
        <form
          className="mt-6 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const email = (form.elements.namedItem("newsletter_email") as HTMLInputElement)?.value;
            if (email) {
              alert("You will be notified!");
              form.reset();
            }
          }}
        >
          <input
            name="newsletter_email"
            type="email"
            required
            placeholder="your@email.com"
            className="flex-1 rounded-full border border-border/70 bg-transparent px-5 py-3 text-sm outline-none focus:border-foreground"
          />
          <button
            type="submit"
            className="rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background hover:bg-brand hover:text-foreground"
          >
            Get access
          </button>
        </form>
      </section>

      {/* CINEMATIC FILM MODAL */}
      {filmOpen && filmVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
          <div className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/10 bg-background shadow-2xl animate-in zoom-in-95">
            <button
              onClick={() => setFilmOpen(false)}
              className="absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white/80 hover:text-white transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <video src={filmVideo} autoPlay controls playsInline className="h-full w-full" />
          </div>
        </div>
      )}
    </>
  );
}

type CatHref = "/shop/football" | "/shop/f1" | "/shop/worldcup" | "/shop/retro";
function CategoryCard({
  href,
  img,
  eyebrow,
  title,
  desc,
}: {
  href: CatHref;
  img: string;
  eyebrow: string;
  title: string;
  desc: string;
}) {
  const isVid = isVideoUrl(img);
  return (
    <Link
      to={href}
      className="group relative block aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[3/2]"
    >
      {isVid ? (
        <video
          src={img}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
        />
      ) : (
        <Picture
          src={img}
          alt={title}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="absolute inset-0 h-full w-full"
          imgClassName="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
        />
      )}

      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
        <div className="text-[9px] uppercase tracking-[0.28em] text-brand sm:text-[10px]">
          {eyebrow}
        </div>
        <h3 className="mt-2 font-display text-2xl font-bold sm:text-5xl">{title}</h3>
        <p className="mt-2 max-w-md text-xs text-muted-foreground sm:text-sm">{desc}</p>
        <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-foreground">
          Explore{" "}
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

function ZoneCard({
  slug,
  name,
  tagline,
  world,
  img,
}: {
  slug: Zone;
  name: string;
  tagline: string;
  world: string;
  img: string;
}) {
  const isVid = isVideoUrl(img);
  return (
    <Link
      to="/zone/$slug"
      params={{ slug }}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-border/40"
    >
      {isVid ? (
        <video
          src={img}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full opacity-60 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08] group-hover:opacity-80"
        />
      ) : (
        <Picture
          src={img}
          alt={name}
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="absolute inset-0 h-full w-full opacity-60 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08] group-hover:opacity-80"
          imgClassName="h-full w-full object-cover"
        />
      )}

      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <div className="text-[9px] uppercase tracking-[0.28em] text-brand">{world}</div>
        <div className="mt-1 font-display text-2xl font-bold">{name}</div>
        <div className="text-[11px] text-muted-foreground">{tagline}</div>
        <div className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.24em]">
          Enter zone <ArrowUpRight className="h-3 w-3" />
        </div>
      </div>
    </Link>
  );
}

const MobileKitsCarousel = React.memo(function MobileKitsCarousel() {
  const { products } = useCatalog();
  const { hotSellingIds, loaded } = useHotSelling();
  
  const slides = useMemo(() => {
    const defaultKits = products
      .filter((p) => p.category === "football" && p.name.toLowerCase().includes("home"))
      .slice(0, 4);
    
    let base = hotSellingIds.length > 0
      ? (hotSellingIds
          .map((id) => products.find((p) => p.id === id))
          .filter(Boolean) as import("@/lib/catalog").Product[])
      : defaultKits.length > 0
        ? defaultKits
        : products.slice(0, 4);
    
    // Shuffle based on current hour
    const hour = new Date().getHours();
    return [...base].sort((a, b) => (a.id.length + hour) % 2 === 0 ? 1 : -1);
  }, [products, hotSellingIds]);

  // Restart scroll hook if slides load dynamically. Speed 0.4 for slower, distinct sync.
  const scrollProps = useMarquee(0.4, [loaded, slides.length]);

  if (slides.length === 0) return null;

  // Duplicate slides to ensure smooth infinite marquee
  const extendedSlides = [...slides, ...slides, ...slides, ...slides].slice(0, 12);

  return (
    <section className="w-full bg-[#0a0a0a] overflow-hidden border-y border-[#333]">
      <div className="text-center px-4 pt-3 pb-6 relative z-20">
        <div className="text-[10px] uppercase tracking-[0.4em] text-brand mb-3 font-semibold">Trending Now</div>
        <h2 className="font-display text-4xl sm:text-7xl lg:text-9xl font-black leading-[0.9] tracking-tighter text-white uppercase flex flex-col items-center gap-1">
          <span>Hot</span>
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-white">Selling</span>
        </h2>
      </div>

      <div className="relative w-full pb-8 overflow-hidden group">
        {/* Left/Right fades for sleek effect */}
        <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        
        <div 
          ref={scrollProps.containerRef}
          {...scrollProps.handlers}
          className="flex w-max cursor-grab active:cursor-grabbing drag-scroll-container"
        >
          {Array.from({ length: 4 }).map((_, setIdx) => (
            <div 
              key={setIdx} 
              ref={setIdx === 0 ? scrollProps.setRef : null}
              className="flex shrink-0 gap-5 px-5"
            >
              {slides.map((p, i) => {
                const img = p.images[0] || "";
                return (
                  <div key={`${p.id}-${i}`} className="w-[180px] sm:w-[320px] lg:w-[450px] shrink-0 group">
                    <Link
                      to="/product/$id"
                      params={{ id: p.id }}
                      className="block w-full relative overflow-hidden rounded-2xl bg-[#111] border border-[#222] transition-colors group-hover:border-brand/50"
                    >
                      <div className="aspect-[4/5] relative overflow-hidden">
                        <Picture
                          src={img}
                          alt={p.name}
                          className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-110"
                          imgClassName="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                      <div className="p-4 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
                        <h3 className="font-display text-lg sm:text-2xl lg:text-3xl font-bold text-white uppercase tracking-tight truncate">
                          {p.team}
                        </h3>
                        <p className="text-[10px] sm:text-xs lg:text-sm text-gray-400 uppercase tracking-widest mt-1 truncate">
                          {p.name}
                        </p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm sm:text-lg lg:text-xl font-mono text-white">{formatINR(p.price)}</span>
                          <span className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-white text-black flex items-center justify-center transition-transform group-hover:scale-110 group-hover:bg-brand group-hover:text-white">
                            <ChevronRight className="w-3 h-3 sm:w-5 sm:h-5" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

const ShopByTeam = React.memo(function ShopByTeam() {
  const teams = Object.entries(TEAM_LOGOS);
  const scrollProps = useMarquee(0.25);

  return (
    <section className="w-full py-8 sm:py-10 bg-transparent overflow-hidden sm:border-y sm:border-border/40 group">
      <div className="text-center px-4 mb-6 sm:mb-8 flex flex-col items-center sm:items-start sm:px-0">
        <div className="hidden sm:block text-[10px] sm:text-sm lg:text-base uppercase tracking-[0.28em] text-brand mb-2">
          Authentic Badges
        </div>
        <h2 className="font-display text-2xl sm:text-5xl lg:text-7xl font-bold tracking-wide text-foreground">
          SHOP BY TEAM
        </h2>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1 sm:hidden">
          Tap a badge to explore
        </p>
      </div>

      {/* Horizontal scrolling container */}
      <div 
        ref={scrollProps.containerRef}
        {...scrollProps.handlers}
        className="flex w-max cursor-grab active:cursor-grabbing drag-scroll-container"
      >
        {Array.from({ length: 4 }).map((_, setIdx) => (
          <div 
            key={setIdx} 
            ref={setIdx === 0 ? scrollProps.setRef : null}
            className="flex shrink-0 px-4 pb-4 gap-4 sm:px-0 sm:gap-6 sm:pr-6"
          >
            {teams.map(([team, logo], i) => {
              let shopPath = "/shop/football";
              if (f1TeamsList.includes(team)) shopPath = "/shop/f1";
              else if (basketballTeamsList.includes(team)) shopPath = "/shop/basketball";
              else if (cricketTeamsList.includes(team)) shopPath = "/shop/cricket";
              
              return (
                <Link
                  key={`${team}-${i}`}
                  to={shopPath as never}
                  search={{ team } as never}
                  className="shrink-0 flex flex-col items-center gap-3 group/item w-[72px] sm:w-[140px] lg:w-[180px]"
                >
                  <div className="w-[72px] h-[72px] sm:w-[140px] sm:h-[140px] lg:w-[180px] lg:h-[180px] rounded-full bg-white border border-border/50 shadow-sm flex items-center justify-center p-3.5 sm:p-6 lg:p-8 transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-gray-100 group-hover/item:border-white/20">
                    <img
                      src={logo}
                      alt={team}
                      loading="lazy"
                      className="max-w-full max-h-full object-contain filter drop-shadow-md"
                    />
                  </div>
                  <span className="text-[9px] sm:text-sm lg:text-base text-center font-semibold text-muted-foreground group-hover/item:text-foreground leading-tight">
                    {team}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
});
