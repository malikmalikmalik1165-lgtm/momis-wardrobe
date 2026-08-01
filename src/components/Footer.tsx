"use client";

import Link from "next/link";
import { MessageCircle, Heart, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-warm-gray-900 text-warm-gray-300">
      {/* WhatsApp Banner */}
      <div className="bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <MessageCircle size={20} className="text-white" />
          <p className="text-white text-sm text-center">
            Join our exclusive WhatsApp community for early access, special deals & style tips!
          </p>
          <a
            href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-green-700 px-5 py-1.5 rounded-full text-sm font-semibold hover:bg-green-50 transition-colors whitespace-nowrap"
          >
            Join Now →
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl text-white">Momis</span>{" "}
              <span className="font-serif text-2xl text-rose-400">Wardrobe</span>
            </Link>
            <p className="mt-4 text-sm text-warm-gray-400 leading-relaxed">
              Curating elegant women&apos;s fashion for the modern woman. Quality
              pieces that make you feel confident and beautiful.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-warm-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-warm-gray-800 flex items-center justify-center hover:bg-rose-500 transition-colors"
              >
                <Heart size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-warm-gray-800 flex items-center justify-center hover:bg-warm-gray-600 transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/shop", label: "All Collections" },
                { href: "/shop?category=dresses", label: "Dresses" },
                { href: "/shop?category=bags", label: "Bags" },
                { href: "/shop?category=shoes", label: "Shoes" },
                { href: "/shop?category=tops", label: "Tops & Outerwear" },
                { href: "/join", label: "💼 Join & Earn" },
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
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-5">
              Customer Care
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/size-guide" className="text-sm hover:text-white transition-colors">
                  📏 Size Guide
                </Link>
              </li>
              <li>
                <Link href="/join" className="text-sm hover:text-white transition-colors">
                  💼 Join & Earn
                </Link>
              </li>
              <li>
                <a
                  href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors"
                >
                  💬 WhatsApp Support
                </a>
              </li>
              <li>
                <span className="text-sm hover:text-white transition-colors cursor-pointer">
                  🚚 Shipping Info
                </span>
              </li>
              <li>
                <span className="text-sm hover:text-white transition-colors cursor-pointer">
                  🔄 Returns Policy
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-5">
              Stay Connected
            </h3>
            <p className="text-sm text-warm-gray-400 mb-4">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-warm-gray-800 border border-warm-gray-700 px-4 py-2.5 text-sm text-white placeholder-warm-gray-500 focus:outline-none focus:border-rose-400"
              />
              <button className="bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 text-sm font-medium transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-warm-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-warm-gray-500">
            © 2025 Momis Wardrobe. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-warm-gray-500">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="hover:text-white cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
