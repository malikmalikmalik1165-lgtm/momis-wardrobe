"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Search, MessageCircle, Phone, Percent } from "lucide-react";
import { useCartStore } from "@/store/cart";
import SearchModal from "./SearchModal";

export default function Header() {
  const { totalItems, openCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setItemCount(totalItems());
  }, [totalItems]);

  useEffect(() => {
    const unsub = useCartStore.subscribe(() => {
      setItemCount(useCartStore.getState().totalItems());
    });
    return unsub;
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        {/* Top bar */}
        <div className="bg-warm-gray-900 text-white text-center py-1.5 text-xs tracking-wide">
          <div className="flex items-center justify-center gap-2 flex-wrap px-4">
            <span>📞 Order: <a href="tel:03295578925" className="font-semibold hover:text-rose-300">03295578925</a></span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Free delivery Rs. 5,000+</span>
            <span>•</span>
            <span className="text-rose-300 font-semibold">COD Available! ✓</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 -ml-2 text-warm-gray-700 hover:text-warm-gray-900"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5">
              <span className="font-serif text-xl sm:text-2xl tracking-tight text-warm-gray-900">
                Momis
              </span>
              <span className="font-serif text-xl sm:text-2xl tracking-tight text-rose-500">
                Wardrobe
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link
                href="/"
                className="text-sm tracking-wide text-warm-gray-600 hover:text-warm-gray-900 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="text-sm tracking-wide text-warm-gray-600 hover:text-warm-gray-900 transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/sale"
                className="text-sm tracking-wide text-rose-500 hover:text-rose-600 transition-colors font-semibold flex items-center gap-1"
              >
                <Percent size={14} /> Sale
              </Link>
              <Link
                href="/shop?category=dresses"
                className="text-sm tracking-wide text-warm-gray-600 hover:text-warm-gray-900 transition-colors"
              >
                Dresses
              </Link>
              <Link
                href="/shop?category=bags"
                className="text-sm tracking-wide text-warm-gray-600 hover:text-warm-gray-900 transition-colors"
              >
                Bags
              </Link>
              <Link
              href="/contact"
              className="text-sm tracking-wide text-warm-gray-600 hover:text-warm-gray-900 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/track"
              className="text-sm tracking-wide text-warm-gray-600 hover:text-warm-gray-900 transition-colors"
            >
              Track Order
            </Link>
          </nav>

            {/* Right icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-warm-gray-600 hover:text-warm-gray-900 transition-colors"
              >
                <Search size={20} />
              </button>
              <a
                href="https://wa.me/923295578925"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
              <button
                onClick={openCart}
                className="relative p-2 text-warm-gray-700 hover:text-warm-gray-900 transition-colors"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-warm-gray-100 animate-fade-in">
            <nav className="flex flex-col py-3 px-6">
              {[
                { href: "/", label: "Home" },
                { href: "/shop", label: "Shop All" },
                { href: "/sale", label: "🔥 Sale", highlight: true },
                { href: "/shop?category=dresses", label: "Dresses" },
                { href: "/shop?category=bags", label: "Bags" },
                { href: "/shop?category=shoes", label: "Shoes" },
                { href: "/shop?category=tops", label: "Tops" },
              { href: "/contact", label: "📞 Contact" },
              { href: "/track", label: "📦 Track Order" },
              { href: "/about", label: "About Us" },
                { href: "/join", label: "💼 Join & Earn" },
                { href: "/account", label: "👤 My Account" },
              { href: "/team", label: "👥 Team Portal" },
              { href: "/size-guide", label: "📏 Size Guide" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-2.5 text-sm tracking-wide transition-colors border-b border-warm-gray-50 ${
                    link.highlight
                      ? "text-rose-500 font-semibold"
                      : "text-warm-gray-700 hover:text-rose-500"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="tel:03295578925"
                className="flex items-center gap-2 py-3 mt-2 text-sm text-green-600 font-medium"
              >
                <Phone size={16} />
                Call: 03295578925
              </a>
              <a
                href="https://wa.me/923295578925"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-2 bg-green-500 text-white py-3 rounded-lg text-sm font-medium"
              >
                <MessageCircle size={16} />
                WhatsApp Order
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
