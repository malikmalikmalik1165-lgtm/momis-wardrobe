"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, User, Share2, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";

const BLOG_CONTENT: Record<string, { title: string; category: string; date: string; readTime: string; image: string; content: string[] }> = {
  "summer-lawn-trends-2025": {
    title: "Summer Lawn Trends 2025 — Kya Pehnein Is Season?",
    category: "Fashion Trends", date: "Jul 28, 2025", readTime: "3 min",
    image: "https://images.pexels.com/photos/36567522/pexels-photo-36567522.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
    content: [
      "Is saal ka summer lawn season bohot exciting hai! Digital prints se le kar hand-embroidered borders tak, har kisi ke liye kuch na kuch hai.",
      "2025 mein pastel shades bohot trend kar rahe hain — lavender, mint green, aur soft pink. Ye colors garmi mein cool feel dete hain aur elegant bhi lagte hain.",
      "Fabric ki baat karein to pure lawn sabse zyada demand mein hai kyunke breathable hai aur comfortable bhi. Blended fabrics bhi popular hain jo wrinkle-free rehte hain.",
      "Embroidery mein minimalist designs trend kar rahe hain — subtle neckline embroidery aur border work. Heavy embroidery ki jagah clean aur classy look prefer ho raha hai.",
      "Dupatta trends mein chiffon aur organza top par hain. Printed dupattas bhi bohot chal rahe hain jo plain suits ke saath pair karein to bohot acha lagta hai.",
      "Momis Wardrobe par latest lawn collection available hai — unstitched aur stitched dono. Check karein /shop par!",
    ],
  },
  "how-to-style-pakistani-suits": {
    title: "Pakistani Suits Ko Style Karne Ke 7 Tareeqe",
    category: "Style Guide", date: "Jul 20, 2025", readTime: "5 min",
    image: "https://images.pexels.com/photos/31874448/pexels-photo-31874448.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
    content: [
      "Ek acha suit multiple ways mein style ho sakta hai. Yahan 7 tareeqe hain jo aap try kar sakte hain:",
      "1. Belt Add Karein — Loose kameez par leather ya fabric belt lagayein. Instantly modern aur fitted look aata hai.",
      "2. Dupatta Styling — Dupatta ko different ways mein drape karein. One shoulder, wrapped, ya as a scarf — har style alag feel deta hai.",
      "3. Statement Jewellery — Simple suit ke saath statement earrings ya chunky necklace lagayein. Suit ko dress-up kar dega.",
      "4. Contrast Trouser — Matching trouser ki jagah contrast color try karein. White trouser almost har suit ke saath acha lagta hai.",
      "5. Layer with Jacket — Short jacket ya waistcoat layer karein suit ke upar. Formal events ke liye perfect hai.",
      "6. Footwear Game — Khussay traditional look ke liye, heels formal ke liye, aur sneakers casual ke liye. Shoes poora look change kar dete hain.",
      "7. Handbag Match — Suit ke saath matching ya contrasting handbag carry karein. Momis Wardrobe par bags collection dekhen!",
    ],
  },
  "earn-from-home-reselling": {
    title: "Ghar Baithay Paise Kamayein — Reselling Guide 2025",
    category: "Earning", date: "Jul 15, 2025", readTime: "4 min",
    image: "https://images.pexels.com/photos/7290640/pexels-photo-7290640.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1400",
    content: [
      "Kya aap ghar baithay earning karna chahte hain? Momis Wardrobe ka reseller program aap ke liye hai!",
      "Step 1: Team Portal par register karein (/team). Bilkul FREE hai, koi investment nahi.",
      "Step 2: Apna unique referral code milega. Ye code aap ki identity hai.",
      "Step 3: Products browse karein aur jo pasand aayein unhe WhatsApp, Facebook, Instagram par share karein.",
      "Step 4: Jab koi customer aap ke through order karega aur checkout mein aap ka code dalega, aap ko 10-20% commission milega!",
      "Pro Tips: Daily 5-10 products WhatsApp status par lagayein. Sale items zyada bechte hain. Customer reviews share karein — trust barhta hai.",
      "Ab tak hazaron Pakistani women Momis Wardrobe se earn kar rahi hain. Aap bhi shuru karein — /team par jayein!",
    ],
  },
};

export default function BlogPost() {
  const params = useParams();
  const slug = params.slug as string;
  const blog = BLOG_CONTENT[slug];

  if (!blog) {
    return (
      <div className="pt-40 text-center min-h-screen">
        <h1 className="text-2xl text-warm-gray-900 mb-4">Blog post nahi mila</h1>
        <Link href="/blog" className="text-rose-500">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5.5rem)] min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-64 sm:h-96 bg-warm-gray-900">
        <Image src={blog.image} alt={blog.title} fill className="object-cover opacity-70" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10">
          <Link href="/blog" className="inline-flex items-center gap-1 text-xs text-warm-gray-400 hover:text-rose-500 mb-4"><ArrowLeft size={14} /> Back to Blog</Link>
          <span className="bg-rose-100 text-rose-600 text-[10px] px-2 py-1 rounded font-semibold uppercase">{blog.category}</span>
          <h1 className="font-serif text-2xl sm:text-3xl text-warm-gray-900 mt-3 mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{blog.title}</h1>
          <div className="flex items-center gap-4 text-xs text-warm-gray-400 mb-8 pb-6 border-b border-warm-gray-100">
            <span className="flex items-center gap-1"><User size={12} /> Momis Team</span>
            <span>{blog.date}</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {blog.readTime} read</span>
          </div>

          <div className="prose prose-sm max-w-none">
            {blog.content.map((p, i) => (
              <p key={i} className="text-warm-gray-600 leading-relaxed mb-4">{p}</p>
            ))}
          </div>

          {/* Share */}
          <div className="mt-10 pt-6 border-t border-warm-gray-100 flex flex-wrap gap-3">
            <a href={`https://wa.me/?text=${encodeURIComponent(`${blog.title}\n\nmomis-wardrobe-vert.vercel.app/blog/${slug}`)}`}
              target="_blank" className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600">
              <MessageCircle size={14} /> Share on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="h-20" />
    </div>
  );
}
