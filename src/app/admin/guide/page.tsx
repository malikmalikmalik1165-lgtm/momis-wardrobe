"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Smartphone, ShoppingBag, Users, Award, Bell, Settings, Package, Tag, MessageCircle, Image as ImageIcon, FileText } from "lucide-react";

export default function AdminGuidePage() {
  const [open, setOpen] = useState<number | null>(0);

  const sections = [
    {
      icon: "📦", title: "Product Kaise Add Karein (Mobile)",
      steps: [
        "1️⃣ Browser mein jao: momis-wardrobe-vert.vercel.app/admin",
        "2️⃣ Password: momidani",
        "3️⃣ '📦 Products' tab already khula hoga",
        "4️⃣ '+ Add Product' button tap karo",
        "",
        "📸 IMAGE ADD KARNE KE 4 TAREEQE:",
        "",
        "🔵 Markaz Se:",
        "   → Markaz app kholein → Product image par LONG PRESS",
        "   → 'Copy Image Address' tap karein",
        "   → Admin mein URL field mein PASTE → 'Add' button",
        "",
        "🟢 WhatsApp Se:",
        "   → WhatsApp mein image par LONG PRESS → 'Copy'",
        "   → Admin mein upload zone par tap → 'Paste'",
        "",
        "🟡 Gallery/Camera Se:",
        "   → Admin mein upload zone par tap karein",
        "   → Gallery khulegi → Photo select karein",
        "",
        "🔗 Kisi Bhi Website Se:",
        "   → Daraz/Google par image par LONG PRESS",
        "   → 'Copy Image Address'",
        "   → Admin mein URL field mein paste → 'Add'",
        "",
        "5️⃣ Product Name likhein (clear aur attractive)",
        "6️⃣ Price likhein (base price + Rs. 250 margin)",
        "   Example: Markaz Rs. 1500 → Humari price Rs. 1750",
        "7️⃣ Category select karein (optional)",
        "8️⃣ Badge likhein: 'New', 'Sale', 'Best Seller' (optional)",
        "9️⃣ 'Add Product' button tap karein → DONE! ✅",
      ],
    },
    {
      icon: "🛒", title: "Orders Manage Karein",
      steps: [
        "1️⃣ Admin → '🛒 Orders' tab kholein",
        "2️⃣ Revenue summary top par dikhega (total revenue, pending, delivered)",
        "3️⃣ Search bar mein tracking ID, customer name ya phone se search karein",
        "4️⃣ Status filter se Pending/Shipped/Delivered filter karein",
        "",
        "📦 ORDER PROCESS KARNA:",
        "   → Status dropdown se update karein: Pending → Confirmed → Shipped → Delivered",
        "   → Courier name aur tracking number likhein",
        "   → 'Notify' button se customer ko WhatsApp par update bhejein",
        "   → '📄 Invoice' button se invoice PDF download karein",
        "",
        "📥 'Export CSV' button se sab orders ki file download karein",
      ],
    },
    {
      icon: "👥", title: "Team Members Manage Karein",
      steps: [
        "1️⃣ Admin → '👥 Team' tab kholein",
        "2️⃣ Sab registered team members dikhenge with earnings, sales, commission",
        "",
        "🔧 KYA KAR SAKTE HAIN:",
        "   → ⏸ Deactivate/Activate — Member ko enable/disable karein",
        "   → 💰 Commission % — Commission percentage change karein",
        "   → 🏆 Certificate — 6 types ke certificates issue karein",
        "   → 📚 Assign Training — WhatsApp par training course link bhejein",
        "   → 💬 WhatsApp — Direct message karein",
        "   → 🗑 Delete — Member account delete karein",
        "",
        "📝 JOIN REQUESTS:",
        "   → '📝 Requests' tab mein new join requests aayengi",
        "   → Approve karein → Team account auto-create hoga",
        "   → Default password: phone ke last 4 digits + 'mw'",
        "   → WhatsApp par login details bhejein",
      ],
    },
    {
      icon: "🏆", title: "Certificates Kaise Issue Karein",
      steps: [
        "1️⃣ Admin → '👥 Team' tab kholein",
        "2️⃣ Member ke neeche '🏆 Issue Certificate ▾' dropdown dekhein",
        "3️⃣ Certificate type select karein:",
        "   🎉 Welcome Certificate — Naye member ko welcome",
        "   📜 Training Completion — Course complete karne par",
        "   ⭐ Best Performance — Outstanding sales ke liye",
        "   ❤️ Appreciation — Dedicated member ke liye",
        "   🏅 Top Seller Award — Monthly best performer",
        "   🚀 Rising Star — Fastest growing member",
        "",
        "4️⃣ 3 prompts aayenge — EDIT kar sakte hain:",
        "   → Naam (apni marzi ka likhein)",
        "   → Date (apni marzi ki date)",
        "   → Extra Note (optional special message)",
        "",
        "5️⃣ Certificate naye tab mein khulega",
        "6️⃣ 'Print / Save as PDF' button click karein",
        "7️⃣ PDF save karke WhatsApp par member ko bhejein! 🎉",
      ],
    },
    {
      icon: "🏷️", title: "Discount Codes Banayein",
      steps: [
        "1️⃣ Admin → '🏷️ Discounts' tab kholein",
        "2️⃣ Code likhein (e.g., AZADI30, MOMIS10)",
        "3️⃣ Percentage likhein (e.g., 10, 15, 30)",
        "4️⃣ Max uses likhein (optional — kitni dafa use ho sake)",
        "5️⃣ 'Create' button tap karein",
        "",
        "Customer checkout par code daalega → automatic discount lagega",
        "Toggle se code active/inactive karein",
      ],
    },
    {
      icon: "📢", title: "Notifications Bhejein",
      steps: [
        "1️⃣ Admin → '📢 Notifs' tab kholein",
        "2️⃣ Title likhein (e.g., 'New Collection Arrived! 🎉')",
        "3️⃣ Message likhein (e.g., '30% OFF sab products par!')",
        "4️⃣ Link daalein (optional — e.g., /sale)",
        "5️⃣ 'Send' button tap karein",
        "",
        "Sab users ko notification bell mein dikhega!",
      ],
    },
    {
      icon: "👤", title: "Customers Manage Karein",
      steps: [
        "1️⃣ Admin → '👤 Customers' tab kholein",
        "2️⃣ Sab registered customers ki list dikhegi",
        "3️⃣ WhatsApp button se direct message karein",
        "4️⃣ Delete button se customer account hatayein",
      ],
    },
    {
      icon: "⚙️", title: "Settings Change Karein",
      steps: [
        "1️⃣ Admin → '⚙️ Settings' tab kholein",
        "2️⃣ Store Name change kar sakte hain",
        "3️⃣ WhatsApp Number update karein",
        "4️⃣ Free Shipping threshold set karein (default Rs. 5000)",
        "5️⃣ Shipping Rate set karein (default Rs. 250)",
        "6️⃣ 'Save Settings' button tap karein",
      ],
    },
    {
      icon: "🌐", title: "Website Ke Features",
      steps: [
        "📱 CUSTOMER FEATURES:",
        "   → 🏠 Home Page — Hero, categories, featured products, reviews",
        "   → 🛍 Shop — Sab products with search, filter, sort",
        "   → 🔥 Sale Page — Discounted products",
        "   → 📦 Product Detail — Images, sizes, colors, reviews, WhatsApp order",
        "   → 🛒 Cart & Checkout — COD, referral code, discount code",
        "   → 📦 Order Tracking — MW-XXXXXX tracking ID se",
        "   → 👤 Account — Login, orders history, wishlist",
        "   → 🤖 AI Chat Bot — 'Momi' se sawaal poochein",
        "   → 📏 Size Guide — Measurements chart",
        "   → 🔄 Return Policy — 7-day return",
        "",
        "👥 TEAM FEATURES:",
        "   → 👥 Team Portal — Login, dashboard, products share",
        "   → 🎓 Training — 6 courses, 50+ lessons",
        "   → 🏆 Rewards — Levels, prizes, certificates",
        "   → 💰 Earnings — Commission tracking",
        "",
        "📰 COMPANY PAGES:",
        "   → ℹ️ About Us — Brand story",
        "   → 📰 Blog — 6 articles",
        "   → 💼 Careers — Job openings",
        "   → 🏭 Supplier — Become a supplier",
        "   → 📞 Contact — Phone, WhatsApp, FAQ",
        "   → 📜 Terms — Full policies",
        "   → 📱 App Download — Install guide",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-warm-gray-50">
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-1.5 hover:bg-warm-gray-100 rounded-lg"><ArrowLeft size={18}/></Link>
            <h1 className="font-bold text-lg">📖 Admin Guide</h1>
          </div>
          <Link href="/admin" className="text-xs text-rose-500 font-medium">← Admin Panel</Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-2">Partner Guide — Momis Wardrobe</h2>
          <p className="text-rose-100 text-sm">Admin Panel ka complete guide. Har feature step by step samjhaya gaya hai.</p>
          <p className="text-rose-200 text-xs mt-2">Admin URL: momis-wardrobe-vert.vercel.app/admin · Password: momidani</p>
        </div>

        <div className="space-y-2">
          {sections.map((s, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-warm-gray-100 overflow-hidden">
              <button onClick={() => setOpen(open === idx ? null : idx)}
                className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-warm-gray-50 transition-colors">
                <span className="flex items-center gap-2 font-semibold text-sm text-warm-gray-900">
                  <span className="text-lg">{s.icon}</span> {s.title}
                </span>
                <span className="text-warm-gray-400 text-xs">{open === idx ? "▲" : "▼"}</span>
              </button>
              {open === idx && (
                <div className="px-4 pb-4 border-t border-warm-gray-50">
                  <div className="pt-3 space-y-1.5">
                    {s.steps.map((step, i) => (
                      <p key={i} className={`text-sm ${step === "" ? "h-2" : step.startsWith("   ") ? "text-warm-gray-500 pl-4" : step.includes("TAREEQE") || step.includes("KARNA") || step.includes("KAR SAKTE") || step.includes("FEATURES") || step.includes("PAGES") || step.includes("PROCESS") ? "font-bold text-warm-gray-800 mt-2" : "text-warm-gray-600"}`}>
                        {step}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 bg-green-50 rounded-xl p-5 text-center">
          <p className="text-sm text-warm-gray-700 mb-3">Koi sawaal? Admin support se baat karein</p>
          <a href="https://wa.me/923295578925" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-600">
            <MessageCircle size={16}/> WhatsApp Help
          </a>
        </div>
      </div>
    </div>
  );
}
