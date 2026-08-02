import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);
    const body = await request.json();
    const { status, courierName, courierTrackingId, adminNotes } = body;

    // Get current order
    const [current] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId));

    if (!current) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Build update
    const updates: Record<string, unknown> = {};
    const history = [...(current.statusHistory || [])];

    if (status && status !== current.status) {
      updates.status = status;
      history.push({
        status,
        date: new Date().toISOString(),
        note: getStatusNote(status),
      });
      updates.statusHistory = history;
    }

    if (courierName !== undefined) updates.courierName = courierName || null;
    if (courierTrackingId !== undefined) updates.courierTrackingId = courierTrackingId || null;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes || null;

    if (courierTrackingId && courierTrackingId !== current.courierTrackingId) {
      // Add tracking update to history
      history.push({
        status: current.status,
        date: new Date().toISOString(),
        note: `Courier tracking: ${courierName || ""} ${courierTrackingId}`,
      });
      updates.statusHistory = history;
    }

    const [updated] = await db
      .update(orders)
      .set(updates)
      .where(eq(orders.id, orderId))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

function getStatusNote(status: string): string {
  switch (status) {
    case "confirmed":
      return "Order confirmed by team";
    case "processing":
      return "Order is being prepared";
    case "shipped":
      return "Order has been shipped";
    case "out_for_delivery":
      return "Out for delivery";
    case "delivered":
      return "Order delivered successfully";
    case "cancelled":
      return "Order has been cancelled";
    default:
      return `Status changed to ${status}`;
  }
}
