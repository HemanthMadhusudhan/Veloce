import { createFileRoute, Outlet, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SiteChrome } from "@/components/chrome";
import { ProductCard } from "@/components/ProductCard";
import { type Category } from "@/lib/catalog";
import { useCatalog } from "@/lib/catalog-store";
import { TEAM_LOGOS } from "@/lib/logos";

export interface TeamThemeConfig {
  bgGradient: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  sloganColor: string;
  badgeBg: string;
  slogan: string;
}

const TEAM_CONFIGS: Record<string, TeamThemeConfig> = {
  // F1
  "McLaren": {
    bgGradient: "from-[#0f0f10] via-[#1a1a1e] to-[#ff8000]/25",
    borderColor: "border-[#ff8000]/40",
    textColor: "text-white",
    accentColor: "text-[#ff8000]",
    sloganColor: "text-[#ff8000]",
    badgeBg: "bg-[#ff8000]/15 text-[#ff8000] border-[#ff8000]/30",
    slogan: "Fearlessly Forward",
  },
  "Ferrari": {
    bgGradient: "from-[#1a0000] via-[#2d0002] to-[#dc0000]/30",
    borderColor: "border-[#dc0000]/50",
    textColor: "text-white",
    accentColor: "text-[#ffeb3b]",
    sloganColor: "text-[#ffeb3b]",
    badgeBg: "bg-[#dc0000]/25 text-[#ffeb3b] border-[#dc0000]/40",
    slogan: "Essere Ferrari",
  },
  "Red Bull": {
    bgGradient: "from-[#020024] via-[#05004d] to-[#cc0000]/25",
    borderColor: "border-[#0022d4]/50",
    textColor: "text-white",
    accentColor: "text-[#ffcc00]",
    sloganColor: "text-[#ffcc00]",
    badgeBg: "bg-[#001799]/40 text-[#ffcc00] border-[#ffcc00]/40",
    slogan: "Gives You Wings",
  },
  "Mercedes": {
    bgGradient: "from-[#041517] via-[#0a2327] to-[#00a19c]/30",
    borderColor: "border-[#00a19c]/40",
    textColor: "text-white",
    accentColor: "text-[#00a19c]",
    sloganColor: "text-[#00a19c]",
    badgeBg: "bg-[#00a19c]/20 text-[#00a19c] border-[#00a19c]/30",
    slogan: "Just Driven",
  },
  "Aston Martin": {
    bgGradient: "from-[#001712] via-[#002b21] to-[#006652]/30",
    borderColor: "border-[#006652]/50",
    textColor: "text-white",
    accentColor: "text-[#a3e635]",
    sloganColor: "text-[#a3e635]",
    badgeBg: "bg-[#00382b]/60 text-[#a3e635] border-[#006652]/50",
    slogan: "Intensity. Driven.",
  },
  "Alpine": {
    bgGradient: "from-[#001224] via-[#00254a] to-[#fd4bc7]/25",
    borderColor: "border-[#0055a5]/40",
    textColor: "text-white",
    accentColor: "text-[#fd4bc7]",
    sloganColor: "text-[#fd4bc7]",
    badgeBg: "bg-[#00254a]/50 text-[#fd4bc7] border-[#0055a5]/40",
    slogan: "Race. Elevate.",
  },

  // Football
  "Real Madrid": {
    bgGradient: "from-[#0b0f19] via-[#111827] to-[#eab308]/25",
    borderColor: "border-[#eab308]/40",
    textColor: "text-white",
    accentColor: "text-[#fde047]",
    sloganColor: "text-[#fde047]",
    badgeBg: "bg-[#eab308]/15 text-[#fde047] border-[#eab308]/30",
    slogan: "# Hala Madrid!",
  },
  "FC Barcelona": {
    bgGradient: "from-[#360017] via-[#001438] to-[#a50044]/35",
    borderColor: "border-[#004d98]/50",
    textColor: "text-white",
    accentColor: "text-[#f59e0b]",
    sloganColor: "text-[#f59e0b]",
    badgeBg: "bg-[#a50044]/30 text-[#f59e0b] border-[#004d98]/40",
    slogan: "Més que un club",
  },
  "Barcelona": {
    bgGradient: "from-[#360017] via-[#001438] to-[#a50044]/35",
    borderColor: "border-[#004d98]/50",
    textColor: "text-white",
    accentColor: "text-[#f59e0b]",
    sloganColor: "text-[#f59e0b]",
    badgeBg: "bg-[#a50044]/30 text-[#f59e0b] border-[#004d98]/40",
    slogan: "Més que un club",
  },
  "Manchester United": {
    bgGradient: "from-[#240003] via-[#450005] to-[#da020e]/30",
    borderColor: "border-[#da020e]/50",
    textColor: "text-white",
    accentColor: "text-[#facc15]",
    sloganColor: "text-[#facc15]",
    badgeBg: "bg-[#da020e]/25 text-[#facc15] border-[#da020e]/40",
    slogan: "Glory Glory Man United!",
  },
  "Arsenal FC": {
    bgGradient: "from-[#240003] via-[#4a0005] to-[#db0007]/30",
    borderColor: "border-[#db0007]/50",
    textColor: "text-white",
    accentColor: "text-[#fbbf24]",
    sloganColor: "text-[#fbbf24]",
    badgeBg: "bg-[#db0007]/25 text-[#fbbf24] border-[#db0007]/40",
    slogan: "Victoria Concordia Crescit",
  },
  "Arsenal": {
    bgGradient: "from-[#240003] via-[#4a0005] to-[#db0007]/30",
    borderColor: "border-[#db0007]/50",
    textColor: "text-white",
    accentColor: "text-[#fbbf24]",
    sloganColor: "text-[#fbbf24]",
    badgeBg: "bg-[#db0007]/25 text-[#fbbf24] border-[#db0007]/40",
    slogan: "Victoria Concordia Crescit",
  },
  "Liverpool FC": {
    bgGradient: "from-[#240005] via-[#45000a] to-[#c8102e]/30",
    borderColor: "border-[#c8102e]/50",
    textColor: "text-white",
    accentColor: "text-[#fde047]",
    sloganColor: "text-[#fde047]",
    badgeBg: "bg-[#c8102e]/25 text-[#fde047] border-[#c8102e]/40",
    slogan: "You'll Never Walk Alone",
  },
  "Liverpool": {
    bgGradient: "from-[#240005] via-[#45000a] to-[#c8102e]/30",
    borderColor: "border-[#c8102e]/50",
    textColor: "text-white",
    accentColor: "text-[#fde047]",
    sloganColor: "text-[#fde047]",
    badgeBg: "bg-[#c8102e]/25 text-[#fde047] border-[#c8102e]/40",
    slogan: "You'll Never Walk Alone",
  },
  "Chelsea FC": {
    bgGradient: "from-[#010a17] via-[#021833] to-[#034694]/35",
    borderColor: "border-[#034694]/50",
    textColor: "text-white",
    accentColor: "text-[#60a5fa]",
    sloganColor: "text-[#60a5fa]",
    badgeBg: "bg-[#034694]/30 text-[#60a5fa] border-[#034694]/40",
    slogan: "Keep the Blue Flag Flying High",
  },
  "Chelsea": {
    bgGradient: "from-[#010a17] via-[#021833] to-[#034694]/35",
    borderColor: "border-[#034694]/50",
    textColor: "text-white",
    accentColor: "text-[#60a5fa]",
    sloganColor: "text-[#60a5fa]",
    badgeBg: "bg-[#034694]/30 text-[#60a5fa] border-[#034694]/40",
    slogan: "Keep the Blue Flag Flying High",
  },
  "Manchester City": {
    bgGradient: "from-[#05131f] via-[#0c2438] to-[#6cabdd]/35",
    borderColor: "border-[#6cabdd]/50",
    textColor: "text-white",
    accentColor: "text-[#6cabdd]",
    sloganColor: "text-[#6cabdd]",
    badgeBg: "bg-[#6cabdd]/25 text-[#6cabdd] border-[#6cabdd]/40",
    slogan: "Pride in Battle",
  },
  "AC Milan": {
    bgGradient: "from-[#1a0000] via-[#090000] to-[#fb090b]/30",
    borderColor: "border-[#fb090b]/40",
    textColor: "text-white",
    accentColor: "text-[#fb090b]",
    sloganColor: "text-[#fb090b]",
    badgeBg: "bg-[#fb090b]/25 text-[#fb090b] border-[#fb090b]/40",
    slogan: "Sempre Milan",
  },
  "Juventus": {
    bgGradient: "from-[#050505] via-[#121212] to-[#ffffff]/15",
    borderColor: "border-white/30",
    textColor: "text-white",
    accentColor: "text-[#eab308]",
    sloganColor: "text-[#eab308]",
    badgeBg: "bg-white/10 text-white border-white/25",
    slogan: "Fino Alla Fine",
  },
  "Bayern München": {
    bgGradient: "from-[#290109] via-[#47020f] to-[#dc052d]/30",
    borderColor: "border-[#dc052d]/50",
    textColor: "text-white",
    accentColor: "text-[#ffffff]",
    sloganColor: "text-[#ffffff]",
    badgeBg: "bg-[#dc052d]/25 text-white border-[#dc052d]/40",
    slogan: "Mia San Mia",
  },
  "Paris Saint-Germain": {
    bgGradient: "from-[#000d1c] via-[#001c38] to-[#da291c]/30",
    borderColor: "border-[#004170]/50",
    textColor: "text-white",
    accentColor: "text-[#da291c]",
    sloganColor: "text-[#da291c]",
    badgeBg: "bg-[#001c38]/60 text-[#da291c] border-[#da291c]/40",
    slogan: "Ici c'est Paris",
  },

  // Cricket
  "India": {
    bgGradient: "from-[#000f21] via-[#00224a] to-[#0055a5]/35",
    borderColor: "border-[#0055a5]/50",
    textColor: "text-white",
    accentColor: "text-[#ff9933]",
    sloganColor: "text-[#ff9933]",
    badgeBg: "bg-[#0055a5]/30 text-[#ff9933] border-[#0055a5]/40",
    slogan: "Bleed Blue",
  },
  "Chennai Super Kings": {
    bgGradient: "from-[#241a00] via-[#423000] to-[#fdb913]/30",
    borderColor: "border-[#fdb913]/50",
    textColor: "text-white",
    accentColor: "text-[#fdb913]",
    sloganColor: "text-[#fdb913]",
    badgeBg: "bg-[#fdb913]/25 text-[#fdb913] border-[#fdb913]/40",
    slogan: "Whistle Podu!",
  },
  "Royal Challengers Bangalore": {
    bgGradient: "from-[#210003] via-[#3d0005] to-[#ec1c24]/35",
    borderColor: "border-[#ec1c24]/50",
    textColor: "text-white",
    accentColor: "text-[#fde047]",
    sloganColor: "text-[#fde047]",
    badgeBg: "bg-[#ec1c24]/25 text-[#fde047] border-[#ec1c24]/40",
    slogan: "Play Bold",
  },
  "Mumbai Indians": {
    bgGradient: "from-[#001026] via-[#002352] to-[#004ba0]/35",
    borderColor: "border-[#004ba0]/50",
    textColor: "text-white",
    accentColor: "text-[#eab308]",
    sloganColor: "text-[#eab308]",
    badgeBg: "bg-[#004ba0]/30 text-[#eab308] border-[#004ba0]/40",
    slogan: "Duniya Hila Denge Hum",
  },
  "Kolkata Knight Riders": {
    bgGradient: "from-[#10081d] via-[#22133b] to-[#3a225d]/35",
    borderColor: "border-[#3a225d]/50",
    textColor: "text-white",
    accentColor: "text-[#fde047]",
    sloganColor: "text-[#fde047]",
    badgeBg: "bg-[#3a225d]/40 text-[#fde047] border-[#fde047]/30",
    slogan: "Korbo Lorbo Jeetbo!",
  },

  // Basketball
  "Los Angeles Lakers": {
    bgGradient: "from-[#160726] via-[#2d0e4c] to-[#fdb927]/25",
    borderColor: "border-[#552583]/50",
    textColor: "text-white",
    accentColor: "text-[#fdb927]",
    sloganColor: "text-[#fdb927]",
    badgeBg: "bg-[#552583]/40 text-[#fdb927] border-[#fdb927]/30",
    slogan: "Showtime",
  },
  "Chicago Bulls": {
    bgGradient: "from-[#260109] via-[#470313] to-[#ce1141]/30",
    borderColor: "border-[#ce1141]/50",
    textColor: "text-white",
    accentColor: "text-[#ce1141]",
    sloganColor: "text-[#ce1141]",
    badgeBg: "bg-[#ce1141]/25 text-white border-[#ce1141]/40",
    slogan: "See Red",
  },
  "Golden State Warriors": {
    bgGradient: "from-[#040e24] via-[#081e47] to-[#ffc72c]/25",
    borderColor: "border-[#1d428a]/50",
    textColor: "text-white",
    accentColor: "text-[#ffc72c]",
    sloganColor: "text-[#ffc72c]",
    badgeBg: "bg-[#1d428a]/40 text-[#ffc72c] border-[#ffc72c]/30",
    slogan: "Strength in Numbers",
  }
};

