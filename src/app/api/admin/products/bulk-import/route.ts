import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6);
}

interface ImportRow {
  name?: string;
  price?: string | number;
  comparePrice?: string | number;
  description?: string;
  category?: string;
  sizes?: string;
  colors?: string;
  images?: string;
  badge?: string;
  featured?: string | boolean;
  inStock?: string | boolean;
  sku?: string;
}

function toBool(v: unknown, fallback: boolean): boolean {
  if (v === undefined || v === null || v === "") return fallback;
  if (typeof v === "boolean") return v;
  const s = String(v).trim().toLowerCase();
  return ["true", "yes", "1", "haan", "y"].includes(s);
}

function splitList(v: unknown): string[] {
  if (!v) return [];
  return String(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rows: ImportRow[] = Array.isArray(body.products) ? body.products : [];

    if (rows.length === 0) {
      return NextResponse.json({ error: "Koi product data nahi mila" }, { status: 400 });
    }

    // Load existing categories once, map lowercased name -> id
    const existingCategories = await db.select().from(categories);
    const categoryMap = new Map<string, number>();
    for (const c of existingCategories) categoryMap.set(c.name.trim().toLowerCase(), c.id);

    // Starting SKU number (continue from current product count)
    const countResult = await db.select({ count: sql<string>`COUNT(*)` }).from(products);
    let skuCounter = parseInt(countResult[0].count) + 1;

    let inserted = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because row 1 is the header in Excel

      const name = row.name?.toString().trim();
      const price = row.price?.toString().trim();

      if (!name || !price) {
        skipped++;
        errors.push(`Row ${rowNum}: Name ya Price missing hai — skip kiya gaya`);
        continue;
      }

      // Resolve or create category
      let categoryId: number | null = null;
      const categoryName = row.category?.toString().trim();
      if (categoryName) {
        const key = categoryName.toLowerCase();
        if (categoryMap.has(key)) {
          categoryId = categoryMap.get(key)!;
        } else {
          try {
            const [newCat] = await db
              .insert(categories)
              .values({
                name: categoryName,
                slug: generateSlug(categoryName),
              })
              .returning();
            categoryMap.set(key, newCat.id);
            categoryId = newCat.id;
          } catch {
            // If creation fails (e.g. race/duplicate), try lookup again
            const [found] = await db.select().from(categories).where(eq(categories.name, categoryName));
            if (found) {
              categoryMap.set(key, found.id);
              categoryId = found.id;
            }
          }
        }
      }

      try {
        await db.insert(products).values({
          sku: row.sku?.toString().trim() || `MW-${String(skuCounter).padStart(4, "0")}`,
          name,
          slug: generateSlug(name),
          description: row.description?.toString().trim() || name,
          price: price,
          compareAtPrice: row.comparePrice ? row.comparePrice.toString().trim() : null,
          categoryId,
          images: splitList(row.images),
          sizes: splitList(row.sizes),
          colors: splitList(row.colors),
          badge: row.badge?.toString().trim() || null,
          featured: toBool(row.featured, false),
          inStock: toBool(row.inStock, true),
        });
        if (!row.sku) skuCounter++;
        inserted++;
      } catch (e) {
        skipped++;
        errors.push(`Row ${rowNum}: "${name}" save nahi hua (${e instanceof Error ? e.message : "unknown error"})`);
      }
    }

    return NextResponse.json({ success: true, inserted, skipped, errors }, { status: 201 });
  } catch (error) {
    console.error("Error bulk importing products:", error);
    return NextResponse.json({ error: "Bulk import fail ho gaya" }, { status: 500 });
  }
}
