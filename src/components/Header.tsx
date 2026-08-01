"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingBag, Menu, X, Search, Heart, MessageCircle } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function Header() {
  const { totalItems, openCart } = useCartStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [itemCount, setItemCount] = useState(0);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      {/* Top bar */}
      <div className="bg-warm-gray-900 text-white text-center py-1.5 text-xs tracking-widest uppercase">
        Free shipping on orders over Rs. 15,000 ✨ Use code MOMIS15 for 15% off
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -ml-2 text-warm-gray-700 hover:text-warm-gray-900"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-warm-gray-900">
              Momis
            </span>
            <span className="font-serif text-2xl sm:text-3xl tracking-tight text-rose-500">
              Wardrobe
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm tracking-wide text-warm-gray-600 hover:text-warm-gray-900 transition-colors uppercase"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="text-sm tracking-wide text-warm-gray-600 hover:text-warm-gray-900 transition-colors uppercase"
            >
              Shop All
            </Link>
            <Link
              href="/shop?category=dresses"
              className="text-sm tracking-wide text-warm-gray-600 hover:text-warm-gray-900 transition-colors uppercase"
            >
              Dresses
            </Link>
            <Link
              href="/shop?category=bags"
              className="text-sm tracking-wide text-warm-gray-600 hover:text-warm-gray-900 transition-colors uppercase"
            >
              Bags
            </Link>
            <Link
              href="/shop?category=shoes"
              className="text-sm tracking-wide text-warm-gray-600 hover:text-warm-gray-900 transition-colors uppercase"
            >
              Shoes
            </Link>
            <Link
              href="/shop?category=tops"
              className="text-sm tracking-wide text-warm-gray-600 hover:text-warm-gray-900 transition-colors uppercase"
            >
              Tops
            </Link>
            <Link
              href="/join"
              className="text-sm tracking-wide text-rose-500 hover:text-rose-600 transition-colors uppercase font-medium"
            >
              💼 Join & Earn
            </Link>
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            >
              <MessageCircle size={14} />
              Join Community
            </a>
            <button
              onClick={openCart}
              className="relative p-2 text-warm-gray-700 hover:text-warm-gray-900 transition-colors"
            >
              <ShoppingBag size={22} />
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
          <nav className="flex flex-col py-4 px-6 space-y-1">
            {[
              { href: "/", label: "Home" },
              { href: "/shop", label: "Shop All" },
              { href: "/shop?category=dresses", label: "Dresses" },
              { href: "/shop?category=bags", label: "Bags" },
              { href: "/shop?category=shoes", label: "Shoes" },
              { href: "/shop?category=tops", label: "Tops & Outerwear" },
              { href: "/join", label: "💼 Join & Earn" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm tracking-wide text-warm-gray-700 hover:text-rose-500 transition-colors uppercase border-b border-warm-gray-50"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-3 text-sm tracking-wide text-green-600 hover:text-green-700 transition-colors uppercase"
            >
              <MessageCircle size={16} />
              Join WhatsApp Community
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
