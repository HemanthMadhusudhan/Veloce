import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { t as ShopProvider } from "./store-3dg2D_AQ.mjs";
import { t as CatalogProvider } from "./catalog-store-DJUqMBkv.mjs";
import { i as useSiteImage, n as SiteImagesProvider } from "./site-images-DJGASOV0.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as X, u as Sparkles } from "../_libs/lucide-react.mjs";
import { t as Route$14 } from "./info._page-CdsHUCzV.mjs";
import { t as Route$15 } from "./product._id-DXxBar_t.mjs";
import { t as Route$16 } from "./shop-BqYSAwcg.mjs";
import { t as Route$17 } from "./zone._slug-BdCV9az9.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DOarb53E.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BfISTG0R.css";
var KEY = "veloce.promo.b2g1.dismissed";
function PromoBanner() {
	const [show, setShow] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			setShow(sessionStorage.getItem(KEY) !== "1");
		} catch {
			setShow(true);
		}
	}, []);
	if (!show) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "sticky inset-x-0 top-0 z-[60] overflow-hidden border-b border-brand/40 bg-gradient-to-r from-brand/25 via-background/80 to-brand/25 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-foreground sm:gap-3 sm:px-4 sm:py-2 sm:text-[11px] sm:tracking-[0.22em]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand/30 sm:h-6 sm:w-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 flex-1 overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex w-max animate-marquee items-center gap-8 font-mono sm:gap-12",
						children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-8 sm:gap-12",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BUY 2 GET 1 FREE" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-brand",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Code ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
										className: "text-brand",
										children: "B2G1"
									}),
									" at 3 jerseys"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-brand",
									children: "·"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Flat 50% on first order with ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "text-brand",
									children: "FIRST50"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-brand",
									children: "✕"
								})
							]
						}, i))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": "Dismiss",
					onClick: () => {
						try {
							sessionStorage.setItem(KEY, "1");
						} catch {}
						setShow(false);
					},
					className: "shrink-0 rounded-full p-1 text-foreground/70 hover:bg-white/10 hover:text-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5" })
				})
			]
		})
	});
}
function PromoPopup() {
	const [isOpen, setIsOpen] = (0, import_react.useState)(false);
	const promoImgUrl = useSiteImage("promo-popup");
	(0, import_react.useEffect)(() => {
		if (!sessionStorage.getItem("veloce_promo_seen")) {
			const timer = setTimeout(() => {
				setIsOpen(true);
			}, 1e3);
			return () => clearTimeout(timer);
		}
	}, []);
	const close = () => {
		setIsOpen(false);
		sessionStorage.setItem("veloce_promo_seen", "true");
	};
	if (!isOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[100] flex items-center justify-center bg-transparent p-4 animate-in fade-in zoom-in duration-300",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative w-[90%] max-w-[360px] overflow-hidden rounded-2xl bg-surface shadow-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: close,
				className: "absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-md hover:scale-105 transition-transform",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 font-bold" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				onClick: close,
				className: "block relative w-full aspect-[3/4]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: promoImgUrl,
					alt: "Buy 2 Get 1 Free - End of Season Sale",
					className: "absolute inset-0 h-full w-full object-cover"
				})
			})]
		})
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$13 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Veloce — Elite Football Jerseys & Formula 1 Merchandise" },
			{
				name: "description",
				content: "Veloce curates authentic match-day football kits and official Formula 1 team merchandise. Engineered precision. Cinematic detail. Delivered worldwide."
			},
			{
				name: "author",
				content: "Veloce"
			},
			{
				name: "theme-color",
				content: "#0a0a0c"
			},
			{
				property: "og:title",
				content: "Veloce — Elite Football Jerseys & Formula 1 Merchandise"
			},
			{
				property: "og:description",
				content: "Veloce curates authentic match-day football kits and official Formula 1 team merchandise. Engineered precision. Cinematic detail. Delivered worldwide."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:title",
				content: "Veloce — Elite Football Jerseys & Formula 1 Merchandise"
			},
			{
				name: "twitter:description",
				content: "Veloce curates authentic match-day football kits and official Formula 1 team merchandise. Engineered precision. Cinematic detail. Delivered worldwide."
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.svg",
				type: "image/svg+xml"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$13.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteImagesProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromoBanner, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PromoPopup, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		] }) }) })
	});
}
var $$splitComponentImporter$12 = () => import("./wishlist-D11as6so.mjs");
var Route$12 = createFileRoute("/wishlist")({
	head: () => ({ meta: [{ title: "Wishlist — Veloce" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./reset-password-By6v5-bN.mjs");
var Route$11 = createFileRoute("/reset-password")({
	head: () => ({ meta: [{ title: "Reset password - Veloce" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./profile-Btwyx6dh.mjs");
var Route$10 = createFileRoute("/profile")({
	head: () => ({ meta: [{ title: "My Account — Veloce" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./login-C1VsJBXf.mjs");
var Route$9 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Sign in — Veloce" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./checkout-mHAXxH2D.mjs");
var Route$8 = createFileRoute("/checkout")({
	head: () => ({ meta: [{ title: "Checkout — Veloce" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./admin-QqGm_bBT.mjs");
var Route$7 = createFileRoute("/admin")({
	head: () => ({ meta: [{ title: "Admin — Veloce" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./routes-MFmdJ1GS.mjs");
var Route$6 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./shop.index-CclFx9kv.mjs");
var Route$5 = createFileRoute("/shop/")({
	head: () => ({ meta: [{ title: "Shop — Veloce" }, {
		name: "description",
		content: "Shop every football jersey and Formula 1 piece in the Veloce collection."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./shop.worldcup-CbmfAlxH.mjs");
var Route$4 = createFileRoute("/shop/worldcup")({
	head: () => ({ meta: [{ title: "FIFA World Cup — Veloce" }, {
		name: "description",
		content: "Iconic FIFA World Cup jerseys. Champions editions and tournament kits, curated."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./shop.retro-DCmjOInd.mjs");
var Route$3 = createFileRoute("/shop/retro")({
	head: () => ({ meta: [{ title: "Retro Collection — Veloce" }, {
		name: "description",
		content: "Vintage football jerseys and heritage F1 pieces, reissued."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./shop.football-Dow9j9kn.mjs");
var Route$2 = createFileRoute("/shop/football")({
	head: () => ({ meta: [{ title: "Football Jerseys — Veloce" }, {
		name: "description",
		content: "Authentic match-day football kits from the world's elite clubs."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./shop.f1-CsTIcDHA.mjs");
var Route$1 = createFileRoute("/shop/f1")({
	head: () => ({ meta: [{ title: "Formula 1 — Veloce" }, {
		name: "description",
		content: "Official Formula 1 team merchandise. Paddock-grade kit, on your terms."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./auth.callback-CllNPV_l.mjs");
var Route = createFileRoute("/auth/callback")({
	head: () => ({ meta: [{ title: "Signing you in - Veloce" }, {
		name: "robots",
		content: "noindex"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var WishlistRoute = Route$12.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$13
});
var ShopRoute = Route$16.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$13
});
var ResetPasswordRoute = Route$11.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$13
});
var ProfileRoute = Route$10.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$13
});
var LoginRoute = Route$9.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$13
});
var CheckoutRoute = Route$8.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$13
});
var AdminRoute = Route$7.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$13
});
var IndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$13
});
var ShopIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => ShopRoute
});
var ZoneSlugRoute = Route$17.update({
	id: "/zone/$slug",
	path: "/zone/$slug",
	getParentRoute: () => Route$13
});
var ShopWorldcupRoute = Route$4.update({
	id: "/worldcup",
	path: "/worldcup",
	getParentRoute: () => ShopRoute
});
var ShopRetroRoute = Route$3.update({
	id: "/retro",
	path: "/retro",
	getParentRoute: () => ShopRoute
});
var ShopFootballRoute = Route$2.update({
	id: "/football",
	path: "/football",
	getParentRoute: () => ShopRoute
});
var ShopF1Route = Route$1.update({
	id: "/f1",
	path: "/f1",
	getParentRoute: () => ShopRoute
});
var ProductIdRoute = Route$15.update({
	id: "/product/$id",
	path: "/product/$id",
	getParentRoute: () => Route$13
});
var InfoPageRoute = Route$14.update({
	id: "/info/$page",
	path: "/info/$page",
	getParentRoute: () => Route$13
});
var AuthCallbackRoute = Route.update({
	id: "/auth/callback",
	path: "/auth/callback",
	getParentRoute: () => Route$13
});
var ShopRouteChildren = {
	ShopF1Route,
	ShopFootballRoute,
	ShopRetroRoute,
	ShopWorldcupRoute,
	ShopIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute,
	CheckoutRoute,
	LoginRoute,
	ProfileRoute,
	ResetPasswordRoute,
	ShopRoute: ShopRoute._addFileChildren(ShopRouteChildren),
	WishlistRoute,
	AuthCallbackRoute,
	InfoPageRoute,
	ProductIdRoute,
	ZoneSlugRoute
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
