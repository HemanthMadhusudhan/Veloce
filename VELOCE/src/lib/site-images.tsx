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
  | "hero"
  | "film-video"
  | "worldcup-banner"
  | "category-football"
  | "category-f1"
  | "zone-messi"
  | "zone-ronaldo"
  | "zone-verstappen"
  | "zone-hamilton"
  | "promo-popup";

export const SITE_IMAGE_META: { slot: SiteImageSlot; label: string; description: string }[] = [
  {
    slot: "hero",
    label: "Homepage hero (Image or Video)",
    description: "Full-screen background image or looping video at the top of the homepage.",
  },
  {
    slot: "film-video",
    label: "Watch the Film video (Optional)",
    description: "Cinematic video played in a modal when clicking 'Watch the film'.",
  },
  {
    slot: "worldcup-banner",
    label: "World Cup banner (Image or Video)",
    description: "Editorial 'The countdown has begun' section background.",
  },
  {
    slot: "category-football",
    label: "Football category card (Image or Video)",
    description: "Homepage tile linking to /shop/football.",
  },
  {
    slot: "category-f1",
    label: "Formula 1 category card (Image or Video)",
    description: "Homepage tile linking to /shop/f1.",
  },
  {
    slot: "zone-messi",
    label: "Player Zone · Leo Messi (Image or Video)",
    description: "Background for Leo Messi's player zone card.",
  },
  {
    slot: "zone-ronaldo",
    label: "Player Zone · Cristiano Ronaldo (Image or Video)",
    description: "Background for Cristiano Ronaldo's player zone card.",
  },
  {
    slot: "zone-verstappen",
    label: "Player Zone · Max Verstappen (Image or Video)",
    description: "Background for Max Verstappen's player zone card.",
  },
  {
    slot: "zone-hamilton",
    label: "Player Zone · Lewis Hamilton (Image or Video)",
    description: "Background for Lewis Hamilton's player zone card.",
  },
  {
    slot: "promo-popup",
    label: "Promo Pop-up (Image)",
    description: "Image shown in the first-load promo modal.",
  },
];

const DEFAULTS: Record<SiteImageSlot, string> = {
  hero: "",
  "film-video": "",
  "worldcup-banner": "",
  "category-football": "",
  "category-f1": "",
  "zone-messi": "",
  "zone-ronaldo": "",
  "zone-verstappen": "",
  "zone-hamilton": "",
  "promo-popup": "",
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

let cachedSiteImagesRaw = null;
if (typeof window !== "undefined") {
  try {
    const c = localStorage.getItem("veloce_site_images_cache");
    if (c) cachedSiteImagesRaw = JSON.parse(c);
  } catch (e) {}
}

const initialOverrides: Partial<Record<SiteImageSlot, string>> = {};
const sourceData = cachedSiteImagesRaw || (defaultSiteImagesRaw as any[]);
sourceData.forEach((r: any) => {
  initialOverrides[r.slot as SiteImageSlot] = r.url;
});

export function SiteImagesProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Partial<Record<SiteImageSlot, string>>>(initialOverrides);

  // Fetch the real data from Supabase (source of truth)
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { data, error } = await supabase.from("site_images").select("slot, url");
        if (error) {
          console.warn("site_images table error:", error.message);
          return;
        }
        if (data && active) {
          const map: Partial<Record<SiteImageSlot, string>> = {};
          data.forEach((r: any) => {
            map[r.slot as SiteImageSlot] = r.url;
          });
          setOverrides(map);
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem("veloce_site_images_cache", JSON.stringify(data));
            } catch (e) {}
          }
        }
      } catch (err) {
        console.error("Failed to load site images from Supabase:", err);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const set = useCallback(async (slot: SiteImageSlot, url: string | null) => {
    setOverrides((prev) => {
      const next = { ...prev };
      if (url && url.trim()) next[slot] = url.trim();
      else delete next[slot];
      return next;
    });

    try {
      if (url && url.trim()) {
        await supabase
          .from("site_images")
          .upsert({ slot, url: url.trim(), updated_at: new Date().toISOString() });
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

  const value = useMemo<Ctx>(
    () => ({
      overrides,
      get: (slot) => overrides[slot] || DEFAULTS[slot],
      getDefault: (slot) => DEFAULTS[slot],
      set,
      reset,
    }),
    [overrides, set, reset],
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
