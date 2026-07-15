import type { CartItem } from "./store";
import type { Product } from "./catalog";

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
const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_SHIPPING = 80;

export function computeCart(
  cart: CartItem[],
  lookup: (id: string) => Product | undefined,
  couponCode?: string,
  isFirstOrder?: boolean,
): CartTotals {
  const enriched = cart
    .map((c) => ({ item: c, product: lookup(c.id) }))
    .filter((x): x is { item: CartItem; product: Product } => !!x.product);

  const itemCount = enriched.reduce((a, b) => a + b.item.qty, 0);
  const subtotal = enriched.reduce((a, b) => a + b.product.price * b.item.qty, 0);

  // Expand into individual units for B2G1 (cheapest per every 3 is free)
  const units: { id: string; size: string; color: string; price: number }[] = [];
  for (const { item, product } of enriched) {
    for (let i = 0; i < item.qty; i++) {
      units.push({ id: item.id, size: item.size, color: item.color, price: product.price });
    }
  }
  const totalFreeUnits = Math.floor(units.length / 3);
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

  if (couponCode === "FIRST50" && isFirstOrder) {
    discount = subtotal * 0.5;
    couponApplied = "FIRST50";
    freeCountByKey.clear(); // Overrides B2G1 free line items
  } else if (couponCode !== "NONE" && totalFreeUnits > 0) {
    discount = b2g1Discount;
    couponApplied = "B2G1";
  } else {
    freeCountByKey.clear();
  }

  const lines: CartLine[] = enriched.map(({ item, product }) => {
    const k = `${item.id}|${item.size}|${item.color}`;
    const freeUnits = freeCountByKey.get(k) ?? 0;
    const lineSubtotal = product.price * item.qty;
    const lineDiscount =
      couponApplied === "FIRST50" ? lineSubtotal * 0.5 : product.price * freeUnits;
    return { item, product, freeUnits, lineSubtotal, lineDiscount };
  });

  const afterDiscount = Math.max(0, subtotal - discount);
  const shipping =
    subtotal === 0 ? 0 : afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
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
