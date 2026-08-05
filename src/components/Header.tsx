"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Menu, X, Search, MessageCircle, ChevronDown, User, Package, Heart, Percent, Phone, Grid3X3 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import SearchModal from "./SearchModal";
import NotificationBell from "./NotificationBell";

const MEGA_CATEGORIES = [
  { name: "Women's Stitched", slug: "women-s-stitched", emoji: "👗" },
  { name: "Women's Unstitched", slug: "women-s-unstitched", emoji: "🧵" },
  { name: "Cosmetics", slug: "cosmetics", emoji: "💄" },
  { name: "Handbags", slug: "handbags", emoji: "👜" },
  { name: "Shoes", slug: "shoes", emoji: "👠" },
  { name: "Jewellery", slug: "jewellery", emoji: "💍" },
  { name: "Undergarments", slug: "undergarments", emoji: "🩱" },
  { name: "14 August Special", slug: "14-august-special", emoji: "🇵🇰" },
  { name: "Accessories", slug: "accessories", emoji: "🎀" },
];

export default function Header() {
  const { totalItems, openCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setItemCount(totalItems()); }, [totalItems]);
  useEffect(() => {
    const unsub = useCartStore.subscribe(() => setItemCount(useCartStore.getState().totalItems()));
    return unsub;
  }, []);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}>
        {/* Top Ticker */}
        <div className="bg-warm-gray-900 text-white py-1 overflow-hidden">
          <div className="flex items-center justify-center gap-4 text-[11px] px-4 whitespace-nowrap">
            <span className="hidden sm:inline">🔥 <strong className="text-rose-300">SALE</strong> Up to 30% OFF</span>
            <span className="text-warm-gray-500 hidden sm:inline">|</span>
            <span>🚚 Free Delivery Rs. 5,000+</span>
            <span className="text-warm-gray-500">|</span>
            <span>💵 Cash on Delivery</span>
            <span className="text-warm-gray-500 hidden sm:inline">|</span>
            <span className="hidden sm:inline">📞 <a href="tel:03295578925" className="text-rose-300 font-bold hover:text-white">03295578925</a></span>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white border-b border-warm-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center h-14 sm:h-16 gap-3 sm:gap-6">
              {/* Mobile menu */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-1.5 text-warm-gray-700">
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center gap-1 flex-shrink-0">
                <span className="font-serif text-lg sm:text-xl tracking-tight text-warm-gray-900 font-bold">Momis</span>
                <span className="font-serif text-lg sm:text-xl tracking-tight text-rose-500 font-bold">Wardrobe</span>
              </Link>

              {/* Desktop Search Bar */}
              <div className="hidden lg:flex flex-1 max-w-xl">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-full flex items-center gap-2 bg-warm-gray-50 hover:bg-warm-gray-100 border border-warm-gray-200 rounded-lg px-4 py-2.5 text-sm text-warm-gray-400 transition-colors"
                >
                  <Search size={16} />
                  <span>Search products...</span>
                </button>
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                <button onClick={() => setSearchOpen(true)} className="lg:hidden p-2 text-warm-gray-600">
                  <Search size={20} />
                </button>

                <a href="https://wa.me/923295578925" target="_blank" rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors">
                  <MessageCircle size={14} /> WhatsApp
                </a>

                <div className="hidden sm:flex">
                  <NotificationBell />
                </div>

                <Link href="/account" className="hidden sm:flex p-2 text-warm-gray-600 hover:text-warm-gray-900 relative">
                  <User size={20} />
                </Link>

                <Link href="/track" className="hidden sm:flex p-2 text-warm-gray-600 hover:text-warm-gray-900">
                  <Package size={18} />
                </Link>

                <button onClick={openCart} className="relative p-2 text-warm-gray-700 hover:text-warm-gray-900">
                  <ShoppingBag size={20} />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category Nav Bar — Desktop */}
        <div className="hidden lg:block bg-white border-b border-warm-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-0 h-10 text-[13px]">
              {/* All Categories Dropdown */}
              <div ref={catRef} className="relative">
                <button
                  onClick={() => setCatOpen(!catOpen)}
                  className="flex items-center gap-1.5 bg-rose-500 text-white px-4 h-10 font-semibold hover:bg-rose-600 transition-colors text-xs tracking-wide uppercase"
                >
                  <Grid3X3 size={14} /> All Categories <ChevronDown size={12} className={`transition-transform ${catOpen ? "rotate-180" : ""}`} />
                </button>

                {catOpen && (
                  <div className="absolute top-10 left-0 w-64 bg-white rounded-b-xl shadow-2xl border border-warm-gray-100 py-2 z-50 animate-fade-in">
                    {MEGA_CATEGORIES.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/shop?category=${cat.slug}`}
                        onClick={() => setCatOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-rose-50 text-warm-gray-700 hover:text-rose-600 transition-colors text-sm"
                      >
                        <span className="text-base">{cat.emoji}</span>
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                    <div className="border-t border-warm-gray-100 mt-1 pt-1">
                      <Link href="/shop" onClick={() => setCatOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-rose-500 font-semibold text-sm hover:bg-rose-50">
                        View All Products →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick links */}
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop" },
                { href: "/sale", label: "🔥 Sale", highlight: true },
                { href: "/shop?category=women-s-stitched", label: "Stitched" },
                { href: "/shop?category=women-s-unstitched", label: "Unstitched" },
                { href: "/shop?category=cosmetics", label: "Cosmetics" },
                { href: "/shop?category=14-august-special", label: "🇵🇰 14 August" },
                { href: "/contact", label: "Contact" },
                { href: "/track", label: "Track Order" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 h-10 flex items-center text-[13px] whitespace-nowrap transition-colors ${
                    link.highlight
                      ? "text-rose-500 font-bold hover:text-rose-600"
                      : "text-warm-gray-600 hover:text-warm-gray-900"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-warm-gray-100 animate-fade-in max-h-[80vh] overflow-y-auto">
            {/* Mobile search */}
            <div className="p-4 border-b border-warm-gray-50">
              <button onClick={() => { setSearchOpen(true); setMobileOpen(false); }}
                className="w-full flex items-center gap-2 bg-warm-gray-50 rounded-lg px-4 py-3 text-sm text-warm-gray-400">
                <Search size={16} /> Search products...
              </button>
            </div>

            <nav className="py-2 px-4">
              <p className="text-[10px] text-warm-gray-400 uppercase tracking-widest px-2 py-2 font-semibold">Quick Links</p>
              {[
                { href: "/", label: "🏠 Home" },
                { href: "/shop", label: "🛍️ Shop All" },
                { href: "/sale", label: "🔥 Sale" },
                { href: "/track", label: "📦 Track Order" },
                { href: "/account", label: "👤 My Account" },
                { href: "/contact", label: "📞 Contact" },
              ].map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="block py-2.5 px-2 text-sm text-warm-gray-700 hover:text-rose-500 border-b border-warm-gray-50">
                  {link.label}
                </Link>
              ))}

              <p className="text-[10px] text-warm-gray-400 uppercase tracking-widest px-2 py-2 mt-3 font-semibold">Categories</p>
              {MEGA_CATEGORIES.map((cat) => (
                <Link key={cat.slug} href={`/shop?category=${cat.slug}`} onClick={() => setMobileOpen(false)}
                  className="block py-2.5 px-2 text-sm text-warm-gray-700 hover:text-rose-500 border-b border-warm-gray-50">
                  {cat.emoji} {cat.name}
                </Link>
              ))}

              <p className="text-[10px] text-warm-gray-400 uppercase tracking-widest px-2 py-2 mt-3 font-semibold">More</p>
              {[
                { href: "/about", label: "ℹ️ About Us" },
                { href: "/return-policy", label: "🔄 Return Policy" },
                { href: "/size-guide", label: "📏 Size Guide" },
                { href: "/join", label: "💼 Join & Earn" },
                { href: "/team", label: "👥 Team Portal" },
              ].map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="block py-2.5 px-2 text-sm text-warm-gray-700 hover:text-rose-500 border-b border-warm-gray-50">
                  {link.label}
                </Link>
              ))}

              {/* WhatsApp CTA */}
              <div className="mt-4 space-y-2 pb-4">
                <a href="tel:03295578925"
                  className="flex items-center justify-center gap-2 bg-warm-gray-900 text-white py-3 rounded-xl text-sm font-medium">
                  <Phone size={16} /> Call: 03295578925
                </a>
                <a href="https://wa.me/923295578925" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl text-sm font-medium">
                  <MessageCircle size={16} /> WhatsApp Order
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
