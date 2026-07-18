import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DS8gFNjW.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hot-selling-QTu4hdTq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var DEFAULT_ENDS = Date.now() + 3 * 864e5 + 4 * 36e5;
var DEFAULT_DROPS = [{
	id: "blackout-03",
	name: "Paris Saint-Germain Third",
	eyebrow: "Blackout Series · Vol. 03",
	productId: "psg-third",
	endsAt: DEFAULT_ENDS
}, {
	id: "legends-senna",
	name: "Senna · McLaren '88",
	eyebrow: "Legends · Reissue",
	productId: "leg-senna-88",
	endsAt: DEFAULT_ENDS + 4 * 864e5
}];
function useDrops() {
	const [drops, setDrops] = (0, import_react.useState)(DEFAULT_DROPS);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		async function load() {
			try {
				const { data, error } = await supabase.from("site_settings").select("value").eq("key", "drops").maybeSingle();
				if (data?.value) setDrops(data.value);
			} catch (err) {
				console.error("Failed to load drops:", err);
			} finally {
				setLoaded(true);
			}
		}
		load();
	}, []);
	const updateDrops = async (newDrops) => {
		setDrops(newDrops);
		try {
			await supabase.from("site_settings").upsert({
				key: "drops",
				value: newDrops
			});
		} catch (err) {
			console.error("Failed to save drops:", err);
		}
	};
	return {
		drops,
		setDrops: updateDrops,
		loaded
	};
}
function useHotSelling() {
	const [hotSellingIds, setHotSellingIds] = (0, import_react.useState)([]);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		async function load() {
			try {
				const { data, error } = await supabase.from("site_settings").select("value").eq("key", "hot_selling").maybeSingle();
				if (data?.value) setHotSellingIds(data.value);
			} catch (err) {
				console.error("Failed to load hot selling:", err);
			} finally {
				setLoaded(true);
			}
		}
		load();
	}, []);
	const setIds = async (ids) => {
		const limited = ids.slice(0, 7);
		setHotSellingIds(limited);
		try {
			await supabase.from("site_settings").upsert({
				key: "hot_selling",
				value: limited
			});
		} catch (err) {
			console.error("Failed to save hot selling:", err);
		}
	};
	return {
		hotSellingIds,
		setHotSellingIds: setIds,
		loaded
	};
}
//#endregion
export { useDrops as n, useHotSelling as r, DEFAULT_DROPS as t };
