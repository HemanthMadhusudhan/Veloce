import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Lock, Gift, Wallet, Banknote, CreditCard, Loader2, ChevronDown, Truck, RefreshCw, ShoppingCart, Plus, Minus, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { SiteChrome } from "@/components/chrome";
import { ProductCard } from "@/components/ProductCard";

import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/razorpay";
import { useCatalog } from "@/lib/catalog-store";
import { useShop } from "@/lib/store";
import { computeCart } from "@/lib/pricing";
import { formatINR, formatOrderId } from "@/lib/format";

const UPI_VPA = "velocejersey@ybl";
const UPI_PAYEE = "VELOCE WEAR JERSEY";

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

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Veloce Wear" }] }),
  component: () => (
    <SiteChrome>
      <main className="w-full overflow-x-hidden">
        <CheckoutPage />
      </main>
    </SiteChrome>
  ),
});

function CheckoutPage() {
  const { cart, clearCart, placeOrder, userEmail, userId, updateProfile, profile, orders, updateQty, removeFromCart } =
    useShop();
  const { getById, refresh, products, updateProduct } = useCatalog();
  const nav = useNavigate();
  const [mode, setMode] = useState<"guest" | "account">("guest");
  const [done, setDone] = useState(false);
  const [contact, setContact] = useState({ email: "", firstName: "", lastName: "", city: "", phone: "" });
  const [address, setAddress] = useState("");
  const [stateName, setStateName] = useState("");
  const [step, setStep] = useState<"details" | "payment">("details");
  const [pincode, setPincode] = useState("");
  const [txnErr, setTxnErr] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any>(null);
  const [payMode, setPayMode] = useState<"full" | "cod">("full");
  const [activeTab, setActiveTab] = useState("CART");
  const [finalCodDue, setFinalCodDue] = useState(0);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponState, setAppliedCouponState] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const isFirstOrder = useMemo(() => orders.length === 0, [orders]);
  const totals = useMemo(
    () => computeCart(cart, getById, appliedCouponState, isFirstOrder),
    [cart, getById, appliedCouponState, isFirstOrder],
  );

  useEffect(() => {
    if (userId && profile) {
      const parts = (profile.fullName || "").trim().split(/\s+/);
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";
      setContact((prev) => ({
        ...prev,
        email: profile.email || userEmail || prev.email,
        firstName: prev.firstName || firstName,
        lastName: prev.lastName || lastName,
        city: prev.city || profile.city || "",
        phone: prev.phone || profile.phone || "",
      }));
      if (profile.addressLine1) setAddress(profile.addressLine1);
      if (profile.state) setStateName(profile.state);
      if (profile.postalCode) setPincode(profile.postalCode);
    } else if (userEmail) {
      setContact((prev) => ({ ...prev, email: userEmail }));
    }
  }, [userId, profile, userEmail]);

  useEffect(() => {
    loadRazorpay();
  }, []);

  useEffect(() => {
    if (!userId) {
      try {
        const raw = localStorage.getItem("veloce wear.profile.address.v1");
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
              city: parsed.city || "",
              phone: parsed.phone || "",
            };
          });
          setAddress(parsed.line1 || "");
          setStateName(parsed.state || "");
          setPincode(parsed.pincode || "");
        }
      } catch {}
    }
  }, [userId]);
  const { lines, subtotal, discount, shipping, tax, total, freeUnits, couponApplied } = totals;

  const orderRef = useMemo(() => `VEL-${Math.floor(10000000 + Math.random() * 90000000)}`, []);
  const payNow = useMemo(() => (payMode === "cod" ? 80 : total), [payMode, total]);
  const codDue = payMode === "cod" ? total : 0;
  const upiUri = useMemo(() => {
    const params = new URLSearchParams({
      pa: UPI_VPA,
      pn: UPI_PAYEE,
      am: payNow.toFixed(2),
      cu: "INR",
      tn: payMode === "cod" ? `Veloce Wear ${orderRef} · 80rs advance` : `Veloce Wear order ${orderRef}`,
      tr: orderRef,
    });
    return `upi://pay?${params.toString()}`;
  }, [payNow, orderRef, payMode]);

  if (done && completedOrder) {
    const { lines: cLines, subtotal: cSubtotal, shipping: cShipping, total: cTotal, payMode: cPayMode } = completedOrder;
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 bg-white text-black font-sans">
        <div className="bg-[#f4f4f4] p-4 sm:p-6 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wide">Order Complete</h1>
        </div>
        
        <div className="mb-8 px-2 sm:px-0">
          <div className="text-[14px] sm:text-[15px] mb-2">Order number <span className="font-bold">{formatOrderId(completedOrder?.id || "")}</span></div>
          <div className="text-[14px] sm:text-[15px] mb-1">Date ordered <span className="font-bold">{new Date().toLocaleDateString('en-GB')}</span></div>
          <div className="text-[14px] sm:text-[15px]">
            An email confirmation is on its way to <br className="sm:hidden" />
            <span className="font-bold">{contact.email || userEmail || "you"}</span>
          </div>
        </div>

        <div className="bg-[#f4f4f4] p-4 sm:p-6 mb-6">
          <h2 className="text-[18px] sm:text-[20px] font-bold uppercase tracking-wide">Items Ordered</h2>
        </div>

        <div className="mb-8 px-2 sm:px-0">
          {cLines.map((it: any, i: number) => {
            const p = it.product;
            const item = it.item;
            return (
              <div key={i} className="flex gap-4 sm:gap-6 py-6 border-b border-gray-200 last:border-0">
                <div className="w-24 sm:w-32 shrink-0 bg-[#f4f4f4] p-2">
                  <img src={p?.images[0]} alt={p?.name} className="w-full h-auto object-cover" />
                </div>
                <div className="flex flex-col flex-1">
                  <h3 className="text-[15px] sm:text-[17px] font-bold mb-3">{p?.name ?? item.id}</h3>
                  <div className="text-[12px] sm:text-[13px] text-gray-600 space-y-0.5 mb-3">
                    <div>Color: <span className="text-black">{item.color}</span></div>
                    <div>Size: <span className="text-black">{item.size}</span></div>
                    <div>Style Number: <span className="text-black">{p?.id.substring(0,8).toUpperCase()}</span></div>
                  </div>
                  <div className="text-[12px] sm:text-[13px] mb-3">
                    Quantity: <span className="text-black">{item.qty}</span>
                  </div>
                  <div className="text-[14px] sm:text-[16px] font-bold text-[#b30000]">
                    ₹{(p?.price ?? 0).toLocaleString("en-IN")}
                  </div>
                  {((p?.compareAt ?? 0) > (p?.price ?? 0)) && (
                    <div className="text-[12px] sm:text-[14px] text-gray-500 line-through">
                      ₹{p?.compareAt?.toLocaleString("en-IN")}
                    </div>
                  )}
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
              <span>₹{cSubtotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Costs</span>
              <span>{cPayMode === "cod" ? "₹80 (Non Refundable)" : (cShipping === 0 ? "FREE" : `₹${cShipping.toLocaleString("en-IN")}`)}</span>
            </div>
            {completedOrder.discount > 0 && (
              <div className="flex justify-between text-[#b30000] font-bold">
                <span>Discount</span>
                <span>-₹{completedOrder.discount.toLocaleString("en-IN")}</span>
              </div>
            )}
          </div>
          <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
            <span className="text-[18px] sm:text-[20px] font-bold uppercase tracking-wide">Order Total</span>
            <span className="text-[18px] sm:text-[20px] font-bold">₹{(cTotal + (cPayMode === "cod" ? 80 : 0)).toLocaleString("en-IN")}</span>
          </div>
          <div className="text-[11px] font-bold text-gray-500 mt-1 uppercase tracking-widest">
            Prices Include GST
          </div>
        </div>

        <div className="border border-gray-200 p-6 sm:p-8 mb-8">
          <h2 className="text-[18px] sm:text-[20px] font-bold uppercase tracking-wide mb-6">Addresses</h2>
          
          <div className="mb-6">
            <h3 className="text-[13px] sm:text-[14px] font-bold mb-4">Shipping Address:</h3>
            <div className="text-[14px] sm:text-[15px] leading-relaxed text-gray-800">
              {contact.firstName} {contact.lastName}<br />
              {address}<br />
              {contact.city}<br />
              {stateName} {pincode}<br />
              IN
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[13px] sm:text-[14px] font-bold mb-4">Shipment Method:</h3>
            <div className="text-[14px] sm:text-[15px] text-gray-800">
              {cPayMode === "cod" ? "Cash On Delivery - ₹80" : "Standard - ₹0"}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[13px] sm:text-[14px] font-bold mb-4">Billing Address:</h3>
            <div className="text-[14px] sm:text-[15px] leading-relaxed text-gray-800">
              {contact.firstName} {contact.lastName}<br />
              {address}<br />
              {contact.city}<br />
              {stateName} {pincode}<br />
              IN
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-[13px] sm:text-[14px] font-bold mb-4">Contact Info:</h3>
            <div className="text-[14px] sm:text-[15px] leading-relaxed text-gray-800">
              Email: {contact.email || userEmail}<br />
              Phone: {contact.phone}
            </div>
          </div>

          <div>
            <h3 className="text-[13px] sm:text-[14px] font-bold mb-4">Payment</h3>
            <div className="text-[14px] sm:text-[15px] leading-relaxed text-gray-800 mb-4">
              {cPayMode === "cod" ? "Cash On Delivery (Partial Advance)" : "Online Payment"}
            </div>
            <div className="text-[14px] sm:text-[15px] text-gray-800 mb-6">
              Number Of Items {cLines.reduce((acc: any, it: any) => acc + it.item.qty, 0)}
            </div>
            <div className="text-[15px] sm:text-[16px] font-bold">
              Total Amount ₹{(cTotal + (cPayMode === "cod" ? 80 : 0)).toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 border-t border-gray-200 pt-8 pb-12">
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-block text-center bg-black px-8 py-4 text-[13px] font-bold tracking-[0.2em] uppercase text-white hover:bg-gray-800 transition-colors"
          >
            Keep Shopping
          </Link>
          <Link
            to="/profile"
            className="w-full sm:w-auto inline-block text-center border border-black px-8 py-4 text-[13px] font-bold tracking-[0.2em] uppercase text-black hover:bg-gray-100 transition-colors"
          >
            Track Order
          </Link>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    const recommended = (products || []).slice(0, 4);

    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 bg-white text-black font-sans">
        <div className="flex flex-col items-center justify-center text-center py-16 sm:py-24">
          <ShoppingCart className="h-32 w-32 sm:h-40 sm:w-40 text-gray-300 mb-8 stroke-1" />
          <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight text-black mb-12">
            Your Shopping Cart is Empty
          </h1>
        </div>

        {recommended.length > 0 && (
          <div className="mt-8 border-t border-gray-200 pt-12">
            <h2 className="text-[18px] sm:text-[20px] font-bold uppercase tracking-wide mb-8">
              CUSTOMERS ALSO ORDERED
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 sm:gap-6">
              {recommended.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const submitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setTxnErr(null);
    setIsProcessing(true);

    for (const item of cart) {
      const p = getById(item.id);
      if (!p) {
        setTxnErr(`Product ${item.id} not found.`);
        setIsProcessing(false);
        return;
      }
      const available =
        p.stockBySize?.[item.size] !== undefined ? p.stockBySize[item.size] : p.stock;
      if (item.qty > available) {
        setTxnErr(`Sorry, only ${available} left in stock for ${p.name} (${item.size}).`);
        setIsProcessing(false);
        return;
      }
    }

    const nameParts = [contact.firstName, contact.lastName].filter(Boolean);
    const name = nameParts.join(" ");

    // Save address for next checkout
    try {
      localStorage.setItem(
        "veloce wear.profile.address.v1",
        JSON.stringify({
          name,
          phone: profile?.phone || "",
          line1: address,
          line2: "",
          city: contact.city,
          state: stateName,
          pincode: pincode,
        }),
      );
    } catch {}

    // Sync to Supabase if logged in
    if (userId) {
      updateProfile({
        fullName: name,
        addressLine1: address,
        city: contact.city,
        state: stateName,
        postalCode: pincode,
      }).catch((err) => console.error("Failed to sync checkout address to Supabase:", err));
    }

    const res = await loadRazorpay();
    if (!res) {
      setTxnErr("Failed to load payment gateway. Please check your internet connection.");
      setIsProcessing(false);
      return;
    }

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!keyId) {
      setTxnErr("Payment gateway is not configured. Please contact support.");
      setIsProcessing(false);
      return;
    }

    try {
      const orderData = await createRazorpayOrder({
        data: {
          amount: Math.round(payNow * 100),
          currency: "INR",
          receipt: orderRef,
        },
      });

      if (!orderData.order_id) {
        setTxnErr("Failed to create order on server");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.order_id,
        name: "Veloce Wear",
        description: payMode === "cod" ? "COD Prepaid Charge" : `Order ${orderRef}`,
        handler: async function (response: any) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          try {
            const verifyData = await verifyRazorpayPayment({
              data: {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
              },
            });

            if (!verifyData.success) {
              setTxnErr("Payment verification failed");
              setIsProcessing(false);
              return;
            }

            await placeOrder({
              items: cart,
              subtotal,
              discount,
              shipping,
              tax,
              total,
              customer: {
                email: contact.email,
                name,
                city: contact.city,
                address: address,
                state: stateName,
                pincode: pincode,
                phone: contact.phone || profile?.phone || "",
              },
              payment: {
                method: "razorpay",
                vpa: "",
                txnId: razorpay_payment_id,
                mode: payMode,
                paidNow: payNow,
                codDue,
              },
              status: "processing", // Verified via Razorpay
            });
            
            // Deduct stockBySize on the client side since trigger only handles total stock
            for (const item of cart) {
              const p = getById(item.id);
              if (p && p.stockBySize) {
                const newStockBySize = { ...p.stockBySize };
                if (newStockBySize[item.size] !== undefined) {
                  newStockBySize[item.size] = Math.max(0, newStockBySize[item.size] - item.qty);
                  await updateProduct(p.id, { stockBySize: newStockBySize });
                }
              }
            }

            await refresh();
            setFinalCodDue(codDue);
            setCompletedOrder({ lines, subtotal, discount, shipping, tax, total, payMode, codDue });
            clearCart();
            setDone(true);
            setIsProcessing(false);
          } catch (err: any) {
            console.error(err);
            setTxnErr(err.message || "Failed to verify or place order.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: name,
          email: contact.email,
          contact: contact.phone || profile?.phone || "",
        },
        theme: {
          color: "#ffffff",
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled.");
            setIsProcessing(false);
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        setTxnErr(response?.error?.description || "Payment failed");
        toast.error("Payment failed. Please try again.");
        setIsProcessing(false);
      });
      paymentObject.open();
    } catch (err: any) {
      console.error("Order creation error:", err);
      setTxnErr("Failed to initialize payment.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      {isProcessing && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
          <Loader2 className="h-12 w-12 animate-spin text-black mb-4" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-black">Processing Payment</h2>
          <p className="text-gray-600 mt-2 font-medium">Please do not close or refresh this page.</p>
        </div>
      )}
    <div className="hidden">
    <div
      style={{ width: "100%", overflowX: "hidden", boxSizing: "border-box" }}
      className="mx-auto max-w-6xl px-4 sm:px-6 pt-4 pb-36 sm:pt-8 sm:pb-12"
    >
      <div className="text-[10px] uppercase tracking-[0.28em] text-brand">Secure checkout</div>
      <h1 className="mt-1 font-display text-4xl font-bold tracking-tight sm:text-5xl">Checkout</h1>

      <div
        style={{ width: "100%", overflowX: "hidden" }}
        className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]"
      >
        <form
          onSubmit={
            step === "details"
              ? (e) => {
                  e.preventDefault();
                  setStep("payment");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              : submitPayment
          }
          className="space-y-8 min-w-0 w-full"
        >
          {!userId && step === "details" && (
            <div className="flex gap-2 rounded-full border border-border/70 p-1 text-xs">
              <button
                type="button"
                onClick={() => setMode("guest")}
                className={`flex-1 rounded-full py-2 uppercase tracking-[0.2em] ${mode === "guest" ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                Guest checkout
              </button>
              <button
                type="button"
                onClick={() => setMode("account")}
                className={`flex-1 rounded-full py-2 uppercase tracking-[0.2em] ${mode === "account" ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                Sign in
              </button>
            </div>
          )}

          {step === "details" && (
            <>
              <Section title="Contact">
                {userId ? (
                  <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Signed in as </span>
                      <span className="font-semibold text-emerald-300">{userEmail}</span>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] text-emerald-300 font-semibold">
                      Active Session
                    </span>
                  </div>
                ) : (
                  <>
                    <Input
                      required
                      type="email"
                      placeholder="Email address"
                      value={contact.email}
                      onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    />
                    {mode === "account" && (
                      <Input required type="password" placeholder="Password" />
                    )}
                  </>
                )}
              </Section>

              <Section title="Shipping (India)">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Input
                    required
                    placeholder="First name"
                    value={contact.firstName}
                    onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
                  />
                  <Input
                    required
                    placeholder="Last name"
                    value={contact.lastName}
                    onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
                  />
                </div>
                <Input
                  required
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Input
                    required
                    placeholder="City"
                    value={contact.city}
                    onChange={(e) => setContact({ ...contact, city: e.target.value })}
                  />
                  <Input
                    required
                    placeholder="State"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                  />
                  <Input
                    required
                    maxLength={6}
                    pattern="\d{6}"
                    placeholder="PIN code (6 digits)"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div className="space-y-1">
                  <div className={`flex rounded-xl border ${contact.phone && contact.phone.length < 10 ? 'border-red-500' : 'border-border/60'} bg-transparent transition focus-within:border-brand focus-within:ring-1 focus-within:ring-brand overflow-hidden`}>
                    <div className="flex items-center justify-center bg-muted/50 px-4 text-sm font-medium border-r border-border/60 text-muted-foreground">+91</div>
                    <input
                      required
                      maxLength={10}
                      pattern="\d{10}"
                      placeholder="10-digit mobile number"
                      value={contact.phone || ""}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full bg-transparent px-4 py-3.5 text-sm focus:outline-none"
                    />
                  </div>
                  {contact.phone && contact.phone.length < 10 && <div className="text-[11px] text-red-500 font-medium px-2">invalid</div>}
                </div>
                <Input required placeholder="Country" defaultValue="India" readOnly />
              </Section>
            </>
          )}

          {step === "payment" && (
            <>
              <Section title="Coupon Code">
                <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/40 p-4">
                  {totals.couponApplied ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.24em] text-brand">
                          Applied
                        </div>
                        <div className="mt-1 font-mono text-sm">{totals.couponApplied}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (totals.couponApplied === "B2G1") setAppliedCouponState("NONE");
                          else setAppliedCouponState("");
                        }}
                        className="rounded-full border border-border/70 px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-[11px] text-muted-foreground">
                        Have a coupon? Enter it below.
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="E.g. FIRST50"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => {
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
                          }}
                          className="rounded-xl bg-foreground px-6 text-xs font-semibold uppercase tracking-widest text-background"
                        >
                          Apply
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </Section>
              <Section title="Payment">
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPayMode("full");
                      setTxnErr(null);
                    }}
                    className={`rounded-xl border p-3 text-left transition ${payMode === "full" ? "border-foreground bg-card/60" : "border-border/60 hover:border-foreground/60"}`}
                  >
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-brand">
                      <CreditCard className="h-3.5 w-3.5" /> Pay Online
                    </div>
                    <div className="mt-1 text-sm font-semibold">Pay {formatINR(total)} now</div>
                    <div className="text-[11px] text-muted-foreground">
                      Cards, UPI, Netbanking, or Wallets. Dispatched after verification.
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPayMode("cod");
                      setTxnErr(null);
                    }}
                    className={`rounded-xl border p-3 text-left transition ${payMode === "cod" ? "border-foreground bg-card/60" : "border-border/60 hover:border-foreground/60"}`}
                  >
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-brand">
                      <Banknote className="h-3.5 w-3.5" /> Cash on Delivery
                    </div>
                    <div className="mt-1 text-sm font-semibold">Pay ₹80 processing fee now</div>
                    <div className="text-[11px] text-muted-foreground">
                      Balance {formatINR(total)} in cash on delivery.
                    </div>
                  </button>
                </div>
                {/* PAYMENT BOX */}
                <div
                  style={{ width: "100%", boxSizing: "border-box", overflowX: "hidden" }}
                  className="rounded-2xl border border-border/70 bg-card/40 p-6"
                >
                  {/* Description */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      marginBottom: "16px",
                    }}
                    className="text-[12px] uppercase tracking-[0.24em] text-brand"
                  >
                    <Lock style={{ width: "16px", height: "16px", flexShrink: 0 }} /> Secure
                    Checkout
                  </div>
                  <p
                    style={{
                      fontSize: "13px",
                      textAlign: "center",
                      lineHeight: "1.6",
                      marginBottom: "24px",
                      wordBreak: "break-word",
                      overflowWrap: "break-word",
                    }}
                    className="text-muted-foreground"
                  >
                    You will be redirected to Razorpay to complete your payment securely via UPI,
                    Credit/Debit Card, or Netbanking.
                  </p>
                  {/* Payment details */}
                  <div
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.08)",
                      paddingTop: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                      fontSize: "14px",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: "8px",
                      }}
                    >
                      <span className="text-muted-foreground">Pay now</span>
                      <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                        {formatINR(payNow)}
                      </span>
                    </div>
                    {payMode === "cod" && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          gap: "8px",
                        }}
                        className="text-brand"
                      >
                        <span>Cash on delivery</span>
                        <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                          {formatINR(codDue)}
                        </span>
                      </div>
                    )}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        gap: "8px",
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                        paddingTop: "12px",
                        fontWeight: 600,
                      }}
                    >
                      <span className="text-muted-foreground">Order total</span>
                      <span style={{ fontFamily: "monospace" }}>{formatINR(total)}</span>
                    </div>
                  </div>
                  {txnErr && (
                    <div className="mt-6 rounded-lg border border-brand/40 bg-brand/10 px-4 py-3 text-[13px] text-brand text-center">
                      {txnErr}
                    </div>
                  )}
                </div>
              </Section>
            </>
          )}

          {/* DESKTOP BUTTON */}
          {step === "details" ? (
            <button className="hidden sm:block w-full rounded-full bg-foreground py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-brand hover:text-foreground">
              Proceed to Payment
            </button>
          ) : (
            <div className="flex flex-col gap-3 hidden sm:flex">
              <button
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-foreground py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-brand hover:text-foreground disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    Place order · Pay {formatINR(payNow)} now
                    {payMode === "cod" ? ` + ${formatINR(codDue)} COD` : ""}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setStep("details")}
                className="w-full rounded-full border border-border/70 py-3.5 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
              >
                Back to Address
              </button>
            </div>
          )}

          {/* MOBILE STICKY BUTTON */}
          <div className="fixed bottom-[56px] left-0 right-0 z-40 bg-background/95 border-t border-border/50 p-3 sm:p-4 backdrop-blur-md shadow-[0_-10px_40px_rgba(0,0,0,0.5)] sm:hidden">
            {step === "details" ? (
              <button className="w-full rounded-full bg-foreground py-3 sm:py-4 px-2 text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.24em] text-background transition active:bg-brand active:text-foreground text-center break-words whitespace-normal leading-tight">
                Proceed to Payment
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-foreground py-3 px-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-background transition active:bg-brand active:text-foreground text-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      Place order · Pay {formatINR(payNow)} now{payMode === "cod" ? ` + COD` : ""}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("details")}
                  className="w-full rounded-full border border-border/70 py-2.5 px-2 text-[11px] uppercase tracking-[0.1em] text-muted-foreground text-center"
                >
                  Back to Address
                </button>
              </div>
            )}
          </div>
        </form>

        <aside
          style={{ width: "100%", maxWidth: "100%", overflowX: "hidden" }}
          className="h-fit rounded-2xl border border-border/50 bg-card/40 p-6 lg:sticky lg:top-28"
        >
          <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Order summary
          </div>
          {freeUnits > 0 && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-brand/15 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-brand">
              <Gift className="h-3.5 w-3.5" /> B2G1 · {freeUnits} item{freeUnits > 1 ? "s" : ""}{" "}
              FREE
            </div>
          )}
          <ul className="mt-4 space-y-3 border-b border-border/50 pb-4 min-w-0 w-full">
            {lines.map(({ item, product, freeUnits: fu, lineSubtotal, lineDiscount }) => (
              <li
                key={
                  item.id +
                  item.size +
                  item.color
                }
                className="flex gap-3 min-w-0 w-full"
              >
                <img
                  src={product.images[0]}
                  alt=""
                  className="h-16 w-14 rounded object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 max-w-[calc(100%-68px)]">
                  <div className="truncate text-sm">{product.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {item.size} - {item.color} - Qty {item.qty}
                  </div>
                  {fu > 0 && (
                    <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-brand">
                      {fu}× Free · B2G1
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs">{formatINR(lineSubtotal)}</div>
                  {lineDiscount > 0 && (
                    <div className="font-mono text-[10px] text-brand">
                      −{formatINR(lineDiscount)}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 text-xs">
            <Row k="Subtotal" v={formatINR(subtotal)} />
            {discount > 0 && (
              <Row k={`Discount (${couponApplied})`} v={`−${formatINR(discount)}`} />
            )}
            <Row k="Shipping" v={shipping === 0 ? "Free" : formatINR(shipping)} />
            <div className="mt-3 flex justify-between border-t border-border/50 pt-3 text-sm font-semibold">
              <span>Total</span>
              <span className="font-mono">{formatINR(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
    </div>
    <div className="block bg-white min-h-screen w-full max-w-xl sm:max-w-4xl mx-auto sm:border-x sm:border-border/20 sm:shadow-2xl sm:my-8 sm:min-h-0 sm:rounded-xl overflow-hidden">
      <PumaMobileCheckout 
        cart={cart}
        getById={getById}
        contact={contact}
        setContact={setContact}
        address={address}
        setAddress={setAddress}
        stateName={stateName}
        setStateName={setStateName}
        pincode={pincode}
        setPincode={setPincode}
        totals={totals}
        submitPayment={submitPayment}
        userEmail={userEmail}
        updateQty={updateQty}
        removeFromCart={removeFromCart}
        applyCoupon={setAppliedCouponState}
        appliedCoupon={appliedCouponState}
        payMode={payMode}
        setPayMode={setPayMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        txnErr={txnErr}
      />
    </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="mb-2 font-display text-lg font-semibold">{title}</h2>
      {children}
    </div>
  );
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full min-w-0 max-w-full rounded-xl border border-border/60 bg-transparent px-4 py-3.5 text-sm transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
    />
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-mono">{v}</span>
    </div>
  );
}


function PumaMobileCheckout({ cart, getById, contact, setContact, address, setAddress, stateName, setStateName, pincode, setPincode, totals, submitPayment, userEmail, updateQty, removeFromCart, applyCoupon, appliedCoupon, payMode, setPayMode, activeTab, setActiveTab, txnErr }: any) {
  const [promoCode, setPromoCode] = useState(appliedCoupon || "");
  const [promoOpen, setPromoOpen] = useState(false);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<any>(null);
  const [showValidation, setShowValidation] = useState(false);
  const nav = useNavigate();

  const { products } = useCatalog();

  return (
    <div className="flex flex-col bg-white text-black font-sans pb-32">
      <div className="p-5">
        <h1 className="text-[22px] font-bold tracking-tight text-black uppercase mb-6">
          {activeTab === "CART" ? `MY SHOPPING CART (${cart.length})` : "CHECKOUT"}
        </h1>
        
        {/* Tabs */}
        {activeTab !== "CART" && (
          <div className="flex gap-4 border-b border-gray-200 mb-6">
            {["CART", "SHIPPING", "PAYMENT"].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`pb-2 text-[10px] font-bold uppercase tracking-widest ${activeTab === t ? 'text-black border-b-[3px] border-black' : 'text-gray-400 border-b-[3px] border-transparent'}`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* CART VIEW */}
        {activeTab === "CART" && (
          <div className="flex flex-col gap-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <ShoppingCart className="h-28 w-28 text-gray-300 mb-6 stroke-1" />
                <h2 className="text-[22px] font-bold text-black mb-12">Your Shopping Cart is Empty</h2>
                
                {/* Simulated "CUSTOMERS ALSO ORDERED" for empty state */}
                <div className="w-full text-left mt-8">
                  <h3 className="text-[15px] font-bold uppercase tracking-wider text-black mb-4">CUSTOMERS ALSO ORDERED</h3>
                  <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
                    {products.slice(0, 4).map((p: any) => (
                      <div key={p.id} className="min-w-[140px] w-[140px] shrink-0 snap-start">
                        <ProductCard p={p} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
            {cart.map((item: any) => {
              const product = getById(item.id);
              if (!product) return null;
              return (
                <div key={item.id + item.size} className="flex gap-4 border border-gray-200 p-4">
                  <div className="flex flex-col items-center gap-2">
                    <Link to={`/product/${item.id}`}>
                      <img src={product.images[0]} className="w-[100px] h-[100px] object-cover" />
                    </Link>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-green-700 border border-green-700 rounded-full px-2 py-0.5 flex items-center gap-1">
                       <Check className="h-3 w-3" /> IN STOCK
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <Link to={`/product/${item.id}`}>
                      <h3 className="text-[13px] font-bold text-black leading-tight mb-2 hover:underline">{product.name}</h3>
                    </Link>
                    <div className="text-[11px] text-gray-600 mb-0.5">Color: <br/>{item.color || "Standard"}</div>
                    <div className="text-[11px] text-gray-600 mb-0.5">Size: {item.size}</div>
                    <div className="text-[11px] text-gray-600 mb-3">Style Number: {item.id}</div>
                    
                    <div className="flex justify-between items-end mb-4">
                      <div className="flex items-center border border-gray-300 rounded-none w-fit h-9">
                        <button 
                          className="px-3 text-lg font-bold text-gray-600 hover:text-black h-full flex items-center justify-center bg-transparent"
                          onClick={() => {
                            if (item.qty > 1) {
                              updateQty(item.id, item.size, item.color, item.qty - 1);
                            } else {
                              setItemToRemove(item);
                            }
                          }}
                        >
                          -
                        </button>
                        <span className="px-3 text-sm font-semibold min-w-[30px] text-center border-l border-r border-gray-200">{item.qty}</span>
                        <button 
                          className="px-3 text-lg font-bold text-gray-600 hover:text-black h-full flex items-center justify-center bg-transparent"
                          onClick={() => updateQty(item.id, item.size, item.color, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      <button 
                        onClick={() => setItemToRemove(item)}
                        className="text-[11px] underline text-gray-500 font-medium"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {product.compareAt && <span className="text-[11px] text-gray-500 line-through">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.compareAt)}</span>}
                      <span className="text-[14px] font-bold text-[#b73232]">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="border border-gray-200 p-3 flex justify-center items-center gap-2 text-[11px] font-bold text-green-700 uppercase tracking-wide mt-2">
              <Truck className="h-4 w-4" /> YOU'VE EARNED FREE SHIPPING
            </div>
            
            <div className="border border-gray-200 p-3 flex justify-center items-center gap-2 text-[11px] font-bold text-black uppercase tracking-wide">
              <RefreshCw className="h-4 w-4" /> FREE RETURNS ON ALL QUALIFYING ORDERS.
            </div>

            {/* Promo Code Accordion */}
            <div className="mt-4 border border-gray-200">
              <button onClick={() => setPromoOpen(!promoOpen)} className="w-full bg-[#e6e6e6] p-4 flex justify-between items-center text-[12px] font-normal uppercase tracking-wider">
                APPLY A PROMO CODE <ChevronDown className={`h-4 w-4 transition-transform ${promoOpen ? 'rotate-180' : ''}`} />
              </button>
              {promoOpen && (
                <div className="p-4 flex flex-col gap-2 border-t border-white">
                  <div className="flex gap-2">
                    <input value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Enter a promo code" className="flex-1 border border-gray-300 p-3 text-[14px] outline-none focus:border-black rounded-none" />
                    <button 
                      onClick={() => {
                        if (totals.couponApplied && promoCode === totals.couponApplied) {
                           applyCoupon(""); setPromoCode("");
                        } else {
                           applyCoupon(promoCode);
                        }
                      }} 
                      className="bg-[#b3b9bc] text-black font-bold uppercase tracking-widest text-[13px] px-6"
                    >
                      {totals.couponApplied && promoCode === totals.couponApplied ? "REMOVE" : "APPLY"}
                    </button>
                  </div>
                  {appliedCoupon && !totals.couponApplied && (
                    <span className="text-red-500 text-xs mt-1 font-bold">Invalid coupon</span>
                  )}
                  {totals.couponApplied && (
                    <span className="text-green-600 text-xs mt-1 font-bold">Coupon applied!</span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-black">
                <span>SUBTOTAL</span>
                <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-green-700">
                  <span>DISCOUNT {totals.couponApplied ? `(${totals.couponApplied})` : (appliedCoupon ? `(${appliedCoupon})` : '')}</span>
                  <span>- {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-black">
                <span>SHIPPING COSTS</span>
                <span>FREE</span>
              </div>
              {payMode === "cod" && (
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-black">
                  <span>PROCESSING FEE</span>
                  <span>₹80</span>
                </div>
              )}
              <div className="border-t border-gray-300 my-2"></div>
              <div className="flex justify-between items-center text-[17px] font-bold text-black">
                <span>GRAND TOTAL <span className="text-[10px] font-normal tracking-wide ml-1">PRICES INCLUDE GST</span></span>
                <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(payMode === "cod" ? totals.total + 80 : totals.total)}</span>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
              <button onClick={() => { 
                if (!userEmail) {
                  nav({ to: "/login" });
                } else {
                  setActiveTab("SHIPPING"); window.scrollTo(0, 0); 
                }
              }} className="w-full bg-[#181818] text-white p-4 text-[15px] font-bold tracking-widest uppercase hover:bg-black">
                CHECKOUT
              </button>
            </div>
            
            <div className="w-full text-left mt-8">
              <h3 className="text-[15px] font-bold uppercase tracking-wider text-black mb-4">CUSTOMERS ALSO ORDERED</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {products.slice(0, 4).map((p: any) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            </div>
              </>
            )}

            {/* Remove Item Modal */}
            {itemToRemove && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
                <div className="w-full max-w-sm bg-white text-black font-sans shadow-2xl relative">
                  <div className="flex items-center justify-between p-5 pb-4">
                    <h2 className="text-[19px] sm:text-[21px] font-normal leading-tight text-gray-800 pr-4">
                      Are you sure you want to remove this item?
                    </h2>
                    <button onClick={() => setItemToRemove(null)} className="text-black hover:opacity-70 p-1 self-start">
                      <X className="h-5 w-5 stroke-[2]" />
                    </button>
                  </div>
                  
                  <div className="px-5 pb-5">
                    <div className="border border-gray-100 p-4 mb-6 flex gap-4">
                      <div className="relative w-[100px] shrink-0">
                        <img src={getById(itemToRemove.id)?.images[0]} alt="" className="w-full h-auto object-cover bg-gray-100" />
                        <div className="absolute bottom-1 left-1 bg-white rounded-full px-1.5 py-0.5 flex items-center gap-1 shadow-sm border border-gray-200">
                          <CheckCircle2 className="h-3 w-3 text-green-600" />
                          <span className="text-[8px] font-bold text-green-700 tracking-wider">IN STOCK</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col text-[11px] leading-tight flex-1">
                        <span className="font-bold text-[13px] mb-1 leading-snug">{getById(itemToRemove.id)?.name}</span>
                        <span className="text-gray-600 mb-0.5">Color: {itemToRemove.color || "Standard"}</span>
                        <span className="text-gray-600 mb-0.5">Size: {itemToRemove.size}</span>
                        <span className="text-gray-600 mb-2">Style Number: {itemToRemove.id.substring(0,8).toUpperCase()}</span>
                        
                        <span className="text-gray-600 mb-2">Quantity: {itemToRemove.qty}</span>
                        <span className="font-bold text-[13px]">₹{getById(itemToRemove.id)?.price.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button onClick={() => {
                        removeFromCart(itemToRemove.id, itemToRemove.size, itemToRemove.color);
                        setItemToRemove(null);
                      }} className="flex-1 bg-[#181818] text-white py-3.5 text-[14px] font-bold uppercase hover:bg-black">
                        REMOVE
                      </button>
                      <button onClick={() => setItemToRemove(null)} className="flex-1 bg-[#181818] text-white py-3.5 text-[14px] font-bold uppercase hover:bg-black">
                        CANCEL
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SHIPPING VIEW */}
        {activeTab === "SHIPPING" && (
          <div className="flex flex-col gap-6">
            <button onClick={() => setOrderDetailsOpen(!orderDetailsOpen)} className="bg-[#f4f4f4] p-4 flex justify-between items-center w-full">
              <span className="text-[12px] uppercase tracking-wider">ORDER DETAILS ({cart.length})</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${orderDetailsOpen ? 'rotate-180' : ''}`} />
            </button>
            {orderDetailsOpen && (
              <div className="flex flex-col gap-3 px-4">
                {cart.map((item: any) => {
                  const product = getById(item.id);
                  if (!product) return null;
                  return (
                    <div key={item.id + item.size} className="flex gap-3 border-b border-gray-200 pb-3">
                      <img src={product.images[0]} className="w-16 h-16 object-cover" />
                      <div className="flex-1 flex flex-col justify-center">
                        <span className="text-xs font-bold truncate">{product.name}</span>
                        <span className="text-[10px] text-gray-600">Qty: {item.qty} · Size: {item.size}</span>
                      </div>
                      <div className="flex items-center text-xs font-bold">
                        {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="bg-[#f4f4f4] p-4 flex justify-between items-center">
              <span className="text-[13px] font-normal uppercase tracking-wide">1. ADDRESSES</span>
            </div>

            <div>
              <h3 className="text-[17px] font-light text-black mb-6">Enter a Shipping Address</h3>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <label className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${showValidation && !contact.firstName ? 'text-red-600' : 'text-black'}`}>First Name <span className="text-red-700">*</span></label>
                  <input value={contact.firstName} onChange={(e) => { setContact({...contact, firstName: e.target.value}); setShowValidation(false); }} className={`w-full border p-3 text-[14px] text-black rounded-none focus:outline-none ${showValidation && !contact.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-black'}`} />
                </div>
                
                <div className="flex flex-col">
                  <label className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${showValidation && !contact.lastName ? 'text-red-600' : 'text-black'}`}>Last Name <span className="text-red-700">*</span></label>
                  <input value={contact.lastName} onChange={(e) => { setContact({...contact, lastName: e.target.value}); setShowValidation(false); }} className={`w-full border p-3 text-[14px] text-black rounded-none focus:outline-none ${showValidation && !contact.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-black'}`} />
                </div>
                
                <div className="flex flex-col">
                  <label className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${showValidation && pincode.length !== 6 ? 'text-red-600' : 'text-black'}`}>Pin Code <span className="text-red-700">*</span></label>
                  <input maxLength={6} pattern="\d{6}" value={pincode} onChange={(e) => { setPincode(e.target.value.replace(/\D/g, '')); setShowValidation(false); }} className={`w-full border p-3 text-[14px] text-black rounded-none focus:outline-none ${showValidation && pincode.length !== 6 ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-black'}`} />
                </div>

                <div className="flex flex-col">
                  <label className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${showValidation && !contact.city ? 'text-red-600' : 'text-black'}`}>City <span className="text-red-700">*</span></label>
                  <input value={contact.city} onChange={(e) => { setContact({...contact, city: e.target.value}); setShowValidation(false); }} className={`w-full border p-3 text-[14px] text-black rounded-none focus:outline-none ${showValidation && !contact.city ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-black'}`} />
                </div>

                <div className="flex flex-col">
                  <label className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${showValidation && !address ? 'text-red-600' : 'text-black'}`}>Address <span className="text-red-700">*</span></label>
                  <input placeholder="House No, Building, Street" value={address} onChange={(e) => { setAddress(e.target.value); setShowValidation(false); }} className={`w-full border p-3 text-[14px] text-black rounded-none focus:outline-none ${showValidation && !address ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-black'}`} />
                </div>

                <div className="flex flex-col">
                  <label className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${showValidation && (contact.phone || "").length !== 10 ? 'text-red-600' : 'text-black'}`}>Phone Number <span className="text-red-700">*</span></label>
                  <div className={`flex border ${showValidation && (contact.phone || "").length !== 10 ? 'border-red-500 bg-red-50' : (contact.phone && contact.phone.length < 10 ? 'border-red-500' : 'border-gray-300')} focus-within:border-black`}>
                    <div className={`p-3 text-[14px] border-r flex items-center justify-center font-medium ${showValidation && (contact.phone || "").length !== 10 ? 'border-red-300 bg-red-100 text-red-600' : 'bg-gray-100 border-gray-300 text-gray-600'}`}>+91</div>
                    <input maxLength={10} pattern="\d{10}" placeholder="10-digit mobile number" value={contact.phone || ""} onChange={(e) => { setContact({...contact, phone: e.target.value.replace(/\D/g, '')}); setShowValidation(false); }} className="w-full p-3 text-[14px] bg-transparent text-black rounded-none focus:outline-none" />
                  </div>
                  {showValidation && (contact.phone || "").length !== 10 && <span className="text-[10px] text-red-500 mt-1 font-bold">Please enter a valid 10-digit number</span>}
                </div>
              </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
              <button 
                onClick={() => {
                  if (!contact.firstName || !contact.lastName || pincode.length !== 6 || !contact.city || !address || (contact.phone || "").length !== 10) {
                    setShowValidation(true);
                    return;
                  }
                  setActiveTab("PAYMENT"); 
                  window.scrollTo(0, 0); 
                }} 
                className="w-full bg-[#181818] text-white p-4 text-[13px] font-bold tracking-widest uppercase hover:bg-black"
              >
                CONTINUE TO PAYMENT
              </button>
            </div>
          </div>
        )}

        {/* PAYMENT VIEW */}
        {activeTab === "PAYMENT" && (
          <div className="flex flex-col gap-6">
            <div className="bg-[#f4f4f4] p-4 flex justify-between items-center">
              <span className="text-[13px] font-normal uppercase tracking-wide">1. ADDRESSES</span>
              <button onClick={() => setActiveTab("SHIPPING")} className="text-[11px] text-gray-500 uppercase tracking-widest">EDIT</button>
            </div>
            
            <div className="bg-[#f4f4f4] p-4 flex justify-between items-center mb-4">
              <span className="text-[13px] font-normal uppercase tracking-wide">2. PAYMENT METHOD</span>
            </div>

            {txnErr && (
              <div className="mx-4 mb-2 rounded-none border border-red-300 bg-red-50 p-3 text-[12px] font-bold text-red-700 text-center uppercase tracking-wider">
                {txnErr}
              </div>
            )}
            
            <div className="flex flex-col gap-3 px-4">
              <div 
                className={`border p-4 flex items-center gap-3 cursor-pointer ${payMode === 'cod' ? 'border-black' : 'border-gray-200'}`} 
                onClick={() => setPayMode('cod')}
              >
                <div className={`w-4 h-4 rounded-full border-[4px] flex items-center justify-center ${payMode === 'cod' ? 'border-black' : 'border-gray-300'}`}>
                </div>
                <span className="text-[13px] text-black font-medium">Cash on Delivery (COD) - ₹80 Processing Fee</span>
              </div>
              
              <div 
                className={`border p-4 flex items-center gap-3 cursor-pointer ${payMode === 'full' ? 'border-black' : 'border-gray-200'}`} 
                onClick={() => setPayMode('full')}
              >
                <div className={`w-4 h-4 rounded-full border-[4px] flex items-center justify-center ${payMode === 'full' ? 'border-black' : 'border-gray-300'}`}>
                </div>
                <span className="text-[13px] text-black font-medium">UPI, CARDS & NET BANKING</span>
              </div>
            </div>
            
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
              <button onClick={submitPayment} className="w-full bg-[#181818] text-white p-4 text-[13px] font-bold tracking-widest uppercase hover:bg-black">
                PLACE ORDER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
