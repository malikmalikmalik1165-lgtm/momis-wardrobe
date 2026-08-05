import { db } from "@/db";
import { notifications } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const all = await db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(20);
    return NextResponse.json(all);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, body, url } = await request.json();
    if (!title || !body) {
      return NextResponse.json({ error: "Title aur body zaroor dein" }, { status: 400 });
    }
    const [notif] = await db.insert(notifications).values({
      title, body, url: url || "/",
    }).returning();
    return NextResponse.json(notif, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
