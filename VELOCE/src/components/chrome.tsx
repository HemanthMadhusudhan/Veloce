import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef, type ReactNode } from "react";
import { Search, Heart, ShoppingBag, User, Menu, X, Trash2, Clock, TrendingUp, Minus, Plus, ChevronDown, ChevronRight, Gift, Truck, ShieldCheck, RefreshCw, Banknote, Settings, Home, Store, MoreHorizontal, MessageSquare, Sparkles, Wallet, LogIn, LogOut, ArrowLeft } from "lucide-react";
import { Logo } from "./Logo";
import { FortuneSpin } from "./FortuneSpin";
import { useShop } from "@/lib/store";
import { TRENDING, ZONES } from "@/lib/catalog";
import { LEAGUES, FOOTBALL_QUICK_LINKS } from "@/lib/leagues";
import { useCatalog } from "@/lib/catalog-store";
import { formatINR } from "@/lib/format";
import { computeCart } from "@/lib/pricing";
import { TEAM_LOGOS, f1Teams, basketballTeams, cricketTeams, cricketInternationalTeams, cricketIPLTeams, footballTeams, worldCupTeams } from "@/lib/logos";
import { useTeams } from "@/lib/teams";

const NAV = [
  { label: "Formula 1", to: "/shop/f1" as const },
  { label: "Basketball", to: "/shop/basketball" as const },
  { label: "Cricket", to: "/shop/cricket" as const },
  { label: "Shop All", to: "/shop" as const },
];
const FOOTBALL_SUB = [
  { label: "All Football", to: "/shop/football" as const },
  { label: "FIFA World Cup", to: "/shop/worldcup" as const },
];

