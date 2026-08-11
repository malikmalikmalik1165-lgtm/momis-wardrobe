"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, Package, Users, X, Save, LogIn, FolderOpen,
  ShoppingCart, Settings, Eye, MessageCircle, Percent, ToggleLeft, ToggleRight,
  Upload, Copy, Check, Search, Image as ImageIcon, Bell, RefreshCw,
} from "lucide-react";
import { formatPrice } from "@/lib/currency";

interface Product { id: number; sku: string | null; name: string; slug: string; description: string; price: string; compareAtPrice: string | null; categoryId: number | null; images: string[]; sizes: string[]; colors: string[]; inStock: boolean; featured: boolean; badge: string | null; }
interface Category { id: number; name: string; slug: string; description: string | null; image: string | null; }

type Tab = "products" | "orders" | "customers" | "team" | "requests" | "discounts" | "notifications" | "settings";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [pw, setPw] = useState("");
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState("");

  // Product add
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [pf, setPf] = useState({ name: "", price: "", comparePrice: "", desc: "", images: [] as string[], sizes: "", colors: "", badge: "", catId: "", featured: true, inStock: true });
  const [dragOver, setDragOver] = useState(false);
  const [pasteUrl, setPasteUrl] = useState("");

  // Notification
  const [nf, setNf] = useState({ title: "", body: "", url: "" });

  // Discount
  const [df, setDf] = useState({ code: "", percent: "", maxUses: "" });

  // Settings
  const [settings, setSettings] = useState({ storeName: "Momis Wardrobe", whatsapp: "03295578925", freeShipping: "5000", shippingRate: "250" });

  useEffect(() => {
    const s = localStorage.getItem("momis-admin-auth");
    if (s === "true") { setLoggedIn(true); load(); }
    else setLoading(false);
    const ss = localStorage.getItem("momis-settings");
    if (ss) setSettings(JSON.parse(ss));
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [p, c, o, r, d, cu, t, n] = await Promise.all([
        fetch("/api/products"), fetch("/api/categories"), fetch("/api/orders/list"),
        fetch("/api/join-requests"), fetch("/api/admin/discounts"),
        fetch("/api/admin/customers"), fetch("/api/admin/team"),
        fetch("/api/admin/notifications"),
      ]);
      setProducts(await p.json()); setCategories(await c.json());
      if (o.ok) setOrders(await o.json());
      if (r.ok) setRequests(await r.json());
      if (d.ok) setDiscounts(await d.json());
      if (cu.ok) setCustomers(await cu.json());
      if (t.ok) setTeamMembers(await t.json());
      if (n.ok) setNotifs(await n.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const login = () => {
    if (pw === "momidani") { setLoggedIn(true); localStorage.setItem("momis-admin-auth", "true"); load(); }
    else alert("Ghalat password!");
  };

  // Product functions
  const resetPf = () => setPf({ name: "", price: "", comparePrice: "", desc: "", images: [], sizes: "", colors: "", badge: "", catId: "", featured: true, inStock: true });

  const openAdd = () => { resetPf(); setEditId(null); setShowAdd(true); };

  const openEdit = (p: Product) => {
    setEditId(p.id);
    setPf({ name: p.name, price: p.price, comparePrice: p.compareAtPrice || "", desc: p.description, images: p.images || [], sizes: p.sizes?.join(", ") || "", colors: p.colors?.join(", ") || "", badge: p.badge || "", catId: p.categoryId?.toString() || "", featured: p.featured, inStock: p.inStock });
    setShowAdd(true);
  };

  const saveProd = async () => {
    if (!pf.name || !pf.price) { alert("Name aur price daalein"); return; }
    const body = {
      name: pf.name, price: pf.price, compareAtPrice: pf.comparePrice || null,
      description: pf.desc || pf.name, images: pf.images,
      sizes: pf.sizes ? pf.sizes.split(",").map(s => s.trim()).filter(Boolean) : [],
      colors: pf.colors ? pf.colors.split(",").map(s => s.trim()).filter(Boolean) : [],
      badge: pf.badge || null, categoryId: pf.catId ? parseInt(pf.catId) : null,
      featured: pf.featured, inStock: pf.inStock,
    };
    const url = editId ? `/api/admin/products/${editId}` : "/api/admin/products";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { alert(editId ? "Updated!" : "Product add ho gaya!"); setShowAdd(false); resetPf(); load(); }
    else alert("Error aayi");
  };

  const delProd = async (id: number) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/products/${id}`, { method: "DELETE" }); load(); };

  // Image paste from clipboard
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) setPf(prev => ({ ...prev, images: [...prev.images, reader.result as string] }));
          };
          reader.readAsDataURL(file);
        }
        e.preventDefault();
      }
      if (item.type === "text/plain") {
        item.getAsString((text) => {
          if (text.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)/i)) {
            setPf(prev => ({ ...prev, images: [...prev.images, text.trim()] }));
          }
        });
      }
    }
  };

  const addImageUrl = () => {
    if (pasteUrl.trim()) {
      setPf(prev => ({ ...prev, images: [...prev.images, pasteUrl.trim()] }));
      setPasteUrl("");
    }
  };

  const removeImage = (idx: number) => setPf(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const filteredProducts = searchQ ? products.filter(p => p.name.toLowerCase().includes(searchQ.toLowerCase()) || p.sku?.includes(searchQ)) : products;

  // ===== LOGIN =====
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-warm-gray-900 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mx-auto mb-3"><LogIn className="text-rose-500" size={24}/></div>
            <h1 className="font-bold text-xl text-warm-gray-900">Admin Panel</h1>
            <p className="text-xs text-warm-gray-400">Momis Wardrobe</p>
          </div>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Password" className="w-full border rounded-lg px-4 py-3 text-center mb-3 focus:outline-none focus:ring-2 focus:ring-rose-200" />
          <button onClick={login} className="w-full bg-warm-gray-900 text-white py-3 rounded-lg font-semibold hover:bg-warm-gray-800">Login</button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><RefreshCw className="animate-spin text-warm-gray-300" size={32}/></div>;

  // ===== MAIN =====
  return (
    <div className="min-h-screen bg-warm-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-lg">Momis <span className="text-rose-500">Admin</span></h1>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-xs text-warm-gray-500 hover:text-warm-gray-700 flex items-center gap-1"><Eye size={12}/> Store</a>
            <button onClick={() => load()} className="text-xs text-warm-gray-400 hover:text-warm-gray-600"><RefreshCw size={14}/></button>
            <button onClick={() => { localStorage.removeItem("momis-admin-auth"); setLoggedIn(false); }} className="text-xs text-rose-500">Logout</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {[
            { n: products.length, l: "Products", c: "text-rose-500" },
            { n: orders.length, l: "Orders", c: "text-green-500" },
            { n: customers.length, l: "Customers", c: "text-blue-500" },
            { n: teamMembers.length, l: "Team", c: "text-purple-500" },
            { n: requests.filter((r: any) => r.status === "pending").length, l: "Pending", c: "text-amber-500" },
            { n: discounts.length, l: "Codes", c: "text-pink-500" },
            { n: categories.length, l: "Categories", c: "text-teal-500" },
            { n: notifs.length, l: "Notifs", c: "text-orange-500" },
          ].map((s) => (
            <div key={s.l} className="bg-white rounded-lg p-2.5 text-center shadow-sm">
              <p className={`text-lg font-bold ${s.c}`}>{s.n}</p>
              <p className="text-[9px] text-warm-gray-400 uppercase">{s.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 mb-4 overflow-x-auto">
        <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
          {([
            { k: "products", l: "📦 Products" },
            { k: "orders", l: "🛒 Orders" },
            { k: "customers", l: "👤 Customers" },
            { k: "team", l: "👥 Team" },
            { k: "requests", l: "📝 Requests" },
            { k: "discounts", l: "🏷️ Discounts" },
            { k: "notifications", l: "📢 Notifs" },
            { k: "settings", l: "⚙️ Settings" },
          ] as { k: Tab; l: string }[]).map((t) => (
            <button key={t.k} onClick={() => setTab(t.k)}
              className={`flex-1 px-2 py-2 rounded-md text-[11px] font-semibold whitespace-nowrap transition-all ${tab === t.k ? "bg-warm-gray-900 text-white shadow" : "text-warm-gray-500 hover:text-warm-gray-700"}`}>
              {t.l}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20">

        {/* ═══ PRODUCTS ═══ */}
        {tab === "products" && (
          <div>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="flex-1 flex items-center bg-white rounded-lg border px-3 gap-2">
                <Search size={16} className="text-warm-gray-400" />
                <input type="text" value={searchQ} onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Search products..." className="flex-1 py-2.5 text-sm outline-none" />
              </div>
              <button onClick={openAdd} className="bg-rose-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-rose-600 flex items-center justify-center gap-1.5">
                <Plus size={16}/> Add Product
              </button>
              <button onClick={async () => { const r = await fetch("/api/admin/import-markaz",{method:"POST"}); const d = await r.json(); if(d.success) { alert(`${d.inserted} new, ${d.updated} updated!`); load(); } }}
                className="bg-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-700 flex items-center justify-center gap-1.5">
                ✨ Import Collection
              </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredProducts.map((p) => (
                <div key={p.id} className="bg-white rounded-xl border border-warm-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex gap-3 p-3">
                    {/* Image */}
                    <div className="relative w-16 h-20 bg-warm-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {p.images?.[0] ? (
                        <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="64px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><ImageIcon size={20} className="text-warm-gray-300"/></div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-warm-gray-900 truncate">{p.name}</h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {p.sku && <span className="text-[8px] font-mono bg-warm-gray-100 text-warm-gray-500 px-1 py-0.5 rounded">{p.sku}</span>}
                        {p.badge && <span className="text-[8px] bg-rose-100 text-rose-600 px-1 py-0.5 rounded">{p.badge}</span>}
                        {!p.inStock && <span className="text-[8px] bg-amber-100 text-amber-600 px-1 py-0.5 rounded">Out of Stock</span>}
                      </div>
                      <p className="text-sm font-bold text-warm-gray-900 mt-1">{formatPrice(p.price)}</p>
                      {p.compareAtPrice && <span className="text-[10px] text-warm-gray-400 line-through ml-1">{formatPrice(p.compareAtPrice)}</span>}
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex border-t border-warm-gray-50">
                    <button onClick={() => openEdit(p)} className="flex-1 py-2 text-xs text-blue-500 hover:bg-blue-50 flex items-center justify-center gap-1"><Pencil size={12}/> Edit</button>
                    <button onClick={() => delProd(p.id)} className="flex-1 py-2 text-xs text-rose-500 hover:bg-rose-50 flex items-center justify-center gap-1 border-l border-warm-gray-50"><Trash2 size={12}/> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ ORDERS ═══ */}
        {tab === "orders" && (
          <div className="space-y-3">
            {orders.length === 0 ? <div className="bg-white rounded-xl p-12 text-center text-warm-gray-400">Koi order nahi</div> : orders.map((o: any) => (
              <div key={o.id} className="bg-white rounded-xl border overflow-hidden">
                <div className="p-4 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-sm">{o.trackingId || `#${o.id}`}</span>
                      <select value={o.status} onChange={async (e) => { await fetch(`/api/admin/orders/${o.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({status:e.target.value})}); load(); }}
                        className="text-[10px] border rounded px-1.5 py-0.5 bg-white">
                        <option value="pending">⏳ Pending</option><option value="confirmed">✅ Confirmed</option>
                        <option value="processing">📦 Processing</option><option value="shipped">🚚 Shipped</option>
                        <option value="delivered">✓ Delivered</option><option value="cancelled">✕ Cancelled</option>
                      </select>
                    </div>
                    <p className="text-sm font-medium">{o.customerName}</p>
                    <p className="text-xs text-warm-gray-500">{o.customerPhone} · {o.shippingAddress}</p>
                    <p className="text-[10px] text-warm-gray-400 mt-1">{o.items?.map((i: any, idx: number) => `${i.name} x${i.quantity}`).join(" · ")}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatPrice(o.total)}</p>
                    <p className="text-[10px] text-warm-gray-400">{new Date(o.createdAt).toLocaleDateString("en-PK",{day:"numeric",month:"short"})}</p>
                  </div>
                </div>
                <div className="flex border-t border-warm-gray-50 text-xs">
                  <input type="text" placeholder="Courier" defaultValue={o.courierName||""} onBlur={async(e)=>{if(e.target.value!==(o.courierName||""))await fetch(`/api/admin/orders/${o.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({courierName:e.target.value})});load();}}
                    className="flex-1 px-3 py-2 border-r border-warm-gray-50 outline-none"/>
                  <input type="text" placeholder="Tracking #" defaultValue={o.courierTrackingId||""} onBlur={async(e)=>{if(e.target.value!==(o.courierTrackingId||""))await fetch(`/api/admin/orders/${o.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({courierTrackingId:e.target.value,courierName:o.courierName||"TCS"})});load();}}
                    className="flex-1 px-3 py-2 border-r border-warm-gray-50 outline-none"/>
                  {o.customerPhone && <a href={`https://wa.me/92${o.customerPhone.replace(/^0/,"")}`} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 text-green-600 hover:bg-green-50 font-medium flex items-center gap-1"><MessageCircle size={12}/> Notify</a>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ CUSTOMERS ═══ */}
        {tab === "customers" && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-4 py-3 bg-warm-gray-50 border-b font-bold text-sm">Customers ({customers.length})</div>
            {customers.map((c: any) => (
              <div key={c.id} className="px-4 py-3 flex items-center justify-between border-b border-warm-gray-50 hover:bg-warm-gray-50/50">
                <div>
                  <p className="font-medium text-sm">{c.name} {c.phoneVerified && <span className="text-green-500 text-[9px]">✓</span>}</p>
                  <p className="text-xs text-warm-gray-500">{c.phone} · {c.city || "—"} · {new Date(c.createdAt).toLocaleDateString("en-PK",{day:"numeric",month:"short"})}</p>
                </div>
                <div className="flex gap-1">
                  <a href={`https://wa.me/92${c.phone.replace(/^0/,"")}`} target="_blank" className="p-1.5 text-green-500 hover:bg-green-50 rounded"><MessageCircle size={14}/></a>
                  <button onClick={async()=>{if(!confirm("Delete?"))return;await fetch(`/api/admin/customers/${c.id}`,{method:"DELETE"});load();}} className="p-1.5 text-warm-gray-400 hover:text-rose-500 rounded"><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ TEAM ═══ */}
        {tab === "team" && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-4 py-3 bg-warm-gray-50 border-b font-bold text-sm">Team Members ({teamMembers.length})</div>
            {teamMembers.map((m: any) => (
              <div key={m.id} className="px-4 py-3 border-b border-warm-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm">{m.name}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${m.active?"bg-green-100 text-green-700":"bg-warm-gray-200 text-warm-gray-500"}`}>{m.active?"Active":"Inactive"}</span>
                    </div>
                    <p className="text-xs text-warm-gray-500">{m.phone} · {m.city||"—"} · Code: <span className="font-mono font-bold text-purple-600">{m.referralCode}</span></p>
                    <div className="flex gap-3 mt-1 text-[11px]">
                      <span className="text-green-600 font-semibold">{formatPrice(m.totalEarnings)}</span>
                      <span className="text-warm-gray-500">{m.totalSales} sales</span>
                      <span className="text-purple-500">{m.commissionPercent}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={async()=>{await fetch(`/api/admin/team/${m.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({active:!m.active})});load();}}
                      className="px-2 py-1 rounded text-[10px] font-medium bg-warm-gray-100 hover:bg-warm-gray-200">{m.active?"Deactivate":"Activate"}</button>
                    <button onClick={async()=>{const p=prompt("Commission %:",String(m.commissionPercent));if(p){await fetch(`/api/admin/team/${m.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({commissionPercent:parseInt(p)})});load();}}}
                      className="px-2 py-1 rounded text-[10px] font-medium bg-purple-50 text-purple-600 hover:bg-purple-100">Edit %</button>
                    <a href={`https://wa.me/92${m.phone.replace(/^0/,"")}`} target="_blank" className="p-1 text-green-500 hover:bg-green-50 rounded"><MessageCircle size={14}/></a>
                    <button onClick={async()=>{if(!confirm("Delete?"))return;await fetch(`/api/admin/team/${m.id}`,{method:"DELETE"});load();}} className="p-1 text-warm-gray-400 hover:text-rose-500 rounded"><Trash2 size={14}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ REQUESTS ═══ */}
        {tab === "requests" && (
          <div className="bg-white rounded-xl border overflow-hidden">
            <div className="px-4 py-3 bg-warm-gray-50 border-b font-bold text-sm">Join Requests ({requests.length})</div>
            {requests.map((r: any) => (
              <div key={r.id} className="px-4 py-3 border-b border-warm-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2"><p className="font-semibold text-sm">{r.name}</p>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${r.status==="approved"?"bg-green-100 text-green-700":r.status==="rejected"?"bg-rose-100 text-rose-600":"bg-amber-100 text-amber-700"}`}>{r.status}</span>
                    </div>
                    <p className="text-xs text-warm-gray-500">{r.phone} · {r.city}</p>
                    {r.message && <p className="text-xs text-warm-gray-400 italic mt-1">{r.message}</p>}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {r.status==="pending" && <>
                      <button onClick={async()=>{const res=await fetch(`/api/admin/join-requests/${r.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"approve"})});if(res.ok){const d=await res.json();alert(`Approved! Password: ${d.defaultPassword}`);load();}}}
                        className="px-2 py-1 rounded text-[10px] font-semibold bg-green-500 text-white hover:bg-green-600">Approve</button>
                      <button onClick={async()=>{await fetch(`/api/admin/join-requests/${r.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"reject"})});load();}}
                        className="px-2 py-1 rounded text-[10px] font-medium bg-warm-gray-200 hover:bg-warm-gray-300">Reject</button>
                    </>}
                    <a href={`https://wa.me/92${r.phone.replace(/^0/,"")}`} target="_blank" className="p-1 text-green-500 hover:bg-green-50 rounded"><MessageCircle size={14}/></a>
                    <button onClick={async()=>{if(!confirm("Delete?"))return;await fetch("/api/admin/join-requests",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:r.id})});load();}}
                      className="p-1 text-warm-gray-400 hover:text-rose-500 rounded"><Trash2 size={14}/></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ═══ DISCOUNTS ═══ */}
        {tab === "discounts" && (
          <div>
            <div className="bg-white rounded-xl border p-4 mb-4">
              <h3 className="font-bold text-sm mb-3">Create Discount Code</h3>
              <div className="flex gap-2">
                <input value={df.code} onChange={e=>setDf({...df,code:e.target.value.toUpperCase()})} placeholder="Code (e.g. MOMIS20)" className="flex-1 border rounded-lg px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-rose-200"/>
                <input type="number" value={df.percent} onChange={e=>setDf({...df,percent:e.target.value})} placeholder="% Off" className="w-20 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"/>
                <input type="number" value={df.maxUses} onChange={e=>setDf({...df,maxUses:e.target.value})} placeholder="Max uses" className="w-24 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"/>
                <button onClick={async()=>{if(!df.code||!df.percent)return;await fetch("/api/admin/discounts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:df.code,discountPercent:parseInt(df.percent),maxUses:df.maxUses?parseInt(df.maxUses):null})});setDf({code:"",percent:"",maxUses:""});load();}}
                  className="bg-rose-500 text-white px-4 rounded-lg text-sm font-semibold hover:bg-rose-600">Create</button>
              </div>
            </div>
            <div className="bg-white rounded-xl border overflow-hidden">
              {discounts.map((d: any) => (
                <div key={d.id} className="px-4 py-3 flex items-center justify-between border-b border-warm-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold bg-warm-gray-100 px-2 py-1 rounded text-sm">{d.code}</span>
                    <span className="text-rose-500 font-bold text-sm">{d.discountPercent}% OFF</span>
                    <span className="text-[10px] text-warm-gray-400">Used: {d.usedCount}{d.maxUses?`/${d.maxUses}`:""}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={async()=>{await fetch(`/api/admin/discounts/${d.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({active:!d.active})});load();}}
                      className={`p-1.5 rounded ${d.active?"text-green-500":"text-warm-gray-400"}`}>{d.active?<ToggleRight size={20}/>:<ToggleLeft size={20}/>}</button>
                    <button onClick={async()=>{if(!confirm("Delete?"))return;await fetch(`/api/admin/discounts/${d.id}`,{method:"DELETE"});load();}}
                      className="p-1.5 text-warm-gray-400 hover:text-rose-500 rounded"><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ NOTIFICATIONS ═══ */}
        {tab === "notifications" && (
          <div>
            <div className="bg-white rounded-xl border p-4 mb-4">
              <h3 className="font-bold text-sm mb-3">📢 Send Notification</h3>
              <input value={nf.title} onChange={e=>setNf({...nf,title:e.target.value})} placeholder="Title" className="w-full border rounded-lg px-3 py-2.5 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-rose-200"/>
              <textarea value={nf.body} onChange={e=>setNf({...nf,body:e.target.value})} rows={2} placeholder="Message..." className="w-full border rounded-lg px-3 py-2.5 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-rose-200"/>
              <div className="flex gap-2">
                <input value={nf.url} onChange={e=>setNf({...nf,url:e.target.value})} placeholder="Link (optional)" className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"/>
                <button onClick={async()=>{if(!nf.title||!nf.body)return;await fetch("/api/admin/notifications",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(nf)});setNf({title:"",body:"",url:""});load();}}
                  className="bg-rose-500 text-white px-5 rounded-lg text-sm font-semibold hover:bg-rose-600">Send</button>
              </div>
            </div>
            <div className="bg-white rounded-xl border overflow-hidden">
              {notifs.map((n: any) => (
                <div key={n.id} className="px-4 py-3 border-b border-warm-gray-50">
                  <p className="font-semibold text-sm">{n.title}</p>
                  <p className="text-xs text-warm-gray-500">{n.body}</p>
                  <p className="text-[10px] text-warm-gray-300 mt-1">{new Date(n.createdAt).toLocaleDateString("en-PK",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ SETTINGS ═══ */}
        {tab === "settings" && (
          <div className="bg-white rounded-xl border p-5 max-w-lg">
            <h3 className="font-bold text-sm mb-4">⚙️ Store Settings</h3>
            <div className="space-y-3">
              <div><label className="text-[10px] text-warm-gray-500 uppercase">Store Name</label><input value={settings.storeName} onChange={e=>setSettings({...settings,storeName:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-200"/></div>
              <div><label className="text-[10px] text-warm-gray-500 uppercase">WhatsApp Number</label><input value={settings.whatsapp} onChange={e=>setSettings({...settings,whatsapp:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-200"/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[10px] text-warm-gray-500 uppercase">Free Shipping (Rs.)</label><input type="number" value={settings.freeShipping} onChange={e=>setSettings({...settings,freeShipping:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-200"/></div>
                <div><label className="text-[10px] text-warm-gray-500 uppercase">Shipping Rate (Rs.)</label><input type="number" value={settings.shippingRate} onChange={e=>setSettings({...settings,shippingRate:e.target.value})} className="w-full border rounded-lg px-3 py-2.5 text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-rose-200"/></div>
              </div>
              <button onClick={()=>{localStorage.setItem("momis-settings",JSON.stringify(settings));alert("Saved!");}}
                className="bg-warm-gray-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-warm-gray-800">Save Settings</button>
            </div>
          </div>
        )}
      </div>

      {/* ═══ PRODUCT ADD/EDIT MODAL ═══ */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto" onPaste={handlePaste}>
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg">{editId ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setShowAdd(false)} className="p-1.5 hover:bg-warm-gray-100 rounded-full"><X size={18}/></button>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Images — Paste & Drop Zone */}
              <div>
                <label className="text-xs font-semibold text-warm-gray-700 mb-2 block">📸 Images (Paste ya URL daalein)</label>

                {/* Existing images */}
                {pf.images.length > 0 && (
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {pf.images.map((img, i) => (
                      <div key={i} className="relative w-20 h-24 rounded-lg overflow-hidden border bg-warm-gray-100 group">
                        {img.startsWith("data:") ? (
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                        )}
                        <button onClick={() => removeImage(i)}
                          className="absolute top-0.5 right-0.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={10}/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Paste zone */}
                <div className="border-2 border-dashed border-warm-gray-200 rounded-xl p-4 text-center hover:border-rose-300 transition-colors cursor-pointer"
                  onClick={() => document.getElementById("img-url-input")?.focus()}>
                  <Upload size={24} className="mx-auto text-warm-gray-300 mb-2"/>
                  <p className="text-xs text-warm-gray-500 mb-1"><strong>Ctrl+V</strong> se image paste karein</p>
                  <p className="text-[10px] text-warm-gray-400">Ya WhatsApp/browser se image copy karke yahan paste karein</p>
                </div>

                {/* URL input */}
                <div className="flex gap-2 mt-2">
                  <input id="img-url-input" type="url" value={pasteUrl} onChange={e => setPasteUrl(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addImageUrl()}
                    placeholder="Image URL paste karein..." className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"/>
                  <button onClick={addImageUrl} disabled={!pasteUrl.trim()}
                    className="bg-warm-gray-900 text-white px-4 rounded-lg text-sm font-medium disabled:opacity-30">Add</button>
                </div>
              </div>

              {/* Name & Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-warm-gray-700 mb-1 block">Product Name *</label>
                  <input value={pf.name} onChange={e => setPf({...pf, name: e.target.value})}
                    placeholder="e.g., Embroidered Chiffon Suit" className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-warm-gray-700 mb-1 block">Price (Rs.) *</label>
                  <input type="number" value={pf.price} onChange={e => setPf({...pf, price: e.target.value})}
                    placeholder="e.g., 3500" className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"/>
                </div>
              </div>

              {/* Compare Price & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-warm-gray-700 mb-1 block">Compare Price (optional)</label>
                  <input type="number" value={pf.comparePrice} onChange={e => setPf({...pf, comparePrice: e.target.value})}
                    placeholder="Purani price for sale" className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-warm-gray-700 mb-1 block">Category</label>
                  <select value={pf.catId} onChange={e => setPf({...pf, catId: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-200">
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-warm-gray-700 mb-1 block">Description</label>
                <textarea value={pf.desc} onChange={e => setPf({...pf, desc: e.target.value})} rows={2}
                  placeholder="Product details..." className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"/>
              </div>

              {/* Sizes, Colors, Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-warm-gray-700 mb-1 block">Sizes</label>
                  <input value={pf.sizes} onChange={e => setPf({...pf, sizes: e.target.value})}
                    placeholder="S, M, L, XL" className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-warm-gray-700 mb-1 block">Colors</label>
                  <input value={pf.colors} onChange={e => setPf({...pf, colors: e.target.value})}
                    placeholder="Black, Red" className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-warm-gray-700 mb-1 block">Badge</label>
                  <input value={pf.badge} onChange={e => setPf({...pf, badge: e.target.value})}
                    placeholder="New, Sale..." className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"/>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={pf.featured} onChange={e => setPf({...pf, featured: e.target.checked})} className="accent-rose-500 w-4 h-4"/><span className="text-sm">Featured</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={pf.inStock} onChange={e => setPf({...pf, inStock: e.target.checked})} className="accent-green-500 w-4 h-4"/><span className="text-sm">In Stock</span></label>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t flex gap-3">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-3 border rounded-lg text-sm font-medium text-warm-gray-600 hover:bg-warm-gray-50">Cancel</button>
              <button onClick={saveProd} className="flex-1 py-3 bg-rose-500 text-white rounded-lg text-sm font-bold hover:bg-rose-600 flex items-center justify-center gap-1.5">
                <Save size={16}/> {editId ? "Update" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
