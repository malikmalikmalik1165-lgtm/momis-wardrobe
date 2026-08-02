import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { IMPORT_MARGIN, WOMENS_COLLECTION } from "@/lib/markaz-products";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

function makeSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function POST() {
  const uniqueCategories = [...new Set(WOMENS_COLLECTION.map((p) => p.category))];
  const categoryIds = new Map<string, number>();

  for (const catName of uniqueCategories) {
    const slug = makeSlug(catName);
    const existing = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    if (existing.length > 0) {
      categoryIds.set(catName, existing[0].id);
    } else {
      const img = WOMENS_COLLECTION.find((p) => p.category === catName)?.image || null;
      const [created] = await db.insert(categories).values({
        name: catName, slug, description: `${catName} — curated by Momis Wardrobe`, image: img,
      }).returning();
      categoryIds.set(catName, created.id);
    }
  }

  let inserted = 0, updated = 0;

  for (const item of WOMENS_COLLECTION) {
    const finalPrice = item.basePrice + IMPORT_MARGIN;
    const compareAt = Math.round(finalPrice * 1.2);
    const existing = await db.select().from(products).where(eq(products.slug, item.slug)).limit(1);
    const values = {
      name: item.name,
      description: item.description,
      price: String(finalPrice),
      compareAtPrice: String(compareAt),
      categoryId: categoryIds.get(item.category) || null,
      images: [item.image],
      sizes: item.sizes || [],
      colors: item.colors || [],
      inStock: true,
      featured: true,
      badge: item.badge || null,
    };
    if (existing.length > 0) {
      await db.update(products).set(values).where(eq(products.id, existing[0].id));
      updated++;
    } else {
      await db.insert(products).values({ ...values, slug: item.slug });
      inserted++;
    }
  }

  return NextResponse.json({ success: true, marginAdded: IMPORT_MARGIN, inserted, updated, total: WOMENS_COLLECTION.length });
}

export async function GET() { return POST(); }
