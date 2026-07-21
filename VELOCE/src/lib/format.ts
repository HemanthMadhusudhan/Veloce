const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export function formatINR(n: number): string {
  return inr.format(Math.round(n));
}

export function formatOrderId(id: string): string {
  if (!id) return "";
  return `VEL-${id.substring(0, 5).toUpperCase()}`;
}
