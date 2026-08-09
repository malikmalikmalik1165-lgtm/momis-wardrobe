import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const all = await db.select().from(teamMembers).orderBy(desc(teamMembers.createdAt));
    return NextResponse.json(all.map((m) => ({
      id: m.id, name: m.name, phone: m.phone, city: m.city,
      referralCode: m.referralCode, totalEarnings: m.totalEarnings,
      totalSales: m.totalSales, commissionPercent: m.commissionPercent,
      active: m.active, createdAt: m.createdAt,
    })));
  } catch { return NextResponse.json([]); }
}
