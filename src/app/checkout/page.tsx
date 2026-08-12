"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import {
  ChevronRight,
  Check,
  ShoppingBag,
  Truck,
  MessageCircle,
  Phone,
  Banknote,
  CreditCard,
  Shield,
  Package,
} from "lucide-react";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/lib/currency";
import { PAKISTAN_CITIES, getCityByName } from "@/lib/pakistan-cities";
import { printInvoice } from "@/components/InvoiceView";

export default function CheckoutPage() {
  const { items, subtotal, totalItems, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<"info" | "success">("info");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [trackingId, setTrackingId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank">("cod");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; discountPercent: number } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [referralValid, setReferralValid] = useState<boolean | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    area: "",
  });

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });
      if (res.ok) {
        const data = await res.json();
        setCouponApplied(data);
        setCouponError("");
      } else {
        const err = await res.json();
        setCouponError(err.error || "Invalid code");
        setCouponApplied(null);
      }
    } catch {
      setCouponError("Network error");
    } finally {
      setCouponLoading(false);
    }
  };

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
  const discountAmount = couponApplied ? Math.round(sub * couponApplied.discountPercent / 100) : 0;
  const afterDiscount = sub - discountAmount;
  const selectedCity = getCityByName(form.city);
  const cityShipping = selectedCity?.deliveryCharge || 300;
  const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : cityShipping;
  const total = afterDiscount + shipping;
  const count = totalItems();

  if (step === "success") {
    return (
      <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)] min-h-screen bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-600" />
          </div>
          <h1
            className="font-serif text-3xl text-warm-gray-900 mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Order Confirmed! 🎉
          </h1>
          <p className="text-warm-gray-600 mb-2">
            Aap ka order place ho gaya hai!
          </p>
          <p className="text-warm-gray-500 text-sm mb-6">
            Hum jaldi aap ko call karenge order confirm karne ke liye.
          </p>

          {/* Tracking ID Highlight */}
          <div className="bg-warm-gray-900 text-white rounded-xl p-6 mb-6">
            <p className="text-xs text-warm-gray-400 mb-1">Your Tracking ID</p>
            <p className="text-3xl font-mono font-bold tracking-wider">{trackingId}</p>
            <p className="text-xs text-warm-gray-400 mt-2">Ye ID save rakhein — order track karne ke liye chahiye hogi</p>
          </div>

          {/* Order Summary */}
          <div className="bg-warm-gray-50 rounded-xl p-6 text-left mb-6">
            <h3 className="font-semibold text-warm-gray-900 mb-3">Order Details:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-warm-gray-500">Tracking ID:</span>
                <span className="font-mono font-bold">{trackingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray-500">Payment Method:</span>
                <span className="font-medium">{paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray-500">Total Amount:</span>
                <span className="font-semibold text-rose-600">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warm-gray-500">Estimated Delivery:</span>
                <span>3-5 working days</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => printInvoice({
                trackingId, customerName: form.firstName, customerPhone: form.phone,
                shippingAddress: `${form.address}, ${form.area}, ${form.city}`,
                items: items.length > 0 ? items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })) : [],
                subtotal: String(sub), shipping: String(shipping), total: String(total),
                status: "pending", createdAt: new Date().toISOString(),
              })}
              className="flex items-center justify-center gap-2 bg-warm-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-warm-gray-800 transition-colors"
            >
              📄 Download Invoice PDF
            </button>
            <Link
              href={`/track?id=${trackingId}`}
              className="flex items-center justify-center gap-2 bg-rose-500 text-white py-3.5 rounded-xl font-semibold hover:bg-rose-600 transition-colors"
            >
              <Package size={18} /> Track Order
            </Link>
            <a
              href={`https://wa.me/923295578925?text=Order%20${trackingId}%20placed%20ho%20gaya%20hai.%20Please%20confirm.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={16} /> WhatsApp Par Confirm Karein
            </a>
          </div>

          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-warm-gray-500 hover:text-warm-gray-700 text-sm"
          >
            ← Continue Shopping
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
    if (!form.firstName || !form.phone || !form.address || !form.city) {
      alert("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: `${form.firstName} ${form.lastName}`.trim(),
          customerEmail: form.email || `${form.phone}@order.local`,
          customerPhone: form.phone,
          shippingAddress: `${form.address}, ${form.area}, ${form.city}`,
          referralCode: referralValid ? referralCode.trim() : null,
          paymentMethod,
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
        setTrackingId(order.trackingId);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-warm-gray-400 mb-6">
          <Link href="/shop" className="hover:text-warm-gray-600">
            Shop
          </Link>
          <ChevronRight size={12} />
          <span className="text-warm-gray-600">Checkout</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3 space-y-6">
            <h1
              className="font-serif text-2xl sm:text-3xl text-warm-gray-900"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Checkout
            </h1>

            {/* Contact Info */}
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-warm-gray-700 mb-4">
                Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-warm-gray-500 mb-1.5">
                    Naam *
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    placeholder="e.g., Ayesha"
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-warm-gray-500 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g., 0300-1234567"
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-warm-gray-500 mb-1.5">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="e.g., ayesha@example.com"
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Truck size={18} className="text-warm-gray-400" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-warm-gray-700">
                  Delivery Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs text-warm-gray-500 mb-1.5">
                    Complete Address *
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="House #, Street, Block"
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-warm-gray-500 mb-1.5">
                    Area / Town
                  </label>
                  <input
                    type="text"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    placeholder="e.g., DHA Phase 5"
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
                <div>
                  <label className="block text-xs text-warm-gray-500 mb-1.5">
                    City *
                  </label>
                  <select
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 bg-white"
                  >
                    <option value="">Select City</option>
                    {Object.entries(
                      PAKISTAN_CITIES.reduce((acc, c) => {
                        if (!acc[c.province]) acc[c.province] = [];
                        acc[c.province].push(c);
                        return acc;
                      }, {} as Record<string, typeof PAKISTAN_CITIES>)
                    ).map(([province, cities]) => (
                      <optgroup key={province} label={province}>
                        {cities.map((c) => (
                          <option key={c.name} value={c.name}>{c.name} ({c.postalCode})</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              {/* City-based delivery info */}
              {selectedCity && (
                <div className="mt-4 bg-blue-50 rounded-lg p-4 flex items-center gap-3">
                  <Truck className="text-blue-500 flex-shrink-0" size={20} />
                  <div className="text-sm">
                    <p className="text-blue-800 font-medium">
                      {selectedCity.name} — Delivery: {selectedCity.deliveryDays} din
                    </p>
                    <p className="text-blue-600 text-xs">
                      Postal Code: {selectedCity.postalCode} •
                      Shipping: {afterDiscount >= FREE_SHIPPING_THRESHOLD ? "FREE ✓" : formatPrice(selectedCity.deliveryCharge)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-warm-gray-700 mb-4">
                Payment Method
              </h2>

              <div className="space-y-3">
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    paymentMethod === "cod"
                      ? "border-green-500 bg-green-50"
                      : "border-warm-gray-200 hover:border-warm-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-5 h-5 accent-green-500"
                  />
                  <Banknote className={paymentMethod === "cod" ? "text-green-600" : "text-warm-gray-400"} size={24} />
                  <div className="flex-1">
                    <p className="font-medium text-warm-gray-900">Cash on Delivery (COD)</p>
                    <p className="text-xs text-warm-gray-500">Ghar par delivery ke waqt payment karein</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    Recommended
                  </span>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                    paymentMethod === "bank"
                      ? "border-blue-500 bg-blue-50"
                      : "border-warm-gray-200 hover:border-warm-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === "bank"}
                    onChange={() => setPaymentMethod("bank")}
                    className="w-5 h-5 accent-blue-500"
                  />
                  <CreditCard className={paymentMethod === "bank" ? "text-blue-600" : "text-warm-gray-400"} size={24} />
                  <div className="flex-1">
                    <p className="font-medium text-warm-gray-900">Bank Transfer / JazzCash / EasyPaisa</p>
                    <p className="text-xs text-warm-gray-500">Account details WhatsApp par mil jayenge</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-sm tracking-wider uppercase font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  <Check size={18} />
                  Confirm Order — {formatPrice(total)}
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-xs text-warm-gray-400">
              <span className="flex items-center gap-1"><Shield size={12} /> Secure</span>
              <span className="flex items-center gap-1"><Truck size={12} /> All Pakistan Delivery</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm sticky top-32">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-warm-gray-700 mb-4">
                Order Summary ({count} {count === 1 ? "item" : "items"})
              </h2>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.color}`}
                    className="flex gap-3"
                  >
                    <div className="relative w-14 h-16 bg-warm-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-warm-gray-900 text-white text-[10px] rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-warm-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-warm-gray-400">
                        {[item.size, item.color].filter(Boolean).join(" / ")}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-warm-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Referral Code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => { setReferralCode(e.target.value.toUpperCase()); setReferralValid(null); }}
                    placeholder="👥 Team Referral Code (optional)"
                    className={`flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 uppercase ${
                      referralValid === true ? "border-green-300 bg-green-50" :
                      referralValid === false ? "border-rose-300 bg-rose-50" :
                      "border-warm-gray-200"
                    }`}
                  />
                  <button
                    onClick={async () => {
                      if (!referralCode.trim()) return;
                      const res = await fetch("/api/auth/team/verify-code", {
                        method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code: referralCode }),
                      });
                      const data = await res.json();
                      setReferralValid(data.valid);
                    }}
                    disabled={!referralCode.trim()}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-40 whitespace-nowrap"
                  >
                    Check
                  </button>
                </div>
                {referralValid === true && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">✅ Valid referral code!</p>
                )}
                {referralValid === false && (
                  <p className="text-xs text-rose-500 mt-1">❌ Invalid code. Check karein.</p>
                )}
              </div>

              {/* Coupon Code */}
              <div className="mb-4">
                {couponApplied ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-green-600" />
                      <span className="text-sm text-green-700 font-medium">{couponApplied.code}</span>
                      <span className="text-xs text-green-600">(-{couponApplied.discountPercent}%)</span>
                    </div>
                    <button
                      onClick={() => { setCouponApplied(null); setCouponCode(""); }}
                      className="text-xs text-warm-gray-400 hover:text-rose-500"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                        placeholder="Discount Code"
                        className="flex-1 border border-warm-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 uppercase"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        className="bg-warm-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-warm-gray-800 disabled:opacity-50"
                      >
                        {couponLoading ? "..." : "Apply"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-xs text-rose-500 mt-1">{couponError}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-warm-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray-500">Subtotal</span>
                  <span>{formatPrice(sub)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount ({couponApplied.discountPercent}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-warm-gray-500">Delivery</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free ✓</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-warm-gray-200">
                  <span>Total</span>
                  <span className="text-rose-600">{formatPrice(total)}</span>
                </div>
              </div>

              {sub > 0 && sub < FREE_SHIPPING_THRESHOLD && (
                <p className="text-xs text-rose-500 mt-3 text-center">
                  {formatPrice(FREE_SHIPPING_THRESHOLD - sub)} aur add karein free delivery ke liye!
                </p>
              )}

              {/* Help */}
              <div className="mt-6 pt-4 border-t border-warm-gray-100">
                <p className="text-xs text-warm-gray-500 text-center mb-3">Koi sawal hai?</p>
                <a
                  href="https://wa.me/923295578925"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-50 text-green-700 py-2.5 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                >
                  <MessageCircle size={16} />
                  WhatsApp: 03295578925
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
