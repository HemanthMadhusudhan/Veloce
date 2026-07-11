import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DEHV6YAt.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-store-DJUqMBkv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var C = (0, import_react.createContext)(null);
var LIVE = [];
var listeners = [];
function getLiveProduct(id) {
	return LIVE.find((p) => p.id === id);
}
function mapDbRowToProduct(r) {
	return {
		id: r.id,
		name: r.name,
		category: r.category,
		series: r.series || void 0,
		zone: r.zone || void 0,
		team: r.team,
		driver: r.driver || void 0,
		tag: r.tag,
		price: Number(r.price),
		compareAt: r.compare_at ? Number(r.compare_at) : void 0,
		badge: r.badge || void 0,
		colors: r.colors || [],
		sizes: r.sizes || [],
		images: r.images || [],
		description: r.description,
		material: r.material,
		rating: Number(r.rating || 5),
		reviews: Number(r.reviews || 0),
		stock: Number(r.stock || 0),
		stockBySize: r.stock_by_size || void 0,
		hasVideo: r.has_video || false,
		has360: r.has_360 || false
	};
}
function mapProductToDbRow(p) {
	return {
		id: p.id,
		name: p.name,
		category: p.category,
		series: p.series || null,
		zone: p.zone || null,
		team: p.team,
		driver: p.driver || null,
		tag: p.tag,
		price: p.price,
		compare_at: p.compareAt || null,
		badge: p.badge || null,
		colors: p.colors,
		sizes: p.sizes,
		images: p.images,
		description: p.description,
		material: p.material,
		rating: p.rating,
		reviews: p.reviews,
		stock: p.stock,
		stock_by_size: p.stockBySize || null,
		has_video: p.hasVideo || false,
		has_360: p.has360 || false
	};
}
function CatalogProvider({ children }) {
	const [products, setProducts] = (0, import_react.useState)([]);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	const refresh = (0, import_react.useCallback)(async () => {
		try {
			const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			const mapped = (data || []).map(mapDbRowToProduct);
			setProducts(mapped);
			LIVE = mapped;
			listeners.forEach((l) => l());
		} catch (e) {
			console.error("Failed to load products from Supabase:", e);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		refresh().then(() => setLoaded(true));
	}, [refresh]);
	const value = {
		products,
		getById: (id) => products.find((p) => p.id === id),
		updateProduct: (0, import_react.useCallback)(async (id, patch) => {
			try {
				const dbPatch = {};
				if (patch.name !== void 0) dbPatch.name = patch.name;
				if (patch.price !== void 0) dbPatch.price = patch.price;
				if (patch.compareAt !== void 0) dbPatch.compare_at = patch.compareAt;
				if (patch.stock !== void 0) dbPatch.stock = patch.stock;
				if (patch.stockBySize !== void 0) dbPatch.stock_by_size = patch.stockBySize;
				if (patch.badge !== void 0) dbPatch.badge = patch.badge;
				if (patch.tag !== void 0) dbPatch.tag = patch.tag;
				if (patch.images !== void 0) dbPatch.images = patch.images;
				if (patch.description !== void 0) dbPatch.description = patch.description;
				if (patch.team !== void 0) dbPatch.team = patch.team;
				if (patch.colors !== void 0) dbPatch.colors = patch.colors;
				if (patch.sizes !== void 0) dbPatch.sizes = patch.sizes;
				if (patch.material !== void 0) dbPatch.material = patch.material;
				if (patch.rating !== void 0) dbPatch.rating = patch.rating;
				if (patch.reviews !== void 0) dbPatch.reviews = patch.reviews;
				const { error } = await supabase.from("products").update(dbPatch).eq("id", id);
				if (error) throw error;
				await refresh();
			} catch (e) {
				console.error("Failed to update product in Supabase:", e);
				throw e;
			}
		}, [refresh]),
		addProduct: (0, import_react.useCallback)(async (p) => {
			try {
				const dbRow = mapProductToDbRow(p);
				const { error } = await supabase.from("products").insert(dbRow);
				if (error) throw error;
				await refresh();
			} catch (e) {
				console.error("Failed to add product to Supabase:", e);
				throw e;
			}
		}, [refresh]),
		removeProduct: (0, import_react.useCallback)(async (id) => {
			try {
				const { error } = await supabase.from("products").delete().eq("id", id);
				if (error) throw error;
				await refresh();
			} catch (e) {
				console.error("Failed to remove product from Supabase:", e);
				throw e;
			}
		}, [refresh]),
		refresh
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(C.Provider, {
		value,
		children
	});
}
function useCatalog() {
	const v = (0, import_react.useContext)(C);
	if (!v) throw new Error("useCatalog must be inside CatalogProvider");
	return v;
}
//#endregion
export { getLiveProduct as n, useCatalog as r, CatalogProvider as t };
