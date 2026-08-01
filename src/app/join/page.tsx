"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Wallet,
  Clock,
  Smartphone,
  CheckCircle,
  Star,
  MessageCircle,
  ArrowRight,
  Gift,
  TrendingUp,
} from "lucide-react";

export default function JoinPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.city) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/join-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert("Kuch ghalat ho gaya. Dobara try karein.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)] min-h-screen bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1
            className="font-serif text-3xl text-warm-gray-900 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Shukriya! 🎉
          </h1>
          <p className="text-warm-gray-600 mb-2">
            Aap ki request successfully submit ho gayi hai.
          </p>
          <p className="text-warm-gray-500 text-sm mb-8">
            Humari team jald aap se WhatsApp par contact karegi.
          </p>

          <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
            <MessageCircle size={24} className="text-green-500 mx-auto mb-3" />
            <p className="text-sm text-warm-gray-700 mb-3">
              Abhi hamari WhatsApp Community join karein!
            </p>
            <a
              href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={16} />
              WhatsApp Community Join Karein
            </a>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-600 text-sm font-medium"
          >
            Shop Dekhen <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-rose-500 via-rose-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block bg-white/20 text-white text-xs tracking-wider uppercase px-4 py-1.5 rounded-full mb-6">
              💼 Online Earning Opportunity
            </span>
            <h1
              className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Ghar Baithay Paise Kamayein
              <br />
              <span className="text-rose-200">Bina Kisi Investment Ke!</span>
            </h1>
            <p className="text-rose-100 text-lg sm:text-xl max-w-2xl mx-auto mb-8">
              Momis Wardrobe ke saath judein aur apne mobile se fashion products
              bech kar attractive commission kamayein. No investment required!
            </p>
            <a
              href="#form"
              className="inline-flex items-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-rose-50 transition-colors shadow-lg"
            >
              Abhi Join Karein <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2
              className="font-serif text-2xl sm:text-3xl text-warm-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Yeh Opportunity Kyun Special Hai?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Wallet className="text-green-500" size={28} />,
                title: "Zero Investment",
                desc: "Koi paisa lagane ki zaroorat nahi. Sirf apna time aur mehnat lagayein.",
              },
              {
                icon: <Clock className="text-blue-500" size={28} />,
                title: "Flexible Timing",
                desc: "Part-time ya full-time — jab chahen kaam karein, koi restriction nahi.",
              },
              {
                icon: <Smartphone className="text-purple-500" size={28} />,
                title: "Work From Home",
                desc: "Sirf mobile se kaam karein. Ghar baithay customers tak pohunchein.",
              },
              {
                icon: <TrendingUp className="text-rose-500" size={28} />,
                title: "High Commission",
                desc: "Har sale par attractive commission. Jitna bechein, utna kamayein!",
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="bg-warm-gray-50 rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-warm-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-warm-gray-500">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-warm-gray-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2
              className="font-serif text-2xl sm:text-3xl text-warm-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Kaise Kaam Karta Hai?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Form Fill Karein",
                desc: "Niche diya gaya form bharen aur humari team join karein.",
              },
              {
                step: "2",
                title: "Products Share Karein",
                desc: "Apne WhatsApp, Facebook aur Instagram par products share karein.",
              },
              {
                step: "3",
                title: "Commission Kamayein",
                desc: "Jab bhi koi aap ke through khareedega, aap ko commission milega!",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-warm-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-warm-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2
              className="font-serif text-2xl sm:text-3xl text-warm-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Humari Team Members Ka Tajurba
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Ayesha K.",
                city: "Lahore",
                text: "Main ghar baithay 2 ghantay kaam karti hoon aur month mein 25,000+ kama leti hoon. Best decision!",
              },
              {
                name: "Fatima S.",
                city: "Karachi",
                text: "Student hoon aur apna pocket money khud kama rahi hoon. No investment thi isliye try kiya.",
              },
              {
                name: "Hira M.",
                city: "Islamabad",
                text: "Housewife hoon, bachon ko sambhalne ke saath saath earning bhi ho jati hai. Highly recommend!",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="bg-warm-gray-50 rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-gold-400 text-gold-400"
                    />
                  ))}
                </div>
                <p className="text-warm-gray-600 text-sm mb-4 italic">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div>
                  <p className="font-medium text-warm-gray-900 text-sm">
                    {review.name}
                  </p>
                  <p className="text-xs text-warm-gray-400">{review.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="form" className="bg-gradient-to-b from-warm-gray-50 to-white py-16 sm:py-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="text-rose-500" size={28} />
              </div>
              <h2
                className="font-serif text-2xl text-warm-gray-900 mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Abhi Join Karein!
              </h2>
              <p className="text-sm text-warm-gray-500">
                Form bharein, hum aap se jald contact karenge
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-warm-gray-600 mb-1.5">
                  Aap Ka Naam *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Ayesha Khan"
                  required
                  className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-warm-gray-600 mb-1.5">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g., 03001234567"
                  required
                  className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-warm-gray-600 mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="e.g., Lahore"
                  required
                  className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-warm-gray-600 mb-1.5">
                  Kuch Kehna Chahte Hain? (Optional)
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  placeholder="Apna message likhein..."
                  className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-500 text-white py-4 rounded-lg font-semibold tracking-wider uppercase hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Join Karein →"}
              </button>
            </form>

            <p className="text-xs text-warm-gray-400 text-center mt-6">
              🔒 Aap ki information safe hai aur sirf humari team dekh sakti hai.
            </p>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-green-500 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <MessageCircle size={32} className="text-white mx-auto mb-4" />
          <h2 className="text-white text-xl sm:text-2xl font-semibold mb-3">
            Koi Sawal Hai?
          </h2>
          <p className="text-green-100 mb-6">
            Humari WhatsApp Community join karein aur sawal poochein!
          </p>
          <a
            href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors"
          >
            <MessageCircle size={18} />
            WhatsApp Community
          </a>
        </div>
      </section>
    </div>
  );
}
