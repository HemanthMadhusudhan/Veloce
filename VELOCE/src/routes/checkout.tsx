import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Lock, Gift, Smartphone, Wallet, Banknote } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { SiteNav } from "@/components/chrome";
import { CartDrawer } from "@/components/chrome";
import { SearchDialog } from "@/components/chrome";

import { useCatalog } from "@/lib/catalog-store";
import { useShop } from "@/lib/store";
import { computeCart } from "@/lib/pricing";
import { formatINR } from "@/lib/format";

const UPI_VPA = "velocejersey@ybl";
const UPI_PAYEE = "VELOCE JERSEY";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Veloce" }] }),
  component: () => (
    <>
      <SiteNav />
      <main className="pt-28 sm:pt-32 w-full overflow-x-hidden">
        <CheckoutPage />
      </main>
      <CartDrawer />
      <SearchDialog />
    </>
  ),
});

function CheckoutPage() {
  const { cart, clearCart, placeOrder, userEmail, userId, updateProfile, profile, orders } = useShop();
  const { getById } = useCatalog();
  const nav = useNavigate();
  const [mode, setMode] = useState<"guest" | "account">("guest");
  const [done, setDone] = useState(false);
  const [contact, setContact] = useState({ email: "", firstName: "", lastName: "", city: "" });
  const [address, setAddress] = useState("");
  const [stateName, setStateName] = useState("");
  const [step, setStep] = useState<"details" | "payment">("details");
  const [pincode, setPincode] = useState("");
  const [txnId, setTxnId] = useState("");
  const [txnErr, setTxnErr] = useState<string | null>(null);
  const [payMode, setPayMode] = useState<"full" | "cod">("full");
  const [finalCodDue, setFinalCodDue] = useState(0);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCouponState, setAppliedCouponState] = useState("");
  const isFirstOrder = useMemo(() => orders.length === 0, [orders]);
  const totals = useMemo(() => computeCart(cart, getById, appliedCouponState, isFirstOrder), [cart, getById, appliedCouponState, isFirstOrder]);

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
      }));
      if (profile.addressLine1) setAddress(profile.addressLine1);
      if (profile.state) setStateName(profile.state);
      if (profile.postalCode) setPincode(profile.postalCode);
    } else if (userEmail) {
      setContact((prev) => ({ ...prev, email: userEmail }));
    }
  }, [userId, profile, userEmail]);

  useEffect(() => {
    if (!userId) {
      try {
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
              city: parsed.city || "",
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

  const orderRef = useMemo(() => `VEL${Date.now().toString(36).toUpperCase()}`, []);
  const payNow = useMemo(() => (payMode === "cod" ? 80 : total), [payMode, total]);
  const codDue = payMode === "cod" ? total : 0;
  const upiUri = useMemo(() => {
    const params = new URLSearchParams({
      pa: UPI_VPA,
      pn: UPI_PAYEE,
      am: payNow.toFixed(2),
      cu: "INR",
      tn: payMode === "cod" ? `Veloce ${orderRef} · 80rs advance` : `Veloce order ${orderRef}`,
      tr: orderRef,
    });
    return `upi://pay?${params.toString()}`;
  }, [payNow, orderRef, payMode]);

  if (done) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-foreground"><Check className="h-6 w-6" /></div>
        <h1 className="mt-6 font-display text-3xl font-bold">Order placed — awaiting payment verification</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We're checking your UTR against our bank statement. As soon as the payment is confirmed, your order moves to Processing and ships within 24 hours.
          {payMode === "cod" && ` Please keep ${formatINR(finalCodDue)} ready in cash to hand to the courier on delivery.`}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link to="/shop" className="inline-block rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background hover:bg-brand hover:text-foreground">Keep shopping</Link>
          {userEmail && (
            <Link to="/profile" className="inline-block rounded-full border border-border/70 px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] hover:border-foreground">Track order</Link>
          )}
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Your bag is empty</h1>
        <Link to="/shop" className="mt-6 inline-block rounded-full bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-background">Start shopping</Link>
      </div>
    );
  }

  const submitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setTxnErr(null);
    const trimmed = txnId.trim();
    if (!/^\d{12}$/.test(trimmed)) {
      setTxnErr("UTR must be exactly 12 digits. Open your UPI app, find this payment, and copy the 12-digit UTR / transaction reference number.");
      return;
    }

    for (const item of cart) {
      const p = getById(item.id);
      if (!p) {
        setTxnErr(`Product ${item.id} not found.`);
        return;
      }
      const available = p.stockBySize?.[item.size] !== undefined ? p.stockBySize[item.size] : p.stock;
      if (item.qty > available) {
        setTxnErr(`Sorry, only ${available} left in stock for ${p.name} (${item.size}).`);
        return;
      }
    }

    const nameParts = [contact.firstName, contact.lastName].filter(Boolean);
    const name = nameParts.join(" ");

    // Save address for next checkout
    try {
      localStorage.setItem(
        "veloce.profile.address.v1",
        JSON.stringify({
          name,
          phone: profile?.phone || "",
          line1: address,
          line2: "",
          city: contact.city,
          state: stateName,
          pincode: pincode,
        })
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

    placeOrder({
      items: cart,
      subtotal, discount, shipping, tax, total,
      customer: {
        email: contact.email,
        name,
        city: contact.city,
        address: address,
        state: stateName,
        pincode: pincode,
        phone: profile?.phone || "",
      },
      payment: { method: "upi", vpa: UPI_VPA, txnId: trimmed, mode: payMode, paidNow: payNow, codDue },
      status: "awaiting_payment",
    });
    setFinalCodDue(codDue);
    clearCart();
    setDone(true);
  };

  return (
    <div style={{width: '100%', overflowX: 'hidden', boxSizing: 'border-box'}} className="mx-auto max-w-6xl px-4 sm:px-6 pt-4 pb-36 sm:pt-8 sm:pb-12">
      <div className="text-[10px] uppercase tracking-[0.28em] text-brand">Secure checkout</div>
      <h1 className="mt-1 font-display text-4xl font-bold tracking-tight sm:text-5xl">Checkout</h1>

      <div style={{width:'100%', overflowX:'hidden'}} className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={step === "details" ? (e) => { e.preventDefault(); setStep("payment"); window.scrollTo({ top: 0, behavior: "smooth" }); } : submitPayment} className="space-y-8 min-w-0 w-full">
          {!userId && step === "details" && (
            <div className="flex gap-2 rounded-full border border-border/70 p-1 text-xs">
              <button type="button" onClick={() => setMode("guest")} className={`flex-1 rounded-full py-2 uppercase tracking-[0.2em] ${mode === "guest" ? "bg-foreground text-background" : "text-muted-foreground"}`}>Guest checkout</button>
              <button type="button" onClick={() => setMode("account")} className={`flex-1 rounded-full py-2 uppercase tracking-[0.2em] ${mode === "account" ? "bg-foreground text-background" : "text-muted-foreground"}`}>Sign in</button>
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
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] uppercase tracking-[0.15em] text-emerald-300 font-semibold">Active Session</span>
              </div>
            ) : (
              <>
                <Input required type="email" placeholder="Email address" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                {mode === "account" && <Input required type="password" placeholder="Password" />}
              </>
            )}
          </Section>

          <Section title="Shipping (India)">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input required placeholder="First name" value={contact.firstName} onChange={(e) => setContact({ ...contact, firstName: e.target.value })} />
              <Input required placeholder="Last name" value={contact.lastName} onChange={(e) => setContact({ ...contact, lastName: e.target.value })} />
            </div>
            <Input required placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Input required placeholder="City" value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} />
              <Input required placeholder="State" value={stateName} onChange={(e) => setStateName(e.target.value)} />
              <Input required placeholder="PIN code" value={pincode} onChange={(e) => setPincode(e.target.value)} />
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
                        <div className="text-[10px] uppercase tracking-[0.24em] text-brand">Applied</div>
                        <div className="mt-1 font-mono text-sm">{totals.couponApplied}</div>
                      </div>
                      <button type="button" onClick={() => {
                        if (totals.couponApplied === "B2G1") setAppliedCouponState("NONE");
                        else setAppliedCouponState("");
                      }} className="rounded-full border border-border/70 px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground">Remove</button>
                    </div>
                  ) : (
                    <>
                      <div className="text-[11px] text-muted-foreground">Have a coupon? Enter it below.</div>
                      <div className="flex gap-2">
                        <Input placeholder="E.g. FIRST50" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
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
                onClick={() => { setPayMode("full"); setTxnErr(null); }}
                className={`rounded-xl border p-3 text-left transition ${payMode === "full" ? "border-foreground bg-card/60" : "border-border/60 hover:border-foreground/60"}`}
              >
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-brand"><Wallet className="h-3.5 w-3.5" /> Full UPI</div>
                <div className="mt-1 text-sm font-semibold">Pay {formatINR(total)} now</div>
                <div className="text-[11px] text-muted-foreground">One-shot UPI payment, order dispatched after verification.</div>
              </button>
              <button
                type="button"
                onClick={() => { setPayMode("cod"); setTxnErr(null); }}
                className={`rounded-xl border p-3 text-left transition ${payMode === "cod" ? "border-foreground bg-card/60" : "border-border/60 hover:border-foreground/60"}`}
              >
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-brand"><Banknote className="h-3.5 w-3.5" /> Cash on Delivery</div>
                <div className="mt-1 text-sm font-semibold">Pay ₹80 prepaid charge now</div>
                <div className="text-[11px] text-muted-foreground">Balance {formatINR(total)} in cash on delivery.</div>
              </button>
            </div>
            {/* PAYMENT BOX */}
            <div style={{width:'100%', boxSizing:'border-box', overflowX:'hidden'}} className="rounded-2xl border border-border/70 bg-card/40 p-4">
              {/* QR CODE — centered */}
              <div style={{display:'flex', justifyContent:'center', marginBottom:'1.25rem'}}>
                <div style={{background:'white', borderRadius:'12px', padding:'10px', display:'inline-flex'}}>
                  <QRCodeSVG value={upiUri} size={130} level="M" />
                </div>
              </div>
              {/* Label */}
              <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', marginBottom:'10px'}} className="text-[10px] uppercase tracking-[0.24em] text-brand">
                <Smartphone style={{width:'14px', height:'14px', flexShrink:0}} /> Scan &amp; pay
              </div>
              {/* Description */}
              <p style={{fontSize:'13px', textAlign:'center', lineHeight:'1.6', marginBottom:'16px', wordBreak:'break-word', overflowWrap:'break-word'}} className="text-muted-foreground">
                Open any UPI app (GPay, PhonePe, Paytm, BHIM) and scan the QR — amount preset to{" "}
                <strong className="text-foreground">{formatINR(payNow)}</strong>
                {payMode === "cod" && <> (COD prepay charge)</>}.
              </p>
              {/* Payment details */}
              <div style={{borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:'14px', display:'flex', flexDirection:'column', gap:'10px', fontSize:'13px', width:'100%'}}>
                <div style={{display:'flex', justifyContent:'space-between', width:'100%', gap:'8px'}}><span className="text-muted-foreground">Payee</span><span style={{fontWeight:600}}>{UPI_PAYEE}</span></div>
                <div style={{display:'flex', justifyContent:'space-between', width:'100%', gap:'8px'}}><span className="text-muted-foreground">UPI ID</span><span style={{fontFamily:'monospace', fontSize:'12px', wordBreak:'break-all'}}>{UPI_VPA}</span></div>
                <div style={{display:'flex', justifyContent:'space-between', width:'100%', gap:'8px'}}><span className="text-muted-foreground">Pay now</span><span style={{fontFamily:'monospace'}}>{formatINR(payNow)}</span></div>
                {payMode === "cod" && (
                  <div style={{display:'flex', justifyContent:'space-between', width:'100%', gap:'8px'}} className="text-brand"><span>Cash on delivery</span><span style={{fontFamily:'monospace'}}>{formatINR(codDue)}</span></div>
                )}
                <div style={{display:'flex', justifyContent:'space-between', width:'100%', gap:'8px', borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:'10px', fontWeight:600}}><span className="text-muted-foreground">Order total</span><span style={{fontFamily:'monospace'}}>{formatINR(total)}</span></div>
                <div style={{display:'flex', justifyContent:'space-between', width:'100%', gap:'8px'}}><span className="text-muted-foreground">Ref</span><span style={{fontFamily:'monospace', fontSize:'11px', wordBreak:'break-all'}}>{orderRef}</span></div>
              </div>
              {/* Open UPI button */}
              <a href={upiUri} style={{display:'flex', alignItems:'center', justifyContent:'center', marginTop:'16px', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'9999px', padding:'12px', fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.2em', width:'100%', boxSizing:'border-box'}} className="sm:hidden">
                Open UPI app
              </a>
            </div>
            <div>
              <div className="mb-1.5 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">UPI transaction / UTR number{payMode === "cod" && " (for the ₹80 prepaid charge)"}</div>
              <Input
                required
                inputMode="numeric"
                pattern="\d{12}"
                maxLength={12}
                placeholder="12-digit UTR (e.g. 431298765432)"
                value={txnId}
                onChange={(e) => { setTxnId(e.target.value.replace(/\D/g, "").slice(0, 12)); setTxnErr(null); }}
              />
              <p className="mt-1.5 text-[11px] text-muted-foreground">After paying, paste the 12-digit UTR from your UPI app. Your order stays "awaiting payment" until we confirm the UTR against our bank — fake or wrong numbers will be rejected.</p>
              {txnErr && <div className="mt-2 rounded-lg border border-brand/40 bg-brand/10 px-3 py-2 text-[11px] text-brand">{txnErr}</div>}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground"><Lock className="h-3 w-3" /> Payment goes directly to {UPI_VPA}</div>
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
              <button className="w-full rounded-full bg-foreground py-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-background transition hover:bg-brand hover:text-foreground">
                Place order · Pay {formatINR(payNow)} now{payMode === "cod" ? ` + ${formatINR(codDue)} COD` : ""}
              </button>
              <button type="button" onClick={() => setStep("details")} className="w-full rounded-full border border-border/70 py-3.5 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
                Back to Address
              </button>
            </div>
          )}

          {/* MOBILE STICKY BUTTON */}
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 border-t border-border/50 p-3 sm:p-4 backdrop-blur-md shadow-[0_-10px_40px_rgba(0,0,0,0.5)] sm:hidden">
            {step === "details" ? (
              <button className="w-full rounded-full bg-foreground py-3 sm:py-4 px-2 text-[11px] sm:text-[13px] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.24em] text-background transition active:bg-brand active:text-foreground text-center break-words whitespace-normal leading-tight">
                Proceed to Payment
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button className="w-full rounded-full bg-foreground py-3 px-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-background transition active:bg-brand active:text-foreground text-center">
                  Place order · Pay {formatINR(payNow)} now{payMode === "cod" ? ` + COD` : ""}
                </button>
                <button type="button" onClick={() => setStep("details")} className="w-full rounded-full border border-border/70 py-2.5 px-2 text-[11px] uppercase tracking-[0.1em] text-muted-foreground text-center">
                  Back to Address
                </button>
              </div>
            )}
          </div>
        </form>

        <aside style={{width: '100%', maxWidth: '100%', overflowX: 'hidden'}} className="h-fit rounded-2xl border border-border/50 bg-card/40 p-6 lg:sticky lg:top-28">
          <div className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Order summary</div>
          {freeUnits > 0 && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-brand/15 px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-brand">
              <Gift className="h-3.5 w-3.5" /> B2G1 · {freeUnits} item{freeUnits > 1 ? "s" : ""} FREE
            </div>
          )}
          <ul className="mt-4 space-y-3 border-b border-border/50 pb-4 min-w-0 w-full">
            {lines.map(({ item, product, freeUnits: fu, lineSubtotal, lineDiscount }) => (
              <li key={item.id + item.size + item.color + (item.customName || "") + (item.customNumber || "")} className="flex gap-3 min-w-0 w-full">
                <img src={product.images[0]} alt="" className="h-16 w-14 rounded object-cover shrink-0" />
                <div className="flex-1 min-w-0 max-w-[calc(100%-68px)]">
                  <div className="truncate text-sm">{product.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {item.size} · {item.color} · Qty {item.qty}
                    {(item.customName || item.customNumber) && (
                      <div className="mt-0.5 font-mono text-[10px] text-brand uppercase tracking-wider font-semibold">
                        Print: {item.customName || "NO NAME"} #{item.customNumber || "00"}
                      </div>
                    )}
                  </div>
                  {fu > 0 && <div className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-brand">{fu}× Free · B2G1</div>}
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs">{formatINR(lineSubtotal)}</div>
                  {lineDiscount > 0 && <div className="font-mono text-[10px] text-brand">−{formatINR(lineDiscount)}</div>}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-1.5 text-xs">
            <Row k="Subtotal" v={formatINR(subtotal)} />
            {discount > 0 && <Row k={`Discount (${couponApplied})`} v={`−${formatINR(discount)}`} />}
            <Row k="Shipping" v={shipping === 0 ? "Free" : formatINR(shipping)} />
            <div className="mt-3 flex justify-between border-t border-border/50 pt-3 text-sm font-semibold"><span>Total</span><span className="font-mono">{formatINR(total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
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
  return <input {...props} className="w-full min-w-0 max-w-full rounded-xl border border-border/60 bg-transparent px-4 py-3.5 text-sm transition focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand" />;
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-mono">{v}</span></div>;
}
