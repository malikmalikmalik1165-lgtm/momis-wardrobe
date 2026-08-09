"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight, User, Tag } from "lucide-react";

const BLOGS = [
  {
    id: 1, slug: "summer-lawn-trends-2025",
    title: "Summer Lawn Trends 2026 — Kya Pehnein Is Season?",
    excerpt: "Is saal ke hottest lawn trends jaanein. Digital prints, pastel shades, aur embroidered borders — sab kuch yahan.",
    image: "https://images.pexels.com/photos/36567522/pexels-photo-36567522.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",
    category: "Fashion Trends", author: "Momis Team", date: "Jan 15, 2026", readTime: "3 min",
  },
  {
    id: 2, slug: "how-to-style-pakistani-suits",
    title: "Pakistani Suits Ko Style Karne Ke 7 Tareeqe",
    excerpt: "Ek hi suit ko different ways mein style karein — office, party, casual sab ke liye tips.",
    image: "https://images.pexels.com/photos/31874448/pexels-photo-31874448.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",
    category: "Style Guide", author: "Momis Team", date: "Jan 10, 2026", readTime: "5 min",
  },
  {
    id: 3, slug: "earn-from-home-reselling",
    title: "Ghar Baithay Paise Kamayein — Reselling Guide 2026",
    excerpt: "Zero investment se online business shuru karein. Step by step complete guide for Pakistani women.",
    image: "https://images.pexels.com/photos/7290640/pexels-photo-7290640.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",
    category: "Earning", author: "Momis Team", date: "Jan 5, 2026", readTime: "4 min",
  },
  {
    id: 4, slug: "skincare-routine-for-pakistani-women",
    title: "Pakistani Climate Ke Liye Best Skincare Routine",
    excerpt: "Garmi mein skin care kaise karein? Budget-friendly products aur daily routine tips.",
    image: "https://images.pexels.com/photos/8990700/pexels-photo-8990700.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",
    category: "Beauty", author: "Momis Team", date: "Dec 28, 2025", readTime: "4 min",
  },
  {
    id: 5, slug: "14-august-outfit-ideas",
    title: "14 August Outfit Ideas — Azaadi Day Style Guide 🇵🇰",
    excerpt: "Independence Day par kya pehnen? Green & white styling ideas for the whole family.",
    image: "https://images.pexels.com/photos/28837083/pexels-photo-28837083.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",
    category: "Occasions", author: "Momis Team", date: "Dec 20, 2025", readTime: "3 min",
  },
  {
    id: 6, slug: "handbag-guide-for-every-occasion",
    title: "Har Occasion Ke Liye Perfect Handbag Kaise Chunein",
    excerpt: "Office, party, casual outing — har event ke liye sahi bag select karna seekhein.",
    image: "https://images.pexels.com/photos/18601568/pexels-photo-18601568.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=900",
    category: "Style Guide", author: "Momis Team", date: "Dec 15, 2025", readTime: "3 min",
  },
];

export default function BlogPage() {
  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5.5rem)]">
      <div className="bg-white border-b border-warm-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <h1 className="font-serif text-3xl sm:text-4xl text-warm-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>Blog</h1>
          <p className="text-warm-gray-500 mt-2">Fashion tips, style guides, earning ideas aur bohot kuch</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Featured */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <Link href={`/blog/${BLOGS[0].slug}`} className="group relative aspect-[16/10] rounded-2xl overflow-hidden">
            <Image src={BLOGS[0].image} alt={BLOGS[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="bg-rose-500 text-white text-[10px] px-2 py-1 rounded font-semibold uppercase">{BLOGS[0].category}</span>
              <h2 className="text-white text-xl sm:text-2xl font-bold mt-2 leading-tight">{BLOGS[0].title}</h2>
              <p className="text-white/70 text-sm mt-2 line-clamp-2">{BLOGS[0].excerpt}</p>
            </div>
          </Link>

          <div className="grid grid-cols-1 gap-4">
            {BLOGS.slice(1, 3).map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="group flex gap-4 bg-white rounded-xl border border-warm-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative w-32 sm:w-40 flex-shrink-0">
                  <Image src={blog.image} alt={blog.title} fill className="object-cover" sizes="160px" />
                </div>
                <div className="p-3 flex flex-col justify-center">
                  <span className="text-rose-500 text-[10px] font-semibold uppercase">{blog.category}</span>
                  <h3 className="text-sm font-bold text-warm-gray-900 mt-1 line-clamp-2 group-hover:text-rose-600 transition-colors">{blog.title}</h3>
                  <p className="text-xs text-warm-gray-400 mt-2 flex items-center gap-2"><Clock size={10} /> {blog.readTime} read</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Grid */}
        <h2 className="font-bold text-warm-gray-900 text-lg mb-6">Latest Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {BLOGS.slice(2).map((blog) => (
            <Link key={blog.id} href={`/blog/${blog.slug}`} className="group bg-white rounded-xl border border-warm-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-[16/10]">
                <Image src={blog.image} alt={blog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="350px" />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-warm-gray-800 text-[10px] px-2 py-0.5 rounded font-semibold">{blog.category}</span>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-warm-gray-900 text-sm group-hover:text-rose-600 transition-colors line-clamp-2">{blog.title}</h3>
                <p className="text-xs text-warm-gray-500 mt-2 line-clamp-2">{blog.excerpt}</p>
                <div className="flex items-center justify-between mt-3 text-[10px] text-warm-gray-400">
                  <span className="flex items-center gap-1"><User size={10} /> {blog.author}</span>
                  <span>{blog.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
