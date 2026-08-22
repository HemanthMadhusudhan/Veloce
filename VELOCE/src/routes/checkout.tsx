import { createFileRoute, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { 
  ShoppingBag, Trash2, ArrowLeft, Plus, Minus, Check, 
  MapPin, CreditCard, ShieldCheck, ChevronDown, ChevronRight,
  Truck, Ticket, AlertCircle, Loader2, Sparkles, Wallet,
  Banknote, Heart, Percent, Info, Lock, RefreshCw, CheckCircle2,
  ShieldAlert
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useShop, type Order } from "@/lib/store";
import { useCatalog } from "@/lib/catalog-store";
import { computeCart } from "@/lib/pricing";
import { ProductCard } from "@/components/ProductCard";
import { OrderReceiptPrinter } from "@/components/ReceiptPrinter";
import { createRazorpayOrder } from "@/lib/razorpay";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SiteChrome } from "@/components/chrome";

// Load Razorpay Checkout Script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
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
  validateSearch: (search: Record<string, unknown>): { step?: string } => ({
    step: typeof search?.step === "string" ? search.step : undefined,
  }),
  head: () => ({ meta: [{ title: "Bag & Checkout — Veloce Wear" }] }),
  component: () => (
    <SiteChrome>
      <CheckoutPage />
    </SiteChrome>
  ),
});

