/**
 * Format a price value as Pakistani Rupees.
 * Displays as "Rs. 4,500" with thousands separators and no decimals for whole amounts.
 */
export function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "Rs. 0";
  // Use Pakistani/Indian number format (lakh system)
  return `Rs. ${num.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
}

/** Free shipping threshold in PKR */
export const FREE_SHIPPING_THRESHOLD = 15000;

/** Flat shipping rate in PKR */
export const SHIPPING_RATE = 500;
