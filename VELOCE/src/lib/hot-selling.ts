import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useHotSelling() {
  const [hotSellingIds, setHotSellingIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "hot_selling")
          .maybeSingle();
          
        if (data?.value) {
          setHotSellingIds(data.value as string[]);
        }
      } catch (err) {
        console.error("Failed to load hot selling:", err);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  const setIds = async (ids: string[]) => {
    const limited = ids.slice(0, 7);
    setHotSellingIds(limited);
    try {
      await supabase
        .from("site_settings")
        .upsert({ key: "hot_selling", value: limited });
    } catch (err) {
      console.error("Failed to save hot selling:", err);
    }
  };

  return { hotSellingIds, setHotSellingIds: setIds, loaded };
}
