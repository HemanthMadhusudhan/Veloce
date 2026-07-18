import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { ArrowUpRight, Play, Gift, X, ChevronRight } from "lucide-react";
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
import { TEAM_LOGOS } from "@/lib/logos";

export const Route = createFileRoute("/")({
  component: Index,
});

const MARQUEE = [
  "Scuderia Ferrari", "Real Madrid", "Oracle Red Bull Racing", "Manchester City",
  "Mercedes-AMG Petronas", "Paris Saint-Germain", "McLaren F1", "Arsenal FC",
  "Aston Martin Aramco", "Bayern München", "FC Barcelona",
];

const REVIEWS = [
  { name: "Arjun Mehta", rating: 5, text: "Ordered a Real Madrid home jersey — the quality is insane for ₹599. Stitching is perfect, fabric feels premium. Already ordered 2 more!", product: "Real Madrid Home 24/25", date: "Jun 2026" },
  { name: "Priya Sharma", rating: 5, text: "B2G1 deal is legit! Got 3 jerseys for the price of 2. Delivery was super fast to Bangalore. Will definitely order again.", product: "Barcelona Away 24/25", date: "Jun 2026" },
  { name: "Rahul Singh", rating: 5, text: "The Ferrari F1 team polo is fire 🔥 My friends thought it was an original from the F1 store. Custom name printing was a nice touch.", product: "Ferrari Team Polo 2026", date: "May 2026" },
  { name: "Sneha Patel", rating: 4, text: "Good quality jersey, fits true to size. Packaging was really nice too. Only wish there were more retro options. Overall very happy!", product: "Argentina Home WC 2026", date: "Jul 2026" },
  { name: "Vikram Reddy", rating: 5, text: "Ordered the McLaren merch for my dad's birthday. He absolutely loved it. The quality exceeded our expectations. 10/10 recommend.", product: "McLaren Team Tee 2026", date: "Jun 2026" },
  { name: "Ananya Gupta", rating: 5, text: "Finally a store that delivers authentic jerseys without burning a hole in your pocket. The World Cup collection is amazing! 🏆", product: "Brazil Home WC 2026", date: "Jul 2026" },
];