function CheckoutPage() {
  const { 
    cart, clearCart, placeOrder, userEmail, userId, updateProfile, profile, 
    orders, updateQty, removeFromCart, addToCart, wishlist, toggleWishlist, addWalletBalance 
  } = useShop();
  const { getById, products, deductStock } = useCatalog();
  const nav = useNavigate();
  const search = Route.useSearch() as { step?: string };

  // 4 steps synced with URL: "cart" | "select_address" | "address" | "payment"
  const step: "cart" | "select_address" | "address" | "payment" = 
    search.step === "payment" ? "payment" :
    search.step === "select_address" ? "select_address" :
    search.step === "address" ? "address" : "cart";

  const setStep = (newStep: "cart" | "select_address" | "address" | "payment") => {
    nav({
      to: "/checkout",
      search: { step: newStep },
    });
  };

  const handleBack = () => {
    if (step === "payment") {
      setStep("select_address");
    } else if (step === "address") {
      setStep("select_address");
    } else if (step === "select_address") {
      setStep("cart");
    } else {
      window.history.back();
    }
  };

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  // Dual-Button Sync: Track in-page actual buttons across all checkout steps
  const [showStickyCart, setShowStickyCart] = useState(false);
  const [showStickyAddress, setShowStickyAddress] = useState(false);
  const [showStickyPayment, setShowStickyPayment] = useState(false);

  // Dynamic estimated delivery date (4 days ahead of current date)
  const estimatedDeliveryDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 4);
    return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  }, []);

  const inlineProceedRef = useRef<HTMLButtonElement>(null);
  const inlineAddressProceedRef = useRef<HTMLButtonElement>(null);
  const inlinePaymentPayRef = useRef<HTMLButtonElement>(null);

  // Cart Step Sync
  useEffect(() => {
    if (step !== "cart") {
      setShowStickyCart(false);
      return;
    }
    const el = inlineProceedRef.current;
    if (!el) {
      setShowStickyCart(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyCart(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [step, cart.length]);

  // Address Step Sync
  useEffect(() => {
    if (step !== "select_address") {
      setShowStickyAddress(false);
      return;
    }
    const el = inlineAddressProceedRef.current;
    if (!el) {
      setShowStickyAddress(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyAddress(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [step]);

  // Payment Step Sync
  useEffect(() => {
    if (step !== "payment") {
      setShowStickyPayment(false);
      return;
    }
    const el = inlinePaymentPayRef.current;
    if (!el) {
      setShowStickyPayment(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyPayment(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [step]);

  // Address form fields
  const [pincode, setPincode] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [roadName, setRoadName] = useState("");
  const [cityName, setCityName] = useState("");
  const [stateName, setStateName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});

  // Pincode detection states
  const [isDetectingPincode, setIsDetectingPincode] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "detecting" | "valid" | "invalid">("idle");

  // Payment method: "prepaid" (UPI/Cards) | "wallet" | "cod"
  const [paymentOption, setPaymentOption] = useState<"prepaid" | "wallet" | "cod">("prepaid");

  // Accordion states
  const [offersExpanded, setOffersExpanded] = useState(false);
  const [priceExpanded, setPriceExpanded] = useState(true);
  const [promoExpanded, setPromoExpanded] = useState(false);

  // Promo code
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponInput, setCouponInput] = useState("");

  const hasStoredAddress = Boolean(contactName?.trim() && contactPhone?.trim() && pincode?.trim() && (houseNo?.trim() || roadName?.trim()));

  const handleProceedFromCart = () => {
    if (!userId) {
      toast.error("Please log in to continue with your order");
      nav({ to: "/login", search: { redirect: "/checkout" } as any });
      return;
    }

    if (hasStoredAddress) {
      setStep("select_address");
    } else {
      setStep("address"); // Show address adding page first
    }
  };

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const isFirstOrder = useMemo(() => orders.length === 0, [orders]);
  const totals = useMemo(
    () => computeCart(cart, getById, appliedCoupon, isFirstOrder),
    [cart, getById, appliedCoupon, isFirstOrder]
  );

  const { lines, subtotal, discount, total } = totals;

  // Wallet balance
  const walletBalance = profile?.walletBalance ?? 0;

  // Prepaid 10% discount
  const prepaidDiscount = paymentOption === "prepaid" ? Math.round((subtotal - discount) * 0.10) : 0;
  
  // Wallet deduction
  const basePayable = Math.max(0, total - prepaidDiscount);
  const walletUsed = paymentOption === "wallet" ? Math.min(walletBalance, basePayable) : 0;
  
  // Final amount to pay
  const finalPayable = Math.max(0, basePayable - walletUsed);

  // Related products generated dynamically when cart changes
  const relatedProducts = useMemo(() => {
    const inCartIds = new Set(cart.map((c) => c.id));
    const available = products.filter((p) => !inCartIds.has(p.id));
    return available.slice(0, 4);
  }, [products, cart]);

  // Load address from profile or localStorage on mount
  useEffect(() => {
    if (profile) {
      if (profile.fullName && !contactName) setContactName(profile.fullName);
      if (profile.phone && !contactPhone) setContactPhone(profile.phone);
      if (profile.addressLine1 && !houseNo) setHouseNo(profile.addressLine1);
      if (profile.addressLine2 && !roadName) setRoadName(profile.addressLine2);
      if (profile.city && !cityName) setCityName(profile.city);
      if (profile.state && !stateName) setStateName(profile.state);
      if (profile.postalCode && !pincode) setPincode(profile.postalCode);
    } else {
      try {
        const saved = localStorage.getItem("veloce_shipping_address");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.pincode) setPincode(parsed.pincode);
          if (parsed.houseNo) setHouseNo(parsed.houseNo);
          if (parsed.roadName) setRoadName(parsed.roadName);
          if (parsed.cityName) setCityName(parsed.cityName);
          if (parsed.stateName) setStateName(parsed.stateName);
          if (parsed.contactName) setContactName(parsed.contactName);
          if (parsed.contactPhone) setContactPhone(parsed.contactPhone);
        }
      } catch (e) {
        // ignore
      }
    }
  }, [profile]);

  // Synchronize and clamp existing cart item quantities against current live stock
  useEffect(() => {
    cart.forEach((item) => {
      const prod = getById(item.id);
      if (prod) {
        const availableStock =
          prod.stockBySize?.[item.size] !== undefined
            ? prod.stockBySize[item.size]
            : (prod.stock ?? 10);
        if (availableStock > 0 && item.qty > availableStock) {
          updateQty(item.id, item.size, item.color, availableStock, availableStock);
          toast.info(
            `Adjusted ${prod.name} (Size: ${item.size}) quantity to available stock (${availableStock})`
          );
        }
      }
    });
  }, [cart, getById, updateQty]);

  // If user is on select_address but has no stored address, show address adding form first
  useEffect(() => {
    if (step === "select_address" && !hasStoredAddress) {
      setStep("address");
    }
  }, [step, hasStoredAddress]);

  // Handle Indian Postal Pincode Auto-detection (6 digits)
  useEffect(() => {
    const cleanPin = pincode.trim();
    if (cleanPin.length === 6 && /^[1-9][0-9]{5}$/.test(cleanPin)) {
      setIsDetectingPincode(true);
      setPincodeStatus("detecting");
      fetch(`https://api.postalpincode.in/pincode/${cleanPin}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length > 0) {
            const po = data[0].PostOffice[0];
            setCityName(po.District || po.Block || po.Circle || "");
            setStateName(po.State || "");
            setPincodeStatus("valid");
            setAddressErrors((prev) => {
              const copy = { ...prev };
              delete copy.pincode;
              return copy;
            });
          } else {
            setPincodeStatus("invalid");
          }
        })
        .catch(() => {
          setPincodeStatus("idle");
        })
        .finally(() => {
          setIsDetectingPincode(false);
        });
    } else if (cleanPin.length > 0 && cleanPin.length < 6) {
      setPincodeStatus("idle");
    }
  }, [pincode]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (code === "B2G1" || code === "SAVE10" || code === "VELOCE500" || code === "FIRST10" || code === "MATCHDAY") {
      setAppliedCoupon(code);
      toast.success(`Coupon "${code}" applied successfully!`);
      setCouponInput("");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!pincode || pincode.length !== 6) errors.pincode = "Enter a valid 6-digit postal pincode";
    if (!houseNo.trim()) errors.houseNo = "House / Flat / Building is required";
    if (!roadName.trim()) errors.roadName = "Road / Area / Colony is required";
    if (!contactName.trim()) errors.contactName = "Contact Name is required";
    if (!contactPhone || contactPhone.length < 10) errors.contactPhone = "Enter a valid 10-digit mobile number";

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      toast.error("Please fill in all required address fields");
      return;
    }

    try {
      localStorage.setItem("veloce_shipping_address", JSON.stringify({
        pincode, houseNo, roadName, cityName, stateName, contactName, contactPhone
      }));
    } catch (e) {
      // ignore
    }

    if (userId) {
      updateProfile({
        fullName: contactName,
        phone: contactPhone,
        addressLine1: houseNo,
        addressLine2: roadName,
        city: cityName,
        state: stateName,
        postalCode: pincode
      });
    }

    toast.success("Delivery address saved successfully");
    setStep("select_address");
  };

  const handlePlaceOrder = async () => {
    if (lines.length === 0) {
      toast.error("Your shopping bag is empty");
      return;
    }

    if (!contactName || !contactPhone || !pincode) {
      toast.error("Please provide your delivery address first");
      setStep("address");
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentOption === "cod" || paymentOption === "prepaid") {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          toast.error("Payment gateway failed to load. Please check your internet connection.");
          setIsProcessing(false);
          return;
        }

        const amountToPay = paymentOption === "cod" ? 80 : finalPayable;

        let razorpayOrderId: string | undefined = undefined;
        try {
          const orderRes = await createRazorpayOrder({
            data: {
              amount: amountToPay * 100,
              currency: "INR",
              receipt: `rcpt_${Date.now().toString(36)}`,
            },
          });
          if (orderRes?.order_id) {
            razorpayOrderId = orderRes.order_id;
          }
        } catch (e) {
          console.log("Server order init notice:", e);
        }

        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_live_THlVoC2RWMM1V0";

        const options = {
          key: razorpayKey,
          amount: amountToPay * 100,
          currency: "INR",
          name: "Veloce Wear",
          description: paymentOption === "cod" ? "COD Advance Deposit (₹80)" : "Jersey Order Payment",
          image: "/logo.png",
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            await finishOrder(response.razorpay_payment_id || `PAY_${Date.now()}`);
          },
          prefill: {
            name: contactName,
            email: userEmail || "customer@velocewear.shop",
            contact: contactPhone
          },
          theme: {
            color: "#000000"
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              toast.error("Payment was cancelled");
            }
          }
        };

        const razorpayInstance = new (window as any).Razorpay(options);
        razorpayInstance.on("payment.failed", function (response: any) {
          setIsProcessing(false);
          toast.error(response.error.description || "Payment failed. Please try again.");
        });
        
        try {
          razorpayInstance.open();
        } catch (err) {
          await finishOrder(`SIM_PAY_${Date.now()}`);
        }
      } else {
        // Wallet payment
        await finishOrder(`WALLET_${Date.now()}`);
      }
    } catch (err) {
      setIsProcessing(false);
      toast.error("Could not initialize order. Please try again.");
    }
  };

  const finishOrder = async (paymentId: string) => {
    try {
      const richItems = lines.map((l) => ({
        id: l.item.id,
        name: l.product?.name || "Official Veloce Matchwear",
        image: l.product?.images?.[0] || "https://velocewear.shop/logo.png",
        price: l.product?.price || 699,
        compareAt: l.product?.compareAt || l.product?.price || 699,
        qty: l.item.qty,
        size: l.item.size,
        color: l.item.color,
        customName: l.item.customName,
        customNumber: l.item.customNumber,
      }));

      const created = await placeOrder({
        items: richItems,
        subtotal,
        discount: discount + prepaidDiscount,
        shipping: 0,
        tax: 0,
        total: paymentOption === "cod" ? 80 : finalPayable,
        customer: {
          email: userEmail || "customer@velocewear.shop",
          name: contactName,
          phone: contactPhone,
          address: `${houseNo}, ${roadName}`,
          city: cityName,
          state: stateName,
          pincode: pincode
        },
        payment: {
          method: paymentOption === "wallet" ? "wallet" : "razorpay",
          vpa: "",
          txnId: paymentId,
          mode: paymentOption === "cod" ? "cod" : paymentOption === "wallet" ? "wallet" : "full",
          paidNow: paymentOption === "cod" ? 80 : finalPayable,
          codDue: paymentOption === "cod" ? Math.max(0, (subtotal - discount) - 80) : 0,
        },
        status: "pending"
      });

      // Deduct wallet balance if wallet was used
      if (paymentOption === "wallet" && walletUsed > 0 && userId) {
        try {
          const remainingWallet = Math.max(0, (walletBalance || 0) - walletUsed);
          await supabase.from("users").update({ wallet_balance: remainingWallet }).eq("id", userId);
          await supabase.from("wallet_transactions").insert({
            user_id: userId,
            amount: walletUsed,
            type: "debit",
            description: `Order Payment for #${created.id}`
          });
          updateProfile({ walletBalance: remainingWallet });
        } catch (wErr) {
          console.error("Wallet deduction error:", wErr);
        }
      }

      // Deduct stock for all ordered items immediately and sync across app
      try {
        await deductStock(
          lines.map((l) => ({
            id: l.product.id,
            size: l.item.size,
            qty: l.item.qty,
          }))
        );
      } catch (stockDeductErr) {
        console.error("Failed to deduct stock:", stockDeductErr);
      }

      clearCart();
      setCompletedOrder(created);
      setIsProcessing(false);
      toast.success("Order Placed Successfully!");
    } catch (e) {
      setIsProcessing(false);
      toast.error("Failed to save order. Please check your connection.");
    }
  };

  // When order is completed, auto scroll to top immediately and intercept browser back navigation
  useEffect(() => {
    if (!completedOrder) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    window.history.pushState({ orderDone: true }, "", window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      setCompletedOrder(null);
      nav({ to: "/" });
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [completedOrder, nav]);

  // Order Confirmed State - Animated Thermal Receipt Printer
  if (completedOrder) {
    return (
      <div className="bg-neutral-50/50 min-h-[70vh] pt-2 pb-8 sm:pt-4 sm:pb-12 flex flex-col items-center justify-start animate-in fade-in duration-300">
        <OrderReceiptPrinter
          order={completedOrder}
          onContinueShopping={() => {
            setCompletedOrder(null);
            nav({ to: "/" });
          }}
        />
      </div>
    );
  }

  // Empty Bag State
  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-center font-sans bg-white min-h-[50vh] flex flex-col items-center justify-center animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-400 mb-6">
          <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">Your Bag is Empty</h1>
        <p className="text-xs sm:text-sm font-medium text-neutral-600 mt-2 mb-8 max-w-md">
          Looks like you haven't added any jerseys or apparel to your bag yet. Explore our latest kits, F1 gear, and World Cup collection!
        </p>
        <Link
          to="/shop"
          className="bg-black text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#d32f2f] transition-all shadow-md active:scale-95"
        >
          Explore Kits
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2 sm:pt-3 pb-8 sm:pb-10 text-neutral-900 font-sans bg-white">
      {/* ---------------------------------------------------- */}
      {/* STEP INDICATOR HEADER */}
      {/* ---------------------------------------------------- */}
      <div className="flex items-center justify-center gap-3 sm:gap-6 mb-5 sm:mb-7 text-xs sm:text-sm font-bold uppercase tracking-wider select-none border-b border-neutral-100 pb-3.5">
        <button 
          onClick={() => setStep("cart")} 
          className={`flex items-center gap-2 transition-colors cursor-pointer ${step === "cart" ? "text-[#d32f2f]" : "text-neutral-500 hover:text-black"}`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold ${step === "cart" ? "bg-[#d32f2f] text-white shadow-xs" : "bg-neutral-100 text-neutral-800"}`}>
            1
          </span>
          <span className={step === "cart" ? "font-bold" : "font-semibold"}>Bag</span>
        </button>

        <span className="text-neutral-300 font-bold">/</span>

        <button 
          onClick={() => lines.length > 0 && setStep("select_address")} 
          className={`flex items-center gap-2 transition-colors cursor-pointer ${step === "select_address" || step === "address" ? "text-[#d32f2f]" : "text-neutral-500 hover:text-black"}`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold ${step === "select_address" || step === "address" ? "bg-[#d32f2f] text-white shadow-xs" : "bg-neutral-100 text-neutral-800"}`}>
            2
          </span>
          <span className={step === "select_address" || step === "address" ? "font-bold" : "font-semibold"}>Address</span>
        </button>

        <span className="text-neutral-300 font-bold">/</span>

        <button 
          onClick={() => lines.length > 0 && contactName && pincode && setStep("payment")} 
          className={`flex items-center gap-2 transition-colors cursor-pointer ${step === "payment" ? "text-[#d32f2f]" : "text-neutral-400"}`}
        >
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold ${step === "payment" ? "bg-[#d32f2f] text-white shadow-xs" : "bg-neutral-100 text-neutral-700"}`}>
            3
          </span>
          <span className={step === "payment" ? "font-bold" : "font-semibold"}>Payment</span>
        </button>
      </div>

      {/* ---------------------------------------------------- */}
      {/* PAGE 1: BAG SCREEN (Responsive 2-Column Desktop Grid) */}
      {/* ---------------------------------------------------- */}
      {step === "cart" && (
        <div className="animate-in fade-in duration-200">
          <div className="lg:grid lg:grid-cols-12 lg:gap-10 xl:gap-14 lg:items-start">
            {/* Left Column: Items List & Details */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5">
              {/* Header Title */}
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3.5">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">Shopping Bag</h1>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 font-semibold">
                    {cart.length} {cart.length === 1 ? "item" : "items"} <span className="mx-1 text-neutral-300">|</span> ₹{total.toLocaleString("en-IN")}
                  </p>
                </div>
                <Link to="/shop" className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#d32f2f] hover:underline">
                  + Add more items
                </Link>
              </div>

              {/* Cart Items List */}
              <div className="flex flex-col divide-y divide-neutral-100">
                {lines.map((line, idx) => {
                  const { item, product: p } = line;
                  const isWished = wishlist.includes(p.id);

                  return (
                    <div 
                      key={`${item.id}-${item.size}-${idx}`}
                      className="py-4 sm:py-6 first:pt-1 flex gap-3.5 sm:gap-6 group"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-24 h-28 sm:w-32 sm:h-36 shrink-0 bg-[#f8f8f8] border border-neutral-200/80 rounded-2xl overflow-hidden flex items-center justify-center p-2 self-start shadow-2xs">
                        <img 
                          src={p.images[0]} 
                          alt={p.name} 
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Details & Controls */}
                      <div className="flex flex-col flex-1 justify-between min-w-0">
                        <div className="space-y-1">
                          <div className="flex justify-between items-start gap-2.5">
                            <h3 className="font-bold text-sm sm:text-base text-neutral-900 leading-snug">
                              {p.name}
                            </h3>
                            <span className="font-bold text-sm sm:text-base text-neutral-900 shrink-0 font-sans">
                              ₹{(p.price * item.qty).toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-neutral-500 capitalize pt-0.5 font-semibold flex-wrap">
                            <span className="bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded text-[11px] font-bold">
                              {p.category || p.tag || "Kit"}
                            </span>
                            <span>·</span>
                            <span className="font-bold text-neutral-900">Size: {item.size}</span>
                            {(() => {
                              const prod = getById(item.id);
                              const availableStock =
                                prod?.stockBySize?.[item.size] !== undefined
                                  ? prod.stockBySize[item.size]
                                  : (prod?.stock ?? (p?.stock || 10));
                              if (availableStock <= 5) {
                                return (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded-md">
                                    Only {availableStock} left!
                                  </span>
                                );
                              }
                              return null;
                            })()}
                          </div>

                          <div className="text-[11px] sm:text-xs text-neutral-600 flex flex-wrap items-center gap-2 pt-0.5 font-medium">
                            <span className="flex items-center gap-1 text-[#0fa958] font-semibold">
                              <Truck className="h-3.5 w-3.5" /> Delivery by {estimatedDeliveryDate}
                            </span>
                            <span className="text-neutral-300">·</span>
                            <span>4-Day Return</span>
                          </div>
                        </div>

                        {/* Quantity Stepper & Action Controls */}
                        <div className="flex items-center justify-between pt-3 mt-1.5 border-t border-neutral-100">
                          <div className="flex items-center gap-2.5">
                            {/* Quantity Pill */}
                            <div className="flex items-center gap-2.5 border border-neutral-300 rounded-full px-2.5 py-1 text-xs font-semibold text-neutral-900 bg-white shadow-2xs">
                              <button
                                onClick={() => {
                                  if (item.qty > 1) {
                                    updateQty(item.id, item.size, item.color, item.qty - 1);
                                  } else {
                                    removeFromCart(item.id, item.size, item.color);
                                  }
                                }}
                                className="text-neutral-500 hover:text-black transition-colors cursor-pointer p-0.5"
                                aria-label="Decrease quantity"
                              >
                                {item.qty === 1 ? <Trash2 className="h-3.5 w-3.5" /> : <Minus className="h-3 w-3 stroke-[2.5]" />}
                              </button>
                              <span className="w-4 text-center font-bold text-xs">{item.qty}</span>
                              <button
                                onClick={() => {
                                  const prod = getById(item.id);
                                  const availableStock =
                                    prod?.stockBySize?.[item.size] !== undefined
                                      ? prod.stockBySize[item.size]
                                      : (prod?.stock ?? (p?.stock || 10));

                                  if (item.qty >= availableStock) {
                                    toast.error(`Only ${availableStock} items in stock for size ${item.size}`);
                                    return;
                                  }
                                  updateQty(item.id, item.size, item.color, item.qty + 1, availableStock);
                                }}
                                disabled={(() => {
                                  const prod = getById(item.id);
                                  const availableStock =
                                    prod?.stockBySize?.[item.size] !== undefined
                                      ? prod.stockBySize[item.size]
                                      : (prod?.stock ?? (p?.stock || 10));
                                  return item.qty >= availableStock;
                                })()}
                                className="text-neutral-500 hover:text-black transition-colors cursor-pointer p-0.5 disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                              </button>
                            </div>

                            {/* Wishlist Button */}
                            <button
                              onClick={() => {
                                toggleWishlist(p.id);
                              }}
                              className={`h-8 px-2.5 rounded-full border flex items-center gap-1.5 text-[11px] font-semibold transition-all cursor-pointer ${
                                isWished ? "border-[#d32f2f] text-[#d32f2f] bg-[#d32f2f]/5" : "border-neutral-300 bg-white text-neutral-700 hover:border-black"
                              }`}
                            >
                              <Heart className={`h-3.5 w-3.5 ${isWished ? "fill-[#d32f2f]" : ""}`} />
                              <span className="hidden sm:inline">{isWished ? "Saved" : "Save for later"}</span>
                            </button>
                          </div>

                          <button
                            onClick={() => {
                              removeFromCart(item.id, item.size, item.color);
                            }}
                            className="text-xs text-neutral-500 hover:text-[#d32f2f] transition-colors flex items-center gap-1 cursor-pointer font-semibold"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile 1-Line Running Perks Banner */}
              <div className="sm:hidden w-full overflow-hidden bg-neutral-50/90 border border-neutral-200/80 rounded-xl py-2 my-0.5 select-none">
                <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
                  {[0, 1].map((copyIdx) => (
                    <div key={copyIdx} className="flex shrink-0 items-center gap-6 pr-6 text-[11px] font-bold text-neutral-800" aria-hidden={copyIdx > 0}>
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <Truck className="h-3.5 w-3.5 text-[#d32f2f]" />
                        <span>Free Pan-India Delivery</span>
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <RefreshCw className="h-3.5 w-3.5 text-[#d32f2f]" />
                        <span>4-Day Easy Exchange</span>
                      </span>
                      <span className="text-neutral-300">•</span>
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#d32f2f]" />
                        <span>100% Authentic Matchwear</span>
                      </span>
                      <span className="text-neutral-300">•</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Perks Strip */}
              <div className="hidden sm:grid sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-200/60 text-xs sm:text-sm mt-1">
                <div className="flex items-center gap-2 text-neutral-800 font-bold">
                  <Truck className="h-4 w-4 text-[#d32f2f] shrink-0" />
                  <span>Free Pan-India Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-800 font-bold">
                  <RefreshCw className="h-4 w-4 text-[#d32f2f] shrink-0" />
                  <span>4-Day Easy Exchange</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-800 font-bold">
                  <ShieldCheck className="h-4 w-4 text-[#d32f2f] shrink-0" />
                  <span>100% Authentic Matchwear</span>
                </div>
              </div>

              {/* MOBILE ONLY: Promo Code & Order Summary (Above Related Products) */}
              <div className="lg:hidden flex flex-col gap-3 mt-1">
                {/* Promo Code Box */}
                <div className="border border-neutral-200/80 bg-white rounded-xl p-3.5 shadow-xs">
                  <div 
                    onClick={() => setPromoExpanded(!promoExpanded)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="text-neutral-800 bg-neutral-100 p-2 rounded-full">
                        <Ticket className="h-4 w-4 stroke-[2]" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Have a promo code?</h4>
                        <p className="text-[11px] text-neutral-500 font-medium">Apply now to get instant savings</p>
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${promoExpanded ? "rotate-180" : ""}`} />
                  </div>

                  {promoExpanded && (
                    <form onSubmit={handleApplyCoupon} className="mt-3 pt-3 border-t border-neutral-100 flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. B2G1, SAVE10"
                        className="flex-1 border border-neutral-300 bg-white px-3.5 py-2 text-xs font-bold rounded-xl outline-none focus:border-black uppercase"
                      />
                      <button
                        type="submit"
                        className="bg-black text-white px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {appliedCoupon && (
                    <div className="mt-2.5 bg-[#e6f7ef] border border-[#a3e4c4] p-2.5 rounded-xl flex items-center justify-between text-xs font-bold">
                      <span className="text-[#0fa958]">Applied: {appliedCoupon}</span>
                      <button 
                        onClick={() => { setAppliedCoupon(""); toast.success("Coupon removed", { duration: 1500 }); }}
                        className="text-[#0fa958] font-bold hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Order Summary Box (Mobile) */}
                <div className="border border-neutral-200/80 bg-neutral-50/60 rounded-xl p-4 shadow-xs space-y-3">
                  <h3 className="font-bold text-base text-neutral-900">Order Summary</h3>

                  <div className="space-y-2 text-xs sm:text-sm font-semibold text-neutral-700">
                    <div className="flex justify-between">
                      <span>Bag Total ({cart.length} {cart.length === 1 ? "item" : "items"})</span>
                      <span className="font-bold text-neutral-900">₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-[#0fa958] font-bold">
                        <span>Coupon Discount</span>
                        <span>- ₹{discount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <div className="flex items-center gap-1">
                        <span>Shipping Charges</span>
                        <Info className="h-3.5 w-3.5 text-neutral-400" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-neutral-400 line-through">₹99</span>
                        <span className="text-[#0fa958] font-bold">FREE</span>
                      </div>
                    </div>

                    <div className="border-t border-neutral-200 pt-2.5 flex justify-between items-center font-bold text-base text-neutral-900">
                      <span>You Pay</span>
                      <span>₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Inline Actual Proceed to Buy Button */}
                  <button
                    ref={inlineProceedRef}
                    onClick={handleProceedFromCart}
                    className="w-full bg-black text-white h-12 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Proceed to Buy</span>
                    <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-neutral-500 pt-0.5">
                    <Lock className="h-3 w-3" />
                    <span>256-Bit SSL Encrypted & Secure Checkout</span>
                  </div>
                </div>
              </div>

              {/* Related Products Section */}
              {relatedProducts.length > 0 && (
                <div className="pt-6 border-t border-neutral-200">
                  <div className="flex items-center justify-between mb-3.5">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-neutral-900">You Might Also Like</h3>
                      <p className="text-xs text-neutral-500 font-medium">Popular matchwear & curated trending kits</p>
                    </div>
                    <span className="text-[10px] bg-neutral-100 text-neutral-800 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                      Trending
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {relatedProducts.map((prod) => (
                      <ProductCard key={prod.id} p={prod} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DESKTOP ONLY Right Column: Sticky Promo & Order Summary Sidebar */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4 mt-8 lg:mt-0 space-y-4 lg:sticky lg:top-24">
              {/* Promo Code Box */}
              <div className="border border-neutral-200/80 bg-white rounded-2xl p-4 sm:p-5 shadow-xs">
                <div 
                  onClick={() => setPromoExpanded(!promoExpanded)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-neutral-800 bg-neutral-100 p-2 rounded-full">
                      <Ticket className="h-4 w-4 stroke-[2]" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Have a promo code?</h4>
                      <p className="text-[11px] text-neutral-500 font-medium">Apply now to get instant savings</p>
                    </div>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${promoExpanded ? "rotate-180" : ""}`} />
                </div>

                {promoExpanded && (
                  <form onSubmit={handleApplyCoupon} className="mt-3.5 pt-3.5 border-t border-neutral-100 flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. B2G1, SAVE10"
                      className="flex-1 border border-neutral-300 bg-white px-3.5 py-2.5 text-xs font-bold rounded-xl outline-none focus:border-black uppercase"
                    />
                    <button
                      type="submit"
                      className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}

                {appliedCoupon && (
                  <div className="mt-3 bg-[#e6f7ef] border border-[#a3e4c4] p-3 rounded-xl flex items-center justify-between text-xs font-bold">
                    <span className="text-[#0fa958]">Applied: {appliedCoupon}</span>
                    <button 
                      onClick={() => { setAppliedCoupon(""); toast.success("Coupon removed", { duration: 1500 }); }}
                      className="text-[#0fa958] font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary Box (Desktop) */}
              <div className="border border-neutral-200/80 bg-neutral-50/60 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <h3 className="font-bold text-lg text-neutral-900">Order Summary</h3>

                <div className="space-y-2.5 text-xs sm:text-sm font-semibold text-neutral-700">
                  <div className="flex justify-between">
                    <span>Bag Total ({cart.length} {cart.length === 1 ? "item" : "items"})</span>
                    <span className="font-bold text-neutral-900">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-[#0fa958] font-bold">
                      <span>Coupon Discount</span>
                      <span>- ₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <span>Shipping Charges</span>
                      <Info className="h-3.5 w-3.5 text-neutral-400" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-400 line-through">₹99</span>
                      <span className="text-[#0fa958] font-bold">FREE</span>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-3 flex justify-between items-center font-bold text-base sm:text-lg text-neutral-900">
                    <span>You Pay</span>
                    <span>₹{total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedFromCart}
                  className="w-full bg-black text-white h-13 rounded-full text-sm font-bold tracking-wide hover:bg-neutral-800 transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2 uppercase"
                >
                  <span>Proceed to Buy</span>
                  <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-neutral-500 pt-1">
                  <Lock className="h-3.5 w-3.5" />
                  <span>256-Bit SSL Encrypted & Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Fixed Bottom Bar - Synchronized to ONLY show when inline button is scrolled away */}
          <div className={`lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-neutral-200 z-50 shadow-lg flex items-center justify-between gap-4 transition-all duration-300 ${
            showStickyCart ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
          }`}>
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-500">Total Payable</div>
              <div className="font-bold text-base sm:text-lg text-neutral-900">₹{total.toLocaleString("en-IN")}</div>
            </div>
            <button
              onClick={handleProceedFromCart}
              className="flex-1 bg-black text-white h-12 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Proceed to Buy</span>
              <ChevronRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* PAGE 2: SELECT ADDRESS SCREEN (Clear, Prominent Order Summary) */}
      {/* ---------------------------------------------------- */}
      {step === "select_address" && (
        <div className="animate-in fade-in duration-200 max-w-xl mx-auto flex flex-col gap-3.5 pb-20 sm:pb-2">
          {/* Header with Back button */}
          <div className="flex items-center gap-3 border-b border-neutral-200 pb-3">
            <button 
              onClick={handleBack}
              className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer text-black"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5 stroke-[2.5]" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-neutral-900">Select Delivery Address</h1>
          </div>

          {/* Deliver to Card */}
          <div className="border border-neutral-200/80 bg-white rounded-2xl p-4 sm:p-4.5 shadow-xs">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-black shrink-0" />
                <h4 className="text-sm sm:text-base font-bold text-neutral-900 leading-snug">
                  Deliver to {contactName}, {pincode}
                </h4>
              </div>
              <span className="bg-[#e6f7ef] text-[#0fa958] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
                Saved Address
              </span>
            </div>

            <div className="text-xs sm:text-sm text-neutral-700 space-y-1 pl-6 leading-relaxed font-medium">
              <div className="text-neutral-900 font-bold text-sm">{contactName}</div>
              <div>{houseNo ? `${houseNo}, ${roadName}` : roadName} — <span className="font-bold text-black">{pincode}</span></div>
              <div>{cityName}{stateName ? `, ${stateName}` : ''}</div>
              <div className="text-neutral-800 font-mono font-semibold pt-0.5">Phone: +91-{contactPhone}</div>
            </div>

            <button
              onClick={() => setStep("address")}
              className="mt-3.5 w-full border border-neutral-300 rounded-xl py-2.5 text-xs font-bold text-neutral-900 bg-white hover:border-black hover:bg-neutral-50 transition-colors cursor-pointer text-center uppercase tracking-wider"
            >
              Change or Add New Address
            </button>
          </div>

          {/* Delivery Estimate Box */}
          <div className="border border-neutral-200/80 bg-white rounded-2xl p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-[#d32f2f]" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Estimated Delivery: {estimatedDeliveryDate}</h4>
                <p className="text-xs text-neutral-600 font-medium">Shipped with premium express courier</p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#0fa958] uppercase">Express</span>
          </div>

          {/* Order Summary & Proceed to Pay Box (Big, Clear & Easy to Understand) */}
          <div className="border border-neutral-200/90 bg-neutral-50/70 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
            <h4 className="text-base sm:text-lg font-bold text-neutral-900 border-b border-neutral-200/60 pb-2.5">Order Summary</h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-neutral-800 font-semibold">
              <div className="flex justify-between items-center">
                <span>Bag Total ({cart.length} {cart.length === 1 ? "item" : "items"})</span>
                <span className="font-bold text-neutral-900 text-sm sm:text-base">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-[#0fa958] font-bold">
                  <span>Coupon Discount</span>
                  <span>- ₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>Shipping Charges</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400 line-through text-xs font-medium">₹99</span>
                  <span className="text-[#0fa958] font-bold">FREE</span>
                </div>
              </div>
              <div className="border-t border-neutral-300/80 pt-3 flex justify-between items-center font-bold text-neutral-900 text-base sm:text-lg">
                <span>Total Amount to Pay</span>
                <span className="text-lg sm:text-xl font-bold">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* In-page Actual Proceed to Pay Button directly under Order Summary */}
            <div className="pt-2">
              <button
                ref={inlineAddressProceedRef}
                onClick={() => setStep("payment")}
                className="w-full bg-black text-white h-13 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed to Pay</span>
                <ChevronRight className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Mobile Fixed Bottom Bar - Synchronized to ONLY show when in-page button is scrolled away */}
          <div className={`lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-neutral-200 z-50 shadow-lg flex items-center justify-between gap-4 transition-all duration-300 ${
            showStickyAddress ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
          }`}>
            <div>
              <div className="text-[10px] uppercase font-bold text-neutral-500">Total Payable</div>
              <div className="font-bold text-base sm:text-lg text-neutral-900">₹{total.toLocaleString("en-IN")}</div>
            </div>
            <button
              onClick={() => setStep("payment")}
              className="flex-1 bg-black text-white h-12 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Proceed to Pay</span>
              <ChevronRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* PAGE 3: PAYMENT SCREEN */}
      {/* ---------------------------------------------------- */}
      {step === "payment" && (
        <div className="animate-in fade-in duration-200 max-w-md mx-auto flex flex-col gap-3 pb-20 sm:pb-4">
          {/* Header with Back button */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
            <div className="flex items-center gap-2.5">
              <button 
                onClick={handleBack}
                className="p-1 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer text-black"
                aria-label="Back to Address"
              >
                <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
              </button>
              <h1 className="text-base sm:text-lg font-bold text-neutral-900">
                Pay ₹{paymentOption === "cod" ? "80" : finalPayable.toLocaleString("en-IN")}
              </h1>
            </div>
            {/* Razorpay Trust Badge */}
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#0c2340] bg-[#0c2340]/5 px-2 py-0.5 rounded border border-[#0c2340]/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0fa958] animate-pulse" />
              <span>Razorpay Secured</span>
            </div>
          </div>

          {/* Save More with 2 Offers Accordion */}
          <div className="border border-neutral-200/80 bg-white rounded-xl shadow-xs overflow-hidden">
            <div 
              onClick={() => setOffersExpanded(!offersExpanded)}
              className="p-3 sm:p-3.5 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full border border-neutral-900 flex items-center justify-center text-neutral-900 font-bold">
                  <Percent className="h-3 w-3 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Save more with 2 Offers</h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500 font-medium">Cards, UPI, Net banking etc.</p>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${offersExpanded ? "rotate-180" : ""}`} />
            </div>

            {offersExpanded && (
              <div className="px-3.5 pb-3 pt-1 border-t border-neutral-100 flex flex-col gap-2 text-xs">
                <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200/50">
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="h-3 w-3 text-[#0fa958]" />
                    <span>1. 10% Instant OFF on Prepaid Orders</span>
                  </div>
                  <p className="text-[10px] text-neutral-600 font-medium mt-0.5">Applied automatically on UPI, Cards & Netbanking</p>
                </div>
                <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200/50">
                  <div className="font-bold text-neutral-900 flex items-center gap-1.5 text-[11px]">
                    <Wallet className="h-3 w-3 text-neutral-700" />
                    <span>2. Veloce Wallet Cashback</span>
                  </div>
                  <p className="text-[10px] text-neutral-600 font-medium mt-0.5">Assured cashback credit on all jersey purchases</p>
                </div>
              </div>
            )}
          </div>

          {/* Section: Select payment option */}
          <div className="flex flex-col gap-2 pt-0.5">
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900 uppercase tracking-wider">Select payment option</h3>

            {/* Option 1: UPI, Cards & More (With Real Logos) */}
            <div 
              onClick={() => setPaymentOption("prepaid")}
              className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                paymentOption === "prepaid" ? "border-neutral-900 bg-white shadow-xs ring-1 ring-black" : "border-neutral-200 bg-white hover:border-neutral-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CreditCard className="h-4 w-4 text-neutral-800 stroke-[2]" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-neutral-900">UPI, Cards & More</h4>
                      <span className="bg-[#e6f7ef] text-[#0fa958] text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded">10% OFF</span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-neutral-600 font-medium">Get 10% instant discount on all prepaid payments</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${paymentOption === "prepaid" ? "border-black bg-black" : "border-neutral-300"}`}>
                  {paymentOption === "prepaid" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
              </div>


            </div>

            {/* Option 2: Wallet */}
            <div 
              onClick={() => setPaymentOption("wallet")}
              className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                paymentOption === "wallet" ? "border-neutral-900 bg-white shadow-xs ring-1 ring-black" : "border-neutral-200 bg-white hover:border-neutral-400"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wallet className="h-4 w-4 text-neutral-800 stroke-[2]" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Veloce Wallet</h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-600 font-mono font-semibold">Balance: ₹{walletBalance}</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${paymentOption === "wallet" ? "border-black bg-black" : "border-neutral-300"}`}>
                {paymentOption === "wallet" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>

            {/* Option 3: Cash on Delivery */}
            <div 
              onClick={() => setPaymentOption("cod")}
              className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                paymentOption === "cod" ? "border-neutral-900 bg-white shadow-xs ring-1 ring-black" : "border-neutral-200 bg-white hover:border-neutral-400"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Banknote className="h-4 w-4 text-neutral-800 stroke-[2]" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Cash on Delivery</h4>
                  <p className="text-[10px] sm:text-[11px] text-neutral-600 font-medium">Pay ₹80 advance, balance on delivery</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${paymentOption === "cod" ? "border-black bg-black" : "border-neutral-300"}`}>
                {paymentOption === "cod" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
          </div>

          {/* Section: Order Information */}
          <div className="flex flex-col gap-2 pt-1">
            <h3 className="text-xs sm:text-sm font-bold text-neutral-900 uppercase tracking-wider">Order Information</h3>

            {/* Deliver to card */}
            <div className="border border-neutral-200/80 bg-white rounded-xl p-3 shadow-xs flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-900 truncate pr-2">
                Deliver to {contactName || "sample"}, {pincode || "400001"}
              </span>
              <button onClick={() => setStep("address")} className="text-xs font-bold text-[#d32f2f] hover:underline cursor-pointer uppercase shrink-0">
                Edit
              </button>
            </div>

            {/* Price Details card */}
            <div className="border border-neutral-200/80 bg-white rounded-xl shadow-xs overflow-hidden">
              <div 
                onClick={() => setPriceExpanded(!priceExpanded)}
                className="p-3 flex items-center justify-between cursor-pointer"
              >
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900">Price Details</h4>
                <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform duration-200 ${priceExpanded ? "rotate-180" : ""}`} />
              </div>

              {priceExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-neutral-100 space-y-1.5 text-[11px] sm:text-xs text-neutral-700 font-medium">
                  <div className="flex justify-between">
                    <span>Bag Total</span>
                    <span className="font-bold text-neutral-900">₹{subtotal.toLocaleString("en-IN")}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-[#0fa958] font-bold">
                      <span>Coupon Discount</span>
                      <span>- ₹{discount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  {paymentOption === "prepaid" && prepaidDiscount > 0 && (
                    <div className="flex justify-between text-[#0fa958] font-bold">
                      <span>10% Prepaid Offer</span>
                      <span>- ₹{prepaidDiscount.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  {paymentOption === "wallet" && walletUsed > 0 && (
                    <div className="flex justify-between text-[#0fa958] font-bold">
                      <span>Wallet Balance</span>
                      <span>- ₹{walletUsed.toLocaleString("en-IN")}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      <span>Shipping Charges</span>
                      <Info className="h-3 w-3 text-neutral-400" />
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-neutral-400 line-through">₹99</span>
                      <span className="text-[#0fa958] font-bold">Free</span>
                    </div>
                  </div>

                  {paymentOption === "cod" ? (
                    <>
                      <div className="flex justify-between font-bold text-neutral-900 border-t border-neutral-200 pt-2 text-xs sm:text-sm">
                        <span>COD Advance (Pay Now)</span>
                        <span className="text-[#d32f2f]">₹80</span>
                      </div>
                      <div className="flex justify-between font-medium text-neutral-600">
                        <span>Balance Due on Delivery</span>
                        <span className="font-bold text-neutral-900">₹{Math.max(0, (subtotal - discount) - 80).toLocaleString("en-IN")}</span>
                      </div>
                    </>
                  ) : (
                    <div className="border-t border-neutral-200 pt-2 flex justify-between items-center font-bold text-xs sm:text-sm text-neutral-900">
                      <span>You Pay</span>
                      <span className="text-base font-bold">₹{finalPayable.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* In-page Actual Payment Button at bottom of payment options */}
            <div className="pt-2">
              <button
                ref={inlinePaymentPayRef}
                disabled={isProcessing}
                onClick={handlePlaceOrder}
                className="w-full bg-black text-white h-13 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2 font-bold">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : paymentOption === "prepaid" ? (
                  `Pay ₹${finalPayable.toLocaleString("en-IN")}`
                ) : paymentOption === "wallet" ? (
                  finalPayable > 0 ? `Add ₹${finalPayable.toLocaleString("en-IN")} & Pay` : "Pay with Wallet"
                ) : (
                  "Pay ₹80 (COD Advance) & Confirm"
                )}
              </button>
            </div>
          </div>

          {/* Mobile Fixed Bottom Bar - Synchronized to ONLY show when in-page Pay button is scrolled away */}
          <div className={`lg:hidden fixed bottom-0 left-0 right-0 p-3.5 bg-white/95 backdrop-blur-md border-t border-neutral-200 z-50 shadow-lg flex justify-center transition-all duration-300 ${
            showStickyPayment ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"
          }`}>
            <button
              disabled={isProcessing}
              onClick={handlePlaceOrder}
              className="max-w-md w-full bg-black text-white h-12 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2 font-bold">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : paymentOption === "prepaid" ? (
                `Pay ₹${finalPayable.toLocaleString("en-IN")}`
              ) : paymentOption === "wallet" ? (
                finalPayable > 0 ? `Add ₹${finalPayable.toLocaleString("en-IN")} & Pay` : "Pay with Wallet"
              ) : (
                "Pay ₹80 (COD Advance) & Confirm"
              )}
            </button>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* FORM: ADD / EDIT ADDRESS SCREEN */}
      {/* ---------------------------------------------------- */}
      {step === "address" && (
        <div className="max-w-xl mx-auto flex flex-col gap-4 animate-in fade-in duration-200">
          {/* Header with Back button */}
          <div className="flex items-center gap-2.5 border-b border-neutral-200 pb-2.5">
            <button 
              onClick={handleBack}
              className="p-1 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer text-black"
              aria-label="Back"
            >
              <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
            </button>
            <h1 className="text-base sm:text-lg font-bold text-neutral-900">Delivery Address Details</h1>
          </div>

          {/* Location auto-detect status banner */}
          {pincodeStatus === "detecting" ? (
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3 text-xs font-semibold text-neutral-700 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-neutral-500" />
              <span>Detecting location for {pincode}...</span>
            </div>
          ) : pincodeStatus === "valid" && cityName ? (
            <div className="bg-[#e6f7ef] border border-[#a3e4c4] rounded-xl p-3 text-xs text-[#0fa958] font-bold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{cityName}, {stateName} (Location Auto-detected)</span>
            </div>
          ) : pincodeStatus === "invalid" ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Invalid pincode. Please enter a valid 6-digit Indian postal pincode</span>
            </div>
          ) : (
            <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3 text-xs text-neutral-600 font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-neutral-500" />
              <span>Enter 6-digit pincode to auto-detect City and State</span>
            </div>
          )}

          {/* Address Form */}
          <form onSubmit={handleSaveAddress} className="flex flex-col gap-3.5">
            {/* Pincode Input */}
            <div>
              <fieldset className={`border rounded-xl px-3.5 pb-2 pt-1 transition-colors ${addressErrors.pincode ? "border-red-500" : "border-neutral-300 focus-within:border-black"} bg-white`}>
                <legend className="text-[10px] text-neutral-600 font-bold px-1 uppercase">
                  Pincode <span className="text-red-500">*</span>
                </legend>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\\D/g, ""))}
                  placeholder="e.g. 560001"
                  className="w-full bg-transparent text-sm font-semibold text-neutral-900 outline-none font-sans"
                />
              </fieldset>
              {addressErrors.pincode && (
                <span className="text-[11px] text-red-500 font-semibold mt-1 block pl-1">{addressErrors.pincode}</span>
              )}
            </div>

            {/* 2-Column Grid: House No & Road/Area */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <fieldset className={`border rounded-xl px-3.5 pb-2 pt-1 transition-colors ${addressErrors.houseNo ? "border-red-500" : "border-neutral-300 focus-within:border-black"} bg-white`}>
                  <legend className="text-[10px] text-neutral-600 font-bold px-1 uppercase">
                    House / Flat / Office No. <span className="text-red-500">*</span>
                  </legend>
                  <input
                    type="text"
                    value={houseNo}
                    onChange={(e) => {
                      setHouseNo(e.target.value);
                      if (e.target.value.trim()) {
                        setAddressErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.houseNo;
                          return copy;
                        });
                      }
                    }}
                    placeholder="Flat 402, Building A"
                    className="w-full bg-transparent text-sm font-semibold text-neutral-900 outline-none"
                  />
                </fieldset>
                {addressErrors.houseNo && (
                  <span className="text-[11px] text-red-500 font-semibold mt-1 block pl-1">{addressErrors.houseNo}</span>
                )}
              </div>

              <div>
                <fieldset className={`border rounded-xl px-3.5 pb-2 pt-1 transition-colors ${addressErrors.roadName ? "border-red-500" : "border-neutral-300 focus-within:border-black"} bg-white`}>
                  <legend className="text-[10px] text-neutral-600 font-bold px-1 uppercase">
                    Road Name / Area / Colony <span className="text-red-500">*</span>
                  </legend>
                  <input
                    type="text"
                    value={roadName}
                    onChange={(e) => {
                      setRoadName(e.target.value);
                      if (e.target.value.trim()) {
                        setAddressErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.roadName;
                          return copy;
                        });
                      }
                    }}
                    placeholder="MG Road, Indiranagar"
                    className="w-full bg-transparent text-sm font-semibold text-neutral-900 outline-none"
                  />
                </fieldset>
                {addressErrors.roadName && (
                  <span className="text-[11px] text-red-500 font-semibold mt-1 block pl-1">This field is required</span>
                )}
              </div>
            </div>

            {/* 2-Column Grid: City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <fieldset className="border border-neutral-300 rounded-xl px-3.5 pb-2 pt-1 bg-neutral-50/50">
                  <legend className="text-[10px] text-neutral-600 font-bold px-1 uppercase">
                    City / District
                  </legend>
                  <input
                    type="text"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="City"
                    className="w-full bg-transparent text-sm text-neutral-900 outline-none font-semibold"
                  />
                </fieldset>
              </div>

              <div>
                <fieldset className="border border-neutral-300 rounded-xl px-3.5 pb-2 pt-1 bg-neutral-50/50">
                  <legend className="text-[10px] text-neutral-600 font-bold px-1 uppercase">
                    State
                  </legend>
                  <input
                    type="text"
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    placeholder="State"
                    className="w-full bg-transparent text-sm text-neutral-900 outline-none font-semibold"
                  />
                </fieldset>
              </div>
            </div>

            {/* 2-Column Grid: Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <fieldset className={`border rounded-xl px-3.5 pb-2 pt-1 transition-colors ${addressErrors.contactName ? "border-red-500" : "border-neutral-300 focus-within:border-black"} bg-white`}>
                  <legend className="text-[10px] text-neutral-600 font-bold px-1 uppercase">
                    Full Name <span className="text-red-500">*</span>
                  </legend>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => {
                      setContactName(e.target.value);
                      if (e.target.value.trim()) {
                        setAddressErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.contactName;
                          return copy;
                        });
                      }
                    }}
                    placeholder="e.g. Alessandro Vega"
                    className="w-full bg-transparent text-sm font-semibold text-neutral-900 outline-none"
                  />
                </fieldset>
                {addressErrors.contactName && (
                  <span className="text-[11px] text-red-500 font-semibold mt-1 block pl-1">{addressErrors.contactName}</span>
                )}
              </div>

              <div>
                <fieldset className={`border rounded-xl px-3.5 pb-2 pt-1 transition-colors ${addressErrors.contactPhone ? "border-red-500" : "border-neutral-300 focus-within:border-black"} bg-white`}>
                  <legend className="text-[10px] text-neutral-600 font-bold px-1 uppercase">
                    Phone Number <span className="text-red-500">*</span>
                  </legend>
                  <input
                    type="tel"
                    maxLength={10}
                    value={contactPhone}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\\D/g, "");
                      setContactPhone(clean);
                      if (clean.length >= 10) {
                        setAddressErrors((prev) => {
                          const copy = { ...prev };
                          delete copy.contactPhone;
                          return copy;
                        });
                      }
                    }}
                    placeholder="10-digit mobile number"
                    className="w-full bg-transparent text-sm font-semibold text-neutral-900 outline-none font-mono"
                  />
                </fieldset>
                {addressErrors.contactPhone && (
                  <span className="text-[11px] text-red-500 font-semibold mt-1 block pl-1">{addressErrors.contactPhone}</span>
                )}
              </div>
            </div>

            {/* Save Address Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-black text-white h-12 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center"
              >
                Save Address & Continue
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
