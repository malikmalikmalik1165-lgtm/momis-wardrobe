import { db } from "@/db";
import { products, reviews, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import ProductDetail from "./ProductDetail";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const product = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (product.length === 0) return null;

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

  // Related products
  const related = await db
    .select()
    .from(products)
    .where(eq(products.categoryId, p.categoryId!))
    .limit(5);

  const avgRating =
    productReviews.length > 0
      ? productReviews.reduce((sum, r) => sum + r.rating, 0) /
        productReviews.length
      : 0;

  return {
    product: {
      ...p,
      reviews: productReviews,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: productReviews.length,
      categoryName,
    },
    related: related.filter((r) => r.id !== p.id).slice(0, 4),
  };
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const data = await getProduct(slug);
  if (!data) return { title: "Product Not Found" };
  return {
    title: `${data.product.name} — Momis Wardrobe`,
    description: data.product.description.substring(0, 160),
  };
}

export default async function ProductPage(props: Props) {
  const { slug } = await props.params;
  const data = await getProduct(slug);
  if (!data) notFound();

  return <ProductDetail product={data.product} related={data.related} />;
}