function Star({ filled }: { filled: boolean }) {
  return (
    <svg className={`h-3 w-3 sm:h-4 sm:w-4 ${filled ? "text-yellow-400" : "text-border/60"}`} viewBox="0 0 20 20" fill="currentColor">
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
  return <SiteChrome><Home /></SiteChrome>;
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
  const worldCupImg = useSiteImage("worldcup-banner");
  const catFootball = useSiteImage("category-football");
  const catF1 = useSiteImage("category-f1");
  const zoneMessi = useSiteImage("zone-messi");
  const zoneRonaldo = useSiteImage("zone-ronaldo");
  const zoneVerstappen = useSiteImage("zone-verstappen");
  const zoneHamilton = useSiteImage("zone-hamilton");
  
  const activeDrop = drops[0] ?? DEFAULT_DROPS[0];
  const c = useCountdown(activeDrop.endsAt);
  const featured = products.slice(0, 8);
  const drop = products.find((p) => p.id === activeDrop.productId) ?? products.find((p) => p.badge === "Limited") ?? products[0];

  return (
    <>
      {/* NEW MOBILE LAYOUT (Inspired by thejerseynation.in) */}
      <div className="sm:hidden">
        {/* MOBILE HERO BANNER (Small 2-3 inches version) */}
        <section className="relative w-full h-[240px] overflow-hidden">
          <div className="absolute inset-0">
            {isVideoUrl(heroBg) ? (
              <video src={heroBg} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <Picture src={heroBg} alt="" sizes="100vw" loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full" imgClassName="h-full w-full object-cover" />
            )}
            <div className="absolute inset-0 grid-noise opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="streak" style={{ top: "22%", animationDelay: "0s" }} />
              <div className="streak" style={{ top: "58%", animationDelay: "1.6s" }} />
              <div className="streak" style={{ top: "78%", animationDelay: "3.2s" }} />
            </div>
          </div>
          <div className="relative z-10 mx-auto flex h-full flex-col justify-end px-4 pb-5 pt-20">
            <div className="animate-reveal">

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Link to="/shop" className="group inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-black transition-all shadow-[0_0_15px_rgba(255,255,255,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.7)] hover:bg-brand hover:text-white hover:shadow-brand/50">
                  Enter collection <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative w-full h-[200px] overflow-hidden bg-surface mt-0">
          {isVideoUrl(worldCupImg) ? (
            <video src={worldCupImg} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <Picture src={worldCupImg} alt="World Cup" sizes="100vw" loading="eager" fetchPriority="high" className="absolute inset-0 h-full w-full" imgClassName="h-full w-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end px-5 pb-2 text-center z-10">
            <Link to="/shop/worldcup" className="inline-flex items-center justify-center rounded-full bg-transparent border border-white/70 px-6 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white hover:bg-white/10 active:scale-95 transition-all shadow-lg backdrop-blur-sm">
              Shop World Cup
            </Link>
          </div>
        </section>

        {/* CATEGORY BANNERS (Side-by-Side) */}
        <section className="w-full grid grid-cols-2 gap-3 bg-background px-4 pb-4 pt-1">
           <Link to="/shop/football" className="group relative block w-full aspect-square overflow-hidden rounded-2xl shadow-lg border border-border/20 transition-all active:scale-95">
             {isVideoUrl(catFootball) ? (
               <video src={catFootball} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />
             ) : catFootball ? (
               <img src={catFootball} alt="Football" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />
             ) : null}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:bg-brand/20 transition-colors duration-500" />
             <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
               <h2 className="font-display text-lg sm:text-xl font-bold tracking-widest text-white drop-shadow-md flex items-center justify-center gap-1.5 w-full">
                 FOOTBALL <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
               </h2>
             </div>
           </Link>
           <Link to="/shop/f1" className="group relative block w-full aspect-square overflow-hidden rounded-2xl shadow-lg border border-border/20 transition-all active:scale-95">
             {isVideoUrl(catF1) ? (
               <video src={catF1} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />
             ) : catF1 ? (
               <img src={catF1} alt="Formula 1" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" />
             ) : null}
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:bg-brand/20 transition-colors duration-500" />
             <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
               <h2 className="font-display text-lg sm:text-xl font-bold tracking-widest text-white drop-shadow-md flex items-center justify-center gap-1.5 w-full whitespace-nowrap">
                 FORMULA 1 <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
               </h2>
             </div>
           </Link>
        </section>


        {/* PROMO BAR */}
        <section className="w-full bg-gradient-to-b from-surface/80 to-background py-6 px-4 text-center border-b border-border/40">
          <p className="text-[13px] leading-relaxed text-foreground max-w-[300px] mx-auto">
            <span className="font-bold">Player Version Football Jerseys at just ₹599!</span> Experience premium quality and comfort in The Veloce style. Never Seen Before.
          </p>
        </section>

        {/* SHOP BY TEAM (MOBILE) */}
        <ShopByTeam />

        {/* SHOP BY ZONE (Horizontal Circular Scroll) */}
        <section className="w-full py-8 overflow-hidden">
          <div className="text-center px-4 mb-5">
            <h2 className="font-display text-2xl font-bold tracking-wide text-foreground">SHOP BY ZONE</h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">Scroll Right To Explore</p>
          </div>
          <div className="grid grid-cols-2 gap-3 px-4 pb-4">
            {ZONES.map((z) => {
              const zoneImageMap: Record<string, string> = {
                messi: zoneMessi,
                ronaldo: zoneRonaldo,
                verstappen: zoneVerstappen,
                hamilton: zoneHamilton,
              };
              const img = zoneImageMap[z.slug];
              return (
                <Link key={z.slug} to="/zone/$slug" params={{ slug: z.slug }} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-surface/50 border border-border/50">
                  <img src={img} alt={z.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                    <div className="mb-1 text-[8px] font-bold uppercase tracking-[0.3em] text-brand">{z.category === "f1" ? "Formula 1" : "Football"}</div>
                    <div className="font-display text-lg font-bold leading-tight text-white">{z.name}</div>
                    <div className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/70">{z.tagline}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* BEST OF INTERNATIONAL HOME KITS CAROUSEL */}
        <MobileKitsCarousel />
      </div>

      {/* DESKTOP HERO — cinematic video-like */}
      <section className="relative -mt-24 hidden sm:block h-[100svh] min-h-[700px] w-full overflow-hidden">
        <div className="absolute inset-0">
          {isVideoUrl(heroBg) ? (
            <video
              src={heroBg}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 h-full w-full object-cover animate-slow-zoom"
            />
          ) : (
            <Picture
              src={heroBg}
              alt=""
              sizes="100vw"
              loading="eager"
              fetchPriority="high"
              className="absolute inset-0 h-full w-full"
              imgClassName="h-full w-full object-cover animate-slow-zoom"
            />
          )}
          <div className="absolute inset-0 grid-noise opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/30" />
          {/* animated racing streaks */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="streak" style={{ top: "22%", animationDelay: "0s" }} />
            <div className="streak" style={{ top: "58%", animationDelay: "1.6s" }} />
            <div className="streak" style={{ top: "78%", animationDelay: "3.2s" }} />
          </div>
        </div>
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 pt-44 sm:px-6 sm:pb-24 sm:pt-48">
          <div className="animate-reveal">
            <div className="mb-4 flex items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-brand sm:text-[10px] sm:tracking-[0.32em]">
              <span className="h-px w-6 bg-brand sm:w-8" /> Season 25 · Global Drop
            </div>
            <h1 className="font-display text-[2rem] xs:text-[2.4rem] font-bold leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-[clamp(3rem,7vw,6rem)]">
              Precision.<br/>Rendered<br/><span className="italic text-brand">in fabric.</span>
            </h1>
            <p className="mt-4 max-w-lg text-[12px] leading-relaxed text-muted-foreground sm:text-base">
              Elite football jerseys and Formula 1 team merchandise, delivered with the craft of a couture atelier. Every piece authenticated. Every stitch, engineered.
            </p>
            <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-[9px] uppercase tracking-[0.2em] text-brand sm:text-[10px] sm:tracking-[0.24em]">
              <Gift className="h-3 w-3 shrink-0" /> <span className="truncate">BUY 2 GET 1 FREE · CODE B2G1</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-8">
              <Link to="/shop" className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-background transition hover:bg-brand hover:text-foreground sm:px-6 sm:text-xs sm:tracking-[0.24em]">
                Enter the collection <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES — 4 worlds */}
      <section id="worlds" className="mx-auto mt-12 hidden sm:block max-w-7xl px-5 sm:mt-24 sm:px-6">
        <div className="mb-6 sm:mb-10 flex items-end justify-between">
          <div>
            <div className="text-[9px] uppercase tracking-[0.28em] text-brand sm:text-[10px]">Four worlds. One atelier.</div>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-5xl">Choose your grid.</h2>
          </div>
          <Link to="/shop" className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground sm:block">Shop all</Link>
        </div>
        <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
          <CategoryCard href="/shop/football" img={catFootball} eyebrow="The Pitch" title="Football Jerseys" desc="Match-day kits from Madrid to München. Includes FIFA World Cup & Retro collections." />
          <CategoryCard href="/shop/f1" img={catF1} eyebrow="The Paddock" title="Formula 1 Merch" desc="Paddock-grade teamwear from every constructor — and the Legends series." />
        </div>
      </section>

      {/* PERKS STRIP — trust bar */}
      <PerksStrip />

      {/* TYPOGRAPHIC BANNER — inspired by editorial headline pattern */}
      <section className="relative mx-auto mt-14 hidden sm:block max-w-7xl overflow-hidden rounded-3xl border border-border/40 sm:mt-24">
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
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background/70" />
          <div className="relative z-10 flex h-full flex-col items-center justify-between px-5 pt-8 pb-2 text-center sm:pt-10 sm:pb-3">
            <div className="font-display text-2xl font-bold tracking-tight text-white sm:text-5xl">FIFA World Cup 2026</div>
            <div className="flex-1" />
            <Link to="/shop/worldcup" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-brand hover:text-foreground sm:px-6 sm:py-3 sm:text-xs">
              Shop World Cup
            </Link>
          </div>
        </div>
      </section>

      {/* SHOP BY TEAM (DESKTOP) */}
      <div className="hidden sm:block max-w-7xl mx-auto mt-12 sm:mt-24 px-6">
         <ShopByTeam />
      </div>

      {/* ZONES (DESKTOP) */}
      <section className="mx-auto mt-16 max-w-7xl px-6 sm:mt-32 hidden sm:block">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">SHOP BY ZONE</h2>
            <p className="mt-2 text-sm text-muted-foreground">Curated collections for the true fan.</p>
          </div>
          <Link to="/shop" className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-foreground transition-colors hover:text-brand">
            View All Zones <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ZONES.map((z) => {
            const zoneImageMap: Record<string, string> = {
              messi: zoneMessi,
              ronaldo: zoneRonaldo,
              verstappen: zoneVerstappen,
              hamilton: zoneHamilton,
            };
            const img = zoneImageMap[z.slug];
            return (
              <Link key={z.slug} to="/zone/$slug" params={{ slug: z.slug }} className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface">
                <img src={img} alt={z.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand">{z.category === "f1" ? "Formula 1" : "Football"}</div>
                  <div className="font-display text-2xl font-bold leading-none text-white sm:text-3xl">{z.name}</div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-white/70">{z.tagline}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* MARQUEE */}
      <section className="mt-14 overflow-hidden border-y border-border/50 py-5 sm:py-6 sm:mt-20">
        <div className="flex w-max animate-marquee gap-10 px-6 font-display text-lg font-medium text-muted-foreground sm:gap-14 sm:text-3xl">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i} className="flex items-center gap-10 sm:gap-14"><span>{t}</span><span className="text-brand">✕</span></span>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto mt-6 sm:mt-20 max-w-7xl px-5 sm:px-6">
        <div className="mb-6 sm:mb-10 flex items-end justify-between">
          <div>
            <div className="text-[9px] uppercase tracking-[0.28em] text-brand sm:text-[10px]">Editors' Selection</div>
            <h2 className="mt-2 font-display text-2xl font-bold sm:text-5xl">Curated this week.</h2>
          </div>
          <Link to="/shop" className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">All products →</Link>
        </div>
        <div className="grid grid-cols-2 gap-y-6 gap-x-3 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => <ProductCard key={p.id} p={p} priority={i < 4} />)}
        </div>
      </section>

      {/* LIMITED DROP */}
      {drop && (
        <section className="mx-auto mt-14 max-w-7xl px-5 sm:mt-24 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-surface via-background to-surface p-6 sm:p-14">
            <div className="grid gap-10 md:grid-cols-2 md:items-center">
              <div>
                <div className="text-[9px] uppercase tracking-[0.28em] text-brand sm:text-[10px]">{activeDrop.eyebrow}</div>
                <h2 className="mt-3 font-display text-2xl font-bold leading-tight sm:text-6xl">{drop.name}.</h2>
                <p className="mt-4 max-w-md text-xs text-muted-foreground sm:text-sm">Numbered edition. Individually authenticated. Once it's gone, it's archived forever.</p>
                <div className="mt-6 grid grid-cols-4 gap-2 sm:mt-8 sm:gap-3">
                  {[["Days", c.days], ["Hours", c.hours], ["Min", c.mins], ["Sec", c.secs]].map(([k, v]) => (
                    <div key={k as string} className="rounded-xl border border-border/50 bg-background/40 p-2 text-center backdrop-blur sm:p-3">
                      <div className="font-mono text-lg font-bold sm:text-3xl">{String(v).padStart(2, "0")}</div>
                      <div className="mt-1 text-[9px] uppercase tracking-[0.24em] text-muted-foreground">{k}</div>
                    </div>
                  ))}
                </div>
                <Link to="/product/$id" params={{ id: drop.id }} className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background hover:bg-brand hover:text-foreground">
                  ORDER NOW <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="relative aspect-[4/5] max-w-[220px] sm:max-w-none mx-auto w-full overflow-hidden rounded-2xl">
                <Picture
                  src={drop.images[0]}
                  alt={drop.name}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="absolute inset-0 h-full w-full"
                  imgClassName="h-full w-full object-cover animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />              </div>
            </div>
          </div>
        </section>
      )}

      {/* BRAND STORY */}
      <section className="mx-auto mt-12 sm:mt-32 max-w-4xl px-6 text-center">
        <div className="text-[10px] uppercase tracking-[0.32em] text-brand">The Veloce Standard</div>
        <p className="mt-6 font-display text-xl leading-snug tracking-tight text-balance sm:text-5xl">
          "We treat every jersey and every team suit like a museum piece. Because to the fans who wear them, that's exactly what they are."
        </p>
        <div className="mt-6 text-xs uppercase tracking-[0.24em] text-muted-foreground">— Alessandro Vega · Founder</div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section className="mx-auto mt-8 sm:mt-24 max-w-7xl px-5 sm:px-6">
        <div className="mb-6 sm:mb-10 text-center">
          <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-brand">Trusted by fans</div>
          <h2 className="mt-2 font-display text-2xl font-bold sm:text-5xl">What our customers say.</h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="flex gap-0.5">{Array.from({length:5}).map((_,i)=><Star key={i} filled />)}</div>
            <span className="font-mono text-sm text-muted-foreground">4.9 / 5</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">· 2,847 reviews</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {REVIEWS.map((r, i) => (
            <div key={i} className="rounded-2xl border border-border/50 bg-card/40 p-4 sm:p-6 space-y-3 transition hover:border-border/80">
              <div className="flex gap-0.5">{Array.from({length:5}).map((_,j)=><Star key={j} filled={j < r.rating} />)}</div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">"{r.text}"</p>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-brand/20 text-[10px] sm:text-xs font-bold text-brand">{r.name.split(" ").map(n=>n[0]).join("")}</div>
                <div>
                  <div className="text-[11px] sm:text-xs font-semibold">{r.name}</div>
                  <div className="text-[9px] sm:text-[10px] text-muted-foreground">{r.product} · {r.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="mx-auto mt-10 sm:mt-24 max-w-2xl px-6 text-center">
        <div className="text-[10px] uppercase tracking-[0.28em] text-brand">Members' Preview</div>
        <h3 className="mt-2 font-display text-2xl font-bold sm:text-4xl">Drops. Delivered first.</h3>
        <form className="mt-6 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => { e.preventDefault(); const form = e.currentTarget; const email = (form.elements.namedItem("newsletter_email") as HTMLInputElement)?.value; if (email) { alert("You will be notified!"); form.reset(); } }}>
          <input name="newsletter_email" type="email" required placeholder="your@email.com" className="flex-1 rounded-full border border-border/70 bg-transparent px-5 py-3 text-sm outline-none focus:border-foreground" />
          <button type="submit" className="rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background hover:bg-brand hover:text-foreground">Get access</button>
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
            <video
              src={filmVideo}
              autoPlay
              controls
              playsInline
              className="h-full w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}

type CatHref = "/shop/football" | "/shop/f1" | "/shop/worldcup" | "/shop/retro";
function CategoryCard({ href, img, eyebrow, title, desc }: { href: CatHref; img: string; eyebrow: string; title: string; desc: string }) {
  const isVid = isVideoUrl(img);
  return (
    <Link to={href} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[3/2]">
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
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
        <div className="text-[9px] uppercase tracking-[0.28em] text-brand sm:text-[10px]">{eyebrow}</div>
        <h3 className="mt-2 font-display text-2xl font-bold sm:text-5xl">{title}</h3>
        <p className="mt-2 max-w-md text-xs text-muted-foreground sm:text-sm">{desc}</p>
        <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-foreground">
          Explore <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

function ZoneCard({ slug, name, tagline, world, img }: { slug: Zone; name: string; tagline: string; world: string; img: string }) {
  const isVid = isVideoUrl(img);
  return (
    <Link to="/zone/$slug" params={{ slug }} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-border/40">
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
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-5">
        <div className="text-[9px] uppercase tracking-[0.28em] text-brand">{world}</div>
        <div className="mt-1 font-display text-2xl font-bold">{name}</div>
        <div className="text-[11px] text-muted-foreground">{tagline}</div>
        <div className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.24em]">Enter zone <ArrowUpRight className="h-3 w-3" /></div>
      </div>
    </Link>
  );
}

function MobileKitsCarousel() {
  const { products } = useCatalog();
  const { hotSellingIds, loaded } = useHotSelling();
  const defaultKits = products.filter(p => p.category === 'football' && p.name.toLowerCase().includes('home')).slice(0, 4);
  const slides = hotSellingIds.length > 0
    ? hotSellingIds.map(id => products.find(p => p.id === id)).filter(Boolean) as import("@/lib/catalog").Product[]
    : (defaultKits.length > 0 ? defaultKits : products.slice(0, 4));
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaded || slides.length === 0) return;
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const container = scrollRef.current;
      const nextIdx = (activeIdx + 1) % slides.length;
      const width = container.clientWidth;
      container.scrollTo({ left: width * nextIdx, behavior: 'smooth' });
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIdx, slides.length, loaded]);

  if (!loaded || slides.length === 0) return null;

  return (
    <section className="w-full bg-surface overflow-hidden border-y border-border/40">
      <div className="text-center px-4 pt-10 pb-6 relative z-20 bg-surface">
        <h2 className="font-display text-[32px] sm:text-[36px] font-black leading-[1] tracking-tight text-foreground uppercase flex flex-col items-center">
          <span>Hot Selling</span>
          <span className="relative inline-block">
            Kits
            <div className="absolute top-[85%] left-1/2 -translate-x-1/2 w-[220px] sm:w-[260px] text-[#b5ff14] pointer-events-none">
              <svg viewBox="0 0 240 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
                <path d="M10,10 Q80,5 230,8 Q120,20 30,22 Q100,28 150,26" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
              </svg>
            </div>
          </span>
        </h2>
      </div>

      <div className="relative w-full h-[420px] sm:h-[500px] overflow-hidden border-t border-white/10">
        <div 
          ref={scrollRef}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth pb-4"
          onScroll={(e) => {
            const scrollLeft = e.currentTarget.scrollLeft;
            const width = e.currentTarget.clientWidth;
            setActiveIdx(Math.round(scrollLeft / width));
          }}
        >
          {slides.map((p) => {
            const img = p.images[0] || "";
            return (
              <div key={p.id} className="relative w-full h-full shrink-0 snap-center">
                <Link to="/product/$id" params={{ id: p.id }} className="block w-full h-full relative overflow-hidden">
                  <Picture src={img} alt={p.name} className="absolute inset-0 w-full h-full" imgClassName="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-10 left-5 right-5 text-center">
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase tracking-tighter leading-tight drop-shadow-lg">
                      {p.team}
                    </h3>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        
        {/* Dots */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center items-center gap-3 z-20 pointer-events-none">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`transition-all duration-300 ${
                i === activeIdx
                  ? 'h-2 w-4 rounded-full bg-foreground' 
                  : 'h-1.5 w-1.5 rounded-full bg-foreground/30'
              }`} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ShopByTeam() {
  const teams = Object.entries(TEAM_LOGOS);
  const f1Teams = ["Ferrari", "Mercedes", "Red Bull", "McLaren", "Alpine", "Aston Martin"];
  
  return (
    <section className="w-full py-8 sm:py-10 bg-transparent overflow-hidden sm:border-y sm:border-border/40">
      <div className="text-center px-4 mb-6 sm:mb-8 flex flex-col items-center sm:items-start sm:px-0">
        <div className="hidden sm:block text-[10px] uppercase tracking-[0.28em] text-brand mb-2">Authentic Badges</div>
        <h2 className="font-display text-2xl sm:text-4xl font-bold tracking-wide text-foreground">SHOP BY TEAM</h2>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1 sm:hidden">Tap a badge to explore</p>
      </div>
      
      {/* Horizontal scrolling container */}
      <div className="flex w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 pb-4 gap-4 sm:px-0 sm:gap-6 sm:flex-wrap sm:justify-start">
        {teams.map(([team, logo]) => (
          <Link 
            key={team} 
            to={f1Teams.includes(team) ? "/shop/f1" : "/shop/football"}
            search={{ team } as never}
            className="shrink-0 snap-center flex flex-col items-center gap-3 group w-[72px] sm:w-[90px]"
          >
            <div className="w-[72px] h-[72px] sm:w-[90px] sm:h-[90px] rounded-full bg-white border border-border/50 shadow-sm flex items-center justify-center p-3.5 sm:p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-gray-100 group-hover:border-white/20">
              <img src={logo} alt={team} className="max-w-full max-h-full object-contain filter drop-shadow-md" />
            </div>
            <span className="text-[9px] sm:text-[10px] text-center font-semibold text-muted-foreground group-hover:text-foreground leading-tight">
              {team}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
