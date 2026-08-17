import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { f1Teams, basketballTeams, cricketIPLTeams, cricketInternationalTeams, footballTeams, worldCupTeams } from "./logos";
import { supabase } from "@/integrations/supabase/client";

export type TeamData = {
  name: string;
  logoUrl: string;
  category: "World Cup" | "Football" | "F1" | "Basketball" | "Cricket" | "Hidden";
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
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase.from("teams").select("*");
        if (error && error.code !== "42P01") {
          console.error("Failed to fetch teams:", error);
          return;
        }
        if (data) {
          const custom = data.filter((t: any) => t.is_custom).map((t: any) => ({ name: t.name, logoUrl: t.logo_url, category: t.category as any }));
          const hidden = data.filter((t: any) => t.is_hidden).map((t: any) => t.name);
          setCustomTeams(custom);
          setHiddenStaticTeams(hidden);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeams();
  }, []);

  const addTeam = async (team: TeamData) => {
    setCustomTeams(prev => prev.filter(t => t.name !== team.name).concat(team));
    setHiddenStaticTeams(prev => prev.filter(n => n !== team.name));
    try {
      await supabase.from("teams").upsert({ name: team.name, logo_url: team.logoUrl, category: team.category, is_custom: true, is_hidden: false }, { onConflict: "name" });
    } catch (err) {
      console.error(err);
    }
  };

  const removeTeam = async (name: string) => {
    setCustomTeams(prev => prev.filter(t => t.name !== name));
    try {
      await supabase.from("teams").delete().eq("name", name).eq("is_custom", true);
    } catch (err) {
      console.error(err);
    }
  };

  const hideStaticTeam = async (name: string) => {
    setHiddenStaticTeams(prev => Array.from(new Set([...prev, name])));
    try {
      await supabase.from("teams").upsert({ name, is_hidden: true, is_custom: false, category: "Hidden" }, { onConflict: "name" });
    } catch (err) {
      console.error(err);
    }
  };

  const restoreStaticTeam = async (name: string) => {
    setHiddenStaticTeams(prev => prev.filter(n => n !== name));
    try {
      await supabase.from("teams").delete().eq("name", name).eq("is_hidden", true);
    } catch (err) {
      console.error(err);
    }
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
