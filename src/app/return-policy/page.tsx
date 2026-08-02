"use client";

import Link from "next/link";
import { RotateCcw, Check, X, Clock, MessageCircle, ChevronRight, Package, Shield, AlertTriangle } from "lucide-react";

export default function ReturnPolicyPage() {
  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)]">
      {/* Header */}
      <div className="bg-warm-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <RotateCcw className="mx-auto mb-4" size={36} />
          <h1 className="font-serif text-3xl sm:text-4xl mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Return & Exchange Policy
          </h1>
          <p className="text-warm-gray-400">7 Din Easy Return/Exchange — Aap Ki Satisfaction Humari Priority!</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-green-50 rounded-xl p-5 text-center">
            <Clock className="mx-auto text-green-600 mb-2" size={24} />
            <h3 className="font-bold text-green-800">7 Din</h3>
            <p className="text-sm text-green-600">Return Window</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-5 text-center">
            <RotateCcw className="mx-auto text-blue-600 mb-2" size={24} />
            <h3 className="font-bold text-blue-800">Free Exchange</h3>
            <p className="text-sm text-blue-600">Size/Color Change</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-5 text-center">
            <Shield className="mx-auto text-purple-600 mb-2" size={24} />
            <h3 className="font-bold text-purple-800">100% Refund</h3>
            <p className="text-sm text-purple-600">Defective Items Par</p>
          </div>
        </div>

        {/* Return Policy */}
        <div className="mb-10">
          <h2 className="font-serif text-2xl text-warm-gray-900 mb-6 flex items-center gap-2">
            <RotateCcw className="text-rose-500" size={22} /> Return Policy
          </h2>

          <div className="bg-white rounded-xl border border-warm-gray-100 divide-y divide-warm-gray-100">
            <div className="p-5">
              <h3 className="font-semibold text-warm-gray-900 mb-2">Return Kab Kar Sakte Hain?</h3>
              <ul className="space-y-2 text-sm text-warm-gray-600">
                <li className="flex items-start gap-2"><Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} /> Delivery ke <strong>7 din ke andar</strong> return request karein</li>
                <li className="flex items-start gap-2"><Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} /> Product <strong>unused aur unwashed</strong> hona chahiye</li>
                <li className="flex items-start gap-2"><Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} /> Original <strong>tags aur packaging</strong> attached honi chahiye</li>
                <li className="flex items-start gap-2"><Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} /> <strong>Receipt ya order confirmation</strong> dikhana hoga</li>
              </ul>
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-warm-gray-900 mb-2">Return Kaise Karein?</h3>
              <div className="space-y-3">
                {[
                  { step: "1", text: "WhatsApp par 03295578925 par message karein with order ID" },
                  { step: "2", text: "Humari team return approve karegi aur pickup arrange karegi" },
                  { step: "3", text: "Product wapas aane ke baad inspection hoga (1-2 din)" },
                  { step: "4", text: "Refund ya exchange 3-5 working days mein process hoga" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">{item.step}</div>
                    <p className="text-sm text-warm-gray-600">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5">
              <h3 className="font-semibold text-warm-gray-900 mb-2">Refund Kaise Milega?</h3>
              <ul className="space-y-2 text-sm text-warm-gray-600">
                <li className="flex items-start gap-2"><Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} /> <strong>JazzCash / EasyPaisa</strong> — 1-2 working days</li>
                <li className="flex items-start gap-2"><Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} /> <strong>Bank Transfer</strong> — 3-5 working days</li>
                <li className="flex items-start gap-2"><Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} /> <strong>Store Credit</strong> — Immediately (bonus 5% extra)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Exchange Policy */}
        <div className="mb-10">
          <h2 className="font-serif text-2xl text-warm-gray-900 mb-6 flex items-center gap-2">
            <RotateCcw className="text-blue-500" size={22} /> Exchange Policy
          </h2>

          <div className="bg-white rounded-xl border border-warm-gray-100 divide-y divide-warm-gray-100">
            <div className="p-5">
              <h3 className="font-semibold text-warm-gray-900 mb-2">Free Exchange Milega:</h3>
              <ul className="space-y-2 text-sm text-warm-gray-600">
                <li className="flex items-start gap-2"><Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} /> <strong>Wrong size</strong> aayi — different size mein exchange</li>
                <li className="flex items-start gap-2"><Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} /> <strong>Color pasand nahi</strong> — doosri color mein exchange</li>
                <li className="flex items-start gap-2"><Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} /> <strong>Defective product</strong> — nayi piece milegi</li>
                <li className="flex items-start gap-2"><Check className="text-green-500 mt-0.5 flex-shrink-0" size={16} /> <strong>Different product</strong> chahiye — price adjust ho jayegi</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Non-Returnable Items */}
        <div className="mb-10">
          <h2 className="font-serif text-2xl text-warm-gray-900 mb-6 flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={22} /> Return Nahi Hoga:
          </h2>

          <div className="bg-amber-50 rounded-xl p-5">
            <ul className="space-y-2 text-sm text-warm-gray-700">
              <li className="flex items-start gap-2"><X className="text-rose-500 mt-0.5 flex-shrink-0" size={16} /> Used, washed ya altered products</li>
              <li className="flex items-start gap-2"><X className="text-rose-500 mt-0.5 flex-shrink-0" size={16} /> Tags remove ho chuke hon</li>
              <li className="flex items-start gap-2"><X className="text-rose-500 mt-0.5 flex-shrink-0" size={16} /> Stained, damaged ya perfume laga ho</li>
              <li className="flex items-start gap-2"><X className="text-rose-500 mt-0.5 flex-shrink-0" size={16} /> Sale items (50%+ discount wale) — sirf exchange</li>
              <li className="flex items-start gap-2"><X className="text-rose-500 mt-0.5 flex-shrink-0" size={16} /> Undergarments aur intimate items</li>
              <li className="flex items-start gap-2"><X className="text-rose-500 mt-0.5 flex-shrink-0" size={16} /> 7 din se zyada ho chuke hon</li>
            </ul>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mb-10">
          <h2 className="font-serif text-2xl text-warm-gray-900 mb-6 flex items-center gap-2">
            <Package className="text-green-500" size={22} /> Delivery Information
          </h2>

          <div className="bg-white rounded-xl border border-warm-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-warm-gray-50">
                <tr>
                  <th className="text-left text-xs font-semibold text-warm-gray-600 uppercase px-4 py-3">City / Area</th>
                  <th className="text-center text-xs font-semibold text-warm-gray-600 uppercase px-4 py-3">Delivery Time</th>
                  <th className="text-center text-xs font-semibold text-warm-gray-600 uppercase px-4 py-3">Charges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-gray-50">
                {[
                  { area: "Lahore / Karachi", time: "1-2 din", charge: "FREE" },
                  { area: "Islamabad / Rawalpindi", time: "2-3 din", charge: "Rs. 200" },
                  { area: "Punjab Major Cities", time: "2-3 din", charge: "Rs. 200" },
                  { area: "Sindh / KPK Cities", time: "3-5 din", charge: "Rs. 300-400" },
                  { area: "Balochistan", time: "4-7 din", charge: "Rs. 450-500" },
                  { area: "AJK / Gilgit", time: "5-8 din", charge: "Rs. 400-550" },
                ].map((row) => (
                  <tr key={row.area}>
                    <td className="px-4 py-3 text-sm text-warm-gray-900">{row.area}</td>
                    <td className="px-4 py-3 text-sm text-warm-gray-600 text-center">{row.time}</td>
                    <td className="px-4 py-3 text-sm text-center font-medium">{row.charge === "FREE" ? <span className="text-green-600">{row.charge}</span> : row.charge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-warm-gray-400 mt-2">* Rs. 5,000+ ke orders par sab cities mein FREE delivery</p>
        </div>

        {/* Contact */}
        <div className="bg-green-50 rounded-2xl p-6 sm:p-8 text-center">
          <MessageCircle className="mx-auto text-green-600 mb-3" size={32} />
          <h2 className="font-serif text-xl text-warm-gray-900 mb-2">Return/Exchange Request?</h2>
          <p className="text-sm text-warm-gray-500 mb-4">WhatsApp par message karein with order ID</p>
          <a
            href="https://wa.me/923295578925?text=Return/Exchange%20request%20karna%20hai.%20Order%20ID:%20"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-medium hover:bg-green-600"
          >
            <MessageCircle size={18} /> WhatsApp: 03295578925
          </a>
        </div>
      </div>
    </div>
  );
}
