import React, { useState, useEffect } from "react";
import { CheckCircle2, Loader2, Printer, ArrowRight, Download, Share2, Sparkles, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { type Order } from "@/lib/store";
import { formatINR } from "@/lib/format";
import { useCatalog } from "@/lib/catalog-store";

export type ReceiptPrinterStage = "processing" | "printing" | "complete";

// Jagged serrated receipt edge generator
const receiptToothCount = 36;
const receiptToothDepth = 4;
const receiptToothPoints = Array.from(
  { length: receiptToothCount * 2 },
  (_, index) => {
    const x = 100 - ((index + 1) * 100) / (receiptToothCount * 2);
    const y = index % 2 === 0 ? "100%" : `calc(100% - ${receiptToothDepth}px)`;
    return `${x}% ${y}`;
  }
).join(", ");
const receiptClipPath = `polygon(0 0, 100% 0, 100% calc(100% - ${receiptToothDepth}px), ${receiptToothPoints})`;

export function OrderReceiptPrinter({
  order,
  onContinueShopping,
}: {
  order: Order;
  onContinueShopping?: () => void;
}) {
  const [stage, setStage] = useState<ReceiptPrinterStage>("processing");
  const { getById } = useCatalog();

  // Progress through stages: processing -> printing -> complete
  useEffect(() => {
    const t1 = setTimeout(() => setStage("printing"), 1000);
    const t2 = setTimeout(() => setStage("complete"), 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto w-full max-w-md px-4 pt-1 pb-6 font-sans flex flex-col items-center select-none">
      
      {/* ---------------------------------------------------- */}
      {/* 1. THERMAL PRINTER MACHINE CASING */}
      {/* ---------------------------------------------------- */}
      <div className="relative w-full max-w-sm rounded-[1.75rem] border border-neutral-800 bg-[#121212] p-3.5 pb-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_0_rgba(0,0,0,0.8)] z-20">
        
        {/* Brand Header on Printer Hardware */}
        <div className="flex items-center justify-between px-2 pt-1 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-black text-xs tracking-widest text-white uppercase">VELOCE</span>
            <span className="text-[9px] uppercase tracking-wider bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded font-mono font-bold">POS-80</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${stage === "complete" ? "bg-emerald-400 shadow-[0_0_8px_#34d399]" : "bg-amber-400 animate-ping"}`} />
            <span className="text-[10px] uppercase font-bold text-neutral-400 font-mono">
              {stage === "complete" ? "READY" : stage === "printing" ? "PRINTING" : "SYNCING"}
            </span>
          </div>
        </div>

        {/* LCD / OLED Display Screen */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-[#080808] p-3 text-neutral-200 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {stage === "complete" ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              ) : (
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
              )}
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-white">
                  {stage === "processing" ? "Processing Order..." : stage === "printing" ? "Printing Receipt..." : "Order Confirmed!"}
                </div>
                <div className="text-[10px] text-neutral-500 font-mono">
                  {order.id}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-black font-mono text-emerald-400">
                ₹{order.total.toLocaleString("en-IN")}
              </div>
              <div className="text-[9px] uppercase font-bold text-neutral-500">
                {order.payment?.mode === "cod" ? "COD Advance" : "Paid"}
              </div>
            </div>
          </div>
        </div>

        {/* Mechanical Paper Ejection Slot */}
        <div className="relative mt-3 mx-2 h-2.5 rounded-full bg-black border border-neutral-900 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] flex items-center justify-center overflow-hidden">
          <div className="w-16 h-0.5 bg-neutral-700/50 rounded-full" />
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. PRINTED THERMAL PAPER RECEIPT (Extrudes out of slot) */}
      {/* ---------------------------------------------------- */}
      <div className="relative w-full max-w-[340px] -mt-2 z-10 overflow-hidden pt-1 pb-4">
        
        {/* Animated Drop / Extrusion container */}
        <div
          className={`relative bg-[#fcfcfc] text-neutral-900 border border-neutral-300/80 shadow-2xl p-5 font-mono text-xs transition-all duration-1000 ease-out ${
            stage === "processing"
              ? "-translate-y-full opacity-0 pointer-events-none"
              : stage === "printing"
              ? "translate-y-0 opacity-100 animate-in slide-in-from-top-12 duration-1000"
              : "translate-y-0 opacity-100"
          }`}
          style={{ clipPath: receiptClipPath }}
        >
          {/* Subtle Paper Grain & Top Shadow from slot */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-black/15 to-transparent" />

          {/* RECEIPT HEADER */}
          <div className="text-center pb-4 border-b border-dashed border-neutral-400">
            <div className="flex justify-center mb-1">
              <img src="/logo.png" alt="Veloce" className="h-6 w-auto object-contain" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
            </div>
            <h2 className="font-black text-sm uppercase tracking-widest text-neutral-950">VELOCE WEAR</h2>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-sans font-semibold">Four Worlds. One Atelier.</p>
            <p className="text-[9px] text-neutral-400 mt-1">support@velocewear.shop</p>
          </div>

          {/* ORDER METADATA */}
          <div className="py-3 border-b border-dashed border-neutral-400 text-[10px] space-y-1 text-neutral-700 font-medium">
            <div className="flex justify-between">
              <span>ORDER NO:</span>
              <span className="font-bold text-neutral-900">{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span>DATE & TIME:</span>
              <span>{orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span>PAYMENT:</span>
              <span className="font-bold uppercase text-neutral-900">
                {order.payment?.mode === "cod" ? "Cash On Delivery (COD)" : "Online Prepaid (UPI/Card)"}
              </span>
            </div>
          </div>

          {/* ITEMS LIST */}
          <div className="py-3 border-b border-dashed border-neutral-400">
            <div className="flex justify-between text-[10px] font-bold text-neutral-900 pb-1 uppercase">
              <span>ITEM / SIZE</span>
              <span>PRICE</span>
            </div>
            <div className="space-y-2 mt-1.5">
              {order.items.map((item, idx) => {
                const prod = getById(item.id);
                return (
                  <div key={idx} className="flex justify-between text-[11px] leading-tight">
                    <div className="pr-2">
                      <div className="font-bold text-neutral-900 line-clamp-1">{prod?.name || item.id}</div>
                      <div className="text-[10px] text-neutral-500 font-sans">
                        Size: <strong className="text-black">{item.size}</strong> · Qty: <strong className="text-black">{item.qty}</strong>
                        {item.customName && ` · Name: ${item.customName}`}
                        {item.customNumber && ` · #${item.customNumber}`}
                      </div>
                    </div>
                    <div className="font-bold text-neutral-900 shrink-0 font-mono">
                      ₹{((prod?.price || 699) * item.qty).toLocaleString("en-IN")}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FINANCIAL SUMMARY */}
          <div className="py-3 border-b border-dashed border-neutral-400 text-[11px] space-y-1 text-neutral-700">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Discount / Promo:</span>
                <span>- ₹{order.discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping (Express):</span>
              <span className="font-bold text-emerald-700">FREE</span>
            </div>
            <div className="flex justify-between text-xs font-black text-neutral-950 pt-1.5 border-t border-neutral-300">
              <span>TOTAL PAID:</span>
              <span className="font-mono text-sm">₹{order.total.toLocaleString("en-IN")}</span>
            </div>
            {order.payment?.codDue && order.payment.codDue > 0 ? (
              <div className="flex justify-between text-[10px] font-bold text-amber-700 bg-amber-50 p-1 rounded mt-1">
                <span>COD Due on Delivery:</span>
                <span>₹{order.payment.codDue.toLocaleString("en-IN")}</span>
              </div>
            ) : null}
          </div>

          {/* SHIPPING DESTINATION */}
          <div className="py-3 border-b border-dashed border-neutral-400 text-[10px] space-y-0.5 text-neutral-700">
            <div className="font-bold text-neutral-900 uppercase">DELIVER TO:</div>
            <div className="font-semibold text-neutral-900">{order.customer.name}</div>
            <div>{order.customer.address}</div>
            <div>{order.customer.city}, {order.customer.state} {order.customer.pincode}</div>
            <div>Phone: +91-{order.customer.phone}</div>
          </div>

          {/* BARCODE / FOOTER */}
          <div className="pt-4 pb-2 text-center flex flex-col items-center">
            {/* Simulated Barcode */}
            <div className="h-9 w-44 flex items-center justify-center gap-0.5 bg-white p-1 mb-1 border border-neutral-200">
              {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 3, 1, 2, 4, 2, 1, 3, 1, 2, 1, 4, 2, 3, 1, 2].map((w, i) => (
                <div key={i} className="h-full bg-black" style={{ width: `${w * 1.5}px` }} />
              ))}
            </div>
            <div className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase">{order.id}</div>
            <p className="text-[9px] text-neutral-600 font-sans mt-2 font-bold uppercase tracking-wider">
              100% Authentic Matchwear Guaranteed
            </p>
            <p className="text-[8px] text-neutral-400 font-sans mt-0.5">
              Thank you for supporting Veloce Wear
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. ACTION CONTROLS (Print, Continue, Track) */}
      {/* ---------------------------------------------------- */}
      {stage === "complete" && (
        <div className="w-full max-w-sm mt-3 space-y-2.5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handlePrint}
              className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer border border-neutral-200"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
            <Link
              to="/profile"
              className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-900 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer border border-neutral-200 text-center"
            >
              <span>View Orders</span>
            </Link>
          </div>

          <Link
            to="/shop"
            onClick={onContinueShopping}
            className="w-full bg-black hover:bg-neutral-800 text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-md active:scale-98 cursor-pointer"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
