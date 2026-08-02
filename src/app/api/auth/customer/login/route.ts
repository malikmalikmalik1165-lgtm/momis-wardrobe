import { db } from "@/db";
import { customers } from "@/db/schema";
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
    const [customer] = await db.select().from(customers)
      .where(eq(customers.phone, cleanPhone)).limit(1);
    if (!customer) {
      return NextResponse.json({ error: "Ye number registered nahi hai. Pehle account banayein." }, { status: 401 });
    }
    // Support both hashed and plain passwords (migration)
    let valid = false;
    if (customer.password.startsWith("$2")) {
      valid = await bcrypt.compare(password, customer.password);
    } else {
      valid = customer.password === password;
      // Auto-upgrade to hashed
      if (valid) {
        const hashed = await bcrypt.hash(password, 10);
        await db.update(customers).set({ password: hashed }).where(eq(customers.id, customer.id));
      }
    }
    if (!valid) {
      return NextResponse.json({ error: "Ghalat password. Dobara try karein ya 'Forgot Password' use karein." }, { status: 401 });
    }
    return NextResponse.json({
      id: customer.id, name: customer.name, phone: customer.phone,
      city: customer.city, address: customer.address, wishlist: customer.wishlist,
    });
  } catch {
    return NextResponse.json({ error: "Login mein masla aaya" }, { status: 500 });
  }
}
