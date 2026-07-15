import { createServerFn } from "@tanstack/react-start";
import Razorpay from "razorpay";
import crypto from "crypto";

export const createRazorpayOrder = createServerFn({ method: "POST" })
  .validator((data: { amount: number; currency: string; receipt: string }) => data)
  .handler(async ({ data }) => {
    const { amount, currency, receipt } = data;

    if (!amount || amount < 100) {
      throw new Error("Invalid amount");
    }

    const keyId = process.env.VITE_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      throw new Error("Razorpay keys missing");
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    try {
      const order = await razorpay.orders.create({
        amount,
        currency: currency || "INR",
        receipt: receipt || `receipt_${Date.now()}`,
      });

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

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      throw new Error("Razorpay secret missing");
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return { success: true };
    } else {
      throw new Error("Signature mismatch");
    }
  });
