import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, desc, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { customerId, phone } = await request.json();
    const customerOrders = await db.select().from(orders)
      .where(or(
        customerId ? eq(orders.customerId, customerId) : undefined,
        phone ? eq(orders.customerPhone, phone) : undefined
      ))
      .orderBy(desc(orders.createdAt));
    return NextResponse.json(customerOrders);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
