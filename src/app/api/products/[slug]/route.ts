import { db } from "@/db";
import { products, reviews, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const product = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (product.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const p = product[0];

  const productReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, p.id))
    .orderBy(reviews.createdAt);

  let categoryName = "";
  if (p.categoryId) {
    const cat = await db
      .select()
      .from(categories)
      .where(eq(categories.id, p.categoryId))
      .limit(1);
    if (cat.length > 0) categoryName = cat[0].name;
  }

  const avgRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) /
        productReviews.length
      : 0;

  return NextResponse.json({
    ...p,
    reviews: productReviews,
    averageRating: Math.round(avgRating * 10) / 10,
    reviewCount: productReviews.length,
    categoryName,
  });
}
