/**
 * Format a price value as Pakistani Rupees.
 */
export function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "Rs. 0";
  return `Rs. ${num.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
}

/** Free shipping threshold in PKR */
export const FREE_SHIPPING_THRESHOLD = 5000;

/** Flat shipping rate in PKR */
export const SHIPPING_RATE = 250;
