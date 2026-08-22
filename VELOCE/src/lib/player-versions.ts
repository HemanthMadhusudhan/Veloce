import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function usePlayerVersions() {
  const [playerVersionIds, setPlayerVersionIds] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem("veloce_player_versions");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loaded, setLoaded] = useState(() => {
    return !!localStorage.getItem("veloce_player_versions");
  });

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "player_versions")
          .maybeSingle();

        if (data?.value) {
          setPlayerVersionIds(data.value as string[]);
          localStorage.setItem("veloce_player_versions", JSON.stringify(data.value));
        }
      } catch (err) {
        console.error("Failed to load player versions:", err);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  const setIds = async (ids: string[]) => {
    const limited = ids.slice(0, 150);
    setPlayerVersionIds(limited);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("veloce_player_versions", JSON.stringify(limited));
      } catch (e) {}
    }
    try {
      await supabase.from("site_settings").upsert({ key: "player_versions", value: limited });
    } catch (err) {
      console.error("Failed to save player versions:", err);
    }
  };

  return { playerVersionIds, setPlayerVersionIds: setIds, loaded };
}
