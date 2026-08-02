import { db } from "@/db";
import { discountCodes } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const codes = await db
      .select()
      .from(discountCodes)
      .orderBy(desc(discountCodes.createdAt));
    return NextResponse.json(codes);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, discountPercent, maxUses } = await request.json();

    if (!code || !discountPercent) {
      return NextResponse.json(
        { error: "Code and discount percent required" },
        { status: 400 }
      );
    }

    const [created] = await db
      .insert(discountCodes)
      .values({
        code: code.toUpperCase().trim(),
        discountPercent: Math.min(100, Math.max(1, discountPercent)),
        maxUses: maxUses || null,
        active: true,
      })
      .returning();

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    if (error?.code === "23505") {
      return NextResponse.json({ error: "Code already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
