import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useShop } from "@/lib/store";
import { formatOrderId } from "@/lib/format";
import { useCatalog } from "@/lib/catalog-store";
import { SiteChrome } from "@/components/chrome";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/razorpay";
import {
  MapPin,
  Package,
  LogOut,
  ArrowLeft,
  Heart,
  Wallet,
  Gift,
  HelpCircle,
  ChevronRight,
  Plus,
  Minus,
  ShieldCheck,
} from "lucide-react";
import { type AppUser, supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  validateSearch: (search: Record<string, unknown>): { tab?: string; orderId?: string } => {
    return {
      tab: typeof search.tab === "string" ? search.tab : undefined,
      orderId: typeof search.orderId === "string" ? search.orderId : undefined,
    };
  },
  head: () => ({ meta: [{ title: "My Account — Veloce Wear" }] }),
  component: () => (
    <SiteChrome>
      <ProfilePage />
    </SiteChrome>
  ),
});

type Address = {
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
};
const ADDR_KEY = "veloce wear.profile.address.v1";
const DEFAULT_ADDR: Address = {
  name: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

function ProfilePage() {
  const nav = useNavigate();
  const { userEmail, signOut, orders, profile, updateProfile, addWalletBalance, authLoading, isAdmin } = useShop();
  const { getById } = useCatalog();
  const search = Route.useSearch() as { tab?: string; orderId?: string };
  const tab = search.tab || (search.orderId ? "orders" : "menu");

  const setTab = (newTab: string) => {
    if (newTab !== tab) {
      nav({ to: `/profile?tab=${newTab}` });
    }
  };

  const [addr, setAddr] = useState<Address>(DEFAULT_ADDR);
  const [saved, setSaved] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<any>(null);

  useEffect(() => {
    if (search.orderId && orders.length > 0) {
      const targetId = search.orderId.toLowerCase();
      const found = orders.find(
        (o) =>
          o.id === search.orderId ||
          o.id?.toLowerCase() === targetId ||
          (o.id && targetId && o.id.toLowerCase().includes(targetId))
      );
      if (found) {
        setViewingOrder(found);
      }
    }
  }, [search.orderId, orders]);

  const displayName =
    profile?.fullName ||
    (addr.name ? addr.name : null) ||
    (userEmail ? userEmail.split("@")[0].toUpperCase() : "ACCOUNT USER");

  useEffect(() => {
    if (!authLoading && !userEmail) nav({ to: "/login", replace: true });
  }, [userEmail, nav, authLoading]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(ADDR_KEY);
      if (raw) {
        setAddr({ ...DEFAULT_ADDR, ...JSON.parse(raw) });
      } else if (profile) {
        setAddr({
          name: profile.fullName ?? "",
          phone: profile.phone ?? "",
          line1: profile.addressLine1 ?? "",
          line2: profile.addressLine2 ?? "",
          city: profile.city ?? "",
          state: profile.state ?? "",
          pincode: profile.postalCode ?? "",
        });
      }
    } catch {}
  }, [profile]);

  if (authLoading) return null;
  if (!userEmail) return null;

  const myOrders = orders.filter(
    (o) => !o.customer?.email || o.customer.email.toLowerCase() === userEmail.toLowerCase(),
  );

  const saveAddress = async () => {
    localStorage.setItem(ADDR_KEY, JSON.stringify(addr));
    if (profile) {
      try {
        await updateProfile({
          fullName: addr.name,
          phone: addr.phone,
          addressLine1: addr.line1,
          addressLine2: addr.line2,
          city: addr.city,
          state: addr.state,
          postalCode: addr.pincode,
        });
      } catch (e) {
        console.error("Failed to sync profile to Supabase:", e);
      }
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const handleLogout = () => {
    signOut();
    nav({ to: "/", replace: true });
  };

  return (
    <div className="mx-auto min-h-screen max-w-md bg-white font-sans text-neutral-900 pb-16">
      {/* ======================================================== */}
      {/* 1. MAIN PROFILE MENU VIEW */}
      {/* ======================================================== */}
      {tab === "menu" && (
        <div className="flex flex-col bg-white">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-neutral-100">
            <button
              onClick={() => nav({ to: "/" })}
              className="p-1 text-neutral-900 hover:text-neutral-600 transition cursor-pointer"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-6 w-6 stroke-[2]" />
            </button>
            <h1 className="text-xl font-black tracking-tight text-neutral-900">Account</h1>
          </div>

          {/* User Name & Email */}
          <div className="px-5 pt-5 pb-3">
            <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-950">
              {displayName}
            </h2>
            <p className="text-sm font-medium text-neutral-600 mt-0.5">
              {userEmail}
            </p>
            <button
              onClick={() => setTab("overview")}
              className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-[#0078ad] hover:underline cursor-pointer"
            >
              Edit details <ChevronRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* 3 Quick Action Cards Grid (Orders, Wishlist, Help) */}
          <div className="grid grid-cols-3 gap-3 px-5 py-3">
            {/* Orders */}
            <button
              onClick={() => setTab("orders")}
              className="flex flex-col items-center justify-center py-4 px-2 rounded-2xl border border-neutral-200 bg-white shadow-2xs hover:border-black active:scale-95 transition cursor-pointer"
            >
              <div className="w-8 h-8 flex items-center justify-center text-neutral-900 mb-1">
                <Package className="w-6 h-6 stroke-[1.75]" />
              </div>
              <span className="text-xs font-bold text-neutral-900">Orders</span>
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="flex flex-col items-center justify-center py-4 px-2 rounded-2xl border border-neutral-200 bg-white shadow-2xs hover:border-black active:scale-95 transition cursor-pointer"
            >
              <div className="w-8 h-8 flex items-center justify-center text-neutral-900 mb-1">
                <Heart className="w-6 h-6 stroke-[1.75]" />
              </div>
              <span className="text-xs font-bold text-neutral-900">Wishlist</span>
            </Link>

            {/* Help */}
            <button
              onClick={() => setTab("support")}
              className="flex flex-col items-center justify-center py-4 px-2 rounded-2xl border border-neutral-200 bg-white shadow-2xs hover:border-black active:scale-95 transition cursor-pointer"
            >
              <div className="w-8 h-8 flex items-center justify-center text-neutral-900 mb-1">
                <HelpCircle className="w-6 h-6 stroke-[1.75]" />
              </div>
              <span className="text-xs font-bold text-neutral-900">Help</span>
            </button>
          </div>

          {/* Categorized Menu List */}
          <div className="px-5 py-4 space-y-6">
            {/* YOUR INFORMATION */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                YOUR INFORMATION
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setTab("address")}
                  className="w-full flex items-center gap-3.5 py-3 hover:bg-neutral-50 rounded-xl transition cursor-pointer text-left"
                >
                  <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-neutral-900">Delivery Addresses</span>
                </button>
              </div>
            </div>

            {/* PAYMENT & REWARDS */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                PAYMENT & REWARDS
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setTab("wallet")}
                  className="w-full flex items-center justify-between py-3 hover:bg-neutral-50 rounded-xl transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 shrink-0">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-neutral-900">Veloce Wallet</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    ₹{(profile?.walletBalance || 0).toLocaleString("en-IN")}
                  </span>
                </button>

                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-fortune-spin"))}
                  className="w-full flex items-center justify-between py-3 hover:bg-neutral-50 rounded-xl transition cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                      <Gift className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-neutral-900 block leading-tight">Spin & Win</span>
                      <span className="text-[11px] font-medium text-neutral-500 block">Daily reward wheel & coupons</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-400" />
                </button>
              </div>
            </div>

            {/* ADMINISTRATOR SECTION - Only shown for admin accounts */}
            {isAdmin && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  ADMINISTRATOR
                </div>
                <div className="space-y-1">
                  <Link
                    to="/admin"
                    className="w-full flex items-center justify-between py-3 px-3.5 hover:bg-red-50/80 rounded-xl transition cursor-pointer text-left border border-red-200 bg-red-50/50 group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0 group-hover:scale-105 transition-transform">
                        <ShieldCheck className="w-4.5 h-4.5 stroke-[2.2]" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-red-700 block leading-tight">Admin Dashboard</span>
                        <span className="text-[11px] font-medium text-red-500/80 block">Manage products, orders & site settings</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-red-500" />
                  </Link>
                </div>
              </div>
            )}

            {/* ACCOUNT ACTIONS */}
            <div>
              <div className="space-y-1 pt-2 border-t border-neutral-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3.5 py-3 hover:bg-red-50 rounded-xl transition cursor-pointer text-left text-red-600"
                >
                  <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. MY ORDERS VIEW (Matching Original Card Style) */}
      {/* ======================================================== */}
      {tab === "orders" && (
        <div className="flex flex-col bg-white">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-neutral-100">
            <button
              onClick={() => {
                if (viewingOrder) {
                  setViewingOrder(null);
                } else {
                  setTab("menu");
                }
              }}
              className="p-1 text-neutral-900 hover:text-neutral-600 transition cursor-pointer"
            >
              <ArrowLeft className="h-6 w-6 stroke-[2]" />
            </button>
            <h1 className="text-xl font-black tracking-tight text-neutral-900">
              {viewingOrder ? "Order Details" : "My Orders"}
            </h1>
          </div>

          <div className="p-5">
            {viewingOrder ? (
              <div className="space-y-6">
                <button
                  onClick={() => setViewingOrder(null)}
                  className="flex items-center gap-2 text-xs font-bold text-neutral-900 hover:underline cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to My Orders
                </button>

                <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 font-medium">Order Number:</span>
                    <span className="font-mono font-bold text-neutral-900">{formatOrderId(viewingOrder.id)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 font-medium">Date Ordered:</span>
                    <span className="font-bold text-neutral-900">
                      {new Date(viewingOrder.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-500 font-medium">Status:</span>
                    <span className="font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                      {viewingOrder.status}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Items Ordered</h3>
                  {viewingOrder.items?.map((it: any, i: number) => {
                    const p = getById ? getById(it.id) : null;
                    return (
                      <div key={i} className="flex gap-3 p-3 rounded-2xl border border-neutral-200 bg-white">
                        <div className="w-16 h-16 rounded-xl bg-neutral-100 overflow-hidden shrink-0">
                          {p?.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400">
                              <Package className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-neutral-900 line-clamp-1">{p?.name || it.id}</h4>
                          <p className="text-[11px] text-neutral-500 mt-0.5">
                            Size: <strong className="text-neutral-800">{it.size}</strong> · Qty: <strong className="text-neutral-800">{it.qty}</strong>
                          </p>
                          <p className="text-xs font-black text-neutral-900 mt-1 font-mono">
                            ₹{((p?.price || 699) * it.qty).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Summary */}
                <div className="rounded-2xl border border-neutral-200 bg-white p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Subtotal</span>
                    <span>₹{(viewingOrder.subtotal || viewingOrder.total || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Shipping</span>
                    <span className="font-bold text-emerald-600">FREE</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-2 flex justify-between font-black text-sm text-neutral-950">
                    <span>Total Amount</span>
                    <span className="font-mono">₹{(viewingOrder.total || 0).toLocaleString("en-IN")}</span>
                  </div>
                </div>

                {/* Delivery Address */}
                {viewingOrder.customer && (
                  <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-xs space-y-1 text-neutral-700">
                    <h4 className="font-bold uppercase text-neutral-900 mb-1.5">Shipping Address</h4>
                    <p className="font-semibold text-neutral-900">{viewingOrder.customer.name}</p>
                    <p>{viewingOrder.customer.address}</p>
                    <p>{viewingOrder.customer.city}, {viewingOrder.customer.state} {viewingOrder.customer.pincode}</p>
                    <p>Phone: +91-{viewingOrder.customer.phone}</p>
                  </div>
                )}
              </div>
            ) : myOrders.length === 0 ? (
              <div className="py-16 text-center">
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-neutral-900">No orders placed yet</h3>
                <p className="text-xs text-neutral-500 mt-1 mb-6">Explore our matchwear and jerseys collection</p>
                <Link
                  to="/shop"
                  className="bg-black text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition shadow-sm"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {myOrders.map((o: any) => (
                  <div
                    key={o.id}
                    className="rounded-3xl border border-neutral-200/90 bg-white p-5 space-y-3.5 shadow-2xs"
                  >
                    {/* Header Row: ID + Status Badge */}
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-sm text-neutral-900 tracking-tight">
                        {formatOrderId(o.id)}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                        {o.status || "PENDING"}
                      </span>
                    </div>

                    {/* Date Row */}
                    <div className="text-xs text-neutral-500 font-medium">
                      {new Date(o.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>

                    {/* Bottom Row: Price + View Details */}
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-mono font-bold text-sm text-neutral-900">
                        ₹{(o.total || 0).toLocaleString("en-IN")}
                      </span>
                      <button
                        onClick={() => setViewingOrder(o)}
                        className="text-xs font-bold text-[#0078ad] hover:underline cursor-pointer flex items-center gap-0.5"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. VELOCE WALLET VIEW (Matching Original Theme) */}
      {/* ======================================================== */}
      {tab === "wallet" && (
        <div className="flex flex-col bg-white">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-neutral-100">
            <button
              onClick={() => setTab("menu")}
              className="p-1 text-neutral-900 hover:text-neutral-600 transition cursor-pointer"
            >
              <ArrowLeft className="h-6 w-6 stroke-[2]" />
            </button>
            <h1 className="text-xl font-black tracking-tight text-neutral-900">Veloce Wallet</h1>
          </div>

          <div className="p-5">
            <WalletTab profile={profile} addWalletBalance={addWalletBalance} />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. ADDRESS TAB */}
      {/* ======================================================== */}
      {tab === "address" && (
        <div className="flex flex-col bg-white">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-neutral-100">
            <button
              onClick={() => setTab("menu")}
              className="p-1 text-neutral-900 hover:text-neutral-600 transition cursor-pointer"
            >
              <ArrowLeft className="h-6 w-6 stroke-[2]" />
            </button>
            <h1 className="text-xl font-black tracking-tight text-neutral-900">Delivery Addresses</h1>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Full Name *</label>
              <input
                value={addr.name}
                onChange={(e) => setAddr({ ...addr, name: e.target.value })}
                placeholder="Enter full name"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Phone Number *</label>
              <input
                value={addr.phone}
                onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
                placeholder="10-digit mobile number"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Address Line 1 *</label>
              <input
                value={addr.line1}
                onChange={(e) => setAddr({ ...addr, line1: e.target.value })}
                placeholder="House / Flat / Street"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Address Line 2</label>
              <input
                value={addr.line2}
                onChange={(e) => setAddr({ ...addr, line2: e.target.value })}
                placeholder="Landmark, Area (optional)"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">City *</label>
                <input
                  value={addr.city}
                  onChange={(e) => setAddr({ ...addr, city: e.target.value })}
                  placeholder="City"
                  className="mt-1.5 w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Pincode *</label>
                <input
                  value={addr.pincode}
                  onChange={(e) => setAddr({ ...addr, pincode: e.target.value })}
                  placeholder="Pincode"
                  className="mt-1.5 w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">State *</label>
              <input
                value={addr.state}
                onChange={(e) => setAddr({ ...addr, state: e.target.value })}
                placeholder="State"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <button
              onClick={saveAddress}
              className="mt-4 w-full bg-black text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition active:scale-98 cursor-pointer shadow-md"
            >
              {saved ? "Saved ✓" : "Save Address"}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. EDIT DETAILS / OVERVIEW TAB */}
      {/* ======================================================== */}
      {tab === "overview" && (
        <div className="flex flex-col bg-white">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-neutral-100">
            <button
              onClick={() => setTab("menu")}
              className="p-1 text-neutral-900 hover:text-neutral-600 transition cursor-pointer"
            >
              <ArrowLeft className="h-6 w-6 stroke-[2]" />
            </button>
            <h1 className="text-xl font-black tracking-tight text-neutral-900">Personal Information</h1>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Full Name</label>
              <input
                value={addr.name}
                onChange={(e) => setAddr({ ...addr, name: e.target.value })}
                placeholder="Enter full name"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Email Address</label>
              <input
                value={userEmail}
                disabled
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-neutral-100 p-3 text-xs font-medium text-neutral-500 opacity-80 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Phone Number</label>
              <input
                value={addr.phone}
                onChange={(e) => setAddr({ ...addr, phone: e.target.value })}
                placeholder="10-digit mobile number"
                className="mt-1.5 w-full rounded-xl border border-neutral-300 p-3 text-xs font-medium text-neutral-900 focus:outline-none focus:border-black"
              />
            </div>

            <button
              onClick={saveAddress}
              className="mt-4 w-full bg-black text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition active:scale-98 cursor-pointer shadow-md"
            >
              {saved ? "Saved ✓" : "Save Changes"}
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. SUPPORT TAB */}
      {/* ======================================================== */}
      {tab === "support" && (
        <div className="flex flex-col bg-white">
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-neutral-100">
            <button
              onClick={() => setTab("menu")}
              className="p-1 text-neutral-900 hover:text-neutral-600 transition cursor-pointer"
            >
              <ArrowLeft className="h-6 w-6 stroke-[2]" />
            </button>
            <h1 className="text-xl font-black tracking-tight text-neutral-900">Help & Support</h1>
          </div>

          <div className="p-5 space-y-4">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Email Support</h3>
              <p className="text-xs text-neutral-600">Queries, sizing help, order tracking & returns</p>
              <a
                href="mailto:velocewears@gmail.com"
                className="inline-block text-xs font-bold text-[#0078ad] hover:underline"
              >
                velocewears@gmail.com
              </a>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Telegram Community</h3>
              <p className="text-xs text-neutral-600">Instant customer assistance: Mon–Sat (10am–8pm IST)</p>
              <a
                href="https://t.me/Velocewear"
                target="_blank"
                rel="noreferrer"
                className="inline-block text-xs font-bold text-[#0078ad] hover:underline"
              >
                @Velocewear →
              </a>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Returns & Exchanges</h3>
              <p className="text-xs text-neutral-600">
                4-day easy replacement policy for damaged, misprinted, or incorrect size items.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpay = () => {
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

function WalletTab({
  profile,
  addWalletBalance,
}: {
  profile: AppUser | null;
  addWalletBalance: (amt: number, desc: string) => Promise<void>;
}) {
  const [amount, setAmount] = useState("500");
  const [loading, setLoading] = useState(false);
  const [txns, setTxns] = useState<any[]>([]);

  useEffect(() => {
    if (!profile?.id) return;
    supabase
      .from("wallet_transactions")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data, error }) => {
        if (!error && data) setTxns(data);
      });
  }, [profile?.id]);

  const handleAddMoney = async () => {
    const amtNum = parseInt(amount);
    if (!amtNum || amtNum < 1) return toast.error("Minimum amount is ₹1");
    if (amtNum > 5000) return toast.error("Maximum add amount is ₹5,000");
    if ((profile?.walletBalance || 0) + amtNum > 5000)
      return toast.error("Maximum wallet balance allowed is ₹5,000");

    setLoading(true);
    try {
      const res = await loadRazorpay();
      if (!res) throw new Error("Razorpay SDK failed to load");

      const orderData = await createRazorpayOrder({
        data: { amount: amtNum * 100, currency: "INR", receipt: "wallet_" + Date.now() },
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Veloce Wear Wallet",
        description: "Add money to wallet",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          try {
            await verifyRazorpayPayment({
              data: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });
            await addWalletBalance(amtNum, "Added money via Razorpay");
            toast.success(`Successfully added ₹${amtNum} to your wallet!`);

            const { data } = await supabase
              .from("wallet_transactions")
              .select("*")
              .eq("user_id", profile?.id)
              .order("created_at", { ascending: false })
              .limit(20);
            if (data) setTxns(data);
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: profile?.fullName || "",
          email: profile?.email || "",
          contact: profile?.phone || "",
        },
        theme: { color: "#000000" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        toast.error(response.error.description);
      });
      rzp1.open();
    } catch (err: any) {
      toast.error(err.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Available Balance Card */}
      <div className="rounded-3xl border border-neutral-200/80 bg-neutral-50/50 p-6">
        <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
          AVAILABLE BALANCE
        </div>
        <div className="text-4xl font-black font-sans text-neutral-900 mt-2">
          ₹{(profile?.walletBalance || 0).toLocaleString("en-IN")}
        </div>
      </div>

      {/* Add Money Card */}
      <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 space-y-4 shadow-2xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">ADD MONEY</h3>
        
        {/* Preset Amount Pills */}
        <div className="flex gap-2">
          {["200", "500", "1000"].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(preset)}
              className={`flex-1 py-3 rounded-full text-xs font-bold transition cursor-pointer ${
                amount === preset
                  ? "bg-black text-white"
                  : "border border-neutral-200 text-neutral-800 hover:border-neutral-400 bg-white"
              }`}
            >
              +₹{preset}
            </button>
          ))}
        </div>

        {/* Custom Input */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="500"
          className="w-full rounded-2xl border border-neutral-200 p-3.5 text-sm font-bold text-neutral-900 focus:outline-none focus:border-black"
        />

        {/* Action Button */}
        <button
          onClick={handleAddMoney}
          disabled={loading}
          className="w-full bg-black text-white py-4 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition active:scale-98 disabled:opacity-50 cursor-pointer shadow-md"
        >
          {loading ? "Processing..." : `ADD ₹${amount || 0} TO WALLET`}
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">RECENT TRANSACTIONS</h3>
        {txns.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-xs text-neutral-500 text-center">
            No transactions yet
          </div>
        ) : (
          <div className="space-y-2.5">
            {txns.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center p-4 rounded-2xl border border-neutral-200 bg-white shadow-2xs"
              >
                <div className="pr-3">
                  <div className="font-bold text-xs text-neutral-900 line-clamp-1">
                    {t.description || "Wallet Update"}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5">
                    {new Date(t.created_at).toLocaleDateString("en-IN")}
                  </div>
                </div>
                <span className="font-bold text-sm text-neutral-900 whitespace-nowrap">
                  {t.type === "credit" ? "+" : "-"} ₹{t.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
