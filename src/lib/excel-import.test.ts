import { describe, expect, it } from "vitest";
import {
  cleanPrice,
  parseProductRows,
  validateFilledPayload,
  type ProductImportPayload,
} from "./excel-import";

describe("cleanPrice", () => {
  it("messy PKR prices saaf kar deta hai", () => {
    expect(cleanPrice("Rs. 2,450")).toBe("2450");
    expect(cleanPrice("1 750")).toBe("1750");
    expect(cleanPrice("PKR 2200")).toBe("2200");
    expect(cleanPrice("1,299.50")).toBe("1299.50");
  });

  it("non-numeric prices reject ho jate hain", () => {
    expect(cleanPrice("free")).toBe("");
    expect(cleanPrice("ask price")).toBe("");
    expect(cleanPrice("")).toBe("");
  });
});

describe("parseProductRows — momis template", () => {
  it("images http→https normalize hoti hain, semicolon-separated URLs split hoti hain", () => {
    const res = parseProductRows([
      {
        Name: "Suit A",
        Price: "3500",
        ComparePrice: "",
        Category: "Suits",
        Description: "d",
        Sizes: "",
        Colors: "",
        Images: "http://cdn.example.com/a.jpg; https://cdn.example.com/b.jpg",
        Badge: "",
        Featured: "",
        InStock: "",
        SKU: "",
      },
    ]);
    expect(res.mapped[0].ok).toBe(true);
    expect(res.mapped[0].imageCount).toBe(2);
    expect(res.mapped[0].payload.images).toBe(
      "https://cdn.example.com/a.jpg, https://cdn.example.com/b.jpg"
    );
  });

  it("bina image wali row importable hai lekin imageCount 0", () => {
    const res = parseProductRows([{ Name: "Suit B", Price: "2000" }]);
    expect(res.mapped[0].ok).toBe(true);
    expect(res.mapped[0].imageCount).toBe(0);
  });

  it("file ke andar duplicate SKU — second row flag hoti hai", () => {
    const res = parseProductRows([
      { Name: "X", Price: "100", SKU: "S1" },
      { Name: "X", Price: "100", SKU: "S1" },
    ]);
    expect(res.mapped[0].ok).toBe(true);
    expect(res.mapped[1].ok).toBe(false);
    expect(res.mapped[1].reason).toBe("Duplicate SKU file ke andar");
  });

  it("adhoori rows par fill-note milta hai", () => {
    const res = parseProductRows([{ Name: "Suit C", Price: "" }]);
    expect(res.notes.some((n) => n.includes("Fill"))).toBe(true);
  });
});

describe("parseProductRows — WooCommerce/Markaz", () => {
  const wooRow = {
    Name: "Cotton Kurti",
    Price: "2200",
    "Sale price": "1750",
    "Short description": "Cotton kurti with buttons",
    Categories: "Clothing > Women > Kurtis",
    Images: "https://shop.example.com/wp-content/uploads/kurti-1.jpg",
    "In stock?": "Yes",
    Published: "1",
    "Visibility in catalog": "visible",
    SKU: "K-1",
  };

  it("format detect hota hai, sale price live + regular compare-at", () => {
    const res = parseProductRows([wooRow]);
    expect(res.format).toBe("woocommerce");
    expect(res.mapped[0].ok).toBe(true);
    expect(res.mapped[0].price).toBe("1750");
    expect(res.mapped[0].payload.comparePrice).toBe("2200");
    expect(res.mapped[0].payload.category).toBe("Kurtis");
    expect(res.mapped[0].imageCount).toBe(1);
  });

  it("unpublished row soft-skip hoti hai (Fill se override ho sakti hai)", () => {
    const res = parseProductRows([{ ...wooRow, Published: "0" }]);
    expect(res.mapped[0].ok).toBe(false);
    expect(res.mapped[0].reason).toBe("Unpublished/draft row — skip");
  });
});

describe("validateFilledPayload — ✏️ Fill form", () => {
  const base: ProductImportPayload = {
    name: "",
    price: "",
    comparePrice: "",
    description: "",
    category: "",
    sizes: "",
    colors: "",
    images: "",
    badge: "",
    featured: "",
    inStock: "Yes",
    sku: "",
  };

  it("poora payload importable hai (messy price bhi clean ho jata hai)", () => {
    const v = validateFilledPayload({
      ...base,
      name: "Embroidered Suit",
      price: "Rs. 2,450",
      images: "https://cdn.example.com/1.jpg, http://cdn.example.com/2.jpg",
    });
    expect(v.ok).toBe(true);
    expect(v.imageCount).toBe(2);
  });

  it("bina Name ke block", () => {
    const v = validateFilledPayload({ ...base, price: "100" });
    expect(v.ok).toBe(false);
    expect(v.reason).toBe("Name missing");
  });

  it("bina valid Price ke block — 'free' nahi chalega", () => {
    const v = validateFilledPayload({ ...base, name: "Suit", price: "free" });
    expect(v.ok).toBe(false);
    expect(v.reason).toBe("Price missing");
  });
});
