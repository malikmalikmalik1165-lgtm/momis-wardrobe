import { db } from "./index";
import { categories, products, reviews } from "./schema";
import { sql } from "drizzle-orm";

const PRODUCT_IMAGES: Record<string, string[]> = {
  "silk-evening-gown": [
    "https://images.pexels.com/photos/15752053/pexels-photo-15752053.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/17347430/pexels-photo-17347430.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
  "velvet-cocktail-dress": [
    "https://images.pexels.com/photos/17551379/pexels-photo-17551379.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/20014630/pexels-photo-20014630.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
  "floral-maxi-dress": [
    "https://images.pexels.com/photos/20483777/pexels-photo-20483777.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/19306663/pexels-photo-19306663.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
  "lace-midi-dress": [
    "https://images.pexels.com/photos/19306663/pexels-photo-19306663.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/17559253/pexels-photo-17559253.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
  "classic-wrap-dress": [
    "https://images.pexels.com/photos/31094918/pexels-photo-31094918.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/33933602/pexels-photo-33933602.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
  "satin-slip-dress": [
    "https://images.pexels.com/photos/17559253/pexels-photo-17559253.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/38193198/pexels-photo-38193198.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
  "leather-tote-bag": [
    "https://images.pexels.com/photos/29793778/pexels-photo-29793778.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/18601501/pexels-photo-18601501.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
  "quilted-chain-bag": [
    "https://images.pexels.com/photos/31929486/pexels-photo-31929486.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/21897141/pexels-photo-21897141.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
  "structured-crossbody": [
    "https://images.pexels.com/photos/18601568/pexels-photo-18601568.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/20086702/pexels-photo-20086702.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
  "patent-stiletto-heels": [
    "https://images.pexels.com/photos/10686370/pexels-photo-10686370.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/37595216/pexels-photo-37595216.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
  "strappy-block-heels": [
    "https://images.pexels.com/photos/6920411/pexels-photo-6920411.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/37835911/pexels-photo-37835911.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
  "pointed-toe-mules": [
    "https://images.pexels.com/photos/33659069/pexels-photo-33659069.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/12173376/pexels-photo-12173376.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
  "silk-bow-blouse": [
    "https://images.pexels.com/photos/38509773/pexels-photo-38509773.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/5817204/pexels-photo-5817204.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
  "cashmere-turtleneck": [
    "https://images.pexels.com/photos/9396281/pexels-photo-9396281.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/38264767/pexels-photo-38264767.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
  "oversized-blazer": [
    "https://images.pexels.com/photos/18895486/pexels-photo-18895486.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/31410151/pexels-photo-31410151.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
  "tailored-wide-leg-pants": [
    "https://images.pexels.com/photos/38264767/pexels-photo-38264767.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
    "https://images.pexels.com/photos/33217042/pexels-photo-33217042.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800",
  ],
};

const CATEGORY_IMAGES: Record<string, string> = {
  dresses:
    "https://images.pexels.com/photos/15752053/pexels-photo-15752053.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
  bags: "https://images.pexels.com/photos/31929486/pexels-photo-31929486.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
  shoes:
    "https://images.pexels.com/photos/10686370/pexels-photo-10686370.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
  tops: "https://images.pexels.com/photos/38509773/pexels-photo-38509773.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=600",
};

async function seed() {
  // Check if already seeded
  const existing = await db.select().from(categories).limit(1);
  if (existing.length > 0) {
    console.log("Database already seeded.");
    return;
  }

  console.log("Seeding database...");

  // Categories
  const [dresses, bags, shoes, tops] = await db
    .insert(categories)
    .values([
      {
        name: "Dresses",
        slug: "dresses",
        description: "Elegant dresses for every occasion",
        image: CATEGORY_IMAGES.dresses,
      },
      {
        name: "Bags",
        slug: "bags",
        description: "Luxury handbags & accessories",
        image: CATEGORY_IMAGES.bags,
      },
      {
        name: "Shoes",
        slug: "shoes",
        description: "Designer heels & footwear",
        image: CATEGORY_IMAGES.shoes,
      },
      {
        name: "Tops & Outerwear",
        slug: "tops",
        description: "Premium blouses, knitwear & blazers",
        image: CATEGORY_IMAGES.tops,
      },
    ])
    .returning();

  // Products — prices in PKR
  const productData = [
    {
      name: "Silk Evening Gown",
      slug: "silk-evening-gown",
      description:
        "A breathtaking floor-length silk gown featuring a sculpted bodice and flowing skirt. Crafted from premium mulberry silk with a subtle sheen that catches the light beautifully. Perfect for galas, black-tie events, and special celebrations. The figure-flattering cut and delicate draping create an unforgettable silhouette.",
      price: "18500",
      compareAtPrice: "22000",
      categoryId: dresses.id,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Burgundy", "Navy"],
      featured: true,
      badge: "Best Seller",
    },
    {
      name: "Velvet Cocktail Dress",
      slug: "velvet-cocktail-dress",
      description:
        "An exquisite velvet cocktail dress with a sophisticated A-line silhouette. The luxurious velvet fabric provides warmth while maintaining an air of elegance. Features a flattering V-neckline and cap sleeves. Ideal for dinner parties, cocktail hours, and upscale evenings out.",
      price: "12500",
      compareAtPrice: null,
      categoryId: dresses.id,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Emerald", "Black", "Plum"],
      featured: true,
      badge: "New Arrival",
    },
    {
      name: "Floral Maxi Dress",
      slug: "floral-maxi-dress",
      description:
        "A romantic floral maxi dress in a lightweight chiffon fabric. The delicate floral print adds a touch of femininity, while the flowing silhouette offers effortless elegance. Features adjustable straps and an empire waistline for a universally flattering fit. Perfect for garden parties and summer occasions.",
      price: "8900",
      compareAtPrice: "11500",
      categoryId: dresses.id,
      sizes: ["S", "M", "L", "XL"],
      colors: ["Ivory Floral", "Blush Floral", "Sage Floral"],
      featured: false,
      badge: "Sale",
    },
    {
      name: "Lace Midi Dress",
      slug: "lace-midi-dress",
      description:
        "An intricate lace midi dress that embodies timeless femininity. The allover lace features a beautiful scalloped hemline and elegant three-quarter sleeves. Lined with premium silk for comfort and modesty. A versatile piece that transitions beautifully from day to evening.",
      price: "14500",
      compareAtPrice: null,
      categoryId: dresses.id,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["White", "Nude", "Black"],
      featured: true,
      badge: null,
    },
    {
      name: "Classic Wrap Dress",
      slug: "classic-wrap-dress",
      description:
        "A timeless wrap dress crafted from premium jersey with a beautiful drape. The adjustable wrap design flatters every figure and creates a defined waistline. Features elegant long sleeves and a graceful midi length. An essential wardrobe piece for any sophisticated woman.",
      price: "7500",
      compareAtPrice: null,
      categoryId: dresses.id,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: ["Navy", "Forest Green", "Terracotta"],
      featured: false,
      badge: null,
    },
    {
      name: "Satin Slip Dress",
      slug: "satin-slip-dress",
      description:
        "A luxurious satin slip dress with a sleek cowl neckline and delicate spaghetti straps. The bias-cut construction follows natural curves for an effortlessly chic look. Can be worn alone or layered under blazers for a contemporary styling approach.",
      price: "9900",
      compareAtPrice: "13500",
      categoryId: dresses.id,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Champagne", "Black", "Rose Gold"],
      featured: true,
      badge: "Trending",
    },
    {
      name: "Leather Tote Bag",
      slug: "leather-tote-bag",
      description:
        "A beautifully crafted leather tote made from full-grain Italian leather. Features a spacious interior with multiple compartments, a secure magnetic closure, and elegant gold-tone hardware. The structured silhouette maintains its shape while offering ample room for daily essentials.",
      price: "19500",
      compareAtPrice: "24000",
      categoryId: bags.id,
      sizes: [],
      colors: ["Tan", "Black", "Burgundy"],
      featured: true,
      badge: "Best Seller",
    },
    {
      name: "Quilted Chain Bag",
      slug: "quilted-chain-bag",
      description:
        "An iconic quilted handbag featuring a classic chain strap and turn-lock closure. Crafted from supple lambskin leather with meticulous diamond quilting. The versatile chain strap can be worn on the shoulder or crossbody. An investment piece that elevates any outfit.",
      price: "16500",
      compareAtPrice: null,
      categoryId: bags.id,
      sizes: [],
      colors: ["White", "Black", "Blush Pink"],
      featured: true,
      badge: "New Arrival",
    },
    {
      name: "Structured Crossbody",
      slug: "structured-crossbody",
      description:
        "A sophisticated structured crossbody bag with clean lines and a minimalist aesthetic. Features an adjustable strap, multiple card slots, and a zip compartment. Crafted from premium Saffiano leather that resists scratches and maintains its beauty over time.",
      price: "11000",
      compareAtPrice: null,
      categoryId: bags.id,
      sizes: [],
      colors: ["Red", "Black", "Caramel"],
      featured: false,
      badge: null,
    },
    {
      name: "Patent Stiletto Heels",
      slug: "patent-stiletto-heels",
      description:
        "Stunning patent leather stiletto heels with a sleek pointed toe and a confident 100mm heel. The glossy finish adds instant glamour to any ensemble. Features a cushioned insole for all-day comfort and a non-slip sole. The ultimate power shoe for the modern woman.",
      price: "13500",
      compareAtPrice: "16000",
      categoryId: shoes.id,
      sizes: ["36", "37", "38", "39", "40", "41"],
      colors: ["Black", "Red", "Nude"],
      featured: true,
      badge: "Iconic",
    },
    {
      name: "Strappy Block Heels",
      slug: "strappy-block-heels",
      description:
        "Elegant strappy sandals with a comfortable block heel. The interwoven straps create a stunning visual effect while providing secure support. Crafted from supple leather with a padded footbed. Perfect for weddings, special events, or elevating everyday outfits.",
      price: "8500",
      compareAtPrice: null,
      categoryId: shoes.id,
      sizes: ["36", "37", "38", "39", "40"],
      colors: ["Gold", "Silver", "Black"],
      featured: false,
      badge: null,
    },
    {
      name: "Pointed Toe Mules",
      slug: "pointed-toe-mules",
      description:
        "Chic pointed-toe mules with a kitten heel that blend comfort with style. The slip-on design makes them effortlessly elegant for both office and evening wear. Featuring a leather-lined interior and cushioned footbed for superior comfort throughout the day.",
      price: "7200",
      compareAtPrice: null,
      categoryId: shoes.id,
      sizes: ["36", "37", "38", "39", "40", "41"],
      colors: ["Ivory", "Black", "Leopard Print"],
      featured: false,
      badge: "New",
    },
    {
      name: "Silk Bow Blouse",
      slug: "silk-bow-blouse",
      description:
        "A refined silk blouse featuring an elegant pussy-bow neckline and flowing sleeves. The lightweight silk fabric drapes beautifully and feels luxurious against the skin. An effortless piece that pairs beautifully with tailored trousers or pencil skirts for a polished look.",
      price: "6500",
      compareAtPrice: null,
      categoryId: tops.id,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["White", "Blush", "French Blue"],
      featured: true,
      badge: null,
    },
    {
      name: "Cashmere Turtleneck",
      slug: "cashmere-turtleneck",
      description:
        "An incredibly soft cashmere turtleneck crafted from 100% Grade-A Mongolian cashmere. The relaxed fit and ribbed trim create a cozy yet sophisticated look. A wardrobe essential that layers beautifully under blazers or stands alone as a statement of understated luxury.",
      price: "15500",
      compareAtPrice: "18500",
      categoryId: tops.id,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Camel", "Charcoal", "Cream", "Forest Green"],
      featured: false,
      badge: "Sale",
    },
    {
      name: "Oversized Blazer",
      slug: "oversized-blazer",
      description:
        "A contemporary oversized blazer with sharp tailoring and relaxed proportions. Features peak lapels, a single-button closure, and flap pockets. The premium wool-blend fabric provides structure while maintaining comfort. Style it belted or open for different looks.",
      price: "17000",
      compareAtPrice: null,
      categoryId: tops.id,
      sizes: ["XS", "S", "M", "L"],
      colors: ["Black", "Camel", "Check Pattern"],
      featured: true,
      badge: "Editor's Pick",
    },
    {
      name: "Tailored Wide-Leg Pants",
      slug: "tailored-wide-leg-pants",
      description:
        "Effortlessly elegant wide-leg trousers with a high-rise waistline and flowing silhouette. The premium crepe fabric offers beautiful movement and drape. Features front pleats, side pockets, and a flattering fit through the hip. Perfect paired with blouses or bodysuits.",
      price: "8500",
      compareAtPrice: null,
      categoryId: tops.id,
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Black", "Ivory", "Navy"],
      featured: false,
      badge: null,
    },
  ];

  const insertedProducts = await db
    .insert(products)
    .values(
      productData.map((p) => ({
        ...p,
        images: PRODUCT_IMAGES[p.slug] || [],
      }))
    )
    .returning();

  // Reviews
  const reviewAuthors = [
    "Ayesha M.",
    "Fatima L.",
    "Sana R.",
    "Hira K.",
    "Zainab T.",
    "Mahnoor J.",
    "Amna P.",
    "Nadia D.",
    "Mehreen W.",
    "Aisha B.",
    "Rabia N.",
    "Iqra G.",
    "Saima S.",
    "Kiran V.",
    "Bushra F.",
  ];

  const reviewBodies: Record<number, string[]> = {
    5: [
      "Absolutely stunning! The quality is exceptional and the fit is perfect. I've received so many compliments.",
      "This exceeded my expectations. The craftsmanship is impeccable and it photographs beautifully.",
      "Worth every rupee! The fabric quality is luxurious and the attention to detail is remarkable.",
      "I'm in love with this piece. It's become my go-to for special occasions. Truly elegant.",
      "Incredible quality and such a flattering fit. Momis Wardrobe never disappoints!",
    ],
    4: [
      "Beautiful piece with great quality. Runs slightly small, so I'd recommend sizing up.",
      "Love the design and fabric quality. Shipping was fast and the packaging was gorgeous.",
      "Really lovely item. The color is exactly as pictured. Very happy with my purchase.",
      "Great addition to my wardrobe. Well-made and stylish. Would buy again in another color.",
    ],
    3: [
      "Nice quality overall. The fit was a bit different than expected but still looks good.",
      "Decent purchase. The material is nice but the sizing chart could be more accurate.",
    ],
  };

  const reviewTitles: Record<number, string[]> = {
    5: [
      "Absolutely Perfect!",
      "A Dream Come True",
      "Pure Elegance",
      "Obsessed!",
      "Five Stars All Day",
    ],
    4: [
      "Love It!",
      "Beautiful Quality",
      "Great Purchase",
      "Very Happy",
    ],
    3: ["Pretty Good", "Nice but Room for Improvement"],
  };

  const reviewsData: {
    productId: number;
    author: string;
    rating: number;
    title: string;
    body: string;
    verified: boolean;
  }[] = [];

  for (const product of insertedProducts) {
    const numReviews = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < numReviews; i++) {
      const rating = Math.random() < 0.6 ? 5 : Math.random() < 0.75 ? 4 : 3;
      const bodies = reviewBodies[rating];
      const titles = reviewTitles[rating];
      reviewsData.push({
        productId: product.id,
        author: reviewAuthors[Math.floor(Math.random() * reviewAuthors.length)],
        rating,
        title: titles[Math.floor(Math.random() * titles.length)],
        body: bodies[Math.floor(Math.random() * bodies.length)],
        verified: Math.random() > 0.3,
      });
    }
  }

  await db.insert(reviews).values(reviewsData);

  console.log(
    `Seeded ${insertedProducts.length} products, ${reviewsData.length} reviews, 4 categories.`
  );
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
