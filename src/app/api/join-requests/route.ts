import { db } from "@/db";
import { joinRequests } from "@/db/schema";
import { desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const requests = await db
      .select()
      .from(joinRequests)
      .orderBy(desc(joinRequests.createdAt));
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching join requests:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, city, message } = body;

    if (!name || !phone || !city) {
      return NextResponse.json(
        { error: "Name, phone and city are required" },
        { status: 400 }
      );
    }

    const [joinRequest] = await db
      .insert(joinRequests)
      .values({
        name,
        phone,
        city,
        message: message || null,
      })
      .returning();

    return NextResponse.json(joinRequest, { status: 201 });
  } catch (error) {
    console.error("Error creating join request:", error);
    return NextResponse.json(
      { error: "Failed to submit request" },
      { status: 500 }
    );
  }
}
