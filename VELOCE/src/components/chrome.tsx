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
    "Free Shipping PAN India",
    "COD Available",
    "Worn by 1,000+ Fans",
    "100% Authentic Matchwear",
    "4-Day Easy Exchange",
    "Premium Streetwear Drop",
  ];

  return (
    <div className="w-full bg-[#d32f2f] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider py-1.5 overflow-hidden whitespace-nowrap select-none flex items-center border-b border-black/10">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused] cursor-default">
        {[0, 1].map((copyIdx) => (
          <div key={copyIdx} className="flex shrink-0 items-center gap-10 sm:gap-16 pr-10 sm:pr-16" aria-hidden={copyIdx > 0}>
            {textItems.map((item, idx) => (
              <span key={idx} className="inline-flex items-center gap-3 font-semibold tracking-widest">
                <span className="text-white/80 text-sm">•</span>
                <span>{item}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cart, wishlist, isAdmin, userEmail, signOut, openSearch } = useShop();
  const nav = useNavigate();
  const { getById } = useCatalog();
  const cartCount = cart.filter((x) => x.id && getById(x.id)).reduce((a, b) => a + b.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav className={`fixed inset-x-0 top-0 z-50 flex flex-col bg-white/95 backdrop-blur-md border-b border-black/10 transition-all duration-300 ${scrolled ? "shadow-md shadow-black/5" : ""}`}>
        {/* Red Running Announcement Bar */}
        <TopAnnouncementTicker />

        {/* Main Desktop Header */}
        <div className="flex w-full max-w-7xl mx-auto items-center justify-between px-6 sm:px-10 py-3">
          {/* Left: Hamburger & Search */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-black hover:bg-black/5 transition"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5 stroke-[2]" />
            </button>
            <button
              onClick={openSearch}
              className="flex h-9 w-9 items-center justify-center rounded-full text-black hover:bg-black/5 transition"
              aria-label="Search store"
            >
              <Search className="h-5 w-5 stroke-[2]" />
            </button>
          </div>

          {/* Center: Brand Logo */}
          <Logo />

          {/* Right: Wishlist, Cart & Profile */}
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <Link to="/admin"><IconChip label="Admin"><Settings className="h-4 w-4 text-black" /></IconChip></Link>
                <button onClick={signOut} className="items-center gap-1.5 rounded-full border border-black/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-black hover:bg-black/5 inline-flex">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/wishlist" className="relative" onClick={(e) => {
                  if (window.innerWidth >= 640 && !userEmail) {
                    e.preventDefault();
                    nav({ to: "/login" });
                  }
                }}>
                  <IconChip label="Wishlist"><Heart className="h-5 w-5 stroke-[1.8] text-black" /></IconChip>
                  {wishlist.length > 0 && <Dot>{wishlist.length}</Dot>}
                </Link>
                <button onClick={() => {
                  if (window.innerWidth >= 640 && !userEmail) {
                    nav({ to: "/login" });
                  } else {
                    nav({ to: "/checkout" });
                  }
                }} className="relative" aria-label="Bag">
                  <IconChip label="Bag"><ShoppingBag className="h-5 w-5 stroke-[1.8] text-black" /></IconChip>
                  {cartCount > 0 && (
                    <span className="pointer-events-none absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#d32f2f] px-1 font-mono text-[9px] font-bold text-white shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </button>
                <Link to={userEmail ? "/profile" : "/login"} aria-label={userEmail ? "Profile" : "Account"}>
                  <IconChip label={userEmail ? "Profile" : "Account"}>
                    <User className="h-5 w-5 stroke-[1.8] text-black" />
                  </IconChip>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Subnavigation Bar */}
        <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8 py-2 border-t border-black/5 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-800">
          <Link to="/" className="hover:text-[#d32f2f] transition-colors" activeProps={{ className: "text-[#d32f2f] font-black" }}>Home</Link>
          <Link to="/new-kits" className="hover:text-[#d32f2f] transition-colors flex items-center gap-1" activeProps={{ className: "text-[#d32f2f] font-black" }}>
            <span>New Kits</span>
            <span className="bg-[#d32f2f] text-white text-[8px] px-1 py-0.2 rounded font-mono font-black">26/27</span>
          </Link>
          <Link to="/shop" className="hover:text-[#d32f2f] transition-colors" activeProps={{ className: "text-[#d32f2f] font-black" }}>Shop All</Link>
          <FootballMenu />
          <F1Menu />
          <CricketMenu />
          <BasketballMenu />
          <WorldCupMenu />
          <Link to="/shop/accessories" className="hover:text-[#d32f2f] transition-colors" activeProps={{ className: "text-[#d32f2f] font-black" }}>Accessories</Link>
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
      <Link to="/shop/football" className="flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
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
      <Link to="/shop/worldcup" className="flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
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
      <Link to="/shop/f1" className="flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
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
      <Link to="/shop/basketball" className="flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
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
      <Link to="/shop/cricket" className="flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
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
  const { searchOpen, closeSearch, recent, pushRecent } = useShop();
  const { products } = useCatalog();
  const [q, setQ] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!searchOpen) {
      setQ("");
      setActiveCategory("all");
    } else {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, closeSearch]);

  const TRENDING_TOPICS = [
    { label: "Real Madrid", category: "football" },
    { label: "Scuderia Ferrari", category: "f1" },
    { label: "RCB Virat Kohli", category: "cricket" },
    { label: "FC Barcelona", category: "football" },
    { label: "Red Bull Racing", category: "f1" },
    { label: "CSK Dhoni", category: "cricket" },
    { label: "Argentina Messi", category: "football" },
    { label: "Mercedes AMG", category: "f1" },
  ];

  const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "football", label: "Football" },
    { id: "f1", label: "Formula 1" },
    { id: "cricket", label: "Cricket" },
    { id: "basketball", label: "Basketball" },
    { id: "worldcup", label: "World Cup" },
  ];

  const results = useMemo(() => {
    let list = products;
    if (activeCategory !== "all") {
      list = list.filter((p) =>
        activeCategory === "football"
          ? p.category === "football" || p.category === "worldcup"
          : p.category === activeCategory
      );
    }
    if (!q.trim()) return list.slice(0, 8);
    const s = q.toLowerCase().trim();
    return list.filter((p) =>
      p.name.toLowerCase().includes(s) ||
      p.team.toLowerCase().includes(s) ||
      (p.driver ?? "").toLowerCase().includes(s) ||
      p.tag.toLowerCase().includes(s) ||
      (p.category && p.category.toLowerCase().includes(s))
    ).slice(0, 16);
  }, [q, activeCategory, products]);

  if (!searchOpen) return null;

  const go = (id: string) => {
    if (q.trim()) pushRecent(q.trim());
    closeSearch();
    nav({ to: "/product/$id", params: { id } });
  };

  const handleSearchSubmit = (searchWord?: string) => {
    const term = (searchWord || q).trim();
    if (!term) return;
    pushRecent(term);
    closeSearch();
    nav({ to: "/search", search: { q: term } as any });
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-black/60 backdrop-blur-md animate-in fade-in duration-200 font-sans" role="dialog">
      {/* Background click to close */}
      <div className="absolute inset-0 -z-10" onClick={closeSearch} />

      {/* Main Search Panel - Minimalist Mobile-First Design */}
      <div className="relative w-full max-w-2xl mx-auto flex flex-col h-full sm:h-auto sm:max-h-[85vh] sm:my-auto bg-white sm:rounded-3xl border-0 sm:border border-neutral-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Minimalist Top Header: Back Arrow + Full-Width Search Input */}
        <div className="flex items-center gap-3 px-3.5 sm:px-5 py-3.5 bg-white border-b border-neutral-100">
          <button 
            onClick={closeSearch}
            className="p-2 text-neutral-800 hover:text-black hover:bg-neutral-100 rounded-full transition-colors cursor-pointer shrink-0"
            aria-label="Close search"
          >
            <ArrowLeft className="h-5 w-5 stroke-[2.5]" />
          </button>
          
          <div className="flex-1 flex items-center gap-2.5 bg-neutral-100/90 px-3.5 py-2.5 rounded-full border border-neutral-200/80 focus-within:border-black focus-within:bg-white transition-all shadow-2xs">
            <Search className="h-4 w-4 text-neutral-500 shrink-0 stroke-[2.5]" />
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearchSubmit();
              }}
              placeholder="Search jerseys, teams, kits..."
              className="flex-1 bg-transparent text-sm sm:text-base text-neutral-900 outline-none placeholder:text-neutral-500 font-bold"
            />
            {q && (
              <button
                onClick={() => setQ("")}
                className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-200 transition cursor-pointer shrink-0"
                aria-label="Clear query"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>

        {/* Minimalist Category Filter Pills */}
        <div className="flex items-center gap-2 px-3.5 sm:px-5 py-2 bg-neutral-50/80 border-b border-neutral-100 overflow-x-auto no-scrollbar select-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-black text-white shadow-xs"
                  : "bg-white text-neutral-700 border border-neutral-200/80 hover:border-black"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Content Body */}
        <div className="flex-1 overflow-y-auto px-3.5 sm:px-5 py-3.5 space-y-4">
          {q === "" && (
            <div className="space-y-3.5">
              {/* Trending Searches */}
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-neutral-500">
                  <TrendingUp className="h-3.5 w-3.5 text-[#d32f2f] stroke-[2.5]" />
                  <span>Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_TOPICS.map((t) => (
                    <button
                      key={t.label}
                      onClick={() => {
                        setQ(t.label);
                        handleSearchSubmit(t.label);
                      }}
                      className="px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-extrabold text-neutral-800 hover:border-black hover:bg-black hover:text-white transition-all cursor-pointer active:scale-95"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Grid */}
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-500">
                {q ? `Top Matches (${results.length})` : "Recommended Jerseys"}
              </span>
              {q && results.length > 0 && (
                <button
                  onClick={() => handleSearchSubmit()}
                  className="text-xs text-[#d32f2f] hover:underline font-black uppercase"
                >
                  View All &rarr;
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div className="py-10 text-center">
                <div className="w-12 h-12 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-2 text-neutral-400">
                  <Search className="h-5 w-5 stroke-[2]" />
                </div>
                <div className="text-sm font-black text-neutral-900">No jerseys found for "{q}"</div>
                <div className="text-xs text-neutral-500 mt-1 font-semibold">Try searching for "Real Madrid", "Ferrari", or "RCB"</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
                {results.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => go(p.id)}
                    className="group flex flex-col bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-black rounded-xl p-2 sm:p-2.5 text-left transition-all duration-200 cursor-pointer shadow-2xs active:scale-98"
                  >
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#f8f8f8] mb-1.5 p-1 flex items-center justify-center">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                      {p.tag && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.2 rounded bg-black/80 backdrop-blur-sm text-[8px] font-black uppercase tracking-wider text-white">
                          {p.tag}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-[#d32f2f] truncate mb-0.5">
                      {p.team || p.category}
                    </div>
                    <div className="text-xs font-bold text-neutral-900 line-clamp-1 leading-snug">
                      {p.name}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs font-black text-neutral-900">
                      <span>{formatINR(p.price)}</span>
                      {p.price > 500 && (
                        <span className="text-[10px] text-neutral-400 line-through font-medium">
                          {formatINR(Math.round(p.price * 1.5))}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Minimalist Bottom Bar */}
        {q && results.length > 0 && (
          <div className="p-3 bg-white border-t border-neutral-100 flex items-center justify-between px-4 sm:px-5">
            <span className="text-xs text-neutral-700 font-bold truncate pr-2">
              Results for <strong className="text-black font-black">"{q}"</strong>
            </span>
            <button
              onClick={() => handleSearchSubmit()}
              className="px-4 py-2 rounded-full bg-black text-white font-black text-xs uppercase tracking-wider hover:bg-neutral-800 transition cursor-pointer shrink-0"
            >
              See All Results &rarr;
            </button>
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
      <div className="hidden sm:block"><SiteNav /></div>
      <MobileTopNav />
      <main className={`pt-0 pb-16 w-full overflow-x-hidden ${isHome ? "sm:pt-0 sm:pb-0" : "sm:pt-24 md:pt-[122px] sm:pb-8"}`}>{children}</main>
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
      className={`fixed inset-0 z-[250] flex transition-visibility duration-300 ${
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

      {/* Drawer Panel */}
      <div 
        className={`relative w-full max-w-xs sm:max-w-sm h-full bg-white text-black shadow-2xl flex flex-col z-10 border-r border-black/10 overflow-y-auto transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Top Header: Close, Search, VELOCE Wear Logo, Bag, Profile */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-black/10 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="text-black hover:opacity-70 transition cursor-pointer p-0.5"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 stroke-[2]" />
            </button>
            <button
              onClick={() => {
                onClose();
                openSearch();
              }}
              className="text-black hover:opacity-70 transition cursor-pointer p-0.5"
              aria-label="Search"
            >
              <Search className="h-5 w-5 stroke-[2]" />
            </button>
          </div>

          {/* Veloce Wear Red Brand Logo */}
          <div className="flex flex-col items-center leading-none select-none">
            <span className="font-black text-[22px] tracking-tight uppercase text-[#d32f2f] font-display leading-none">
              VELOCE
            </span>
            <span className="font-serif italic text-[11px] tracking-[0.2em] text-[#d32f2f] -mt-0.5 font-black leading-none">
              Wear
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav("/checkout")}
              className="relative text-black hover:opacity-70 transition cursor-pointer p-0.5"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="h-5 w-5 stroke-[1.8]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white px-1 font-mono">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleNav(userEmail ? "/profile" : "/login")}
              className="text-black hover:opacity-70 transition cursor-pointer p-0.5"
              aria-label="Account"
            >
              <User className="h-5 w-5 stroke-[1.8]" />
            </button>
          </div>
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

            {/* Wallet */}
            <button
              onClick={() => handleNav("/profile", { tab: "wallet" })}
              className="w-full flex items-center gap-3.5 font-semibold text-[14px] text-neutral-900 hover:text-[#d32f2f] transition cursor-pointer py-1"
            >
              <Wallet className="h-5 w-5 stroke-[1.8]" />
              <span>Wallet (₹{profile?.walletBalance ?? 0})</span>
            </button>

            {/* Spin n Win */}
            <button
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent("open-fortune-spin"));
              }}
              className="w-full flex items-center gap-3.5 font-semibold text-[14px] text-neutral-900 hover:text-[#d32f2f] transition cursor-pointer py-1"
            >
              <Gift className="h-5 w-5 stroke-[1.8]" />
              <span>Spin n Win</span>
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
          {/* Left: Side Hamburger Menu Button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-black active:scale-95 transition-transform p-1.5"
            aria-label="Open menu drawer"
          >
            <Menu className="h-6 w-6 stroke-[2]" />
          </button>

          {/* Center: Brand Logo */}
          <Logo />
          
          {/* Right: Search & Shopping Bag */}
          <div className="flex items-center gap-2 z-10">
            <button
              onClick={openSearch}
              className="text-black active:scale-95 transition-transform p-1.5"
              aria-label="Search"
            >
              <Search className="h-5 w-5 stroke-[2]" />
            </button>

            <button
              onClick={() => {
                if (window.innerWidth >= 640 && !userEmail) {
                  nav({ to: "/login" });
                } else {
                  nav({ to: "/checkout" });
                }
              }}
              className="relative text-black active:scale-95 transition-transform p-1.5"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="h-5 w-5 stroke-[2]" />
              {cartCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#d32f2f] px-1 text-[8.5px] font-bold text-white shadow-xs">
                  {cartCount}
                </span>
              )}
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


