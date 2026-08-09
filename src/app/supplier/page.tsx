"use client";

import { useState } from "react";
import { Package, TrendingUp, Shield, Truck, Star, MessageCircle, Check, ArrowRight, Users, Zap } from "lucide-react";

export default function SupplierPage() {
  const [form, setForm] = useState({ name: "", business: "", phone: "", city: "", products: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    const msg = `Become a Supplier Request:\n\nName: ${form.name}\nBusiness: ${form.business}\nPhone: ${form.phone}\nCity: ${form.city}\nProducts: ${form.products}\n\n${form.message}`;
    window.open(`https://wa.me/923295578925?text=${encodeURIComponent(msg)}`, "_blank");
    setSent(true);
  };

  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5.5rem)]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <span className="text-emerald-300 text-xs tracking-widest uppercase">For Suppliers</span>
            <h1 className="font-serif text-4xl sm:text-5xl mt-3 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Become a <span className="italic text-emerald-300">Supplier</span>
            </h1>
            <p className="text-emerald-200/80 text-lg mb-8">
              Apne products Momis Wardrobe par list karein aur hazaron customers tak pohunchein — bina apni shop khole!
            </p>
            <a href="#form" className="inline-flex items-center gap-2 bg-white text-emerald-800 px-7 py-3.5 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
              Apply Now <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="font-serif text-2xl text-warm-gray-900 text-center mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>Supplier Benefits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: <Users className="text-blue-500" size={28} />, title: "Huge Customer Base", desc: "Hazaron active customers tak instant access" },
            { icon: <TrendingUp className="text-green-500" size={28} />, title: "More Sales", desc: "Humari marketing aur reseller network se zyada sales" },
            { icon: <Truck className="text-purple-500" size={28} />, title: "Logistics Support", desc: "Delivery aur COD hum handle karenge" },
            { icon: <Shield className="text-rose-500" size={28} />, title: "Secure Payments", desc: "Timely payments — transparent system" },
          ].map((b) => (
            <div key={b.title} className="bg-white rounded-xl border border-warm-gray-100 p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-warm-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4">{b.icon}</div>
              <h3 className="font-bold text-warm-gray-900">{b.title}</h3>
              <p className="text-sm text-warm-gray-500 mt-2">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-warm-gray-50 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl text-warm-gray-900 text-center mb-10" style={{ fontFamily: "'Playfair Display', serif" }}>Kaise Kaam Karta Hai?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { n: "1", title: "Apply Karein", desc: "Neeche form bharein ya WhatsApp karein. Hum review karenge." },
              { n: "2", title: "Products List Karein", desc: "Approved hone par apne products ki details aur images bhejein." },
              { n: "3", title: "Sales Shuru!", desc: "Hum products list karenge, market karenge, aur aap ko payment karenge." },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">{s.n}</div>
                <h3 className="font-bold text-warm-gray-900">{s.title}</h3>
                <p className="text-sm text-warm-gray-500 mt-2">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What We Accept */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <h2 className="font-serif text-2xl text-warm-gray-900 text-center mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Ye Products Accept Karte Hain</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {["Women's Stitched Suits", "Unstitched Fabric", "Lawn Prints", "Cosmetics & Makeup", "Handbags & Purses", "Shoes & Heels", "Fashion Jewellery", "Undergarments", "Accessories", "Abayas & Modest Wear"].map((c) => (
            <span key={c} className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium border border-emerald-200">{c}</span>
          ))}
        </div>
      </div>

      {/* Form */}
      <div id="form" className="bg-warm-gray-50 py-14">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-warm-gray-900 text-center mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              {sent ? "Request Received! ✅" : "Supplier Application"}
            </h2>

            {sent ? (
              <div className="text-center py-6">
                <Check size={48} className="mx-auto text-green-500 mb-4" />
                <p className="text-warm-gray-600">Shukriya! Humari team jald aap se contact karegi.</p>
                <a href="https://wa.me/923295578925" target="_blank" className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-semibold mt-6 hover:bg-green-600">
                  <MessageCircle size={16} /> WhatsApp Par Follow Up
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Aap ka naam *" className="w-full border border-warm-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                <input type="text" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })}
                  placeholder="Business / Brand name" className="w-full border border-warm-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="WhatsApp number *" className="w-full border border-warm-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="City *" className="w-full border border-warm-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                <input type="text" value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })}
                  placeholder="Kya products supply karenge? *" className="w-full border border-warm-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3}
                  placeholder="Additional details..." className="w-full border border-warm-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
                <button onClick={handleSubmit}
                  className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 transition-colors">
                  Submit Application →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
