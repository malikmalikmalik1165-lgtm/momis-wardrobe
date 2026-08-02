import { db } from "@/db";
import { otpCodes, customers } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { phone, purpose } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number zaroor dein" }, { status: 400 });
    }

    // Clean phone number
    const cleanPhone = phone.replace(/[^0-9]/g, "");

    // Check if already registered (for registration)
    if (purpose === "register") {
      const existing = await db.select().from(customers)
        .where(eq(customers.phone, cleanPhone)).limit(1);
      if (existing.length > 0) {
        return NextResponse.json({ error: "Ye number pehle se registered hai" }, { status: 400 });
      }
    }

    // Generate 4-digit OTP
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP
    await db.insert(otpCodes).values({
      phone: cleanPhone,
      code,
      expiresAt,
    });

    // Generate WhatsApp link with OTP (this is how we "send" it)
    const whatsappNumber = "923295578925";
    const message = `OTP for Momis Wardrobe: ${code}\n\nYe code ${cleanPhone} ke liye hai.\n10 minute mein expire ho jayega.`;

    return NextResponse.json({
      success: true,
      otp: code, // In production, remove this — only send via SMS/WhatsApp API
      message: "OTP generate ho gaya",
      // For now we return the OTP directly since we don't have SMS API
      // In production, integrate Twilio/SMS API here
    });
  } catch (error) {
    console.error("OTP error:", error);
    return NextResponse.json({ error: "OTP nahi bhej saka" }, { status: 500 });
  }
}
