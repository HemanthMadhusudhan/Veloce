import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { r as useCatalog } from "./catalog-store-DJUqMBkv.mjs";
import { r as ZONES } from "./catalog-ChwsJiyw.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as SiteChrome } from "./chrome-LNFqOEFI.mjs";
import { n as ProductCard } from "./ProductCard-ao1YtOfz.mjs";
import { t as Route } from "./zone._slug-BdCV9az9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/zone._slug-C3GDw5je.js
var import_jsx_runtime = require_jsx_runtime();
function ZonePage() {
	const { zone } = Route.useLoaderData();
	const { products } = useCatalog();
	const items = products.filter((p) => p.zone === zone.slug);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-6 pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-[10px] uppercase tracking-[0.28em] text-brand",
				children: ["Zone · ", zone.category === "f1" ? "The Paddock" : "The Pitch"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-2 font-display text-5xl font-bold tracking-tight sm:text-7xl",
				children: [zone.name, "."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 max-w-xl text-sm text-muted-foreground",
				children: [
					zone.tagline,
					" — a curated capsule of ",
					zone.name,
					"'s most collected pieces on Veloce."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: ZONES.filter((z) => z.slug !== zone.slug).map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/zone/$slug",
					params: { slug: z.slug },
					className: "rounded-full border border-border/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:border-foreground hover:text-foreground",
					children: z.name
				}, z.slug))
			}),
			items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-16 text-center text-sm text-muted-foreground",
				children: "No pieces in this zone yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4",
				children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p }, p.id))
			})
		]
	}) });
}
//#endregion
export { ZonePage as component };
