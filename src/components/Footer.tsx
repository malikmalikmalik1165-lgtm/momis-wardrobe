"use client";

import Link from "next/link";
import { MessageCircle, Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const phoneNumber = "03295578925";

  return (
    <footer className="bg-warm-gray-900 text-warm-gray-300">
      {/* WhatsApp Banner */}
      <div className="bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Phone size={20} className="text-white" />
          <p className="text-white text-sm text-center">
            Order & Queries: <span className="font-bold">{phoneNumber}</span> — COD Available All Pakistan! 🇵🇰
          </p>
          <a
            href={`https://wa.me/92${phoneNumber.replace(/^0/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-green-700 px-5 py-1.5 rounded-full text-sm font-semibold hover:bg-green-50 transition-colors whitespace-nowrap"
          >
            WhatsApp Order →
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl text-white">Momis</span>{" "}
              <span className="font-serif text-2xl text-rose-400">Wardrobe</span>
            </Link>
            <p className="mt-4 text-sm text-warm-gray-400 leading-relaxed">
              Elegant women&apos;s fashion for the modern Pakistani woman. Quality products, affordable prices.
            </p>
            <div className="flex gap-3 mt-6">
              <a
                href={`https://wa.me/92${phoneNumber.replace(/^0/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-warm-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors"
                title="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href={`tel:${phoneNumber}`}
                className="w-10 h-10 rounded-full bg-warm-gray-800 flex items-center justify-center hover:bg-rose-500 transition-colors"
                title="Call Us"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {[
                { href: "/shop", label: "All Products" },
                { href: "/sale", label: "🔥 Sale" },
                { href: "/shop?category=dresses", label: "Dresses" },
                { href: "/shop?category=bags", label: "Bags" },
                { href: "/shop?category=shoes", label: "Shoes" },
                { href: "/shop?category=tops", label: "Tops" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Help
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/contact" className="text-sm hover:text-white transition-colors">
                  📞 Contact Us
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-sm hover:text-white transition-colors">
                  📏 Size Guide
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm hover:text-white transition-colors">
                  ℹ️ About Us
                </Link>
              </li>
              <li>
                <Link href="/return-policy" className="text-sm hover:text-white transition-colors">
                  🔄 Return & Exchange
                </Link>
              </li>
              <li>
                <a
                  href={`https://wa.me/92${phoneNumber.replace(/^0/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors"
                >
                  💬 WhatsApp Support
                </a>
              </li>
              <li>
                <Link href="/join" className="text-sm hover:text-white transition-colors">
                  💼 Join & Earn
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone size={16} className="text-rose-400 mt-0.5" />
                <div>
                  <a href={`tel:${phoneNumber}`} className="text-sm hover:text-white transition-colors block">
                    {phoneNumber}
                  </a>
                  <span className="text-xs text-warm-gray-500">Orders & Queries</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle size={16} className="text-green-400 mt-0.5" />
                <div>
                  <a
                    href={`https://wa.me/92${phoneNumber.replace(/^0/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-white transition-colors block"
                  >
                    WhatsApp
                  </a>
                  <span className="text-xs text-warm-gray-500">Quick Response</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-warm-gray-400 mt-0.5" />
                <span className="text-sm text-warm-gray-400">
                  All Pakistan Delivery<br />
                  <span className="text-green-400 font-medium">COD Available ✓</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-warm-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-warm-gray-500">
            © 2025 Momis Wardrobe. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-warm-gray-500">
            <span>🚚 Free delivery Rs. 5,000+</span>
            <span>💵 Cash on Delivery</span>
            <span>🔄 Easy Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