export function TopAnnouncementTicker() {
  const textItems = [
    "WORN BY 1,000+ FANS",
    "100% AUTHENTIC MATCHWEAR",
    "4-DAY EASY EXCHANGE",
    "FREE SHIPPING PAN INDIA",
    "COD AVAILABLE",
  ];

  return (
    <div className="w-full bg-[#0c0f17] text-white text-[10px] sm:text-[11px] font-medium uppercase tracking-widest py-1.5 overflow-hidden whitespace-nowrap select-none flex items-center border-b border-white/10">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused] cursor-default">
        {[0, 1].map((copyIdx) => (
          <div key={copyIdx} className="flex shrink-0 items-center gap-8 sm:gap-14 pr-8 sm:pr-14" aria-hidden={copyIdx > 0}>
            {textItems.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-3 tracking-widest">
                <span className="text-white/40 text-xs">•</span>
                <span className="text-neutral-300">{item}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function NikeSearchIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="5.8" />
      <line x1="14.8" y1="14.8" x2="19.5" y2="19.5" />
    </svg>
  );
}

export function NikeHeartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

export function NikeBagIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 8.5V6.5a3 3 0 0 1 6 0v2" />
      <path d="M5.5 8.5h13a1 1 0 0 1 1 1v8.5a3 3 0 0 1-3 3H7.5a3 3 0 0 1-3-3V9.5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function NikeMenuIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <line x1="4" y1="8" x2="20" y2="8" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="16" x2="20" y2="16" />
    </svg>
  );
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cart, wishlist, isAdmin, userEmail, signOut, openSearch } = useShop();
  const location = useLocation();
  const nav = useNavigate();
  const { getById } = useCatalog();
  const cartCount = cart.filter((x) => x.id && getById(x.id)).reduce((a, b) => a + b.qty, 0);

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-50 flex flex-col transition-all duration-300 ${
          isTransparent
            ? "bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white border-b-0 shadow-none"
            : "bg-white/95 backdrop-blur-md text-neutral-900 border-b border-black/10 shadow-md shadow-black/5"
        }`}
      >
        {/* Main Header */}
        <div className="flex w-full max-w-[1480px] mx-auto items-center justify-between px-3 sm:px-6 lg:px-8 py-3 gap-2 sm:gap-4">
          {/* Left: Brand Logo (Always Red) */}
          <div className="flex items-center shrink-0">
            <Logo />
          </div>

          {/* Center: Desktop Navigation Bar (Clean Responsive Spacing) */}
          <div
            className={`hidden lg:flex items-center justify-center gap-2.5 xl:gap-5 2xl:gap-6 text-[11px] xl:text-xs 2xl:text-[13px] font-bold uppercase tracking-wide whitespace-nowrap flex-1 px-2 xl:px-4 transition-colors duration-300 ${
              isTransparent ? "text-white" : "text-neutral-900"
            }`}
          >
            <Link to="/new-kits" className="hover:opacity-80 transition-opacity flex items-center gap-1" activeProps={{ className: "font-black underline" }}>
              <span>New Kits</span>
            </Link>
            <Link to="/shop" className="hover:opacity-80 transition-opacity" activeProps={{ className: "font-black underline" }}>Shop All</Link>
            <FootballMenu />
            <F1Menu />
            <CricketMenu />
            <BasketballMenu />
            <WorldCupMenu />
            <Link to="/shop/accessories" className="hover:opacity-80 transition-opacity" activeProps={{ className: "font-black underline" }}>Accessories</Link>
          </div>

          {/* Right Utilities Container */}
          <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2 shrink-0">
            {/* Desktop Pill Search Input */}
            <button
              onClick={openSearch}
              className={`hidden lg:flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs w-28 xl:w-36 2xl:w-44 cursor-pointer border transition shadow-2xs ${
                isTransparent
                  ? "bg-white/15 hover:bg-white/25 text-white border-white/20"
                  : "bg-[#f5f5f5] hover:bg-[#eaeaea] text-neutral-500 border-transparent focus-within:border-black/10"
              }`}
              aria-label="Search"
            >
              <NikeSearchIcon className={`h-4 w-4 shrink-0 ${isTransparent ? "text-white" : "text-black"}`} />
              <span className={`text-xs font-medium truncate ${isTransparent ? "text-white/80" : "text-neutral-400"}`}>Search</span>
            </button>

            {/* Mobile / Tablet Search Icon */}
            <button
              onClick={openSearch}
              className={`flex lg:hidden h-9 w-9 items-center justify-center rounded-full transition cursor-pointer ${
                isTransparent ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5"
              }`}
              aria-label="Search store"
            >
              <NikeSearchIcon className="h-5 w-5 currentColor" />
            </button>

            {/* Desktop Wishlist Heart Icon */}
            <Link
              to="/wishlist"
              className={`relative hidden lg:flex h-9 w-9 items-center justify-center rounded-full transition cursor-pointer ${
                isTransparent ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5"
              }`}
              onClick={(e) => {
                if (!userEmail) {
                  e.preventDefault();
                  nav({ to: "/login" });
                }
              }}
              aria-label="Wishlist"
            >
              <NikeHeartIcon className="h-5.5 w-5.5 currentColor" />
              {wishlist.length > 0 && (
                <span className="pointer-events-none absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d32f2f] px-1 font-mono text-[9px] font-bold text-white shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Desktop Profile Icon */}
            <Link
              to={userEmail ? "/profile" : "/login"}
              className={`hidden lg:flex h-9 w-9 items-center justify-center rounded-full transition cursor-pointer ${
                isTransparent ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5"
              }`}
              aria-label="Profile"
              title={userEmail ? "Account Profile" : "Log In"}
            >
              <User className="h-5 w-5 currentColor" />
            </Link>

            {/* Shopping Bag Icon (PC & Mobile) */}
            <button
              onClick={() => {
                if (window.innerWidth >= 640 && !userEmail) {
                  nav({ to: "/login" });
                } else {
                  nav({ to: "/checkout" });
                }
              }}
              className={`relative flex h-9 w-9 items-center justify-center rounded-full transition cursor-pointer ${
                isTransparent ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5"
              }`}
              aria-label="Bag"
            >
              <NikeBagIcon className="h-5.5 w-5.5 currentColor" />
              {cartCount > 0 && (
                <span className="pointer-events-none absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d32f2f] px-1 font-mono text-[9px] font-bold text-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger Drawer Trigger Icon (Mobile & Tablet) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={`flex lg:hidden h-9 w-9 items-center justify-center rounded-full transition cursor-pointer ${
                isTransparent ? "text-white hover:bg-white/10" : "text-black hover:bg-black/5"
              }`}
              aria-label="Open menu"
            >
              <NikeMenuIcon className="h-5.5 w-5.5 currentColor" />
            </button>
          </div>
        </div>
      </nav>

      {/* Slide-out Hamburger Drawer */}
      <SideDrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

function IconChip({ children, onClick, label, className }: { children: ReactNode; onClick?: () => void; label: string; className?: string }) {
  const classes = `flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition hover:bg-white/10 hover:text-foreground ${className ?? ""}`;
  if (onClick) {
    return (
      <button onClick={onClick} aria-label={label} className={classes}>
        {children}
      </button>
    );
  }
  return (
    <div aria-label={label} className={classes}>
      {children}
    </div>
  );
}
function Dot({ children }: { children: ReactNode }) {
  return <span className="pointer-events-none absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 font-mono text-[9px] font-bold text-white">{children}</span>;
}

function FootballMenu() {
  const [open, setOpen] = useState(false);
  const { combinedFootball, combinedWC } = useTeams();
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link to="/shop/football" className="flex items-center gap-1 uppercase tracking-wider transition-opacity hover:opacity-80">
        Football <ChevronDown className="h-3 w-3" />
      </Link>
      {open && (
        <div className="absolute left-0 top-full w-[950px] max-w-[92vw] pt-3 z-50">
          <div className="glass flex flex-col rounded-2xl p-6 shadow-2xl bg-white border border-border/40 max-h-[80vh] overflow-y-auto hide-scrollbar">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-8">
                <div className="mb-4 text-[10px] uppercase tracking-[0.28em] font-bold text-brand">Football Clubs</div>
                <div className="grid grid-cols-5 gap-x-4 gap-y-6">
                  {combinedFootball.map(([t, logo]) => (
                    <Link key={t} to="/shop/football" search={{ team: t } as never} onClick={() => setOpen(false)} className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-16 h-16 rounded-full bg-white border border-border/40 flex items-center justify-center p-3 shadow-sm hover:shadow-md hover:border-black transition-all">
                        <img src={logo} alt={t} loading="lazy" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-[10px] text-center font-medium text-black leading-tight group-hover:font-bold">{t}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="col-span-4 pl-8 border-l border-border/40">
                <div className="mb-4 text-[10px] uppercase tracking-[0.28em] font-bold text-brand">National Teams</div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                  {combinedWC.map(([t, logo]) => (
                    <Link key={t} to="/shop/football" search={{ team: t } as never} onClick={() => setOpen(false)} className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-16 h-16 rounded-full bg-white border border-border/40 flex items-center justify-center p-3 shadow-sm hover:shadow-md hover:border-black transition-all">
                        <img src={logo} alt={t} loading="lazy" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-[10px] text-center font-medium text-black leading-tight group-hover:font-bold">{t}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WorldCupMenu() {
  const [open, setOpen] = useState(false);
  const { combinedWC } = useTeams();
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link to="/shop/worldcup" className="flex items-center gap-1 uppercase tracking-wider transition-opacity hover:opacity-80">
        World Cup <ChevronDown className="h-3 w-3" />
      </Link>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-[800px] max-w-[92vw] pt-3 z-50">
          <div className="glass flex flex-col gap-6 rounded-2xl p-6 shadow-2xl bg-white border border-border/40">
            <div className="text-[15px] font-bold tracking-tight text-black flex items-center justify-between">
               <span>FIFA World Cup Teams</span>
            </div>
            <div className="grid grid-cols-6 gap-x-4 gap-y-6">
              {combinedWC.map(([t, logo]) => (
                <Link key={t} to="/shop/worldcup" search={{ team: t } as never} onClick={() => setOpen(false)} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-white border border-border/40 flex items-center justify-center p-3 shadow-sm hover:shadow-md hover:border-black transition-all">
                    <img src={logo} alt={t} loading="lazy" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-[10px] text-center font-medium text-black leading-tight group-hover:font-bold">{t}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function F1Menu() {
  const [open, setOpen] = useState(false);
  const { combinedF1 } = useTeams();
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link to="/shop/f1" className="flex items-center gap-1 uppercase tracking-wider transition-opacity hover:opacity-80">
        Formula 1 <ChevronDown className="h-3 w-3" />
      </Link>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-[800px] max-w-[92vw] pt-3 z-50">
          <div className="glass flex flex-col gap-6 rounded-2xl p-6 shadow-2xl bg-white border border-border/40">
            <div className="text-[15px] font-bold tracking-tight text-black flex items-center justify-between">
               <span>Formula 1 Merch</span>
            </div>
            <div className="grid grid-cols-6 gap-x-4 gap-y-6">
              {combinedF1.map(([t, logo]) => (
                <Link key={t} to="/shop/f1" search={{ team: t } as never} onClick={() => setOpen(false)} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-white border border-border/40 flex items-center justify-center p-3 shadow-sm hover:shadow-md hover:border-black transition-all">
                    <img src={logo} alt={t} loading="lazy" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-[10px] text-center font-medium text-black leading-tight group-hover:font-bold">{t}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BasketballMenu() {
  const [open, setOpen] = useState(false);
  const { combinedB } = useTeams();
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link to="/shop/basketball" className="flex items-center gap-1 uppercase tracking-wider transition-opacity hover:opacity-80">
        Basketball <ChevronDown className="h-3 w-3" />
      </Link>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-[800px] max-w-[92vw] pt-3 z-50">
          <div className="glass flex flex-col gap-6 rounded-2xl p-6 shadow-2xl bg-white border border-border/40">
            <div className="text-[15px] font-bold tracking-tight text-black flex items-center justify-between">
               <span>Basketball Jerseys</span>
            </div>
            <div className="grid grid-cols-6 gap-x-4 gap-y-6">
              {combinedB.map(([t, logo]) => (
                <Link key={t} to="/shop/basketball" search={{ team: t } as never} onClick={() => setOpen(false)} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-white border border-border/40 flex items-center justify-center p-3 shadow-sm hover:shadow-md hover:border-black transition-all">
                    <img src={logo} alt={t} loading="lazy" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-[10px] text-center font-medium text-black leading-tight group-hover:font-bold">{t}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CricketMenu() {
  const [open, setOpen] = useState(false);
  const { combinedCricketIPL, combinedCricketInt } = useTeams();
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link to="/shop/cricket" className="flex items-center gap-1 uppercase tracking-wider transition-opacity hover:opacity-80">
        Cricket <ChevronDown className="h-3 w-3" />
      </Link>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full w-[900px] max-w-[92vw] pt-3 z-50">
          <div className="glass flex flex-col rounded-2xl p-6 shadow-2xl bg-white border border-border/40 max-h-[80vh] overflow-y-auto hide-scrollbar">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-7 flex flex-col">
                <div className="mb-4 text-[10px] uppercase tracking-[0.28em] font-bold text-brand">Cricket Jerseys</div>
                <div className="grid grid-cols-4 gap-x-4 gap-y-6">
                  {combinedCricketIPL.map(([t, logo]) => (
                    <Link key={t} to="/shop/cricket" search={{ team: t } as never} onClick={() => setOpen(false)} className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-16 h-16 rounded-full bg-white border border-border/40 flex items-center justify-center p-3 shadow-sm hover:shadow-md hover:border-black transition-all">
                        <img src={logo} alt={t} loading="lazy" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-[10px] text-center font-medium text-black leading-tight group-hover:font-bold">{t}</span>
                    </Link>
                  ))}
                </div>
              </div>
              <div className="col-span-5 flex flex-col pl-8 border-l border-border/40">
                <div className="mb-4 text-[10px] uppercase tracking-[0.28em] font-bold text-brand">National Teams</div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                  {combinedCricketInt.map(([t, logo]) => (
                    <Link key={t} to="/shop/cricket" search={{ team: t } as never} onClick={() => setOpen(false)} className="flex flex-col items-center gap-2 group cursor-pointer">
                      <div className="w-16 h-16 rounded-full bg-white border border-border/40 flex items-center justify-center p-3 shadow-sm hover:shadow-md hover:border-black transition-all">
                        <img src={logo} alt={t} loading="lazy" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <span className="text-[10px] text-center font-medium text-black leading-tight group-hover:font-bold">{t}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PerksStrip() {
  const perks = [
    { icon: RefreshCw, label: "4-DAY EASY EXCHANGE" },
    { icon: ShieldCheck, label: "100% Authentic" },
    { icon: Banknote, label: "COD AVAILABLE" },
    { icon: Truck, label: "FREE SHIPPING ON ALL ORDERS" },
  ];
  return (
    <section className="mx-auto mt-6 sm:mt-20 max-w-7xl px-5 sm:px-6">
      <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/50 bg-surface/40 p-4 sm:grid-cols-4 sm:gap-6 sm:p-6">
        {perks.map((p) => (
          <div key={p.label} className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/15 text-brand">
              <p.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/90 sm:text-[12px]">{p.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SiteFooter() {
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  const toggleAccordion = (title: string) => {
    setOpenAccordion(openAccordion === title ? null : title);
  };

  const footerData = [
    {
      title: "FOOTBALL",
      links: [
        ["All Football", "/shop/football"],
        ["World Cup", "/shop/worldcup"],
      ]
    },
    {
      title: "FORMULA 1",
      links: [
        ["All Formula 1", "/shop/f1"],
        ["Ferrari", "/shop/f1?team=Ferrari"],
        ["Red Bull", "/shop/f1?team=Red%20Bull"],
        ["Mercedes", "/shop/f1?team=Mercedes"],
      ]
    },
    {
      title: "CRICKET",
      links: [
        ["All Cricket", "/shop/cricket"],
        ["India", "/shop/cricket?team=India"],
        ["CSK", "/shop/cricket?team=Chennai%20Super%20Kings"],
        ["RCB", "/shop/cricket?team=Royal%20Challengers%20Bangalore"],
      ]
    },
    {
      title: "BASKETBALL",
      links: [
        ["All Basketball", "/shop/basketball"],
        ["Lakers", "/shop/basketball?team=Los%20Angeles%20Lakers"],
        ["Bulls", "/shop/basketball?team=Chicago%20Bulls"],
        ["Warriors", "/shop/basketball?team=Golden%20State%20Warriors"],
      ]
    }
  ];

  return (
    <footer className="mt-16 sm:mt-32 bg-[#1f1f1f] text-white">
      <div className="mx-auto max-w-7xl">
        {/* Mobile Accordions */}
        <div className="flex flex-col sm:hidden">
          {footerData.map((col) => (
            <div key={col.title} className="border-b border-white/10">
              <button 
                onClick={() => toggleAccordion(col.title)}
                className="w-full px-6 py-4 flex items-center justify-between font-bold text-[15px] tracking-wide"
              >
                {col.title}
                <ChevronDown className={`h-4 w-4 transition-transform ${openAccordion === col.title ? 'rotate-180' : ''}`} />
              </button>
              {openAccordion === col.title && (
                <div className="px-6 pb-4 flex flex-col gap-3">
                  {col.links.map(([l, h]) => (
                    <a key={l} href={h} className="text-sm text-gray-300 hover:text-white transition-colors">
                      {l}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="px-6 py-6 border-b border-white/10">
            <button className="w-full border border-white/20 bg-[#181818] py-3 flex items-center justify-center gap-2 rounded-sm text-sm font-bold tracking-wide">
              <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="India" loading="lazy" className="w-5 h-3.5 object-cover" />
              INDIA
            </button>
          </div>
        </div>

        {/* Desktop Grid */}
        <div className="hidden sm:grid gap-8 grid-cols-5 px-6 py-16">
          <div className="col-span-1 mb-4 sm:mb-0">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-gray-400">Elite jerseys and merchandise. Engineered precision. Cinematic detail.</p>
          </div>
          {footerData.map((col) => (
            <FooterCol key={col.title} title={col.title} links={col.links as [string, string][]} />
          ))}
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col items-start justify-between gap-4 px-6 py-8 text-xs text-gray-400 sm:flex-row border-t border-white/10">
          <div>© {new Date().getFullYear()} Veloce Wear Atelier. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="/info/privacy-policy" className="hover:text-white">Privacy</a>
            <a href="/info/terms-and-conditions" className="hover:text-white">Terms</a>
            <a href="/info/cookies" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="mb-4 font-bold text-[15px] tracking-wide text-white">{title}</div>
      <ul className="space-y-3">
        {links.map(([l, h]) => <li key={l}><a href={h} className="text-sm text-gray-400 transition-colors hover:text-white">{l}</a></li>)}
      </ul>
    </div>
  );
}

export function CartDrawer() {
  const nav = useNavigate();
  const { cart, cartOpen, closeCart, updateQty, removeFromCart, userId } = useShop();
  const { getById } = useCatalog();
  const totals = useMemo(() => computeCart(cart, getById), [cart, getById]);
  const { lines, subtotal, discount, freeUnits, shipping, tax, total, couponApplied } = totals;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cartOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [cartOpen]);

  if (!cartOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] overflow-hidden" role="dialog">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in" onClick={closeCart} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[100vw] sm:max-w-md flex-col border-l border-border/60 bg-background shadow-2xl animate-in slide-in-from-right overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-5">
          <div className="font-display text-lg font-semibold">Your Bag <span className="ml-2 font-mono text-xs text-muted-foreground">{lines.length} items</span></div>
          <button onClick={closeCart} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        {/* B2G1 progress strip */}
        <div className="border-b border-border/60 bg-brand/10 px-6 py-3 text-[11px] uppercase tracking-[0.18em]">
          {freeUnits > 0 ? (
            <div className="flex items-center gap-2 text-brand"><Gift className="h-3.5 w-3.5" /> B2G1 applied · {freeUnits} item{freeUnits > 1 ? "s" : ""} FREE</div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground"><Gift className="h-3.5 w-3.5" /> Add {Math.max(0, 3 - totals.itemCount)} more · Buy 2 Get 1 Free</div>
          )}
        </div>
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Your bag is empty.</div>
              <Link to="/shop" onClick={closeCart} className="rounded-full bg-foreground px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-background">Shop now</Link>
            </div>
          ) : (
            <ul className="divide-y divide-border/50">
              {lines.map(({ item, product, freeUnits: fu, lineSubtotal, lineDiscount }) => (
                <li key={item.id + item.size + item.color} className="flex gap-4 py-4">
                  <img src={product.images[0]} alt={product.name} loading="lazy" className="h-24 w-20 rounded-lg object-cover" />
                  <div className="flex flex-1 min-w-0 flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-display text-sm font-semibold">{product.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.size} · {item.color}
                        </div>
                        {item.customName && (
                          <div className="text-[10px] uppercase tracking-wider text-brand mt-0.5">
                            Print: {item.customName} #{item.customNumber || "00"}
                          </div>
                        )}
                        {fu > 0 && <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-brand"><Gift className="h-2.5 w-2.5" />{fu}× Free · B2G1</div>}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono text-sm">{formatINR(lineSubtotal)}</div>
                        {lineDiscount > 0 && <div className="font-mono text-[10px] text-brand">−{formatINR(lineDiscount)}</div>}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-border/70">
                        <button onClick={() => updateQty(item.id, item.size, item.color, item.qty - 1)} className="px-2 py-1"><Minus className="h-3 w-3" /></button>
                        <span className="w-6 text-center font-mono text-xs">{item.qty}</span>
                        <button onClick={() => {
                          const p = getById(item.id);
                          const available = p?.stockBySize?.[item.size] !== undefined ? p.stockBySize[item.size] : (p?.stock ?? 0);
                          updateQty(item.id, item.size, item.color, Math.min(available, item.qty + 1));
                        }} className="px-2 py-1"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.size, item.color)} className="text-muted-foreground hover:text-brand" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {lines.length > 0 && (
          <div className="border-t border-border/60 px-6 py-5 space-y-3">
            <div className="space-y-1 text-xs">
              <Row k="Subtotal" v={formatINR(subtotal)} />
              {discount > 0 && <Row k={`B2G1 (${couponApplied})`} v={`−${formatINR(discount)}`} accent />}
              <Row k="Shipping" v={shipping === 0 ? "Free" : formatINR(shipping)} />
              <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-2 text-sm">
                <span className="font-display font-semibold">Total</span>
                <span className="font-mono">{formatINR(total)}</span>
              </div>
            </div>
            <button onClick={() => { closeCart(); nav({ to: userId ? "/checkout" : "/login" }); }} className="mt-2 w-full rounded-full bg-foreground py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-brand hover:text-foreground">
              Checkout · {formatINR(total)}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className={accent ? "text-brand font-mono" : "font-mono"}>{v}</span></div>;
}

export function SearchDialog() {
  const { searchOpen, closeSearch } = useShop();
  const { products } = useCatalog();
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const ALL_SUGGESTIONS = useMemo(() => {
    const list: string[] = [];
    
    // 1. Add actual store product names from catalog
    products.forEach((p) => {
      if (p.name && !list.includes(p.name)) {
        list.push(p.name);
      }
    });

    // 2. Add product team names
    products.forEach((p) => {
      if (p.team && !list.includes(p.team)) {
        list.push(p.team);
      }
    });

    return list;
  }, [products]);

  const handleSuggestionClick = (suggestion: string) => {
    const matchingProduct = products.find(
      (p) => p.name.toLowerCase() === suggestion.toLowerCase()
    );
    if (matchingProduct) {
      go(matchingProduct.id);
    } else {
      setQ(suggestion);
      handleSearchSubmit(suggestion);
    }
  };

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQ("");
    }
  }, [searchOpen]);

  if (!searchOpen) return null;

  const go = (id: string) => {
    closeSearch();
    nav({ to: "/product/$id", params: { id } });
  };

  const handleSearchSubmit = (searchWord?: string) => {
    const term = (searchWord || q).trim();
    if (!term) return;
    closeSearch();
    nav({ to: "/search", search: { q: term } as any });
  };

  const results = q.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.category.toLowerCase().includes(q.toLowerCase()) ||
          (p.team && p.team.toLowerCase().includes(q.toLowerCase())) ||
          (p.driver && p.driver.toLowerCase().includes(q.toLowerCase()))
      )
    : [];

  const topSuggestions = ALL_SUGGESTIONS.filter((s) =>
    !q.trim() ? true : s.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 8);

  const renderHighlightedText = (text: string, query: string) => {
    if (!query.trim()) return <span className="font-normal text-neutral-800">{text}</span>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <span className="font-normal text-neutral-800">{text}</span>;
    const match = text.slice(idx, idx + query.length);
    const before = text.slice(0, idx);
    const after = text.slice(idx + query.length);

    return (
      <span className="text-base">
        {before && <span className="font-normal text-neutral-700">{before}</span>}
        <strong className="font-extrabold text-black">{match}</strong>
        {after && <span className="font-normal text-neutral-700">{after}</span>}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-[300] flex flex-col bg-white font-sans animate-in fade-in duration-150" role="dialog">
      {/* Top Search Bar Row (Matching Nike Image 2 & Image 3 Target) */}
      <div className="w-full max-w-4xl mx-auto flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-black/5">
        <div className="flex-1 flex items-center bg-[#f5f5f5] rounded-full px-3.5 py-2 border border-transparent focus-within:border-black/20 focus-within:bg-white transition-all shadow-2xs">
          <Search className="h-4.5 w-4.5 text-neutral-800 mr-2.5 shrink-0 stroke-[2]" />
          <input
            ref={inputRef}
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit();
            }}
            placeholder="Search"
            className="w-full bg-transparent text-sm sm:text-base text-neutral-900 outline-none placeholder:text-neutral-500 font-medium"
          />
          {q && (
            <button
              onClick={() => setQ("")}
              className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-200 transition cursor-pointer shrink-0"
              aria-label="Clear search"
            >
              <X className="h-4 w-4 stroke-[2]" />
            </button>
          )}
        </div>

        <button
          onClick={closeSearch}
          className="text-sm font-bold text-black hover:opacity-70 transition cursor-pointer shrink-0 ml-1"
        >
          Cancel
        </button>
      </div>

      {/* Top Suggestions & Results Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-5 sm:px-6 py-5 overflow-y-auto">
        {/* Top Suggestions List */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-neutral-500 mb-3">
            Top Suggestions
          </div>
          <div className="flex flex-col gap-3">
            {topSuggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQ(s);
                  handleSearchSubmit(s);
                }}
                className="text-left py-1 hover:text-[#d32f2f] transition cursor-pointer"
              >
                {renderHighlightedText(s, q)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Grid */}
        {q.trim() && (
          <div className="mt-6 border-t border-neutral-100 pt-6">
            <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
              Products ({results.length})
            </div>

            {results.length === 0 ? (
              <div className="py-6 text-neutral-500 text-sm">
                No products found for "{q}".
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {results.slice(0, 8).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => go(p.id)}
                    className="group flex flex-col text-left cursor-pointer"
                  >
                    <div className="aspect-square w-full rounded-xl bg-neutral-50 p-2 border border-black/5 mb-2 overflow-hidden">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <span className="text-xs font-bold text-black truncate">{p.name}</span>
                    <span className="text-xs font-mono font-bold text-[#d32f2f]">₹{p.price.toLocaleString("en-IN")}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function PopupModals() {
  const { cartPopupItem, setCartPopupItem, wishlistPopupItem, setWishlistPopupItem } = useShop();
  const { products } = useCatalog();
  const nav = useNavigate();

  if (!cartPopupItem && !wishlistPopupItem) return null;

  const close = () => {
    setCartPopupItem(null);
    setWishlistPopupItem(null);
  };

  const isCart = !!cartPopupItem;
  const item = cartPopupItem || wishlistPopupItem;
  if (!item) return null;

  const product = products.find((p) => p.id === item.id);
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm bg-white text-black font-sans shadow-2xl overflow-hidden relative">
        <div className="flex items-center justify-between p-5 pb-3">
          <h2 className="text-xl font-bold">{isCart ? "Added to cart" : "Added to wishlist"}</h2>
          <button onClick={close} className="text-black hover:opacity-70 p-1">
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>
        
        <div className="p-5 pt-3">
          <div className="flex gap-4">
            <img src={product.images[0]} alt={product.name} loading="lazy" className="w-[100px] h-[100px] object-cover bg-gray-100" />
            <div className="flex flex-col text-[13px] leading-tight">
              <span className="font-bold mb-1">{product.name}</span>
              <span className="text-gray-600 mb-0.5">Color: PUMA Black</span>
              <span className="text-gray-600 mb-1.5">Size: {'size' in item ? (item as import("@/lib/store").CartItem).size : "S"}</span>
              <span className="font-sans">₹{product.price.toLocaleString("en-IN")}</span>
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            {isCart ? (
              <button onClick={() => { close(); nav({ to: "/checkout" }); }} className="w-full bg-[#181818] text-white py-3.5 text-[14px] font-bold uppercase hover:bg-black">
                VIEW CART ({cartPopupItem.qty}) & CHECKOUT
              </button>
            ) : (
              <Link to="/wishlist" onClick={close} className="block text-center w-full bg-[#181818] text-white py-3.5 text-[14px] font-bold uppercase hover:bg-black">
                VIEW WISHLIST
              </Link>
            )}
            
            {isCart && (
              <p className="text-[11px] text-gray-500 mt-4 leading-relaxed">
                By continuing, I confirm that I have read and accept the <a href="#" className="underline hover:text-black">Terms and Conditions</a> and the <a href="#" className="underline hover:text-black">Privacy Policy</a>.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [spinOpen, setSpinOpen] = useState(false);

  useEffect(() => {
    const handleOpenSpin = () => setSpinOpen(true);
    window.addEventListener("open-fortune-spin", handleOpenSpin);
    return () => window.removeEventListener("open-fortune-spin", handleOpenSpin);
  }, []);

  return (
    <>
      <SiteNav />
      <main className={`w-full overflow-x-hidden ${isHome ? "pt-0 pb-0" : "pt-16 sm:pt-20 md:pt-[84px] pb-16 sm:pb-8"}`}>{children}</main>
      <SiteFooter />
      {/* <CartDrawer /> */}
      <SearchDialog />
      <PopupModals />
      <SignupBonusPopup />
      <FortuneSpin open={spinOpen} onClose={() => setSpinOpen(false)} />
    </>
  );
}

export function SignupBonusPopup() {
  const { signupBonusPopupOpen, setSignupBonusPopupOpen } = useShop();
  const nav = useNavigate();

  if (!signupBonusPopupOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={() => setSignupBonusPopupOpen(false)} />
      <div className="relative w-full max-w-md bg-[#111] border border-[#f65c29]/30 shadow-[0_0_40px_-10px_rgba(246,92,41,0.3)] animate-in zoom-in-95 fade-in overflow-hidden flex flex-col text-white">
        <button onClick={() => setSignupBonusPopupOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white z-10"><X className="h-5 w-5" /></button>
        <div className="p-8 text-center flex flex-col items-center">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-[0_0_15px_-3px_rgba(255,255,255,0.4)] overflow-hidden p-2">
              <img src="/mobile_logo.png" alt="Logo" className="w-full h-full object-contain filter drop-shadow-sm invert" />
           </div>
           <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#f65c29] mb-2">Welcome to Veloce</div>
           <h2 className="font-display text-4xl font-black uppercase italic tracking-tighter mb-4">₹500 <span className="text-white/80">Bonus</span></h2>
           <p className="text-sm text-gray-400 mb-8 leading-relaxed max-w-xs">
             Your wallet has been credited with ₹500 as a welcome gift. Use it towards your first purchase!
           </p>
           <button onClick={() => { setSignupBonusPopupOpen(false); nav({to: "/shop"}); }} className="w-full bg-white text-black font-bold uppercase tracking-widest text-[13px] py-4 hover:bg-gray-200 transition">
             Shop Now
           </button>
        </div>
      </div>
    </div>
  );
}

export function SideDrawerMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const nav = useNavigate();
  const { userEmail, wishlist, cart, signOut, profile, openSearch, isAdmin, isOwner } = useShop();
  const { combinedFootball, combinedF1, combinedB, combinedCricketIPL, combinedWC } = useTeams();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [supportExpanded, setSupportExpanded] = useState(false);
  const { getById } = useCatalog();
  const cartCount = cart.filter((x) => x.id && getById(x.id)).reduce((a, b) => a + b.qty, 0);

  const toggleCategory = (cat: string) => {
    setOpenCategory((prev) => (prev === cat ? null : cat));
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      const timer = setTimeout(() => {
        setOpenCategory(null);
        setSupportExpanded(false);
      }, 300);
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleNav = (to: string, search?: Record<string, any>) => {
    onClose();
    nav({ to: to as any, search: search as any });
  };

  return (
    <div 
      className={`fixed inset-0 z-[250] flex justify-end transition-visibility duration-300 ${
        open ? "visible pointer-events-auto" : "invisible pointer-events-none"
      }`} 
      role="dialog" 
      aria-modal="true"
    >
      {/* Dark overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-out will-change-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`} 
        onClick={onClose} 
      />

      {/* Drawer Panel (Right Side Slide-out) */}
      <div 
        className={`relative w-full max-w-[320px] sm:max-w-sm h-full bg-white text-black shadow-2xl flex flex-col z-10 border-l border-black/10 overflow-y-auto transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top Header: Close Button on Right */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-black/10 bg-white">
          {/* User Profile Header (Matching Nike Screenshot 2) */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600 font-bold text-base border border-black/10 shrink-0">
              <User className="h-5 w-5 stroke-[2] text-neutral-700" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-black leading-tight">
                {userEmail ? `Hi, ${userEmail.split('@')[0]}` : "Hi, Guest"}
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                {userEmail || "Welcome to Veloce"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-black hover:bg-neutral-100 p-2 rounded-full transition cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Menu Navigation List */}
        <div className="flex-1 px-5 py-3 space-y-1.5">
          {/* HOME */}
          <button
            onClick={() => handleNav("/")}
            className="w-full text-left font-extrabold text-[15px] tracking-wide text-black py-2 hover:text-[#d32f2f] transition cursor-pointer"
          >
            HOME
          </button>

          {/* NEW 2026/27 KITS */}
          <button
            onClick={() => handleNav("/new-kits")}
            className="w-full text-left font-extrabold text-[15px] tracking-wide text-[#d32f2f] py-2 hover:opacity-80 transition cursor-pointer flex items-center justify-between"
          >
            <span>NEW 2026/27 KITS</span>
            <span className="bg-[#d32f2f] text-white text-[9px] px-1.5 py-0.5 rounded font-mono font-black uppercase">NEW</span>
          </button>

          {/* SHOP ALL */}
          <button
            onClick={() => handleNav("/shop")}
            className="w-full text-left font-extrabold text-[15px] tracking-wide text-black py-2 hover:text-[#d32f2f] transition cursor-pointer"
          >
            SHOP ALL COLLECTIONS
          </button>

          {/* Football Jerseys (Accordion) */}
          <div className="border-t border-black/5 pt-1.5">
            <button
              onClick={() => toggleCategory("football")}
              className="w-full flex items-center justify-between font-bold text-[15px] tracking-normal text-black py-2 hover:text-[#d32f2f] transition cursor-pointer"
            >
              <span>Football Jerseys</span>
              <ChevronDown className={`h-4.5 w-4.5 text-black transition-transform duration-200 ${openCategory === "football" ? "rotate-180" : ""}`} />
            </button>

            {openCategory === "football" && (
              <div className="pt-2 pb-4 space-y-3 animate-in fade-in duration-200">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2 px-1">CLUBS</div>
                  <div className="grid grid-cols-4 gap-2.5 max-h-60 overflow-y-auto pr-1">
                    {combinedFootball.map(([t, logo]) => (
                      <button
                        key={t}
                        onClick={() => handleNav("/shop/football", { team: t })}
                        className="flex flex-col items-center gap-1 group cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center p-1.5 shadow-2xs group-hover:border-black transition">
                          <img src={logo} alt={t} className="max-w-full max-h-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform" />
                        </div>
                        <span className="text-[9px] font-medium text-center text-neutral-800 leading-tight truncate w-full group-hover:font-bold">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Formula 1 Store (Accordion) */}
          <div className="border-t border-black/5 pt-1.5">
            <button
              onClick={() => toggleCategory("f1")}
              className="w-full flex items-center justify-between font-bold text-[15px] tracking-normal text-black py-2 hover:text-[#d32f2f] transition cursor-pointer"
            >
              <span>Formula 1 Store</span>
              <ChevronDown className={`h-4.5 w-4.5 text-black transition-transform duration-200 ${openCategory === "f1" ? "rotate-180" : ""}`} />
            </button>

            {openCategory === "f1" && (
              <div className="pt-2 pb-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-4 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {combinedF1.map(([t, logo]) => (
                    <button
                      key={t}
                      onClick={() => handleNav("/shop/f1", { team: t })}
                      className="flex flex-col items-center gap-1 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center p-1.5 shadow-2xs group-hover:border-black transition">
                        <img src={logo} alt={t} className="max-w-full max-h-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="text-[9px] font-medium text-center text-neutral-800 leading-tight truncate w-full group-hover:font-bold">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cricket Jerseys (Accordion) */}
          <div className="border-t border-black/5 pt-1.5">
            <button
              onClick={() => toggleCategory("cricket")}
              className="w-full flex items-center justify-between font-bold text-[15px] tracking-normal text-black py-2 hover:text-[#d32f2f] transition cursor-pointer"
            >
              <span>Cricket Jerseys</span>
              <ChevronDown className={`h-4.5 w-4.5 text-black transition-transform duration-200 ${openCategory === "cricket" ? "rotate-180" : ""}`} />
            </button>

            {openCategory === "cricket" && (
              <div className="pt-2 pb-4 space-y-3.5 animate-in fade-in duration-200">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2 px-1">IPL</div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {combinedCricketIPL.map(([t, logo]) => (
                      <button
                        key={t}
                        onClick={() => handleNav("/shop/cricket", { team: t })}
                        className="flex flex-col items-center gap-1 group cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center p-1.5 shadow-2xs group-hover:border-black transition">
                          <img src={logo} alt={t} className="max-w-full max-h-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform" />
                        </div>
                        <span className="text-[9px] font-medium text-center text-neutral-800 leading-tight truncate w-full group-hover:font-bold">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2 px-1">INTERNATIONAL</div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {[
                      ["India", "https://flagcdn.com/w80/in.png"],
                      ["Australia", "https://flagcdn.com/w80/au.png"],
                      ["England (Cricket)", "https://flagcdn.com/w80/gb-eng.png"],
                      ["South Africa", "https://flagcdn.com/w80/za.png"],
                      ["New Zealand", "https://flagcdn.com/w80/nz.png"],
                      ["West Indies", "https://flagcdn.com/w80/jm.png"],
                      ["Sri Lanka", "https://flagcdn.com/w80/lk.png"],
                    ].map(([t, flag]) => (
                      <button
                        key={t}
                        onClick={() => handleNav("/shop/cricket", { team: t })}
                        className="flex flex-col items-center gap-1 group cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center p-1.5 shadow-2xs group-hover:border-black transition overflow-hidden">
                          <img src={flag} alt={t} className="max-w-full max-h-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform" />
                        </div>
                        <span className="text-[9px] font-medium text-center text-neutral-800 leading-tight truncate w-full group-hover:font-bold">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Basketball Jerseys (Accordion) */}
          <div className="border-t border-black/5 pt-1.5">
            <button
              onClick={() => toggleCategory("basketball")}
              className="w-full flex items-center justify-between font-bold text-[15px] tracking-normal text-black py-2 hover:text-[#d32f2f] transition cursor-pointer"
            >
              <span>Basketball Jerseys</span>
              <ChevronDown className={`h-4.5 w-4.5 text-black transition-transform duration-200 ${openCategory === "basketball" ? "rotate-180" : ""}`} />
            </button>

            {openCategory === "basketball" && (
              <div className="pt-2 pb-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-4 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {combinedB.map(([t, logo]) => (
                    <button
                      key={t}
                      onClick={() => handleNav("/shop/basketball", { team: t })}
                      className="flex flex-col items-center gap-1 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center p-1.5 shadow-2xs group-hover:border-black transition">
                        <img src={logo} alt={t} className="max-w-full max-h-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="text-[9px] font-medium text-center text-neutral-800 leading-tight truncate w-full group-hover:font-bold">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* FIFA World Cup (Accordion) */}
          <div className="border-t border-black/5 pt-1.5">
            <button
              onClick={() => toggleCategory("worldcup")}
              className="w-full flex items-center justify-between font-bold text-[15px] tracking-normal text-black py-2 hover:text-[#d32f2f] transition cursor-pointer"
            >
              <span>FIFA World Cup</span>
              <ChevronDown className={`h-4.5 w-4.5 text-black transition-transform duration-200 ${openCategory === "worldcup" ? "rotate-180" : ""}`} />
            </button>

            {openCategory === "worldcup" && (
              <div className="pt-2 pb-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-4 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {combinedWC.map(([t, logo]) => (
                    <button
                      key={t}
                      onClick={() => handleNav("/shop/worldcup", { team: t })}
                      className="flex flex-col items-center gap-1 group cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center p-1.5 shadow-2xs group-hover:border-black transition">
                        <img src={logo} alt={t} className="max-w-full max-h-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform" />
                      </div>
                      <span className="text-[9px] font-medium text-center text-neutral-800 leading-tight truncate w-full group-hover:font-bold">{t}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PLAYER VERSION KITS */}
          <div className="border-t border-black/5 pt-1.5">
            <button
              onClick={() => handleNav("/shop", { tag: "player-version" })}
              className="w-full text-left font-bold text-[15px] tracking-normal text-black py-2 hover:text-[#d32f2f] transition cursor-pointer"
            >
              Player Version Kits
            </button>
          </div>

          {/* Accessories */}
          <div className="border-t border-black/5 pt-1.5">
            <button
              onClick={() => handleNav("/shop", { category: "accessories" })}
              className="w-full text-left font-bold text-[15px] tracking-normal text-black py-2 hover:text-[#d32f2f] transition cursor-pointer"
            >
              Accessories
            </button>
          </div>

          {/* Bottom Account & Actions Section */}
          <div className="border-t border-neutral-200/80 pt-4 mt-3 space-y-3">
            {/* Admin Dashboard for Admin/Owner */}
            {isAdmin && (
              <button
                onClick={() => handleNav("/admin")}
                className="w-full flex items-center gap-3.5 font-bold text-[14px] text-[#d32f2f] hover:text-black transition cursor-pointer py-1 bg-red-50 p-2 rounded-xl border border-red-200"
              >
                <ShieldCheck className="h-5 w-5 stroke-[2] text-[#d32f2f]" />
                <span>Admin Dashboard</span>
              </button>
            )}

            {/* Account */}
            <button
              onClick={() => handleNav(userEmail ? "/profile" : "/login")}
              className="w-full flex items-center gap-3.5 font-semibold text-[14px] text-neutral-900 hover:text-[#d32f2f] transition cursor-pointer py-1"
            >
              <User className="h-5 w-5 stroke-[1.8]" />
              <span>Account</span>
            </button>

            {/* Logout / Login */}
            {userEmail ? (
              <button
                onClick={() => {
                  signOut();
                  onClose();
                }}
                className="w-full flex items-center gap-3.5 font-semibold text-[14px] text-[#d32f2f] hover:underline transition cursor-pointer py-1"
              >
                <LogOut className="h-5 w-5 stroke-[1.8]" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => handleNav("/login")}
                className="w-full flex items-center gap-3.5 font-semibold text-[14px] text-black hover:text-[#d32f2f] transition cursor-pointer py-1"
              >
                <LogIn className="h-5 w-5 stroke-[1.8]" />
                <span>Sign In</span>
              </button>
            )}

            {/* Support Accordion */}
            <div className="pt-2 pb-6 border-t border-black/5">
              <button
                onClick={() => setSupportExpanded(!supportExpanded)}
                className="w-full flex items-center justify-between font-bold text-[13px] uppercase tracking-widest text-black py-2 hover:text-[#d32f2f] transition cursor-pointer"
              >
                <span>SUPPORT</span>
                <ChevronDown className={`h-4.5 w-4.5 text-black transition-transform duration-200 ${supportExpanded ? "rotate-180" : ""}`} />
              </button>

              {supportExpanded && (
                <div className="pt-1 pb-2 pl-3 space-y-2 text-xs font-medium text-neutral-700 animate-in fade-in duration-200">
                  <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="block hover:text-black">
                    WhatsApp Chat
                  </a>
                  <a href="mailto:support@veloce.in" className="block hover:text-black">
                    Email Support
                  </a>
                  <Link to="/info/$page" params={{ page: "shipping-policy" }} onClick={onClose} className="block hover:text-black">
                    Shipping Policy
                  </Link>
                  <Link to="/info/$page" params={{ page: "exchange-policy" }} onClick={onClose} className="block hover:text-black">
                    Exchange & Returns
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileTopNav() {
  const nav = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cart, userEmail, isAdmin, openSearch } = useShop();
  const { getById } = useCatalog();
  const cartCount = cart.filter((x) => x.id && getById(x.id)).reduce((a, b) => a + b.qty, 0);
  const [adminMobilePopup, setAdminMobilePopup] = useState(true);

  return (
    <>
      <div className="sm:hidden sticky top-0 inset-x-0 z-[100] bg-white shadow-xs">
        {isAdmin && adminMobilePopup && (
           <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
             <div className="bg-[#181818] border border-border/20 rounded-2xl p-6 shadow-2xl max-w-sm w-full text-center">
                <h2 className="text-lg font-bold text-white mb-2">Desktop Recommended</h2>
                <p className="text-sm text-gray-400 mb-6">For the best experience while managing the store, please use a laptop or PC.</p>
                <button onClick={() => setAdminMobilePopup(false)} className="w-full bg-white text-black font-bold text-[13px] py-3 rounded-none uppercase tracking-widest active:scale-95 transition-transform">Continue anyway</button>
             </div>
           </div>
        )}

        {/* Running Red Announcement Bar */}
        <TopAnnouncementTicker />
        
        {/* Main Mobile Navbar */}
        <div className="relative flex items-center justify-between bg-white px-4 py-2.5 border-b border-black/10">
          {/* Left: Brand Logo */}
          <div className="flex items-center">
            <Logo />
          </div>
          
          {/* Right: Search, Shopping Bag & Hamburger Menu */}
          <div className="flex items-center gap-1 z-10">
            <button
              onClick={openSearch}
              className="text-black active:scale-95 transition-transform p-1.5 cursor-pointer"
              aria-label="Search"
            >
              <NikeSearchIcon className="h-5.5 w-5.5 text-black" />
            </button>

            <button
              onClick={() => {
                if (window.innerWidth >= 640 && !userEmail) {
                  nav({ to: "/login" });
                } else {
                  nav({ to: "/checkout" });
                }
              }}
              className="relative text-black active:scale-95 transition-transform p-1.5 cursor-pointer"
              aria-label="Shopping Bag"
            >
              <NikeBagIcon className="h-5.5 w-5.5 text-black" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#d32f2f] px-1 text-[8.5px] font-bold text-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Hamburger Drawer Trigger Icon on Right */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="text-black active:scale-95 transition-transform p-1.5 cursor-pointer"
              aria-label="Open menu drawer"
            >
              <NikeMenuIcon className="h-6 w-6 text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-out Mobile Hamburger Drawer */}
      <SideDrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}

export function PromoSlider() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const messages = [
    "FREE EXCHANGE AND RETURN",
    "COD AVAILABLE WITH MINIMAL PAYMENT",
    "500RS SIGNUP BONUS IN WALLET",
    "SECURED CHECKOUT AND PAYMENTS"
  ];

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div 
      className="w-full bg-[#f4f4f4] text-black text-[10px] font-bold uppercase tracking-wider text-center py-1.5 overflow-hidden"
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        key={index} 
        className="animate-in fade-in duration-700 md:animate-none md:fade-in-0"
      >
        {messages[index]}
      </div>
    </div>
  );
}


