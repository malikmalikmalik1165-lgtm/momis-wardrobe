"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import {
  ChevronRight,
  Lock,
  Check,
  ShoppingBag,
  CreditCard,
  Truck,
  MessageCircle,
} from "lucide-react";
import { formatPrice, FREE_SHIPPING_THRESHOLD, SHIPPING_RATE } from "@/lib/currency";

export default function CheckoutPage() {
  const { items, subtotal, totalItems, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"info" | "confirm" | "success">("info");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="pt-[calc(2.5rem+5rem)] min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-warm-gray-400">Loading...</div>
      </div>
    );
  }

  const sub = subtotal();
  const shipping = sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
  const total = sub + shipping;
  const count = totalItems();

  if (step === "success") {
    return (
      <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)] min-h-screen bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-20 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-600" />
          </div>
          <h1
            className="font-serif text-3xl text-warm-gray-900 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Thank You!
          </h1>
          <p className="text-warm-gray-500 mb-2">
            Your order #{orderId} has been placed successfully.
          </p>
          <p className="text-warm-gray-400 text-sm mb-8">
            We&apos;ll send a confirmation email to {form.email}
          </p>

          <div className="bg-green-50 rounded-xl p-6 mb-8">
            <MessageCircle size={24} className="text-green-600 mx-auto mb-3" />
            <p className="text-sm text-warm-gray-700 mb-3">
              Join our WhatsApp community for order updates and exclusive deals!
            </p>
            <a
              href="https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={16} />
              Join WhatsApp Community
            </a>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-warm-gray-900 text-white px-8 py-3.5 text-sm tracking-wider uppercase hover:bg-warm-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)] min-h-screen flex flex-col items-center justify-center px-4">
        <ShoppingBag size={48} className="text-warm-gray-200 mb-4" />
        <h1
          className="font-serif text-2xl text-warm-gray-900 mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Your bag is empty
        </h1>
        <p className="text-warm-gray-400 mb-8">
          Add some items to get started
        </p>
        <Link
          href="/shop"
          className="bg-warm-gray-900 text-white px-8 py-3 text-sm tracking-wider uppercase"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.zip
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${form.firstName} ${form.lastName}`,
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress: `${form.address}, ${form.city}, ${form.state} ${form.zip}`,
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.image,
          })),
        }),
      });

      if (res.ok) {
        const order = await res.json();
        setOrderId(order.id);
        clearCart();
        setStep("success");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)] min-h-screen bg-warm-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-warm-gray-400 mb-8">
          <Link href="/shop" className="hover:text-warm-gray-600">
            Shop
          </Link>
          <ChevronRight size={12} />
          <span className="text-warm-gray-600">Checkout</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <div className="lg:col-span-3">
            <h1
              className="font-serif text-2xl sm:text-3xl text-warm-gray-900 mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Checkout
            </h1>

            {/* Shipping Info */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Truck size={18} className="text-warm-gray-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-warm-gray-700">
                  Shipping Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-warm-gray-500 mb-1.5">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-xs text-warm-gray-500 mb-1.5">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                    placeholder="Doe"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-warm-gray-500 mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                    placeholder="jane@example.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-warm-gray-500 mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-warm-gray-500 mb-1.5">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                    placeholder="123 Fashion Ave"
                  />
                </div>
                <div>
                  <label className="block text-xs text-warm-gray-500 mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                    placeholder="New York"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-warm-gray-500 mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      value={form.state}
                      onChange={(e) =>
                        setForm({ ...form, state: e.target.value })
                      }
                      className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-warm-gray-500 mb-1.5">
                      ZIP *
                    </label>
                    <input
                      type="text"
                      value={form.zip}
                      onChange={(e) =>
                        setForm({ ...form, zip: e.target.value })
                      }
                      className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment placeholder */}
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm mt-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard size={18} className="text-warm-gray-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-warm-gray-700">
                  Payment
                </h2>
              </div>
              <div className="bg-warm-gray-50 rounded-lg p-6 text-center text-sm text-warm-gray-500">
                <Lock size={20} className="mx-auto text-warm-gray-300 mb-2" />
                <p>Demo mode — no real payment required</p>
                <p className="text-xs text-warm-gray-400 mt-1">
                  Click &quot;Place Order&quot; to complete the demo checkout
                </p>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-6 bg-warm-gray-900 text-white py-4 text-sm tracking-wider uppercase font-medium hover:bg-warm-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <Lock size={14} />
                  Place Order — {formatPrice(total)}
                </>
              )}
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm sticky top-36">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-warm-gray-700 mb-6">
                Order Summary ({count} {count === 1 ? "item" : "items"})
              </h2>

              <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-3"
                  >
                    <div className="relative w-16 h-20 bg-warm-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-warm-gray-900 text-white text-[10px] rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-warm-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-warm-gray-400 mt-0.5">
                        {[item.size, item.color].filter(Boolean).join(" / ")}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-warm-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-warm-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray-500">Subtotal</span>
                  <span>{formatPrice(sub)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray-500">Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-3 border-t border-warm-gray-200">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {sub > 0 && sub < FREE_SHIPPING_THRESHOLD && (
                <p className="text-xs text-rose-500 mt-4 text-center">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - sub)} more for free shipping!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
