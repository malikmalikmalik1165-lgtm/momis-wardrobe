"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, LogOut, Wallet, ShoppingBag, Copy, Check, TrendingUp, MessageCircle, Share2, BookOpen, ChevronRight, Star, Phone, Gift } from "lucide-react";
import { formatPrice } from "@/lib/currency";

interface Member { id: number; name: string; phone: string; referralCode: string; totalEarnings: string; totalSales: number; commissionPercent: number; }
interface ReferralOrder { trackingId: string; total: string; status: string; createdAt: string; customerName: string; }

export default function TeamPage() {
  const [member, setMember] = useState<Member | null>(null);
  const [referralOrders, setReferralOrders] = useState<ReferralOrder[]>([]);
  const [tab, setTab] = useState<"dashboard" | "guide" | "share">("dashboard");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", password: "", city: "" });

  useEffect(() => {
    const saved = localStorage.getItem("momis-team");
    if (saved) { const m = JSON.parse(saved); setMember(m); loadStats(m.id); }
  }, []);

  const loadStats = async (id: number) => {
    const res = await fetch("/api/auth/team/stats", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: id }),
    });
    if (res.ok) { const data = await res.json(); setReferralOrders(data.orders); if(data.member) setMember(prev => prev ? {...prev, ...data.member} : prev); }
  };

  const handleAuth = async () => {
    if (authMode === "register" && (!form.name || !form.phone || !form.password)) { alert("Sab fields bharein"); return; }
    if (authMode === "login" && (!form.phone || !form.password)) { alert("Phone aur password dein"); return; }
    setLoading(true);
    try {
      const url = authMode === "login" ? "/api/auth/team/login" : "/api/auth/team/register";
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { const data = await res.json(); setMember(data); localStorage.setItem("momis-team", JSON.stringify(data)); loadStats(data.id); }
      else { const err = await res.json(); alert(err.error || "Error"); }
    } catch { alert("Network error"); }
    finally { setLoading(false); }
  };

  const copyCode = () => { if (member) { navigator.clipboard.writeText(member.referralCode); setCopied(true); setTimeout(() => setCopied(false), 2000); } };
  const shareLink = member ? `https://momis-wardrobe-vert.vercel.app/shop?ref=${member.referralCode}` : "";
  const logout = () => { localStorage.removeItem("momis-team"); setMember(null); };

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-rose-50 flex items-center justify-center px-4 pt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="text-purple-600" size={28} />
            </div>
            <h1 className="font-serif text-2xl text-warm-gray-900">
              {authMode === "login" ? "Team Login" : "Team Join Karein"}
            </h1>
            <p className="text-warm-gray-400 text-sm mt-2">Momis Wardrobe Earning Program</p>
          </div>
          <div className="space-y-4">
            {authMode === "register" && (
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Aap ka naam" className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200" />
            )}
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="WhatsApp number" className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200" />
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              placeholder="Password banayein" className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200" />
            {authMode === "register" && (
              <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="City" className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-200" />
            )}
            <button onClick={handleAuth} disabled={loading}
              className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50">
              {loading ? "..." : authMode === "login" ? "Login" : "Join Team"}
            </button>
            <button onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
              className="w-full text-sm text-warm-gray-500 hover:text-purple-600">
              {authMode === "login" ? "Naye ho? Team join karein" : "Pehle se member ho? Login karein"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-rose-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="font-serif text-xl">Team Dashboard</h1>
            <button onClick={logout} className="text-white/70 hover:text-white flex items-center gap-1 text-sm"><LogOut size={14} /> Logout</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">{member.name[0]}</div>
            <div>
              <p className="font-semibold text-lg">{member.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/70">Code:</span>
                <span className="font-mono font-bold bg-white/20 px-2 py-0.5 rounded">{member.referralCode}</span>
                <button onClick={copyCode} className="text-white/70 hover:text-white">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 -mt-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <Wallet className="mx-auto text-green-500 mb-1" size={20} />
            <p className="text-lg font-bold text-warm-gray-900">{formatPrice(member.totalEarnings)}</p>
            <p className="text-[10px] text-warm-gray-400">Total Earnings</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <ShoppingBag className="mx-auto text-blue-500 mb-1" size={20} />
            <p className="text-lg font-bold text-warm-gray-900">{member.totalSales}</p>
            <p className="text-[10px] text-warm-gray-400">Total Sales</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <TrendingUp className="mx-auto text-purple-500 mb-1" size={20} />
            <p className="text-lg font-bold text-warm-gray-900">{member.commissionPercent}%</p>
            <p className="text-[10px] text-warm-gray-400">Commission</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { key: "dashboard", label: "Dashboard", icon: TrendingUp },
            { key: "guide", label: "Guide", icon: BookOpen },
            { key: "share", label: "Share & Earn", icon: Share2 },
          ].map((t) => (
            <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap ${tab === t.key ? "bg-purple-600 text-white" : "bg-white text-warm-gray-600"}`}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === "dashboard" && (
          <div>
            <h2 className="font-semibold text-warm-gray-900 mb-4">Aap Ke Through Orders</h2>
            {referralOrders.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <ShoppingBag className="mx-auto text-warm-gray-200 mb-3" size={40} />
                <p className="text-warm-gray-400 mb-2">Abhi tak koi order nahi aaya</p>
                <p className="text-xs text-warm-gray-300">Products share karein aur earning shuru karein!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {referralOrders.map((o) => (
                  <div key={o.trackingId} className="bg-white rounded-xl p-4 shadow-sm flex justify-between items-center">
                    <div>
                      <p className="font-mono font-bold text-sm text-warm-gray-900">{o.trackingId}</p>
                      <p className="text-xs text-warm-gray-400">{o.customerName} • {new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-warm-gray-900">{formatPrice(o.total)}</p>
                      <p className="text-xs text-green-600">+{formatPrice(parseFloat(o.total) * member.commissionPercent / 100)} earning</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Guide */}
        {tab === "guide" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-warm-gray-900 mb-4 flex items-center gap-2">
                <BookOpen size={18} className="text-purple-500" /> Kaise Kaam Karta Hai?
              </h2>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Apna Referral Code Share Karein", desc: `Aap ka code: ${member.referralCode}. Jab koi customer order kare to checkout mein ye code dale.`, icon: "🔗" },
                  { step: "2", title: "Products Share Karein", desc: "WhatsApp, Facebook, Instagram par products ke links share karein apne friends aur family ko.", icon: "📱" },
                  { step: "3", title: "Commission Kamayein", desc: `Har successful order par aap ko ${member.commissionPercent}% commission milega!`, icon: "💰" },
                  { step: "4", title: "Payment Lein", desc: "Monthly basis par aap ki earnings JazzCash/EasyPaisa par transfer ho jaayengi.", icon: "🏦" },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-lg flex-shrink-0">{item.icon}</div>
                    <div>
                      <h3 className="font-medium text-warm-gray-900">{item.title}</h3>
                      <p className="text-sm text-warm-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-rose-500 rounded-xl p-6 text-white">
              <h3 className="font-semibold mb-3">💡 Pro Tips:</h3>
              <ul className="space-y-2 text-sm text-white/90">
                <li>✓ Daily 5-10 products share karein WhatsApp status par</li>
                <li>✓ Product ki acchi photo ke saath price bhi likhein</li>
                <li>✓ Customer ko apna referral code zaroor dein</li>
                <li>✓ New arrivals sabse pehle share karein</li>
                <li>✓ Sale items zyada bechte hain — un par focus karein</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-warm-gray-900 mb-3">Koi Sawal?</h3>
              <a href="https://wa.me/923295578925?text=Team%20member%20hoon%20mujhe%20help%20chahiye" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600">
                <MessageCircle size={16} /> WhatsApp Support
              </a>
            </div>
          </div>
        )}

        {/* Share */}
        {tab === "share" && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-warm-gray-900 mb-4">Apna Link Share Karein</h2>
              <div className="bg-warm-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-warm-gray-500 mb-1">Share Link:</p>
                <p className="text-sm font-mono text-warm-gray-900 break-all">{shareLink}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { navigator.clipboard.writeText(shareLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-warm-gray-900 text-white py-3 rounded-lg text-sm font-medium">
                  {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy Link</>}
                </button>
                <a href={`https://wa.me/?text=${encodeURIComponent(`Momis Wardrobe par shopping karein! 🛍️\n\nBest quality fashion at amazing prices!\n👇 Ye link se order karein:\n${shareLink}\n\nCheckout mein code: ${member.referralCode} daalein!`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-lg text-sm font-medium">
                  <MessageCircle size={14} /> WhatsApp Share
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-warm-gray-900 mb-3">Referral Code</h3>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-3xl font-mono font-bold text-purple-600 mb-2">{member.referralCode}</p>
                <p className="text-xs text-warm-gray-500">Customer ko kahein ke checkout mein ye code daalein</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-warm-gray-900 mb-3">Quick Share Products</h3>
              <Link href="/shop" className="flex items-center justify-center gap-2 bg-rose-500 text-white py-3 rounded-lg font-medium hover:bg-rose-600">
                <ShoppingBag size={16} /> Products Dekhen & Share Karein
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="h-20" />
    </div>
  );
}
