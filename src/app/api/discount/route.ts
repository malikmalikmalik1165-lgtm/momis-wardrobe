import { db } from "@/db";
import { discountCodes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const discount = await db
      .select()
      .from(discountCodes)
      .where(
        and(
          eq(discountCodes.code, code.toUpperCase().trim()),
          eq(discountCodes.active, true)
        )
      )
      .limit(1);

    if (discount.length === 0) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 404 });
    }

    const d = discount[0];

    if (d.maxUses && d.usedCount >= d.maxUses) {
      return NextResponse.json({ error: "Code has been fully used" }, { status: 400 });
    }

    return NextResponse.json({
      code: d.code,
      discountPercent: d.discountPercent,
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
