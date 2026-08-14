import { db } from "@/db";
import { products, reviews, categories } from "@/db/schema";
import { eq, desc, asc, sql, and, ilike, inArray } from "drizzle-orm";
import ShopClient from "./ShopClient";

// Revalidate every 60 seconds instead of force-dynamic
export const revalidate = 60;

interface Props {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    search?: string;
  }>;
}

async function getData(searchParams: {
  category?: string;
  sort?: string;
  search?: string;
}) {
  // Only fetch needed category columns
  const allCategories = await db.select({
    id: categories.id, name: categories.name, slug: categories.slug,
    description: categories.description, image: categories.image,
  }).from(categories);

  const conditions = [];

  if (searchParams.category) {
    const cat = allCategories.find((c) => c.slug === searchParams.category);
    if (cat) conditions.push(eq(products.categoryId, cat.id));
  }

  if (searchParams.search) {
    conditions.push(ilike(products.name, `%${searchParams.search}%`));
  }

  const sort = searchParams.sort || "newest";
  let orderBy;
  switch (sort) {
    case "price-asc": orderBy = asc(sql`CAST(${products.price} AS DECIMAL)`); break;
    case "price-desc": orderBy = desc(sql`CAST(${products.price} AS DECIMAL)`); break;
    case "name": orderBy = asc(products.name); break;
    default: orderBy = desc(products.createdAt);
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  // Only select columns needed for ProductCard
  const productList = await db.select({
    id: products.id, name: products.name, slug: products.slug, price: products.price,
    compareAtPrice: products.compareAtPrice, images: products.images, badge: products.badge,
    colors: products.colors, sizes: products.sizes, inStock: products.inStock,
    featured: products.featured, categoryId: products.categoryId,
  }).from(products).where(where).orderBy(orderBy);

  const productIds = productList.map((p) => p.id);
  let reviewStats: { productId: number; avg: string; count: string }[] = [];

  if (productIds.length > 0) {
    reviewStats = await db.select({
      productId: reviews.productId,
      avg: sql<string>`ROUND(AVG(${reviews.rating})::numeric, 1)`,
      count: sql<string>`COUNT(*)`,
    }).from(reviews).where(inArray(reviews.productId, productIds)).groupBy(reviews.productId);
  }

  const statsMap = new Map(reviewStats.map((s) => [s.productId, { avg: parseFloat(s.avg), count: parseInt(s.count) }]));
  const catMap = new Map(allCategories.map((c) => [c.id, c.name]));

  const enrichedProducts = productList.map((p) => ({
    ...p,
    averageRating: statsMap.get(p.id)?.avg || 0,
    reviewCount: statsMap.get(p.id)?.count || 0,
    categoryName: p.categoryId ? catMap.get(p.categoryId) || "" : "",
  }));

  return { categories: allCategories, products: enrichedProducts };
}

export default async function ShopPage(props: Props) {
  const searchParams = await props.searchParams;
  const { categories: cats, products: prods } = await getData(searchParams);

  return (
    <ShopClient
      products={prods}
      categories={cats}
      currentCategory={searchParams.category || ""}
      currentSort={searchParams.sort || "newest"}
    />
  );
}
