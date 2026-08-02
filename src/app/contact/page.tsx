"use client";

import { Phone, MessageCircle, MapPin, Clock, Mail, Send } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleWhatsApp = () => {
    const text = `Assalam o Alaikum! Mera naam ${form.name || "___"} hai. ${form.message || "Mujhe products ke baare mein poochna hai."}`;
    window.open(`https://wa.me/923295578925?text=${encodeURIComponent(text)}`, "_blank");
  };

  const phoneNumber = "03295578925";

  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-500 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          <h1
            className="font-serif text-3xl sm:text-4xl lg:text-5xl mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Contact Us
          </h1>
          <p className="text-rose-100 text-lg max-w-xl mx-auto">
            Order karna ho ya koi sawal ho — hum yahan hain aap ki madad ke liye!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info */}
          <div>
            <h2 className="font-serif text-2xl text-warm-gray-900 mb-6">
              Humse Rabta Karein
            </h2>

            {/* Phone - Main CTA */}
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center gap-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-2xl p-6 mb-4 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Phone size={28} />
              </div>
              <div>
                <p className="text-rose-100 text-sm">Call for Orders & Queries</p>
                <p className="text-2xl font-bold">{phoneNumber}</p>
              </div>
            </a>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/923295578925`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-green-500 text-white rounded-2xl p-6 mb-4 hover:bg-green-600 transition-colors"
            >
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle size={28} />
              </div>
              <div>
                <p className="text-green-100 text-sm">WhatsApp par message karein</p>
                <p className="text-2xl font-bold">{phoneNumber}</p>
              </div>
            </a>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="bg-warm-gray-50 rounded-xl p-5">
                <Clock className="text-rose-500 mb-3" size={24} />
                <h3 className="font-semibold text-warm-gray-900 mb-1">Timing</h3>
                <p className="text-sm text-warm-gray-500">
                  Mon - Sat: 10 AM - 8 PM<br />
                  Sunday: 12 PM - 6 PM
                </p>
              </div>

              <div className="bg-warm-gray-50 rounded-xl p-5">
                <MapPin className="text-rose-500 mb-3" size={24} />
                <h3 className="font-semibold text-warm-gray-900 mb-1">Delivery</h3>
                <p className="text-sm text-warm-gray-500">
                  All over Pakistan 🇵🇰<br />
                  Cash on Delivery Available
                </p>
              </div>
            </div>

            {/* Community */}
            <div className="mt-8 bg-green-50 rounded-xl p-6">
              <h3 className="font-semibold text-warm-gray-900 mb-2">
                💬 WhatsApp Community Join Karein
              </h3>
              <p className="text-sm text-warm-gray-500 mb-4">
                New arrivals, exclusive deals aur style tips ke liye!
              </p>
              <a
                href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={16} />
                Join Community
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-warm-gray-100 p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-warm-gray-900 mb-6">
              Quick Message
            </h2>

            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="text-green-600" size={32} />
                </div>
                <h3 className="font-semibold text-warm-gray-900 mb-2">Shukriya!</h3>
                <p className="text-warm-gray-500 text-sm mb-4">
                  WhatsApp par baat karte hain!
                </p>
                <button
                  onClick={handleWhatsApp}
                  className="bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
                >
                  WhatsApp Kholein
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-warm-gray-700 mb-1.5">
                    Aap ka Naam
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Ayesha"
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-warm-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g., 0300-1234567"
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-warm-gray-700 mb-1.5">
                    Message
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    placeholder="Apna sawal ya order details likhein..."
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>

                <button
                  onClick={() => {
                    setSent(true);
                    setTimeout(handleWhatsApp, 500);
                  }}
                  className="w-full bg-green-500 text-white py-3.5 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  WhatsApp Par Bhejein
                </button>

                <p className="text-xs text-center text-warm-gray-400">
                  Ya direct call karein: <a href={`tel:${phoneNumber}`} className="text-rose-500 font-medium">{phoneNumber}</a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-warm-gray-50 py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="font-serif text-2xl text-warm-gray-900 text-center mb-8">
            Aksar Poochhe Jane Wale Sawalat
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Delivery kitne din mein hoti hai?",
                a: "Lahore/Karachi mein 1-2 din, baqi cities mein 3-5 din. Order confirm hone par exact time bata dete hain."
              },
              {
                q: "Cash on Delivery available hai?",
                a: "Jee haan! Pakistan bhar mein COD available hai. Aap ghar par payment kar sakte hain."
              },
              {
                q: "Return/Exchange policy kya hai?",
                a: "7 din ke andar return ya exchange ho sakta hai agar product unused ho aur tags attached hon."
              },
              {
                q: "Custom stitching available hai?",
                a: "Haan! Kuch products mein stitching option hai. Product page par check karein ya WhatsApp par poochein."
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5">
                <h3 className="font-semibold text-warm-gray-900 mb-2">{item.q}</h3>
                <p className="text-sm text-warm-gray-500">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
