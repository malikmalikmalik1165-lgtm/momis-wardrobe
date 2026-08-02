import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

function generateReferralCode(name: string): string {
  const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, "X");
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${num}`;
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone, password, city } = await request.json();
    if (!name || !phone || !password) {
      return NextResponse.json({ error: "Name, phone aur password zaroor dein" }, { status: 400 });
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const existing = await db.select().from(teamMembers).where(eq(teamMembers.phone, cleanPhone)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Ye number pehle se registered hai. Login karein." }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = generateReferralCode(name);
    const [member] = await db.insert(teamMembers).values({
      name, phone: cleanPhone, password: hashedPassword, city: city || null, referralCode,
    }).returning();
    return NextResponse.json({
      id: member.id, name: member.name, phone: member.phone,
      referralCode: member.referralCode, totalEarnings: member.totalEarnings,
      totalSales: member.totalSales, commissionPercent: member.commissionPercent,
    });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
