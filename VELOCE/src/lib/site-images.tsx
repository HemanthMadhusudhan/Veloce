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
    label: "2. Main Hero Banner - Mobile (MP4 Video or Image)",
    description: "Featured top video or photo background on mobile/tablet homepage Hero section.",
  },
  {
    slot: "featured-1-pc",
    label: "3. Featured Banner 1 - Left (PC / Desktop) (MP4 Video or Image)",
    description: "First featured card below Hero section on desktop/PC (Training Apparel).",
  },
  {
    slot: "featured-1-mobile",
    label: "4. Featured Banner 1 - Left (Mobile) (MP4 Video or Image)",
    description: "First featured card below Hero section on mobile/tablet (Training Apparel).",
  },
  {
    slot: "featured-2-pc",
    label: "5. Featured Banner 2 - Right (PC / Desktop) (MP4 Video or Image)",
    description: "Second featured card below Hero section on desktop/PC (Studio Matchwear).",
  },
  {
    slot: "featured-2-mobile",
    label: "6. Featured Banner 2 - Right (Mobile) (MP4 Video or Image)",
    description: "Second featured card below Hero section on mobile/tablet (Studio Matchwear).",
  },
];

const DEFAULTS: Record<SiteImageSlot, string> = {
  "hero-video-pc": "",
  "hero-video-mobile": "",
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
