"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, ShoppingBag, Heart, LogOut, Package, Phone, MapPin, ChevronRight, Trash2, Eye, EyeOff, KeyRound, Shield } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { showToast } from "@/components/Toast";

interface Customer { id: number; name: string; phone: string; city: string | null; address: string | null; wishlist: number[]; }
interface Order { id: number; trackingId: string; total: string; status: string; items: { name: string; quantity: number; price: number; image?: string }[]; createdAt: string; }
interface Product { id: number; name: string; slug: string; price: string; images: string[]; }

type AuthMode = "login" | "register" | "forgot" | "reset";

export default function AccountPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [tab, setTab] = useState<"orders" | "wishlist">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishProducts, setWishProducts] = useState<Product[]>([]);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", password: "", city: "" });

  // OTP states
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("momis-customer");
    if (saved) { const c = JSON.parse(saved); setCustomer(c); loadOrders(c); loadWishlist(c); }
  }, []);

  const loadOrders = async (c: Customer) => {
    const res = await fetch("/api/auth/customer/orders", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: c.id, phone: c.phone }),
    });
    if (res.ok) setOrders(await res.json());
  };

  const loadWishlist = async (c: Customer) => {
    if (!c.wishlist?.length) return;
    const res = await fetch("/api/products");
    if (res.ok) {
      const all = await res.json();
      setWishProducts(all.filter((p: Product) => c.wishlist.includes(p.id)));
    }
  };

  const clearError = () => setErrorMsg("");

  const sendOtp = async () => {
    if (!form.phone || form.phone.length < 10) { setErrorMsg("Valid phone number daalein"); return; }
    setLoading(true); clearError();
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone, purpose: authMode === "register" ? "register" : "reset" }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(data.otp);
        setOtpStep(true);
        // Open WhatsApp to send OTP to customer for FREE
        if (data.whatsappLink) {
          window.open(data.whatsappLink, "_blank");
        }
        showToast("WhatsApp khul raha hai — OTP customer ko bhejein!", "success");
      } else {
        setErrorMsg(data.error);
      }
    } catch { setErrorMsg("Network error. Internet check karein."); }
    finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    if (otpCode.length !== 4) { setErrorMsg("4-digit OTP daalein"); return; }
    if (otpCode !== otpSent) { setErrorMsg("Ghalat OTP. Dobara check karein."); return; }
    setLoading(true); clearError();
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone, code: otpCode }),
      });
      if (res.ok) {
        setOtpVerified(true);
        showToast("Phone number verified! ✓", "success");
        if (authMode === "forgot") setAuthMode("reset");
      } else { setErrorMsg("OTP verify nahi hua. Dobara try karein."); }
    } catch { setErrorMsg("Error aayi"); }
    finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 4) { setErrorMsg("Password kam az kam 4 characters ka ho"); return; }
    setLoading(true); clearError();
    try {
      const res = await fetch("/api/auth/customer/reset-password", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form.phone, newPassword }),
      });
      if (res.ok) {
        showToast("Password change ho gaya! Ab login karein.", "success");
        setAuthMode("login"); setForm({ ...form, password: "" }); setOtpStep(false); setOtpVerified(false); setOtpCode("");
      } else { const d = await res.json(); setErrorMsg(d.error); }
    } catch { setErrorMsg("Error aayi"); }
    finally { setLoading(false); }
  };

  const handleAuth = async () => {
    clearError();
    if (authMode === "login" && (!form.phone || !form.password)) { setErrorMsg("Phone aur password daalein"); return; }
    if (authMode === "register") {
      if (!form.name) { setErrorMsg("Apna naam likhein"); return; }
      if (!form.phone || form.phone.length < 10) { setErrorMsg("Valid phone number daalein"); return; }
      if (!form.password || form.password.length < 4) { setErrorMsg("Password kam az kam 4 characters ka ho"); return; }
      if (!otpVerified) { setErrorMsg("Pehle OTP se phone verify karein"); return; }
    }
    setLoading(true);
    try {
      const url = authMode === "login" ? "/api/auth/customer/login" : "/api/auth/customer/register";
      const res = await fetch(url, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, phone: form.phone.replace(/[^0-9]/g, "") }),
      });
      const data = await res.json();
      if (res.ok) {
        setCustomer(data);
        localStorage.setItem("momis-customer", JSON.stringify(data));
        loadOrders(data); loadWishlist(data);
        showToast(`Welcome, ${data.name}! 🎉`, "success");
      } else {
        setErrorMsg(data.error);
      }
    } catch { setErrorMsg("Network error. Internet check karein."); }
    finally { setLoading(false); }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!customer) return;
    await fetch("/api/auth/customer/wishlist", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: customer.id, productId, action: "remove" }),
    });
    const updated = { ...customer, wishlist: customer.wishlist.filter((id) => id !== productId) };
    setCustomer(updated);
    localStorage.setItem("momis-customer", JSON.stringify(updated));
    setWishProducts(wishProducts.filter((p) => p.id !== productId));
    showToast("Wishlist se remove ho gaya", "info");
  };

  const logout = () => { localStorage.removeItem("momis-customer"); setCustomer(null); setOrders([]); showToast("Logout ho gaye", "info"); };

  const switchMode = (mode: AuthMode) => { setAuthMode(mode); clearError(); setOtpStep(false); setOtpVerified(false); setOtpCode(""); };

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-purple-100 text-purple-700", shipped: "bg-orange-100 text-orange-700",
    out_for_delivery: "bg-cyan-100 text-cyan-700", delivered: "bg-green-100 text-green-700",
    cancelled: "bg-rose-100 text-rose-700",
  };

  // ==================== LOGIN / REGISTER / FORGOT SCREEN ====================
  if (!customer) {
    return (
      <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)] min-h-screen bg-gradient-to-b from-rose-50 to-white flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md border border-warm-gray-100">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-200">
              {authMode === "forgot" || authMode === "reset" ? (
                <KeyRound className="text-white" size={28} />
              ) : (
                <User className="text-white" size={28} />
              )}
            </div>
            <h1 className="font-serif text-2xl text-warm-gray-900">
              {authMode === "login" ? "Welcome Back! 👋" : authMode === "register" ? "Account Banayein ✨" : authMode === "forgot" ? "Password Reset 🔑" : "Naya Password Set Karein"}
            </h1>
            <p className="text-warm-gray-400 text-sm mt-1">Momis Wardrobe</p>
          </div>

          {/* Error Message - In page, VIP style */}
          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-fade-in">
              <span className="text-lg leading-none">⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-3">
            {/* ===== REGISTER ===== */}
            {authMode === "register" && (
              <>
                <input type="text" value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); clearError(); }}
                  placeholder="👤 Aap ka naam" className="w-full border border-warm-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-shadow" />

                <div className="flex gap-2">
                  <input type="tel" value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); clearError(); }}
                    placeholder="📞 Phone (03001234567)" disabled={otpVerified}
                    className="flex-1 border border-warm-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-200 disabled:bg-green-50 disabled:border-green-300 transition-shadow" />
                  {!otpVerified ? (
                    <button onClick={sendOtp} disabled={loading || !form.phone}
                      className="bg-warm-gray-900 text-white px-4 rounded-xl text-sm font-medium disabled:opacity-40 whitespace-nowrap hover:bg-warm-gray-800 transition-colors">
                      {otpStep ? "Resend" : "Send OTP"}
                    </button>
                  ) : (
                    <span className="flex items-center text-green-600 text-sm font-semibold px-3 bg-green-50 rounded-xl border border-green-200">
                      <Shield size={14} className="mr-1" /> Verified
                    </span>
                  )}
                </div>

                {otpStep && !otpVerified && (
                  <div className="flex gap-2">
                    <input type="text" value={otpCode} onChange={(e) => { setOtpCode(e.target.value.replace(/[^0-9]/g, "")); clearError(); }}
                      placeholder="● ● ● ●" maxLength={4}
                      className="flex-1 border border-warm-gray-200 rounded-xl px-4 py-3.5 text-center text-xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-green-200 transition-shadow" />
                    <button onClick={verifyOtp} disabled={loading || otpCode.length !== 4}
                      className="bg-green-500 text-white px-6 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-green-600 transition-colors">
                      ✓ Verify
                    </button>
                  </div>
                )}

                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); clearError(); }}
                    placeholder="🔒 Password banayein (4+ chars)" className="w-full border border-warm-gray-200 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-shadow" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray-400 hover:text-warm-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="🏙️ City (optional)" className="w-full border border-warm-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-shadow" />

                <button onClick={handleAuth} disabled={loading || !otpVerified}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3.5 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 disabled:opacity-40 transition-all shadow-lg shadow-rose-200 disabled:shadow-none">
                  {loading ? "Please wait..." : "Register ✨"}
                </button>
              </>
            )}

            {/* ===== LOGIN ===== */}
            {authMode === "login" && (
              <>
                <input type="tel" value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); clearError(); }}
                  placeholder="📞 Phone number" className="w-full border border-warm-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-shadow" />

                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); clearError(); }}
                    onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                    placeholder="🔒 Password" className="w-full border border-warm-gray-200 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-shadow" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray-400 hover:text-warm-gray-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="text-right">
                  <button onClick={() => switchMode("forgot")} className="text-xs text-rose-500 hover:text-rose-600 font-medium">
                    Password bhool gaye? 🔑
                  </button>
                </div>

                <button onClick={handleAuth} disabled={loading}
                  className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3.5 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-600 disabled:opacity-40 transition-all shadow-lg shadow-rose-200">
                  {loading ? "Please wait..." : "Login →"}
                </button>
              </>
            )}

            {/* ===== FORGOT PASSWORD ===== */}
            {authMode === "forgot" && (
              <>
                <p className="text-sm text-warm-gray-500 text-center mb-2">
                  Apna registered phone number daalein. OTP aayega.
                </p>
                <div className="flex gap-2">
                  <input type="tel" value={form.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value }); clearError(); }}
                    placeholder="📞 Phone number" disabled={otpStep}
                    className="flex-1 border border-warm-gray-200 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-200 disabled:bg-warm-gray-50 transition-shadow" />
                  {!otpStep && (
                    <button onClick={sendOtp} disabled={loading}
                      className="bg-warm-gray-900 text-white px-5 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-warm-gray-800 transition-colors">
                      Send OTP
                    </button>
                  )}
                </div>

                {otpStep && !otpVerified && (
                  <div className="flex gap-2">
                    <input type="text" value={otpCode} onChange={(e) => { setOtpCode(e.target.value.replace(/[^0-9]/g, "")); clearError(); }}
                      placeholder="● ● ● ●" maxLength={4}
                      className="flex-1 border border-warm-gray-200 rounded-xl px-4 py-3.5 text-center text-xl tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-green-200 transition-shadow" />
                    <button onClick={verifyOtp} disabled={loading || otpCode.length !== 4}
                      className="bg-green-500 text-white px-6 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-green-600 transition-colors">
                      Verify
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ===== RESET PASSWORD ===== */}
            {authMode === "reset" && (
              <>
                <p className="text-sm text-green-600 text-center mb-2">✓ Phone verified! Ab naya password set karein.</p>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => { setNewPassword(e.target.value); clearError(); }}
                    placeholder="🔒 Naya password (4+ chars)" className="w-full border border-warm-gray-200 rounded-xl px-4 py-3.5 pr-12 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-shadow" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <button onClick={handleResetPassword} disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3.5 rounded-xl font-semibold disabled:opacity-40 transition-all shadow-lg shadow-green-200">
                  {loading ? "..." : "Password Reset Karein ✓"}
                </button>
              </>
            )}

            {/* Switch modes */}
            <div className="pt-2 text-center space-y-2">
              {authMode !== "login" && (
                <button onClick={() => switchMode("login")} className="block w-full text-sm text-warm-gray-500 hover:text-rose-500">
                  ← Login par wapas jayein
                </button>
              )}
              {authMode === "login" && (
                <button onClick={() => switchMode("register")} className="block w-full text-sm text-warm-gray-500 hover:text-rose-500">
                  Account nahi hai? <span className="font-semibold text-rose-500">Register karein ✨</span>
                </button>
              )}
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-6 pt-4 border-t border-warm-gray-100 text-center">
            <p className="text-[10px] text-warm-gray-400 flex items-center justify-center gap-1">
              <Shield size={10} /> Aap ka data encrypted aur secure hai
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==================== DASHBOARD SCREEN ====================
  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)] min-h-screen bg-warm-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-6 shadow-lg shadow-rose-200 mb-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold backdrop-blur-sm">
                {customer.name[0]}
              </div>
              <div>
                <h1 className="font-semibold text-lg">{customer.name}</h1>
                <p className="text-rose-100 text-sm flex items-center gap-1"><Phone size={12} /> {customer.phone}</p>
                {customer.city && <p className="text-rose-200 text-xs flex items-center gap-1"><MapPin size={10} /> {customer.city}</p>}
              </div>
            </div>
            <button onClick={logout} className="text-white/70 hover:text-white flex items-center gap-1 text-sm bg-white/10 px-3 py-1.5 rounded-lg">
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button onClick={() => setTab("orders")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === "orders" ? "bg-warm-gray-900 text-white shadow-lg" : "bg-white text-warm-gray-600 hover:bg-warm-gray-50"}`}>
            <Package size={16} /> Orders ({orders.length})
          </button>
          <button onClick={() => setTab("wishlist")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${tab === "wishlist" ? "bg-rose-500 text-white shadow-lg shadow-rose-200" : "bg-white text-warm-gray-600 hover:bg-warm-gray-50"}`}>
            <Heart size={16} /> Wishlist ({customer.wishlist?.length || 0})
          </button>
        </div>

        {/* Orders */}
        {tab === "orders" && (
          orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <ShoppingBag className="mx-auto text-warm-gray-200 mb-4" size={48} />
              <p className="text-warm-gray-500 mb-2">Abhi tak koi order nahi</p>
              <Link href="/shop" className="inline-block bg-warm-gray-900 text-white px-6 py-3 rounded-xl text-sm font-medium mt-4 hover:bg-warm-gray-800">Shop Now →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link key={order.id} href={`/track?id=${order.trackingId}`}
                  className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden group">
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-warm-gray-900">{order.trackingId}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || "bg-warm-gray-100"}`}>
                          {order.status}
                        </span>
                      </div>
                      <span className="font-bold text-warm-gray-900">{formatPrice(order.total)}</span>
                    </div>
                    <div className="text-xs text-warm-gray-500">
                      {order.items.map((item, i) => (
                        <span key={i}>{item.name} x{item.quantity}{i < order.items.length - 1 ? " • " : ""}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-warm-gray-400">{new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span className="text-xs text-rose-500 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">Track <ChevronRight size={12} /></span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}

        {/* Wishlist */}
        {tab === "wishlist" && (
          wishProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <Heart className="mx-auto text-warm-gray-200 mb-4" size={48} />
              <p className="text-warm-gray-500 mb-2">Wishlist khaali hai</p>
              <Link href="/shop" className="inline-block bg-rose-500 text-white px-6 py-3 rounded-xl text-sm font-medium mt-4 hover:bg-rose-600">Shop Now ❤️</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {wishProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <Link href={`/product/${product.slug}`}>
                    <div className="relative aspect-[3/4] bg-warm-gray-100">
                      {product.images[0] && <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="200px" />}
                    </div>
                  </Link>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-warm-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm font-bold text-rose-500">{formatPrice(product.price)}</p>
                    <button onClick={() => removeFromWishlist(product.id)}
                      className="mt-2 w-full flex items-center justify-center gap-1 text-xs text-warm-gray-400 hover:text-rose-500 py-1.5 border border-warm-gray-200 rounded-lg hover:border-rose-200 transition-colors">
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
