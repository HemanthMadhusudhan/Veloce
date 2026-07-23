import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { f1Teams, basketballTeams, cricketIPLTeams, cricketInternationalTeams, footballTeams, worldCupTeams } from "./logos";

export type TeamData = {
  name: string;
  logoUrl: string;
  category: "World Cup" | "Football" | "F1" | "Basketball" | "Cricket";
};

type TeamsCtx = {
  customTeams: TeamData[];
  hiddenStaticTeams: string[];
  addTeam: (team: TeamData) => void;
  removeTeam: (name: string) => void;
  hideStaticTeam: (name: string) => void;
  restoreStaticTeam: (name: string) => void;
  
  // Expose the clean, ready-to-use lists!
  combinedFootball: [string, string][];
  combinedWC: [string, string][];
  combinedF1: [string, string][];
  combinedB: [string, string][];
  combinedCricketIPL: [string, string][];
  combinedCricketInt: [string, string][];
};

const TeamsContext = createContext<TeamsCtx | null>(null);

export function TeamsProvider({ children }: { children: ReactNode }) {
  const [customTeams, setCustomTeams] = useState<TeamData[]>([]);
  const [hiddenStaticTeams, setHiddenStaticTeams] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedCustom = localStorage.getItem("veloce_custom_teams");
      if (storedCustom) setCustomTeams(JSON.parse(storedCustom));
      
      const storedHidden = localStorage.getItem("veloce_hidden_static_teams");
      if (storedHidden) setHiddenStaticTeams(JSON.parse(storedHidden));
    } catch {}
  }, []);

  const addTeam = (team: TeamData) => {
    setCustomTeams(prev => {
      const next = prev.filter(t => t.name !== team.name).concat(team);
      localStorage.setItem("veloce_custom_teams", JSON.stringify(next));
      return next;
    });
  };

  const removeTeam = (name: string) => {
    setCustomTeams(prev => {
      const next = prev.filter(t => t.name !== name);
      localStorage.setItem("veloce_custom_teams", JSON.stringify(next));
      return next;
    });
  };

  const hideStaticTeam = (name: string) => {
    setHiddenStaticTeams(prev => {
      const next = Array.from(new Set([...prev, name]));
      localStorage.setItem("veloce_hidden_static_teams", JSON.stringify(next));
      return next;
    });
  };

  const restoreStaticTeam = (name: string) => {
    setHiddenStaticTeams(prev => {
      const next = prev.filter(n => n !== name);
      localStorage.setItem("veloce_hidden_static_teams", JSON.stringify(next));
      return next;
    });
  };

  // Helper to merge and filter
  const buildList = (staticList: [string, string][], cat: TeamData["category"]) => {
    const customList: [string, string][] = customTeams
      .filter(t => t.category === cat)
      .map(t => [t.name, t.logoUrl]);
    
    return [...staticList, ...customList].filter(([name]) => !hiddenStaticTeams.includes(name));
  };

  const combinedFootball = buildList(footballTeams, "Football");
  const combinedWC = buildList(worldCupTeams, "World Cup");
  const combinedF1 = buildList(f1Teams, "F1");
  const combinedB = buildList(basketballTeams, "Basketball");
  const combinedCricketIPL = buildList(cricketIPLTeams, "Cricket");
  const combinedCricketInt = buildList(cricketInternationalTeams, "Cricket");

  return (
    <TeamsContext.Provider value={{ 
      customTeams, hiddenStaticTeams, addTeam, removeTeam, hideStaticTeam, restoreStaticTeam,
      combinedFootball, combinedWC, combinedF1, combinedB, combinedCricketIPL, combinedCricketInt
    }}>
      {children}
    </TeamsContext.Provider>
  );
}

export function useTeams() {
  const ctx = useContext(TeamsContext);
  if (!ctx) throw new Error("useTeams must be used within TeamsProvider");
  return ctx;
}