export function getTeamTheme(teamName: string): TeamThemeConfig {
  if (TEAM_CONFIGS[teamName]) return TEAM_CONFIGS[teamName];
  
  const lower = teamName.toLowerCase().trim();
  const foundKey = Object.keys(TEAM_CONFIGS).find((k) => {
    const kLower = k.toLowerCase().trim();
    return kLower === lower || kLower.includes(lower) || lower.includes(kLower);
  });

  if (foundKey) return TEAM_CONFIGS[foundKey];

  return {
    bgGradient: "from-[#090d16] via-[#111827] to-[#d32f2f]/25",
    borderColor: "border-[#d32f2f]/40",
    textColor: "text-white",
    accentColor: "text-[#d32f2f]",
    sloganColor: "text-neutral-300",
    badgeBg: "bg-[#d32f2f]/20 text-[#d32f2f] border-[#d32f2f]/30",
    slogan: `Official match-day kits and gear for ${teamName}.`,
  };
}

import { getLiveTeamLogo } from "@/lib/teams";

export function getTeamLogo(teamName: string): string | null {
  return getLiveTeamLogo(teamName);
}

function AnimatedTeamHeader({
  team,
  onClear,
}: {
  team: string;
  onClear: () => void;
}) {
  const logo = getTeamLogo(team);
  const theme = getTeamTheme(team);

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full overflow-hidden border-b py-4 sm:py-5.5 px-4 sm:px-8 bg-gradient-to-r ${theme.bgGradient} ${theme.borderColor} shadow-xl`}
    >
      {/* Background Watermark Crest */}
      {logo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.16, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-40 w-40 sm:h-60 sm:w-60 translate-x-4"
        >
          <img src={logo} alt="" className="h-full w-full object-contain filter drop-shadow-2xl grayscale invert" />
        </motion.div>
      )}

      {/* Subtle Ambient Radial Mesh Light */}
      <div className="pointer-events-none absolute -left-10 top-0 h-40 w-64 bg-white/5 blur-3xl rounded-full" />

      <div className="mx-auto max-w-7xl relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
          {/* Team Crest Badge: Sharp, High-Fashion Card */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            whileHover={{ scale: 1.06 }}
            className="relative shrink-0"
          >
            {logo ? (
              <div className="flex h-14 w-14 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-white p-2.5 sm:p-3 shadow-2xl border border-white/40 ring-1 ring-black/10">
                <img src={logo} alt={team} className="max-h-full max-w-full object-contain filter drop-shadow-xs" />
              </div>
            ) : (
              <div className="flex h-14 w-14 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 p-3 backdrop-blur-xl border border-white/25 shadow-2xl">
                <span className="font-display text-2xl font-black text-white">{team.charAt(0)}</span>
              </div>
            )}
          </motion.div>

          {/* Editorial Typography Stack */}
          <div className="flex flex-col min-w-0 justify-center">
            <motion.div
              initial={{ x: -15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.08 }}
              className="flex items-center gap-2 mb-0.5"
            >
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-white/50">
                OFFICIAL KITS
              </span>
            </motion.div>

            <motion.h1
              initial={{ x: -15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.12 }}
              className={`font-display text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-none truncate drop-shadow-sm ${theme.textColor}`}
            >
              {team}
            </motion.h1>

            <motion.p
              initial={{ x: -15, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.18 }}
              className={`mt-1 font-sans text-xs sm:text-sm font-semibold tracking-wide truncate ${theme.sloganColor}`}
            >
              {theme.slogan}
            </motion.p>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

export const Route = createFileRoute("/shop")({
  component: () => <Outlet />,
});

export function ShopInner({
  title,
  subtitle,
  category,
  bannerUrl,
  customProductIds,
}: {
  title: string;
  subtitle: string;
  category?: Category;
  bannerUrl?: string;
  customProductIds?: string[];
}) {
  const { products } = useCatalog();
  const search = useSearch({ strict: false }) as { team?: string };
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("featured");
  const [team, setTeam] = useState<string | null>(search.team ?? null);
  const [price, setPrice] = useState<[number, number]>([0, 30000]);
  const [visible, setVisible] = useState(24);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setTeam(search.team ?? null);
  }, [search.team]);

  const randomOffsets = useMemo(() => {
    return products.reduce((acc, p) => {
      acc[p.id] = Math.random();
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

function isRCBProduct(p: { team?: string; name?: string; id?: string }): boolean {
  const team = (p.team || "").toLowerCase();
  const name = (p.name || "").toLowerCase();
  const id = (p.id || "").toLowerCase();
  return (
    team.includes("rcb") ||
    team.includes("royal challengers") ||
    team.includes("bengaluru") ||
    team.includes("bangalore") ||
    name.includes("rcb") ||
    name.includes("royal challengers") ||
    id.includes("rcb") ||
    id.includes("royal-challengers")
  );
}

  const filtered = useMemo(() => {
    let list = [...products];
    if (!category && !team && sort === "featured") {
       list.sort((a, b) => randomOffsets[a.id] - randomOffsets[b.id]);
    } else {
       // do nothing to maintain original order which might be new to old
    }
    
    if (category) {
      list = list.filter((p) =>
          category === "football"
            ? p.category === "football" || p.category === "worldcup"
            : p.category === category,
        );
    }
    if (customProductIds) {
      list = list.filter((p) => customProductIds.includes(p.id));
    }
    if (team) list = list.filter((p) => p.team === team);
    list = list.filter((p) => p.price >= price[0] && p.price <= price[1]);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "rating") list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));

    // Show RCB products at the top always for cricket category
    if (category === "cricket" && !team && sort === "featured") {
      const rcb = list.filter(isRCBProduct);
      const rest = list.filter((p) => !isRCBProduct(p));
      list = [...rcb, ...rest];
    }

    return list;
  }, [category, team, price, sort, products, randomOffsets, customProductIds]);

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

  const teams = Array.from(
    new Set(
      (category ? products.filter((p) => p.category === category) : products).map((p) => p.team),
    ),
  ).sort();

  const displayTitle = team ? team : title;
  const displaySubtitle = team ? getTeamTheme(team).slogan : subtitle;

  return (
    <div className="w-full bg-white">
      <AnimatePresence mode="wait">
        {team ? (
          <AnimatedTeamHeader key={team} team={team} onClear={() => setTeam(null)} />
        ) : bannerUrl ? (
          <motion.div
            key="banner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-48 sm:h-64 md:h-80 overflow-hidden"
          >
            <img src={bannerUrl} alt={displayTitle} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-7xl mx-auto px-6">
              <div className="mb-2 text-[10px] uppercase tracking-[0.28em] text-brand drop-shadow-md">Collection</div>
              <h1 className="font-display text-4xl font-bold tracking-tight text-white drop-shadow-md sm:text-6xl">{displayTitle}</h1>
              <p className="mt-2 max-w-xl text-sm text-white/80 drop-shadow-sm">{displaySubtitle}</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="default-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full border-b border-black/10 py-6 sm:py-8 bg-neutral-50/50"
          >
            <header className="mx-auto max-w-7xl px-6 flex flex-col gap-1.5">
              <div className="text-[10px] uppercase tracking-[0.28em] text-brand">Collection</div>
              <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-black">{displayTitle}</h1>
              <p className="max-w-xl text-xs sm:text-sm font-medium text-neutral-600">{displaySubtitle}</p>
            </header>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-6 pb-12">
      <div className="flex flex-col gap-6 lg:flex-row">
        <FiltersPanel
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          teams={teams}
          team={team}
          setTeam={setTeam}
          price={price}
          setPrice={setPrice}
        />
        <div className="flex-1">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFiltersOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-xs uppercase tracking-[0.15em] lg:hidden"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
              </button>
              <span className="font-mono text-xs text-muted-foreground">
                {filtered.length} products
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full border border-border/70 bg-transparent px-3 py-1.5 text-xs outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price · Low to High</option>
                <option value="price-desc">Price · High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <div className="hidden overflow-hidden rounded-full border border-border/70 sm:flex">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 ${view === "grid" ? "bg-foreground text-background" : ""}`}
                  aria-label="Grid"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 ${view === "list" ? "bg-foreground text-background" : ""}`}
                  aria-label="List"
                >
                  <List className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
          {view === "grid" ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.slice(0, visible).map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.slice(0, visible).map((p) => (
                <ProductCard key={p.id} p={p} view="list" />
              ))}
            </div>
          )}
          {visible < filtered.length && (
            <div className="py-10 text-center text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Loading more…
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}

function FiltersPanel({ open, onClose, teams, team, setTeam, price, setPrice }: any) {
  const body = (
    <div className="space-y-6 text-sm">
      <div>
        <div className="mb-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Team
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={team === null} onClick={() => setTeam(null)}>
            All
          </FilterChip>
          {teams.map((t: string) => (
            <FilterChip key={t} active={team === t} onClick={() => setTeam(t)}>
              {t}
            </FilterChip>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Max price · ₹{price[1].toLocaleString("en-IN")}
        </div>
        <input
          type="range"
          min={2000}
          max={30000}
          step={500}
          value={price[1]}
          onChange={(e) => setPrice([price[0], Number(e.target.value)])}
          className="w-full accent-brand"
        />
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
            <div className="mb-4 flex items-center justify-between">
              <div className="font-display text-lg font-semibold">Filters</div>
              <button onClick={onClose}>
                <X className="h-5 w-5" />
              </button>
            </div>
            {body}
          </div>
        </div>
      )}
    </>
  );
}
function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs transition ${active ? "border-foreground bg-foreground text-background" : "border-border/70 text-muted-foreground hover:border-foreground hover:text-foreground"}`}
    >
      {children}
    </button>
  );
}
