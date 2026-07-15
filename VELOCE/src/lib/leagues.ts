// Football league groupings for the mega-menu.
// Teams here mirror what exists in the catalog so links resolve to real filter results.
export const LEAGUES: { league: string; teams: string[] }[] = [
  { league: "La Liga", teams: ["Real Madrid", "FC Barcelona"] },
  {
    league: "Premier League",
    teams: ["Manchester City", "Arsenal FC", "Liverpool FC", "Manchester United"],
  },
  { league: "Serie A", teams: ["Juventus", "AC Milan"] },
  { league: "Bundesliga", teams: ["Bayern München"] },
  { league: "Ligue 1", teams: ["Paris Saint-Germain"] },
];

export const FOOTBALL_QUICK_LINKS: { label: string; to: string }[] = [
  { label: "FIFA World Cup 2026", to: "/shop/worldcup" },
  { label: "Retro / Vintage", to: "/shop/retro" },
  { label: "Player Zones", to: "/shop/football" },
  { label: "All Football", to: "/shop/football" },
];
