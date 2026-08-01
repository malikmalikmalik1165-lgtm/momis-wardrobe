import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { products, reviews, categories } from "@/db/schema";
import { eq, desc, sql, inArray } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Truck, Shield, RotateCcw, Sparkles, MessageCircle } from "lucide-react";

export const dynamic = "force-dynamic";

async function getData() {
  const allCategories = await db.select().from(categories);
  const featuredProducts = await db
    .select()
    .from(products)
    .where(eq(products.featured, true))
    .orderBy(desc(products.createdAt))
    .limit(8);

  const productIds = featuredProducts.map((p) => p.id);
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

  const catMap = new Map(allCategories.map((c) => [c.id, c.name]));

  const enrichedProducts = featuredProducts.map((p) => ({
    ...p,
    averageRating: statsMap.get(p.id)?.avg || 0,
    reviewCount: statsMap.get(p.id)?.count || 0,
    categoryName: p.categoryId ? catMap.get(p.categoryId) || "" : "",
  }));

  return { categories: allCategories, featuredProducts: enrichedProducts };
}

export default async function HomePage() {
  const { categories: cats, featuredProducts } = await getData();

  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-warm-gray-900">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/19092930/pexels-photo-19092930.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=2000"
            alt="Fashion boutique"
            fill
            className="object-cover opacity-40"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-warm-gray-900/90 via-warm-gray-900/60 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <span className="inline-block text-rose-300 text-sm tracking-[0.3em] uppercase mb-4">
              New Collection 2025
            </span>
            <h1
              className="font-serif text-4xl sm:text-5xl lg:text-7xl text-white leading-[1.1] mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Elegance
              <br />
              Redefined<span className="text-rose-400">.</span>
            </h1>
            <p className="text-warm-gray-300 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
              Discover our curated collection of timeless pieces designed for the
              modern woman. Where sophistication meets style.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-white text-warm-gray-900 px-8 py-4 text-sm tracking-wider uppercase font-medium hover:bg-rose-50 transition-colors"
              >
                Shop Collection
                <ArrowRight size={16} />
              </Link>
              <a
                href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 text-sm tracking-wider uppercase font-medium hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={16} />
                Join Our Community
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-white border-b border-warm-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Truck size={20} />,
                title: "Free Shipping",
                desc: "On orders over Rs. 15,000",
              },
              {
                icon: <RotateCcw size={20} />,
                title: "Easy Returns",
                desc: "30-day return policy",
              },
              {
                icon: <Shield size={20} />,
                title: "Secure Payment",
                desc: "100% protected checkout",
              },
              {
                icon: <Sparkles size={20} />,
                title: "Premium Quality",
                desc: "Handpicked materials",
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="text-rose-400">{item.icon}</div>
                <div>
                  <p className="text-xs font-semibold text-warm-gray-800 uppercase tracking-wider">
                    {item.title}
                  </p>
                  <p className="text-xs text-warm-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <span className="text-rose-500 text-xs tracking-[0.3em] uppercase">
            Explore
          </span>
          <h2
            className="font-serif text-3xl sm:text-4xl text-warm-gray-900 mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cats.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-serif text-xl text-white mb-1">
                  {cat.name}
                </h3>
                <p className="text-warm-gray-300 text-xs">
                  {cat.description}
                </p>
                <span className="inline-flex items-center gap-1 text-white text-xs mt-3 group-hover:gap-2 transition-all">
                  Shop Now <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-rose-500 text-xs tracking-[0.3em] uppercase">
                Curated for You
              </span>
              <h2
                className="font-serif text-3xl sm:text-4xl text-warm-gray-900 mt-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Featured Collection
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-warm-gray-600 hover:text-warm-gray-900 transition-colors"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-warm-gray-900 text-white px-8 py-3 text-sm tracking-wider uppercase"
            >
              View All Products
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <Image
              src="https://images.pexels.com/photos/17559253/pexels-photo-17559253.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900"
              alt="Elegant fashion"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="lg:pl-12">
            <span className="text-rose-500 text-xs tracking-[0.3em] uppercase">
              Our Story
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl text-warm-gray-900 mt-3 mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Fashion That
              <br />
              Speaks to You
            </h2>
            <p className="text-warm-gray-500 leading-relaxed mb-6">
              At Momis Wardrobe, we believe every woman deserves to feel
              confident and beautiful. Our curated collection brings together
              timeless elegance and contemporary style, with each piece
              carefully selected for its quality and craftsmanship.
            </p>
            <p className="text-warm-gray-500 leading-relaxed mb-8">
              From luxurious evening gowns to everyday essentials, we dress
              the modern woman for every chapter of her life. Join our
              community of style-conscious women who value quality over
              quantity.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-warm-gray-900 text-white px-8 py-3.5 text-sm tracking-wider uppercase hover:bg-warm-gray-800 transition-colors"
              >
                Explore Collection
                <ArrowRight size={14} />
              </Link>
              <a
                href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-green-500 text-green-600 px-8 py-3.5 text-sm tracking-wider uppercase hover:bg-green-50 transition-colors"
              >
                <MessageCircle size={14} />
                WhatsApp Community
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-green-50 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle size={28} className="text-white" />
          </div>
          <h2
            className="font-serif text-3xl sm:text-4xl text-warm-gray-900 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Join Our Exclusive Community
          </h2>
          <p className="text-warm-gray-500 text-lg max-w-2xl mx-auto mb-8">
            Get early access to new arrivals, exclusive discounts, styling tips,
            and connect with fellow fashion lovers on WhatsApp.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-10 py-4 rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
            >
              <MessageCircle size={18} />
              Join WhatsApp Community
            </a>
          </div>
          <p className="text-xs text-warm-gray-400 mt-4">
            🔒 Private community · No spam · Leave anytime
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-rose-500 text-xs tracking-[0.3em] uppercase">
              What They Say
            </span>
            <h2
              className="font-serif text-3xl sm:text-4xl text-warm-gray-900 mt-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Loved by Women Everywhere
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                text: "Momis Wardrobe has completely transformed my wardrobe. The quality of every piece is incredible, and I always receive compliments!",
                rating: 5,
              },
              {
                name: "Emily R.",
                text: "Finally found a fashion brand that understands elegant style. The silk evening gown was absolutely stunning. Will be ordering more!",
                rating: 5,
              },
              {
                name: "Olivia K.",
                text: "The customer service is exceptional, and the pieces are beautifully crafted. Momis Wardrobe is now my go-to for special occasions.",
                rating: 5,
              },
            ].map((review) => (
              <div
                key={review.name}
                className="bg-warm-gray-50 rounded-2xl p-8 flex flex-col"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} className="text-gold-400 text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-warm-gray-600 leading-relaxed flex-1 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-6 pt-4 border-t border-warm-gray-200">
                  <p className="text-sm font-semibold text-warm-gray-900">
                    {review.name}
                  </p>
                  <p className="text-xs text-warm-gray-400">Verified Buyer</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
