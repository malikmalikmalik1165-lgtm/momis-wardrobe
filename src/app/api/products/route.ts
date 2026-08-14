import { db } from "@/db";
import { products, reviews, categories } from "@/db/schema";
import { eq, desc, asc, ilike, sql, and, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get("category");
  const sort = searchParams.get("sort") || "newest";
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");

  const conditions = [];

  if (category) {
    const cat = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, category))
      .limit(1);
    if (cat.length > 0) {
      conditions.push(eq(products.categoryId, cat[0].id));
    }
  }

  if (search) {
    conditions.push(ilike(products.name, `%${search}%`));
  }

  if (featured === "true") {
    conditions.push(eq(products.featured, true));
  }

  let orderBy;
  switch (sort) {
    case "price-asc":
      orderBy = asc(sql`CAST(${products.price} AS DECIMAL)`);
      break;
    case "price-desc":
      orderBy = desc(sql`CAST(${products.price} AS DECIMAL)`);
      break;
    case "name":
      orderBy = asc(products.name);
      break;
    default:
      orderBy = desc(products.createdAt);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const productList = await db
    .select()
    .from(products)
    .where(where)
    .orderBy(orderBy);

  // Get reviews for all products
  const productIds = productList.map((p) => p.id);
  let reviewStats: { productId: number; avg: string; count: string }[] = [];

  if (productIds.length > 0) {
    reviewStats = await db
      .select({
        productId: reviews.productId,
        avg: sql<string>`ROUND(AVG(${reviews.rating})::numeric, 1)`,
        count: sql<string>`COUNT(*)`,
      })
      .from(reviews)
      .where(inArray(reviews.productId, productIds))
      .groupBy(reviews.productId);
  }

  const statsMap = new Map(
    reviewStats.map((s) => [
      s.productId,
      { avg: parseFloat(s.avg), count: parseInt(s.count) },
    ])
  );

  // Only fetch id and name for category mapping
  const allCategories = await db.select({ id: categories.id, name: categories.name }).from(categories);
  const catMap = new Map(allCategories.map((c) => [c.id, c.name]));

  const enriched = productList.map((p) => ({
    ...p,
    averageRating: statsMap.get(p.id)?.avg || 0,
    reviewCount: statsMap.get(p.id)?.count || 0,
    categoryName: p.categoryId ? catMap.get(p.categoryId) || "" : "",
  }));

  return NextResponse.json(enriched);
}
