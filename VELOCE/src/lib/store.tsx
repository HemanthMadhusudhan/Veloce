import { createContext, useContext, useEffect, useState, type ReactNode, useCallback } from "react";
import { supabase, type AppUser } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  name?: string;
  image?: string;
  price?: number;
  compareAt?: number;
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
    method: "upi" | "razorpay" | "wallet" | "cod";
    vpa: string;
    txnId: string;
    mode: "full" | "cod" | "wallet";
    paidNow: number;
    codDue: number;
  };
};

type ShopCtx = {
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  cartPopupItem: CartItem | null;
  setCartPopupItem: (item: CartItem | null) => void;
  wishlistPopupItem: { id: string } | null;
  setWishlistPopupItem: (item: { id: string } | null) => void;
  wishlist: string[];
  recent: string[];
  isAdmin: boolean;
  isOwner: boolean;
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
    maxStock?: number,
  ) => void;
  removeFromCart: (
    id: string,
    size: string,
    color: string,
  ) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  pushRecent: (q: string) => void;
  addWalletBalance: (amount: number, description: string) => Promise<void>;
  signupBonusPopupOpen: boolean;
  setSignupBonusPopupOpen: (open: boolean) => void;
};

const Ctx = createContext<ShopCtx | null>(null);

let globalSignupPopup = false;

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersistedState<CartItem[]>("veloce wear.cart", []);
  const [wishlist, setWishlist] = usePersistedState<string[]>("veloce wear.wishlist", []);
  const [recent, setRecent] = usePersistedState<string[]>("veloce wear.recent", []);
  const [orders, setOrders] = usePersistedState<Order[]>("veloce wear.orders", []);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartPopupItem, setCartPopupItem] = useState<CartItem | null>(null);
  const [wishlistPopupItem, setWishlistPopupItem] = useState<{ id: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [signupBonusPopupOpen, _setSignupBonusPopupOpen] = useState(globalSignupPopup);
  
  const setSignupBonusPopupOpen = useCallback((open: boolean) => {
    globalSignupPopup = open;
    _setSignupBonusPopupOpen(open);
  }, []);

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
          const ownerEmail = (import.meta.env.VITE_OWNER_EMAIL || "hemanthmadhusudhan@gmail.com").toLowerCase().trim();
          const userEmailNormalized = (uEmail || "").toLowerCase().trim();
          const isThisOwner = userEmailNormalized === "hemanthmadhusudhan@gmail.com" || userEmailNormalized === ownerEmail;

          const { data, error } = await supabase.from("users").select("*").eq("id", uId).single();
          if (error && error.code !== "PGRST116") {
            console.log("Profile select note:", error.message);
          }
          if (data) {
            userProfile = {
              id: data.id,
              email: uEmail || data.email || "",
              role: isThisOwner ? "admin" : (data.role || "user"),
              disabled: data.disabled || false,
              fullName: data.full_name || user.user_metadata?.fullName || user.user_metadata?.full_name || "",
              phone: data.phone || user.user_metadata?.phone || "",
              addressLine1: data.address_line1 || "",
              addressLine2: data.address_line2 || "",
              city: data.city || "",
              state: data.state || "",
              postalCode: data.postal_code || "",
              country: data.country || "",
              cart: data.cart || [],
              wishlist: data.wishlist || [],
              walletBalance: data.wallet_balance || 0,
            };

            // Keep user fields in sync with Supabase
            if (!data.email || !data.full_name || (isThisOwner && data.role !== "admin")) {
              supabase.from("users").update({
                email: uEmail || data.email,
                role: isThisOwner ? "admin" : data.role,
                full_name: userProfile.fullName,
              }).eq("id", uId).then(() => {});
            }
          } else {
            const rawName = user.user_metadata?.fullName || user.user_metadata?.full_name || user.user_metadata?.name || "";
            userProfile = {
              id: uId,
              email: uEmail || "",
              role: isThisOwner ? "admin" : "user",
              disabled: false,
              fullName: rawName,
              phone: user.user_metadata?.phone || "",
              cart: [],
              wishlist: [],
              walletBalance: 200,
            };

            // Auto-upsert new user into public.users so they appear in Admin immediately
            supabase.from("users").upsert({
              id: uId,
              email: uEmail || "",
              role: isThisOwner ? "admin" : "user",
              disabled: false,
              full_name: rawName,
              phone: user.user_metadata?.phone || "",
              cart: [],
              wishlist: [],
              wallet_balance: 200,
              created_at: user.created_at || new Date().toISOString(),
            }, { onConflict: "id" }).then(() => {});
          }

          const isUserAdmin = isThisOwner || userProfile.role === "admin";

          setProfile(userProfile);
          setIsAdmin(isUserAdmin);
          setIsOwner(isThisOwner);

          if (user.created_at) {
            const createdAt = new Date(user.created_at).getTime();
            const isNewUser = Date.now() - createdAt < 7 * 24 * 60 * 60 * 1000; // 7-day new user window
            const claimedKey = `signupBonus200_${uId}`;
            const hasClaimed = localStorage.getItem(claimedKey);
            
            if (isNewUser && hasClaimed !== 'true') {
               localStorage.setItem(claimedKey, 'true');
               // Credit ₹200 welcome bonus for new signups
               if ((userProfile.walletBalance || 0) === 0) {
                 userProfile.walletBalance = 200;
                 supabase.from("users").update({ wallet_balance: 200 }).eq("id", uId).then(() => {
                   toast.success("₹200 Welcome Bonus added to your Veloce Wallet!");
                 });
               }
               setSignupBonusPopupOpen(true);
            }
          }
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
                item.color === dbItem.color,
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
          query.order("created_at", { ascending: false }).then(({ data: dbOrdersData, error: ordersError }) => {
            if (ordersError) {
              console.error("Failed to load user orders:", ordersError);
              return;
            }
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
          });
        } catch (e) {
          console.error("Failed to fetch user orders:", e);
        }
      } else {
        setUserId(null);
        setUserEmail(null);
        setProfile(null);
        setIsAdmin(false);
        setIsOwner(false);
        if (event === "SIGNED_OUT") {
          setOrders([]);
          setCart([]);
          setWishlist([]);
        }
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
            x.color === i.color,
        );
        if (idx >= 0) {
          const copy = [...prev];
          const newQty = copy[idx].qty + i.qty;
          const clampedQty = maxStock !== undefined ? Math.min(maxStock, newQty) : newQty;
          copy[idx] = {
            ...copy[idx],
            qty: clampedQty,
          };
          return copy;
        }
        const itemQty = maxStock !== undefined ? Math.min(maxStock, i.qty) : i.qty;
        if (itemQty <= 0) {
          toast.error("This item is currently out of stock");
          return prev;
        }
        return [...prev, { ...i, qty: itemQty }];
      });
      setCartPopupItem(i);
    },
    [setCart],
  );

  const updateQty = useCallback(
    (
      id: string,
      size: string,
      color: string,
      qty: number,
      maxStock?: number,
    ) => {
      setCart((prev) =>
        prev.map((x) => {
          if (x.id === id && x.size === size && x.color === color) {
            let finalQty = Math.max(1, qty);
            if (maxStock !== undefined) {
              finalQty = Math.min(finalQty, maxStock);
            }
            return { ...x, qty: finalQty };
          }
          return x;
        }),
      );
    },
    [setCart],
  );

  const removeFromCart = useCallback(
    (id: string, size: string, color: string) => {
      setCart((prev) =>
        prev.filter(
          (x) =>
            !(
              x.id === id &&
              x.size === size &&
              x.color === color
            ),
        ),
      );
    },
    [setCart],
  );

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const toggleWishlist = useCallback(
    (id: string) => {
      setWishlist((prev) => {
        if (prev.includes(id)) {
          return prev.filter((x) => x !== id);
        } else {
          setWishlistPopupItem({ id });
          return [...prev, id];
        }
      });
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

  const addWalletBalance = useCallback(
    async (amount: number, description: string) => {
      if (!userId) return;
      try {
        const { error } = await supabase.rpc('update_wallet_balance', { p_user_id: userId, p_amount: amount });
        if (error) throw error;
        await supabase.from('wallet_transactions').insert({
          user_id: userId,
          amount: Math.abs(amount),
          type: amount >= 0 ? 'credit' : 'debit',
          description
        });
        setProfile((prev) => (prev ? { ...prev, walletBalance: (prev.walletBalance || 0) + amount } : null));
      } catch (err) {
        console.error('Failed to add wallet balance:', err);
      }
    },
    [userId]
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
        // Deduct stock for each ordered item in Supabase via SECURITY DEFINER RPC
        if (o.items && Array.isArray(o.items)) {
          const rpcItems = o.items.map((it) => ({
            id: it.id,
            size: it.size || "",
            qty: it.qty || 1,
          }));

          try {
            const { error: rpcErr } = await supabase.rpc("deduct_product_stock", {
              p_items: rpcItems,
            });
            if (rpcErr) {
              console.log("RPC stock deduct note:", rpcErr.message);
            }
          } catch (e) {
            console.log("RPC stock deduct exception:", e);
          }

          // Fallback direct update for admin sessions
          for (const it of o.items) {
            try {
              const prodId = it.id;
              const size = it.size;
              const qty = it.qty || 1;
              if (!prodId) continue;

              const { data: prodData } = await supabase
                .from("products")
                .select("stock, stock_by_size")
                .eq("id", prodId)
                .maybeSingle();

              if (prodData) {
                let currentStockBySize: Record<string, number> = prodData.stock_by_size || {};
                let currentTotalStock = Number(prodData.stock || 0);

                if (size) {
                  const currentSizeVal =
                    currentStockBySize[size] !== undefined
                      ? currentStockBySize[size]
                      : currentTotalStock;
                  const newSizeVal = Math.max(0, currentSizeVal - qty);
                  currentStockBySize = {
                    ...currentStockBySize,
                    [size]: newSizeVal,
                  };
                  currentTotalStock = Object.values(currentStockBySize).reduce((a, b) => a + b, 0);
                } else {
                  currentTotalStock = Math.max(0, currentTotalStock - qty);
                }

                await supabase
                  .from("products")
                  .update({
                    stock: currentTotalStock,
                    stock_by_size: currentStockBySize,
                  })
                  .eq("id", prodId);
              }
            } catch (stockErr) {
              // ignore fallback errors
            }
          }
        }

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
        
        // Dispatch order confirmation email via Supabase Edge Function
        try {
          supabase.functions.invoke("send-order-email", {
            body: { type: "INSERT", record: record }
          }).catch((err) => console.log("Order email edge function note:", err));
        } catch (e) {
          // ignore
        }

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
        setCartOpen,
        searchOpen,
        setSearchOpen,
        cartPopupItem,
        setCartPopupItem,
        wishlistPopupItem,
        setWishlistPopupItem,
        wishlist,
        recent,
        isAdmin,
        isOwner,
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
        addWalletBalance,
        signupBonusPopupOpen,
        setSignupBonusPopupOpen,
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
