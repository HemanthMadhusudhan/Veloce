import { createServerFn } from "@tanstack/react-start";

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .validator((data: { amount: number; currency: string; receipt: string }) => data)
  .handler(async ({ data }) => {
    const { amount, currency, receipt } = data;

    if (!amount || amount < 100) {
      throw new Error("Invalid amount");
    }

    // Access environment variables securely
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || (typeof process !== "undefined" ? process.env.RAZORPAY_KEY_ID : undefined);
    const keySecret = typeof process !== "undefined" ? process.env.RAZORPAY_KEY_SECRET : (import.meta as any).env?.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay keys missing");
    }

    const auth = btoa(`${keyId}:${keySecret}`);

    try {
      const res = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${auth}`,
        },
        body: JSON.stringify({
          amount,
          currency: currency || "INR",
          receipt: receipt || `receipt_${Date.now()}`,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error("Razorpay API Error:", errText);
        throw new Error("Failed to create order on server");
      }

      const order = await res.json();

      return {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
      };
    } catch (err) {
      console.error("Error creating order with Razorpay API:", err);
      throw new Error("Failed to create order on server");
    }
  });

export const verifyRazorpayPayment = createServerFn({ method: "POST" })
  .validator(
    (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    const keySecret = typeof process !== "undefined" ? process.env.RAZORPAY_KEY_SECRET : (import.meta as any).env?.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      throw new Error("Razorpay secret missing");
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    
    // Use WebCrypto API for HMAC SHA256 (Edge/Cloudflare compatible)
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(keySecret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify", "sign"]
    );
    
    // Convert hex signature to Uint8Array
    const sigBuf = new Uint8Array(razorpay_signature.match(/[\da-f]{2}/gi)!.map(h => parseInt(h, 16)));
    
    // Verify
    const isValid = await crypto.subtle.verify("HMAC", key, sigBuf, enc.encode(body));
    
    if (isValid) {
      return { success: true };
    } else {
      throw new Error("Signature mismatch");
    }
  });
