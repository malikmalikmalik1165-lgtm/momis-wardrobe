import { db } from "@/db";
import { customers } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const all = await db.select({
      id: customers.id, name: customers.name, phone: customers.phone,
      city: customers.city, phoneVerified: customers.phoneVerified,
      createdAt: customers.createdAt,
    }).from(customers).orderBy(desc(customers.createdAt));
    return NextResponse.json(all);
  } catch { return NextResponse.json([]); }
}
