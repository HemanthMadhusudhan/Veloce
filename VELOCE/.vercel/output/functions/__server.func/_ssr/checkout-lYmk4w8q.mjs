import { o as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useShop } from "./store-CiUyHq21.mjs";
import { r as useCatalog } from "./catalog-store-DVlj9mYO.mjs";
import { t as formatINR } from "./product-4-DVDiSjDb.mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { H as CreditCard, P as Lock, V as Gift, X as Check, et as Banknote } from "../_libs/lucide-react.mjs";
import { a as SiteNav, o as computeCart, r as SearchDialog, t as CartDrawer } from "./chrome-pMKAbmf0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-lYmk4w8q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var UPI_VPA = "velocejersey@ybl";
var UPI_PAYEE = "VELOCE JERSEY";
var loadRazorpay = () => {
	return new Promise((resolve) => {
		if (window.Razorpay) {
			resolve(true);
			return;
		}
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.onload = () => resolve(true);
		script.onerror = () => resolve(false);
		document.body.appendChild(script);
	});
};
function CheckoutPage() {
	const { cart, clearCart, placeOrder, userEmail, userId, updateProfile, profile, orders } = useShop();
	const { getById, refresh } = useCatalog();
	useNavigate();
	const [mode, setMode] = (0, import_react.useState)("guest");
	const [done, setDone] = (0, import_react.useState)(false);
	const [contact, setContact] = (0, import_react.useState)({
		email: "",
		firstName: "",
		lastName: "",
		city: ""
	});
	const [address, setAddress] = (0, import_react.useState)("");
	const [stateName, setStateName] = (0, import_react.useState)("");
	const [step, setStep] = (0, import_react.useState)("details");
	const [pincode, setPincode] = (0, import_react.useState)("");
	const [txnErr, setTxnErr] = (0, import_react.useState)(null);
	const [payMode, setPayMode] = (0, import_react.useState)("full");
	const [finalCodDue, setFinalCodDue] = (0, import_react.useState)(0);
	const [couponInput, setCouponInput] = (0, import_react.useState)("");
	const [appliedCouponState, setAppliedCouponState] = (0, import_react.useState)("");
	const isFirstOrder = (0, import_react.useMemo)(() => orders.length === 0, [orders]);
	const totals = (0, import_react.useMemo)(() => computeCart(cart, getById, appliedCouponState, isFirstOrder), [
		cart,
		getById,
		appliedCouponState,
		isFirstOrder
	]);
	(0, import_react.useEffect)(() => {
		if (userId && profile) {
			const parts = (profile.fullName || "").trim().split(/\s+/);
			const firstName = parts[0] || "";
			const lastName = parts.slice(1).join(" ") || "";
			setContact((prev) => ({
				...prev,
				email: profile.email || userEmail || prev.email,
				firstName: prev.firstName || firstName,
				lastName: prev.lastName || lastName,
				city: prev.city || profile.city || ""
			}));
			if (profile.addressLine1) setAddress(profile.addressLine1);
			if (profile.state) setStateName(profile.state);
			if (profile.postalCode) setPincode(profile.postalCode);
		} else if (userEmail) setContact((prev) => ({
			...prev,
			email: userEmail
		}));
	}, [
		userId,
		profile,
		userEmail
	]);
	(0, import_react.useEffect)(() => {
		if (!userId) try {
			const raw = localStorage.getItem("veloce.profile.address.v1");
			if (raw) {
				const parsed = JSON.parse(raw);
				setContact((prev) => {
					const parts = (parsed.name || "").trim().split(/\s+/);
					const firstName = parts[0] || "";
					const lastName = parts.slice(1).join(" ") || "";
					return {
						...prev,
						firstName,
						lastName,
						city: parsed.city || ""
					};
				});
				setAddress(parsed.line1 || "");
				setStateName(parsed.state || "");
				setPincode(parsed.pincode || "");
			}
		} catch {}
	}, [userId]);
	const { lines, subtotal, discount, shipping, tax, total, freeUnits, couponApplied } = totals;
	const orderRef = (0, import_react.useMemo)(() => `VEL${Date.now().toString(36).toUpperCase()}`, []);
	const payNow = (0, import_react.useMemo)(() => payMode === "cod" ? 80 : total, [payMode, total]);
	const codDue = payMode === "cod" ? total : 0;
	(0, import_react.useMemo)(() => {
		return `upi://pay?${new URLSearchParams({
			pa: UPI_VPA,
			pn: UPI_PAYEE,
			am: payNow.toFixed(2),
			cu: "INR",
			tn: payMode === "cod" ? `Veloce ${orderRef} · 80rs advance` : `Veloce order ${orderRef}`,
			tr: orderRef
		}).toString()}`;
	}, [
		payNow,
		orderRef,
		payMode
	]);
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-6 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-6 font-display text-3xl font-bold",
				children: "Order placed — awaiting payment verification"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: ["We're checking your UTR against our bank statement. As soon as the payment is confirmed, your order moves to Processing and ships within 24 hours.", payMode === "cod" && ` Please keep ${formatINR(finalCodDue)} ready in cash to hand to the courier on delivery.`]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex justify-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "inline-block rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background hover:bg-brand hover:text-foreground",
					children: "Keep shopping"
				}), userEmail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/profile",
					className: "inline-block rounded-full border border-border/70 px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] hover:border-foreground",
					children: "Track order"
				})]
			})
		]
	});
	if (lines.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg px-6 py-24 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-bold",
			children: "Your bag is empty"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/shop",
			className: "mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background",
			children: "Start shopping"
		})]
	});
	const submitPayment = async (e) => {
		e.preventDefault();
		setTxnErr(null);
		for (const item of cart) {
			const p = getById(item.id);
			if (!p) {
				setTxnErr(`Product ${item.id} not found.`);
				return;
			}
			const available = p.stockBySize?.[item.size] !== void 0 ? p.stockBySize[item.size] : p.stock;
			if (item.qty > available) {
				setTxnErr(`Sorry, only ${available} left in stock for ${p.name} (${item.size}).`);
				return;
			}
		}
		const name = [contact.firstName, contact.lastName].filter(Boolean).join(" ");
		try {
			localStorage.setItem("veloce.profile.address.v1", JSON.stringify({
				name,
				phone: profile?.phone || "",
				line1: address,
				line2: "",
				city: contact.city,
				state: stateName,
				pincode
			}));
		} catch {}
		if (userId) updateProfile({
			fullName: name,
			addressLine1: address,
			city: contact.city,
			state: stateName,
			postalCode: pincode
		}).catch((err) => console.error("Failed to sync checkout address to Supabase:", err));
		if (!await loadRazorpay()) {
			setTxnErr("Failed to load payment gateway. Please check your internet connection.");
			return;
		}
		setTxnErr("Payment gateway is not configured. Please contact support.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: "100%",
			overflowX: "hidden",
			boxSizing: "border-box"
		},
		className: "mx-auto max-w-6xl px-4 sm:px-6 pt-4 pb-36 sm:pt-8 sm:pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-[0.28em] text-brand",
				children: "Secure checkout"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl font-bold tracking-tight sm:text-5xl",
				children: "Checkout"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					width: "100%",
					overflowX: "hidden"
				},
				className: "mt-10 grid gap-10 lg:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: step === "details" ? (e) => {
						e.preventDefault();
						setStep("payment");
						window.scrollTo({
							top: 0,
							behavior: "smooth"
						});
					} : submitPayment,
					className: "space-y-8 min-w-0 w-full",
					children: [
						!userId && step === "details" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 rounded-full border border-border/70 p-1 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMode("guest"),
								className: `flex-1 rounded-full py-2 uppercase tracking-[0.2em] ${mode === "guest" ? "bg-foreground text-background" : "text-muted-foreground"}`,
								children: "Guest checkout"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setMode("account"),
								className: `flex-1 rounded-full py-2 uppercase tracking-[0.2em] ${mode === "account" ? "bg-foreground text-background" : "text-muted-foreground"}`,
								children: "Sign in"
							})]
						}),
						step === "details" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "Contact",
							children: userId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Signed in as "
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-emerald-300",
									children: userEmail
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] text-emerald-300 font-semibold",
									children: "Active Session"
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								type: "email",
								placeholder: "Email address",
								value: contact.email,
								onChange: (e) => setContact({
									...contact,
									email: e.target.value
								})
							}), mode === "account" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								required: true,
								type: "password",
								placeholder: "Password"
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							title: "Shipping (India)",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										placeholder: "First name",
										value: contact.firstName,
										onChange: (e) => setContact({
											...contact,
											firstName: e.target.value
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										placeholder: "Last name",
										value: contact.lastName,
										onChange: (e) => setContact({
											...contact,
											lastName: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									placeholder: "Address",
									value: address,
									onChange: (e) => setAddress(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											required: true,
											placeholder: "City",
											value: contact.city,
											onChange: (e) => setContact({
												...contact,
												city: e.target.value
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											required: true,
											placeholder: "State",
											value: stateName,
											onChange: (e) => setStateName(e.target.value)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											required: true,
											placeholder: "PIN code",
											value: pincode,
											onChange: (e) => setPincode(e.target.value)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									placeholder: "Country",
									defaultValue: "India",
									readOnly: true
								})
							]
						})] }),
						step === "payment" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
							title: "Coupon Code",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/40 p-4",
								children: totals.couponApplied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] uppercase tracking-[0.24em] text-brand",
										children: "Applied"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 font-mono text-sm",
										children: totals.couponApplied
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											if (totals.couponApplied === "B2G1") setAppliedCouponState("NONE");
											else setAppliedCouponState("");
										},
										className: "rounded-full border border-border/70 px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground",
										children: "Remove"
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[11px] text-muted-foreground",
									children: "Have a coupon? Enter it below."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "E.g. FIRST50",
										value: couponInput,
										onChange: (e) => setCouponInput(e.target.value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											const code = couponInput.trim().toUpperCase();
											if (code === "FIRST50" && !isFirstOrder) {
												alert("The FIRST50 coupon is only valid for your first order.");
												return;
											}
											if (code === "B2G1" && totals.itemCount < 3) {
												alert("Add at least 3 jerseys to apply the B2G1 coupon.");
												return;
											}
											setAppliedCouponState(code);
											setCouponInput("");
										},
										className: "rounded-xl bg-foreground px-6 text-xs font-semibold uppercase tracking-widest text-background",
										children: "Apply"
									})]
								})] })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
							title: "Payment",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setPayMode("full");
										setTxnErr(null);
									},
									className: `rounded-xl border p-3 text-left transition ${payMode === "full" ? "border-foreground bg-card/60" : "border-border/60 hover:border-foreground/60"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-brand",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-3.5 w-3.5" }), " Pay Online"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 text-sm font-semibold",
											children: [
												"Pay ",
												formatINR(total),
												" now"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: "Cards, UPI, Netbanking, or Wallets. Dispatched after verification."
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										setPayMode("cod");
										setTxnErr(null);
									},
									className: `rounded-xl border p-3 text-left transition ${payMode === "cod" ? "border-foreground bg-card/60" : "border-border/60 hover:border-foreground/60"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-brand",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-3.5 w-3.5" }), " Cash on Delivery"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-1 text-sm font-semibold",
											children: "Pay ₹80 prepaid charge now"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [
												"Balance ",
												formatINR(total),
												" in cash on delivery."
											]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									width: "100%",
									boxSizing: "border-box",
									overflowX: "hidden"
								},
								className: "rounded-2xl border border-border/70 bg-card/40 p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											gap: "6px",
											marginBottom: "16px"
										},
										className: "text-[12px] uppercase tracking-[0.24em] text-brand",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { style: {
											width: "16px",
											height: "16px",
											flexShrink: 0
										} }), " Secure Checkout"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										style: {
											fontSize: "13px",
											textAlign: "center",
											lineHeight: "1.6",
											marginBottom: "24px",
											wordBreak: "break-word",
											overflowWrap: "break-word"
										},
										className: "text-muted-foreground",
										children: "You will be redirected to Razorpay to complete your payment securely via UPI, Credit/Debit Card, or Netbanking."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											borderTop: "1px solid rgba(255,255,255,0.08)",
											paddingTop: "16px",
											display: "flex",
											flexDirection: "column",
											gap: "12px",
											fontSize: "14px",
											width: "100%"
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												style: {
													display: "flex",
													justifyContent: "space-between",
													width: "100%",
													gap: "8px"
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Pay now"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														fontFamily: "monospace",
														fontWeight: 600
													},
													children: formatINR(payNow)
												})]
											}),
											payMode === "cod" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												style: {
													display: "flex",
													justifyContent: "space-between",
													width: "100%",
													gap: "8px"
												},
												className: "text-brand",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cash on delivery" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: {
														fontFamily: "monospace",
														fontWeight: 600
													},
													children: formatINR(codDue)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												style: {
													display: "flex",
													justifyContent: "space-between",
													width: "100%",
													gap: "8px",
													borderTop: "1px solid rgba(255,255,255,0.08)",
													paddingTop: "12px",
													fontWeight: 600
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Order total"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													style: { fontFamily: "monospace" },
													children: formatINR(total)
												})]
											})
										]
									}),
									txnErr && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-6 rounded-lg border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand text-center",
										children: txnErr
									})
								]
							})]
						})] }),
						step === "details" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "hidden sm:block w-full rounded-full bg-foreground py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-brand hover:text-foreground",
							children: "Proceed to Payment"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 hidden sm:flex",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "w-full rounded-full bg-foreground py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-brand hover:text-foreground",
								children: [
									"Place order · Pay ",
									formatINR(payNow),
									" now",
									payMode === "cod" ? ` + ${formatINR(codDue)} COD` : ""
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setStep("details"),
								className: "w-full rounded-full border border-border/70 py-3.5 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground",
								children: "Back to Address"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "fixed bottom-0 left-0 right-0 z-40 bg-background/95 border-t border-border/50 p-3 sm:p-4 backdrop-blur-md shadow-[0_-10px_40px_rgba(0,0,0,0.5)] sm:hidden",
							children: step === "details" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "w-full rounded-full bg-foreground py-3 sm:py-4 px-2 text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.24em] text-background transition active:bg-brand active:text-foreground text-center break-words whitespace-normal leading-tight",
								children: "Proceed to Payment"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "w-full rounded-full bg-foreground py-3 px-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-background transition active:bg-brand active:text-foreground text-center",
									children: [
										"Place order · Pay ",
										formatINR(payNow),
										" now",
										payMode === "cod" ? ` + COD` : ""
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setStep("details"),
									className: "w-full rounded-full border border-border/70 py-2.5 px-2 text-[11px] uppercase tracking-[0.1em] text-muted-foreground text-center",
									children: "Back to Address"
								})]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					style: {
						width: "100%",
						maxWidth: "100%",
						overflowX: "hidden"
					},
					className: "h-fit rounded-2xl border border-border/50 bg-card/40 p-6 lg:sticky lg:top-28",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-[0.24em] text-muted-foreground",
							children: "Order summary"
						}),
						freeUnits > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-2 rounded-lg bg-brand/15 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-brand",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "h-3.5 w-3.5" }),
								" B2G1 · ",
								freeUnits,
								" item",
								freeUnits > 1 ? "s" : "",
								" ",
								"FREE"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-3 border-b border-border/50 pb-4 min-w-0 w-full",
							children: lines.map(({ item, product, freeUnits: fu, lineSubtotal, lineDiscount }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3 min-w-0 w-full",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: product.images[0],
										alt: "",
										className: "h-16 w-14 rounded object-cover shrink-0"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1 min-w-0 max-w-[calc(100%-68px)]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-sm",
												children: product.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-[11px] text-muted-foreground truncate",
												children: [
													item.size,
													" · ",
													item.color,
													" · Qty ",
													item.qty,
													(item.customName || item.customNumber) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-0.5 font-mono text-[10px] text-brand uppercase tracking-wider font-semibold",
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
												className: "mt-0.5 text-[10px] uppercase tracking-[0.18em] text-brand",
												children: [fu, "× Free · B2G1"]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-mono text-xs",
											children: formatINR(lineSubtotal)
										}), lineDiscount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-mono text-[10px] text-brand",
											children: ["−", formatINR(lineDiscount)]
										})]
									})
								]
							}, item.id + item.size + item.color + (item.customName || "") + (item.customNumber || "")))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-1.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Subtotal",
									v: formatINR(subtotal)
								}),
								discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: `Discount (${couponApplied})`,
									v: `−${formatINR(discount)}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									k: "Shipping",
									v: shipping === 0 ? "Free" : formatINR(shipping)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex justify-between border-t border-border/50 pt-3 text-sm font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: formatINR(total)
									})]
								})
							]
						})
					]
				})]
			})
		]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-2 font-display text-lg font-semibold",
			children: title
		}), children]
	});
}
function Input(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		className: "w-full min-w-0 max-w-full rounded-xl border border-border/60 bg-transparent px-4 py-3.5 text-sm transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-mono",
			children: v
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteNav, {}),
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "pt-28 sm:pt-32 w-full overflow-x-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckoutPage, {})
	}),
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartDrawer, {}),
	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchDialog, {})
] });
//#endregion
export { SplitComponent as component };
