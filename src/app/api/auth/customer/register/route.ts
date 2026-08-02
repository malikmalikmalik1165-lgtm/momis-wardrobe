import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { name, phone, password, city } = await request.json();
    if (!name || !phone || !password) {
      return NextResponse.json({ error: "Name, phone aur password zaroor dein" }, { status: 400 });
    }
    if (password.length < 4) {
      return NextResponse.json({ error: "Password kam az kam 4 characters ka hona chahiye" }, { status: 400 });
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const existing = await db.select().from(customers).where(eq(customers.phone, cleanPhone)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Ye phone number pehle se registered hai. Login karein." }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [customer] = await db.insert(customers).values({
      name, phone: cleanPhone, password: hashedPassword, city: city || null, phoneVerified: true,
    }).returning();
    return NextResponse.json({ id: customer.id, name: customer.name, phone: customer.phone, city: customer.city, wishlist: customer.wishlist });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Registration mein masla aaya. Dobara try karein." }, { status: 500 });
  }
}
