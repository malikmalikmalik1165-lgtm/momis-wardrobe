import Link from "next/link";
import Image from "next/image";
import { db } from "@/db";
import { products, reviews, categories } from "@/db/schema";
import { eq, desc, sql, inArray } from "drizzle-orm";
import ProductCard from "@/components/ProductCard";
import { ArrowRight, Truck, Shield, RotateCcw, Banknote, Star, MessageCircle, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

async function getData() {
  const allCategories = await db.select().from(categories);
  const featuredProducts = await db.select().from(products)
    .where(eq(products.featured, true)).orderBy(desc(products.createdAt)).limit(8);
  const productIds = featuredProducts.map((p) => p.id);
  let reviewStats: { productId: number; avg: string; count: string }[] = [];
  if (productIds.length > 0) {
    reviewStats = await db.select({
      productId: reviews.productId,
      avg: sql<string>`ROUND(AVG(${reviews.rating})::numeric, 1)`,
      count: sql<string>`COUNT(*)`,
    }).from(reviews).where(inArray(reviews.productId, productIds)).groupBy(reviews.productId);
  }
  const statsMap = new Map(reviewStats.map((s) => [s.productId, { avg: parseFloat(s.avg), count: parseInt(s.count) }]));
  return {
    categories: allCategories,
    featuredProducts: featuredProducts.map((p) => ({
      ...p, averageRating: statsMap.get(p.id)?.avg || 0, reviewCount: statsMap.get(p.id)?.count || 0,
    })),
  };
}

export default async function HomePage() {
  const { categories: cats, featuredProducts } = await getData();

  return (
    <div className="pt-[calc(2rem+3.5rem)] sm:pt-[calc(2rem+5.5rem)]">

      {/* ══════ HERO ══════ */}
      <section className="relative bg-warm-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.pexels.com/photos/20777181/pexels-photo-20777181.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1400&w=2000"
            alt="" fill className="object-cover opacity-25" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-warm-gray-900 via-warm-gray-900/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-warm-gray-900 via-transparent to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32 lg:py-40">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-pulse" />
              <span className="text-rose-300/90 text-[11px] tracking-[.2em] uppercase">New Collection 2026</span>
            </div>

            <h1 className="text-[2.75rem] sm:text-6xl lg:text-[5.25rem] text-white leading-[1.05] tracking-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Where<br /><em className="text-rose-300">Elegance</em><br />Meets You.
            </h1>

            <p className="text-warm-gray-400 text-[15px] sm:text-lg leading-relaxed mb-10 max-w-md">
              Premium women&apos;s fashion curated for the modern Pakistani woman — delivered to your door with cash on delivery.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-white text-warm-gray-900 h-13 px-8 text-sm font-semibold tracking-wide uppercase hover:bg-rose-50 transition-colors">
                Shop Now <ArrowRight size={15} />
              </Link>
              <a href="https://wa.me/923295578925" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500/90 text-white h-13 px-8 text-sm font-semibold tracking-wide uppercase hover:bg-green-500 transition-colors">
                <MessageCircle size={15} /> WhatsApp Order
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ TRUST STRIP ══════ */}
      <section className="bg-white border-b border-warm-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-3 gap-x-6">
            {[
              { icon: <Truck size={18}/>, label: "Free Delivery 5K+", color: "text-blue-500" },
              { icon: <Banknote size={18}/>, label: "Cash on Delivery", color: "text-green-500" },
              { icon: <RotateCcw size={18}/>, label: "7-Day Returns", color: "text-rose-500" },
              { icon: <Shield size={18}/>, label: "Secure Shopping", color: "text-purple-500" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2.5">
                <span className={t.color}>{t.icon}</span>
                <span className="text-[12px] font-semibold text-warm-gray-700 tracking-wide">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CATEGORIES ══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="text-center mb-10">
          <p className="text-rose-500 text-[11px] tracking-[.25em] uppercase font-medium">Explore</p>
          <h2 className="text-2xl sm:text-3xl text-warm-gray-900 mt-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>Shop by Category</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {cats.slice(0, 8).map((cat) => (
            <Link key={cat.id} href={`/shop?category=${cat.slug}`}
              className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-warm-gray-100">
              {cat.image && <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width:640px) 50vw,25vw" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-4">
                <h3 className="text-white font-semibold text-[15px]">{cat.name}</h3>
                <span className="text-white/60 text-[11px] flex items-center gap-1 mt-0.5 group-hover:gap-2 transition-all">Shop <ArrowRight size={11}/></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════ FEATURED PRODUCTS ══════ */}
      <section className="bg-white py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-rose-500 text-[11px] tracking-[.25em] uppercase font-medium">Curated</p>
              <h2 className="text-2xl sm:text-3xl text-warm-gray-900 mt-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>Featured Collection</h2>
            </div>
            <Link href="/shop" className="hidden sm:flex items-center gap-1.5 text-sm text-warm-gray-500 hover:text-rose-500 transition-colors font-medium">
              View All <ArrowRight size={14}/>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/shop" className="inline-flex items-center gap-2 bg-warm-gray-900 text-white px-7 py-3 text-sm font-semibold uppercase tracking-wide">
              View All <ArrowRight size={14}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ EDITORIAL ══════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
            <Image src="https://images.pexels.com/photos/31874448/pexels-photo-31874448.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=900"
              alt="Pakistani fashion" fill className="object-cover" sizes="(max-width:1024px) 100vw,50vw" />
          </div>
          <div className="lg:pl-8">
            <p className="text-rose-500 text-[11px] tracking-[.25em] uppercase font-medium">Our Promise</p>
            <h2 className="text-3xl sm:text-4xl text-warm-gray-900 mt-2 mb-6 leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
              Fashion That<br /><em className="text-rose-400">Celebrates</em> You
            </h2>
            <p className="text-warm-gray-500 leading-relaxed mb-4 text-[15px]">
              Momis Wardrobe mein hum har Pakistani woman ke liye affordable luxury laate hain. Quality fabrics, trending designs, aur fast delivery ke saath.
            </p>
            <p className="text-warm-gray-500 leading-relaxed mb-8 text-[15px]">
              Chahe aap unstitched lawn dhoondhein ya ready-to-wear — humara curated collection aap ke liye hai. Ab ghar baithay shopping karein!
            </p>

            <div className="grid grid-cols-3 gap-3 mb-8">
              {[{ n: "5K+", l: "Customers" }, { n: "500+", l: "Products" }, { n: "4.8★", l: "Rating" }].map((s) => (
                <div key={s.l} className="bg-warm-gray-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-warm-gray-900">{s.n}</p>
                  <p className="text-[9px] text-warm-gray-400 uppercase tracking-wider">{s.l}</p>
                </div>
              ))}
            </div>

            <Link href="/shop" className="inline-flex items-center gap-2 bg-warm-gray-900 text-white px-7 py-3.5 text-sm font-semibold uppercase tracking-wide hover:bg-warm-gray-800 transition-colors">
              Shop Now <ArrowRight size={14}/>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ REVIEWS ══════ */}
      <section className="bg-warm-gray-900 py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <p className="text-rose-400 text-[11px] tracking-[.25em] uppercase font-medium">Testimonials</p>
            <h2 className="text-2xl sm:text-3xl text-white mt-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>
              Loved by <em className="text-rose-300">Thousands</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: "Fatima A.", city: "Lahore", text: "Best quality! 3 suits liye, sab amazing. Fabric bohot soft hai. ❤️" },
              { name: "Ayesha K.", city: "Karachi", text: "COD available — bohot convenient. Packaging premium thi. Will order again!" },
              { name: "Sana M.", city: "Islamabad", text: "WhatsApp par size guide follow kiya, perfect fit aayi. Love it! 🥰" },
            ].map((r) => (
              <div key={r.name} className="bg-white/[.06] border border-white/10 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map((i) => <Star key={i} size={13} className="fill-amber-400 text-amber-400"/>)}</div>
                <p className="text-warm-gray-300 text-sm leading-relaxed mb-5 italic">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-rose-500/20 rounded-full flex items-center justify-center text-rose-300 font-bold text-xs">{r.name[0]}</div>
                  <div>
                    <p className="text-white text-sm font-medium">{r.name}</p>
                    <p className="text-warm-gray-500 text-[10px]">{r.city} · Verified ✓</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ CTA ══════ */}
      <section className="bg-gradient-to-r from-rose-500 to-pink-500 py-14 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <Sparkles className="mx-auto text-white/40 mb-3" size={24}/>
          <h2 className="text-2xl sm:text-3xl text-white mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to <em>Elevate</em> Your Style?
          </h2>
          <p className="text-rose-100 mb-8 max-w-lg mx-auto text-[15px]">
            Order karein website se ya WhatsApp par. Cash on Delivery ke saath all Pakistan delivery!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="inline-flex items-center justify-center gap-2 bg-white text-rose-600 h-12 px-8 rounded-full text-sm font-bold uppercase tracking-wide hover:bg-rose-50 transition-colors">
              Shop Collection <ArrowRight size={15}/>
            </Link>
            <a href="https://wa.me/923295578925" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white/20 text-white h-12 px-8 rounded-full text-sm font-bold uppercase tracking-wide hover:bg-white/30 transition-colors border border-white/30">
              <MessageCircle size={15}/> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
