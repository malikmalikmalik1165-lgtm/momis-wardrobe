import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const trackingId = request.nextUrl.searchParams.get("id");

  if (!trackingId) {
    return NextResponse.json({ error: "Tracking ID required" }, { status: 400 });
  }

  const query = trackingId.toUpperCase().trim();

  const order = await db
    .select()
    .from(orders)
    .where(
      or(
        eq(orders.trackingId, query),
        eq(orders.customerPhone, trackingId.trim())
      )
    )
    .limit(5);

  if (order.length === 0) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Return safe data (no admin notes)
  const safeOrders = order.map((o) => ({
    trackingId: o.trackingId,
    customerName: o.customerName,
    shippingAddress: o.shippingAddress,
    items: o.items,
    total: o.total,
    status: o.status,
    courierName: o.courierName,
    courierTrackingId: o.courierTrackingId,
    statusHistory: o.statusHistory,
    createdAt: o.createdAt,
  }));

  return NextResponse.json(safeOrders);
}
