import { db } from "@/db";
import { customers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { customerId, productId, action } = await request.json();
    const [customer] = await db.select().from(customers).where(eq(customers.id, customerId)).limit(1);
    if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

    let wishlist = [...(customer.wishlist || [])];
    if (action === "add") {
      if (!wishlist.includes(productId)) wishlist.push(productId);
    } else {
      wishlist = wishlist.filter((id) => id !== productId);
    }
    await db.update(customers).set({ wishlist }).where(eq(customers.id, customerId));
    return NextResponse.json({ wishlist });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
