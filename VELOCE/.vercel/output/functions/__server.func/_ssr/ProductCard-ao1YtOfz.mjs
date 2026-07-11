import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useShop } from "./store-3dg2D_AQ.mjs";
import { a as product_4_default, i as product_3_default, n as product_1_default, r as product_2_default, t as formatINR } from "./product-4-DVDiSjDb.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Plus, l as Star, z as Heart } from "../_libs/lucide-react.mjs";
import { t as hero_bg_default } from "./hero-bg-DrT25Tbf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProductCard-ao1YtOfz.js
var import_jsx_runtime = require_jsx_runtime();
var dual_football_default = "/assets/dual-football-f-QP7LwI.jpg";
var dual_f1_default = "/assets/dual-f1-Z_nXhF0T.jpg";
var PICTURES = {
	[product_1_default]: {
		webp: product_1_default,
		jpg: product_1_default,
		src: product_1_default
	},
	[product_2_default]: {
		webp: product_2_default,
		jpg: product_2_default,
		src: product_2_default
	},
	[product_3_default]: {
		webp: product_3_default,
		jpg: product_3_default,
		src: product_3_default
	},
	[product_4_default]: {
		webp: product_4_default,
		jpg: product_4_default,
		src: product_4_default
	},
	[hero_bg_default]: {
		webp: hero_bg_default,
		jpg: hero_bg_default,
		src: hero_bg_default
	},
	[dual_football_default]: {
		webp: dual_football_default,
		jpg: dual_football_default,
		src: dual_football_default
	},
	[dual_f1_default]: {
		webp: dual_f1_default,
		jpg: dual_f1_default,
		src: dual_f1_default
	}
};
PICTURES[hero_bg_default];
PICTURES[dual_football_default];
PICTURES[dual_f1_default];
function getPicture(url) {
	return PICTURES[url];
}
/**
* Responsive <picture> wrapper. If `src` is a plain URL known to the images
* registry, it emits WebP + JPEG srcsets. Otherwise it falls back to a single
* <img> so runtime URLs (remote, generated) still render.
*/
function Picture({ src, alt, sizes = "100vw", className, imgClassName = "h-full w-full object-cover", loading = "lazy", fetchpriority, decoding = "async", aspect }) {
	if (!src) return null;
	const pic = typeof src === "string" ? getPicture(src) : src;
	const fallback = typeof src === "string" ? src : src.src;
	const style = aspect ? { aspectRatio: aspect } : void 0;
	if (!pic) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: fallback,
		alt,
		className: [imgClassName, className].filter(Boolean).join(" "),
		loading,
		decoding,
		fetchpriority,
		style
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("picture", {
		className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
				type: "image/webp",
				srcSet: pic.webp,
				sizes
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
				type: "image/jpeg",
				srcSet: pic.jpg,
				sizes
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: pic.src,
				alt,
				sizes,
				className: imgClassName,
				loading,
				decoding,
				fetchpriority,
				style
			})
		]
	});
}
var GRID_SIZES = "(min-width: 1280px) 320px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";
var LIST_SIZES = "(min-width: 640px) 160px, 128px";
function ProductCard({ p, view = "grid" }) {
	const { wishlist, toggleWishlist, addToCart } = useShop();
	const wished = wishlist.includes(p.id);
	const quickAdd = () => addToCart({
		id: p.id,
		qty: 1,
		size: p.sizes[0],
		color: p.colors[0]
	});
	if (view === "list") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative flex gap-4 rounded-2xl border border-border/40 bg-card/40 p-3 transition-colors hover:border-border sm:gap-6 sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/product/$id",
			params: { id: p.id },
			className: "relative aspect-square w-28 shrink-0 overflow-hidden rounded-xl bg-surface sm:w-40",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Picture, {
				src: p.images[0],
				alt: p.name,
				sizes: LIST_SIZES,
				imgClassName: "h-full w-full object-cover transition-transform duration-700 lg:group-hover:scale-105"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
					children: p.tag
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$id",
					params: { id: p.id },
					className: "mt-1 block truncate font-display text-lg font-semibold hover:text-brand",
					children: p.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [p.team, p.driver ? ` · ${p.driver}` : ""] }), (p.rating > 0 || p.reviews > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-brand text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: p.rating
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"(",
							p.reviews,
							")"
						] })
					] })]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-mono text-base",
					children: formatINR(p.price)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
						active: wished,
						onClick: () => toggleWishlist(p.id),
						label: "Wishlist",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: quickAdd,
						className: "inline-flex h-9 items-center gap-1 rounded-full bg-foreground px-4 text-xs font-semibold text-background transition hover:bg-brand hover:text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Add"]
					})]
				})]
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative bg-white pb-3 flex flex-col shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/product/$id",
			params: { id: p.id },
			className: "relative block aspect-[4/5] overflow-hidden bg-gray-100",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Picture, {
					src: p.images[0],
					alt: p.name,
					sizes: GRID_SIZES,
					className: "absolute inset-0 h-full w-full",
					imgClassName: "h-full w-full object-cover transition-transform duration-[900ms] ease-out lg:group-hover:scale-[1.06]"
				}),
				p.images[1] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Picture, {
					src: p.images[1],
					alt: "",
					sizes: GRID_SIZES,
					className: "absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 hidden lg:block lg:group-hover:opacity-100",
					imgClassName: "h-full w-full object-cover"
				}),
				p.compareAt && p.compareAt > p.price && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "absolute left-3 top-3 rounded-full bg-[#E51E4E] px-2 py-0.5 text-[9px] font-bold text-white z-10 shadow-sm",
					children: [
						"Save ",
						Math.round((1 - p.price / p.compareAt) * 100),
						"%"
					]
				}),
				p.stock === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-x-0 bottom-4 flex justify-center z-10 pointer-events-none",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bg-[#b5ff14]/90 backdrop-blur text-black text-[10px] sm:text-xs font-bold px-4 py-1.5 border border-black/10",
						children: "SOLD OUT"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: (e) => {
						e.preventDefault();
						quickAdd();
					},
					className: "absolute right-0 bottom-0 bg-[#b5ff14] p-2.5 z-20 hover:bg-[#a3eb12] transition shadow-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
						className: "w-4 h-4 sm:w-5 sm:h-5 text-black",
						fill: "none",
						viewBox: "0 0 24 24",
						stroke: "currentColor",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
							strokeLinecap: "round",
							strokeLinejoin: "round",
							strokeWidth: 1.5,
							d: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
						})
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex flex-col items-center px-2 text-center bg-white",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$id",
					params: { id: p.id },
					className: "block text-[11px] sm:text-xs text-black font-medium leading-snug hover:text-gray-700",
					children: p.name
				}),
				(p.rating > 0 || p.reviews > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex items-center justify-center gap-1 text-[9px] sm:text-[10px] text-gray-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-2.5 w-2.5 sm:h-3 sm:w-3 fill-brand text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-black",
							children: p.rating
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"(",
						p.reviews,
						")"
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1.5 flex flex-wrap items-center justify-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[12px] sm:text-[13px] text-[#E51E4E]",
						children: [
							"Rs. ",
							p.price.toLocaleString("en-IN"),
							".00"
						]
					}), p.compareAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[10px] sm:text-[11px] text-gray-500 relative inline-block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "invisible",
								children: [
									"Rs. ",
									p.compareAt.toLocaleString("en-IN"),
									".00"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute inset-0 flex items-center justify-center",
								children: [
									"Rs. ",
									p.compareAt.toLocaleString("en-IN"),
									".00"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-0 right-0 h-px bg-[#E51E4E] rotate-[-8deg] origin-center opacity-80" })
						]
					})]
				})
			]
		})]
	});
}
function IconBtn({ children, onClick, active, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		"aria-label": label,
		onClick,
		className: `flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border backdrop-blur transition ${active ? "border-brand bg-brand text-foreground" : "border-white/20 bg-background/60 text-foreground hover:border-white/50"}`,
		children
	});
}
//#endregion
export { ProductCard as n, Picture as t };
