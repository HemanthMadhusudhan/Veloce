import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { r as useCatalog } from "./catalog-store-DJUqMBkv.mjs";
import { _ as useSearch, d as Outlet } from "../_libs/@tanstack/react-router+[...].mjs";
import { L as LayoutGrid, P as List, f as SlidersHorizontal, t as X } from "../_libs/lucide-react.mjs";
import { n as ProductCard } from "./ProductCard-ao1YtOfz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-CUemF0IS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ShopInner({ title, subtitle, category }) {
	const { products } = useCatalog();
	const search = useSearch({ strict: false });
	const [view, setView] = (0, import_react.useState)("grid");
	const [sort, setSort] = (0, import_react.useState)("featured");
	const [team, setTeam] = (0, import_react.useState)(search.team ?? null);
	const [price, setPrice] = (0, import_react.useState)([0, 3e4]);
	const [visible, setVisible] = (0, import_react.useState)(24);
	const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setTeam(search.team ?? null);
	}, [search.team]);
	const filtered = (0, import_react.useMemo)(() => {
		let list = category ? products.filter((p) => p.category === category) : products;
		if (team) list = list.filter((p) => p.team === team);
		list = list.filter((p) => p.price >= price[0] && p.price <= price[1]);
		if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
		else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
		else if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
		return list;
	}, [
		category,
		team,
		price,
		sort,
		products
	]);
	(0, import_react.useEffect)(() => {
		const onScroll = () => {
			if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1200) setVisible((v) => Math.min(v + 12, filtered.length));
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [filtered.length]);
	(0, import_react.useEffect)(() => setVisible(24), [
		category,
		team,
		price,
		sort
	]);
	const teams = Array.from(new Set((category ? products.filter((p) => p.category === category) : products).map((p) => p.team))).sort();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-6 pt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-10 flex flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-[0.28em] text-brand",
					children: "Collection"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl font-bold tracking-tight sm:text-6xl",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-xl text-sm text-muted-foreground",
					children: subtitle
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-6 lg:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FiltersPanel, {
				open: filtersOpen,
				onClose: () => setFiltersOpen(false),
				teams,
				team,
				setTeam,
				price,
				setPrice
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setFiltersOpen(true),
								className: "inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-xs uppercase tracking-[0.15em] lg:hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5" }), " Filters"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-xs text-muted-foreground",
								children: [filtered.length, " products"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: sort,
								onChange: (e) => setSort(e.target.value),
								className: "rounded-full border border-border/70 bg-transparent px-3 py-1.5 text-xs outline-none",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "featured",
										children: "Featured"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "price-asc",
										children: "Price · Low to High"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "price-desc",
										children: "Price · High to Low"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "rating",
										children: "Top Rated"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden overflow-hidden rounded-full border border-border/70 sm:flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setView("grid"),
									className: `p-2 ${view === "grid" ? "bg-foreground text-background" : ""}`,
									"aria-label": "Grid",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-3.5 w-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setView("list"),
									className: `p-2 ${view === "list" ? "bg-foreground text-background" : ""}`,
									"aria-label": "List",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-3.5 w-3.5" })
								})]
							})]
						})]
					}),
					view === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4",
						children: filtered.slice(0, visible).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { p }, p.id))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-4",
						children: filtered.slice(0, visible).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
							p,
							view: "list"
						}, p.id))
					}),
					visible < filtered.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-10 text-center text-xs uppercase tracking-[0.24em] text-muted-foreground",
						children: "Loading more…"
					})
				]
			})]
		})]
	});
}
function FiltersPanel({ open, onClose, teams, team, setTeam, price, setPrice }) {
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 text-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
			children: "Team"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
				active: team === null,
				onClick: () => setTeam(null),
				children: "All"
			}), teams.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
				active: team === t,
				onClick: () => setTeam(t),
				children: t
			}, t))]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
			children: ["Max price · ₹", price[1].toLocaleString("en-IN")]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "range",
			min: 2e3,
			max: 3e4,
			step: 500,
			value: price[1],
			onChange: (e) => setPrice([price[0], Number(e.target.value)]),
			className: "w-full accent-brand"
		})] })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "hidden w-56 shrink-0 lg:block",
		children: body
	}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[90] lg:hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-black/70",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-y-auto bg-background p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-display text-lg font-semibold",
					children: "Filters"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				})]
			}), body]
		})]
	})] });
}
function FilterChip({ children, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		className: `rounded-full border px-3 py-1.5 text-xs transition ${active ? "border-foreground bg-foreground text-background" : "border-border/70 text-muted-foreground hover:border-foreground hover:text-foreground"}`,
		children
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
//#endregion
export { ShopInner, SplitComponent as component };
