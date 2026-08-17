import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useNewKits() {
  const [newKitsIds, setNewKitsIds] = useState<string[]>(() => {
    try {
      const cached = localStorage.getItem("veloce_new_kits");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });
  const [loaded, setLoaded] = useState(() => {
    return !!localStorage.getItem("veloce_new_kits");
  });

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "new_kits")
          .maybeSingle();

        if (data?.value) {
          setNewKitsIds(data.value as string[]);
          localStorage.setItem("veloce_new_kits", JSON.stringify(data.value));
        }
      } catch (err) {
        console.error("Failed to load new kits:", err);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  const setIds = async (ids: string[]) => {
    const limited = ids.slice(0, 100);
    setNewKitsIds(limited);
    try {
      await supabase.from("site_settings").upsert({ key: "new_kits", value: limited });
    } catch (err) {
      console.error("Failed to save new kits:", err);
    }
  };

  return { newKitsIds, setNewKitsIds: setIds, loaded };
}
