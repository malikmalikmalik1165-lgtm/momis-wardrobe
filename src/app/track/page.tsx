"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Package,
  CheckCircle,
  Truck,
  Clock,
  MapPin,
  MessageCircle,
  Phone,
  XCircle,
  Box,
  CircleDot,
} from "lucide-react";
import { formatPrice } from "@/lib/currency";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface StatusEntry {
  status: string;
  date: string;
  note?: string;
}

interface TrackedOrder {
  trackingId: string;
  customerName: string;
  shippingAddress: string;
  items: OrderItem[];
  total: string;
  status: string;
  courierName: string | null;
  courierTrackingId: string | null;
  statusHistory: StatusEntry[];
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Package }> = {
  pending: { label: "Order Received", color: "text-yellow-500", icon: Clock },
  confirmed: { label: "Confirmed", color: "text-blue-500", icon: CheckCircle },
  processing: { label: "Processing", color: "text-purple-500", icon: Box },
  shipped: { label: "Shipped", color: "text-orange-500", icon: Truck },
  out_for_delivery: { label: "Out for Delivery", color: "text-green-500", icon: MapPin },
  delivered: { label: "Delivered", color: "text-green-600", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-rose-500", icon: XCircle },
};

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];

export default function TrackPage() {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState<TrackedOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/track?id=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        setOrders([]);
        setError("Koi order nahi mila. Tracking ID ya phone number check karein.");
      }
    } catch {
      setError("Network error. Dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => STATUS_STEPS.indexOf(status);

  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)] min-h-screen bg-warm-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-warm-gray-900 to-warm-gray-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">
          <Package className="mx-auto mb-4" size={36} />
          <h1
            className="font-serif text-3xl sm:text-4xl mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Track Your Order
          </h1>
          <p className="text-warm-gray-400 mb-8">
            Apna Tracking ID ya Phone Number daalein
          </p>

          {/* Search Box */}
          <div className="max-w-lg mx-auto flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g., MW-ABC123 ya 03001234567"
              className="flex-1 bg-white text-warm-gray-900 rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 placeholder-warm-gray-400"
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-4 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Search size={18} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <XCircle className="mx-auto text-warm-gray-300 mb-4" size={48} />
            <p className="text-warm-gray-600 mb-4">{error}</p>
            <a
              href="https://wa.me/923295578925?text=Mera%20order%20track%20nahi%20ho%20raha"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-green-600"
            >
              <MessageCircle size={16} /> WhatsApp Par Poochein
            </a>
          </div>
        )}

        {orders.map((order) => {
          const currentStep = getStepIndex(order.status);
          const isCancelled = order.status === "cancelled";
          const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;

          return (
            <div key={order.trackingId} className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              {/* Order Header */}
              <div className="bg-warm-gray-50 px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-warm-gray-100">
                <div>
                  <p className="text-xs text-warm-gray-400">Tracking ID</p>
                  <p className="font-mono font-bold text-warm-gray-900 text-lg">{order.trackingId}</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  isCancelled ? "bg-rose-100 text-rose-600" : order.status === "delivered" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                }`}>
                  <config.icon size={16} />
                  {config.label}
                </div>
              </div>

              {/* Progress Steps */}
              {!isCancelled && (
                <div className="px-5 py-6">
                  <div className="flex items-center justify-between relative">
                    {/* Line */}
                    <div className="absolute top-4 left-5 right-5 h-0.5 bg-warm-gray-200">
                      <div
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${Math.max(0, (currentStep / (STATUS_STEPS.length - 1)) * 100)}%` }}
                      />
                    </div>

                    {STATUS_STEPS.map((step, i) => {
                      const stepConfig = STATUS_CONFIG[step];
                      const isComplete = i <= currentStep;
                      const isCurrent = i === currentStep;

                      return (
                        <div key={step} className="relative flex flex-col items-center z-10">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isComplete
                                ? "bg-green-500 text-white"
                                : "bg-warm-gray-200 text-warm-gray-400"
                            } ${isCurrent ? "ring-4 ring-green-200" : ""}`}
                          >
                            {isComplete ? <CheckCircle size={16} /> : i + 1}
                          </div>
                          <span className={`text-[9px] sm:text-[10px] mt-2 text-center leading-tight max-w-[60px] ${
                            isComplete ? "text-green-600 font-medium" : "text-warm-gray-400"
                          }`}>
                            {stepConfig.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Courier Info */}
              {order.courierName && (
                <div className="px-5 pb-4">
                  <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
                    <Truck className="text-blue-500" size={20} />
                    <div>
                      <p className="text-sm font-medium text-warm-gray-900">
                        Courier: {order.courierName}
                      </p>
                      {order.courierTrackingId && (
                        <p className="text-xs text-warm-gray-500">
                          Tracking #: <span className="font-mono font-medium">{order.courierTrackingId}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="px-5 pb-4">
                <h3 className="text-xs font-semibold text-warm-gray-500 uppercase tracking-wider mb-3">
                  Order Timeline
                </h3>
                <div className="space-y-3">
                  {[...order.statusHistory].reverse().map((entry, i) => {
                    const entryConfig = STATUS_CONFIG[entry.status] || STATUS_CONFIG.pending;
                    return (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <CircleDot size={14} className={i === 0 ? "text-green-500" : "text-warm-gray-300"} />
                          {i < order.statusHistory.length - 1 && (
                            <div className="w-px h-full bg-warm-gray-200 my-1" />
                          )}
                        </div>
                        <div className="pb-3">
                          <p className="text-sm font-medium text-warm-gray-900">{entry.note || entryConfig.label}</p>
                          <p className="text-xs text-warm-gray-400">
                            {new Date(entry.date).toLocaleDateString("en-PK", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className="px-5 py-4 border-t border-warm-gray-100">
                <h3 className="text-xs font-semibold text-warm-gray-500 uppercase tracking-wider mb-3">
                  Items
                </h3>
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm py-1">
                    <span className="text-warm-gray-600">{item.name} x{item.quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-base font-bold pt-3 mt-2 border-t border-warm-gray-100">
                  <span>Total</span>
                  <span className="text-rose-600">{formatPrice(order.total)}</span>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="px-5 py-4 bg-warm-gray-50 border-t border-warm-gray-100">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-warm-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-warm-gray-900">{order.customerName}</p>
                    <p className="text-xs text-warm-gray-500">{order.shippingAddress}</p>
                  </div>
                </div>
              </div>

              {/* Help */}
              <div className="px-5 py-4 flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/923295578925?text=Order%20${order.trackingId}%20ke%20baare%20mein%20poochna%20hai`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-600"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <a
                  href="tel:03295578925"
                  className="flex-1 flex items-center justify-center gap-2 border border-warm-gray-200 text-warm-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-warm-gray-50"
                >
                  <Phone size={16} /> Call
                </a>
              </div>
            </div>
          );
        })}

        {/* No Search Yet */}
        {!searched && !error && (
          <div className="text-center py-12">
            <p className="text-warm-gray-400 mb-6">
              Apna Tracking ID checkout ke baad milta hai
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center gap-2 bg-warm-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium"
              >
                Shop Now
              </Link>
              <a
                href="https://wa.me/923295578925?text=Mera%20order%20track%20karna%20hai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg text-sm font-medium"
              >
                <MessageCircle size={16} /> WhatsApp Help
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
