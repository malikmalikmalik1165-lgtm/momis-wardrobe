"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User } from "lucide-react";
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

  // Don't show on admin pages
  if (pathname.startsWith("/admin")) return null;

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/shop", icon: Search, label: "Shop" },
    { href: "#cart", icon: ShoppingBag, label: "Cart", isCart: true },
    { href: "/account", icon: User, label: "Account" },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-warm-gray-100 z-50 safe-area-bottom">
      <nav className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = item.href === pathname;
          
          if (item.isCart) {
            return (
              <button
                key={item.label}
                onClick={openCart}
                className="flex flex-col items-center gap-0.5 px-4 py-1 relative"
              >
                <div className="relative">
                  <item.icon
                    size={22}
                    className={isActive ? "text-rose-500" : "text-warm-gray-500"}
                  />
                  {itemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] ${isActive ? "text-rose-500 font-medium" : "text-warm-gray-500"}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-4 py-1"
            >
              <item.icon
                size={22}
                className={isActive ? "text-rose-500" : "text-warm-gray-500"}
              />
              <span className={`text-[10px] ${isActive ? "text-rose-500 font-medium" : "text-warm-gray-500"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
