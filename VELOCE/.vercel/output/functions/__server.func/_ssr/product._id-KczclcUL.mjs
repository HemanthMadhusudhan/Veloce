import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useShop } from "./store-3dg2D_AQ.mjs";
import { r as useCatalog } from "./catalog-store-DJUqMBkv.mjs";
import { i as useSiteImage } from "./site-images-DJGASOV0.mjs";
import { t as formatINR } from "./product-4-DVDiSjDb.mjs";
import { t as CATEGORY_LABEL } from "./catalog-ChwsJiyw.mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { K as ChevronRight, a as Truck, b as RotateCw, g as ShieldCheck, l as Star, p as ShoppingBag, t as X, w as Play, z as Heart } from "../_libs/lucide-react.mjs";
import { i as SiteChrome } from "./chrome-LNFqOEFI.mjs";
import { n as ProductCard } from "./ProductCard-ao1YtOfz.mjs";
import { t as Route } from "./product._id-DXxBar_t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._id-KczclcUL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PdpPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pdp, {}) });
}
function Pdp() {
	const { id, product: seed } = Route.useLoaderData();
	const { getById, products } = useCatalog();
	const product = getById(id) ?? seed;
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl px-6 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Product not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/shop",
			className: "mt-4 inline-block text-sm text-brand",
			children: "Back to shop"
		})]
	});
	const { addToCart, toggleWishlist, wishlist } = useShop();
	const filmVideo = useSiteImage("film-video");
	const [videoOpen, setVideoOpen] = (0, import_react.useState)(false);
	const [active, setActive] = (0, import_react.useState)(0);
	const [color, setColor] = (0, import_react.useState)(product.colors[0]);
	const [size, setSize] = (0, import_react.useState)(product.sizes[0]);
	const [qty, setQty] = (0, import_react.useState)(1);
	const [zoom, setZoom] = (0, import_react.useState)(null);
	const [rot, setRot] = (0, import_react.useState)(0);
	const [spin, setSpin] = (0, import_react.useState)(false);
	const dragRef = (0, import_react.useRef)(null);
	const [customized, setCustomized] = (0, import_react.useState)(false);
	const [customName, setCustomName] = (0, import_react.useState)("");
	const [customNumber, setCustomNumber] = (0, import_react.useState)("");
	const wished = wishlist.includes(product.id);
	const related = (0, import_react.useMemo)(() => products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 4), [product, products]);
	const onMouseMove = (e) => {
		const r = e.currentTarget.getBoundingClientRect();
		setZoom({
			x: (e.clientX - r.left) / r.width * 100,
			y: (e.clientY - r.top) / r.height * 100
		});
	};
	const startDrag = (e) => {
		dragRef.current = {
			x: e.clientX,
			r: rot
		};
		e.target.setPointerCapture(e.pointerId);
	};
	const moveDrag = (e) => {
		if (!dragRef.current) return;
		const delta = e.clientX - dragRef.current.x;
		setRot((dragRef.current.r + delta / 2) % 360);
	};
	const endDrag = () => {
		dragRef.current = null;
	};
	const frameIdx = (Math.round(rot / 90) % 4 + 4) % 4;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-4 pt-6 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "hover:text-foreground",
						children: "Shop"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: product.category === "worldcup" ? "/shop/worldcup" : product.category === "retro" ? "/shop/retro" : product.category === "f1" ? "/shop/f1" : "/shop/football",
						className: "hover:text-foreground",
						children: CATEGORY_LABEL[product.category]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-foreground",
						children: product.name
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 lg:grid-cols-[1fr_minmax(320px,420px)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex w-full overflow-x-auto snap-x snap-mandatory gap-3 pb-2 sm:hidden scrollbar-hide",
								children: [product.images.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative aspect-[4/5] w-[90%] shrink-0 snap-center overflow-hidden rounded-2xl bg-surface",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: img,
										alt: "",
										className: "h-full w-full object-cover"
									})
								}, i)), product.has360 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative aspect-[4/5] w-[90%] shrink-0 snap-center flex items-center justify-center overflow-hidden rounded-2xl bg-surface border border-border/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center gap-2 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-8 w-8" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase tracking-[0.15em]",
											children: "360° Desktop View"
										})]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden w-20 shrink-0 flex-col gap-3 sm:flex",
								children: [product.images.map((img, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setActive(i);
										setSpin(false);
									},
									className: `aspect-square overflow-hidden rounded-lg border ${active === i ? "border-foreground" : "border-border/50"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: img,
										alt: "",
										className: "h-full w-full object-cover"
									})
								}, i)), product.has360 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setSpin((s) => !s),
									className: `flex aspect-square items-center justify-center rounded-lg border text-[10px] uppercase tracking-[0.15em] ${spin ? "border-brand text-brand" : "border-border/50 text-muted-foreground"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "360°" })]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-[4/5] flex-1 overflow-hidden rounded-2xl bg-surface hidden sm:block",
								onMouseMove,
								onMouseLeave: () => setZoom(null),
								onPointerDown: spin ? startDrag : void 0,
								onPointerMove: spin ? moveDrag : void 0,
								onPointerUp: spin ? endDrag : void 0,
								style: { cursor: spin ? "grab" : zoom ? "zoom-in" : "default" },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: spin ? product.images[frameIdx] : product.images[active],
										alt: product.name,
										className: "h-full w-full object-cover transition-transform duration-300",
										style: zoom && !spin ? {
											transformOrigin: `${zoom.x}% ${zoom.y}%`,
											transform: "scale(1.8)"
										} : void 0,
										draggable: false
									}),
									spin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute bottom-4 left-4 rounded-full bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur",
										children: "Drag to rotate"
									}),
									product.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute left-4 top-4 rounded-full bg-background/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur",
										children: product.badge
									})
								]
							})
						]
					}),
					product.hasVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
						className: "mt-10 overflow-hidden rounded-2xl border border-border/50 bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-video",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: product.images[1],
									alt: "",
									className: "h-full w-full object-cover opacity-70"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0 flex items-center justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setVideoOpen(true),
										className: "flex h-16 w-16 items-center justify-center rounded-full bg-foreground/90 text-background transition hover:scale-110 cursor-pointer animate-pulse",
										"aria-label": "Play film",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-6 w-6 pl-0.5" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute bottom-4 left-4 text-xs uppercase tracking-[0.2em] text-foreground",
									children: "The Film · 00:47"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "hidden sm:grid sm:mt-12 sm:gap-8 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-[0.24em] text-brand",
							children: "Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: product.description
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-[0.24em] text-brand",
							children: "Specifications"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-3 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpecRow, {
									k: "Material",
									v: product.material
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpecRow, {
									k: "Team",
									v: product.team
								}),
								product.driver && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpecRow, {
									k: "Driver",
									v: product.driver
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpecRow, {
									k: "Category",
									v: CATEGORY_LABEL[product.category]
								})
							]
						})] })]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "lg:sticky lg:top-28 lg:h-fit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/50 bg-card/40 p-6 pb-8 sm:pb-6 backdrop-blur",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
								children: product.tag
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 font-display text-3xl font-bold tracking-tight",
								children: product.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center gap-3 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-brand text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: product.rating
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [product.reviews.toLocaleString(), " reviews"] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex items-baseline gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-3xl font-bold",
									children: formatINR(product.price)
								}), product.compareAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-sm text-muted-foreground line-through",
									children: formatINR(product.compareAt)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
									children: ["Colour · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: color
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2",
									children: product.colors.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setColor(c),
										className: `rounded-full border px-3 py-1.5 text-xs ${color === c ? "border-foreground bg-foreground text-background" : "border-border/70 hover:border-foreground"}`,
										children: c
									}, c))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Size" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "text-brand",
										children: "Size guide"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-5 gap-2",
									children: product.sizes.map((s) => {
										const sizeStock = product.stockBySize?.[s];
										const isOos = sizeStock !== void 0 && sizeStock <= 0;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => !isOos && setSize(s),
											disabled: isOos,
											className: `rounded-lg border py-2 text-xs transition ${isOos ? "border-border/30 text-muted-foreground/40 line-through cursor-not-allowed" : size === s ? "border-foreground bg-foreground text-background" : "border-border/70 hover:border-foreground"}`,
											children: s
										}, s);
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center rounded-full border border-border/70",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setQty((q) => Math.max(1, q - 1)),
											className: "px-3 py-2",
											children: "−"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-6 text-center font-mono text-sm",
											children: qty
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setQty((q) => q + 1),
											className: "px-3 py-2",
											children: "+"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-foreground",
										children: product.stockBySize?.[size] !== void 0 ? product.stockBySize[size] : product.stock
									}), " in stock"]
								})]
							}),
							product.category !== "f1" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-5 border-t border-border/40 pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: customized,
										onChange: (e) => {
											setCustomized(e.target.checked);
											if (!e.target.checked) {
												setCustomName("");
												setCustomNumber("");
											}
										},
										className: "accent-brand rounded border-border"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase tracking-[0.24em] text-foreground",
										children: "Add Custom Name & Number"
									})]
								}), customized && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 grid grid-cols-[1fr_80px] gap-2 animate-in slide-in-from-top-2 duration-200",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground",
										children: "Custom Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										maxLength: 12,
										value: customName,
										onChange: (e) => setCustomName(e.target.value.toUpperCase().replace(/[^A-Z\s]/g, "")),
										placeholder: "e.g. MESSI",
										className: "w-full rounded-lg border border-border/70 bg-transparent px-3 py-2 text-xs outline-none focus:border-foreground uppercase font-mono tracking-widest"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-1 text-[9px] uppercase tracking-[0.2em] text-muted-foreground",
										children: "Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										maxLength: 2,
										pattern: "[0-9]*",
										inputMode: "numeric",
										value: customNumber,
										onChange: (e) => setCustomNumber(e.target.value.replace(/\D/g, "")),
										placeholder: "10",
										className: "w-full rounded-lg border border-border/70 bg-transparent px-3 py-2 text-center text-xs outline-none focus:border-foreground font-mono"
									})] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-col gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => addToCart({
										id: product.id,
										qty,
										size,
										color,
										...customized && customName ? { customName } : {},
										...customized && customNumber ? { customNumber } : {}
									}),
									className: "flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-4 sm:py-3.5 text-[13px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-brand hover:text-foreground active:bg-brand active:text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-5 w-5 sm:h-4 sm:w-4" }),
										" Add to Bag · ",
										formatINR(product.price * qty)
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => toggleWishlist(product.id),
									className: `inline-flex w-full items-center justify-center gap-2 rounded-full border py-3 sm:py-2.5 text-[12px] sm:text-[11px] uppercase tracking-[0.2em] transition ${wished ? "border-brand text-brand bg-brand/5" : "border-border/70 hover:border-foreground active:border-foreground bg-surface/50 sm:bg-transparent"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-4 w-4 sm:h-3.5 sm:w-3.5 ${wished ? "fill-brand" : ""}` }),
										" ",
										wished ? "Saved" : "Add to Wishlist"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "mt-6 space-y-3 border-t border-border/50 pt-5 text-xs text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-foreground" }), " Free express shipping over ₹499"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-foreground" }), " Verified authentic · lifetime guarantee"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "h-4 w-4 text-foreground" }), " 30-day free returns"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-col gap-8 border-t border-border/50 pt-8 sm:hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-[0.24em] text-brand",
									children: "Details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-sm leading-relaxed text-muted-foreground",
									children: product.description
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] uppercase tracking-[0.24em] text-brand",
									children: "Specifications"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
									className: "mt-3 space-y-2 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpecRow, {
											k: "Material",
											v: product.material
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpecRow, {
											k: "Team",
											v: product.team
										}),
										product.driver && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpecRow, {
											k: "Driver",
											v: product.driver
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpecRow, {
											k: "Category",
											v: CATEGORY_LABEL[product.category]
										})
									]
								})] })]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-12 sm:mt-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.24em] text-brand",
						children: "You may also like"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-2xl font-bold sm:text-3xl",
						children: "Related pieces"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						className: "text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground",
						children: "View all"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-4",
					children: related.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p }, p.id))
				})]
			}),
			videoOpen && filmVideo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/10 bg-background shadow-2xl animate-in zoom-in-95",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setVideoOpen(false),
						className: "absolute right-4 top-4 z-10 rounded-full bg-black/60 p-2 text-white/80 hover:text-white transition cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: filmVideo,
						autoPlay: true,
						controls: true,
						playsInline: true,
						className: "h-full w-full"
					})]
				})
			})
		]
	});
}
function SpecRow({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between border-b border-border/40 py-1.5 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: v })]
	});
}
//#endregion
export { PdpPage as component };
