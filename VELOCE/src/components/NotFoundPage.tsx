import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Home, ShoppingBag, ArrowLeft, Sparkles, Compass, Flame, ShieldAlert } from "lucide-react";
import { SiteChrome } from "@/components/chrome";

export function NotFoundPage({ 
  title = "Offside! Page Not Found", 
  message = "The jersey, collection, or page you are looking for has been moved, renamed, or is out of bounds." 
}: { 
  title?: string; 
  message?: string; 
}) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate({ to: "/search", search: { q: query.trim() } as any });
    }
  };

  const trendingSearches = [
    { label: "Real Madrid 26/27", q: "Real Madrid" },
    { label: "Arsenal Player Edition", q: "Arsenal" },
    { label: "Ferrari F1 Team", q: "Ferrari" },
    { label: "Barcelona Home", q: "Barcelona" },
    { label: "New Kits 2026/27", q: "26/27" },
    { label: "Cricket IPL", q: "Cricket" },
  ];

  return (
    <SiteChrome>
      <div className="relative min-h-[75vh] flex items-center justify-center overflow-hidden py-12 px-4 sm:px-6">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#d32f2f]/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-[300px] h-[200px] bg-black/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl w-full text-center">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/10 bg-white/80 backdrop-blur-md shadow-xs mb-6 animate-in fade-in zoom-in-95 duration-500">
            <span className="flex h-2 w-2 rounded-full bg-[#d32f2f] animate-ping" />
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#d32f2f]">
              ERROR 404 • OUT OF BOUNDS
            </span>
          </div>

          {/* Huge Dynamic 404 Heading */}
          <div className="relative my-2 select-none">
            <h1 className="text-[90px] sm:text-[140px] font-black tracking-tighter text-black/90 leading-none font-display">
              4<span className="text-[#d32f2f]">0</span>4
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[12px] sm:text-[14px] font-mono uppercase tracking-[0.3em] font-bold text-neutral-400 bg-white/90 px-4 py-1 rounded-full border border-black/5 shadow-xs">
                MATCHDAY REPLAY
              </span>
            </div>
          </div>

          {/* Title & Message */}
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 max-w-md mx-auto leading-relaxed mb-8 font-medium">
            {message}
          </p>

          {/* Live Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto mb-8 relative">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search jerseys, teams, players..."
                className="w-full pl-11 pr-24 py-3.5 bg-white border border-black/15 rounded-full text-[14px] text-black placeholder:text-neutral-400 focus:outline-none focus:border-[#d32f2f] shadow-xs transition-colors font-medium"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-2 bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded-full hover:bg-[#d32f2f] transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider mr-1">Trending:</span>
              {trendingSearches.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => navigate({ to: "/search", search: { q: item.q } as any })}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-black/5 hover:bg-[#d32f2f]/10 hover:text-[#d32f2f] text-neutral-700 font-medium transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </form>

          {/* Primary Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-black text-white text-[12px] font-bold uppercase tracking-widest hover:bg-[#d32f2f] transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <Home className="h-4 w-4" />
              Return Home
            </Link>

            <Link
              to="/shop/football"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black border border-black/15 text-[12px] font-bold uppercase tracking-widest hover:border-black hover:bg-neutral-50 transition-all shadow-xs active:scale-95"
            >
              <ShoppingBag className="h-4 w-4 text-[#d32f2f]" />
              Football Kits
            </Link>

            <Link
              to="/new-kits"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black border border-black/15 text-[12px] font-bold uppercase tracking-widest hover:border-black hover:bg-neutral-50 transition-all shadow-xs active:scale-95"
            >
              <Flame className="h-4 w-4 text-[#d32f2f]" />
              New 26/27 Kits
            </Link>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
