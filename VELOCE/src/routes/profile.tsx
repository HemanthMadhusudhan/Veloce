import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useShop } from "@/lib/store";
import { useCatalog } from "@/lib/catalog-store";
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
} from "lucide-react";
import { type AppUser } from "@/integrations/supabase/client";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Account — Veloce" }] }),
  component: ProfilePage,
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
const ADDR_KEY = "veloce.profile.address.v1";
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
  const [tab, setTab] = useState<"orders" | "address" | "support">("orders");
  const [addr, setAddr] = useState<Address>(DEFAULT_ADDR);
  const [saved, setSaved] = useState(false);

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
    (o) => !o.customer.email || o.customer.email.toLowerCase() === userEmail.toLowerCase(),
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
              Veloce Member
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
                            {o.id}
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
                            ₹{o.total.toLocaleString("en-IN")}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-3 divide-y divide-border/40 border-t border-border/40">
                        {o.items.map((it, i) => {
                          const p = getById(it.id);
                          return (
                            <div
                              key={i}
                              className="flex items-center justify-between py-1.5 sm:py-2 text-xs sm:text-sm"
                            >
                              <div className="min-w-0 flex-1 pr-2">
                                <div className="truncate font-medium text-[11px] sm:text-sm">
                                  {p?.name ?? it.id}
                                </div>
                                <div className="text-[10px] sm:text-xs text-muted-foreground">
                                  {it.size} · {it.color} · Qty {it.qty}
                                </div>
                              </div>
                              {p && (
                                <div className="text-[11px] sm:text-sm shrink-0 ml-2">
                                  ₹{(p.price * it.qty).toLocaleString("en-IN")}
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
