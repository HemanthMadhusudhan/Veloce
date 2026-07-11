import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useShop } from "./store-3dg2D_AQ.mjs";
import { r as useCatalog } from "./catalog-store-DJUqMBkv.mjs";
import { t as formatINR } from "./product-4-DVDiSjDb.mjs";
import { n as TRENDING, r as ZONES } from "./catalog-ChwsJiyw.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Logo } from "./Logo-D5k1ywXB.mjs";
import { B as Gift, C as Plus, K as ChevronRight, O as Minus, Q as Banknote, S as RefreshCw, V as Clock, _ as Settings, a as Truck, g as ShieldCheck, i as User, k as Menu, o as TrendingUp, p as ShoppingBag, q as ChevronDown, s as Trash2, t as X, v as Search, z as Heart } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chrome-LNFqOEFI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LEAGUES = [
	{
		league: "La Liga",
		teams: ["Real Madrid", "FC Barcelona"]
	},
	{
		league: "Premier League",
		teams: [
			"Manchester City",
			"Arsenal FC",
			"Liverpool FC",
			"Manchester United"
		]
	},
	{
		league: "Serie A",
		teams: ["Juventus", "AC Milan"]
	},
	{
		league: "Bundesliga",
		teams: ["Bayern München"]
	},
	{
		league: "Ligue 1",
		teams: ["Paris Saint-Germain"]
	}
];
var FOOTBALL_QUICK_LINKS = [
	{
		label: "FIFA World Cup 2026",
		to: "/shop/worldcup"
	},
	{
		label: "Retro / Vintage",
		to: "/shop/retro"
	},
	{
		label: "Player Zones",
		to: "/shop/football"
	},
	{
		label: "All Football",
		to: "/shop/football"
	}
];
var GST_RATE = 0;
var FREE_SHIPPING_THRESHOLD = 499;
var STANDARD_SHIPPING = 80;
function computeCart(cart, lookup, couponCode, isFirstOrder) {
	const enriched = cart.map((c) => ({
		item: c,
		product: lookup(c.id)
	})).filter((x) => !!x.product);
	const itemCount = enriched.reduce((a, b) => a + b.item.qty, 0);
	const subtotal = enriched.reduce((a, b) => a + b.product.price * b.item.qty, 0);
	const units = [];
	for (const { item, product } of enriched) for (let i = 0; i < item.qty; i++) units.push({
		id: item.id,
		size: item.size,
		color: item.color,
		price: product.price
	});
	const totalFreeUnits = Math.floor(units.length / 3);
	const freeSlice = [...units].sort((a, b) => a.price - b.price).slice(0, totalFreeUnits);
	const freeCountByKey = /* @__PURE__ */ new Map();
	let b2g1Discount = 0;
	for (const u of freeSlice) {
		b2g1Discount += u.price;
		const k = `${u.id}|${u.size}|${u.color}`;
		freeCountByKey.set(k, (freeCountByKey.get(k) ?? 0) + 1);
	}
	let discount = 0;
	let couponApplied = null;
	if (couponCode === "FIRST50" && isFirstOrder) {
		discount = subtotal * .5;
		couponApplied = "FIRST50";
		freeCountByKey.clear();
	} else if (couponCode !== "NONE" && totalFreeUnits > 0) {
		discount = b2g1Discount;
		couponApplied = "B2G1";
	} else freeCountByKey.clear();
	const lines = enriched.map(({ item, product }) => {
		const k = `${item.id}|${item.size}|${item.color}`;
		const freeUnits = freeCountByKey.get(k) ?? 0;
		const lineSubtotal = product.price * item.qty;
		return {
			item,
			product,
			freeUnits,
			lineSubtotal,
			lineDiscount: couponApplied === "FIRST50" ? lineSubtotal * .5 : product.price * freeUnits
		};
	});
	const afterDiscount = Math.max(0, subtotal - discount);
	const shipping = subtotal === 0 ? 0 : afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
	const tax = Math.round(afterDiscount * GST_RATE);
	const total = afterDiscount + shipping + tax;
	return {
		lines,
		itemCount,
		subtotal,
		discount,
		couponApplied,
		freeUnits: couponApplied === "FIRST50" || couponApplied === null ? 0 : totalFreeUnits,
		shipping,
		tax,
		total
	};
}
var NAV = [{
	label: "Formula 1",
	to: "/shop/f1"
}, {
	label: "Shop All",
	to: "/shop"
}];
var FOOTBALL_SUB = [
	{
		label: "All Football",
		to: "/shop/football"
	},
	{
		label: "FIFA World Cup",
		to: "/shop/worldcup"
	},
	{
		label: "Retro Collection",
		to: "/shop/retro"
	}
];
function SiteNav() {
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [zonesOpen, setZonesOpen] = (0, import_react.useState)(false);
	const { cart, wishlist, openCart, openSearch, isAdmin, userEmail, signOut } = useShop();
	const cartCount = cart.reduce((a, b) => a + b.qty, 0);
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "fixed inset-x-0 top-12 z-50 flex justify-center px-4 sm:top-14",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `glass flex w-full max-w-6xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 sm:py-3 ${scrolled ? "scale-[0.98] shadow-2xl shadow-black/40" : ""}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden items-center gap-6 md:flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FootballMenu, {}),
						NAV.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: l.to,
							className: "text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground",
							activeProps: { className: "text-foreground" },
							children: l.label
						}, l.to)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							onMouseEnter: () => setZonesOpen(true),
							onMouseLeave: () => setZonesOpen(false),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground",
								children: ["Zones ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3" })]
							}), zonesOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute left-1/2 top-full -translate-x-1/2 pt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "glass w-56 rounded-2xl p-2",
									children: ZONES.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/zone/$slug",
										params: { slug: z.slug },
										className: "flex items-center justify-between rounded-xl px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:bg-white/10 hover:text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: z.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[9px] text-brand",
											children: z.category === "f1" ? "F1" : "FB"
										})]
									}, z.slug))
								})
							})]
						}),
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin",
							className: "inline-flex items-center gap-1.5 rounded-full border border-[oklch(0.82_0.14_88)]/70 bg-[oklch(0.82_0.14_88)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[oklch(0.9_0.13_92)] shadow-[0_0_18px_-6px_oklch(0.82_0.14_88_/_0.55)] hover:bg-[oklch(0.82_0.14_88)]/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-3 w-3" }), " Admin"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 sm:gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconChip, {
							onClick: openSearch,
							label: "Search",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" })
						}),
						isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin",
							className: "hidden sm:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconChip, {
								label: "Admin",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: signOut,
							className: "hidden items-center gap-1.5 rounded-full border border-border/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground sm:inline-flex",
							children: "Sign out"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/wishlist",
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconChip, {
									label: "Wishlist",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-4 w-4" })
								}), wishlist.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, { children: wishlist.length })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: userEmail ? "/profile" : "/login",
								className: "hidden sm:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconChip, {
									label: userEmail ? "Profile" : "Account",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: openCart,
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconChip, {
									label: "Bag",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" })
								}), cartCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dot, { children: cartCount })]
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconChip, {
							onClick: () => setOpen((v) => !v),
							label: "Menu",
							className: "md:hidden",
							children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
						})
					]
				})
			]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-[100] bg-background flex flex-col px-5 pt-20 pb-8 overflow-y-auto animate-in fade-in zoom-in-95 md:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setOpen(false),
				"aria-label": "Close menu",
				className: "absolute top-5 right-5 p-1.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.28em] text-brand",
						children: "Football"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5 flex flex-col gap-0.5",
						children: FOOTBALL_SUB.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: l.to,
							onClick: () => setOpen(false),
							className: "group flex items-center justify-between rounded-lg px-3 py-2 text-sm uppercase tracking-[0.1em] text-muted-foreground active:bg-white/10 active:text-foreground",
							children: [l.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 opacity-30 transition-opacity group-active:opacity-100" })]
						}, l.to))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-border/40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-0.5",
						children: NAV.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: l.to,
							onClick: () => setOpen(false),
							className: "group flex items-center justify-between rounded-lg px-3 py-2 text-sm uppercase tracking-[0.1em] text-muted-foreground active:bg-white/10 active:text-foreground",
							children: [l.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 opacity-30 transition-opacity group-active:opacity-100" })]
						}, l.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-border/40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.28em] text-brand",
						children: "Zones"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1.5 flex flex-col gap-0.5",
						children: ZONES.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/zone/$slug",
							params: { slug: z.slug },
							onClick: () => setOpen(false),
							className: "group flex items-center justify-between rounded-lg px-3 py-2 text-sm uppercase tracking-[0.1em] text-muted-foreground active:bg-white/10 active:text-foreground",
							children: [z.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 opacity-30 transition-opacity group-active:opacity-100" })]
						}, z.slug))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-border/40" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-0.5",
						children: isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/admin",
							onClick: () => setOpen(false),
							className: "flex items-center justify-between rounded-lg px-3 py-2 text-sm uppercase tracking-[0.1em] text-brand active:bg-white/10",
							children: ["Admin Panel", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 opacity-50" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								signOut();
								setOpen(false);
							},
							className: "flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm uppercase tracking-[0.1em] text-muted-foreground active:bg-white/10 active:text-foreground",
							children: "Sign out"
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: userEmail ? "/profile" : "/login",
							onClick: () => setOpen(false),
							className: "flex items-center justify-between rounded-lg px-3 py-2 text-sm uppercase tracking-[0.1em] text-muted-foreground active:bg-white/10 active:text-foreground",
							children: [userEmail ? "Profile" : "Account", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 opacity-30" })]
						})
					})
				]
			})]
		})]
	});
}
function IconChip({ children, onClick, label, className }) {
	const classes = `flex h-9 w-9 items-center justify-center rounded-full text-foreground/80 transition hover:bg-white/10 hover:text-foreground ${className ?? ""}`;
	if (onClick) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		"aria-label": label,
		className: classes,
		children
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		"aria-label": label,
		className: classes,
		children
	});
}
function Dot({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "pointer-events-none absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 font-mono text-[9px] font-bold text-foreground",
		children
	});
}
function FootballMenu() {
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		onMouseEnter: () => setOpen(true),
		onMouseLeave: () => setOpen(false),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/shop/football",
			className: "flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground",
			activeProps: { className: "text-foreground" },
			children: ["Football ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3" })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute left-1/2 top-full w-[720px] max-w-[92vw] -translate-x-1/2 pt-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass grid grid-cols-3 gap-6 rounded-2xl p-6",
				children: [LEAGUES.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-[9px] uppercase tracking-[0.28em] text-brand",
					children: l.league
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1.5",
					children: l.teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop/football",
						search: { team: t },
						className: "block text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground",
						children: t
					}) }, t))
				})] }, l.league)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-span-3 border-t border-border/40 pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-[9px] uppercase tracking-[0.28em] text-brand",
						children: "Collections"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: FOOTBALL_QUICK_LINKS.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: q.to,
							className: "rounded-full border border-border/60 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:border-foreground hover:text-foreground",
							children: q.label
						}, q.label))
					})]
				})]
			})
		})]
	});
}
function PerksStrip() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto mt-16 max-w-7xl px-5 sm:mt-20 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 rounded-2xl border border-border/50 bg-surface/40 p-4 sm:grid-cols-4 sm:gap-6 sm:p-6",
			children: [
				{
					icon: RefreshCw,
					label: "4-DAY EASY EXCHANGE"
				},
				{
					icon: ShieldCheck,
					label: "100% Authentic"
				},
				{
					icon: Banknote,
					label: "COD AVAILABLE"
				},
				{
					icon: Truck,
					label: "FREE SHIPPING OVER ₹499"
				}
			].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/15 text-brand",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(p.icon, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-w-0 text-[11px] font-medium uppercase tracking-[0.18em] text-foreground/90 sm:text-[12px]",
					children: p.label
				})]
			}, p.label))
		})
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "mt-32 border-t border-border/50 bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-6 py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-xs text-sm text-muted-foreground",
						children: "Elite football jerseys and Formula 1 team merchandise. Engineered precision. Cinematic detail."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
						title: "Shop",
						links: [
							["Football", "/shop/football"],
							["Formula 1", "/shop/f1"],
							["World Cup", "/shop/worldcup"],
							["Retro", "/shop/retro"]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
						title: "Company",
						links: [
							["About", "/info/about"],
							["Journal", "/info/journal"],
							["Sustainability", "/info/sustainability"],
							["Careers", "/info/careers"]
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FooterCol, {
						title: "Support",
						links: [
							["Contact", "/info/contact"],
							["Shipping", "/info/shipping"],
							["Returns", "/info/returns"],
							["FAQ", "/info/faq"]
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/50 pt-8 text-xs text-muted-foreground sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" Veloce Atelier. All rights reserved."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Privacy" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Terms" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cookies" })
					]
				})]
			})]
		})
	});
}
function FooterCol({ title, links }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-3 text-[10px] uppercase tracking-[0.28em] text-foreground",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: links.map(([l, h]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: h,
			className: "text-sm text-muted-foreground transition-colors hover:text-foreground",
			children: l
		}) }, l))
	})] });
}
function CartDrawer() {
	const nav = useNavigate();
	const { cart, cartOpen, closeCart, updateQty, removeFromCart, userId } = useShop();
	const { getById } = useCatalog();
	const totals = (0, import_react.useMemo)(() => computeCart(cart, getById), [cart, getById]);
	const { lines, subtotal, discount, freeUnits, shipping, tax, total, couponApplied } = totals;
	if (!cartOpen) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100] overflow-hidden",
		role: "dialog",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in",
			onClick: closeCart
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "absolute right-0 top-0 flex h-full w-full max-w-[100vw] sm:max-w-md flex-col border-l border-border/60 bg-background shadow-2xl animate-in slide-in-from-right overflow-hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border/60 px-6 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-display text-lg font-semibold",
						children: ["Your Bag ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2 font-mono text-xs text-muted-foreground",
							children: [lines.length, " items"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: closeCart,
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-border/60 bg-brand/10 px-6 py-3 text-[11px] uppercase tracking-[0.18em]",
					children: freeUnits > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-brand",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-3.5 w-3.5" }),
							" B2G1 applied · ",
							freeUnits,
							" item",
							freeUnits > 1 ? "s" : "",
							" FREE"
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-3.5 w-3.5" }),
							" Add ",
							Math.max(0, 3 - totals.itemCount),
							" more · Buy 2 Get 1 Free"
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-y-auto px-6 py-4",
					children: lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-full flex-col items-center justify-center gap-4 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-10 w-10 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: "Your bag is empty."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								onClick: closeCart,
								className: "rounded-full bg-foreground px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-background",
								children: "Shop now"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border/50",
						children: lines.map(({ item, product, freeUnits: fu, lineSubtotal, lineDiscount }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-4 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: product.images[0],
								alt: product.name,
								className: "h-24 w-20 rounded-lg object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 min-w-0 flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate font-display text-sm font-semibold",
												children: product.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground",
												children: [
													item.size,
													" · ",
													item.color,
													(item.customName || item.customNumber) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-1 font-mono text-[10px] text-brand uppercase tracking-wider font-semibold",
														children: [
															"Print: ",
															item.customName || "NO NAME",
															" #",
															item.customNumber || "00"
														]
													})
												]
											}),
											fu > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1 inline-flex items-center gap-1 rounded-full bg-brand/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-brand",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-2.5 w-2.5" }),
													fu,
													"× Free · B2G1"
												]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-sm",
											children: formatINR(lineSubtotal)
										}), lineDiscount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-mono text-[10px] text-brand",
											children: ["−", formatINR(lineDiscount)]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center rounded-full border border-border/70",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => updateQty(item.id, item.size, item.color, item.qty - 1, item.customName, item.customNumber),
												className: "px-2 py-1",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "w-6 text-center font-mono text-xs",
												children: item.qty
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => updateQty(item.id, item.size, item.color, item.qty + 1, item.customName, item.customNumber),
												className: "px-2 py-1",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => removeFromCart(item.id, item.size, item.color, item.customName, item.customNumber),
										className: "text-muted-foreground hover:text-brand",
										"aria-label": "Remove",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})]
								})]
							})]
						}, item.id + item.size + item.color + (item.customName || "") + (item.customNumber || "")))
					})
				}),
				lines.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border/60 px-6 py-5 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Subtotal",
								v: formatINR(subtotal)
							}),
							discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: `B2G1 (${couponApplied})`,
								v: `−${formatINR(discount)}`,
								accent: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								k: "Shipping",
								v: shipping === 0 ? "Free" : formatINR(shipping)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center justify-between border-t border-border/50 pt-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display font-semibold",
									children: "Total"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: formatINR(total)
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							closeCart();
							nav({ to: userId ? "/checkout" : "/login" });
						},
						className: "mt-2 w-full rounded-full bg-foreground py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-brand hover:text-foreground",
						children: ["Checkout · ", formatINR(total)]
					})]
				})
			]
		})]
	});
}
function Row({ k, v, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: accent ? "text-brand font-mono" : "font-mono",
			children: v
		})]
	});
}
function SearchDialog() {
	const { searchOpen, closeSearch, recent, pushRecent } = useShop();
	const { products } = useCatalog();
	const [q, setQ] = (0, import_react.useState)("");
	const nav = useNavigate();
	(0, import_react.useEffect)(() => {
		if (!searchOpen) setQ("");
		const onKey = (e) => {
			if (e.key === "Escape") closeSearch();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [searchOpen, closeSearch]);
	const results = (0, import_react.useMemo)(() => {
		if (!q.trim()) return [];
		const s = q.toLowerCase();
		return products.filter((p) => p.name.toLowerCase().includes(s) || p.team.toLowerCase().includes(s) || (p.driver ?? "").toLowerCase().includes(s) || p.tag.toLowerCase().includes(s)).slice(0, 6);
	}, [q, products]);
	if (!searchOpen) return null;
	const go = (id) => {
		pushRecent(q || id);
		closeSearch();
		nav({
			to: "/product/$id",
			params: { id }
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100]",
		role: "dialog",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in",
			onClick: closeSearch
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-x-4 top-24 mx-auto max-w-2xl overflow-hidden rounded-3xl border border-border/60 bg-background shadow-2xl animate-in fade-in slide-in-from-top-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 border-b border-border/60 px-5 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search jerseys, teams, drivers…",
						className: "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
						className: "rounded border border-border/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground",
						children: "ESC"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-[60vh] overflow-y-auto p-4",
				children: q === "" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5",
					children: [recent.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), " Recent"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: recent.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setQ(r),
							className: "rounded-full border border-border/60 px-3 py-1 text-xs hover:border-foreground",
							children: r
						}, r))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }), " Trending"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: TRENDING.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setQ(t),
							className: "rounded-full border border-border/60 px-3 py-1 text-xs hover:border-foreground",
							children: t
						}, t))
					})] })]
				}) : results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-10 text-center text-sm text-muted-foreground",
					children: [
						"No matches for \"",
						q,
						"\""
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border/50",
					children: results.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => go(p.id),
						className: "flex w-full items-center gap-4 px-1 py-3 text-left hover:bg-white/10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.images[0],
								alt: "",
								className: "h-12 w-10 rounded object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-sm font-medium",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground",
									children: [p.team, p.driver ? ` · ${p.driver}` : ""]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-xs",
								children: formatINR(p.price)
							})
						]
					}) }, p.id))
				})
			})]
		})]
	});
}
function SiteChrome({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
			className: "pt-24 sm:pt-32 w-full overflow-x-hidden",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialog, {})
	] });
}
//#endregion
export { SiteNav as a, SiteChrome as i, PerksStrip as n, computeCart as o, SearchDialog as r, CartDrawer as t };
