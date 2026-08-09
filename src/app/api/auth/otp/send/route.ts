import { db } from "@/db";
import { otpCodes, customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { phone, purpose } = await request.json();
    if (!phone) {
      return NextResponse.json({ error: "Phone number zaroor dein" }, { status: 400 });
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");

    if (purpose === "register") {
      const existing = await db.select().from(customers).where(eq(customers.phone, cleanPhone)).limit(1);
      if (existing.length > 0) {
        return NextResponse.json({ error: "Ye number pehle se registered hai" }, { status: 400 });
      }
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await db.insert(otpCodes).values({ phone: cleanPhone, code, expiresAt });

    // Generate WhatsApp link to send OTP for free
    const intlPhone = cleanPhone.startsWith("0") ? "92" + cleanPhone.slice(1) : cleanPhone;
    const whatsappLink = `https://wa.me/${intlPhone}?text=${encodeURIComponent(
      `🔐 Momis Wardrobe OTP\n\nAap ka verification code: *${code}*\n\nYe code 10 minute mein expire ho jayega.\n\n⚠️ Ye code kisi ko mat batayein.`
    )}`;

    return NextResponse.json({
      success: true,
      otp: code,
      whatsappLink,
      method: "whatsapp",
      message: "OTP WhatsApp par bhej dein",
    });
  } catch (error) {
    console.error("OTP error:", error);
    return NextResponse.json({ error: "OTP nahi bhej saka" }, { status: 500 });
  }
}
