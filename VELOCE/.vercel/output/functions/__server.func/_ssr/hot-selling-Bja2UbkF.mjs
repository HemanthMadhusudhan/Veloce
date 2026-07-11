import { r as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hot-selling-Bja2UbkF.js
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
var DROPS_KEY = "veloce.admin.drops.v1";
var HOT_SELLING_KEY = "veloce_hot_selling";
function useHotSelling() {
	const [hotSellingIds, setHotSellingIds] = (0, import_react.useState)([]);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(HOT_SELLING_KEY);
			if (raw) setHotSellingIds(JSON.parse(raw));
		} catch {}
		setLoaded(true);
	}, []);
	const setIds = (ids) => {
		const limited = ids.slice(0, 7);
		setHotSellingIds(limited);
		try {
			localStorage.setItem(HOT_SELLING_KEY, JSON.stringify(limited));
		} catch {}
	};
	return {
		hotSellingIds,
		setHotSellingIds: setIds,
		loaded
	};
}
//#endregion
export { DROPS_KEY as n, useHotSelling as r, DEFAULT_DROPS as t };
