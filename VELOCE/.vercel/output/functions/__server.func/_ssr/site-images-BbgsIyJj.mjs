import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DS8gFNjW.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-images-BbgsIyJj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var default_site_images_default = [
	{
		"slot": "worldcup-banner",
		"url": "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/worldcup-banner/1783372056920.mp4"
	},
	{
		"slot": "zone-messi",
		"url": "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/zone-messi/1783527504100.webp"
	},
	{
		"slot": "zone-verstappen",
		"url": "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/zone-verstappen/1783527465310.webp"
	},
	{
		"slot": "zone-ronaldo",
		"url": "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/zone-ronaldo/1783527400738.webp"
	},
	{
		"slot": "zone-hamilton",
		"url": "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/zone-hamilton/1783527487266.webp"
	},
	{
		"slot": "category-football",
		"url": "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/category-football/1783528137168.webp"
	},
	{
		"slot": "category-f1",
		"url": "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/category-f1/1783528159835.webp"
	},
	{
		"slot": "hero",
		"url": "https://gyxjytykxzivbtmymtek.supabase.co/storage/v1/object/public/site-images/hero/1783528586878.webp"
	}
];
var SITE_IMAGE_META = [
	{
		slot: "hero",
		label: "Homepage hero (Image or Video)",
		description: "Full-screen background image or looping video at the top of the homepage."
	},
	{
		slot: "film-video",
		label: "Watch the Film video (Optional)",
		description: "Cinematic video played in a modal when clicking 'Watch the film'."
	},
	{
		slot: "worldcup-banner",
		label: "World Cup banner (Image or Video)",
		description: "Editorial 'The countdown has begun' section background."
	},
	{
		slot: "category-football",
		label: "Football category card (Image or Video)",
		description: "Homepage tile linking to /shop/football."
	},
	{
		slot: "category-f1",
		label: "Formula 1 category card (Image or Video)",
		description: "Homepage tile linking to /shop/f1."
	},
	{
		slot: "zone-messi",
		label: "Player Zone · Leo Messi (Image or Video)",
		description: "Background for Leo Messi's player zone card."
	},
	{
		slot: "zone-ronaldo",
		label: "Player Zone · Cristiano Ronaldo (Image or Video)",
		description: "Background for Cristiano Ronaldo's player zone card."
	},
	{
		slot: "zone-verstappen",
		label: "Player Zone · Max Verstappen (Image or Video)",
		description: "Background for Max Verstappen's player zone card."
	},
	{
		slot: "zone-hamilton",
		label: "Player Zone · Lewis Hamilton (Image or Video)",
		description: "Background for Lewis Hamilton's player zone card."
	},
	{
		slot: "promo-popup",
		label: "Promo Pop-up (Image)",
		description: "Image shown in the first-load promo modal."
	}
];
var DEFAULTS = {
	hero: "",
	"film-video": "",
	"worldcup-banner": "",
	"category-football": "",
	"category-f1": "",
	"zone-messi": "",
	"zone-ronaldo": "",
	"zone-verstappen": "",
	"zone-hamilton": "",
	"promo-popup": ""
};
var C = (0, import_react.createContext)(null);
/**
* Upload a file to the Supabase Storage `site-images` bucket.
* Returns the public URL of the uploaded file.
*/
async function uploadSiteImageFile(slot, file) {
	const ext = file.name.split(".").pop() || "bin";
	const filePath = `${slot}/${Date.now()}.${ext}`;
	try {
		const { data: existing } = await supabase.storage.from("site-images").list(slot);
		if (existing && existing.length > 0) {
			const toRemove = existing.map((f) => `${slot}/${f.name}`);
			await supabase.storage.from("site-images").remove(toRemove);
		}
	} catch {}
	const { error } = await supabase.storage.from("site-images").upload(filePath, file, {
		cacheControl: "3600",
		upsert: true
	});
	if (error) throw new Error(`Upload failed: ${error.message}`);
	const { data: urlData } = supabase.storage.from("site-images").getPublicUrl(filePath);
	return urlData.publicUrl;
}
var cachedSiteImagesRaw = null;
if (typeof window !== "undefined") try {
	const c = localStorage.getItem("veloce_site_images_cache");
	if (c) cachedSiteImagesRaw = JSON.parse(c);
} catch (e) {}
var initialOverrides = {};
(cachedSiteImagesRaw || default_site_images_default).forEach((r) => {
	initialOverrides[r.slot] = r.url;
});
function SiteImagesProvider({ children }) {
	const [overrides, setOverrides] = (0, import_react.useState)(initialOverrides);
	(0, import_react.useEffect)(() => {
		let active = true;
		async function load() {
			try {
				const { data, error } = await supabase.from("site_images").select("slot, url");
				if (error) {
					console.warn("site_images table error:", error.message);
					return;
				}
				if (data && active) {
					const map = {};
					data.forEach((r) => {
						map[r.slot] = r.url;
					});
					setOverrides(map);
					if (typeof window !== "undefined") try {
						localStorage.setItem("veloce_site_images_cache", JSON.stringify(data));
					} catch (e) {}
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
	const set = (0, import_react.useCallback)(async (slot, url) => {
		setOverrides((prev) => {
			const next = { ...prev };
			if (url && url.trim()) next[slot] = url.trim();
			else delete next[slot];
			return next;
		});
		try {
			if (url && url.trim()) await supabase.from("site_images").upsert({
				slot,
				url: url.trim(),
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			});
			else {
				await supabase.from("site_images").delete().eq("slot", slot);
				try {
					const { data: existing } = await supabase.storage.from("site-images").list(slot);
					if (existing && existing.length > 0) await supabase.storage.from("site-images").remove(existing.map((f) => `${slot}/${f.name}`));
				} catch {}
			}
		} catch (err) {
			console.error("Failed to persist site image update to Supabase:", err);
		}
	}, []);
	const reset = (0, import_react.useCallback)(async () => {
		setOverrides({});
		try {
			const { data } = await supabase.from("site_images").select("slot");
			if (data) await Promise.all(data.map((r) => supabase.from("site_images").delete().eq("slot", r.slot)));
			for (const meta of SITE_IMAGE_META) try {
				const { data: files } = await supabase.storage.from("site-images").list(meta.slot);
				if (files && files.length > 0) await supabase.storage.from("site-images").remove(files.map((f) => `${meta.slot}/${f.name}`));
			} catch {}
		} catch (err) {
			console.error("Failed to reset site images in Supabase:", err);
		}
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		overrides,
		get: (slot) => overrides[slot] || DEFAULTS[slot],
		getDefault: (slot) => DEFAULTS[slot],
		set,
		reset
	}), [
		overrides,
		set,
		reset
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(C.Provider, {
		value,
		children
	});
}
function useSiteImages() {
	const v = (0, import_react.useContext)(C);
	if (!v) throw new Error("useSiteImages must be inside SiteImagesProvider");
	return v;
}
function useSiteImage(slot) {
	return useSiteImages().get(slot);
}
//#endregion
export { useSiteImages as a, useSiteImage as i, SiteImagesProvider as n, uploadSiteImageFile as r, SITE_IMAGE_META as t };
