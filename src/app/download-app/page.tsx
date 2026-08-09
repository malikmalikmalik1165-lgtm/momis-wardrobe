"use client";

import { Smartphone, Monitor, Download, Check, ArrowRight, MessageCircle, Star, Shield, Zap, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DownloadAppPage() {
  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5.5rem)]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-warm-gray-900 via-rose-900 to-pink-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-rose-300 text-xs tracking-widest uppercase">Free App</span>
              <h1 className="font-serif text-4xl sm:text-5xl mt-3 mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Momis Wardrobe <span className="italic text-rose-300">App</span>
              </h1>
              <p className="text-warm-gray-300 text-lg mb-6">
                Ab shopping aur bhi asaan! App install karein — fast, lightweight, aur offline bhi kaam kare.
              </p>
              <div className="flex items-center gap-1 mb-6">
                {[1,2,3,4,5].map((i) => <Star key={i} size={16} className="fill-amber-400 text-amber-400" />)}
                <span className="text-sm text-warm-gray-400 ml-2">4.8 Rating</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="/" className="inline-flex items-center gap-2 bg-white text-warm-gray-900 px-6 py-3.5 rounded-xl font-bold hover:bg-rose-50 transition-colors">
                  <Download size={18} /> Install Now — Free
                </a>
                <a href="https://wa.me/923295578925?text=App%20ka%20APK%20chahiye" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-green-600 transition-colors">
                  <MessageCircle size={18} /> APK WhatsApp Se Lein
                </a>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-56 h-96 bg-warm-gray-800 rounded-[2.5rem] border-4 border-warm-gray-700 overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-warm-gray-700 rounded-b-xl" />
                <div className="w-full h-full bg-cream p-3 pt-8">
                  <div className="bg-rose-500 rounded-xl p-3 text-white text-center mb-3">
                    <p className="font-serif font-bold text-sm">Momis Wardrobe</p>
                    <p className="text-[8px] text-rose-200">Women&apos;s Fashion</p>
                  </div>
                  <div className="space-y-2">
                    {[1,2,3].map((i) => (
                      <div key={i} className="bg-white rounded-lg p-2 flex gap-2 shadow-sm">
                        <div className="w-10 h-10 bg-warm-gray-100 rounded" />
                        <div className="flex-1"><div className="h-2 bg-warm-gray-200 rounded w-3/4 mb-1" /><div className="h-2 bg-rose-200 rounded w-1/2" /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="font-serif text-2xl text-warm-gray-900 text-center mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>App Kyun Install Karein?</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Zap className="text-amber-500" size={24} />, title: "Super Fast", desc: "Website se 3x fast loading" },
            { icon: <Bell className="text-rose-500" size={24} />, title: "Notifications", desc: "Sale aur deals ka turant pata" },
            { icon: <Shield className="text-green-500" size={24} />, title: "Safe & Secure", desc: "Data encrypted aur private" },
            { icon: <Download className="text-blue-500" size={24} />, title: "No Storage", desc: "Sirf 1MB — phone mein jagah nahi leta" },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-xl border border-warm-gray-100 p-5 text-center hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-warm-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">{f.icon}</div>
              <h3 className="font-bold text-warm-gray-900 text-sm">{f.title}</h3>
              <p className="text-xs text-warm-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Install Steps */}
      <div className="bg-warm-gray-50 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl text-warm-gray-900 text-center mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>Install Kaise Karein?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Android */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <Smartphone className="text-green-500" size={28} />
                <div>
                  <h3 className="font-bold text-warm-gray-900">Android Phone</h3>
                  <p className="text-xs text-warm-gray-500">Chrome browser se</p>
                </div>
              </div>
              <ol className="space-y-3">
                {[
                  "Chrome mein momis-wardrobe-vert.vercel.app kholein",
                  "Neeche \"Install\" popup aayega — tap karein",
                  "Ya: ⋮ Menu → \"Install app\" → \"Install\"",
                  "Done! Home screen par icon aa jayega ✅",
                ].map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-warm-gray-600">
                    <span className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            {/* iPhone */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <Smartphone className="text-blue-500" size={28} />
                <div>
                  <h3 className="font-bold text-warm-gray-900">iPhone / iPad</h3>
                  <p className="text-xs text-warm-gray-500">Safari browser se</p>
                </div>
              </div>
              <ol className="space-y-3">
                {[
                  "Safari mein website kholein",
                  "Share button (⬆️) tap karein",
                  "Scroll karein → \"Add to Home Screen\" select karein",
                  "\"Add\" tap karein — Done! ✅",
                ].map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-warm-gray-600">
                    <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            {/* Laptop/Desktop */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <Monitor className="text-purple-500" size={28} />
                <div>
                  <h3 className="font-bold text-warm-gray-900">Laptop / PC</h3>
                  <p className="text-xs text-warm-gray-500">Chrome / Edge</p>
                </div>
              </div>
              <ol className="space-y-3">
                {[
                  "Chrome ya Edge mein website kholein",
                  "Address bar mein install icon (⊕) dikhega — click karein",
                  "Ya: ⋮ Menu → \"Install Momis Wardrobe\"",
                  "Desktop par shortcut ban jayega! ✅",
                ].map((s, i) => (
                  <li key={i} className="flex gap-3 text-sm text-warm-gray-600">
                    <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i+1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            {/* APK */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <Download className="text-rose-500" size={28} />
                <div>
                  <h3 className="font-bold text-warm-gray-900">APK File Chahiye?</h3>
                  <p className="text-xs text-warm-gray-500">PlayStore jaisa install</p>
                </div>
              </div>
              <p className="text-sm text-warm-gray-600 mb-4">
                Agar aap APK file chahte hain jo PlayStore ki tarah install ho, to humein WhatsApp par message karein — hum APK bhej denge!
              </p>
              <a href="https://wa.me/923295578925?text=Momis%20Wardrobe%20ka%20APK%20chahiye" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors">
                <MessageCircle size={16} /> APK WhatsApp Par Mangwayein
              </a>
              <p className="text-[10px] text-warm-gray-400 text-center mt-2">
                💡 PWA app bilkul APK jaise kaam karta hai — try karein!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="font-serif text-2xl text-warm-gray-900 text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>App FAQs</h2>
        <div className="space-y-3">
          {[
            { q: "Kya ye PlayStore par hai?", a: "Abhi PlayStore par nahi hai lekin PWA app bilkul waise kaam karta hai. Install karein — icon banega, fast chalega, notifications aayengi!" },
            { q: "Kitna storage lega?", a: "Sirf ~1MB! Regular apps 50-100MB lete hain. Ye bohot lightweight hai." },
            { q: "Kya offline kaam karega?", a: "Haan! Pehle visit kiye hue pages offline bhi khulenge." },
            { q: "Laptop par bhi install ho sakta hai?", a: "Haan! Chrome ya Edge mein website kholein aur install karein. Desktop app ban jayega." },
            { q: "Kya notifications aayengi?", a: "Haan! Sale alerts, order updates, aur new arrivals ki notifications milegi." },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-xl border border-warm-gray-100 p-5">
              <h3 className="font-bold text-warm-gray-900 text-sm">{f.q}</h3>
              <p className="text-xs text-warm-gray-500 mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
