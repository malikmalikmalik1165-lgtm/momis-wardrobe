import { db } from "@/db";
import { products } from "@/db/schema";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);
}

async function generateSKU(): Promise<string> {
  const result = await db.select({ count: sql<string>`COUNT(*)` }).from(products);
  const num = parseInt(result[0].count) + 1;
  return `MW-${String(num).padStart(4, "0")}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, compareAtPrice, categoryId, images, sizes, colors, badge, featured, inStock, sku } = body;

    if (!name || !price) {
      return NextResponse.json({ error: "Name aur price zaroor dein" }, { status: 400 });
    }

    const productSku = sku || await generateSKU();

    const [product] = await db.insert(products).values({
      sku: productSku,
      name,
      slug: generateSlug(name),
      description: description || name,
      price: price.toString(),
      compareAtPrice: compareAtPrice ? compareAtPrice.toString() : null,
      categoryId: categoryId || null,
      images: images || [],
      sizes: sizes || [],
      colors: colors || [],
      badge: badge || null,
      featured: featured !== false,
      inStock: inStock !== false,
    }).returning();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
