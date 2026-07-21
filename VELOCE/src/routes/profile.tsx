import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useShop } from "@/lib/store";
import { formatOrderId } from "@/lib/format";
import { useCatalog } from "@/lib/catalog-store";
import { SiteChrome } from "@/components/chrome";
import {
  MapPin,
  Package,
  LifeBuoy,
  LogOut,
  User as UserIcon,
  Mail,
  Phone,
  Save,
  ArrowLeft,
  Heart,
  ClipboardList,
  SlidersHorizontal
} from "lucide-react";
import { type AppUser } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile")({
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
  const { userEmail, signOut, orders, profile, updateProfile } = useShop();
  const { getById } = useCatalog();
  const [tab, setTab] = useState<"orders" | "address" | "support" | "menu" | "overview" | "settings">(
    "menu"
  );
  const [addr, setAddr] = useState<Address>(DEFAULT_ADDR);
  const [saved, setSaved] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  const firstName = profile?.fullName?.split(" ")[0] || (addr.name ? addr.name.split(" ")[0] : null) || "User";

  useEffect(() => {
    if (!userEmail) nav({ to: "/login", replace: true });
  }, [userEmail, nav]);

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
    <>
    <div className="hidden">
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-20">
      {/* Header section with glassmorphic banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/10 bg-surface/30 p-4 sm:p-12 mb-4 sm:mb-8 backdrop-blur-md">
        <div className="absolute inset-0 bg-gradient-to-br from-brand/10 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <button
              onClick={() => (history.length > 1 ? history.back() : nav({ to: "/" }))}
              className="mb-4 inline-flex items-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-[0.24em] text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> Back to Store
            </button>
            <div className="text-[9px] sm:text-[11px] uppercase tracking-[0.3em] text-brand font-semibold mb-2">
              Veloce Wear Member
            </div>
            <h1 className="font-display text-2xl sm:text-5xl font-bold tracking-tight text-foreground drop-shadow-sm">
              My Account
            </h1>
            <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-muted-foreground bg-black/20 w-fit px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-white/5">
              <Mail className="h-3.5 w-3.5" />
              {userEmail}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="group inline-flex items-center justify-center gap-1.5 sm:gap-2 self-stretch sm:self-end rounded-full bg-white/5 border border-white/10 px-4 py-2 sm:px-6 sm:py-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] transition hover:bg-brand hover:text-foreground hover:border-brand"
          >
            <LogOut className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:-translate-x-0.5 transition-transform" /> Sign out
          </button>
        </div>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[240px_1fr]">
        {/* Glassmorphic Sidebar */}
        <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
          <TabBtn
            active={tab === "orders"}
            onClick={() => setTab("orders")}
            icon={<Package className="h-4 w-4" />}
          >
            Orders
          </TabBtn>
          <TabBtn
            active={tab === "address"}
            onClick={() => setTab("address")}
            icon={<MapPin className="h-4 w-4" />}
          >
            Address
          </TabBtn>
          <TabBtn
            active={tab === "support"}
            onClick={() => setTab("support")}
            icon={<LifeBuoy className="h-4 w-4" />}
          >
            Support
          </TabBtn>
        </nav>

        {/* Content Area */}
        <div className="min-w-0 min-h-[300px] sm:min-h-[400px] rounded-3xl border border-white/10 bg-surface/20 p-5 sm:p-10 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <div className="relative z-10">
          {tab === "orders" && (
            <div>
              <h2 className="font-display text-base sm:text-xl font-semibold">Order history</h2>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
                Track past orders and their status.
              </p>
              {myOrders.length === 0 ? (
                <div className="mt-5 sm:mt-8 rounded-xl sm:rounded-2xl border border-dashed border-border/60 p-5 sm:p-8 text-center">
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    You haven't placed any orders yet.
                  </div>
                  <Link
                    to="/shop"
                    className="mt-3 sm:mt-4 inline-block rounded-full bg-foreground px-4 py-2 sm:px-5 sm:py-2.5 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.24em] text-background hover:bg-brand hover:text-foreground"
                  >
                    Start shopping
                  </Link>
                </div>
              ) : (
                <ul className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  {myOrders.map((o) => (
                    <li
                      key={o.id}
                      className="rounded-xl sm:rounded-2xl border border-border/60 p-3 sm:p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                        <div className="min-w-0">
                          <div className="font-mono text-[9px] sm:text-xs text-muted-foreground truncate">
                            {formatOrderId(o.id)}
                          </div>
                          <div className="text-[11px] sm:text-sm">
                            {new Date(o.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="rounded-full border border-border/60 px-2 py-0.5 sm:px-3 sm:py-1 text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.24em]">
                            {o.status}
                          </span>
                          <div className="font-display text-sm sm:text-lg font-semibold">
                            ₹{(o.total || 0).toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-3 divide-y divide-border/40 border-t border-border/40">
                        {(o.items || []).map((it, i) => {
                          if (!it) return null;
                          const p = it.id ? getById(it.id) : null;
                          return (
                            <div
                              key={i}
                              className="flex items-center justify-between py-1.5 sm:py-2 text-xs sm:text-sm"
                            >
                              <div className="min-w-0 flex-1 pr-2">
                                <div className="truncate font-medium text-[11px] sm:text-sm">
                                  {p?.name ?? it?.id ?? "Unknown Item"}
                                </div>
                                <div className="text-[10px] sm:text-xs text-muted-foreground">
                                  {it?.size ?? "N/A"} · {it?.color ?? "Default"} · Qty {it?.qty ?? 1}
                                </div>
                              </div>
                              {p && (
                                <div className="text-[11px] sm:text-sm shrink-0 ml-2">
                                  ₹{(p.price * (it?.qty ?? 1)).toLocaleString("en-IN")}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === "address" && (
            <div>
              <h2 className="font-display text-base sm:text-xl font-semibold">Shipping address</h2>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
                Saved for faster checkout.
              </p>
              <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2">
                <Input
                  label="Full name"
                  icon={<UserIcon className="h-3 w-3 sm:h-4 sm:w-4" />}
                  value={addr.name}
                  onChange={(v) => setAddr({ ...addr, name: v })}
                />
                <Input
                  label="Phone"
                  icon={<Phone className="h-3 w-3 sm:h-4 sm:w-4" />}
                  value={addr.phone}
                  onChange={(v) => setAddr({ ...addr, phone: v })}
                />
                <Input
                  label="Address line 1"
                  value={addr.line1}
                  onChange={(v) => setAddr({ ...addr, line1: v })}
                  className="sm:col-span-2"
                />
                <Input
                  label="Address line 2"
                  value={addr.line2}
                  onChange={(v) => setAddr({ ...addr, line2: v })}
                  className="sm:col-span-2"
                />
                <Input
                  label="City"
                  value={addr.city}
                  onChange={(v) => setAddr({ ...addr, city: v })}
                />
                <Input
                  label="State"
                  value={addr.state}
                  onChange={(v) => setAddr({ ...addr, state: v })}
                />
                <Input
                  label="Pincode"
                  value={addr.pincode}
                  onChange={(v) => setAddr({ ...addr, pincode: v })}
                />
              </div>
              <div className="mt-4 sm:mt-6 flex items-center gap-3">
                <button
                  onClick={saveAddress}
                  className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 sm:px-6 sm:py-3 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.24em] text-background hover:bg-brand hover:text-foreground"
                >
                  <Save className="h-3 w-3 sm:h-4 sm:w-4" /> Save address
                </button>
                {saved && <span className="text-[10px] sm:text-xs text-brand">Saved ✓</span>}
              </div>
            </div>
          )}

          {tab === "support" && (
            <div>
              <h2 className="font-display text-base sm:text-xl font-semibold">Support</h2>
              <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-muted-foreground">
                We're here to help — typical reply within 4 hours.
              </p>
              <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 sm:grid-cols-2">
                <a
                  href="mailto:support@veloce.in"
                  className="rounded-xl sm:rounded-2xl border border-border/60 p-3.5 sm:p-5 hover:border-brand"
                >
                  <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.28em] text-brand">
                    Email
                  </div>
                  <div className="mt-1 sm:mt-2 text-sm sm:text-base font-medium">
                    support@veloce.in
                  </div>
                  <div className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-muted-foreground">
                    Orders, sizing, exchanges
                  </div>
                </a>
                <a
                  href="https://t.me/VELOCE_JERSEY"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl sm:rounded-2xl border border-border/60 p-3.5 sm:p-5 hover:border-brand"
                >
                  <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.28em] text-brand">
                    Telegram
                  </div>
                  <div className="mt-1 sm:mt-2 text-sm sm:text-base font-medium">
                    @VELOCE_JERSEY
                  </div>
                  <div className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-muted-foreground">
                    Mon–Sat · 10am–8pm IST
                  </div>
                </a>
              </div>
              <div className="mt-4 sm:mt-6 rounded-xl sm:rounded-2xl border border-border/60 p-3.5 sm:p-5 text-xs sm:text-sm text-muted-foreground">
                Include your order ID (starts with{" "}
                <span className="font-mono text-foreground">VEL-</span>) so we can help faster.
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
    </div>
    <div className="block mx-auto max-w-2xl sm:shadow-2xl sm:border sm:border-border/20 sm:my-8 overflow-hidden sm:rounded-xl bg-white sm:min-h-0 min-h-screen">
      <PumaMobileProfile 
        userEmail={userEmail} 
        profile={profile} 
        handleLogout={handleLogout} 
        tab={tab} 
        setTab={setTab} 
        addr={addr} 
        setAddr={setAddr} 
        saveAddress={saveAddress} 
        saved={saved} 
        myOrders={orders} 
        firstName={firstName}
        getById={getById}
      />
    </div>
    </>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 sm:gap-3 whitespace-nowrap rounded-xl sm:rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3.5 text-[11px] sm:text-[13px] font-medium tracking-wide transition-all ${
        active
          ? "bg-brand/10 text-brand border border-brand/20 shadow-sm"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground border border-transparent"
      }`}
    >
      {icon} {children}
    </button>
  );
}

function Input({
  label,
  value,
  onChange,
  icon,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <div className="mb-1 sm:mb-1.5 flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-muted-foreground">
        {icon}
        {label}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-0 rounded-lg border border-border/70 bg-transparent px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm outline-none focus:border-foreground"
      />
    </label>
  );
}

function PumaMobileProfile({ userEmail, profile, handleLogout, tab, setTab, addr, setAddr, saveAddress, saved, myOrders, firstName, getById }: any) {
  const [viewingOrder, setViewingOrder] = useState<any>(null);
  if (tab === "menu") {
    return (
      <div className="flex flex-col bg-[#f4f4f4] text-black font-sans pb-8">
        <div className="bg-white p-6 pt-8 border-b border-gray-200">
          <h1 className="text-[20px] font-bold text-black tracking-tight">Hello, {firstName}</h1>
        </div>
        
        <div className="bg-[#f4f4f4] flex flex-col mt-4">
          <button onClick={() => setTab("overview")} className="flex items-center p-4 px-6 active:bg-gray-200 transition-colors">
            <UserIcon className="h-5 w-5 mr-4 text-black stroke-[1.5]" />
            <div className="text-[14px] font-bold text-black">
               Account Overview
            </div>
          </button>
          
          <button onClick={() => setTab("orders")} className="flex items-center p-4 px-6 active:bg-gray-200 transition-colors">
            <Package className="h-5 w-5 mr-4 text-black stroke-[1.5]" />
            <div className="text-[14px] font-bold text-black">
               My Orders
            </div>
          </button>
          
          <Link to="/wishlist" className="flex items-center p-4 px-6 active:bg-gray-200 transition-colors">
            <Heart className="h-5 w-5 mr-4 text-black stroke-[1.5]" />
            <div className="text-[14px] font-bold text-black">
               Wishlist
            </div>
          </Link>

          <button onClick={() => setTab("address")} className="flex items-center p-4 px-6 active:bg-gray-200 transition-colors">
            <ClipboardList className="h-5 w-5 mr-4 text-black stroke-[1.5]" />
            <div className="text-[14px] font-bold text-black">
               Addresses
            </div>
          </button>
          
          <button onClick={() => setTab("settings")} className="flex items-center p-4 px-6 active:bg-gray-200 transition-colors">
            <SlidersHorizontal className="h-5 w-5 mr-4 text-black stroke-[1.5]" />
            <div className="text-[14px] font-bold text-black">
               Account Settings
            </div>
          </button>
        </div>

        <div className="bg-[#f4f4f4] px-6 py-10 flex flex-col gap-10">
          <button onClick={() => setTab("support")} className="text-left text-[15px] font-bold text-black">
            Need Help?
          </button>
          
          <button onClick={handleLogout} className="text-left text-[13px] font-bold text-black underline tracking-wide uppercase">
            LOGOUT
          </button>
        </div>
      </div>
    );
  }
  
  if (tab === "address") {
    return (
      <div className="flex flex-col bg-white text-black font-sans pb-8">
        <button onClick={() => setTab("menu")} className="flex items-center gap-2 p-5 text-[11px] font-bold uppercase tracking-widest text-black border-b border-gray-200 active:bg-gray-50">
          <ArrowLeft className="h-4 w-4" /> BACK TO MY ACCOUNT
        </button>
        <div className="p-5">
          <h2 className="text-[20px] font-normal uppercase tracking-wide text-black mb-6">Address Book</h2>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col">
              <label className="text-[11px] font-bold uppercase tracking-wider text-black mb-1.5">First Name *</label>
              <input value={addr.name} onChange={(e) => setAddr({...addr, name: e.target.value})} className="w-full border border-gray-300 p-3 text-[14px] text-black rounded-none focus:outline-none focus:border-black" />
            </div>
            
            <div className="flex flex-col">
              <label className="text-[11px] font-bold uppercase tracking-wider text-black mb-1.5">Last Name</label>
              <input className="w-full border border-gray-300 p-3 text-[14px] text-black rounded-none focus:outline-none focus:border-black" />
            </div>
            
            <div className="flex flex-col">
              <label className="text-[11px] font-bold uppercase tracking-wider text-black mb-1.5">Address *</label>
              <input value={addr.line1} onChange={(e) => setAddr({...addr, line1: e.target.value})} placeholder="House no. and street name" className="w-full border border-gray-300 p-3 text-[14px] text-black rounded-none focus:outline-none focus:border-black" />
            </div>
            
            <div className="flex flex-col">
              <label className="text-[11px] font-bold uppercase tracking-wider text-black mb-1.5">Postcode *</label>
              <input value={addr.pincode} onChange={(e) => setAddr({...addr, pincode: e.target.value})} className="w-full border border-gray-300 p-3 text-[14px] text-black rounded-none focus:outline-none focus:border-black" />
            </div>
            
            <div className="flex flex-col">
              <label className="text-[11px] font-bold uppercase tracking-wider text-black mb-1.5">City *</label>
              <input value={addr.city} onChange={(e) => setAddr({...addr, city: e.target.value})} className="w-full border border-gray-300 p-3 text-[14px] text-black rounded-none focus:outline-none focus:border-black" />
            </div>
            
            <div className="flex flex-col">
              <label className="text-[11px] font-bold uppercase tracking-wider text-black mb-1.5">State *</label>
              <div className="relative">
                <select value={addr.state} onChange={(e) => setAddr({...addr, state: e.target.value})} className="w-full border border-gray-300 p-3 text-[14px] text-black rounded-none focus:outline-none focus:border-black appearance-none bg-white">
                  <option value="">Select State</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="West Bengal">West Bengal</option>
                </select>
              </div>
            </div>
            
            <h3 className="text-[17px] font-light text-black mt-6 mb-4">Enter Contact Info</h3>
            
            <div className="flex flex-col">
              <label className="text-[11px] font-bold uppercase tracking-wider text-black mb-1.5">Email *</label>
              <input value={userEmail} disabled className="w-full border border-gray-300 p-3 text-[14px] text-black rounded-none focus:outline-none opacity-80" />
            </div>
            
            <div className="flex flex-col">
              <label className="text-[11px] font-bold uppercase tracking-wider text-black mb-1.5">Phone *</label>
              <input value={addr.phone} onChange={(e) => setAddr({...addr, phone: e.target.value})} className="w-full border border-gray-300 p-3 text-[14px] text-black rounded-none focus:outline-none focus:border-black" />
            </div>

            <button onClick={saveAddress} className="w-full bg-[#181818] text-white p-4 text-[13px] font-bold tracking-widest uppercase mt-6 mb-2 hover:bg-black">
              {saved ? "Saved" : "Save Address"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Fallback for overview/orders/settings/support
  return (
    <div className="flex flex-col bg-white text-black font-sans pb-8">
      {tab !== "orders" && (
        <button onClick={() => setTab("menu")} className="flex items-center gap-2 p-5 text-[11px] font-bold uppercase tracking-widest text-black border-b border-gray-200 active:bg-gray-50">
          <ArrowLeft className="h-4 w-4" /> BACK TO MY ACCOUNT
        </button>
      )}
      <div className={tab === "orders" ? "p-0" : "p-5"}>
        {tab === "overview" && (
          <div>
            <h2 className="text-[20px] font-normal uppercase tracking-wide text-black mb-6">Account Overview</h2>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label className="text-[11px] font-bold uppercase tracking-wider text-black mb-1.5">First Name</label>
                <input value={addr.name} onChange={(e) => setAddr({...addr, name: e.target.value})} className="w-full border border-gray-300 p-3 text-[14px] text-black rounded-none focus:outline-none focus:border-black" />
              </div>
              <div className="flex flex-col">
                <label className="text-[11px] font-bold uppercase tracking-wider text-black mb-1.5">Email</label>
                <input value={userEmail} disabled className="w-full border border-gray-300 p-3 text-[14px] text-black rounded-none opacity-80" />
              </div>
              <div className="flex flex-col">
                <label className="text-[11px] font-bold uppercase tracking-wider text-black mb-1.5">Phone Number</label>
                <input value={addr.phone} onChange={(e) => setAddr({...addr, phone: e.target.value})} className="w-full border border-gray-300 p-3 text-[14px] text-black rounded-none focus:outline-none focus:border-black" />
              </div>
              <button onClick={saveAddress} className="w-full bg-[#181818] text-white p-4 text-[13px] font-bold tracking-widest uppercase mt-4 hover:bg-black">
                {saved ? "Saved" : "Save Changes"}
              </button>
            </div>
          </div>
        )}
        
        {tab === "orders" && (
          <div className="px-5 pt-5 pb-8">
            {viewingOrder ? (
              <>
                <button onClick={() => setViewingOrder(null)} className="flex items-center gap-2 text-[13px] font-bold text-black mb-6">
                  <ArrowLeft className="h-4 w-4" /> Back to Order History
                </button>
                <div className="bg-[#f4f4f4] p-4 sm:p-6 mb-6">
                  <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">Order Details</h1>
                </div>
                
                <div className="mb-8 px-2 sm:px-0">
                  <div className="text-[14px] sm:text-[15px] mb-2">Order number <span className="font-bold">{formatOrderId(viewingOrder.id)}</span></div>
                  <div className="text-[14px] sm:text-[15px] mb-1">Date ordered <span className="font-bold">{new Date(viewingOrder.createdAt).toLocaleDateString('en-GB')}</span></div>
                  <div className="text-[14px] sm:text-[15px] mb-1">Status <span className="font-bold">{viewingOrder.status.toUpperCase()}</span></div>
                </div>

                <div className="bg-[#f4f4f4] p-4 sm:p-6 mb-6">
                  <h2 className="text-[18px] sm:text-[20px] font-bold uppercase tracking-wide">Items Ordered</h2>
                </div>
                
                <div className="mb-8 px-2 sm:px-0">
                  {viewingOrder.items?.map((it: any, i: number) => {
                    const p = getById ? getById(it.id) : null;
                    return (
                      <div key={i} className="flex gap-4 sm:gap-6 py-6 border-b border-gray-200 last:border-0">
                        <div className="w-24 sm:w-32 shrink-0 bg-[#f4f4f4] p-2">
                          <img src={p?.images[0]} alt={p?.name} className="w-full h-auto object-cover" />
                        </div>
                        <div className="flex flex-col flex-1">
                          <h3 className="text-[15px] sm:text-[17px] font-bold mb-3">{p?.name ?? it.id}</h3>
                          <div className="text-[12px] sm:text-[13px] text-gray-600 space-y-0.5 mb-3">
                            <div>Color: <span className="text-black">{it.color}</span></div>
                            <div>Size: <span className="text-black">{it.size}</span></div>
                          </div>
                          <div className="text-[12px] sm:text-[13px] mb-3">
                            Quantity: <span className="text-black">{it.qty}</span>
                          </div>
                          <div className="text-[14px] sm:text-[16px] font-bold text-[#b30000]">
                            ₹{(p?.price ?? 0).toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border border-gray-200 p-6 sm:p-8 mb-6">
                  <h2 className="text-[18px] sm:text-[20px] font-bold uppercase tracking-wide mb-6">Order Summary</h2>
                  <div className="space-y-3 text-[13px] sm:text-[14px] font-bold uppercase tracking-wider mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{(viewingOrder.subtotal || viewingOrder.total || 0).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping Costs</span>
                      <span>{(viewingOrder.shipping || 0) === 0 ? "FREE" : `₹${viewingOrder.shipping?.toLocaleString("en-IN")}`}</span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
                    <span className="text-[18px] sm:text-[20px] font-bold uppercase tracking-wide">Order Total</span>
                    <span className="text-[18px] sm:text-[20px] font-bold">₹{(viewingOrder.total || 0).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="text-[11px] font-bold text-gray-500 mt-1 uppercase tracking-widest">
                    Prices Include GST
                  </div>
                </div>

                {viewingOrder.customer && (
                  <div className="border border-gray-200 p-6 sm:p-8 mb-8">
                    <h2 className="text-[18px] sm:text-[20px] font-bold uppercase tracking-wide mb-6">Addresses</h2>
                    <div className="mb-6">
                      <h3 className="text-[13px] sm:text-[14px] font-bold mb-4">Shipping Address:</h3>
                      <div className="text-[14px] sm:text-[15px] leading-relaxed text-gray-800">
                        {viewingOrder.customer.name}<br />
                        {viewingOrder.customer.address}<br />
                        {viewingOrder.customer.city}<br />
                        {viewingOrder.customer.state} {viewingOrder.customer.pincode}<br />
                        IN
                      </div>
                    </div>
                    <div className="mb-6">
                      <h3 className="text-[13px] sm:text-[14px] font-bold mb-4">Contact Info:</h3>
                      <div className="text-[14px] sm:text-[15px] text-gray-800">
                        {viewingOrder.customer.email}<br />
                        {viewingOrder.customer.phone}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <button onClick={() => setTab("menu")} className="flex items-center gap-2 text-[13px] font-bold text-black mb-6">
                  <ArrowLeft className="h-4 w-4" /> My Account
                </button>
                <div className="text-[14px] font-bold text-black mb-1">Order history</div>
            <h2 className="text-[28px] font-bold text-black tracking-tight mb-8">My account</h2>
            
            <div className="mb-8">
              <label className="text-[11px] font-bold uppercase tracking-widest text-black mb-2 block">Select Date</label>
              <div className="border border-gray-300 p-3 text-[14px] flex justify-between items-center cursor-pointer">
                Last six months
                <ArrowLeft className="h-4 w-4 -rotate-90" />
              </div>
            </div>

            {(!myOrders || myOrders.length === 0) ? (
              <div className="text-[14px] text-gray-500">You haven't placed any orders yet.</div>
            ) : (
              <div className="space-y-12">
                {myOrders.map((o: any) => {
                  const firstItem = (o.items || [])[0];
                  const p = firstItem && getById ? getById(firstItem.id) : null;
                  return (
                    <div key={o.id} className="flex flex-col">
                      <div className="text-[24px] font-bold text-black tracking-tight mb-2">{formatOrderId(o.id)}</div>
                      <button onClick={() => setViewingOrder(o)} className="text-[12px] font-bold uppercase tracking-widest text-black underline text-left mb-6 w-fit">VIEW ORDER</button>
                      
                      {p && (
                        <div className="flex gap-4 mb-6">
                          <div className="w-32 bg-[#f4f4f4] p-2 shrink-0">
                            <img src={p.images[0]} alt={p.name} className="w-full h-auto object-cover" />
                          </div>
                          <div className="flex flex-col flex-1 py-1">
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-[14px] font-bold leading-tight">{p.name}</span>
                              <span className="text-[14px] font-bold whitespace-nowrap">₹{(p.price || 0).toLocaleString("en-IN")}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="text-[14px] space-y-1.5 text-black">
                        <div><span className="font-bold">Date ordered:</span> {new Date(o.createdAt).toLocaleDateString("en-GB")}</div>
                        <div><span className="font-bold">Order status:</span> {o.status.toUpperCase()}</div>
                        <div><span className="font-bold">Shipped to:</span> {o.customer?.name || addr?.name || firstName || userEmail?.split("@")[0]}</div>
                        <div><span className="font-bold">Items:</span> {o.items?.reduce((acc: number, it: any) => acc + (it.qty || 1), 0) || 0}</div>
                        <div><span className="font-bold">Order Total:</span> ₹{(o.total || 0).toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
              </>
            )}
          </div>
        )}
        
        {tab === "support" && (
          <div>
            <h2 className="text-[20px] font-normal uppercase tracking-wide text-black mb-6">Support</h2>
            <div className="space-y-4">
              <a href="mailto:support@veloce.in" className="block border p-4 text-[13px] font-bold uppercase text-black hover:bg-gray-50">Email Us: support@veloce.in</a>
              <a href="https://t.me/VeloceJerseys" className="block border p-4 text-[13px] font-bold uppercase text-black hover:bg-gray-50">Telegram: @VeloceJerseys</a>
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div>
            <h2 className="text-[20px] font-normal uppercase tracking-wide text-black mb-6">Account Settings</h2>
            <div className="space-y-4">
               <div className="flex flex-col">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-black mb-1.5">Email</label>
                  <input value={userEmail || ""} disabled className="w-full border border-gray-300 p-3 text-[14px] text-black rounded-none opacity-80" />
               </div>
               <button onClick={handleLogout} className="w-full bg-[#181818] text-white p-4 text-[13px] font-bold tracking-widest uppercase mt-4 hover:bg-black">
                 LOG OUT
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
