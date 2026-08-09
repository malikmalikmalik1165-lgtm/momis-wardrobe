"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users, LogOut, Wallet, ShoppingBag, Copy, Check, TrendingUp, MessageCircle,
  Share2, BookOpen, Gift, Eye, ExternalLink, Star, Phone, ArrowRight,
  BarChart3, Target, Award, Zap, Clock, ChevronRight,
} from "lucide-react";
import { formatPrice } from "@/lib/currency";

interface Member {
  id: number; name: string; phone: string; referralCode: string;
  totalEarnings: string; totalSales: number; commissionPercent: number;
}
interface ReferralOrder {
  trackingId: string; total: string; status: string; createdAt: string; customerName: string;
}
interface Product {
  id: number; name: string; slug: string; price: string; images: string[];
  compareAtPrice: string | null; badge: string | null;
}

type Tab = "dashboard" | "products" | "guide" | "rewards";

export default function TeamPage() {
  const [member, setMember] = useState<Member | null>(null);
  const [referralOrders, setReferralOrders] = useState<ReferralOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", password: "", city: "" });

  useEffect(() => {
    const saved = localStorage.getItem("momis-team");
    if (saved) { const m = JSON.parse(saved); setMember(m); loadStats(m.id); loadProducts(); }
  }, []);

  const loadStats = async (id: number) => {
    const res = await fetch("/api/auth/team/stats", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: id }),
    });
    if (res.ok) {
      const data = await res.json();
      setReferralOrders(data.orders);
      if (data.member) setMember((prev) => prev ? { ...prev, ...data.member } : prev);
    }
  };

  const loadProducts = async () => {
    const res = await fetch("/api/products");
    if (res.ok) setProducts(await res.json());
  };

  const handleAuth = async () => {
    if (authMode === "register" && (!form.name || !form.phone || !form.password)) { alert("Sab fields bharein"); return; }
    if (authMode === "login" && (!form.phone || !form.password)) { alert("Phone aur password dein"); return; }
    setLoading(true);
    try {
      const url = authMode === "login" ? "/api/auth/team/login" : "/api/auth/team/register";
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) {
        const data = await res.json();
        setMember(data); localStorage.setItem("momis-team", JSON.stringify(data));
        loadStats(data.id); loadProducts();
      } else { const err = await res.json(); alert(err.error || "Error"); }
    } catch { alert("Network error"); }
    finally { setLoading(false); }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text); setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const shareProduct = (product: Product) => {
    if (!member) return;
    const markup = Math.round(parseFloat(product.price) * 0.15);
    const sellingPrice = parseFloat(product.price) + markup;
    const msg = `✨ *${product.name}*\n💰 Price: Rs. ${sellingPrice.toLocaleString()}\n🚚 Free delivery Rs. 5,000+\n💵 Cash on Delivery\n\n👉 Order karein:\nmomis-wardrobe-vert.vercel.app/product/${product.slug}\n\nCheckout mein code: *${member.referralCode}* zaroor daalein!\n\nMomis Wardrobe 🛍️`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const logout = () => { localStorage.removeItem("momis-team"); setMember(null); };
  const shareLink = member ? `momis-wardrobe-vert.vercel.app/shop?ref=${member.referralCode}` : "";
  const earnings = parseFloat(member?.totalEarnings || "0");
  const level = (member?.totalSales || 0) >= 100 ? "👑 Royal" : (member?.totalSales || 0) >= 50 ? "💎 Diamond" : (member?.totalSales || 0) >= 25 ? "🥇 Gold" : (member?.totalSales || 0) >= 10 ? "🥈 Silver" : (member?.totalSales || 0) >= 3 ? "🥉 Bronze" : "⭐ Starter";

  // ========== LOGIN / REGISTER ==========
  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-rose-900 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* Hero Text */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Momis Wardrobe</h1>
            <p className="text-purple-200 text-lg">Reseller Platform</p>
            <p className="text-purple-300/70 text-sm mt-2">Products share karein, commission kamayein — bina investment ke!</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl p-6">
            <div className="flex bg-warm-gray-100 rounded-xl p-1 mb-6">
              <button onClick={() => setAuthMode("login")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${authMode === "login" ? "bg-white shadow text-warm-gray-900" : "text-warm-gray-500"}`}>
                Login
              </button>
              <button onClick={() => setAuthMode("register")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${authMode === "register" ? "bg-white shadow text-warm-gray-900" : "text-warm-gray-500"}`}>
                Join Team
              </button>
            </div>

            <div className="space-y-3">
              {authMode === "register" && (
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full Name" className="w-full border border-warm-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200" />
              )}
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="WhatsApp Number" className="w-full border border-warm-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200" />
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && handleAuth()}
                placeholder="Password" className="w-full border border-warm-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200" />
              {authMode === "register" && (
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="City" className="w-full border border-warm-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200" />
              )}
              <button onClick={handleAuth} disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-rose-500 text-white py-3.5 rounded-xl font-bold hover:shadow-lg disabled:opacity-50 transition-all">
                {loading ? "..." : authMode === "login" ? "Login →" : "Join Team ✨"}
              </button>
            </div>

            {/* Benefits */}
            {authMode === "register" && (
              <div className="mt-6 pt-5 border-t border-warm-gray-100 grid grid-cols-3 gap-3 text-center">
                <div><p className="text-lg">💰</p><p className="text-[10px] text-warm-gray-500">10-20% Commission</p></div>
                <div><p className="text-lg">🚫</p><p className="text-[10px] text-warm-gray-500">Zero Investment</p></div>
                <div><p className="text-lg">📱</p><p className="text-[10px] text-warm-gray-500">Work from Home</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ========== MAIN DASHBOARD ==========
  return (
    <div className="min-h-screen bg-warm-gray-50">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-purple-700 to-rose-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center font-bold">{member.name[0]}</div>
              <div>
                <p className="font-semibold text-sm">{member.name}</p>
                <p className="text-white/60 text-[10px]">{level}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-white/70 hover:text-white text-xs flex items-center gap-1"><Eye size={12} /> Store</Link>
              <button onClick={logout} className="text-white/70 hover:text-white text-xs flex items-center gap-1"><LogOut size={12} /> Logout</button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-xl font-bold">{formatPrice(earnings)}</p>
              <p className="text-[9px] text-white/60 uppercase tracking-wider">Earnings</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-xl font-bold">{member.totalSales}</p>
              <p className="text-[9px] text-white/60 uppercase tracking-wider">Sales</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
              <p className="text-xl font-bold">{member.commissionPercent}%</p>
              <p className="text-[9px] text-white/60 uppercase tracking-wider">Commission</p>
            </div>
          </div>

          {/* Referral Code */}
          <div className="mt-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[9px] text-white/60 uppercase tracking-wider">Your Referral Code</p>
              <p className="font-mono font-bold text-lg">{member.referralCode}</p>
            </div>
            <button onClick={() => copyText(member.referralCode, "code")}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-xs font-semibold transition-colors">
              {copied === "code" ? "Copied! ✓" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 mt-4 overflow-x-auto">
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm">
          {[
            { key: "dashboard" as Tab, label: "Dashboard", icon: BarChart3 },
            { key: "products" as Tab, label: "Products", icon: ShoppingBag },
            { key: "guide" as Tab, label: "How to Sell", icon: BookOpen },
            { key: "rewards" as Tab, label: "Rewards", icon: Gift },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                tab === t.key ? "bg-purple-600 text-white shadow" : "text-warm-gray-500 hover:text-warm-gray-700"
              }`}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 pb-24">

        {/* ===== DASHBOARD ===== */}
        {tab === "dashboard" && (
          <div className="space-y-4">
            {/* Share Link Card */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-bold text-warm-gray-900 text-sm mb-3 flex items-center gap-2"><Share2 size={16} className="text-purple-500" /> Apna Link Share Karein</h3>
              <div className="bg-warm-gray-50 rounded-lg px-3 py-2.5 text-xs font-mono text-warm-gray-600 mb-3 break-all">{shareLink}</div>
              <div className="flex gap-2">
                <button onClick={() => copyText(shareLink, "link")}
                  className="flex-1 bg-warm-gray-900 text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5">
                  {copied === "link" ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
                </button>
                <a href={`https://wa.me/?text=${encodeURIComponent(`Momis Wardrobe par best fashion deals! 🛍️\n\n${shareLink}\n\nCheckout mein code *${member.referralCode}* daalein!`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5">
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-warm-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-warm-gray-900 text-sm">Aap Ke Orders</h3>
                <span className="text-xs text-warm-gray-400">{referralOrders.length} total</span>
              </div>
              {referralOrders.length === 0 ? (
                <div className="py-10 text-center">
                  <ShoppingBag className="mx-auto text-warm-gray-200 mb-2" size={32} />
                  <p className="text-warm-gray-400 text-sm">Abhi koi order nahi aaya</p>
                  <p className="text-warm-gray-300 text-xs mt-1">Products share karein aur earning shuru karein!</p>
                </div>
              ) : (
                <div className="divide-y divide-warm-gray-50">
                  {referralOrders.slice(0, 10).map((o) => (
                    <div key={o.trackingId} className="px-4 py-3 flex items-center justify-between">
                      <div>
                        <p className="font-mono text-xs font-bold text-warm-gray-900">{o.trackingId}</p>
                        <p className="text-[10px] text-warm-gray-400">{o.customerName} • {new Date(o.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-warm-gray-900">{formatPrice(o.total)}</p>
                        <p className="text-[10px] text-green-600 font-semibold">+{formatPrice(parseFloat(o.total) * member.commissionPercent / 100)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== PRODUCTS (Markaz Style) ===== */}
        {tab === "products" && (
          <div>
            <p className="text-xs text-warm-gray-500 mb-4">Products select karein → WhatsApp par share karein → Customer order kare → Commission kamayein! 💰</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {products.map((p) => {
                const markup = Math.round(parseFloat(p.price) * 0.15);
                const yourPrice = parseFloat(p.price) + markup;
                return (
                  <div key={p.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-warm-gray-100">
                    <div className="relative aspect-square bg-warm-gray-50">
                      {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="200px" />}
                      {p.badge && <span className="absolute top-2 left-2 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded">{p.badge}</span>}
                    </div>
                    <div className="p-2.5">
                      <h3 className="text-[11px] font-medium text-warm-gray-800 line-clamp-2 leading-tight min-h-[28px]">{p.name}</h3>
                      <div className="mt-1.5 space-y-0.5">
                        <p className="text-[10px] text-warm-gray-400">Base: {formatPrice(p.price)}</p>
                        <p className="text-xs font-bold text-purple-600">Sell at: {formatPrice(yourPrice)}</p>
                        <p className="text-[9px] text-green-600 font-semibold">Your Profit: {formatPrice(markup)}</p>
                      </div>
                      <button onClick={() => shareProduct(p)}
                        className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-green-600 transition-colors">
                        <MessageCircle size={12} /> Share & Sell
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ===== HOW TO SELL ===== */}
        {tab === "guide" && (
          <div className="space-y-4">
            {/* Steps */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-bold text-warm-gray-900 mb-4">📋 Kaise Sell Karein — 4 Steps</h2>
              {[
                { n: "1", icon: "👀", title: "Products Dekhen", desc: "Products tab mein sab products hain. Dekhen kaunsa bechna hai." },
                { n: "2", icon: "📱", title: "WhatsApp Par Share Karein", desc: "\"Share & Sell\" button se product WhatsApp contacts, groups aur status par share karein." },
                { n: "3", icon: "🛒", title: "Customer Order Kare", desc: "Customer website par jaye aur checkout mein aap ka referral code daale." },
                { n: "4", icon: "💰", title: "Commission Milega!", desc: `Har order par ${member.commissionPercent}% commission automatic aap ke account mein.` },
              ].map((s) => (
                <div key={s.n} className="flex gap-4 items-start mb-4 last:mb-0">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">{s.icon}</div>
                  <div>
                    <h3 className="font-semibold text-warm-gray-900 text-sm">{s.title}</h3>
                    <p className="text-xs text-warm-gray-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-purple-600 to-rose-500 rounded-xl p-5 text-white">
              <h3 className="font-bold mb-3">⚡ Pro Tips — Zyada Sell Kaise Karein</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>✓ Daily 5-10 products WhatsApp status par lagayein</li>
                <li>✓ Price ke saath product share karein (button auto karta hai)</li>
                <li>✓ Groups mein deals share karein — "limited stock" likhein</li>
                <li>✓ Customer ko bataein COD hai — koi risk nahi</li>
                <li>✓ New arrivals sabse pehle share karein</li>
                <li>✓ Testimonials share karein — trust barhta hai</li>
              </ul>
            </div>

            {/* WhatsApp Support */}
            <div className="bg-white rounded-xl shadow-sm p-5 text-center">
              <p className="text-sm text-warm-gray-700 mb-3">Koi sawal? Team support se baat karein</p>
              <a href="https://wa.me/923295578925?text=Team%20member%20hoon%20mujhe%20help%20chahiye" target="_blank"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-green-600">
                <MessageCircle size={16} /> WhatsApp Support
              </a>
            </div>
          </div>
        )}

        {/* ===== REWARDS ===== */}
        {tab === "rewards" && (
          <div className="space-y-4">
            {/* Level Card */}
            <div className="bg-gradient-to-br from-purple-600 via-rose-500 to-pink-500 rounded-2xl p-6 text-white text-center">
              <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">Your Level</p>
              <p className="text-4xl mb-1">{level.split(" ")[0]}</p>
              <h2 className="text-xl font-bold">{level.split(" ").slice(1).join(" ")}</h2>
              <p className="text-white/60 text-xs mt-1">{member.totalSales} Sales</p>
              {member.totalSales < 100 && (
                <div className="mt-4 max-w-xs mx-auto">
                  <div className="bg-white/20 rounded-full h-2.5 w-full">
                    <div className="bg-white rounded-full h-2.5 transition-all"
                      style={{ width: `${Math.min(100, (member.totalSales / (member.totalSales >= 50 ? 100 : member.totalSales >= 25 ? 50 : member.totalSales >= 10 ? 25 : member.totalSales >= 3 ? 10 : 3)) * 100)}%` }} />
                  </div>
                  <p className="text-white/50 text-[9px] mt-1.5">
                    Next: {member.totalSales >= 50 ? "100 sales → 👑 Royal" : member.totalSales >= 25 ? "50 → 💎 Diamond" : member.totalSales >= 10 ? "25 → 🥇 Gold" : member.totalSales >= 3 ? "10 → 🥈 Silver" : "3 → 🥉 Bronze"}
                  </p>
                </div>
              )}
            </div>

            {/* Tiers */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-warm-gray-50 border-b border-warm-gray-100">
                <h3 className="text-sm font-bold text-warm-gray-900">🏆 Milestones & Prizes</h3>
              </div>
              {[
                { sales: 3, lvl: "🥉 Bronze", reward: "Rs. 500 Welcome Bonus", pct: "10%", done: member.totalSales >= 3 },
                { sales: 10, lvl: "🥈 Silver", reward: "Rs. 2,000 + Free Product", pct: "12%", done: member.totalSales >= 10 },
                { sales: 25, lvl: "🥇 Gold", reward: "Rs. 5,000 + Certificate", pct: "15%", done: member.totalSales >= 25 },
                { sales: 50, lvl: "💎 Diamond", reward: "Rs. 15,000 + Gift Hamper", pct: "18%", done: member.totalSales >= 50 },
                { sales: 100, lvl: "👑 Royal", reward: "Rs. 50,000 + Gold Certificate + VIP", pct: "20%", done: member.totalSales >= 100 },
              ].map((t) => (
                <div key={t.sales} className={`px-4 py-3 flex items-center gap-3 border-b border-warm-gray-50 ${t.done ? "bg-green-50/50" : ""}`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${t.done ? "bg-green-100" : "bg-warm-gray-100"}`}>
                    {t.done ? "✅" : t.lvl.split(" ")[0]}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-warm-gray-900">{t.lvl} <span className="text-warm-gray-400 font-normal text-xs">({t.sales} sales)</span></p>
                    <p className="text-[11px] text-warm-gray-500">{t.reward}</p>
                  </div>
                  <span className="text-[10px] text-purple-600 font-bold">{t.pct}</span>
                </div>
              ))}
            </div>

            {/* Monthly Bonus */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-bold text-warm-gray-900 mb-3 text-sm">🎁 Monthly Bonuses</h3>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { icon: "🏅", title: "Top Seller", desc: "#1 of month", prize: "Rs. 10,000" },
                  { icon: "📈", title: "Rising Star", desc: "Most growth", prize: "Rs. 5,000" },
                  { icon: "🤝", title: "Team Builder", desc: "5+ referrals", prize: "Rs. 3,000" },
                ].map((b) => (
                  <div key={b.title} className="bg-warm-gray-50 rounded-xl p-3 text-center">
                    <p className="text-xl">{b.icon}</p>
                    <p className="font-bold text-warm-gray-900 text-[11px] mt-1">{b.title}</p>
                    <p className="text-[9px] text-warm-gray-400">{b.desc}</p>
                    <p className="text-rose-500 font-bold text-xs mt-1">{b.prize}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Claim */}
            <div className="bg-green-50 rounded-xl p-5 text-center">
              <p className="text-sm text-warm-gray-700 mb-3">Reward claim karna hai?</p>
              <a href={`https://wa.me/923295578925?text=${encodeURIComponent(`Assalam o Alaikum! Main ${member.name} (${member.referralCode}). ${member.totalSales} sales hain. Reward claim karna hai.`)}`}
                target="_blank" className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm">
                <MessageCircle size={16} /> Claim on WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
