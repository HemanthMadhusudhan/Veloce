import React from "react";

export type Sport = "football" | "f1" | "cricket" | "basketball";

export interface SportHeroData {
  id: Sport;
  label: string;
  eyebrow: string;
  headline: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  accentColor: string;
  heroImage: string;
  shopByTeamHeadline: string;
}

export const SPORT_HEROES: Record<Sport, SportHeroData> = {
  football: {
    id: "football",
    label: "FOOTBALL",
    eyebrow: "THE PITCH",
    headline: "2026/27 CLUB & WORLD CUP KITS",
    description: "Authentic match-day jerseys, player editions and retro legends.",
    ctaText: "EXPLORE COLLECTION",
    ctaLink: "/shop/football",
    accentColor: "#0284c7", // Premium refined blue accent
    heroImage: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1400&q=80",
    shopByTeamHeadline: "CLUB & NATIONAL CRESTS",
  },
  f1: {
    id: "f1",
    label: "FORMULA 1",
    eyebrow: "THE PADDOCK",
    headline: "OFFICIAL F1 TEAMWEAR",
    description: "Paddock-grade teamwear built for race day.",
    ctaText: "EXPLORE F1",
    ctaLink: "/shop/f1",
    accentColor: "#dc2626", // Deep Racing Red accent
    heroImage: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1400&q=80",
    shopByTeamHeadline: "CONSTRUCTORS & TEAMS",
  },
  cricket: {
    id: "cricket",
    label: "CRICKET",
    eyebrow: "THE PAVILION",
    headline: "AUTHENTIC MATCH JERSEYS",
    description: "Match-day jerseys and fanwear for the biggest cricket moments.",
    ctaText: "EXPLORE CRICKET",
    ctaLink: "/shop/cricket",
    accentColor: "#0284c7", // Royal Navy Blue accent
    heroImage: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1400&q=80",
    shopByTeamHeadline: "IPL & INTERNATIONAL TEAMS",
  },
  basketball: {
    id: "basketball",
    label: "BASKETBALL",
    eyebrow: "THE COURT",
    headline: "HARDWOOD CLASSICS",
    description: "Classic jerseys, city editions and statement pieces.",
    ctaText: "EXPLORE BASKETBALL",
    ctaLink: "/shop/basketball",
    accentColor: "#ea580c", // Burnt Hardwood Orange accent
    heroImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1400&q=80",
    shopByTeamHeadline: "FRANCHISES & RETRO ICONS",
  },
};

export function SportSwitcher({
  activeSport,
  onChange,
}: {
  activeSport: Sport;
  onChange: (sport: Sport) => void;
  onOpenSearch?: () => void;
}) {
  const sports: { id: Sport; label: string; icon: React.ReactNode }[] = [
    {
      id: "football",
      label: "FOOTBALL",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 7l3.5 2.5v4L12 16l-3.5-2.5v-4z" fill="currentColor" fillOpacity="0.25" />
          <path d="M12 7V2M15.5 9.5L20 7M15.5 13.5L20 16M12 16v6M8.5 13.5L4 16M8.5 9.5L4 7" />
        </svg>
      ),
    },
    {
      id: "f1",
      label: "FORMULA 1",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" fill="currentColor" fillOpacity="0.25" />
          <line x1="4" y1="22" x2="4" y2="15" />
        </svg>
      ),
    },
    {
      id: "cricket",
      label: "CRICKET",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
          <circle cx="6" cy="18" r="3" fill="currentColor" fillOpacity="0.25" />
          <path d="M8.5 15.5L19 5a2.121 2.121 0 0 1 3 3L11.5 18.5a1 1 0 0 1-.7.3H8.5v-2.3a1 1 0 0 1 .3-.7z" />
          <line x1="17" y1="7" x2="19" y2="9" />
        </svg>
      ),
    },
    {
      id: "basketball",
      label: "BASKETBALL",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0">
          <circle cx="12" cy="12" r="10" />
          <path d="M2.1 13.5A10 10 0 0 0 12 22v-4" />
          <path d="M21.9 10.5A10 10 0 0 0 12 2v4" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" fill="currentColor" fillOpacity="0.15" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full bg-[#0d0d0d] border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-2 sm:px-6">
        <div className="grid grid-cols-4 w-full">
          {sports.map((item) => {
            const data = SPORT_HEROES[item.id];
            const isActive = activeSport === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onChange(item.id)}
                className={`relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-2.5 sm:py-3 transition-all cursor-pointer text-center group ${
                  isActive
                    ? "text-white font-bold"
                    : "text-neutral-400 hover:text-neutral-200 font-medium"
                }`}
              >
                <span className={`transition-transform duration-200 ${isActive ? "scale-110 text-white" : "text-neutral-400 group-hover:text-neutral-200"}`}>
                  {item.icon}
                </span>
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.14em] sm:tracking-[0.2em] truncate max-w-full">
                  {item.id === "f1" ? (
                    <>
                      <span className="sm:hidden">F1</span>
                      <span className="hidden sm:inline">FORMULA 1</span>
                    </>
                  ) : (
                    item.label
                  )}
                </span>
                {isActive && (
                  <span 
                    style={{ backgroundColor: data.accentColor }}
                    className="absolute bottom-0 left-2 right-2 sm:left-4 sm:right-4 h-[2.5px] rounded-full transition-all shadow-[0_0_8px_rgba(255,255,255,0.4)]" 
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
