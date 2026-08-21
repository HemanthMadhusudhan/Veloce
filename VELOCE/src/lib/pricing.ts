import type { CartItem } from "./store";
import type { Product } from "./catalog";
import { getLiveProduct } from "./catalog-store";

export type CartLine = {
  item: CartItem;
  product: Product;
  freeUnits: number;
  lineSubtotal: number; // pre-discount
  lineDiscount: number; // B2G1 discount portion
};

export type CartTotals = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  discount: number;
  couponApplied: string | null;
  freeUnits: number;
  shipping: number;
  tax: number;
  total: number;
};

// India GST + shipping (INR)
const GST_RATE = 0;
const FREE_SHIPPING_THRESHOLD = 0;
const STANDARD_SHIPPING = 0;

export function computeCart(
  cart: CartItem[],
  lookup: (id: string) => Product | undefined,
  couponCode?: string,
  isFirstOrder?: boolean,
): CartTotals {
  const enriched = cart.map((c) => {
    let prod = lookup(c.id) || getLiveProduct(c.id);
    if (!prod) {
      prod = {
        id: c.id,
        name: c.name || "Match Jersey",
        price: c.price || 699,
        compareAt: c.compareAt || 3499,
        images: c.image ? [c.image] : ["/logo.png"],
        colors: [c.color || "Default"],
        sizes: [c.size || "M"],
        category: "football",
        stock: 50,
        rating: 5,
        reviews: 50,
      } as Product;
    }
    return { item: c, product: prod };
  });

  const itemCount = enriched.reduce((a, b) => a + b.item.qty, 0);
  const subtotal = enriched.reduce((a, b) => a + (b.product.price + (b.item.customName ? 100 : 0)) * b.item.qty, 0);

  let bogoDivisor = 3; // Default is B2G1 (Buy 2 Get 1)

  // Check for unique Fortune Spin coupon codes
  let fortuneDiscount = 0;
  let spinFreeShipping = false;
  try {
    const savedPrize = localStorage.getItem("veloce_last_prize");
    if (savedPrize) {
      const prize = JSON.parse(savedPrize);
      if (prize.code === couponCode) {
        if (prize.label === "10% OFF") fortuneDiscount = 0.1;
        else if (prize.label === "20% OFF") fortuneDiscount = 0.2;
        else if (prize.label === "30% OFF") fortuneDiscount = 0.3;
        else if (prize.label === "40% OFF") fortuneDiscount = 0.4;
        else if (prize.label === "BUY 1 GET 1") bogoDivisor = 2; // B1G1
        else if (prize.label === "FREE SHIP") spinFreeShipping = true;
      }
    }
  } catch (e) {}

  // Expand into individual units for BOGO logic (cheapest per every N is free)
  const units: { id: string; size: string; color: string; price: number }[] = [];
  for (const { item, product } of enriched) {
    const unitPrice = product.price + (item.customName ? 100 : 0);
    for (let i = 0; i < item.qty; i++) {
      units.push({ id: item.id, size: item.size, color: item.color, price: unitPrice });
    }
  }
  const totalFreeUnits = Math.floor(units.length / bogoDivisor);
  const sortedAsc = [...units].sort((a, b) => a.price - b.price);
  const freeSlice = sortedAsc.slice(0, totalFreeUnits);

  // Aggregate discount + per-line free count
  const freeCountByKey = new Map<string, number>();
  let b2g1Discount = 0;
  for (const u of freeSlice) {
    b2g1Discount += u.price;
    const k = `${u.id}|${u.size}|${u.color}`;
    freeCountByKey.set(k, (freeCountByKey.get(k) ?? 0) + 1);
  }

  let discount = 0;
  let couponApplied: string | null = null;

  if (couponCode?.startsWith("VEL-699-")) {
    discount = Math.min(subtotal, 699);
    couponApplied = couponCode;
    freeCountByKey.clear();
  } else if (couponCode === "FIRST50" && isFirstOrder) {
    discount = subtotal * 0.5;
    couponApplied = "FIRST50";
    freeCountByKey.clear(); // Overrides B2G1 free line items
  } else if (fortuneDiscount > 0) {
    discount = Math.round(subtotal * fortuneDiscount);
    couponApplied = couponCode!;
    freeCountByKey.clear(); // Overrides B2G1
  } else if (spinFreeShipping && couponCode) {
    couponApplied = couponCode;
    // B2G1 still applies if they have free shipping? Let's say yes, or let's clear it
  } else if (couponCode !== "NONE" && totalFreeUnits > 0) {
    discount = b2g1Discount;
    couponApplied = couponCode && couponCode.startsWith("VL-") ? couponCode : "B2G1";
  } else {
    freeCountByKey.clear();
  }

  const lines: CartLine[] = enriched.map(({ item, product }) => {
    const k = `${item.id}|${item.size}|${item.color}`;
    const freeUnits = freeCountByKey.get(k) ?? 0;
    const unitPrice = product.price + (item.customName ? 100 : 0);
    const lineSubtotal = unitPrice * item.qty;
    
    let lineDiscount = 0;
    if (couponApplied === "FIRST50") lineDiscount = lineSubtotal * 0.5;
    else if (couponApplied?.startsWith("VEL-699-")) {
      lineDiscount = subtotal > 0 ? (lineSubtotal / subtotal) * Math.min(subtotal, 699) : 0;
    }
    else if (fortuneDiscount > 0) lineDiscount = Math.round(lineSubtotal * fortuneDiscount);
    else lineDiscount = unitPrice * freeUnits;
    
    return { item, product, freeUnits, lineSubtotal, lineDiscount };
  });

  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping =
    subtotal === 0 ? 0 : (afterDiscount >= FREE_SHIPPING_THRESHOLD || spinFreeShipping) ? 0 : STANDARD_SHIPPING;
  const tax = Math.round(afterDiscount * GST_RATE);
  const total = afterDiscount + shipping + tax;

  return {
    lines,
    itemCount,
    subtotal,
    discount,
    couponApplied,
    freeUnits: couponApplied === "FIRST50" || couponApplied === null ? 0 : totalFreeUnits,
    shipping,
    tax,
    total,
  };
}

export const PRICING = { GST_RATE, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING };
