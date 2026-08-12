"use client";

import { formatPrice } from "@/lib/currency";

interface InvoiceProps {
  order: {
    trackingId: string;
    customerName: string;
    customerPhone?: string | null;
    shippingAddress: string;
    items: { name: string; quantity: number; price: number }[];
    subtotal: string;
    shipping: string;
    total: string;
    status: string;
    createdAt: string;
  };
}

export function printInvoice(order: InvoiceProps["order"]) {
  const w = window.open("", "_blank", "width=800,height=900");
  if (!w) return;
  const date = new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" });
  const itemsHtml = order.items.map((item) =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${item.name}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">Rs. ${(item.price * item.quantity).toLocaleString()}</td></tr>`
  ).join("");

  w.document.write(`<!DOCTYPE html><html><head><title>Invoice ${order.trackingId}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#1c1917;padding:40px;max-width:800px;margin:0 auto}
  .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px;padding-bottom:20px;border-bottom:2px solid #f43f5e}
  .logo{font-size:24px;font-weight:800}
  .logo span{color:#f43f5e}
  .invoice-title{font-size:28px;font-weight:300;color:#78716c}
  .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-bottom:30px}
  .info-box h3{font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#a8a29e;margin-bottom:8px}
  .info-box p{font-size:13px;color:#44403c;line-height:1.6}
  table{width:100%;border-collapse:collapse;margin-bottom:20px}
  th{text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#a8a29e;padding:10px 0;border-bottom:2px solid #e7e5e4}
  th:last-child{text-align:right}
  th:nth-child(2){text-align:center}
  .totals{margin-left:auto;width:250px}
  .totals .row{display:flex;justify-content:space-between;padding:6px 0;font-size:13px;color:#57534e}
  .totals .total-row{display:flex;justify-content:space-between;padding:12px 0;font-size:18px;font-weight:700;color:#1c1917;border-top:2px solid #1c1917;margin-top:8px}
  .footer{margin-top:40px;padding-top:20px;border-top:1px solid #e7e5e4;text-align:center;font-size:11px;color:#a8a29e}
  .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:1px}
  .status-pending{background:#fef3c7;color:#92400e}
  .status-confirmed{background:#dbeafe;color:#1e40af}
  .status-shipped{background:#fed7aa;color:#9a3412}
  .status-delivered{background:#d1fae5;color:#065f46}
  @media print{body{padding:20px}button{display:none!important}}
</style></head><body>
<div class="header">
  <div><div class="logo">Momis <span>Wardrobe</span></div><p style="font-size:11px;color:#a8a29e;margin-top:4px">Women's Fashion Pakistan</p></div>
  <div style="text-align:right"><div class="invoice-title">INVOICE</div><p style="font-size:12px;color:#78716c;margin-top:4px">${date}</p></div>
</div>
<div class="info-grid">
  <div class="info-box"><h3>Order Details</h3><p><strong>Tracking ID:</strong> ${order.trackingId}<br><strong>Status:</strong> <span class="badge status-${order.status}">${order.status}</span><br><strong>Date:</strong> ${date}<br><strong>Payment:</strong> Cash on Delivery</p></div>
  <div class="info-box"><h3>Customer</h3><p><strong>${order.customerName}</strong><br>${order.customerPhone || ""}<br>${order.shippingAddress}</p></div>
</div>
<table><thead><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Amount</th></tr></thead><tbody>${itemsHtml}</tbody></table>
<div class="totals">
  <div class="row"><span>Subtotal</span><span>Rs. ${parseFloat(order.subtotal).toLocaleString()}</span></div>
  <div class="row"><span>Delivery</span><span>${parseFloat(order.shipping) === 0 ? "FREE" : "Rs. " + parseFloat(order.shipping).toLocaleString()}</span></div>
  <div class="total-row"><span>Total</span><span>Rs. ${parseFloat(order.total).toLocaleString()}</span></div>
</div>
<div class="footer">
  <p><strong>Momis Wardrobe</strong> — Women's Fashion Pakistan</p>
  <p style="margin-top:4px">📞 03295578925 · 💬 WhatsApp · 🌐 momis-wardrobe-vert.vercel.app</p>
  <p style="margin-top:8px">Thank you for shopping with us! ❤️</p>
</div>
<div style="text-align:center;margin-top:20px"><button onclick="window.print()" style="background:#1c1917;color:white;border:none;padding:10px 30px;border-radius:8px;font-size:14px;cursor:pointer">🖨 Print / Save as PDF</button></div>
</body></html>`);
  w.document.close();
}
