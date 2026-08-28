// Shared Excel/CSV product-import parser for Momis Wardrobe.
// Auto-detects two file shapes and maps both to the same payload the
// /api/admin/products/bulk-import route expects:
//   1. "momis"       — our own template (Name, Price, ComparePrice, ...)
//   2. "woocommerce" — WooCommerce product exporter & Markaz reseller
//                      exports (Name, Price, Sale price, Categories,
//                      Images, In stock?, Published, Attribute 1 name, ...)
import * as XLSX from "xlsx";

export type ImportFormat = "momis" | "woocommerce";

export interface ProductImportPayload {
  name: string;
  price: string;
  comparePrice: string;
  description: string;
  category: string;
  sizes: string;
  colors: string;
  images: string;
  badge: string;
  featured: string;
  inStock: string;
  sku: string;
}

export interface MappedImportRow {
  name: string;
  price: string;
  ok: boolean;
  reason: string;
  imageCount: number;
  payload: ProductImportPayload;
}

export interface ParseResult {
  format: ImportFormat;
  mapped: MappedImportRow[];
  notes: string[];
}

// Header names in the file (any case/spacing/punctuation) -> standard field.
// Normalized: lowercase, only a-z0-9 kept, so "Sale price" -> "saleprice",
// "In stock?" -> "instock", "Attribute 1 value(s)" -> "attribute1values".
const FIELD_ALIASES: Record<string, string[]> = {
  name: ["name", "productname", "title", "product", "itemname"],
  price: [
    "price", "regularprice", "productprice", "sellingprice", "finalprice",
    "unitprice", "baseprice", "markazprice", "normalprice", "pricernp",
  ],
  salePrice: ["saleprice", "discountedprice", "offerprice", "specialprice", "dealprice", "nowprice"],
  comparePrice: [
    "compareprice", "compareatprice", "mrp", "listprice", "originalprice",
    "strikethroughprice", "rrp",
  ],
  description: ["description", "productdescription", "longdescription", "details", "desc"],
  shortDescription: ["shortdescription", "excerpt", "briefdescription", "summary"],
  category: ["category", "categories", "productcategories", "cat", "section"],
  tags: ["tags", "tag", "keywords"],
  images: ["images", "image", "productimage", "productimages", "imageurls", "imageurl", "photo", "photos", "thumbnail", "picture", "attachment1"],
  sizes: ["sizes", "size", "productsize", "availablesizes"],
  colors: ["colors", "colour", "color", "productcolour", "productcolor"],
  badge: ["badge", "label", "sticker"],
  featured: ["featured", "isfeatured", "featuredproduct"],
  inStock: ["instock", "stock", "availability", "stockstatus", "availableinstock"],
  published: ["published", "status", "publish"],
  visibility: ["visibilityincatalog", "catalogvisibility", "visibility"],
  sku: ["sku", "productsku", "code", "itemcode", "variant"],
};

// Header keys that strongly indicate a WooCommerce-style export.
const WOO_SIGNATURE = new Set([
  "instock", "published", "visibilityincatalog", "saleprice", "shortdescription",
  "taxstatus", "taxclass", "isfeatured", "shippingclass", "downloadlimit",
  "date salepricestarts".replace(/[^a-z0-9]/g, ""), "type", "attribute1name",
]);

const IMAGE_EXT = /\.(jpe?g|png|webp|gif|avif|bmp)$/i;
const BADGE_WORDS = ["new", "sale", "best seller", "bestseller", "trending"];

export function normalizeHeader(h: unknown): string {
  return String(h ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function buildHeaderFieldMap(headers: string[]): Map<string, string> {
  const out = new Map<string, string>();
  for (const h of headers) {
    const n = normalizeHeader(h);
    for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
      if (aliases.includes(n) && !out.has(h)) {
        out.set(h, field);
        break;
      }
    }
  }
  return out;
}

/** Extract a numeric price from messy cells: "Rs. 1,750.00", "1 750", "PKR 2200". */
function cleanPrice(v: unknown): string {
  const raw = String(v ?? "").trim();
  if (!raw) return "";
  const m = raw.match(/(\d[\d,\s]*(?:\.\d+)?)/);
  if (!m) return "";
  const digits = m[1].replace(/[\s,]/g, "");
  const parts = digits.split(".");
  if (parts.length > 2) return `${parts[0]}.${parts.slice(1).join("")}`;
  const num = Number(digits);
  return Number.isFinite(num) && num > 0 ? digits : "";
}

function toYesNo(v: unknown, fallback: boolean): boolean {
  if (v === undefined || v === null || String(v).trim() === "") return fallback;
  if (typeof v === "boolean") return v;
  const s = String(v).trim().toLowerCase();
  if (["yes", "y", "1", "true", "haan", "in stock", "instock", "available", "publish", "published", "visible"].includes(s)) return true;
  if (["no", "n", "0", "false", "nahi", "out of stock", "outofstock", "hidden", "draft", "private", "unpublish", "unpublished"].includes(s)) return false;
  return fallback;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, '"')
    .replace(/&#0?39;/g, "'").replace(/&apos;/gi, "'").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">")
    .replace(/&rsquo;/gi, "'").replace(/&lsquo;/gi, "'").replace(/&mdash;/gi, "—").replace(/&ndash;/gi, "–")
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCharCode(Number(d)));
}

