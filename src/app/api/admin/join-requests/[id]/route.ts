import { db } from "@/db";
import { joinRequests, teamMembers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

function generateReferralCode(name: string): string {
  const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, "X");
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${num}`;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reqId = parseInt(id);
    const { action } = await request.json();

    const [joinReq] = await db.select().from(joinRequests).where(eq(joinRequests.id, reqId)).limit(1);
    if (!joinReq) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (action === "approve") {
      // Check if already a team member
      const existing = await db.select().from(teamMembers).where(eq(teamMembers.phone, joinReq.phone)).limit(1);
      if (existing.length === 0) {
        // Create team member account with default password
        const defaultPass = joinReq.phone.slice(-4) + "mw";
        const hashed = await bcrypt.hash(defaultPass, 10);
        await db.insert(teamMembers).values({
          name: joinReq.name,
          phone: joinReq.phone,
          password: hashed,
          city: joinReq.city,
          referralCode: generateReferralCode(joinReq.name),
        });
      }
      await db.update(joinRequests).set({ status: "approved" }).where(eq(joinRequests.id, reqId));
      return NextResponse.json({ success: true, status: "approved", defaultPassword: joinReq.phone.slice(-4) + "mw" });
    } else if (action === "reject") {
      await db.update(joinRequests).set({ status: "rejected" }).where(eq(joinRequests.id, reqId));
      return NextResponse.json({ success: true, status: "rejected" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
