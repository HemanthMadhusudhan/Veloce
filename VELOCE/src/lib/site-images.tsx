import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import dualFootball from "@/assets/dual-football.jpg";
import dualF1 from "@/assets/dual-f1.jpg";
import defaultSiteImagesRaw from "./default-site-images.json";

export type SiteImageSlot =
  | "hero-video-pc"
  | "hero-video-mobile"
  | "hero-video-mobile-1"
  | "hero-video-mobile-2"
  | "hero-video-mobile-3"
  | "hero-video-mobile-4"
  | "hero-video-mobile-5"
  | "hero-video"
  | "featured-1-pc"
  | "featured-1-mobile"
  | "featured-1"
  | "featured-2-pc"
  | "featured-2-mobile"
  | "featured-2";

export const SITE_IMAGE_META: { slot: SiteImageSlot; label: string; description: string }[] = [
  {
    slot: "hero-video-pc",
    label: "1. Main Hero Banner - PC / Desktop (MP4 Video or Image)",
    description: "Featured top video or photo background on desktop/PC homepage Hero section.",
  },
  {
    slot: "hero-video-mobile",
    label: "2. Mobile Hero Banner 1 (MP4 Video or Image)",
    description: "Slide 1 in the 5-banner mobile carousel (New Kits Campaign).",
  },
  {
    slot: "hero-video-mobile-2",
    label: "3. Mobile Hero Banner 2 (MP4 Video or Image)",
    description: "Slide 2 in the 5-banner mobile carousel (Football Kits).",
  },
  {
    slot: "hero-video-mobile-3",
    label: "4. Mobile Hero Banner 3 (MP4 Video or Image)",
    description: "Slide 3 in the 5-banner mobile carousel (Formula 1 Tees).",
  },
  {
    slot: "hero-video-mobile-4",
    label: "5. Mobile Hero Banner 4 (MP4 Video or Image)",
    description: "Slide 4 in the 5-banner mobile carousel (Cricket Matchwear).",
  },
  {
    slot: "hero-video-mobile-5",
    label: "6. Mobile Hero Banner 5 (MP4 Video or Image)",
    description: "Slide 5 in the 5-banner mobile carousel (Player Version Kits).",
  },
  {
    slot: "featured-1-pc",
    label: "7. Featured Banner 1 - Left (PC / Desktop) (MP4 Video or Image)",
    description: "First featured card below Hero section on desktop/PC (Formula 1 Store).",
  },
  {
    slot: "featured-1-mobile",
    label: "8. Featured Banner 1 - Left (Mobile) (MP4 Video or Image)",
    description: "First featured card below Hero section on mobile/tablet (Formula 1 Store).",
  },
  {
    slot: "featured-2-pc",
    label: "9. Featured Banner 2 - Right (PC / Desktop) (MP4 Video or Image)",
    description: "Second featured card below Hero section on desktop/PC (Football Kits).",
  },
  {
    slot: "featured-2-mobile",
    label: "10. Featured Banner 2 - Right (Mobile) (MP4 Video or Image)",
    description: "Second featured card below Hero section on mobile/tablet (Football Kits).",
  },
];

const DEFAULTS: Record<SiteImageSlot, string> = {
  "hero-video-pc": "",
  "hero-video-mobile": "",
  "hero-video-mobile-1": "",
  "hero-video-mobile-2": "",
  "hero-video-mobile-3": "",
  "hero-video-mobile-4": "",
  "hero-video-mobile-5": "",
  "hero-video": "",
  "featured-1-pc": "",
  "featured-1-mobile": "",
  "featured-1": "",
  "featured-2-pc": "",
  "featured-2-mobile": "",
  "featured-2": "",
};

const CACHE_KEY = "veloce.admin.site-images.v1";

type Ctx = {
  get: (slot: SiteImageSlot) => string;
  getDefault: (slot: SiteImageSlot) => string;
  set: (slot: SiteImageSlot, url: string | null) => void;
  reset: () => void;
  overrides: Partial<Record<SiteImageSlot, string>>;
};

const C = createContext<Ctx | null>(null);

/**
 * Upload a file to the Supabase Storage `site-images` bucket.
 * Returns the public URL of the uploaded file.
 */
export async function uploadSiteImageFile(slot: SiteImageSlot, file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const filePath = `${slot}/${Date.now()}.${ext}`;

  // Remove old files for this slot first
  try {
    const { data: existing } = await supabase.storage.from("site-images").list(slot);
    if (existing && existing.length > 0) {
      const toRemove = existing.map((f) => `${slot}/${f.name}`);
      await supabase.storage.from("site-images").remove(toRemove);
    }
  } catch {
    // ignore cleanup errors
  }

  const { error } = await supabase.storage.from("site-images").upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });
  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = supabase.storage.from("site-images").getPublicUrl(filePath);
  return urlData.publicUrl;
}

function buildInitialMap(): Partial<Record<SiteImageSlot, string>> {
  const map: Partial<Record<SiteImageSlot, string>> = {};
  if (Array.isArray(defaultSiteImagesRaw)) {
    defaultSiteImagesRaw.forEach((r: any) => {
      if (r?.slot && r?.url) map[r.slot as SiteImageSlot] = r.url;
    });
  }
  if (typeof window !== "undefined") {
    try {
      const c = localStorage.getItem("veloce_site_images_cache");
      if (c) {
        const parsed = JSON.parse(c);
        if (Array.isArray(parsed)) {
          parsed.forEach((r: any) => {
            if (r?.slot && r?.url) map[r.slot as SiteImageSlot] = r.url;
          });
        }
      }
    } catch (e) {}
  }
  return map;
}

