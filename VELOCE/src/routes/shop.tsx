import { createFileRoute, Outlet, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { SiteChrome } from "@/components/chrome";
import { ProductCard } from "@/components/ProductCard";
import { type Category } from "@/lib/catalog";
import { useCatalog } from "@/lib/catalog-store";

export const Route = createFileRoute("/shop")({
  component: () => <Outlet />,
});

export function ShopInner({ title, subtitle, category }: { title: string; subtitle: string; category?: Category }) {
  const { products } = useCatalog();
  const search = useSearch({ strict: false }) as { team?: string };
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("featured");
  const [team, setTeam] = useState<string | null>(search.team ?? null);
  const [price, setPrice] = useState<[number, number]>([0, 30000]);
  const [visible, setVisible] = useState(24);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => { setTeam(search.team ?? null); }, [search.team]);

  const filtered = useMemo(() => {
    let list = category 
      ? products.filter((p) => category === "football" ? (p.category === "football" || p.category === "worldcup") : p.category === category) 
      : products;
    if (team) list = list.filter((p) => p.team === team);
    list = list.filter((p) => p.price >= price[0] && p.price <= price[1]);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, team, price, sort, products]);

  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1200) {
        setVisible((v) => Math.min(v + 12, filtered.length));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [filtered.length]);

  useEffect(() => setVisible(24), [category, team, price, sort]);

  const teams = Array.from(new Set((category ? products.filter((p) => p.category === category) : products).map((p) => p.team))).sort();

  return (
    <div className="mx-auto max-w-7xl px-6 pt-8">
      <header className="mb-10 flex flex-col gap-2">
        <div className="text-[10px] uppercase tracking-[0.28em] text-brand">Collection</div>
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">{title}</h1>
        <p className="max-w-xl text-sm text-muted-foreground">{subtitle}</p>
      </header>
      <div className="flex flex-col gap-6 lg:flex-row">
        <FiltersPanel open={filtersOpen} onClose={() => setFiltersOpen(false)} teams={teams} team={team} setTeam={setTeam} price={price} setPrice={setPrice} />
        <div className="flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setFiltersOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-xs uppercase tracking-[0.15em] lg:hidden">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
              </button>
              <span className="font-mono text-xs text-muted-foreground">{filtered.length} products</span>
            </div>
            <div className="flex items-center gap-2">
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-full border border-border/70 bg-transparent px-3 py-1.5 text-xs outline-none">
                <option value="featured">Featured</option>
                <option value="price-asc">Price · Low to High</option>
                <option value="price-desc">Price · High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <div className="hidden overflow-hidden rounded-full border border-border/70 sm:flex">
                <button onClick={() => setView("grid")} className={`p-2 ${view === "grid" ? "bg-foreground text-background" : ""}`} aria-label="Grid"><LayoutGrid className="h-3.5 w-3.5" /></button>
                <button onClick={() => setView("list")} className={`p-2 ${view === "list" ? "bg-foreground text-background" : ""}`} aria-label="List"><List className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
          {view === "grid" ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.slice(0, visible).map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.slice(0, visible).map((p) => <ProductCard key={p.id} p={p} view="list" />)}
            </div>
          )}
          {visible < filtered.length && <div className="py-10 text-center text-xs uppercase tracking-[0.24em] text-muted-foreground">Loading more…</div>}
        </div>
      </div>
    </div>
  );
}

function FiltersPanel({ open, onClose, teams, team, setTeam, price, setPrice }: any) {
  const body = (
    <div className="space-y-6 text-sm">
      <div>
        <div className="mb-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Team</div>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={team === null} onClick={() => setTeam(null)}>All</FilterChip>
          {teams.map((t: string) => <FilterChip key={t} active={team === t} onClick={() => setTeam(t)}>{t}</FilterChip>)}
        </div>
      </div>
      <div>
      <div className="mb-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Max price · ₹{price[1].toLocaleString("en-IN")}</div>
        <input type="range" min={2000} max={30000} step={500} value={price[1]} onChange={(e) => setPrice([price[0], Number(e.target.value)])} className="w-full accent-brand" />
      </div>
    </div>
  );
  return (
    <>
      <aside className="hidden w-56 shrink-0 lg:block">{body}</aside>
      {open && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={onClose} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-y-auto bg-background p-6">
            <div className="mb-4 flex items-center justify-between"><div className="font-display text-lg font-semibold">Filters</div><button onClick={onClose}><X className="h-5 w-5" /></button></div>
            {body}
          </div>
        </div>
      )}
    </>
  );
}
function FilterChip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={`rounded-full border px-3 py-1.5 text-xs transition ${active ? "border-foreground bg-foreground text-background" : "border-border/70 text-muted-foreground hover:border-foreground hover:text-foreground"}`}>{children}</button>;
}
