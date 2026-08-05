import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { products, reviews, categories } from "@/db/schema";
import { eq, desc, sql, inArray } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Truck, Shield, RotateCcw, Sparkles, Star, Phone, MessageCircle, Banknote } from "lucide-react";

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

  const enrichedProducts = featuredProducts.map((p) => ({
    ...p,
    averageRating: statsMap.get(p.id)?.avg || 0,
    reviewCount: statsMap.get(p.id)?.count || 0,
  }));

  return { categories: allCategories, featuredProducts: enrichedProducts };
}

export default async function HomePage() {
  const { categories: cats, featuredProducts } = await getData();

  return (
    <div className="pt-[calc(2.5rem+3.5rem)] sm:pt-[calc(2.5rem+4rem)]">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-warm-gray-900 min-h-[85vh] sm:min-h-[90vh] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/20777181/pexels-photo-20777181.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=2000"
            alt="Fashion"
            fill
            className="object-cover opacity-30 scale-105"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-warm-gray-900/95 via-warm-gray-900/70 to-warm-gray-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-gray-900/80 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-0 w-full">
          <div className="max-w-2xl">
            {/* Premium label */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
              <span className="text-rose-300 text-xs tracking-[0.25em] uppercase font-medium">
                New Collection 2025
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-7xl text-white leading-[1.05] mb-6 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Where
              <br />
              <span className="italic text-rose-300">Elegance</span>
              <br />
              Meets You<span className="text-rose-400">.</span>
            </h1>

            <p className="text-warm-gray-400 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
              Premium women&apos;s fashion curated for the modern Pakistani woman. From lawn suits to luxury accessories — delivered to your doorstep.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="group inline-flex items-center gap-3 bg-white text-warm-gray-900 px-7 py-4 text-sm tracking-wider uppercase font-semibold hover:bg-rose-50 transition-all"
              >
                Shop Now
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://wa.me/923295578925?text=Assalam%20o%20Alaikum!%20Mujhe%20order%20karna%20hai."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-7 py-4 text-sm tracking-wider uppercase font-semibold hover:bg-green-600 transition-all"
              >
                <MessageCircle size={16} />
                WhatsApp Order
              </a>
            </div>

            {/* Trust micro-badges */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-10 text-warm-gray-500 text-xs">
              <span className="flex items-center gap-1.5"><Banknote size={14} className="text-green-400" /> Cash on Delivery</span>
              <span className="flex items-center gap-1.5"><Truck size={14} className="text-blue-400" /> All Pakistan Delivery</span>
              <span className="flex items-center gap-1.5"><RotateCcw size={14} className="text-rose-400" /> 7-Day Returns</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="bg-white border-b border-warm-gray-100 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Truck size={20} />, title: "Free Delivery", desc: "Rs. 5,000+ orders", color: "text-blue-500" },
              { icon: <Banknote size={20} />, title: "Cash on Delivery", desc: "Pay at your door", color: "text-green-500" },
              { icon: <RotateCcw size={20} />, title: "7-Day Returns", desc: "Easy exchange", color: "text-rose-500" },
              { icon: <Shield size={20} />, title: "Secure Shopping", desc: "Data encrypted", color: "text-purple-500" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className={`${item.color}`}>{item.icon}</div>
                <div>
                  <p className="text-xs font-bold text-warm-gray-800 tracking-wide">{item.title}</p>
                  <p className="text-[10px] text-warm-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-14">
          <span className="text-rose-500 text-[11px] tracking-[0.3em] uppercase font-medium">Explore</span>
          <h2
            className="text-3xl sm:text-4xl text-warm-gray-900 mt-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Shop by Category
          </h2>
          <div className="w-12 h-0.5 bg-rose-400 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {cats.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden luxury-card"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <h3 className="font-serif text-lg sm:text-xl text-white mb-0.5">{cat.name}</h3>
                <span className="inline-flex items-center gap-1 text-white/80 text-xs group-hover:gap-2 transition-all">
                  Shop Now <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-rose-500 text-[11px] tracking-[0.3em] uppercase font-medium">Curated</span>
              <h2
                className="text-3xl sm:text-4xl text-warm-gray-900 mt-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Featured Collection
              </h2>
              <div className="w-12 h-0.5 bg-rose-400 mt-4" />
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-2 text-sm text-warm-gray-600 hover:text-rose-500 transition-colors font-medium"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-10 text-center sm:hidden">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-warm-gray-900 text-white px-8 py-3.5 text-sm tracking-wider uppercase font-medium"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== EDITORIAL SPLIT ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-center">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden luxury-glow">
            <Image
              src="https://images.pexels.com/photos/31874448/pexels-photo-31874448.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900"
              alt="Elegant Pakistani fashion"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="lg:pl-10">
            <span className="text-rose-500 text-[11px] tracking-[0.3em] uppercase font-medium">Our Promise</span>
            <h2
              className="text-3xl sm:text-4xl text-warm-gray-900 mt-3 mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Fashion That<br />
              <span className="italic text-rose-500">Celebrates</span> You
            </h2>
            <div className="w-12 h-0.5 bg-rose-400 mb-6" />
            <p className="text-warm-gray-500 leading-relaxed mb-4">
              Momis Wardrobe mein hum har Pakistani woman ke liye affordable luxury laate hain. Chahe aap unstitched lawn dhoondhein ya ready-to-wear suits — humara collection aap ke liye curate kiya gaya hai.
            </p>
            <p className="text-warm-gray-500 leading-relaxed mb-8">
              Quality fabrics, trending designs, aur fast delivery ke saath hum aap ka fashion partner hain. Ab ghar baithay shopping karein aur Cash on Delivery par order karein!
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { num: "5K+", label: "Customers" },
                { num: "500+", label: "Products" },
                { num: "4.8★", label: "Rating" },
              ].map((s) => (
                <div key={s.label} className="text-center p-3 bg-warm-gray-50 rounded-xl">
                  <p className="text-xl font-bold text-warm-gray-900">{s.num}</p>
                  <p className="text-[10px] text-warm-gray-400 uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-warm-gray-900 text-white px-7 py-3.5 text-sm tracking-wider uppercase font-medium hover:bg-warm-gray-800 transition-colors"
              >
                Shop Now <ArrowRight size={14} />
              </Link>
              <a
                href="https://wa.me/923295578925"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-2 border-green-500 text-green-600 px-7 py-3.5 text-sm tracking-wider uppercase font-medium hover:bg-green-50 transition-colors"
              >
                <Phone size={14} /> 03295578925
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== REVIEWS ===== */}
      <section className="bg-warm-gray-900 text-white py-16 sm:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-rose-400 text-[11px] tracking-[0.3em] uppercase font-medium">Testimonials</span>
            <h2
              className="text-3xl sm:text-4xl text-white mt-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Loved by <span className="italic text-rose-300">Thousands</span>
            </h2>
            <div className="w-12 h-0.5 bg-rose-400 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Fatima A.", city: "Lahore", text: "Best quality! Maine 3 suits liye aur sab amazing hain. Fabric itna soft hai, highly recommend! ❤️" },
              { name: "Ayesha K.", city: "Karachi", text: "COD available hai jo bohot convenient hai. Packaging bhi premium thi aur delivery fast. Will order again!" },
              { name: "Sana M.", city: "Islamabad", text: "WhatsApp par bohot helpful hain. Size guide follow kiya aur perfect fit aayi. Love Momis Wardrobe! 🥰" },
            ].map((review) => (
              <div key={review.name} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8">
                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={14} className="fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <p className="text-warm-gray-300 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-300 font-bold text-sm">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{review.name}</p>
                    <p className="text-[10px] text-warm-gray-500">{review.city} • Verified Buyer ✓</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center relative z-10">
            <Sparkles className="mx-auto text-white/50 mb-4" size={28} />
            <h2
              className="text-3xl sm:text-4xl text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ready to <span className="italic">Elevate</span> Your Style?
            </h2>
            <p className="text-rose-100 text-lg mb-8 max-w-xl mx-auto">
              Order karein WhatsApp par ya website se. Cash on Delivery ke saath all Pakistan delivery!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-full text-sm font-bold tracking-wider uppercase hover:bg-rose-50 transition-colors shadow-xl"
              >
                Shop Collection <ArrowRight size={16} />
              </Link>
              <a
                href="https://wa.me/923295578925"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full text-sm font-bold tracking-wider uppercase hover:bg-green-600 transition-colors shadow-xl"
              >
                <MessageCircle size={16} /> WhatsApp Order
              </a>
            </div>
            <p className="text-white/60 text-xs mt-6">
              📞 Call: 03295578925 • 🚚 Free delivery Rs. 5,000+ • 💵 COD Available
            </p>
          </div>
        </div>
      </section>

      {/* ===== COMMUNITY ===== */}
      <section className="bg-green-50 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <MessageCircle className="mx-auto text-green-500 mb-4" size={32} />
          <h2
            className="text-2xl sm:text-3xl text-warm-gray-900 mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Join Our WhatsApp Community
          </h2>
          <p className="text-warm-gray-500 mb-6">
            New arrivals, exclusive discounts aur styling tips — sab se pehle aap ko milega!
          </p>
          <a
            href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-4 rounded-full text-sm font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-200"
          >
            <MessageCircle size={18} /> Join Community
          </a>
        </div>
      </section>
    </div>
  );
}