/** Woo descriptions are HTML — convert to clean plain text. */
function stripHtml(s: string): string {
  if (!s.includes("<")) return decodeEntities(s).replace(/\s+/g, " ").trim();
  let t = s
    .replace(/<\s*(br|\/ ?p|\/ ?div|\/ ?li|\/ ?h[1-6])[^>]*\s*>/gi, "\n")
    .replace(/<[^>]+>/g, " ");
  t = decodeEntities(t).replace(/[ \t]+/g, " ").replace(/\n ?/g, "\n").replace(/\n{3,}/g, "\n\n");
  return t.trim().slice(0, 3000);
}

/** Pull image URLs (or bare image filenames) out of a Woo/Momis cell. */
function extractImages(v: unknown): string[] {
  const raw = String(v ?? "").trim();
  if (!raw) return [];
  const urls = raw.match(/https?:\/\/[^\s,"'[\]]+/gi) ?? [];
  const found = urls.map((u) => u.trim().replace(/[,;)]+$/, ""));
  if (found.length > 0) return [...new Set(found)];
  // No absolute URLs — keep bare tokens that look like image filenames
  // (e.g. relative paths or media-library filenames).
  const tokens = raw.split(/[,|\n]/).map((t) => t.trim().replace(/^"|"$/g, "")).filter(Boolean);
  return [...new Set(tokens.filter((t) => IMAGE_EXT.test(t) || t.startsWith("/")))];
}

/** "Clothing > Women > Unstitched Suits" -> "Unstitched Suits" (deepest level). */
function resolveCategory(v: unknown): string {
  const raw = String(v ?? "").trim();
  if (!raw) return "";
  const first = raw.split(",")[0].trim().replace(/^"|"$/g, "");
  const segs = first.split(">").map((s) => s.trim()).filter(Boolean);
  const cat = (segs.length > 0 ? segs[segs.length - 1] : first).replace(/^"|"$/g, "");
  return normalizeHeader(cat) === "uncategorized" ? "" : cat;
}

function splitList(s: string): string[] {
  return s.split(/[,\n|]/).map((x) => x.trim().replace(/^"|"$/g, "")).filter(Boolean);
}

/** Comma-separated list -> single comma-separated string (payload format). */
function asList(s: string): string {
  const items = splitList(s);
  return items.length > 0 ? [...new Set(items)].join(", ") : "";
}

function detectFormat(headers: string[]): ImportFormat {
  let hits = 0;
  for (const h of headers) {
    if (WOO_SIGNATURE.has(normalizeHeader(h))) hits++;
  }
  return hits >= 2 ? "woocommerce" : "momis";
}

/**
 * Map raw sheet rows (objects keyed by header) into validated import rows.
 */
export function parseProductRows(rows: Record<string, unknown>[]): ParseResult {
  if (rows.length === 0) {
    throw new Error("File mein koi data row nahi mili — pehli row column headers honi chahiye (Download Template use karein)");
  }

  const headers = Object.keys(rows[0]);
  const fieldMap = buildHeaderFieldMap(headers);
  const format = detectFormat(headers);
  const notes: string[] = [];

  // WooCommerce attribute pairs: "Attribute N name" / "Attribute N value(s)"
  const attrPairs: { nameKey: string; valueKey: string }[] = [];
  for (const h of headers) {
    const m = normalizeHeader(h).match(/^attribute(\d+)name$/);
    if (m) {
      const valueKey = headers.find((v) => normalizeHeader(v) === `attribute${m[1]}values`);
      if (valueKey) attrPairs.push({ nameKey: h, valueKey });
    }
  }

  const pick = (r: Record<string, unknown>, field: string): unknown => {
    for (const [h, f] of fieldMap) {
      if (f === field && r[h] !== undefined && String(r[h]).trim() !== "") return r[h];
    }
    return "";
  };
  const str = (v: unknown) => String(v ?? "").trim();

  if (format === "woocommerce") {
    notes.push("🛒 WooCommerce/Markaz export format pehchana gaya — columns auto-map kiye gaye");
    notes.push("Sale price wali rows mein live price = Sale price, compare-at = regular price");
    if ([...fieldMap.values()].includes("images")) {
      notes.push("Images column ke URLs auto-extract ho rahe hain");
    }
  }

  const seenSku = new Set<string>();
  const seenKey = new Set<string>();
  const mapped: MappedImportRow[] = rows.map((r) => {
    const name = stripHtml(str(pick(r, "name")));
    const reg = cleanPrice(pick(r, "price"));
    const sale = cleanPrice(pick(r, "salePrice"));
    const cmp = cleanPrice(pick(r, "comparePrice"));

    // Price resolution: Woo rows can carry Price + Sale price.
    let price = "";
    let comparePrice = "";
    if (sale && reg && Number(sale) < Number(reg)) {
      price = sale;
      comparePrice = cmp || reg;
    } else {
      price = reg || sale;
      comparePrice = reg && sale ? reg : cmp;
    }

    const sku = str(pick(r, "sku"));
    const published = pick(r, "published");
    const visibility = pick(r, "visibility");

    let reason = "";
    if (!name) reason = "Name missing";
    else if (!price) reason = "Price missing";
    else if (published !== "" && !toYesNo(published, true)) reason = "Unpublished/draft row — skip";
    else if (visibility !== "" && /hidden|private/i.test(str(visibility))) reason = "Catalog mein hidden — skip";
    else if (sku && seenSku.has(sku)) reason = "Duplicate SKU file ke andar";
    else if (!sku && seenKey.has(`${name.toLowerCase()}|${price}`)) reason = "Duplicate row file ke andar";
    if (sku && !reason) seenSku.add(sku);
    if (!reason) seenKey.add(`${name.toLowerCase()}|${price}`);

    // Description: prefer short, else clean the long one.
    const shortDesc = stripHtml(str(pick(r, "shortDescription")));
    const longDesc = stripHtml(str(pick(r, "description")));
    const description = shortDesc || longDesc || name;

    // Sizes/colors: explicit columns, else scan Woo attributes (Size/Colour).
    let sizes = asList(str(pick(r, "sizes")));
    let colors = asList(str(pick(r, "colors")));
    if (format === "woocommerce" && (!sizes || !colors)) {
      for (const { nameKey, valueKey } of attrPairs) {
        const an = normalizeHeader(str(r[nameKey]));
        const av = str(r[valueKey]);
        if (!av) continue;
        if (!sizes && (an === "size" || an === "sizes")) sizes = asList(av);
        if (!colors && (an === "color" || an === "colour")) colors = asList(av);
      }
    }

    const images = extractImages(pick(r, "images"));

    // Badge: explicit column, else first meaningful tag word.
    let badge = str(pick(r, "badge"));
    if (!badge && format === "woocommerce") {
      const tags = splitList(str(pick(r, "tags")));
      const hit = tags.find((t) => BADGE_WORDS.includes(normalizeHeader(t).replace(/[^a-z ]/g, "")));
      if (hit) badge = hit.trim().replace(/\b\w/g, (c) => c.toUpperCase());
    }

    const featured = toYesNo(pick(r, "featured"), false) ? "Yes" : "";
    const inStock = toYesNo(pick(r, "inStock"), true) ? "Yes" : "No";

    return {
      name,
      price,
      ok: !reason,
      reason,
      imageCount: images.length,
      payload: {
        name,
        price,
        comparePrice,
        description,
        category: resolveCategory(pick(r, "category")),
        sizes,
        colors,
        images: images.join(", "),
        badge,
        featured,
        inStock,
        sku,
      },
    };
  });

  const skippedUnpub = mapped.filter((m) => m.reason === "Unpublished/draft row — skip").length;
  if (skippedUnpub > 0) notes.push(`${skippedUnpub} unpublished/draft rows preview mein marked hain (import nahi hongi)`);
  const noImages = mapped.filter((m) => m.ok && m.imageCount === 0).length;
  if (noImages > 0) notes.push(`⚠️ ${noImages} products mein koi image URL nahi mila`);

  return { format, mapped, notes };
}

/**
 * Read a .xlsx/.xls/.csv File and return mapped import rows.
 * Throws Error with a user-facing (Roman-Urdu) message on failure.
 */
export async function readProductFile(file: File | Blob & { name?: string }): Promise<ParseResult> {
  let wb: XLSX.WorkBook;
  try {
    const name = (file as File).name ?? "";
    if (name.toLowerCase().endsWith(".csv")) {
      wb = XLSX.read(await file.text(), { type: "string" });
    } else {
      wb = XLSX.read(await file.arrayBuffer(), { type: "array" });
    }
  } catch {
    throw new Error("File parse nahi ho saki — sahi Excel/CSV file select karein (.xlsx, .xls ya .csv)");
  }
  const sheetName = wb.SheetNames.find((sn) => {
    const ws = wb.Sheets[sn];
    return ws && Array.isArray(ws["!ref"]);
  }) ?? wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  if (!sheet) throw new Error("File mein koi sheet nahi mili");
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  return parseProductRows(rows);
}
