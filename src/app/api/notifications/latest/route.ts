import { db } from "@/db";
import { notifications } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const latest = await db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(10);
    return NextResponse.json(latest);
  } catch {
    return NextResponse.json([]);
  }
}
