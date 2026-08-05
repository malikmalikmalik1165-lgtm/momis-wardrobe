import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    if (!code) return NextResponse.json({ valid: false });

    const [member] = await db.select().from(teamMembers)
      .where(eq(teamMembers.referralCode, code.toUpperCase().trim()))
      .limit(1);

    if (!member || !member.active) {
      return NextResponse.json({ valid: false });
    }

    return NextResponse.json({ valid: true, memberName: member.name });
  } catch {
    return NextResponse.json({ valid: false });
  }
}
