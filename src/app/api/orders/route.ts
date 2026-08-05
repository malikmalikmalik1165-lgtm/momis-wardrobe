import { db } from "@/db";
import { orders, teamMembers } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
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
  const { customerName, customerEmail, customerPhone, shippingAddress, items, referralCode } = body;

  if (!customerName || !shippingAddress || !items?.length) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const subtotal = items.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0
  );
  const shipping = subtotal >= 5000 ? 0 : 250;
  const total = subtotal + shipping;
  const trackingId = generateTrackingId();
  const now = new Date().toISOString();

  const [order] = await db.insert(orders).values({
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
    referralCode: referralCode || null,
    statusHistory: [{ status: "pending", date: now, note: "Order placed" }],
  }).returning();

  // Process referral commission
  if (referralCode) {
    try {
      const [member] = await db.select().from(teamMembers)
        .where(eq(teamMembers.referralCode, referralCode.toUpperCase().trim()))
        .limit(1);

      if (member && member.active) {
        const commission = Math.round(total * member.commissionPercent / 100);
        await db.update(teamMembers).set({
          totalEarnings: sql`CAST(${teamMembers.totalEarnings} AS DECIMAL) + ${commission}`,
          totalSales: sql`${teamMembers.totalSales} + 1`,
        }).where(eq(teamMembers.id, member.id));
      }
    } catch (e) {
      console.error("Referral commission error:", e);
    }
  }

  return NextResponse.json(order, { status: 201 });
}
