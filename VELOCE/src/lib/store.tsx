import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from "react";
import { supabase, type AppUser } from "@/integrations/supabase/client";

function usePersistedState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [state, setState] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setState(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state, loaded]);

  return [state, setState];
}

export type CartItem = {
  id: string;
  qty: number;
  size: string;
  color: string;
  customName?: string;
  customNumber?: string;
};

export type OrderStatus =
  "awaiting_payment" | "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type Order = {
  id: string;
  createdAt: number;
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  status: OrderStatus;
  customer: {
    email?: string;
    name?: string;
    city?: string;
    address?: string;
    state?: string;
    pincode?: string;
    phone?: string;
  };
  payment?: {
    method: "upi" | "razorpay";
    vpa: string;
    txnId: string;
    mode: "full" | "cod";
    paidNow: number;
    codDue: number;
  };
};

type ShopCtx = {
  cart: CartItem[];
  cartOpen: boolean;
  searchOpen: boolean;
  wishlist: string[];
  recent: string[];
  isAdmin: boolean;
  userEmail: string | null;
  userId: string | null;
  authLoading: boolean;
  orders: Order[];
  profile: AppUser | null;
  updateProfile: (p: Partial<AppUser>) => Promise<void>;
  placeOrder: (
    o: Omit<Order, "id" | "createdAt" | "status"> & { status?: OrderStatus },
  ) => Promise<Order>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
  removeOrder: (id: string) => Promise<void>;
  signOut: () => Promise<void>;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  addToCart: (i: CartItem, maxStock?: number) => void;
  updateQty: (
    id: string,
    size: string,
    color: string,
    qty: number,
    customName?: string,
    customNumber?: string,
  ) => void;
  removeFromCart: (
    id: string,
    size: string,
    color: string,
    customName?: string,
    customNumber?: string,
  ) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  pushRecent: (q: string) => void;
};

