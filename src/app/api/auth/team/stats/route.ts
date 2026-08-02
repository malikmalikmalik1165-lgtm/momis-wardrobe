import { db } from "@/db";
import { orders, teamMembers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { memberId } = await request.json();
    const [member] = await db.select().from(teamMembers).where(eq(teamMembers.id, memberId)).limit(1);
    if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const referralOrders = await db.select().from(orders)
      .where(eq(orders.referralCode, member.referralCode))
      .orderBy(desc(orders.createdAt));

    return NextResponse.json({
      member: {
        name: member.name, referralCode: member.referralCode,
        totalEarnings: member.totalEarnings, totalSales: member.totalSales,
        commissionPercent: member.commissionPercent,
      },
      orders: referralOrders.map((o) => ({
        trackingId: o.trackingId, total: o.total, status: o.status,
        createdAt: o.createdAt, customerName: o.customerName,
      })),
    });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
