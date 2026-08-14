import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { isNotNull, sql, inArray, desc } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { Sparkles, Clock, Percent } from "lucide-react";

// Revalidate every 60 seconds instead of force-dynamic
export const revalidate = 60;

async function getSaleProducts() {
  // Only select columns needed for ProductCard
  const saleProducts = await db
    .select({
      id: products.id, name: products.name, slug: products.slug, price: products.price,
      compareAtPrice: products.compareAtPrice, images: products.images, badge: products.badge,
      colors: products.colors,
    })
    .from(products)
    .where(isNotNull(products.compareAtPrice))
    .orderBy(desc(products.createdAt));

  const productIds = saleProducts.map((p) => p.id);
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

  return saleProducts.map((p) => ({
    ...p,
    averageRating: statsMap.get(p.id)?.avg || 0,
    reviewCount: statsMap.get(p.id)?.count || 0,
  }));
}

export default async function SalePage() {
  const saleProducts = await getSaleProducts();

  const totalSavings = saleProducts.reduce((sum, p) => {
    if (p.compareAtPrice) {
      return sum + (parseFloat(p.compareAtPrice) - parseFloat(p.price));
    }
    return sum;
  }, 0);

  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)]">
      {/* Hero */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-4">
            <Sparkles size={16} />
            Limited Time Offers
          </div>
          <h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            SALE 🔥
          </h1>
          <p className="text-rose-100 text-lg max-w-xl mx-auto mb-6">
            Massive discounts on premium fashion! Jaldi karein, stock limited hai.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 rounded-xl px-6 py-3">
              <p className="text-3xl font-bold">Up to 30%</p>
              <p className="text-sm text-rose-200">OFF</p>
            </div>
            <div className="bg-white/20 rounded-xl px-6 py-3">
              <p className="text-3xl font-bold">{saleProducts.length}</p>
              <p className="text-sm text-rose-200">Items on Sale</p>
            </div>
          </div>
        </div>
      </div>

      {/* Timer Banner */}
      <div className="bg-warm-gray-900 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-3 text-sm">
            <Clock size={16} className="text-rose-400" />
            <span>Sale jaldi khatam ho sakti hai — Abhi order karein!</span>
            <a
              href="https://wa.me/923295578925?text=Sale%20items%20ke%20baare%20mein%20poochna%20hai"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-green-600"
            >
              WhatsApp Order
            </a>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {saleProducts.length === 0 ? (
          <div className="text-center py-20">
            <Percent className="mx-auto text-warm-gray-200 mb-4" size={48} />
            <h2 className="text-xl text-warm-gray-600 mb-2">Abhi koi sale nahi hai</h2>
            <p className="text-warm-gray-400 mb-6">Check back soon for amazing deals!</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-warm-gray-900 text-white px-6 py-3 rounded-full font-medium"
            >
              Shop All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl text-warm-gray-900">
                Sale Items ({saleProducts.length})
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Why Buy Now */}
      <div className="bg-warm-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-xl p-6">
              <div className="text-3xl mb-2">🚚</div>
              <h3 className="font-semibold text-warm-gray-900">Free Delivery</h3>
              <p className="text-sm text-warm-gray-500">Orders Rs. 5,000+ par</p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="text-3xl mb-2">💵</div>
              <h3 className="font-semibold text-warm-gray-900">Cash on Delivery</h3>
              <p className="text-sm text-warm-gray-500">Ghar par payment karein</p>
            </div>
            <div className="bg-white rounded-xl p-6">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-semibold text-warm-gray-900">Easy Returns</h3>
              <p className="text-sm text-warm-gray-500">7 din return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
