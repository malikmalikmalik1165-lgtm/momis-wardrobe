"use client";

import Link from "next/link";
import { MessageCircle, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const p = "03295578925";

  return (
    <footer className="bg-warm-gray-900 text-warm-gray-400 text-sm">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-serif text-xl text-white font-bold">Momis</span>{" "}
              <span className="font-serif text-xl text-rose-400 font-bold">Wardrobe</span>
            </Link>
            <p className="mt-3 text-warm-gray-500 text-xs leading-relaxed max-w-xs">
              Pakistan&apos;s trusted women&apos;s fashion platform — premium quality, affordable prices, cash on delivery. Shop or resell and earn from home.
            </p>
            <div className="flex gap-2 mt-4">
              <a href={`https://wa.me/92${p.replace(/^0/, "")}`} target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-warm-gray-800 flex items-center justify-center hover:bg-green-600 transition-colors">
                <MessageCircle size={16} />
              </a>
              <a href={`tel:${p}`}
                className="w-9 h-9 rounded-lg bg-warm-gray-800 flex items-center justify-center hover:bg-rose-500 transition-colors">
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2">
              {[
                { href: "/shop", label: "All Products" },
                { href: "/sale", label: "Today's Deals" },
                { href: "/shop?category=women-s-stitched", label: "Women's Stitched" },
                { href: "/shop?category=women-s-unstitched", label: "Women's Unstitched" },
                { href: "/shop?category=cosmetics", label: "Cosmetics" },
                { href: "/shop?category=handbags", label: "Handbags" },
                { href: "/shop?category=shoes", label: "Shoes" },
                { href: "/shop?category=jewellery", label: "Jewellery" },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-xs hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Earn with MW */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Earn with MW</h4>
            <ul className="space-y-2">
              {[
                { href: "/team", label: "Reseller Portal" },
                { href: "/join", label: "Start Reselling" },
                { href: "/team", label: "Team Dashboard" },
                { href: "/blog/earn-from-home-reselling", label: "How to Earn" },
                { href: "/supplier", label: "Become a Supplier" },
              ].map((l) => (
                <li key={l.href + l.label}><Link href={l.href} className="text-xs hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2">
              {[
                { href: "/contact", label: "Contact Us" },
                { href: "/track", label: "Track Order" },
                { href: "/return-policy", label: "Returns & Exchange" },
                { href: "/size-guide", label: "Size Guide" },
                { href: "/account", label: "My Account" },
              ].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-xs hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "About Momis Wardrobe" },
                { href: "/blog", label: "Blog" },
                { href: "/careers", label: "Careers" },
                { href: "/supplier", label: "Become a Supplier" },
              ].map((l) => (
                <li key={l.href + l.label}><Link href={l.href} className="text-xs hover:text-white transition-colors">{l.label}</Link></li>
              ))}
              <li>
                <a href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa" target="_blank" rel="noopener noreferrer"
                  className="text-xs hover:text-white transition-colors">WhatsApp Community</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="mt-10 pt-8 border-t border-warm-gray-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-warm-gray-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-warm-gray-500">
                <p>Pakistan — All cities delivery</p>
                <p className="mt-0.5">{p} · <a href={`https://wa.me/92${p.replace(/^0/, "")}`} target="_blank" className="text-green-400 hover:text-green-300">WhatsApp</a></p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[10px] text-warm-gray-600">
              <span>💵 Cash on Delivery</span>
              <span>🚚 Free Delivery 5K+</span>
              <span>🔄 7-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-warm-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-warm-gray-600">© 2026 Momis Wardrobe · Pakistan&apos;s women&apos;s fashion platform</p>
          <div className="flex gap-4 text-[10px] text-warm-gray-600">
            <span className="cursor-pointer hover:text-warm-gray-400">Terms</span>
            <span className="cursor-pointer hover:text-warm-gray-400">Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
