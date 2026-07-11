import { r as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DEHV6YAt.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useShop } from "./store-3dg2D_AQ.mjs";
import { r as useCatalog } from "./catalog-store-DJUqMBkv.mjs";
import { a as useSiteImages, r as uploadSiteImageFile, t as SITE_IMAGE_META } from "./site-images-Ct4cvN2Q.mjs";
import { t as formatINR } from "./product-4-DVDiSjDb.mjs";
import { r as ZONES, t as CATEGORY_LABEL } from "./catalog-ChwsJiyw.mjs";
import { O as isRedirect, h as Link, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as Ban, C as Plus, D as Package, E as Pencil, G as CircleAlert, H as ClipboardList, J as Check, L as LayoutGrid, R as Image, W as CircleCheck, X as Boxes, c as Timer, h as ShieldOff, m as Shield, r as Users, s as Trash2, t as X, v as Search, x as RotateCcw } from "../_libs/lucide-react.mjs";
import { i as SiteChrome } from "./chrome-LNFqOEFI.mjs";
import { n as DROPS_KEY, r as useHotSelling, t as DEFAULT_DROPS } from "./hot-selling-Bja2UbkF.mjs";
import { n as h, r as s, t as c } from "../_libs/react-image-crop.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CDA7-5Wx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function assertAdmin() {
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) throw new Error("Forbidden: admin only");
	const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
	if (profile?.role !== "admin") throw new Error("Forbidden: admin only");
}
async function listUsers() {
	await assertAdmin();
	const { data: users, error } = await supabase.from("users").select("*").order("id");
	if (error) throw error;
	return (users || []).map((user) => ({
		id: user.id,
		email: user.email ?? "",
		emailVerified: true,
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		lastSignInAt: null,
		provider: "email",
		roles: user.role ? [user.role] : ["user"],
		disabled: user.disabled || false,
		fullName: user.full_name ?? "",
		phone: user.phone ?? "",
		city: user.city ?? "",
		state: user.state ?? "",
		addressLine1: user.address_line1 ?? "",
		postalCode: user.postal_code ?? ""
	}));
}
async function setUserRole({ data }) {
	await assertAdmin();
	const { data: { user } } = await supabase.auth.getUser();
	if (!data.grant && data.role === "admin" && data.userId === user?.id) throw new Error("You cannot remove your own admin role");
	const { error } = await supabase.from("users").update({ role: data.grant ? data.role : "user" }).eq("id", data.userId);
	if (error) throw error;
	return { ok: true };
}
async function deleteUser({ data }) {
	await assertAdmin();
	const { data: { user } } = await supabase.auth.getUser();
	if (data.userId === user?.id) throw new Error("You cannot delete your own account");
	const { error } = await supabase.from("users").delete().eq("id", data.userId);
	if (error) throw error;
	return { ok: true };
}
async function setUserDisabled({ data }) {
	await assertAdmin();
	const { data: { user } } = await supabase.auth.getUser();
	if (data.userId === user?.id) throw new Error("You cannot disable your own account");
	const { error } = await supabase.from("users").update({ disabled: data.disabled }).eq("id", data.userId);
	if (error) throw error;
	return { ok: true };
}
async function updateUserProfile({ data }) {
	await assertAdmin();
	const { userId, ...profile } = data;
	const dbData = {};
	if (profile.fullName !== void 0) dbData.full_name = profile.fullName;
	if (profile.phone !== void 0) dbData.phone = profile.phone;
	if (profile.addressLine1 !== void 0) dbData.address_line1 = profile.addressLine1;
	if (profile.city !== void 0) dbData.city = profile.city;
	if (profile.state !== void 0) dbData.state = profile.state;
	if (profile.postalCode !== void 0) dbData.postal_code = profile.postalCode;
	const { error } = await supabase.from("users").update(dbData).eq("id", userId);
	if (error) throw error;
	return { ok: true };
}
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
function ImageCropper({ imageUrl, onCropComplete, onCancel }) {
	const [crop, setCrop] = (0, import_react.useState)();
	const [completedCrop, setCompletedCrop] = (0, import_react.useState)();
	const imgRef = (0, import_react.useRef)(null);
	const [aspect, setAspect] = (0, import_react.useState)(4 / 5);
	function onImageLoad(e) {
		if (aspect) {
			const { width, height } = e.currentTarget;
			setCrop(c(s({
				unit: "%",
				width: 90
			}, aspect, width, height), width, height));
		}
	}
	async function generateCroppedImage() {
		if (!completedCrop || !imgRef.current) return;
		const image = imgRef.current;
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		const pixelRatio = window.devicePixelRatio;
		canvas.width = Math.floor(completedCrop.width * scaleX * pixelRatio);
		canvas.height = Math.floor(completedCrop.height * scaleY * pixelRatio);
		ctx.scale(pixelRatio, pixelRatio);
		ctx.imageSmoothingQuality = "high";
		const cropX = completedCrop.x * scaleX;
		const cropY = completedCrop.y * scaleY;
		ctx.translate(-cropX, -cropY);
		ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight);
		onCropComplete(canvas.toDataURL("image/webp", .9));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-surface shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border/50 px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-lg font-semibold",
						children: "Crop Image"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onCancel,
						className: "rounded-full border border-border/60 p-2 hover:bg-white/10 hover:text-white",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 overflow-auto bg-black/50 p-6 flex items-center justify-center min-h-[400px]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(h, {
						crop,
						onChange: (_, percentCrop) => setCrop(percentCrop),
						onComplete: (c) => setCompletedCrop(c),
						aspect,
						className: "max-h-full max-w-full",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							ref: imgRef,
							alt: "Crop preview",
							src: imageUrl,
							onLoad: onImageLoad,
							className: "max-h-[60vh] w-auto object-contain"
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-t border-border/50 px-6 py-4 bg-background",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
							children: "Aspect Ratio"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "rounded-full border border-border/60 bg-transparent px-3 py-1.5 text-xs outline-none focus:border-foreground",
							value: aspect || "",
							onChange: (e) => {
								const val = e.target.value;
								if (val === "") {
									setAspect(void 0);
									setCrop(void 0);
								} else {
									const newAspect = Number(val);
									setAspect(newAspect);
									if (imgRef.current) {
										const { width, height } = imgRef.current;
										setCrop(c(s({
											unit: "%",
											width: 90
										}, newAspect, width, height), width, height));
									}
								}
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "0.8",
									children: "4:5 (Product Grid)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "1",
									children: "1:1 (Square)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "1.7777777777777777",
									children: "16:9 (Hero Banner)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Free form"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: onCancel,
							className: "rounded-full border border-border/70 px-5 py-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: generateCroppedImage,
							disabled: !completedCrop?.width || !completedCrop?.height,
							className: "inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-background hover:bg-brand hover:text-foreground disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Apply Crop"]
						})]
					})]
				})
			]
		})
	});
}
function AdminGate() {
	const { isAdmin } = useShop();
	if (!isAdmin) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md px-6 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-[0.28em] text-brand",
				children: "Restricted"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-3xl font-bold",
				children: "Admin sign-in required"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "This area is only visible to authorised operators."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/login",
				className: "mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background",
				children: "Sign in"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Admin, {});
}
function Admin() {
	const [tab, setTab] = (0, import_react.useState)("products");
	const { products } = useCatalog();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl px-6 pt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.28em] text-brand",
						children: "Atelier control"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl font-bold tracking-tight sm:text-6xl",
						children: "Admin Panel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Local demo · Changes persist in your browser (localStorage). ",
							products.length,
							" products live."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap gap-2 border-b border-border/50 pb-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "products",
						onClick: () => setTab("products"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-3.5 w-3.5" }),
						children: "Products"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "inventory",
						onClick: () => setTab("inventory"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Boxes, { className: "h-3.5 w-3.5" }),
						children: "Inventory"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "orders",
						onClick: () => setTab("orders"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "h-3.5 w-3.5" }),
						children: "Orders"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "users",
						onClick: () => setTab("users"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5" }),
						children: "Users"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "images",
						onClick: () => setTab("images"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-3.5 w-3.5" }),
						children: "Site Images"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "categories",
						onClick: () => setTab("categories"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-3.5 w-3.5" }),
						children: "Categories"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "drops",
						onClick: () => setTab("drops"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "h-3.5 w-3.5" }),
						children: "Schedules"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabBtn, {
						active: tab === "hotSelling",
						onClick: () => setTab("hotSelling"),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-3.5 w-3.5" }),
						children: "Hot Selling"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [
					tab === "products" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductsTab, {}),
					tab === "inventory" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InventoryTab, {}),
					tab === "orders" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrdersTab, {}),
					tab === "users" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UsersTab, {}),
					tab === "images" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImagesTab, {}),
					tab === "categories" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoriesTab, {}),
					tab === "drops" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropsTab, {}),
					tab === "hotSelling" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HotSellingTab, {})
				]
			})
		]
	});
}
function TabBtn({ active, onClick, icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		onClick,
		className: `inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition ${active ? "bg-foreground text-background" : "border border-border/60 text-muted-foreground hover:border-foreground hover:text-foreground"}`,
		children: [icon, children]
	});
}
function ProductsTab() {
	const { products, updateProduct, addProduct, removeProduct } = useCatalog();
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("all");
	const [adding, setAdding] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const list = (0, import_react.useMemo)(() => {
		return products.filter((p) => {
			if (cat !== "all" && p.category !== cat) return false;
			if (q && !(p.name.toLowerCase().includes(q.toLowerCase()) || p.team.toLowerCase().includes(q.toLowerCase()))) return false;
			return true;
		});
	}, [
		products,
		q,
		cat
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search name or team",
						className: "w-64 rounded-full border border-border/70 bg-transparent py-2 pl-9 pr-4 text-xs outline-none focus:border-foreground"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: cat,
					onChange: (e) => setCat(e.target.value),
					className: "rounded-full border border-border/70 bg-transparent px-3 py-2 text-xs outline-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All categories"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "football",
							children: "Football"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "f1",
							children: "Formula 1"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "worldcup",
							children: "World Cup"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "retro",
							children: "Retro"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ml-auto flex gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setAdding(true),
						className: "inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-background",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " New"]
					})
				})
			]
		}),
		adding && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NewProductRow, {
			onSave: async (p) => {
				await addProduct(p);
				setAdding(false);
			},
			onCancel: () => setAdding(false)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 overflow-x-auto rounded-2xl border border-border/50",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[720px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-card/40 text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left",
							children: "Product"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left",
							children: "Category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right",
							children: "Price"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right",
							children: "Stock"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left",
							children: "Badge"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.images[0],
									alt: "",
									className: "h-10 w-8 rounded object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate font-medium",
										children: p.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: p.team
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3 text-xs text-muted-foreground",
							children: [
								CATEGORY_LABEL[p.category],
								p.zone ? ` · Zone` : "",
								p.series ? ` · Legends` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: p.price,
								onChange: (e) => updateProduct(p.id, { price: Number(e.target.value) }),
								className: "w-24 rounded border border-border/60 bg-transparent px-2 py-1 text-right font-mono text-xs"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								value: p.stock,
								onChange: (e) => updateProduct(p.id, { stock: Number(e.target.value) }),
								className: `w-20 rounded border bg-transparent px-2 py-1 text-right font-mono text-xs ${p.stock < 10 ? "border-brand text-brand" : "border-border/60"}`
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: p.badge ?? "",
								onChange: (e) => updateProduct(p.id, { badge: e.target.value || void 0 }),
								placeholder: "—",
								className: "w-24 rounded border border-border/60 bg-transparent px-2 py-1 text-xs"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setEditing(p.id),
									className: "text-muted-foreground hover:text-foreground",
									"aria-label": "Edit",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => confirm(`Remove ${p.name}?`) && removeProduct(p.id),
									className: "text-muted-foreground hover:text-brand",
									"aria-label": "Delete",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})]
							})
						})
					]
				}, p.id)), list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 6,
					className: "p-8 text-center text-xs text-muted-foreground",
					children: "No products match."
				}) })] })]
			})
		}),
		editing && (() => {
			const p = products.find((x) => x.id === editing);
			if (!p) return null;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditProductDrawer, {
				product: p,
				onClose: () => setEditing(null),
				onSave: async (patch) => {
					await updateProduct(p.id, patch);
					setEditing(null);
				}
			});
		})()
	] });
}
function EditProductDrawer({ product, onClose, onSave }) {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const [f, setF] = (0, import_react.useState)({
		name: product.name,
		team: product.team,
		tag: product.tag,
		price: product.price,
		compareAt: product.compareAt ?? 0,
		stock: product.stock,
		badge: product.badge ?? "",
		material: product.material,
		description: product.description,
		colors: product.colors.join(", "),
		sizes: product.sizes.join(", "),
		images: product.images.join("\n"),
		rating: product.rating ?? 4.8,
		reviews: product.reviews ?? 0
	});
	const [cropImageUrl, setCropImageUrl] = (0, import_react.useState)(null);
	const handleCropComplete = (croppedImageUrl) => {
		setF((s) => ({
			...s,
			images: [s.images, croppedImageUrl].filter(Boolean).join("\n")
		}));
		setCropImageUrl(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-[100] flex justify-end bg-background/70 backdrop-blur-sm",
		onClick: onClose,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "h-full w-full max-w-lg overflow-y-auto border-l border-border/50 bg-background p-6 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.28em] text-brand",
						children: "Editing"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-xl font-semibold",
						children: product.name
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-full border border-border/60 p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: f.name,
								onChange: (e) => setF({
									...f,
									name: e.target.value
								}),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Team",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: f.team,
									onChange: (e) => setF({
										...f,
										team: e.target.value
									}),
									className: inputCls
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tag",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: f.tag,
									onChange: (e) => setF({
										...f,
										tag: e.target.value
									}),
									className: inputCls
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Price ₹",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: f.price,
										onChange: (e) => setF({
											...f,
											price: Number(e.target.value)
										}),
										className: inputCls
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Compare ₹",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: f.compareAt,
										onChange: (e) => setF({
											...f,
											compareAt: Number(e.target.value)
										}),
										className: inputCls
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Stock",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: f.stock,
										onChange: (e) => setF({
											...f,
											stock: Number(e.target.value)
										}),
										className: inputCls
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Rating (0-5)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.1",
									min: "0",
									max: "5",
									value: f.rating,
									onChange: (e) => setF({
										...f,
										rating: Number(e.target.value)
									}),
									className: inputCls
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Reviews Count",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min: "0",
									value: f.reviews,
									onChange: (e) => setF({
										...f,
										reviews: Number(e.target.value)
									}),
									className: inputCls
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Badge",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: f.badge,
									onChange: (e) => setF({
										...f,
										badge: e.target.value
									}),
									className: inputCls
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Material",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: f.material,
									onChange: (e) => setF({
										...f,
										material: e.target.value
									}),
									className: inputCls
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Colors (comma-sep)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: f.colors,
								onChange: (e) => setF({
									...f,
									colors: e.target.value
								}),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Sizes (comma-sep)",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: f.sizes,
								onChange: (e) => setF({
									...f,
									sizes: e.target.value
								}),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Field, {
							label: "Images (URLs one per line — or upload files)",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 5,
								value: f.images,
								onChange: (e) => setF({
									...f,
									images: e.target.value
								}),
								className: inputCls + " font-mono text-xs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground",
								children: ["Upload image", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									hidden: true,
									onChange: async (e) => {
										const files = Array.from(e.target.files ?? []);
										if (files.length > 0) {
											const url = await fileToDataUrl(files[0]);
											setCropImageUrl(url);
										}
										e.target.value = "";
									}
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Description",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 4,
								value: f.description,
								onChange: (e) => setF({
									...f,
									description: e.target.value
								}),
								className: inputCls
							})
						}),
						f.images.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
							children: "Preview"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 overflow-x-auto",
							children: f.images.split("\n").filter(Boolean).map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: u.trim(),
								alt: "",
								className: "h-24 w-20 shrink-0 rounded object-cover"
							}, i))
						})] })
					]
				}),
				err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-xs text-brand",
					children: err
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						disabled: loading,
						onClick: async () => {
							setLoading(true);
							setErr(null);
							try {
								await onSave({
									name: f.name,
									team: f.team,
									tag: f.tag,
									price: f.price,
									compareAt: f.compareAt || void 0,
									stock: f.stock,
									badge: f.badge || void 0,
									material: f.material,
									description: f.description,
									colors: f.colors.split(",").map((s) => s.trim()).filter(Boolean),
									sizes: f.sizes.split(",").map((s) => s.trim()).filter(Boolean),
									images: f.images.split("\n").map((s) => s.trim()).filter(Boolean),
									rating: f.rating,
									reviews: f.reviews
								});
							} catch (e) {
								setErr(e instanceof Error ? e.message : "Failed to save changes");
							} finally {
								setLoading(false);
							}
						},
						className: "flex-1 rounded-full bg-foreground py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background disabled:opacity-50",
						children: loading ? "Saving..." : "Save changes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-full border border-border/70 px-5 py-3 text-xs uppercase tracking-[0.24em]",
						children: "Cancel"
					})]
				})
			]
		}), cropImageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageCropper, {
			imageUrl: cropImageUrl,
			onCropComplete: handleCropComplete,
			onCancel: () => setCropImageUrl(null)
		})]
	});
}
var inputCls = "w-full rounded border border-border/60 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground";
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
			children: label
		}), children]
	});
}
function SiteImagesTab() {
	const { get, getDefault, set, overrides, reset } = useSiteImages();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-wrap items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-xl text-xs text-muted-foreground",
			children: "Replace any homepage or editorial image with your own. Paste an image URL — hosted uploads, CDN, or a data URL. Leave blank to restore the shipped default. Product images are managed per-product from the Products tab."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: reset,
			className: "inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-brand",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Reset all"]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 md:grid-cols-2",
		children: SITE_IMAGE_META.map(({ slot, label, description }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteImageRow, {
			slot,
			label,
			description,
			current: get(slot),
			defaultUrl: getDefault(slot),
			overridden: !!overrides[slot],
			onSave: (url) => set(slot, url)
		}, slot))
	})] });
}
function isVideoUrl(url) {
	if (!url) return false;
	return url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg") || url.includes("player.vimeo.com") || url.includes("youtube.com/embed") || url.startsWith("data:video/");
}
function SiteImageRow({ slot, label, description, current, defaultUrl, overridden, onSave }) {
	const [draft, setDraft] = (0, import_react.useState)(overridden ? current : "");
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [uploadError, setUploadError] = (0, import_react.useState)(null);
	const [cropImageUrl, setCropImageUrl] = (0, import_react.useState)(null);
	const onFile = async (f) => {
		if (!f) return;
		try {
			const dataUrl = await fileToDataUrl(f);
			setCropImageUrl(dataUrl);
		} catch (err) {
			setUploadError(err.message || "Failed to read file");
		}
	};
	const handleCropComplete = async (croppedDataUrl) => {
		setCropImageUrl(null);
		setUploading(true);
		setUploadError(null);
		try {
			const blob = await (await fetch(croppedDataUrl)).blob();
			const publicUrl = await uploadSiteImageFile(slot, new File([blob], "cropped.webp", { type: "image/webp" }));
			setDraft(publicUrl);
			onSave(publicUrl);
		} catch (err) {
			setUploadError(err.message || "Upload failed");
			console.error("File upload error:", err);
		} finally {
			setUploading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border/50 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative h-24 w-32 shrink-0 overflow-hidden rounded-lg border border-border/40 bg-surface",
					children: isVideoUrl(current) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: current,
						muted: true,
						autoPlay: true,
						loop: true,
						playsInline: true,
						className: "h-full w-full object-cover"
					}) : current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: current,
						alt: "",
						className: "h-full w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-full w-full items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground/50",
						children: "Empty"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-display text-sm font-semibold",
								children: label
							}), overridden && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full border border-brand/50 bg-brand/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-brand",
								children: "Custom"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5 text-[11px] text-muted-foreground",
							children: description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-0.5 font-mono text-[10px] text-muted-foreground/70",
							children: ["slot: ", slot]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						placeholder: "https://… or paste an image URL",
						className: "w-full rounded border border-border/60 bg-transparent px-3 py-2 text-sm outline-none focus:border-foreground font-mono text-xs"
					}),
					uploadError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-red-400",
						children: uploadError
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: `inline-flex cursor-pointer items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground ${uploading ? "pointer-events-none opacity-50" : ""}`,
								children: [uploading ? "Uploading…" : "Upload file", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*,video/*",
									hidden: true,
									onChange: (e) => onFile(e.target.files?.[0] ?? null),
									disabled: uploading
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => onSave(draft || null),
								className: "rounded-full bg-foreground px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-background",
								children: "Save"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setDraft("");
									onSave(null);
								},
								disabled: !overridden,
								className: "rounded-full border border-border/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground disabled:opacity-40",
								children: "Reset"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: defaultUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "ml-auto text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground",
								children: "Default ↗"
							})
						]
					})
				]
			}),
			cropImageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageCropper, {
				imageUrl: cropImageUrl,
				onCropComplete: handleCropComplete,
				onCancel: () => setCropImageUrl(null)
			})
		]
	});
}
var STATUS_STYLE = {
	awaiting_payment: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40",
	pending: "bg-amber-500/20 text-amber-300 border-amber-500/40",
	processing: "bg-sky-500/20 text-sky-300 border-sky-500/40",
	shipped: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
	delivered: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
	cancelled: "bg-rose-500/20 text-rose-300 border-rose-500/40"
};
function OrdersTab() {
	const { orders, updateOrderStatus, removeOrder } = useShop();
	const { getById } = useCatalog();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const list = orders.filter((o) => filter === "all" || o.status === filter);
	const stats = {
		all: orders.length,
		awaiting_payment: orders.filter((o) => o.status === "awaiting_payment").length,
		pending: orders.filter((o) => o.status === "pending").length,
		processing: orders.filter((o) => o.status === "processing").length,
		shipped: orders.filter((o) => o.status === "shipped").length,
		delivered: orders.filter((o) => o.status === "delivered").length,
		cancelled: orders.filter((o) => o.status === "cancelled").length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: [
				"all",
				"awaiting_payment",
				"pending",
				"processing",
				"shipped",
				"delivered",
				"cancelled"
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setFilter(s),
				className: `rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] ${filter === s ? "border-foreground bg-foreground text-background" : "border-border/60 text-muted-foreground"}`,
				children: [
					s,
					" · ",
					stats[s]
				]
			}, s))
		}),
		list.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 rounded-2xl border border-dashed border-border/50 p-10 text-center text-sm text-muted-foreground",
			children: "No orders yet. Place one from the storefront and it will appear here."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-3",
			children: list.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/50 p-4 sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs",
									children: o.id
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-[0.22em] ${STATUS_STYLE[o.status]}`,
									children: o.status
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: [
									new Date(o.createdAt).toLocaleString(),
									" · ",
									o.customer.name || "—",
									" · ",
									o.customer.email || "no email",
									" · ",
									o.customer.city || "—"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: o.status,
								onChange: (e) => updateOrderStatus(o.id, e.target.value),
								className: "rounded-full border border-border/60 bg-transparent px-3 py-1.5 text-[11px] uppercase tracking-[0.2em]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "awaiting_payment",
										children: "Awaiting payment"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "pending",
										children: "Pending"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "processing",
										children: "Processing"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "shipped",
										children: "Shipped"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "delivered",
										children: "Delivered"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "cancelled",
										children: "Cancelled"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => confirm(`Delete order ${o.id}?`) && removeOrder(o.id),
								className: "text-muted-foreground hover:text-brand",
								"aria-label": "Delete order",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-2 border-t border-border/40 pt-3",
						children: o.items.map((it, i) => {
							const p = getById(it.id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-xs",
								children: [
									p?.images[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: p.images[0],
										alt: "",
										className: "h-10 w-8 rounded object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1 truncate",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											p?.name ?? it.id,
											" · ",
											it.size,
											" · ",
											it.color
										] }), (it.customName || it.customNumber) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "font-mono text-[10px] text-brand uppercase tracking-wider font-semibold",
											children: [
												"Print: ",
												it.customName || "NO NAME",
												" #",
												it.customNumber || "00"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground",
										children: ["× ", it.qty]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-20 text-right font-mono",
										children: formatINR((p?.price ?? 0) * it.qty)
									})
								]
							}, i);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex justify-end gap-6 border-t border-border/40 pt-3 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Subtotal"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: formatINR(o.subtotal)
								})
							] }),
							o.discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-brand",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "B2G1" }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-mono",
										children: ["−", formatINR(o.discount)]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Ship"
								}),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: o.shipping === 0 ? "Free" : formatINR(o.shipping)
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: formatINR(o.total)
									})
								]
							})
						]
					}),
					o.payment?.method === "upi" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/40 bg-card/40 px-3 py-2 text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-x-4 gap-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "uppercase tracking-[0.22em] text-muted-foreground",
									children: o.payment.mode === "cod" ? "COD (₹80 Prepaid)" : "UPI"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "VPA"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: o.payment.vpa
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "UTR"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: o.payment.txnId
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Paid"
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: formatINR(o.payment.paidNow ?? o.total)
									})
								] }),
								(o.payment.codDue ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-amber-300",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "COD due"
										}),
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono",
											children: formatINR(o.payment.codDue)
										})
									]
								})
							]
						}), o.status === "awaiting_payment" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => updateOrderStatus(o.id, "processing"),
								className: "rounded-full border border-emerald-500/50 bg-emerald-500/15 px-3 py-1 uppercase tracking-[0.2em] text-emerald-300 hover:bg-emerald-500/25",
								children: "Mark paid"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => updateOrderStatus(o.id, "cancelled"),
								className: "rounded-full border border-rose-500/50 bg-rose-500/10 px-3 py-1 uppercase tracking-[0.2em] text-rose-300 hover:bg-rose-500/20",
								children: "Reject"
							})]
						})]
					})
				]
			}, o.id))
		})
	] });
}
function NewProductRow({ onSave, onCancel }) {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const [f, setF] = (0, import_react.useState)({
		id: "",
		name: "",
		team: "",
		driver: "",
		category: "football",
		zone: "",
		series: "",
		price: 5e3,
		compareAt: 0,
		stock: 20,
		tag: "New Piece",
		badge: "",
		material: "Premium cotton",
		description: "",
		colors: "Default",
		sizes: "S, M, L, XL",
		images: [],
		rating: 4.8,
		reviews: 124
	});
	const [cropImageUrl, setCropImageUrl] = (0, import_react.useState)(null);
	const addFiles = async (files) => {
		if (!files || files.length === 0) return;
		const url = await fileToDataUrl(files[0]);
		setCropImageUrl(url);
	};
	const handleCropComplete = (croppedImageUrl) => {
		setF((s) => ({
			...s,
			images: [...s.images, croppedImageUrl]
		}));
		setCropImageUrl(null);
	};
	const removeImg = (i) => setF((s) => ({
		...s,
		images: s.images.filter((_, idx) => idx !== i)
	}));
	const addUrl = () => {
		const u = prompt("Paste an image URL");
		if (u) setF((s) => ({
			...s,
			images: [...s.images, u.trim()]
		}));
	};
	const slug = (v) => v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 rounded-2xl border border-brand/40 bg-card/40 p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 text-[10px] uppercase tracking-[0.24em] text-brand",
				children: "New product"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "ID (slug)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.id,
							onChange: (e) => setF({
								...f,
								id: e.target.value
							}),
							onBlur: () => !f.id && f.name && setF((s) => ({
								...s,
								id: slug(s.name)
							})),
							placeholder: "auto from name",
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.name,
							onChange: (e) => setF({
								...f,
								name: e.target.value
							}),
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Team",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.team,
							onChange: (e) => setF({
								...f,
								team: e.target.value
							}),
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Category",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: f.category,
							onChange: (e) => setF({
								...f,
								category: e.target.value
							}),
							className: inputCls,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "football",
									children: "Football"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "f1",
									children: "Formula 1"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "worldcup",
									children: "World Cup"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "retro",
									children: "Retro"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Zone (optional)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: f.zone,
							onChange: (e) => setF({
								...f,
								zone: e.target.value
							}),
							className: inputCls,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "— None —"
							}), ZONES.map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: z.slug,
								children: z.name
							}, z.slug))]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Special edition",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: f.series,
							onChange: (e) => setF({
								...f,
								series: e.target.value
							}),
							className: inputCls,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "— None —"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "legends",
								children: "Legends Series"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Driver (F1 only)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.driver,
							onChange: (e) => setF({
								...f,
								driver: e.target.value
							}),
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Tag",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.tag,
							onChange: (e) => setF({
								...f,
								tag: e.target.value
							}),
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Badge",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.badge,
							onChange: (e) => setF({
								...f,
								badge: e.target.value
							}),
							placeholder: "e.g. New, Limited",
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Price ₹",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: f.price,
							onChange: (e) => setF({
								...f,
								price: Number(e.target.value)
							}),
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Compare ₹",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: f.compareAt,
							onChange: (e) => setF({
								...f,
								compareAt: Number(e.target.value)
							}),
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Stock",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							value: f.stock,
							onChange: (e) => setF({
								...f,
								stock: Number(e.target.value)
							}),
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Rating (0-5)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							step: "0.1",
							min: "0",
							max: "5",
							value: f.rating,
							onChange: (e) => setF({
								...f,
								rating: Number(e.target.value)
							}),
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Reviews Count",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "number",
							min: "0",
							value: f.reviews,
							onChange: (e) => setF({
								...f,
								reviews: Number(e.target.value)
							}),
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Material",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.material,
							onChange: (e) => setF({
								...f,
								material: e.target.value
							}),
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Colors (comma-sep)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.colors,
							onChange: (e) => setF({
								...f,
								colors: e.target.value
							}),
							className: inputCls
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Sizes (comma-sep)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: f.sizes,
							onChange: (e) => setF({
								...f,
								sizes: e.target.value
							}),
							className: inputCls
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Description",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 3,
						value: f.description,
						onChange: (e) => setF({
							...f,
							description: e.target.value
						}),
						className: inputCls
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
					children: "Images"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						f.images.map((u, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: u,
								alt: "",
								className: "h-20 w-16 rounded object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => removeImg(i),
								className: "absolute -right-1 -top-1 rounded-full bg-background/90 p-0.5 shadow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
							})]
						}, i)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-20 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded border border-dashed border-border/60 text-[9px] uppercase tracking-[0.18em] text-muted-foreground hover:border-foreground hover:text-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }),
								" Upload",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									hidden: true,
									onChange: (e) => {
										addFiles(e.target.files);
										e.target.value = "";
									}
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: addUrl,
							className: "flex h-20 w-16 flex-col items-center justify-center gap-1 rounded border border-dashed border-border/60 text-[9px] uppercase tracking-[0.18em] text-muted-foreground hover:border-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4" }), " URL"]
						})
					]
				})]
			}),
			cropImageUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageCropper, {
				imageUrl: cropImageUrl,
				onCropComplete: handleCropComplete,
				onCancel: () => setCropImageUrl(null)
			}),
			err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-xs text-brand",
				children: err
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					disabled: loading,
					onClick: async () => {
						const id = f.id || slug(f.name);
						if (!id || !f.name || !f.team) return alert("Name and team are required");
						if (f.images.length === 0) return alert("Add at least one image");
						setLoading(true);
						setErr(null);
						try {
							await onSave({
								id,
								name: f.name,
								category: f.category,
								zone: f.zone || void 0,
								series: f.series || void 0,
								team: f.team,
								driver: f.driver || void 0,
								tag: f.tag,
								price: f.price,
								compareAt: f.compareAt || void 0,
								stock: f.stock,
								badge: f.badge || void 0,
								colors: f.colors.split(",").map((s) => s.trim()).filter(Boolean),
								sizes: f.sizes.split(",").map((s) => s.trim()).filter(Boolean),
								images: f.images,
								description: f.description || "Custom piece added via Admin.",
								material: f.material || "—",
								rating: f.rating,
								reviews: f.reviews
							});
						} catch (e) {
							setErr(e instanceof Error ? e.message : "Failed to save product");
						} finally {
							setLoading(false);
						}
					},
					className: "rounded-full bg-foreground px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-background disabled:opacity-50",
					children: loading ? "Saving..." : "Save product"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onCancel,
					className: "rounded-full border border-border/70 px-5 py-2 text-[11px] uppercase tracking-[0.22em]",
					children: "Cancel"
				})]
			})
		]
	});
}
function fileToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const r = new FileReader();
		r.onload = () => resolve(String(r.result || ""));
		r.onerror = () => reject(r.error);
		r.readAsDataURL(file);
	});
}
function InventoryTab() {
	const { products, updateProduct } = useCatalog();
	const low = products.filter((p) => p.stock < 10);
	const getSizeStock = (p, size) => {
		if (p.stockBySize && p.stockBySize[size] !== void 0) return p.stockBySize[size];
		return p.sizes.length > 0 ? Math.floor(p.stock / p.sizes.length) : p.stock;
	};
	const updateSizeStock = (p, size, newVal) => {
		const current = p.stockBySize || {};
		const updated = {};
		for (const s of p.sizes) updated[s] = current[s] !== void 0 ? current[s] : getSizeStock(p, s);
		updated[size] = Math.max(0, newVal);
		const totalStock = Object.values(updated).reduce((a, b) => a + b, 0);
		updateProduct(p.id, {
			stockBySize: updated,
			stock: totalStock
		}).catch((err) => {
			alert("Failed to update stock: " + err.message + "\n\nMake sure 'stock_by_size' column (type JSONB) exists in Supabase products table.");
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [low.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex items-start gap-3 rounded-xl border border-brand/40 bg-brand/10 p-4 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", {
			className: "text-brand",
			children: [
				"Low stock alert · ",
				low.length,
				" items"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-muted-foreground",
			children: low.map((p) => p.name).join(" · ")
		})] })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
		children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `rounded-2xl border p-4 ${p.stock < 10 ? "border-brand/60" : "border-border/50"}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.images[0],
						alt: "",
						className: "h-14 w-11 rounded object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-sm font-medium",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
							children: CATEGORY_LABEL[p.category]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-xs",
							children: formatINR(p.price)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-0.5 text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
							children: ["Total: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-foreground",
								children: p.stock
							})]
						})]
					})
				]
			}), p.sizes.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
					children: "Stock by Size"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-1.5",
					children: p.sizes.map((size) => {
						const sizeVal = getSizeStock(p, size);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border border-border/40 px-3 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium w-10",
								children: size
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center rounded-full border border-border/70",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => updateSizeStock(p, size, sizeVal - 1),
										className: "px-2.5 py-0.5 text-sm",
										children: "−"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `w-8 text-center font-mono text-xs ${sizeVal < 5 ? "text-brand" : ""}`,
										children: sizeVal
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => updateSizeStock(p, size, sizeVal + 1),
										className: "px-2.5 py-0.5 text-sm",
										children: "+"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => updateSizeStock(p, size, sizeVal + 10),
										className: "border-l border-border/70 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em]",
										children: "+10"
									})
								]
							})]
						}, size);
					})
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
					children: "Stock"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "inline-flex items-center rounded-full border border-border/70",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => updateProduct(p.id, { stock: Math.max(0, p.stock - 1) }).catch((e) => alert(e.message)),
							className: "px-3 py-1",
							children: "−"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-10 text-center font-mono text-sm",
							children: p.stock
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => updateProduct(p.id, { stock: p.stock + 1 }).catch((e) => alert(e.message)),
							className: "px-3 py-1",
							children: "+"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => updateProduct(p.id, { stock: p.stock + 10 }).catch((e) => alert(e.message)),
							className: "border-l border-border/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em]",
							children: "+10"
						})
					]
				})]
			})]
		}, p.id))
	})] });
}
function CategoriesTab() {
	const { products } = useCatalog();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-2",
		children: [
			"football",
			"f1",
			"worldcup",
			"retro"
		].map((c) => {
			const items = products.filter((p) => p.category === c);
			const stock = items.reduce((a, b) => a + b.stock, 0);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border/50 p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.24em] text-brand",
						children: "Category"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 font-display text-2xl font-semibold",
						children: CATEGORY_LABEL[c]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-3xl",
							children: items.length
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
							children: "Products"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-3 gap-3 border-t border-border/40 pt-4 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground",
							children: "Units in stock"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-mono",
							children: stock
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground",
							children: "Avg. price"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-mono",
							children: items.length ? formatINR(items.reduce((a, b) => a + b.price, 0) / items.length) : "—"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground",
							children: "Teams"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-mono",
							children: new Set(items.map((i) => i.team)).size
						})] })
					]
				})]
			}, c);
		})
	});
}
function toLocalInput(ts) {
	const d = new Date(ts);
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function DropsTab() {
	const { products } = useCatalog();
	const [drops, setDrops] = (0, import_react.useState)(DEFAULT_DROPS);
	const [dropsLoaded, setDropsLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(DROPS_KEY);
			if (raw) setDrops(JSON.parse(raw));
		} catch {}
		setDropsLoaded(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!dropsLoaded) return;
		try {
			localStorage.setItem(DROPS_KEY, JSON.stringify(drops));
		} catch {}
	}, [drops, dropsLoaded]);
	const update = (id, patch) => setDrops((d) => d.map((x) => x.id === id ? {
		...x,
		...patch
	} : x));
	const add = () => setDrops((d) => [...d, {
		id: `drop-${Date.now()}`,
		name: "New Drop",
		eyebrow: "Capsule",
		productId: products[0]?.id ?? "",
		endsAt: Date.now() + 7 * 864e5
	}]);
	const remove = (id) => setDrops((d) => d.filter((x) => x.id !== id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-4 flex justify-end",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: add,
			className: "inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-background",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " New drop"]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4",
		children: drops.map((d) => {
			const p = products.find((x) => x.id === d.productId);
			const left = d.endsAt - Date.now();
			const days = Math.max(0, Math.floor(left / 864e5));
			const hours = Math.max(0, Math.floor(left / 36e5 % 24));
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 rounded-2xl border border-border/50 p-5 md:grid-cols-[1fr_auto]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: d.name,
							onChange: (e) => update(d.id, { name: e.target.value }),
							className: "mt-1 w-full rounded border border-border/60 bg-transparent px-3 py-2 text-sm"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
							children: "Eyebrow"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: d.eyebrow,
							onChange: (e) => update(d.id, { eyebrow: e.target.value }),
							className: "mt-1 w-full rounded border border-border/60 bg-transparent px-3 py-2 text-sm"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
							children: "Product"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: d.productId,
							onChange: (e) => update(d.id, { productId: e.target.value }),
							className: "mt-1 w-full rounded border border-border/60 bg-transparent px-3 py-2 text-sm",
							children: products.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: x.id,
								children: x.name
							}, x.id))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
							children: "Ends at"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "datetime-local",
							value: toLocalInput(d.endsAt),
							onChange: (e) => update(d.id, { endsAt: new Date(e.target.value).getTime() }),
							className: "mt-1 w-full rounded border border-border/60 bg-transparent px-3 py-2 text-sm"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "sm:col-span-2 text-[11px] text-muted-foreground",
							children: p ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								"Preview: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "text-foreground",
									children: p.name
								}),
								" · ",
								formatINR(p.price),
								" · ",
								days,
								"d ",
								hours,
								"h remaining"
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-brand",
								children: "Select a product"
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex md:flex-col items-start gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => remove(d.id),
						className: "inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-brand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Delete"]
					})
				})]
			}, d.id);
		})
	})] });
}
function UsersTab() {
	const list = useServerFn(listUsers);
	const setRole = useServerFn(setUserRole);
	const del = useServerFn(deleteUser);
	const setDisabled = useServerFn(setUserDisabled);
	const updProfile = useServerFn(updateUserProfile);
	const [users, setUsers] = (0, import_react.useState)(null);
	const [err, setErr] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const { userId: myId } = useShop();
	const reload = async () => {
		setErr(null);
		try {
			const data = await list();
			setUsers(data);
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Failed to load users");
		}
	};
	(0, import_react.useEffect)(() => {
		reload();
	}, []);
	const doAction = async (id, fn) => {
		setBusy(id);
		setErr(null);
		try {
			await fn();
			await reload();
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Action failed");
		} finally {
			setBusy(null);
		}
	};
	const filtered = (users ?? []).filter((u) => {
		if (!q) return true;
		const s = q.toLowerCase();
		return u.email.toLowerCase().includes(s) || u.fullName.toLowerCase().includes(s);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search email or name",
					className: "w-72 rounded-full border border-border/70 bg-transparent py-2 pl-9 pr-4 text-xs outline-none focus:border-foreground"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: reload,
				className: "ml-auto inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Refresh"]
			})]
		}),
		err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-xs text-brand",
			children: err
		}),
		users === null && !err && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 text-center text-xs text-muted-foreground",
			children: "Loading users…"
		}),
		users !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 overflow-x-auto rounded-2xl border border-border/50",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[900px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-card/40 text-[10px] uppercase tracking-[0.22em] text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left",
							children: "User"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left",
							children: "Provider"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left",
							children: "Roles"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left",
							children: "Verified"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-left",
							children: "Last sign-in"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.map((u) => {
					const isAdmin = u.roles.includes("admin");
					const isMe = u.id === myId;
					const b = busy === u.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: `border-t border-border/40 ${u.disabled ? "opacity-60" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-medium",
									children: [u.email, isMe && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 text-[10px] text-brand",
										children: "(you)"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-muted-foreground",
									children: [
										u.fullName || "—",
										" · ",
										u.city || "no city"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-xs capitalize text-muted-foreground",
								children: u.provider
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full border border-brand/50 bg-brand/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-brand",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3 w-3" }), "Admin"]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
									children: "User"
								}), u.disabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-2 rounded-full border border-rose-500/50 bg-rose-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-rose-400",
									children: "Disabled"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: u.emailVerified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] uppercase tracking-[0.2em] text-amber-400",
									children: "Pending"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-[11px] text-muted-foreground",
								children: u.lastSignInAt ? new Date(u.lastSignInAt).toLocaleString() : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											disabled: b,
											onClick: () => setEditing(u),
											className: "text-muted-foreground hover:text-foreground disabled:opacity-40",
											"aria-label": "Edit",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											disabled: b || isMe,
											onClick: () => doAction(u.id, () => setRole({ data: {
												userId: u.id,
												role: "admin",
												grant: !isAdmin
											} })),
											className: "text-muted-foreground hover:text-brand disabled:opacity-40",
											title: isAdmin ? "Revoke admin" : "Make admin",
											children: isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											disabled: b || isMe,
											onClick: () => doAction(u.id, () => setDisabled({ data: {
												userId: u.id,
												disabled: !u.disabled
											} })),
											className: "text-muted-foreground hover:text-amber-400 disabled:opacity-40",
											title: u.disabled ? "Enable account" : "Disable account",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											disabled: b || isMe,
											onClick: () => {
												if (confirm(`Permanently delete ${u.email}?`)) doAction(u.id, () => del({ data: { userId: u.id } }));
											},
											className: "text-muted-foreground hover:text-brand disabled:opacity-40",
											title: "Delete account",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})
									]
								})
							})
						]
					}, u.id);
				}), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 6,
					className: "p-8 text-center text-xs text-muted-foreground",
					children: "No users match."
				}) })] })]
			})
		}),
		editing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditUserDrawer, {
			user: editing,
			onClose: () => setEditing(null),
			onSave: async (patch) => {
				try {
					await updProfile({ data: {
						userId: editing.id,
						...patch
					} });
					setEditing(null);
					await reload();
				} catch (e) {
					setErr(e instanceof Error ? e.message : "Save failed");
				}
			}
		})
	] });
}
function EditUserDrawer({ user, onClose, onSave }) {
	const [f, setF] = (0, import_react.useState)({
		fullName: user.fullName,
		phone: user.phone,
		addressLine1: user.addressLine1,
		city: user.city,
		state: user.state,
		postalCode: user.postalCode
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[100] flex justify-end bg-background/70 backdrop-blur-sm",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: (e) => e.stopPropagation(),
			className: "h-full w-full max-w-md overflow-y-auto border-l border-border/50 bg-background p-6 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] uppercase tracking-[0.28em] text-brand",
						children: "Editing profile"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-lg font-semibold",
						children: user.email
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-full border border-border/60 p-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 space-y-4 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Full name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: f.fullName,
								onChange: (e) => setF({
									...f,
									fullName: e.target.value
								}),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Phone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: f.phone,
								onChange: (e) => setF({
									...f,
									phone: e.target.value
								}),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Address",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: f.addressLine1,
								onChange: (e) => setF({
									...f,
									addressLine1: e.target.value
								}),
								className: inputCls
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "City",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: f.city,
									onChange: (e) => setF({
										...f,
										city: e.target.value
									}),
									className: inputCls
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "State",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: f.state,
									onChange: (e) => setF({
										...f,
										state: e.target.value
									}),
									className: inputCls
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Postal code",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: f.postalCode,
								onChange: (e) => setF({
									...f,
									postalCode: e.target.value
								}),
								className: inputCls
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onSave(f),
						className: "flex-1 rounded-full bg-foreground py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background",
						children: "Save changes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-full border border-border/70 px-5 py-3 text-xs uppercase tracking-[0.24em]",
						children: "Cancel"
					})]
				})
			]
		})
	});
}
function HotSellingTab() {
	const { products } = useCatalog();
	const { hotSellingIds, setHotSellingIds } = useHotSelling();
	const selectedProducts = hotSellingIds.map((id) => products.find((p) => p.id === id)).filter(Boolean);
	const availableProducts = products.filter((p) => !hotSellingIds.includes(p.id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 md:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border/50 p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-bold",
					children: "Current Hot Selling Kits"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "These appear in the mobile app carousel (maximum 7)."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-2",
					children: [selectedProducts.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border/40 p-2 bg-card/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-xs text-muted-foreground w-4",
									children: [i + 1, "."]
								}),
								p.images[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: p.images[0],
									className: "h-10 w-8 rounded object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium truncate max-w-[150px]",
									children: p.name
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setHotSellingIds(hotSellingIds.filter((id) => id !== p.id)),
							className: "rounded-full bg-brand/10 p-2 text-brand hover:bg-brand/20 transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})]
					}, p.id)), selectedProducts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-dashed border-border/50 p-6 text-center text-xs text-muted-foreground",
						children: "No kits selected. Default logic will be used."
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border/50 p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-bold",
					children: "Add Kits"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Select kits to feature on the homepage."
				}),
				selectedProducts.length >= 7 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded border border-brand/50 bg-brand/10 p-3 text-xs text-brand",
					children: "You have reached the maximum of 7 featured kits. Remove some to add others."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-[400px] overflow-y-auto pr-2 space-y-2",
					children: availableProducts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border/40 p-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-sm",
							children: [p.images[0] && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: p.images[0],
								className: "h-10 w-8 rounded object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate w-[180px] text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium truncate",
									children: p.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground",
									children: p.team
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setHotSellingIds([...hotSellingIds, p.id]),
							className: "rounded-full bg-foreground px-3 py-1 text-[10px] uppercase tracking-wider text-background hover:bg-foreground/80 transition-colors",
							children: "Add"
						})]
					}, p.id))
				})
			]
		})]
	});
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteChrome, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminGate, {}) });
//#endregion
export { SplitComponent as component };
