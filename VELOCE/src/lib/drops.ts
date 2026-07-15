import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Drop = {
  id: string;
  name: string;
  eyebrow: string;
  productId: string;
  endsAt: number;
};

const DEFAULT_ENDS = Date.now() + 3 * 86400000 + 4 * 3600000;

export const DEFAULT_DROPS: Drop[] = [
  {
    id: "blackout-03",
    name: "Paris Saint-Germain Third",
    eyebrow: "Blackout Series · Vol. 03",
    productId: "psg-third",
    endsAt: DEFAULT_ENDS,
  },
  {
    id: "legends-senna",
    name: "Senna · McLaren '88",
    eyebrow: "Legends · Reissue",
    productId: "leg-senna-88",
    endsAt: DEFAULT_ENDS + 4 * 86400000,
  },
];

export function useDrops() {
  const [drops, setDrops] = useState<Drop[]>(DEFAULT_DROPS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "drops")
          .maybeSingle();

        if (data?.value) {
          setDrops(data.value as Drop[]);
        }
      } catch (err) {
        console.error("Failed to load drops:", err);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  const updateDrops = async (newDrops: Drop[]) => {
    setDrops(newDrops);
    try {
      await supabase.from("site_settings").upsert({ key: "drops", value: newDrops });
    } catch (err) {
      console.error("Failed to save drops:", err);
    }
  };

  return { drops, setDrops: updateDrops, loaded };
}
