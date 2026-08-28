import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { cleanPrice } from "@/lib/excel-import";

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

/** next/image sirf https hosts optimize karti hai — http URLs ko https banao. */
function normalizeImageUrl(u: string): string {
  return u.trim().replace(/^http:\/\//i, "https://");
}

/**
 * Image cells comma, semicolon, newlines ya spaces se separated ho sakti hain
 * (Fill form mein user nayi line se alag karta hai). Har token trim + https
 * normalize + dedupe. (Sizes/Colors ke liye NAHI use karna — "Free Size"
 * jaise values spaces ke saath chalti hain, is liye unka splitList comma-only hai.)
 */
function splitImages(v: unknown): string[] {
  if (!v) return [];
  const out: string[] = [];
  for (const token of String(v).split(/[\s,;]+/)) {
    const url = normalizeImageUrl(token);
    if (url) out.push(url);
  }
  return [...new Set(out)];
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

    // Load existing products once — enables SKU-based update (re-import safe)
    // and duplicate-name detection.
    const existingProducts = await db
      .select({ id: products.id, sku: products.sku, name: products.name })
      .from(products);
    const productBySku = new Map<string, number>();
    const productByName = new Map<string, number>();
    for (const p of existingProducts) {
      if (p.sku) productBySku.set(p.sku.trim().toLowerCase(), p.id);
      productByName.set(p.name.trim().toLowerCase(), p.id);
    }

    // Starting SKU number (continue from current product count)
    const countResult = await db.select({ count: sql<string>`COUNT(*)` }).from(products);
    let skuCounter = parseInt(countResult[0].count) + 1;

    let inserted = 0;
    let updated = 0;
    let skipped = 0;
    const errors: string[] = [];

    // In-file duplicate tracking (real ids, no sentinels):
    // - SKU rows: same SKU twice in one file -> later row updates the earlier one
    //   (yeh wahi raasta hai jab user ne preview mein duplicate row Fill ki ho)
    // - No-SKU rows: same name twice in one file -> later row is skipped
    const inFileSkuId = new Map<string, number>();
    const inFileName = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNum = i + 2; // +2 because row 1 is the header in Excel

      const name = row.name?.toString().trim();
      const price = cleanPrice(row.price);

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

      const rowSku = row.sku?.toString().trim() || "";
      const skuKey = rowSku ? rowSku.toLowerCase() : "";
      const nameKey = name.toLowerCase();

      const values = {
        description: row.description?.toString().trim() || name,
        price: price,
        compareAtPrice: cleanPrice(row.comparePrice) || null,
        categoryId,
        images: splitImages(row.images),
        sizes: splitList(row.sizes),
        colors: splitList(row.colors),
        badge: row.badge?.toString().trim() || null,
        featured: toBool(row.featured, false),
        inStock: toBool(row.inStock, true),
      };

      try {
        // 1) In-file duplicate? (before touching the store lookup)
        if (skuKey) {
          const inFileId = inFileSkuId.get(skuKey);
          if (inFileId !== undefined) {
            // Same SKU dobara isi file mein — later row earlier walay ko update karti hai
            await db.update(products).set(values).where(eq(products.id, inFileId));
            updated++;
            continue;
          }
        } else if (inFileName.has(nameKey)) {
          skipped++;
          errors.push(`Row ${rowNum}: "${name}" file mein dobara aayi — pehli row import hui, ye row skip ki gayi`);
          continue;
        }

        // 2) Already in store?
        const existingId = skuKey ? productBySku.get(skuKey) : productByName.get(nameKey);
        if (existingId !== undefined) {
          if (!skuKey) {
            skipped++;
            errors.push(`Row ${rowNum}: "${name}" pehle se maujood hai — update ke liye file mein SKU column bhar kar dobara import karein`);
            continue;
          }
          // Same SKU already in store -> update instead of inserting a duplicate
          await db.update(products).set(values).where(eq(products.id, existingId));
          updated++;
          inFileSkuId.set(skuKey, existingId);
          continue;
        }

        // 3) Fresh insert
        const [newProd] = await db
          .insert(products)
          .values({
            sku: rowSku || `MW-${String(skuCounter).padStart(4, "0")}`,
            name,
            slug: generateSlug(name),
            ...values,
          })
          .returning({ id: products.id });
        if (!rowSku) skuCounter++;
        if (skuKey) inFileSkuId.set(skuKey, newProd.id);
        else inFileName.add(nameKey);
        inserted++;
      } catch (e) {
        skipped++;
        errors.push(`Row ${rowNum}: "${name}" save nahi hua (${e instanceof Error ? e.message : "unknown error"})`);
      }
    }

    return NextResponse.json({ success: true, inserted, updated, skipped, errors }, { status: 201 });
  } catch (error) {
    console.error("Error bulk importing products:", error);
    return NextResponse.json({ error: "Bulk import fail ho gaya" }, { status: 500 });
  }
}
