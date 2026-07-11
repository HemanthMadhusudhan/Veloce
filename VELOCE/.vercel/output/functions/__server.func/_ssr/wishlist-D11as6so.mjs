import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useShop } from "./store-3dg2D_AQ.mjs";
import { r as useCatalog } from "./catalog-store-DJUqMBkv.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { z as Heart } from "../_libs/lucide-react.mjs";
import { i as SiteChrome } from "./chrome-LNFqOEFI.mjs";
import { n as ProductCard } from "./ProductCard-ao1YtOfz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wishlist-D11as6so.js
var import_jsx_runtime = require_jsx_runtime();
function WishlistPage() {
	const { wishlist } = useShop();
	const { products } = useCatalog();
	const items = products.filter((p) => wishlist.includes(p.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-6 pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-[0.28em] text-brand",
				children: "Saved"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl font-bold tracking-tight sm:text-6xl",
				children: "Wishlist"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Your saved pieces. Synced across sessions on this device."
			}),
			items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-16 flex flex-col items-center gap-4 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-10 w-10 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Nothing saved yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "rounded-full bg-foreground px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-background",
						children: "Browse the collection"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4",
				children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p }, p.id))
			})
		]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishlistPage, {}) });
//#endregion
export { SplitComponent as component };
