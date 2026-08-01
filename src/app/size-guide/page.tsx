"use client";

import Link from "next/link";
import { Ruler, HelpCircle, MessageCircle, ChevronRight } from "lucide-react";

export default function SizeGuidePage() {
  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)]">
      {/* Header */}
      <div className="bg-white border-b border-warm-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <nav className="flex items-center gap-2 text-xs text-warm-gray-400 mb-4">
            <Link href="/" className="hover:text-warm-gray-600">Home</Link>
            <ChevronRight size={12} />
            <span className="text-warm-gray-600">Size Guide</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
              <Ruler className="text-rose-500" size={24} />
            </div>
            <div>
              <h1
                className="font-serif text-2xl sm:text-3xl text-warm-gray-900"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Size Guide
              </h1>
              <p className="text-warm-gray-500 text-sm">Apni Perfect Size Kaise Chunein</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        
        {/* Intro */}
        <div className="bg-rose-50 rounded-2xl p-6 mb-10">
          <h2 className="font-semibold text-warm-gray-900 mb-2">📏 Size Kaise Check Karein?</h2>
          <p className="text-sm text-warm-gray-600 leading-relaxed">
            Apni body ko measuring tape se measure karein. Agar tape nahi hai to koi bhi dori 
            (string) use karein aur phir usse scale se measure kar lein. Tight kapron ke upar 
            measure karein ya bina kapron ke - yeh best results dega.
          </p>
        </div>

        {/* Women's Clothing Size Chart */}
        <div className="mb-12">
          <h2 className="font-serif text-xl text-warm-gray-900 mb-4 flex items-center gap-2">
            👗 Dresses & Tops Size Chart
          </h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-warm-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-warm-gray-50">
                  <tr>
                    <th className="text-left text-xs font-semibold text-warm-gray-600 uppercase px-4 py-3">Size</th>
                    <th className="text-center text-xs font-semibold text-warm-gray-600 uppercase px-4 py-3">Chest (in)</th>
                    <th className="text-center text-xs font-semibold text-warm-gray-600 uppercase px-4 py-3">Waist (in)</th>
                    <th className="text-center text-xs font-semibold text-warm-gray-600 uppercase px-4 py-3">Hips (in)</th>
                    <th className="text-center text-xs font-semibold text-warm-gray-600 uppercase px-4 py-3 hidden sm:table-cell">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-gray-50">
                  {[
                    { size: "XS", chest: "32-33", waist: "24-25", hips: "34-35", shoulder: "14" },
                    { size: "S", chest: "34-35", waist: "26-27", hips: "36-37", shoulder: "14.5" },
                    { size: "M", chest: "36-37", waist: "28-29", hips: "38-39", shoulder: "15" },
                    { size: "L", chest: "38-40", waist: "30-32", hips: "40-42", shoulder: "15.5" },
                    { size: "XL", chest: "41-43", waist: "33-35", hips: "43-45", shoulder: "16" },
                    { size: "XXL", chest: "44-46", waist: "36-38", hips: "46-48", shoulder: "16.5" },
                  ].map((row) => (
                    <tr key={row.size} className="hover:bg-warm-gray-50/50">
                      <td className="px-4 py-3 font-semibold text-warm-gray-900">{row.size}</td>
                      <td className="px-4 py-3 text-center text-warm-gray-600">{row.chest}</td>
                      <td className="px-4 py-3 text-center text-warm-gray-600">{row.waist}</td>
                      <td className="px-4 py-3 text-center text-warm-gray-600">{row.hips}</td>
                      <td className="px-4 py-3 text-center text-warm-gray-600 hidden sm:table-cell">{row.shoulder}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-warm-gray-400 mt-2">* Measurements inches mein hain</p>
        </div>

        {/* Shoe Size Chart */}
        <div className="mb-12">
          <h2 className="font-serif text-xl text-warm-gray-900 mb-4 flex items-center gap-2">
            👠 Shoes Size Chart
          </h2>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-warm-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-warm-gray-50">
                  <tr>
                    <th className="text-left text-xs font-semibold text-warm-gray-600 uppercase px-4 py-3">EU Size</th>
                    <th className="text-center text-xs font-semibold text-warm-gray-600 uppercase px-4 py-3">UK Size</th>
                    <th className="text-center text-xs font-semibold text-warm-gray-600 uppercase px-4 py-3">US Size</th>
                    <th className="text-center text-xs font-semibold text-warm-gray-600 uppercase px-4 py-3">Foot Length (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-gray-50">
                  {[
                    { eu: "36", uk: "3", us: "5.5", cm: "22.5" },
                    { eu: "37", uk: "4", us: "6.5", cm: "23.5" },
                    { eu: "38", uk: "5", us: "7.5", cm: "24" },
                    { eu: "39", uk: "6", us: "8.5", cm: "25" },
                    { eu: "40", uk: "7", us: "9.5", cm: "25.5" },
                    { eu: "41", uk: "8", us: "10.5", cm: "26.5" },
                  ].map((row) => (
                    <tr key={row.eu} className="hover:bg-warm-gray-50/50">
                      <td className="px-4 py-3 font-semibold text-warm-gray-900">{row.eu}</td>
                      <td className="px-4 py-3 text-center text-warm-gray-600">{row.uk}</td>
                      <td className="px-4 py-3 text-center text-warm-gray-600">{row.us}</td>
                      <td className="px-4 py-3 text-center text-warm-gray-600">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-warm-gray-400 mt-2">* Apne paon ko paper par rakh kar pencil se outline karein aur measure karein</p>
        </div>

        {/* How to Measure */}
        <div className="mb-12">
          <h2 className="font-serif text-xl text-warm-gray-900 mb-6">📐 Kaise Measure Karein?</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Chest / Seena",
                desc: "Apne seene ke sabse chaure hissay ke gird tape laga kar measure karein. Tape tight na ho, halka loose rakhein.",
                icon: "👚"
              },
              {
                title: "Waist / Kamar",
                desc: "Apni natural waistline (kamar ka sabse patla hissa, navel ke thora upar) ke gird measure karein.",
                icon: "📏"
              },
              {
                title: "Hips / Kulhay",
                desc: "Apne hips ke sabse chaure hissay ke gird measure karein. Usually yeh hip bone ke neeche hota hai.",
                icon: "👖"
              },
              {
                title: "Shoulder / Kandha",
                desc: "Ek kandhe ke edge se doosre kandhe ke edge tak seedha measure karein.",
                icon: "👔"
              },
            ].map((item) => (
              <div key={item.title} className="bg-warm-gray-50 rounded-xl p-5">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-warm-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-warm-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-gradient-to-br from-warm-gray-900 to-warm-gray-800 rounded-2xl p-6 sm:p-8 text-white mb-12">
          <h2 className="font-serif text-xl mb-4 flex items-center gap-2">
            <HelpCircle size={20} /> Size Select Karte Waqt Tips
          </h2>
          <ul className="space-y-3 text-warm-gray-300 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-rose-400">✓</span>
              <span>Agar aap do sizes ke beech mein hain, to <strong className="text-white">bari size</strong> lein - comfortable rahegi</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400">✓</span>
              <span>Fitted kapron ke liye apni exact measurements use karein</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400">✓</span>
              <span>Loose/relaxed fit ke liye 1-2 inch zyada wali size choose karein</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400">✓</span>
              <span>Har brand ki sizing thori different hoti hai - descriptions zaroor parhein</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400">✓</span>
              <span>Heels ke liye agar paon chaure hain to aadhi size bari lein</span>
            </li>
          </ul>
        </div>

        {/* Still Confused */}
        <div className="bg-green-50 rounded-2xl p-6 sm:p-8 text-center">
          <MessageCircle className="mx-auto text-green-500 mb-3" size={32} />
          <h2 className="font-serif text-xl text-warm-gray-900 mb-2">Abhi Bhi Confuse Hain?</h2>
          <p className="text-sm text-warm-gray-500 mb-4">
            Koi baat nahi! Humein WhatsApp par message karein apni measurements ke saath,<br className="hidden sm:block" />
            hum aap ko perfect size suggest kar denge! 💬
          </p>
          <a
            href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600 transition-colors"
          >
            <MessageCircle size={18} />
            WhatsApp Par Poochein
          </a>
        </div>

      </div>
    </div>
  );
}
