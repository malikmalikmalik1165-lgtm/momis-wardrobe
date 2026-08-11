"use client";

import Link from "next/link";
import { BookOpen, MessageCircle, Play, Star, ArrowRight, CheckCircle, Users, TrendingUp, Target, Zap } from "lucide-react";

const COURSES = [
  {
    id: "whatsapp", icon: "💬", name: "WhatsApp Marketing", level: "Beginner",
    desc: "WhatsApp status, groups aur broadcast se customers tak pohunchein", lessons: 8, color: "from-green-500 to-emerald-600",
  },
  {
    id: "facebook", icon: "📘", name: "Facebook Marketing", level: "Beginner",
    desc: "Facebook page, groups, marketplace aur ads se sales badhayein", lessons: 10, color: "from-blue-500 to-blue-700",
  },
  {
    id: "instagram", icon: "📸", name: "Instagram Marketing", level: "Intermediate",
    desc: "Reels, stories, posts aur hashtags se followers aur sales badhayein", lessons: 9, color: "from-pink-500 to-purple-600",
  },
  {
    id: "tiktok", icon: "🎵", name: "TikTok Marketing", level: "Intermediate",
    desc: "Short videos se viral hone ka tareeqa aur products promote karna", lessons: 7, color: "from-gray-900 to-gray-700",
  },
  {
    id: "snapchat", icon: "👻", name: "Snapchat Marketing", level: "Advanced",
    desc: "Snapchat stories aur spotlight se young audience tak pohunchein", lessons: 5, color: "from-yellow-400 to-amber-500",
  },
  {
    id: "general", icon: "🎓", name: "Complete Reselling Guide", level: "All Levels",
    desc: "A to Z reselling business — zero se shuru karke pro level tak", lessons: 12, color: "from-rose-500 to-pink-600",
  },
];

export default function TrainingPage() {
  return (
    <div className="pt-[calc(2rem+3.5rem)] sm:pt-[calc(2rem+5.5rem)]">
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-rose-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={20} className="text-purple-300" />
              <span className="text-purple-300 text-xs tracking-widest uppercase">Momis Academy</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Social Media<br /><em className="text-rose-300">Marketing</em> Course
            </h1>
            <p className="text-purple-200 text-lg mb-8">
              Beginner se Pro level tak — har platform ka complete guide. Apna reselling business grow karein!
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              {[
                { icon: <Play size={14} />, text: "50+ Lessons" },
                { icon: <Star size={14} />, text: "Beginner Friendly" },
                { icon: <Users size={14} />, text: "Free for Team" },
              ].map((b) => (
                <span key={b.text} className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">{b.icon} {b.text}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl font-bold text-warm-gray-900 mb-6">Choose Your Course</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COURSES.map((c) => (
            <Link key={c.id} href={`/training/${c.id}`}
              className="group bg-white rounded-xl border border-warm-gray-100 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
              <div className={`bg-gradient-to-r ${c.color} p-5 text-white`}>
                <span className="text-3xl">{c.icon}</span>
                <h3 className="text-lg font-bold mt-2">{c.name}</h3>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{c.level}</span>
              </div>
              <div className="p-4">
                <p className="text-sm text-warm-gray-600 mb-3">{c.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-warm-gray-400">{c.lessons} Lessons</span>
                  <span className="text-xs text-rose-500 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Start <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
