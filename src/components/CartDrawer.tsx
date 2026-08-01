"use client";

import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice, FREE_SHIPPING_THRESHOLD, SHIPPING_RATE } from "@/lib/currency";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } =
    useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  const sub = subtotal();
  const shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
  const count = totalItems();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] animate-fade-in"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-warm-gray-100">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-warm-gray-700" />
              <h2 className="font-serif text-xl text-warm-gray-900">
                Your Bag
              </h2>
              <span className="text-sm text-warm-gray-400">
                ({count} {count === 1 ? "item" : "items"})
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 hover:bg-warm-gray-50 rounded-full transition-colors"
            >
              <X size={20} className="text-warm-gray-600" />
            </button>
          </div>

          {/* Items */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
              <ShoppingBag
                size={48}
                className="text-warm-gray-200 mb-4"
              />
              <p className="font-serif text-lg text-warm-gray-600 mb-2">
                Your bag is empty
              </p>
              <p className="text-sm text-warm-gray-400 mb-6">
                Discover our curated collection and find something you love
              </p>
              <Link
                href="/shop"
                onClick={closeCart}
                className="bg-warm-gray-900 text-white px-8 py-3 text-sm tracking-wider uppercase hover:bg-warm-gray-800 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-4 py-4 border-b border-warm-gray-50 last:border-0"
                  >
                    <div className="relative w-20 h-24 bg-warm-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-warm-gray-900 truncate">
                        {item.name}
                      </h3>
                      <div className="flex gap-2 mt-1 text-xs text-warm-gray-400">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-warm-gray-200 rounded">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1,
                                item.size,
                                item.color
                              )
                            }
                            className="p-1.5 hover:bg-warm-gray-50 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="px-3 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity + 1,
                                item.size,
                                item.color
                              )
                            }
                            className="p-1.5 hover:bg-warm-gray-50 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-warm-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                          <button
                            onClick={() =>
                              removeItem(item.productId, item.size, item.color)
                            }
                            className="p-1 text-warm-gray-300 hover:text-rose-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-warm-gray-100 px-6 py-5 space-y-3 bg-warm-gray-50/50">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(sub)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray-500">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {sub > 0 && sub < FREE_SHIPPING_THRESHOLD && (
                  <p className="text-xs text-rose-500">
                    Add {formatPrice(FREE_SHIPPING_THRESHOLD - sub)} more for free shipping!
                  </p>
                )}
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-warm-gray-200">
                  <span>Total</span>
                  <span>{formatPrice(sub + shipping)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-warm-gray-900 text-white text-center py-3.5 text-sm tracking-wider uppercase hover:bg-warm-gray-800 transition-colors mt-2"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full text-center py-2 text-sm text-warm-gray-500 hover:text-warm-gray-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
