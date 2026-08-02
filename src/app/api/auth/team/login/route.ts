import { db } from "@/db";
import { teamMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { phone, password } = await request.json();
    if (!phone || !password) {
      return NextResponse.json({ error: "Phone aur password dein" }, { status: 400 });
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const [member] = await db.select().from(teamMembers)
      .where(eq(teamMembers.phone, cleanPhone)).limit(1);
    if (!member) {
      return NextResponse.json({ error: "Ye number registered nahi hai. Pehle join karein." }, { status: 401 });
    }
    if (!member.active) {
      return NextResponse.json({ error: "Aap ka account inactive hai. Admin se contact karein." }, { status: 403 });
    }
    let valid = false;
    if (member.password.startsWith("$2")) {
      valid = await bcrypt.compare(password, member.password);
    } else {
      valid = member.password === password;
      if (valid) {
        const hashed = await bcrypt.hash(password, 10);
        await db.update(teamMembers).set({ password: hashed }).where(eq(teamMembers.id, member.id));
      }
    }
    if (!valid) {
      return NextResponse.json({ error: "Ghalat password. Dobara check karein." }, { status: 401 });
    }
    return NextResponse.json({
      id: member.id, name: member.name, phone: member.phone,
      referralCode: member.referralCode, totalEarnings: member.totalEarnings,
      totalSales: member.totalSales, commissionPercent: member.commissionPercent,
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