const Ctx = createContext<ShopCtx | null>(null);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersistedState<CartItem[]>("veloce.cart", []);
  const [wishlist, setWishlist] = usePersistedState<string[]>("veloce.wishlist", []);
  const [recent, setRecent] = usePersistedState<string[]>("veloce.recent", []);
  const [orders, setOrders] = usePersistedState<Order[]>("veloce.orders", []);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<AppUser | null>(null);

  const updateProfile = useCallback(
    async (p: Partial<AppUser>) => {
      if (!userId) return;
      try {
        const dbData: any = {};
        if (p.fullName !== undefined) dbData.full_name = p.fullName;
        if (p.phone !== undefined) dbData.phone = p.phone;
        if (p.addressLine1 !== undefined) dbData.address_line1 = p.addressLine1;
        if (p.addressLine2 !== undefined) dbData.address_line2 = p.addressLine2;
        if (p.city !== undefined) dbData.city = p.city;
        if (p.state !== undefined) dbData.state = p.state;
        if (p.postalCode !== undefined) dbData.postal_code = p.postalCode;
        if (p.country !== undefined) dbData.country = p.country;

        const { error } = await supabase.from("users").update(dbData).eq("id", userId);
        if (error) throw error;
        setProfile((prev) => (prev ? { ...prev, ...p } : null));
      } catch (err) {
        console.error("Failed to update profile in Supabase:", err);
      }
    },
    [userId],
  );

  useEffect(() => {
    let mounted = true;

    const handleAuthChange = async (event: string, session: any) => {
      if (!mounted) return;
      const user = session?.user ?? null;

      if (user) {
        const uId = user.id;
        const uEmail = user.email || null;
        setUserId(uId);
        setUserEmail(uEmail);

        let userProfile: AppUser | null = null;
        try {
          const { data, error } = await supabase.from("users").select("*").eq("id", uId).single();
          if (error && error.code !== "PGRST116") {
            throw error;
          }
          if (data) {
            userProfile = {
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
              wishlist: data.wishlist || [],
            };
          } else {
            userProfile = {
              id: uId,
              email: uEmail || "",
              role: "user",
              disabled: false,
              cart: [],
              wishlist: [],
            };
          }
          setProfile(userProfile);
          setIsAdmin(userProfile.role === "admin");
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
        }

        const dbCart = userProfile?.cart || [];
        const dbWishlist = userProfile?.wishlist || [];

        setCart((currentCart) => {
          const mergedCart = [...currentCart];
          dbCart.forEach((dbItem: CartItem) => {
            const idx = mergedCart.findIndex(
              (item) =>
                item.id === dbItem.id &&
                item.size === dbItem.size &&
                item.color === dbItem.color &&
                item.customName === dbItem.customName &&
                item.customNumber === dbItem.customNumber,
            );
            if (idx >= 0) {
              mergedCart[idx].qty = Math.max(mergedCart[idx].qty, dbItem.qty);
            } else {
              mergedCart.push(dbItem);
            }
          });
          supabase
            .from("users")
            .update({ cart: mergedCart })
            .eq("id", uId)
            .then(({ error }) => {
              if (error) console.error("Failed to sync cart on login:", error);
            });
          return mergedCart;
        });

        setWishlist((currentWishlist) => {
          const mergedWishlist = Array.from(new Set([...currentWishlist, ...dbWishlist]));
          supabase
            .from("users")
            .update({ wishlist: mergedWishlist })
            .eq("id", uId)
            .then(({ error }) => {
              if (error) console.error("Failed to sync wishlist on login:", error);
            });
          return mergedWishlist;
        });

        try {
          let query = supabase.from("orders").select("*");
          if (userProfile?.role !== "admin") {
            query = query.eq("user_id", uId);
          }
          const { data: dbOrdersData, error: ordersError } = await query.order("created_at", {
            ascending: false,
          });
          if (ordersError) throw ordersError;

          const dbOrders = (dbOrdersData || []).map((r: any) => ({
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
            payment: r.payment,
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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
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

  useEffect(() => {
    if (!authLoading && userId) {
      supabase
        .from("users")
        .update({ cart })
        .eq("id", userId)
        .then(({ error }) => {
          if (error) console.error("Failed to sync cart to Supabase:", error);
        });
    }
  }, [cart, userId, authLoading]);

  useEffect(() => {
    if (!authLoading && userId) {
      supabase
        .from("users")
        .update({ wishlist })
        .eq("id", userId)
        .then(({ error }) => {
          if (error) console.error("Failed to sync wishlist to Supabase:", error);
        });
    }
  }, [wishlist, userId, authLoading]);

  const addToCart = useCallback(
    (i: CartItem, maxStock?: number) => {
      setCart((prev) => {
        const idx = prev.findIndex(
          (x) =>
            x.id === i.id &&
            x.size === i.size &&
            x.color === i.color &&
            x.customName === i.customName &&
            x.customNumber === i.customNumber,
        );
        if (idx >= 0) {
          const copy = [...prev];
          const newQty = copy[idx].qty + i.qty;
          copy[idx] = {
            ...copy[idx],
            qty: maxStock !== undefined ? Math.min(maxStock, newQty) : newQty,
          };
          return copy;
        }
        return [...prev, i];
      });
      setCartOpen(true);
    },
    [setCart],
  );

  const updateQty = useCallback(
    (
      id: string,
      size: string,
      color: string,
      qty: number,
      customName?: string,
      customNumber?: string,
    ) => {
      setCart((prev) =>
        prev.map((x) =>
          x.id === id &&
          x.size === size &&
          x.color === color &&
          x.customName === customName &&
          x.customNumber === customNumber
            ? { ...x, qty: Math.max(1, qty) }
            : x,
        ),
      );
    },
    [setCart],
  );

  const removeFromCart = useCallback(
    (id: string, size: string, color: string, customName?: string, customNumber?: string) => {
      setCart((prev) =>
        prev.filter(
          (x) =>
            !(
              x.id === id &&
              x.size === size &&
              x.color === color &&
              x.customName === customName &&
              x.customNumber === customNumber
            ),
        ),
      );
    },
    [setCart],
  );

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const toggleWishlist = useCallback(
    (id: string) => {
      setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    },
    [setWishlist],
  );

  const pushRecent = useCallback(
    (q: string) => {
      if (!q.trim()) return;
      setRecent((prev) => [q, ...prev.filter((x) => x !== q)].slice(0, 6));
    },
    [setRecent],
  );

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const placeOrder = useCallback(
    async (o: Omit<Order, "id" | "createdAt" | "status"> & { status?: OrderStatus }) => {
      const user = (await supabase.auth.getUser()).data.user;
      const dbData = {
        user_id: user?.id || null,
        items: o.items,
        subtotal: o.subtotal,
        discount: o.discount,
        shipping: o.shipping,
        tax: o.tax,
        total: o.total,
        status: o.status ?? "pending",
        customer: o.customer,
        payment: o.payment,
      };

      try {
        const { data: record, error } = await supabase
          .from("orders")
          .insert(dbData)
          .select("*")
          .single();
        if (error) throw error;
        // Stock deduction is now handled completely automatically by the Supabase Postgres Trigger (tr_order_stock)
        // which bypasses RLS securely and handles both order placement and order cancellation/rejection.

        const newOrder: Order = {
          id: record.id,
          createdAt: new Date(record.created_at).getTime(),
          items: record.items,
          total: Number(record.total),
          subtotal: Number(record.subtotal),
          discount: Number(record.discount || 0),
          shipping: Number(record.shipping || 0),
          tax: Number(record.tax || 0),
          status: record.status as OrderStatus,
          customer: record.customer,
          payment: record.payment,
        };
        setOrders((prev) => [newOrder, ...prev]);
        return newOrder;
      } catch (e) {
        console.error("Failed to save order to Supabase:", e);
        const fallbackOrder: Order = {
          ...o,
          id: `VEL-${Date.now().toString(36).toUpperCase()}`,
          createdAt: Date.now(),
          status: o.status ?? "pending",
        };
        setOrders((prev) => [fallbackOrder, ...prev]);
        return fallbackOrder;
      }
    },
    [setOrders],
  );

  const updateOrderStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      try {
        const { error } = await supabase.from("orders").update({ status }).eq("id", id);
        if (error) throw error;
        setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
      } catch (e) {
        console.error("Failed to update order status in Supabase:", e);
      }
    },
    [setOrders],
  );

  const removeOrder = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from("orders").delete().eq("id", id);
        if (error) throw error;
        setOrders((prev) => prev.filter((o) => o.id !== id));
      } catch (e) {
        console.error("Failed to delete order in Supabase:", e);
      }
    },
    [setOrders],
  );

  return (
    <Ctx.Provider
      value={{
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
        pushRecent,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useShop() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useShop must be inside ShopProvider");
  return c;
}
