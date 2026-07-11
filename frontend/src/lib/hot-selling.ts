import { useState, useEffect } from "react";

export const HOT_SELLING_KEY = "veloce_hot_selling";

export function useHotSelling() {
  const [hotSellingIds, setHotSellingIds] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HOT_SELLING_KEY);
      if (raw) setHotSellingIds(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  const setIds = (ids: string[]) => {
    const limited = ids.slice(0, 7);
    setHotSellingIds(limited);
    try {
      localStorage.setItem(HOT_SELLING_KEY, JSON.stringify(limited));
    } catch {}
  };

  return { hotSellingIds, setHotSellingIds: setIds, loaded };
}
