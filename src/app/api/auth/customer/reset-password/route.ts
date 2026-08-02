import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { phone, newPassword } = await request.json();
    if (!phone || !newPassword) {
      return NextResponse.json({ error: "Phone aur naya password dein" }, { status: 400 });
    }
    if (newPassword.length < 4) {
      return NextResponse.json({ error: "Password kam az kam 4 characters ka hona chahiye" }, { status: 400 });
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const [customer] = await db.select().from(customers)
      .where(eq(customers.phone, cleanPhone)).limit(1);
    if (!customer) {
      return NextResponse.json({ error: "Ye number registered nahi hai" }, { status: 404 });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.update(customers).set({ password: hashed }).where(eq(customers.id, customer.id));
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Password reset nahi ho saka" }, { status: 500 });
  }
}
