import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-DS8gFNjW.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-CiUyHq21.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function usePersistedState(key, initial) {
	const [state, setState] = (0, import_react.useState)(initial);
	const [loaded, setLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(key);
			if (raw) setState(JSON.parse(raw));
		} catch {}
		setLoaded(true);
	}, [key]);
	(0, import_react.useEffect)(() => {
		if (!loaded) return;
		try {
			localStorage.setItem(key, JSON.stringify(state));
		} catch {}
	}, [
		key,
		state,
		loaded
	]);
	return [state, setState];
}
var Ctx = (0, import_react.createContext)(null);
function ShopProvider({ children }) {
	const [cart, setCart] = usePersistedState("veloce.cart", []);
	const [wishlist, setWishlist] = usePersistedState("veloce.wishlist", []);
	const [recent, setRecent] = usePersistedState("veloce.recent", []);
	const [orders, setOrders] = usePersistedState("veloce.orders", []);
	const [cartOpen, setCartOpen] = (0, import_react.useState)(false);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const [userId, setUserId] = (0, import_react.useState)(null);
	const [userEmail, setUserEmail] = (0, import_react.useState)(null);
	const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
	const [authLoading, setAuthLoading] = (0, import_react.useState)(true);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const updateProfile = (0, import_react.useCallback)(async (p) => {
		if (!userId) return;
		try {
			const dbData = {};
			if (p.fullName !== void 0) dbData.full_name = p.fullName;
			if (p.phone !== void 0) dbData.phone = p.phone;
			if (p.addressLine1 !== void 0) dbData.address_line1 = p.addressLine1;
			if (p.addressLine2 !== void 0) dbData.address_line2 = p.addressLine2;
			if (p.city !== void 0) dbData.city = p.city;
			if (p.state !== void 0) dbData.state = p.state;
			if (p.postalCode !== void 0) dbData.postal_code = p.postalCode;
			if (p.country !== void 0) dbData.country = p.country;
			const { error } = await supabase.from("users").update(dbData).eq("id", userId);
			if (error) throw error;
			setProfile((prev) => prev ? {
				...prev,
				...p
			} : null);
		} catch (err) {
			console.error("Failed to update profile in Supabase:", err);
		}
	}, [userId]);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		const handleAuthChange = async (event, session) => {
			if (!mounted) return;
			const user = session?.user ?? null;
			if (user) {
				const uId = user.id;
				const uEmail = user.email || null;
				setUserId(uId);
				setUserEmail(uEmail);
				let userProfile = null;
				try {
					const { data, error } = await supabase.from("users").select("*").eq("id", uId).single();
					if (error && error.code !== "PGRST116") throw error;
					if (data) userProfile = {
						id: data.id,
						email: uEmail || "",
						role: data.role || "user",
						disabled: data.disabled || false,
						fullName: data.full_name || "",
						phone: data.phone || "",
						addressLine1: data.address_line1 || "",
						addressLine2: data.address_line2 || "",
						city: data.city || "",
						state: data.state || "",
						postalCode: data.postal_code || "",
						country: data.country || "",
						cart: data.cart || [],
						wishlist: data.wishlist || []
					};
					else userProfile = {
						id: uId,
						email: uEmail || "",
						role: "user",
						disabled: false,
						cart: [],
						wishlist: []
					};
					setProfile(userProfile);
					setIsAdmin(userProfile.role === "admin");
				} catch (err) {
					console.error("Failed to fetch user profile:", err);
				}
				const dbCart = userProfile?.cart || [];
				const dbWishlist = userProfile?.wishlist || [];
				setCart((currentCart) => {
					const mergedCart = [...currentCart];
					dbCart.forEach((dbItem) => {
						const idx = mergedCart.findIndex((item) => item.id === dbItem.id && item.size === dbItem.size && item.color === dbItem.color && item.customName === dbItem.customName && item.customNumber === dbItem.customNumber);
						if (idx >= 0) mergedCart[idx].qty = Math.max(mergedCart[idx].qty, dbItem.qty);
						else mergedCart.push(dbItem);
					});
					supabase.from("users").update({ cart: mergedCart }).eq("id", uId).then(({ error }) => {
						if (error) console.error("Failed to sync cart on login:", error);
					});
					return mergedCart;
				});
				setWishlist((currentWishlist) => {
					const mergedWishlist = Array.from(/* @__PURE__ */ new Set([...currentWishlist, ...dbWishlist]));
					supabase.from("users").update({ wishlist: mergedWishlist }).eq("id", uId).then(({ error }) => {
						if (error) console.error("Failed to sync wishlist on login:", error);
					});
					return mergedWishlist;
				});
				try {
					let query = supabase.from("orders").select("*");
					if (userProfile?.role !== "admin") query = query.eq("user_id", uId);
					const { data: dbOrdersData, error: ordersError } = await query.order("created_at", { ascending: false });
					if (ordersError) throw ordersError;
					const dbOrders = (dbOrdersData || []).map((r) => ({
						id: r.id,
						createdAt: new Date(r.created_at).getTime(),
						items: r.items,
						total: Number(r.total),
						subtotal: Number(r.subtotal),
						discount: Number(r.discount || 0),
						shipping: Number(r.shipping || 0),
						tax: Number(r.tax || 0),
						status: r.status,
						customer: r.customer,
						payment: r.payment
					}));
					setOrders(dbOrders);
				} catch (e) {
					console.error("Failed to load user orders:", e);
				}
			} else {
				setUserId(null);
				setUserEmail(null);
				setProfile(null);
				setIsAdmin(false);
				setOrders([]);
				setCart([]);
				setWishlist([]);
			}
			setAuthLoading(false);
		};
		const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
			handleAuthChange(event, session);
		});
		supabase.auth.getSession().then(({ data: { session } }) => {
			handleAuthChange("INITIAL", session);
		});
		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!authLoading && userId) supabase.from("users").update({ cart }).eq("id", userId).then(({ error }) => {
			if (error) console.error("Failed to sync cart to Supabase:", error);
		});
	}, [
		cart,
		userId,
		authLoading
	]);
	(0, import_react.useEffect)(() => {
		if (!authLoading && userId) supabase.from("users").update({ wishlist }).eq("id", userId).then(({ error }) => {
			if (error) console.error("Failed to sync wishlist to Supabase:", error);
		});
	}, [
		wishlist,
		userId,
		authLoading
	]);
	const addToCart = (0, import_react.useCallback)((i, maxStock) => {
		setCart((prev) => {
			const idx = prev.findIndex((x) => x.id === i.id && x.size === i.size && x.color === i.color && x.customName === i.customName && x.customNumber === i.customNumber);
			if (idx >= 0) {
				const copy = [...prev];
				const newQty = copy[idx].qty + i.qty;
				copy[idx] = {
					...copy[idx],
					qty: maxStock !== void 0 ? Math.min(maxStock, newQty) : newQty
				};
				return copy;
			}
			return [...prev, i];
		});
		setCartOpen(true);
	}, [setCart]);
	const updateQty = (0, import_react.useCallback)((id, size, color, qty, customName, customNumber) => {
		setCart((prev) => prev.map((x) => x.id === id && x.size === size && x.color === color && x.customName === customName && x.customNumber === customNumber ? {
			...x,
			qty: Math.max(1, qty)
		} : x));
	}, [setCart]);
	const removeFromCart = (0, import_react.useCallback)((id, size, color, customName, customNumber) => {
		setCart((prev) => prev.filter((x) => !(x.id === id && x.size === size && x.color === color && x.customName === customName && x.customNumber === customNumber)));
	}, [setCart]);
	const clearCart = (0, import_react.useCallback)(() => setCart([]), [setCart]);
	const toggleWishlist = (0, import_react.useCallback)((id) => {
		setWishlist((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
	}, [setWishlist]);
	const pushRecent = (0, import_react.useCallback)((q) => {
		if (!q.trim()) return;
		setRecent((prev) => [q, ...prev.filter((x) => x !== q)].slice(0, 6));
	}, [setRecent]);
	const signOut = (0, import_react.useCallback)(async () => {
		await supabase.auth.signOut();
	}, []);
	const placeOrder = (0, import_react.useCallback)(async (o) => {
		const dbData = {
			user_id: (await supabase.auth.getUser()).data.user?.id || null,
			items: o.items,
			subtotal: o.subtotal,
			discount: o.discount,
			shipping: o.shipping,
			tax: o.tax,
			total: o.total,
			status: o.status ?? "pending",
			customer: o.customer,
			payment: o.payment
		};
		try {
			const { data: record, error } = await supabase.from("orders").insert(dbData).select("*").single();
			if (error) throw error;
			const newOrder = {
				id: record.id,
				createdAt: new Date(record.created_at).getTime(),
				items: record.items,
				total: Number(record.total),
				subtotal: Number(record.subtotal),
				discount: Number(record.discount || 0),
				shipping: Number(record.shipping || 0),
				tax: Number(record.tax || 0),
				status: record.status,
				customer: record.customer,
				payment: record.payment
			};
			setOrders((prev) => [newOrder, ...prev]);
			return newOrder;
		} catch (e) {
			console.error("Failed to save order to Supabase:", e);
			const fallbackOrder = {
				...o,
				id: `VEL-${Date.now().toString(36).toUpperCase()}`,
				createdAt: Date.now(),
				status: o.status ?? "pending"
			};
			setOrders((prev) => [fallbackOrder, ...prev]);
			return fallbackOrder;
		}
	}, [setOrders]);
	const updateOrderStatus = (0, import_react.useCallback)(async (id, status) => {
		try {
			const { error } = await supabase.from("orders").update({ status }).eq("id", id);
			if (error) throw error;
			setOrders((prev) => prev.map((o) => o.id === id ? {
				...o,
				status
			} : o));
		} catch (e) {
			console.error("Failed to update order status in Supabase:", e);
		}
	}, [setOrders]);
	const removeOrder = (0, import_react.useCallback)(async (id) => {
		try {
			const { error } = await supabase.from("orders").delete().eq("id", id);
			if (error) throw error;
			setOrders((prev) => prev.filter((o) => o.id !== id));
		} catch (e) {
			console.error("Failed to delete order in Supabase:", e);
		}
	}, [setOrders]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ctx.Provider, {
		value: {
			cart,
			cartOpen,
			searchOpen,
			wishlist,
			recent,
			isAdmin,
			userEmail,
			userId,
			authLoading,
			orders,
			profile,
			updateProfile,
			placeOrder,
			updateOrderStatus,
			removeOrder,
			signOut,
			openCart: () => setCartOpen(true),
			closeCart: () => setCartOpen(false),
			openSearch: () => setSearchOpen(true),
			closeSearch: () => setSearchOpen(false),
			addToCart,
			updateQty,
			removeFromCart,
			clearCart,
			toggleWishlist,
			pushRecent
		},
		children
	});
}
function useShop() {
	const c = (0, import_react.useContext)(Ctx);
	if (!c) throw new Error("useShop must be inside ShopProvider");
	return c;
}
//#endregion
export { useShop as n, ShopProvider as t };