export function SiteImagesProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Partial<Record<SiteImageSlot, string>>>(buildInitialMap);

  const loadFromSupabase = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("site_images").select("slot, url");
      if (error) {
        console.warn("site_images table error:", error.message);
        return;
      }
      if (data && data.length > 0) {
        setOverrides((prev) => {
          const next = { ...prev };
          data.forEach((r: any) => {
            if (r?.slot && r?.url) next[r.slot as SiteImageSlot] = r.url;
          });
          return next;
        });
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem("veloce_site_images_cache", JSON.stringify(data));
          } catch (e) {}
        }
      }
    } catch (err) {
      console.error("Failed to load site images from Supabase:", err);
    }
  }, []);

  // Fetch the real data from Supabase and subscribe to realtime updates
  useEffect(() => {
    loadFromSupabase();

    const channel = supabase
      .channel("public:site_images_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_images" },
        () => {
          loadFromSupabase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadFromSupabase]);

  const set = useCallback(async (slot: SiteImageSlot, url: string | null) => {
    const cleanUrl = url && url.trim() ? url.trim() : null;

    setOverrides((prev) => {
      const next = { ...prev };
      if (cleanUrl) next[slot] = cleanUrl;
      else delete next[slot];

      if (typeof window !== "undefined") {
        try {
          const list = Object.entries(next).map(([s, u]) => ({ slot: s, url: u }));
          localStorage.setItem("veloce_site_images_cache", JSON.stringify(list));
        } catch (e) {}
      }

      return next;
    });

    try {
      if (cleanUrl) {
        await supabase
          .from("site_images")
          .upsert({ slot, url: cleanUrl, updated_at: new Date().toISOString() });
      } else {
        await supabase.from("site_images").delete().eq("slot", slot);
        // Also clean up storage files for this slot
        try {
          const { data: existing } = await supabase.storage.from("site-images").list(slot);
          if (existing && existing.length > 0) {
            await supabase.storage
              .from("site-images")
              .remove(existing.map((f) => `${slot}/${f.name}`));
          }
        } catch {}
      }
    } catch (err) {
      console.error("Failed to persist site image update to Supabase:", err);
    }
  }, []);

  const reset = useCallback(async () => {
    setOverrides({});
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("veloce_site_images_cache");
      } catch (e) {}
    }
    try {
      // Delete all rows from site_images table
      const { data } = await supabase.from("site_images").select("slot");
      if (data) {
        await Promise.all(
          data.map((r: any) => supabase.from("site_images").delete().eq("slot", r.slot)),
        );
      }
      // Delete all files from storage bucket
      for (const meta of SITE_IMAGE_META) {
        try {
          const { data: files } = await supabase.storage.from("site-images").list(meta.slot);
          if (files && files.length > 0) {
            await supabase.storage
              .from("site-images")
              .remove(files.map((f) => `${meta.slot}/${f.name}`));
          }
        } catch {}
      }
    } catch (err) {
      console.error("Failed to reset site images in Supabase:", err);
    }
  }, []);

  const get = useCallback(
    (slot: SiteImageSlot): string => {
      if (overrides[slot]) return overrides[slot]!;

      // Direct fallback aliases if slot variations are queried
      if (slot === "hero-video-pc" || slot === "hero-video") {
        return overrides["hero-video-pc"] || overrides["hero-video"] || DEFAULTS[slot] || "";
      }
      if (slot === "hero-video-mobile" || slot === "hero-video-mobile-1") {
        return overrides["hero-video-mobile"] || overrides["hero-video-mobile-1"] || overrides["hero-video"] || DEFAULTS[slot] || "";
      }
      if (slot === "hero-video-mobile-2") {
        return overrides["hero-video-mobile-2"] || DEFAULTS[slot] || "";
      }
      if (slot === "hero-video-mobile-3") {
        return overrides["hero-video-mobile-3"] || DEFAULTS[slot] || "";
      }
      if (slot === "hero-video-mobile-4") {
        return overrides["hero-video-mobile-4"] || DEFAULTS[slot] || "";
      }
      if (slot === "hero-video-mobile-5") {
        return overrides["hero-video-mobile-5"] || DEFAULTS[slot] || "";
      }
      if (slot === "featured-1-pc" || slot === "featured-1") {
        return overrides["featured-1-pc"] || overrides["featured-1"] || DEFAULTS[slot] || "";
      }
      if (slot === "featured-1-mobile") {
        return overrides["featured-1-mobile"] || overrides["featured-1"] || DEFAULTS[slot] || "";
      }
      if (slot === "featured-2-pc" || slot === "featured-2") {
        return overrides["featured-2-pc"] || overrides["featured-2"] || DEFAULTS[slot] || "";
      }
      if (slot === "featured-2-mobile") {
        return overrides["featured-2-mobile"] || overrides["featured-2"] || DEFAULTS[slot] || "";
      }

      return DEFAULTS[slot] || "";
    },
    [overrides]
  );

  const value = useMemo<Ctx>(
    () => ({
      overrides,
      get,
      getDefault: (slot) => DEFAULTS[slot],
      set,
      reset,
    }),
    [overrides, get, set, reset],
  );

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useSiteImages() {
  const v = useContext(C);
  if (!v) throw new Error("useSiteImages must be inside SiteImagesProvider");
  return v;
}

export function useSiteImage(slot: SiteImageSlot) {
  return useSiteImages().get(slot);
}
