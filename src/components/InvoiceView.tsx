"use client";

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

function generateBarcodeSVG(text: string): string {
  // Simple Code128-style barcode visual using the tracking ID characters
  const chars = text.replace(/[^A-Z0-9]/g, "");
  let bars = "";
  let x = 0;
  // Start pattern
  bars += `<rect x="${x}" y="0" width="2" height="50" fill="#1c1917"/>`;
  x += 3;
  bars += `<rect x="${x}" y="0" width="1" height="50" fill="#1c1917"/>`;
  x += 2;
  bars += `<rect x="${x}" y="0" width="2" height="50" fill="#1c1917"/>`;
  x += 4;

  for (const ch of chars) {
    const code = ch.charCodeAt(0);
    const widths = [
      (code % 3) + 1,
      ((code >> 2) % 2) + 1,
      ((code >> 4) % 3) + 1,
      ((code >> 1) % 2) + 1,
    ];
    for (let i = 0; i < widths.length; i++) {
      if (i % 2 === 0) {
        bars += `<rect x="${x}" y="0" width="${widths[i]}" height="50" fill="#1c1917"/>`;
      }
      x += widths[i] + 1;
    }
    x += 1;
  }
  // End pattern
  bars += `<rect x="${x}" y="0" width="2" height="50" fill="#1c1917"/>`;
  x += 3;
  bars += `<rect x="${x}" y="0" width="1" height="50" fill="#1c1917"/>`;
  x += 2;
  bars += `<rect x="${x}" y="0" width="2" height="50" fill="#1c1917"/>`;
  x += 3;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${x} 65" width="${x}" height="65">${bars}<text x="${x/2}" y="62" text-anchor="middle" font-family="monospace" font-size="9" fill="#1c1917">${text}</text></svg>`;
}

export function printInvoice(order: InvoiceProps["order"]) {
  const w = window.open("", "_blank", "width=800,height=1000");
  if (!w) return;
  const date = new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" });
  const itemsHtml = order.items.map((item) =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${item.name}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${item.quantity}</td><td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">Rs. ${(item.price * item.quantity).toLocaleString()}</td></tr>`
  ).join("");
  const barcode = generateBarcodeSVG(order.trackingId);

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
.barcode-section{margin-top:30px;padding-top:20px;border-top:1px solid #e7e5e4;display:flex;align-items:center;justify-content:space-between}
.barcode-left{display:flex;align-items:center;gap:15px}
.barcode-label{font-size:10px;color:#a8a29e;text-transform:uppercase;letter-spacing:1px}
.website-qr{text-align:right}
.website-qr p{font-size:10px;color:#78716c}
.website-qr a{font-size:12px;color:#f43f5e;text-decoration:none;font-weight:600}
.footer{margin-top:25px;padding-top:15px;border-top:1px solid #e7e5e4;text-align:center;font-size:11px;color:#a8a29e}
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
<div class="barcode-section">
<div class="barcode-left">
<div>${barcode}</div>
<div><div class="barcode-label">Scan to Verify</div><p style="font-size:11px;color:#44403c;font-weight:600">${order.trackingId}</p></div>
</div>
<div class="website-qr">
<p>Shop Online</p>
<a href="https://momis-wardrobe-vert.vercel.app">momis-wardrobe-vert.vercel.app</a>
<p style="margin-top:4px;font-size:9px">📞 03295578925</p>
</div>
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
