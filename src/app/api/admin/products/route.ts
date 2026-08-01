import { db } from "@/db";
import { products } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    + "-" + Date.now().toString(36);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      price,
      compareAtPrice,
      categoryId,
      images,
      sizes,
      colors,
      badge,
      featured,
      inStock,
    } = body;

    if (!name || !description || !price) {
      return NextResponse.json(
        { error: "Name, description and price are required" },
        { status: 400 }
      );
    }

    const [product] = await db
      .insert(products)
      .values({
        name,
        slug: generateSlug(name),
        description,
        price: price.toString(),
        compareAtPrice: compareAtPrice ? compareAtPrice.toString() : null,
        categoryId: categoryId || null,
        images: images || [],
        sizes: sizes || [],
        colors: colors || [],
        badge: badge || null,
        featured: featured || false,
        inStock: inStock !== false,
      })
      .returning();

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
