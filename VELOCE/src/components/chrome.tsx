import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Search, Heart, ShoppingBag, User, Menu, X, Trash2, Clock, TrendingUp, Minus, Plus, ChevronDown, ChevronRight, Gift, Truck, ShieldCheck, RefreshCw, Banknote, Settings, Home, Store, MoreHorizontal, MessageSquare } from "lucide-react";
import { Logo } from "./Logo";
import { FortuneSpin } from "./FortuneSpin";
import { useShop } from "@/lib/store";
import { TRENDING, ZONES } from "@/lib/catalog";
import { LEAGUES, FOOTBALL_QUICK_LINKS } from "@/lib/leagues";
import { useCatalog } from "@/lib/catalog-store";
import { formatINR } from "@/lib/format";
import { computeCart } from "@/lib/pricing";
import { TEAM_LOGOS, f1Teams, basketballTeams, cricketTeams, cricketInternationalTeams, cricketIPLTeams, footballTeams } from "@/lib/logos";

const NAV = [
  { label: "Formula 1", to: "/shop/f1" as const },
  { label: "Basketball", to: "/shop/basketball" as const },
  { label: "Cricket", to: "/shop/cricket" as const },
  { label: "Shop All", to: "/shop" as const },
];
const FOOTBALL_SUB = [
  { label: "All Football", to: "/shop/football" as const },
  { label: "FIFA World Cup", to: "/shop/worldcup" as const },
  { label: "Retro Collection", to: "/shop/retro" as const },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [zonesOpen, setZonesOpen] = useState(false);
  const [spinOpen, setSpinOpen] = useState(false);
  const { cart, wishlist, openCart, openSearch, isAdmin, userEmail, signOut } = useShop();
  const nav = useNavigate();
  const cartCount = cart.reduce((a, b) => a + b.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-12 z-50 flex justify-center px-4 sm:top-0 sm:px-0">
      <div className={`glass flex w-full max-w-6xl items-center justify-between px-4 py-2.5 transition-all duration-500 sm:max-w-full sm:rounded-none sm:px-8 sm:py-1.5 ${scrolled ? "shadow-2xl shadow-black/40" : "rounded-full"}`}>
        <Logo />
        <div className="hidden items-center gap-6 md:flex">
          <FootballMenu />
          <F1Menu />
          <BasketballMenu />
          <CricketMenu />
          <Link to="/shop/worldcup" className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            World Cup
          </Link>
          <Link to="/shop" className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            Shop All
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.82_0.14_88)]/70 bg-[oklch(0.82_0.14_88)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[oklch(0.9_0.13_92)] shadow-[0_0_18px_-6px_oklch(0.82_0.14_88_/_0.55)] hover:bg-[oklch(0.82_0.14_88)]/20"
            >
              <Settings className="h-3 w-3" /> Admin
            </Link>
          )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <IconChip onClick={openSearch} label="Search"><Search className="h-4 w-4" /></IconChip>
          <IconChip onClick={() => {
            if (window.innerWidth >= 640 && !userEmail) {
              nav({ to: "/login" });
            } else {
              setSpinOpen(true);
            }
          }} label="Spin" className="hidden sm:inline-flex"><Gift className="h-4 w-4 text-yellow-500" /></IconChip>
          {isAdmin ? (
            <>
              <Link to="/admin" className="hidden sm:block"><IconChip label="Admin"><Settings className="h-4 w-4" /></IconChip></Link>
              <button onClick={signOut} className="hidden items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground sm:inline-flex">Sign out</button>
            </>
          ) : (
            <>
              <Link to={userEmail ? "/profile" : "/login"} className="hidden sm:block"><IconChip label={userEmail ? "Profile" : "Account"}><User className="h-4 w-4" /></IconChip></Link>
              <Link to="/wishlist" className="relative" onClick={(e) => {
                if (window.innerWidth >= 640 && !userEmail) {
                  e.preventDefault();
                  nav({ to: "/login" });
                }
              }}>
                <IconChip label="Wishlist"><Heart className="h-4 w-4" /></IconChip>
                {wishlist.length > 0 && <Dot>{wishlist.length}</Dot>}
              </Link>
              <button onClick={() => {
                if (window.innerWidth >= 640 && !userEmail) {
                  nav({ to: "/login" });
                } else {
                  nav({ to: "/checkout" });
                }
              }} className="relative">
                <IconChip label="Bag"><ShoppingBag className="h-4 w-4" /></IconChip>
                {cartCount > 0 && <Dot>{cartCount}</Dot>}
              </button>
            </>
          )}
          <IconChip onClick={() => setOpen((v) => !v)} label="Menu" className="md:hidden">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </IconChip>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col px-5 pt-20 pb-8 overflow-y-auto animate-in fade-in zoom-in-95 md:hidden">
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="absolute top-5 right-5 p-1.5"><X className="h-5 w-5" /></button>
          <div className="flex flex-col gap-4">
            <div>
              <div className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.28em] text-brand">Football</div>
              <div className="mt-1.5 flex flex-col gap-0.5">
                {FOOTBALL_SUB.map((l) => (
                  <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm uppercase tracking-[0.1em] text-muted-foreground active:bg-white/10 active:text-foreground">
                    {l.label}
                    <ChevronRight className="h-3.5 w-3.5 opacity-30 transition-opacity group-active:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-t border-border/40" />
            <div className="flex flex-col gap-0.5">
              {NAV.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm uppercase tracking-[0.1em] text-muted-foreground active:bg-white/10 active:text-foreground">
                  {l.label}
                  <ChevronRight className="h-3.5 w-3.5 opacity-30 transition-opacity group-active:opacity-100" />
                </Link>
              ))}
            </div>
            <div className="border-t border-border/40" />
            <div>
              <div className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.28em] text-brand">Zones</div>
              <div className="mt-1.5 flex flex-col gap-0.5">
                {ZONES.map((z) => (
                  <Link key={z.slug} to="/zone/$slug" params={{ slug: z.slug }} onClick={() => setOpen(false)} className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm uppercase tracking-[0.1em] text-muted-foreground active:bg-white/10 active:text-foreground">
                    {z.name}
                    <ChevronRight className="h-3.5 w-3.5 opacity-30 transition-opacity group-active:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
            <div className="border-t border-border/40" />
            <div className="flex flex-col gap-0.5">
              {isAdmin ? (
                <>
                  <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm uppercase tracking-[0.1em] text-brand active:bg-white/10">
                    Admin Panel
                    <ChevronRight className="h-3.5 w-3.5 opacity-50" />
                  </Link>
                  <button onClick={() => { signOut(); setOpen(false); }} className="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm uppercase tracking-[0.1em] text-muted-foreground active:bg-white/10 active:text-foreground">
                    Sign out
                  </button>
                </>
              ) : (
                <Link to={userEmail ? "/profile" : "/login"} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm uppercase tracking-[0.1em] text-muted-foreground active:bg-white/10 active:text-foreground">
                  {userEmail ? "Profile" : "Account"}
                  <ChevronRight className="h-3.5 w-3.5 opacity-30" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      <FortuneSpin open={spinOpen} onClose={() => setSpinOpen(false)} />
    </nav>
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
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link to="/shop/football" className="flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
        Football <ChevronDown className="h-3 w-3" />
      </Link>
      {open && (
        <div className="absolute left-1/2 top-full w-[800px] max-w-[92vw] -translate-x-1/2 pt-3 z-50">
          <div className="glass flex flex-col gap-6 rounded-2xl p-6 shadow-2xl bg-white border border-border/40">
            <div className="text-[15px] font-bold tracking-tight text-black flex items-center justify-between">
               <span>Football Jerseys</span>
            </div>
            <div className="grid grid-cols-6 gap-x-4 gap-y-6">
              {footballTeams.map(([t, logo]) => (
                <Link key={t} to="/shop/football" search={{ team: t } as never} onClick={() => setOpen(false)} className="flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-16 h-16 rounded-full bg-white border border-border/40 flex items-center justify-center p-3 shadow-sm hover:shadow-md hover:border-black transition-all">
                    <img src={logo} alt={t} loading="lazy" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-[10px] text-center font-medium text-black leading-tight group-hover:font-bold">{t}</span>
                </Link>
              ))}
            </div>
            <div className="border-t border-border/40 pt-4 mt-2">
              <div className="mb-3 text-[10px] uppercase tracking-[0.28em] font-bold text-brand">Collections</div>
              <div className="flex flex-wrap gap-2">
                {FOOTBALL_QUICK_LINKS.map((q) => (
                  <Link key={q.label} to={q.to as never} className="rounded-full border border-border/60 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground hover:border-black hover:text-black hover:bg-black/5 transition-all">
                    {q.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function F1Menu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link to="/shop/f1" className="flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
        Formula 1 <ChevronDown className="h-3 w-3" />
      </Link>
      {open && (
        <div className="absolute left-1/2 top-full w-[800px] max-w-[92vw] -translate-x-1/2 pt-3 z-50">
          <div className="glass flex flex-col gap-6 rounded-2xl p-6 shadow-2xl bg-white border border-border/40">
            <div className="text-[15px] font-bold tracking-tight text-black flex items-center justify-between">
               <span>Formula 1 Merch</span>
            </div>
            <div className="grid grid-cols-6 gap-x-4 gap-y-6">
              {f1Teams.map(([t, logo]) => (
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
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link to="/shop/basketball" className="flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
        Basketball <ChevronDown className="h-3 w-3" />
      </Link>
      {open && (
        <div className="absolute left-1/2 top-full w-[800px] max-w-[92vw] -translate-x-1/2 pt-3 z-50">
          <div className="glass flex flex-col gap-6 rounded-2xl p-6 shadow-2xl bg-white border border-border/40">
            <div className="text-[15px] font-bold tracking-tight text-black flex items-center justify-between">
               <span>Basketball Jerseys</span>
            </div>
            <div className="grid grid-cols-6 gap-x-4 gap-y-6">
              {basketballTeams.map(([t, logo]) => (
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
  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <Link to="/shop/cricket" className="flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>
        Cricket <ChevronDown className="h-3 w-3" />
      </Link>
      {open && (
        <div className="absolute left-1/2 top-full w-[800px] max-w-[92vw] -translate-x-1/2 pt-3 z-50">
          <div className="glass flex flex-col gap-6 rounded-2xl p-6 shadow-2xl bg-white border border-border/40">
            <div className="text-[15px] font-bold tracking-tight text-black flex items-center justify-between">
               <span>Cricket Jerseys</span>
            </div>
            <div className="grid grid-cols-6 gap-x-4 gap-y-6">
              {cricketTeams.map(([t, logo]) => (
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
        ["Retro Collection", "/shop/retro"],
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
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Your bag is empty.</div>
              <Link to="/shop" onClick={closeCart} className="rounded-full bg-foreground px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-background">Shop now</Link>
            </div>
          ) : (
            <ul className="divide-y divide-border/50">
              {lines.map(({ item, product, freeUnits: fu, lineSubtotal, lineDiscount }) => (
                <li key={item.id + item.size + item.color + (item.customName || "") + (item.customNumber || "")} className="flex gap-4 py-4">
                  <img src={product.images[0]} alt={product.name} loading="lazy" className="h-24 w-20 rounded-lg object-cover" />
                  <div className="flex flex-1 min-w-0 flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-display text-sm font-semibold">{product.name}</div>
                        <div className="text-[11px] text-muted-foreground">
                          {item.size} · {item.color}
                          {(item.customName || item.customNumber) && (
                            <div className="mt-1 font-mono text-[10px] text-brand uppercase tracking-wider font-semibold">
                              Print: {item.customName || "NO NAME"} #{item.customNumber || "00"}
                            </div>
                          )}
                        </div>
                        {fu > 0 && <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-brand"><Gift className="h-2.5 w-2.5" />{fu}× Free · B2G1</div>}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-mono text-sm">{formatINR(lineSubtotal)}</div>
                        {lineDiscount > 0 && <div className="font-mono text-[10px] text-brand">−{formatINR(lineDiscount)}</div>}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-border/70">
                        <button onClick={() => updateQty(item.id, item.size, item.color, item.qty - 1, item.customName, item.customNumber)} className="px-2 py-1"><Minus className="h-3 w-3" /></button>
                        <span className="w-6 text-center font-mono text-xs">{item.qty}</span>
                        <button onClick={() => {
                          const p = getById(item.id);
                          const available = p?.stockBySize?.[item.size] !== undefined ? p.stockBySize[item.size] : (p?.stock ?? 0);
                          updateQty(item.id, item.size, item.color, Math.min(available, item.qty + 1), item.customName, item.customNumber);
                        }} className="px-2 py-1"><Plus className="h-3 w-3" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id, item.size, item.color, item.customName, item.customNumber)} className="text-muted-foreground hover:text-brand" aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
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
  const nav = useNavigate();

  useEffect(() => {
    if (!searchOpen) setQ("");
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeSearch(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, closeSearch]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const s = q.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(s) ||
      p.team.toLowerCase().includes(s) ||
      (p.driver ?? "").toLowerCase().includes(s) ||
      p.tag.toLowerCase().includes(s)
    ).slice(0, 6);
  }, [q, products]);

  if (!searchOpen) return null;

  const go = (id: string) => {
    pushRecent(q || id);
    closeSearch();
    nav({ to: "/product/$id", params: { id } });
  };

  return (
    <div className="fixed inset-0 z-[100]" role="dialog">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in" onClick={closeSearch} />
      <div className="absolute inset-x-4 top-24 mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border/60 bg-background shadow-2xl animate-in fade-in slide-in-from-top-4">
        <div className="flex items-center gap-3 border-b border-border/60 px-5 py-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jerseys, teams, drivers…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          <kbd className="rounded border border-border/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">ESC</kbd>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {q === "" ? (
            <div className="space-y-5">
              {recent.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground"><Clock className="h-3 w-3" /> Recent</div>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r) => <button key={r} onClick={() => setQ(r)} className="rounded-full border border-border/60 px-3 py-1 text-xs hover:border-foreground">{r}</button>)}
                  </div>
                </div>
              )}
              <div>
                <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground"><TrendingUp className="h-3 w-3" /> Trending</div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING.map((t) => <button key={t} onClick={() => setQ(t)} className="rounded-full border border-border/60 px-3 py-1 text-xs hover:border-foreground">{t}</button>)}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">No matches for "{q}"</div>
          ) : (
            <ul className="divide-y divide-border/50">
              {results.map((p) => (
                <li key={p.id}>
                  <button onClick={() => go(p.id)} className="flex w-full items-center gap-4 px-1 py-3 text-left hover:bg-white/10">
                    <img src={p.images[0]} alt="" loading="lazy" className="h-12 w-10 rounded object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{p.name}</div>
                      <div className="text-[11px] text-muted-foreground">{p.team}{p.driver ? ` · ${p.driver}` : ""}</div>
                    </div>
                    <div className="font-mono text-xs">{formatINR(p.price)}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
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
              <span className="text-gray-600 mb-1.5">Size: {item.size || "S"}</span>
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
  return (
    <>
      <div className="hidden sm:block"><SiteNav /></div>
      <MobileTopNav />
      <main className={`pt-0 pb-16 w-full overflow-x-hidden ${isHome ? "sm:pt-0 sm:pb-0" : "sm:pt-20 sm:pb-8"}`}>{children}</main>
      <SiteFooter />
      {/* <CartDrawer /> */}
      <SearchDialog />
      <PopupModals />
    </>
  );
}

export function MobileTopNav() {
  const nav = useNavigate();
  const { cart, openCart, openSearch, userEmail, wishlist } = useShop();
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = cart.reduce((a, b) => a + b.qty, 0);
  const [spinOpen, setSpinOpen] = useState(false);
  const [f1Open, setF1Open] = useState(false);
  const [footballOpen, setFootballOpen] = useState(false);
  const [basketballOpen, setBasketballOpen] = useState(false);
  const [cricketOpen, setCricketOpen] = useState(false);
  const [zonesOpen, setZonesOpen] = useState(false);
  const cricketOpenState = useState(false);

  return (
    <div className="sm:hidden sticky top-0 inset-x-0 z-[100]">
      {/* Promo Bar */}
      <div className="w-full bg-[#f4f4f4] text-black text-[9px] font-bold uppercase tracking-wider text-center py-1">
        FREE RETURNS AND EXCHANGES.
      </div>
      {/* Main Bar */}
      <div className="relative flex items-center justify-between bg-[#181818] px-4 py-4 shadow-md">
        <div className="flex items-center gap-3 z-10">
          <button onClick={() => setMenuOpen(true)} className="text-white active:scale-95 transition-transform">
            <Menu className="h-6 w-6 stroke-[2]" />
          </button>
          <button onClick={openSearch} className="text-white active:scale-95 transition-transform">
            <Search className="h-5 w-5 stroke-[2]" />
          </button>
        </div>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Link to="/" className="pointer-events-auto flex items-center justify-center">
            <img
              src="/logo.png?v=3"
              alt="Veloce Wear"
              loading="eager"
              fetchPriority="high"
              className="h-12 w-auto object-contain scale-150 brightness-0 invert"
            />
          </Link>
        </div>
        
        <div className="flex items-center gap-3 z-10">
          <Link to={userEmail ? "/profile" : "/login"} className="text-white active:scale-95 transition-transform">
            <User className="h-6 w-6 stroke-[2]" />
          </Link>
          <Link to="/wishlist" className="relative text-white active:scale-95 transition-transform">
            <Heart className="h-6 w-6 stroke-[2]" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#d32f2f] px-1 text-[10px] font-bold text-white shadow-sm">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button onClick={() => nav({ to: "/checkout" })} className="relative text-white active:scale-95 transition-transform">
            <ShoppingBag className="h-6 w-6 stroke-[2]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#d32f2f] px-1 text-[10px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

        </div>
      </div>

      {/* Sidebar Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setMenuOpen(false)} />
          <div className="relative w-[85%] max-w-[320px] bg-background border-r border-border/40 h-full flex flex-col overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="flex items-center p-4 border-b border-border/40">
              <button onClick={() => setMenuOpen(false)} className="text-[#f65c29] mr-4 active:scale-90 transition-transform">
                <X className="h-7 w-7 stroke-[3]" />
              </button>
              <button onClick={() => { setMenuOpen(false); openSearch(); }} className="text-foreground active:scale-90 transition-transform">
                <Search className="h-[22px] w-[22px] stroke-[2.5]" />
              </button>
              
              <div className="flex-1 flex justify-center mr-2">
                <img
                  src="/logo.png?v=3"
                  alt="Veloce Wear"
                  loading="lazy"
                  className="h-12 w-auto object-contain scale-150 invert drop-shadow-sm"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <button onClick={() => { setMenuOpen(false); nav({ to: "/checkout" }); }} className="relative text-foreground active:scale-90 transition-transform">
                  <ShoppingBag className="h-6 w-6 stroke-[2]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f65c29] px-1 text-[9px] font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </button>
                <Link to={userEmail ? "/profile" : "/login"} className="text-foreground active:scale-90 transition-transform" onClick={() => setMenuOpen(false)}>
                  <User className="h-[26px] w-[26px] stroke-[2]" />
                </Link>
              </div>
            </div>

            <div className="flex flex-col py-6 px-6 gap-6">
              <Link to="/" onClick={() => setMenuOpen(false)} className="text-[#f65c29] font-bold text-[15px] tracking-wide">
                Home
              </Link>
              
              <div className="flex flex-col gap-4">
                <button onClick={() => setFootballOpen(!footballOpen)} className="flex items-center justify-between text-foreground font-bold text-[15px] tracking-wide">
                  <span>Football Jerseys</span>
                  <ChevronDown className={`h-4 w-4 stroke-[3] transition-transform ${footballOpen ? 'rotate-180' : ''}`} />
                </button>
                {footballOpen && (
                  <div className="grid grid-cols-4 gap-3 pt-2">
                    {footballTeams.map(([t, logo]) => (
                      <Link key={t} to="/shop/football" search={{ team: t } as never} onClick={() => setMenuOpen(false)} className="flex flex-col items-center gap-1.5 group">
                        <div className="w-12 h-12 rounded-full bg-white border border-border/40 flex items-center justify-center p-2.5 shadow-sm active:scale-95 transition-transform">
                          <img src={logo} alt={t} loading="lazy" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain filter drop-shadow-md" />
                        </div>
                        <span className="text-[8px] text-center font-medium text-muted-foreground leading-[1.1]">{t}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-4">
                <button onClick={() => setBasketballOpen(!basketballOpen)} className="flex items-center justify-between text-foreground font-bold text-[15px] tracking-wide">
                  <span>Basketball Jerseys</span>
                  <ChevronDown className={`h-4 w-4 stroke-[3] transition-transform ${basketballOpen ? 'rotate-180' : ''}`} />
                </button>
                {basketballOpen && (
                  <div className="grid grid-cols-4 gap-3 pt-2">
                    {basketballTeams.map(([t, logo]) => (
                      <Link key={t} to="/shop/basketball" search={{ team: t } as never} onClick={() => setMenuOpen(false)} className="flex flex-col items-center gap-1.5 group">
                        <div className="w-12 h-12 rounded-full bg-white border border-border/40 flex items-center justify-center p-2.5 shadow-sm active:scale-95 transition-transform">
                          <img src={logo} alt={t} loading="lazy" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain filter drop-shadow-md" />
                        </div>
                        <span className="text-[8px] text-center font-medium text-muted-foreground leading-[1.1]">{t}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-4">
                <button onClick={() => setCricketOpen(!cricketOpen)} className="flex items-center justify-between text-foreground font-bold text-[15px] tracking-wide">
                  <span>Cricket Jerseys</span>
                  <ChevronDown className={`h-4 w-4 stroke-[3] transition-transform ${cricketOpen ? 'rotate-180' : ''}`} />
                </button>
                {cricketOpen && (
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand px-1">Internationals</div>
                    <div className="grid grid-cols-4 gap-3">
                      {cricketInternationalTeams.map(([t, logo]) => (
                        <Link key={t} to="/shop/cricket" search={{ team: t } as never} onClick={() => setMenuOpen(false)} className="flex flex-col items-center gap-1.5 group">
                          <div className="w-12 h-12 rounded-full bg-white border border-border/40 flex items-center justify-center p-2.5 shadow-sm active:scale-95 transition-transform">
                            <img src={logo} alt={t} loading="lazy" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain filter drop-shadow-md" />
                          </div>
                          <span className="text-[8px] text-center font-medium text-muted-foreground leading-[1.1]">{t}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand px-1 mt-2">IPL</div>
                    <div className="grid grid-cols-4 gap-3">
                      {cricketIPLTeams.map(([t, logo]) => (
                        <Link key={t} to="/shop/cricket" search={{ team: t } as never} onClick={() => setMenuOpen(false)} className="flex flex-col items-center gap-1.5 group">
                          <div className="w-12 h-12 rounded-full bg-white border border-border/40 flex items-center justify-center p-2.5 shadow-sm active:scale-95 transition-transform">
                            <img src={logo} alt={t} loading="lazy" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain filter drop-shadow-md" />
                          </div>
                          <span className="text-[8px] text-center font-medium text-muted-foreground leading-[1.1]">{t}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-4">
                <button onClick={() => setF1Open(!f1Open)} className="flex items-center justify-between text-foreground font-bold text-[15px] tracking-wide">
                  <span>Formula 1 Store</span>
                  <ChevronDown className={`h-4 w-4 stroke-[3] transition-transform ${f1Open ? 'rotate-180' : ''}`} />
                </button>
                {f1Open && (
                  <div className="grid grid-cols-4 gap-3 pt-2">
                    {f1Teams.map(([t, logo]) => (
                      <Link key={t} to="/shop/f1" search={{ team: t } as never} onClick={() => setMenuOpen(false)} className="flex flex-col items-center gap-1.5 group">
                        <div className="w-12 h-12 rounded-full bg-white border border-border/40 flex items-center justify-center p-2.5 shadow-sm active:scale-95 transition-transform">
                          <img src={logo} alt={t} loading="lazy" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain filter drop-shadow-md" />
                        </div>
                        <span className="text-[8px] text-center font-medium text-muted-foreground leading-[1.1]">{t}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link to="/shop/worldcup" onClick={() => setMenuOpen(false)} className="text-foreground font-bold text-[15px] tracking-wide">
                FIFA World Cup
              </Link>
              
              <Link to="/shop/retro" onClick={() => setMenuOpen(false)} className="text-foreground font-bold text-[15px] tracking-wide">
                Retro Jerseys
              </Link>

              <button onClick={() => { 
                setMenuOpen(false); 
                if (!userEmail) nav({ to: "/login" });
                else setSpinOpen(true); 
              }} className="text-left text-foreground font-bold text-[15px] tracking-wide flex items-center gap-2">
                Lucky Wheel <Gift className="h-4 w-4 text-foreground" />
              </button>


            </div>
          </div>
        </div>
      )}
      
      <FortuneSpin open={spinOpen} onClose={() => setSpinOpen(false)} />
    </div>
  );
}


