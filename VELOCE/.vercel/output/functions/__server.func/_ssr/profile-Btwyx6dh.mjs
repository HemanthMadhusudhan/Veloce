import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useShop } from "./store-3dg2D_AQ.mjs";
import { r as useCatalog } from "./catalog-store-DJUqMBkv.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as MapPin, D as Package, F as LifeBuoy, M as LogOut, T as Phone, i as User, j as Mail, tt as ArrowLeft, y as Save } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-Btwyx6dh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ADDR_KEY = "veloce.profile.address.v1";
var DEFAULT_ADDR = {
	name: "",
	phone: "",
	line1: "",
	line2: "",
	city: "",
	state: "",
	pincode: ""
};
function ProfilePage() {
	const nav = useNavigate();
	const { userEmail, signOut, orders, profile, updateProfile } = useShop();
	const { getById } = useCatalog();
	const [tab, setTab] = (0, import_react.useState)("orders");
	const [addr, setAddr] = (0, import_react.useState)(DEFAULT_ADDR);
	const [saved, setSaved] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!userEmail) nav({
			to: "/login",
			replace: true
		});
	}, [userEmail, nav]);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(ADDR_KEY);
			if (raw) setAddr({
				...DEFAULT_ADDR,
				...JSON.parse(raw)
			});
			else if (profile) setAddr({
				name: profile.fullName ?? "",
				phone: profile.phone ?? "",
				line1: profile.addressLine1 ?? "",
				line2: profile.addressLine2 ?? "",
				city: profile.city ?? "",
				state: profile.state ?? "",
				pincode: profile.postalCode ?? ""
			});
		} catch {}
	}, [profile]);
	if (!userEmail) return null;
	const myOrders = orders.filter((o) => !o.customer.email || o.customer.email.toLowerCase() === userEmail.toLowerCase());
	const saveAddress = async () => {
		localStorage.setItem(ADDR_KEY, JSON.stringify(addr));
		if (profile) try {
			await updateProfile({
				fullName: addr.name,
				phone: addr.phone,
				addressLine1: addr.line1,
				addressLine2: addr.line2,
				city: addr.city,
				state: addr.state,
				postalCode: addr.pincode
			});
		} catch (e) {
			console.error("Failed to sync profile to Supabase:", e);
		}
		setSaved(true);
		setTimeout(() => setSaved(false), 1800);
	};
	const handleLogout = () => {
		signOut();
		nav({
			to: "/",
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-6 sm:py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-end sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => history.length > 1 ? history.back() : nav({ to: "/" }),
					className: "mb-2 sm:mb-3 inline-flex items-center gap-1 text-[9px] sm:text-[11px] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3 w-3 sm:h-3.5 sm:w-3.5" }), " Back"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[8px] sm:text-[10px] uppercase tracking-[0.3em] gold-text",
					children: "Members"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 sm:mt-2 font-display text-xl sm:text-4xl font-bold tracking-tight",
					children: "My account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 sm:mt-2 flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3 sm:h-4 sm:w-4" }), userEmail]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: handleLogout,
				className: "inline-flex items-center gap-1.5 self-start rounded-full border border-border/70 px-3 py-1.5 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.24em] hover:border-brand hover:text-brand",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3 w-3 sm:h-4 sm:w-4" }), " Sign out"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 sm:mt-8 grid gap-4 sm:gap-6 lg:grid-cols-[220px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex flex-row gap-1.5 sm:gap-2 overflow-x-auto lg:flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "orders",
						onClick: () => setTab("orders"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-3 w-3 sm:h-4 sm:w-4" }),
						children: "Orders"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "address",
						onClick: () => setTab("address"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 sm:h-4 sm:w-4" }),
						children: "Address"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "support",
						onClick: () => setTab("support"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LifeBuoy, { className: "h-3 w-3 sm:h-4 sm:w-4" }),
						children: "Support"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 min-h-[200px] sm:min-h-[300px] rounded-2xl sm:rounded-3xl border border-border/60 bg-white/[0.02] p-3.5 sm:p-8",
				children: [
					tab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-base sm:text-xl font-semibold",
							children: "Order history"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground",
							children: "Track past orders and their status."
						}),
						myOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 sm:mt-8 rounded-xl sm:rounded-2xl border border-dashed border-border/60 p-5 sm:p-8 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs sm:text-sm text-muted-foreground",
								children: "You haven't placed any orders yet."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								className: "mt-3 sm:mt-4 inline-block rounded-full bg-foreground px-4 py-2 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.24em] text-background hover:bg-brand hover:text-foreground",
								children: "Start shopping"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 sm:mt-6 space-y-3 sm:space-y-4",
							children: myOrders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-xl sm:rounded-2xl border border-border/60 p-3 sm:p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center justify-between gap-2 sm:gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-[9px] sm:text-xs text-muted-foreground truncate",
											children: o.id
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] sm:text-sm",
											children: new Date(o.createdAt).toLocaleString()
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 sm:gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full border border-border/60 px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.24em]",
											children: o.status
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-display text-sm sm:text-lg font-semibold",
											children: ["₹", o.total.toLocaleString("en-IN")]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 sm:mt-3 divide-y divide-border/40 border-t border-border/40",
									children: o.items.map((it, i) => {
										const p = getById(it.id);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between py-1.5 sm:py-2 text-xs sm:text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0 flex-1 pr-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "truncate font-medium text-[11px] sm:text-sm",
													children: p?.name ?? it.id
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] sm:text-xs text-muted-foreground",
													children: [
														it.size,
														" · ",
														it.color,
														" · Qty ",
														it.qty
													]
												})]
											}), p && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] sm:text-sm shrink-0 ml-2",
												children: ["₹", (p.price * it.qty).toLocaleString("en-IN")]
											})]
										}, i);
									})
								})]
							}, o.id))
						})
					] }),
					tab === "address" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-base sm:text-xl font-semibold",
							children: "Shipping address"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground",
							children: "Saved for faster checkout."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 sm:mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Full name",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3 sm:h-4 sm:w-4" }),
									value: addr.name,
									onChange: (v) => setAddr({
										...addr,
										name: v
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Phone",
									icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3 sm:h-4 sm:w-4" }),
									value: addr.phone,
									onChange: (v) => setAddr({
										...addr,
										phone: v
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Address line 1",
									value: addr.line1,
									onChange: (v) => setAddr({
										...addr,
										line1: v
									}),
									className: "sm:col-span-2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Address line 2",
									value: addr.line2,
									onChange: (v) => setAddr({
										...addr,
										line2: v
									}),
									className: "sm:col-span-2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "City",
									value: addr.city,
									onChange: (v) => setAddr({
										...addr,
										city: v
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "State",
									value: addr.state,
									onChange: (v) => setAddr({
										...addr,
										state: v
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Pincode",
									value: addr.pincode,
									onChange: (v) => setAddr({
										...addr,
										pincode: v
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 sm:mt-6 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: saveAddress,
								className: "inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 sm:px-6 sm:py-3 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.24em] text-background hover:bg-brand hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3 w-3 sm:h-4 sm:w-4" }), " Save address"]
							}), saved && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] sm:text-xs text-brand",
								children: "Saved ✓"
							})]
						})
					] }),
					tab === "support" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-base sm:text-xl font-semibold",
							children: "Support"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground",
							children: "We're here to help — typical reply within 4 hours."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 sm:mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "mailto:support@veloce.in",
								className: "rounded-xl sm:rounded-2xl border border-border/60 p-3.5 sm:p-5 hover:border-brand",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[8px] sm:text-[10px] uppercase tracking-[0.28em] text-brand",
										children: "Email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 sm:mt-2 text-sm sm:text-base font-medium",
										children: "support@veloce.in"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-muted-foreground",
										children: "Orders, sizing, exchanges"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "https://t.me/VELOCE_JERSEY",
								target: "_blank",
								rel: "noreferrer",
								className: "rounded-xl sm:rounded-2xl border border-border/60 p-3.5 sm:p-5 hover:border-brand",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[8px] sm:text-[10px] uppercase tracking-[0.28em] text-brand",
										children: "Telegram"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 sm:mt-2 text-sm sm:text-base font-medium",
										children: "@VELOCE_JERSEY"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-muted-foreground",
										children: "Mon–Sat · 10am–8pm IST"
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 sm:mt-6 rounded-xl sm:rounded-2xl border border-border/60 p-3.5 sm:p-5 text-xs sm:text-sm text-muted-foreground",
							children: [
								"Include your order ID (starts with ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-foreground",
									children: "VEL-"
								}),
								") so we can help faster."
							]
						})
					] })
				]
			})]
		})]
	});
}
function TabBtn({ active, onClick, icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: `inline-flex items-center gap-1.5 sm:gap-2 rounded-full border px-3 py-1.5 sm:px-4 sm:py-2.5 text-[10px] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.22em] transition ${active ? "border-brand bg-brand/10 text-brand" : "border-border/60 text-muted-foreground hover:text-foreground"}`,
		children: [
			icon,
			" ",
			children
		]
	});
}
function Input({ label, value, onChange, icon, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: `block ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-1 sm:mb-1.5 flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-muted-foreground",
			children: [icon, label]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "w-full min-w-0 rounded-lg border border-border/70 bg-transparent px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm outline-none focus:border-foreground"
		})]
	});
}
//#endregion
export { ProfilePage as component };
