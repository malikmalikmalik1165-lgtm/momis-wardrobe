import { db } from "@/db";
import { orders } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

function generateTrackingId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "MW-";
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { customerName, customerEmail, customerPhone, shippingAddress, items } =
    body;

  if (!customerName || !shippingAddress || !items?.length) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const subtotal = items.reduce(
    (sum: number, item: { price: number; quantity: number }) =>
      sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + shipping;
  const trackingId = generateTrackingId();
  const now = new Date().toISOString();

  const [order] = await db
    .insert(orders)
    .values({
      trackingId,
      customerName,
      customerEmail: customerEmail || `${customerPhone || "guest"}@order.local`,
      customerPhone: customerPhone || null,
      shippingAddress,
      items,
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      status: "pending",
      statusHistory: [{ status: "pending", date: now, note: "Order placed" }],
    })
    .returning();

  return NextResponse.json(order, { status: 201 });
}
