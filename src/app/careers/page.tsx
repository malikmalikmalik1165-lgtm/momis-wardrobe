"use client";

import Link from "next/link";
import { Briefcase, MapPin, Clock, ArrowRight, Users, Zap, Heart, Star, MessageCircle, Building } from "lucide-react";

const JOBS = [
  { id: 1, title: "Social Media Manager", dept: "Marketing", location: "Remote", type: "Full-time", desc: "Social media platforms manage karein — content creation, posting, engagement aur growth strategy." },
  { id: 2, title: "Customer Support Executive", dept: "Support", location: "Remote", type: "Full-time", desc: "WhatsApp aur calls par customers ki help karein — orders, queries, returns handle karein." },
  { id: 3, title: "Content Writer (Urdu/English)", dept: "Marketing", location: "Remote", type: "Part-time", desc: "Blog posts, product descriptions, social media captions likhein — bilingual content." },
  { id: 4, title: "Graphic Designer", dept: "Creative", location: "Remote", type: "Freelance", desc: "Product images, social media posts, banners aur promotional material design karein." },
  { id: 5, title: "Team Leader — Reseller Network", dept: "Sales", location: "All Pakistan", type: "Commission", desc: "Reseller team build aur manage karein. Training dein aur sales targets achieve karein." },
  { id: 6, title: "Operations Coordinator", dept: "Operations", location: "Lahore", type: "Full-time", desc: "Order processing, inventory management, courier coordination aur daily operations handle karein." },
];

export default function CareersPage() {
  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5.5rem)]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-warm-gray-900 to-warm-gray-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <span className="text-rose-400 text-xs tracking-widest uppercase">Careers</span>
            <h1 className="font-serif text-4xl sm:text-5xl mt-3 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Join Our <span className="italic text-rose-300">Growing</span> Team
            </h1>
            <p className="text-warm-gray-400 text-lg">
              Momis Wardrobe ke saath kaam karein aur Pakistani women&apos;s fashion industry mein apna career banayein.
            </p>
          </div>
        </div>
      </div>

      {/* Why Join */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="font-serif text-2xl text-warm-gray-900 mb-8 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Kyun Join Karein Momis Wardrobe?</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Zap className="text-amber-500" size={24} />, title: "Fast Growth", desc: "Rapidly growing e-commerce brand" },
            { icon: <Heart className="text-rose-500" size={24} />, title: "Great Culture", desc: "Supportive aur friendly team" },
            { icon: <MapPin className="text-blue-500" size={24} />, title: "Remote Friendly", desc: "Ghar se kaam karein" },
            { icon: <Star className="text-purple-500" size={24} />, title: "Learn & Grow", desc: "Skills develop karne ka mauka" },
          ].map((b) => (
            <div key={b.title} className="bg-white rounded-xl border border-warm-gray-100 p-5 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-warm-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">{b.icon}</div>
              <h3 className="font-bold text-warm-gray-900 text-sm">{b.title}</h3>
              <p className="text-xs text-warm-gray-500 mt-1">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div className="bg-warm-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl text-warm-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Open Positions</h2>
          <p className="text-warm-gray-500 text-sm mb-8">{JOBS.length} positions available</p>

          <div className="space-y-3">
            {JOBS.map((job) => (
              <a key={job.id}
                href={`https://wa.me/923295578925?text=${encodeURIComponent(`Assalam o Alaikum! Mujhe "${job.title}" position ke liye apply karna hai.\n\nMera naam: \nCity: \nExperience: `)}`}
                target="_blank" rel="noopener noreferrer"
                className="block bg-white rounded-xl border border-warm-gray-100 p-5 hover:shadow-lg hover:border-rose-200 transition-all group">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-warm-gray-900 group-hover:text-rose-600 transition-colors">{job.title}</h3>
                    <p className="text-sm text-warm-gray-500 mt-1">{job.desc}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="flex items-center gap-1 text-[10px] bg-warm-gray-100 text-warm-gray-600 px-2 py-1 rounded"><Building size={10} /> {job.dept}</span>
                      <span className="flex items-center gap-1 text-[10px] bg-warm-gray-100 text-warm-gray-600 px-2 py-1 rounded"><MapPin size={10} /> {job.location}</span>
                      <span className="flex items-center gap-1 text-[10px] bg-warm-gray-100 text-warm-gray-600 px-2 py-1 rounded"><Clock size={10} /> {job.type}</span>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-warm-gray-300 group-hover:text-rose-500 flex-shrink-0 mt-2 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h2 className="font-serif text-2xl text-warm-gray-900 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Position Nahi Mili?</h2>
        <p className="text-warm-gray-500 text-sm mb-6">Apna CV bhejein — jab opening ho to hum contact karenge!</p>
        <a href="https://wa.me/923295578925?text=Career%20inquiry%20-%20CV%20bhejna%20hai" target="_blank"
          className="inline-flex items-center gap-2 bg-warm-gray-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-warm-gray-800 transition-colors">
          <MessageCircle size={16} /> CV WhatsApp Par Bhejein
        </a>
      </div>
    </div>
  );
}
