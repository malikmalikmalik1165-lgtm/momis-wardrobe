import { db } from "@/db";
import { otpCodes } from "@/db/schema";
import { eq, and, gt, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code) {
      return NextResponse.json({ error: "Phone aur code dein" }, { status: 400 });
    }

    const cleanPhone = phone.replace(/[^0-9]/g, "");

    // Find latest valid OTP
    const [otp] = await db.select().from(otpCodes)
      .where(
        and(
          eq(otpCodes.phone, cleanPhone),
          eq(otpCodes.code, code),
          eq(otpCodes.verified, false),
          gt(otpCodes.expiresAt, new Date())
        )
      )
      .orderBy(desc(otpCodes.createdAt))
      .limit(1);

    if (!otp) {
      return NextResponse.json({ error: "Ghalat ya expired OTP" }, { status: 400 });
    }

    // Mark as verified
    await db.update(otpCodes)
      .set({ verified: true })
      .where(eq(otpCodes.id, otp.id));

    return NextResponse.json({ success: true, verified: true });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
