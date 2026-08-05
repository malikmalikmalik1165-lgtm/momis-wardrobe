"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User, Grid3X3 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useState, useEffect } from "react";

export default function MobileNav() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCartStore();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    setItemCount(totalItems());
    const unsub = useCartStore.subscribe(() => {
      setItemCount(useCartStore.getState().totalItems());
    });
    return unsub;
  }, [totalItems]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/team")) return null;

  const tabs = [
    { href: "/", icon: Home, label: "Home", active: pathname === "/" },
    { href: "/shop", icon: Grid3X3, label: "Categories", active: pathname === "/shop" },
    { href: "#cart", icon: ShoppingBag, label: "Cart", isCart: true, active: false },
    { href: "/account", icon: User, label: "Account", active: pathname === "/account" },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-warm-gray-100 z-50">
      <nav className="flex items-center justify-around py-1.5 px-2">
        {tabs.map((tab) => {
          if (tab.isCart) {
            return (
              <button key="cart" onClick={openCart} className="flex flex-col items-center gap-0.5 px-3 py-1 relative">
                <div className="relative">
                  <ShoppingBag size={20} className="text-warm-gray-500" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-warm-gray-500">Cart</span>
              </button>
            );
          }
          return (
            <Link key={tab.href} href={tab.href} className="flex flex-col items-center gap-0.5 px-3 py-1">
              <tab.icon size={20} className={tab.active ? "text-rose-500" : "text-warm-gray-500"} />
              <span className={`text-[10px] ${tab.active ? "text-rose-500 font-semibold" : "text-warm-gray-500"}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
