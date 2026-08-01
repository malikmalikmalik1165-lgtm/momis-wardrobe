import { db } from "@/db";
import { orders } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { customerName, customerEmail, customerPhone, shippingAddress, items } =
    body;

  if (!customerName || !customerEmail || !shippingAddress || !items?.length) {
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
  const shipping = subtotal >= 15000 ? 0 : 500;
  const total = subtotal + shipping;

  const [order] = await db
    .insert(orders)
    .values({
      customerName,
      customerEmail,
      customerPhone: customerPhone || null,
      shippingAddress,
      items,
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
    })
    .returning();

  return NextResponse.json(order, { status: 201 });
}
