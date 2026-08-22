import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface HomepageFeaturedCategories {
  football: string[];
  cricket: string[];
  f1: string[];
  basketball: string[];
}

const DEFAULT_STATE: HomepageFeaturedCategories = {
  football: [],
  cricket: [],
  f1: [],
  basketball: [],
};

const STORAGE_KEY = "veloce_homepage_featured";

let globalState: HomepageFeaturedCategories = (() => {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
  }
  return DEFAULT_STATE;
})();

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((l) => l());
}

export function useHomepageFeatured() {
  const [featured, setFeatured] = useState<HomepageFeaturedCategories>(globalState);
  const [loaded, setLoaded] = useState(() => {
    if (typeof window !== "undefined") {
      return !!localStorage.getItem(STORAGE_KEY);
    }
    return false;
  });

  useEffect(() => {
    const handler = () => {
      setFeatured({ ...globalState });
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "homepage_featured")
          .maybeSingle();

        if (data?.value) {
          const val = data.value as HomepageFeaturedCategories;
          globalState = {
            football: Array.isArray(val.football) ? val.football : [],
            cricket: Array.isArray(val.cricket) ? val.cricket : [],
            f1: Array.isArray(val.f1) ? val.f1 : [],
            basketball: Array.isArray(val.basketball) ? val.basketball : [],
          };
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
            } catch {}
          }
          notify();
        }
      } catch (err) {
        console.error("Failed to load homepage featured products:", err);
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  const updateCategoryFeatured = useCallback(
    async (category: keyof HomepageFeaturedCategories, productIds: string[]) => {
      const limited = productIds.slice(0, 12);
      const nextState: HomepageFeaturedCategories = {
        ...globalState,
        [category]: limited,
      };
      globalState = nextState;
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
        } catch {}
      }
      notify();

      try {
        const { error } = await supabase
          .from("site_settings")
          .upsert({ key: "homepage_featured", value: nextState }, { onConflict: "key" });
        if (error) {
          console.error("Supabase upsert error for homepage_featured:", error);
        }
      } catch (err) {
        console.error("Failed to save homepage featured:", err);
      }
    },
    []
  );

  return {
    featured,
    updateCategoryFeatured,
    loaded,
  };
}
