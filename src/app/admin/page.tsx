"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import * as XLSX from "xlsx";
import {
  Plus, Pencil, Trash2, Package, Users, X, Save, LogIn, FolderOpen,
  ShoppingCart, Settings, Eye, MessageCircle, Percent, ToggleLeft, ToggleRight,
  Upload, Copy, Check, Search, Image as ImageIcon, Bell, RefreshCw,
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { printInvoice } from "@/components/InvoiceView";

interface Product { id: number; sku: string | null; name: string; slug: string; description: string; price: string; compareAtPrice: string | null; categoryId: number | null; images: string[]; sizes: string[]; colors: string[]; inStock: boolean; featured: boolean; badge: string | null; }
interface Category { id: number; name: string; slug: string; description: string | null; image: string | null; }

type Tab = "products" | "categories" | "orders" | "customers" | "team" | "requests" | "discounts" | "notifications" | "settings";

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
  const [orderSearch, setOrderSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("all");

  // Product add
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [pf, setPf] = useState({ name: "", price: "", comparePrice: "", desc: "", images: [] as string[], sizes: "", colors: "", badge: "", catId: "", featured: true, inStock: true });
  const [dragOver, setDragOver] = useState(false);
  const [pasteUrl, setPasteUrl] = useState("");

  // Excel bulk import
  const [importing, setImporting] = useState(false);

  // Notification
  const [nf, setNf] = useState({ title: "", body: "", url: "" });

  // Category management
  const [showCatForm, setShowCatForm] = useState(false);
  const [editCatId, setEditCatId] = useState<number | null>(null);
  const [cf, setCf] = useState({ name: "", description: "", image: "" });

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

  const [saving, setSaving] = useState(false);
  const saveProd = async () => {
    if (!pf.name) { alert("Product name likhein"); return; }
    if (!pf.price) { alert("Price daalein"); return; }
    if (saving) return;
    setSaving(true);
    // Only keep URL images, skip large base64
    const safeImages = pf.images.filter(img => !img.startsWith("data:") || img.length < 200000);
    try {
      const url = editId ? `/api/admin/products/${editId}` : "/api/admin/products";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: pf.name,
          price: String(pf.price),
          compareAtPrice: pf.comparePrice ? String(pf.comparePrice) : null,
          description: pf.desc || pf.name,
          images: safeImages,
          sizes: pf.sizes ? pf.sizes.split(",").map(s => s.trim()).filter(Boolean) : [],
          colors: pf.colors ? pf.colors.split(",").map(s => s.trim()).filter(Boolean) : [],
          badge: pf.badge || null,
          categoryId: pf.catId ? parseInt(pf.catId) : null,
          featured: pf.featured,
          inStock: pf.inStock,
        }),
      });
      if (res.ok) {
        setShowAdd(false);
        resetPf();
        load();
        alert(editId ? "✅ Product updated!" : "✅ Product add ho gaya!");
      } else {
        const err = await res.json().catch(() => ({ error: "Server error" }));
        alert("❌ " + (err.error || "Product add nahi hua — dobara try karein"));
      }
    } catch {
      alert("❌ Network error — internet check karein");
    } finally {
      setSaving(false);
    }
  };

  const delProd = async (id: number) => { if (!confirm("Delete?")) return; await fetch(`/api/admin/products/${id}`, { method: "DELETE" }); load(); };

  // Image handling — paste, drag, file, URL
  const addImageFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => { if (reader.result) setPf(prev => ({ ...prev, images: [...prev.images, reader.result as string] })); };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) addImageFromFile(file);
        e.preventDefault();
      }
      if (item.type === "text/plain") {
        item.getAsString((text) => {
          const t = text.trim();
          if (t.match(/^https?:\/\/.+/i)) setPf(prev => ({ ...prev, images: [...prev.images, t] }));
        });
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    const files = e.dataTransfer?.files;
    if (files) for (const file of Array.from(files)) { if (file.type.startsWith("image/")) addImageFromFile(file); }
    const text = e.dataTransfer?.getData("text/plain");
    if (text?.match(/^https?:\/\/.+/i)) setPf(prev => ({ ...prev, images: [...prev.images, text.trim()] }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) for (const file of Array.from(files)) { if (file.type.startsWith("image/")) addImageFromFile(file); }
    e.target.value = "";
  };

  const addImageUrl = () => {
    if (pasteUrl.trim()) {
      setPf(prev => ({ ...prev, images: [...prev.images, pasteUrl.trim()] }));
      setPasteUrl("");
    }
  };

  const removeImage = (idx: number) => setPf(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  // Excel bulk import
  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setImporting(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const mapped = rows.map((r) => ({
        name: r.Name,
        price: r.Price,
        comparePrice: r.ComparePrice,
        description: r.Description,
        category: r.Category,
        sizes: r.Sizes,
        colors: r.Colors,
        images: r.Images,
        badge: r.Badge,
        featured: r.Featured,
        inStock: r.InStock,
        sku: r.SKU,
      }));

      const res = await fetch("/api/admin/products/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: mapped }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ ${data.inserted} products add ho gaye!${data.skipped ? `\n⚠️ ${data.skipped} skip hue.` : ""}${data.errors?.length ? "\n\n" + data.errors.slice(0, 5).join("\n") : ""}`);
        load();
      } else {
        alert("❌ " + (data.error || "Import fail ho gaya"));
      }
    } catch {
      alert("❌ Excel file parse nahi ho saki — sahi format check karein");
    } finally {
      setImporting(false);
    }
  };

  // Certificate generator — EDITABLE
  const generateCertificate = (memberName: string, type: string, customDate?: string) => {
    // Ask for editable fields
    const editName = prompt("Certificate par naam likhein:", memberName);
    if (!editName) return;
    const editDate = prompt("Date likhein:", customDate || new Date().toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" }));
    if (!editDate) return;
    const customNote = prompt("Extra note (optional — blank chor sakte hain):", "");
    memberName = editName;
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    const date = editDate;
    const certId = `MW-CERT-${Date.now().toString(36).toUpperCase()}`;
    const noteHtml = customNote ? `<p style="font-size:12px;color:#57534e;margin-top:12px;font-style:italic">"${customNote}"</p>` : "";
    const titles: Record<string, { title: string; sub: string; color: string }> = {
      welcome: { title: "Welcome Certificate", sub: "Official Team Member — Momis Wardrobe", color: "#0f766e" },
      completion: { title: "Certificate of Completion", sub: "Social Media Marketing Training", color: "#1e40af" },
      performance: { title: "Certificate of Excellence", sub: "Outstanding Sales Performance", color: "#065f46" },
      appreciation: { title: "Certificate of Appreciation", sub: "Dedicated Team Member", color: "#9f1239" },
      top_seller: { title: "Top Seller Award", sub: "Monthly Best Performer", color: "#92400e" },
      rising_star: { title: "Rising Star Award", sub: "Fastest Growing Member", color: "#5b21b6" },
    };
    const cert = titles[type] || titles.appreciation;

    w.document.write(`<!DOCTYPE html><html><head><title>Certificate - ${memberName}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#f5f5f4;font-family:'Georgia',serif}
.cert{width:800px;background:white;border:3px solid ${cert.color};padding:12px;position:relative}
.cert-inner{border:2px solid ${cert.color}44;padding:50px 60px;text-align:center;position:relative;min-height:520px}
.corner{position:absolute;width:40px;height:40px;border:3px solid ${cert.color}}
.tl{top:8px;left:8px;border-right:none;border-bottom:none}
.tr{top:8px;right:8px;border-left:none;border-bottom:none}
.bl{bottom:8px;left:8px;border-right:none;border-top:none}
.br{bottom:8px;right:8px;border-left:none;border-top:none}
.logo{font-size:16px;color:#a8a29e;letter-spacing:3px;text-transform:uppercase;margin-bottom:20px}
.logo b{color:${cert.color}}
.title{font-size:32px;color:${cert.color};margin:10px 0;font-weight:400;letter-spacing:2px}
.sub{font-size:14px;color:#78716c;letter-spacing:1px;margin-bottom:30px}
.presented{font-size:12px;color:#a8a29e;text-transform:uppercase;letter-spacing:3px}
.name{font-size:38px;color:#1c1917;margin:15px 0;font-style:italic;border-bottom:2px solid ${cert.color}33;padding-bottom:10px;display:inline-block;min-width:350px}
.desc{font-size:13px;color:#57534e;line-height:1.8;max-width:500px;margin:20px auto}
.footer{display:flex;justify-content:space-between;align-items:flex-end;margin-top:40px}
.sign-box{text-align:center}
.sign-line{width:150px;border-top:1px solid #1c1917;margin-top:40px;padding-top:6px}
.sign-name{font-size:11px;color:#1c1917;font-weight:bold}
.sign-title{font-size:9px;color:#78716c}
.stamp{width:80px;height:80px;border:3px solid ${cert.color};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:8px;color:${cert.color};text-align:center;font-weight:bold;text-transform:uppercase;letter-spacing:1px;line-height:1.2;transform:rotate(-15deg);opacity:.7}
.cert-id{font-size:9px;color:#d6d3d1;position:absolute;bottom:15px;right:20px}
.date{font-size:11px;color:#78716c;margin-top:5px}
@media print{body{background:white}button{display:none!important}.cert{border:3px solid ${cert.color}}}
</style></head><body>
<div>
<div class="cert">
<div class="cert-inner">
<div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
<div class="logo">Momis <b>Wardrobe</b></div>
<div class="title">${cert.title}</div>
<div class="sub">${cert.sub}</div>
<div class="presented">This certificate is proudly presented to</div>
<div class="name">${memberName}</div>
<div class="desc">In recognition of exceptional dedication, professional excellence, and valuable contribution to Momis Wardrobe's mission of empowering women through fashion entrepreneurship in Pakistan.</div>${noteHtml}
<div class="footer">
<div class="sign-box">
<div class="sign-line">
<div class="sign-name">Momis Wardrobe</div>
<div class="sign-title">Owner & CEO</div>
</div>
</div>
<div class="stamp">MOMIS<br/>WARDROBE<br/>✦<br/>CERTIFIED</div>
<div class="sign-box">
<div class="date">${date}</div>
<div class="sign-line">
<div class="sign-name">Date of Issue</div>
<div class="sign-title">Certificate ID: ${certId}</div>
</div>
</div>
</div>
<div class="cert-id">${certId}</div>
</div>
</div>
<div style="text-align:center;margin-top:20px">
<button onclick="window.print()" style="background:#1c1917;color:white;border:none;padding:12px 40px;border-radius:8px;font-size:14px;cursor:pointer;font-family:sans-serif">🖨 Print / Save as PDF</button>
</div>
</div>
</body></html>`);
    w.document.close();
  };

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
          <div className="flex items-center gap-2">
            <a href="/admin/guide" className="text-[10px] bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg font-semibold hover:bg-blue-200">📖 Guide</a>
            <a href="/admin/certificates" className="text-[10px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg font-semibold hover:bg-amber-200">🏆 Certs</a>
            <a href="/" target="_blank" className="text-xs text-warm-gray-500 hover:text-warm-gray-700 flex items-center gap-1"><Eye size={12}/> Store</a>
            <button onClick={() => load()} className="text-warm-gray-400 hover:text-warm-gray-600"><RefreshCw size={14}/></button>
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
            { k: "categories", l: "📁 Categories" },
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
              <label className={`px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${importing ? "bg-warm-gray-300 text-warm-gray-500" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>
                {importing ? "⏳ Importing..." : <>📥 Import Excel</>}
                <input type="file" accept=".xlsx,.xls" onChange={handleExcelImport} disabled={importing} className="hidden" />
              </label>
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

        {/* ═══ CATEGORIES ═══ */}
        {tab === "categories" && (
          <div>
            {/* Add/Edit Form */}
            <div className="bg-white rounded-xl border p-4 mb-4">
              <h3 className="font-bold text-sm mb-3">{editCatId ? "Edit Category" : "Add New Category"}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input value={cf.name} onChange={e => setCf({...cf, name: e.target.value})}
                  placeholder="Category Name *" className="border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200" />
                <input value={cf.description} onChange={e => setCf({...cf, description: e.target.value})}
                  placeholder="Description (optional)" className="border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200" />
                <input value={cf.image} onChange={e => setCf({...cf, image: e.target.value})}
                  placeholder="Image URL (optional)" className="border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200" />
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={async () => {
                  if (!cf.name.trim()) { alert("Category name likhein"); return; }
                  try {
                    const url = editCatId ? `/api/admin/categories/${editCatId}` : "/api/admin/categories";
                    const method = editCatId ? "PUT" : "POST";
                    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name: cf.name, description: cf.description || null, image: cf.image || null }) });
                    if (res.ok) {
                      alert(editCatId ? "Category updated!" : "Category add ho gayi!");
                      setCf({ name: "", description: "", image: "" }); setEditCatId(null); load();
                    } else { const err = await res.json().catch(() => ({})); alert(err.error || "Error aayi"); }
                  } catch { alert("Network error"); }
                }} className="bg-rose-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-rose-600 transition-colors">
                  {editCatId ? "Update" : "Add Category"}
                </button>
                {editCatId && (
                  <button onClick={() => { setCf({ name: "", description: "", image: "" }); setEditCatId(null); }}
                    className="px-4 py-2.5 border rounded-lg text-sm text-warm-gray-600 hover:bg-warm-gray-50">Cancel</button>
                )}
              </div>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-4 py-3 bg-warm-gray-50 border-b font-bold text-sm flex items-center justify-between">
                <span>Categories ({categories.length})</span>
              </div>
              {categories.length === 0 ? (
                <div className="p-12 text-center text-warm-gray-400">Koi category nahi hai — upar se add karein</div>
              ) : (
                <div className="divide-y divide-warm-gray-50">
                  {categories.map((cat) => {
                    const productCount = products.filter(p => p.categoryId === cat.id).length;
                    return (
                      <div key={cat.id} className="p-4 flex items-center gap-4">
                        {/* Category Image */}
                        {cat.image ? (
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-warm-gray-100 flex-shrink-0">
                            <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="56px" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-warm-gray-100 flex items-center justify-center flex-shrink-0">
                            <FolderOpen size={20} className="text-warm-gray-300" />
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-warm-gray-900">{cat.name}</p>
                            <span className="text-[9px] font-mono bg-warm-gray-100 text-warm-gray-500 px-1.5 py-0.5 rounded">{cat.slug}</span>
                          </div>
                          {cat.description && <p className="text-xs text-warm-gray-500 mt-0.5 truncate">{cat.description}</p>}
                          <p className="text-[10px] text-warm-gray-400 mt-0.5">{productCount} product{productCount !== 1 ? "s" : ""}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button onClick={() => { setEditCatId(cat.id); setCf({ name: cat.name, description: cat.description || "", image: cat.image || "" }); }}
                            className="p-2 text-warm-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16} /></button>
                          <button onClick={async () => {
                            if (productCount > 0) {
                              alert(`"${cat.name}" mein ${productCount} product(s) hain. Pehle products ko doosri category mein move karein ya unassign karein.`);
                              return;
                            }
                            if (!confirm(`"${cat.name}" category delete karein?`)) return;
                            try {
                              await fetch(`/api/admin/categories/${cat.id}`, { method: "DELETE" });
                              load();
                            } catch { alert("Delete nahi ho saki"); }
                          }} className="p-2 text-warm-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ ORDERS ═══ */}
        {tab === "orders" && (() => {
          const totalRevenue = orders.reduce((s: number, o: any) => s + parseFloat(o.total || "0"), 0);
          const filtered = orders.filter((o: any) => {
            if (orderFilter !== "all" && o.status !== orderFilter) return false;
            if (orderSearch) {
              const q = orderSearch.toLowerCase();
              return (o.trackingId||"").toLowerCase().includes(q) || (o.customerName||"").toLowerCase().includes(q) || (o.customerPhone||"").includes(q);
            }
            return true;
          });
          const exportCSV = () => {
            const header = "Tracking ID,Customer,Phone,City,Total,Status,Date\n";
            const rows = filtered.map((o: any) => `${o.trackingId},${o.customerName},${o.customerPhone||""},${o.shippingAddress},${o.total},${o.status},${new Date(o.createdAt).toLocaleDateString()}`).join("\n");
            const blob = new Blob([header + rows], { type: "text/csv" });
            const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "momis-orders.csv"; a.click();
          };
          return (
          <div>
            {/* Revenue Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <div className="bg-white rounded-lg p-3 border text-center"><p className="text-lg font-bold text-green-600">{formatPrice(totalRevenue)}</p><p className="text-[9px] text-warm-gray-400 uppercase">Total Revenue</p></div>
              <div className="bg-white rounded-lg p-3 border text-center"><p className="text-lg font-bold text-warm-gray-900">{orders.length}</p><p className="text-[9px] text-warm-gray-400 uppercase">Total Orders</p></div>
              <div className="bg-white rounded-lg p-3 border text-center"><p className="text-lg font-bold text-amber-500">{orders.filter((o: any) => o.status === "pending").length}</p><p className="text-[9px] text-warm-gray-400 uppercase">Pending</p></div>
              <div className="bg-white rounded-lg p-3 border text-center"><p className="text-lg font-bold text-green-500">{orders.filter((o: any) => o.status === "delivered").length}</p><p className="text-[9px] text-warm-gray-400 uppercase">Delivered</p></div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="flex-1 flex items-center bg-white rounded-lg border px-3 gap-2">
                <Search size={14} className="text-warm-gray-400"/>
                <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)} placeholder="Search by tracking ID, name, phone..."
                  className="flex-1 py-2 text-sm outline-none"/>
              </div>
              <select value={orderFilter} onChange={e => setOrderFilter(e.target.value)}
                className="bg-white border rounded-lg px-3 py-2 text-sm">
                <option value="all">All Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="confirmed">✅ Confirmed</option>
                <option value="shipped">🚚 Shipped</option>
                <option value="delivered">✓ Delivered</option>
                <option value="cancelled">✕ Cancelled</option>
              </select>
              <button onClick={exportCSV} className="bg-warm-gray-900 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-warm-gray-800">📥 Export CSV</button>
            </div>

            {/* Orders */}
            <div className="space-y-3">
              {filtered.length === 0 ? <div className="bg-white rounded-xl p-12 text-center text-warm-gray-400">Koi order nahi mila</div> : filtered.map((o: any) => (
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
                        {o.referralCode && <span className="text-[9px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-mono">Ref: {o.referralCode}</span>}
                      </div>
                      <p className="text-sm font-medium">{o.customerName}</p>
                      <p className="text-xs text-warm-gray-500">{o.customerPhone} · {o.shippingAddress}</p>
                      <p className="text-[10px] text-warm-gray-400 mt-1">{o.items?.map((i: any) => `${i.name} x${i.quantity}`).join(" · ")}</p>
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
                    <button onClick={() => printInvoice(o)} className="px-3 py-2 text-warm-gray-600 hover:bg-warm-gray-50 font-medium flex items-center gap-1">📄 Invoice</button>
                    {o.customerPhone && <a href={`https://wa.me/92${o.customerPhone.replace(/^0/,"")}`} target="_blank" rel="noopener noreferrer"
                      className="px-3 py-2 text-green-600 hover:bg-green-50 font-medium flex items-center gap-1"><MessageCircle size={12}/> Notify</a>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          );
        })()}

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
          <div className="space-y-3">
            <div className="bg-white rounded-xl border overflow-hidden">
              <div className="px-4 py-3 bg-warm-gray-50 border-b font-bold text-sm">Team Members ({teamMembers.length})</div>
              {teamMembers.length === 0 ? (
                <div className="p-12 text-center text-warm-gray-400">Koi team member nahi</div>
              ) : teamMembers.map((m: any) => (
                <div key={m.id} className="p-4 border-b border-warm-gray-50">
                  {/* Member Info */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">{m.name}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${m.active?"bg-green-100 text-green-700":"bg-warm-gray-200 text-warm-gray-500"}`}>{m.active?"Active":"Inactive"}</span>
                      </div>
                      <p className="text-xs text-warm-gray-500 mt-0.5">{m.phone} · {m.city||"—"} · Code: <span className="font-mono font-bold text-purple-600">{m.referralCode}</span></p>
                      <div className="flex gap-3 mt-1 text-[11px]">
                        <span className="text-green-600 font-semibold">{formatPrice(m.totalEarnings)}</span>
                        <span className="text-warm-gray-500">{m.totalSales} sales</span>
                        <span className="text-purple-500">{m.commissionPercent}%</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <a href={`https://wa.me/92${m.phone.replace(/^0/,"")}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg"><MessageCircle size={16}/></a>
                      <button onClick={async()=>{if(!confirm(`${m.name} ko delete karein?`))return;await fetch(`/api/admin/team/${m.id}`,{method:"DELETE"});load();}} className="p-1.5 text-warm-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                  </div>

                  {/* Action Buttons — Properly Visible */}
                  <div className="flex flex-wrap gap-2">
                    <button onClick={async()=>{await fetch(`/api/admin/team/${m.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({active:!m.active})});load();}}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-warm-gray-100 hover:bg-warm-gray-200 transition-colors">
                      {m.active?"⏸ Deactivate":"▶ Activate"}
                    </button>
                    <button onClick={async()=>{const p=prompt("Commission % set karein:",String(m.commissionPercent));if(p){await fetch(`/api/admin/team/${m.id}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({commissionPercent:parseInt(p)})});load();}}}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors">
                      💰 Commission {m.commissionPercent}%
                    </button>

                    {/* 🏆 CERTIFICATE — Big Visible Dropdown */}
                    <select
                      onChange={(e) => { if (e.target.value) { generateCertificate(m.name, e.target.value); e.target.selectedIndex = 0; } }}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-amber-100 text-amber-800 hover:bg-amber-200 cursor-pointer border-0 appearance-auto transition-colors"
                    >
                      <option value="">🏆 Issue Certificate ▾</option>
                      <option value="welcome">🎉 Welcome Certificate</option>
                      <option value="completion">📜 Training Completion Certificate</option>
                      <option value="performance">⭐ Best Performance Certificate</option>
                      <option value="appreciation">❤️ Appreciation Certificate</option>
                      <option value="top_seller">🏅 Top Seller Award</option>
                      <option value="rising_star">🚀 Rising Star Award</option>
                    </select>

                    {/* Training Control */}
                    <button onClick={() => {
                      const courses = ["WhatsApp Marketing", "Facebook Marketing", "Instagram Marketing", "TikTok Marketing", "Snapchat Marketing", "Complete Reselling Guide"];
                      const msg = `Training assign for ${m.name}:\n\n${courses.map((c, i) => `${i+1}. ${c}`).join("\n")}\n\nKaunsa course assign karna hai? (number likhen)`;
                      const choice = prompt(msg);
                      if (choice) {
                        const idx = parseInt(choice) - 1;
                        if (idx >= 0 && idx < courses.length) {
                          const whatsappMsg = `Assalam o Alaikum ${m.name}!\n\nAap ko "${courses[idx]}" training course assign kiya gaya hai.\n\n📚 Training shuru karein:\nmomis-wardrobe-vert.vercel.app/training/${["whatsapp","facebook","instagram","tiktok","snapchat","general"][idx]}\n\nCourse complete karne par certificate milega! 🏆\n\nMomis Wardrobe Team`;
                          window.open(`https://wa.me/92${m.phone.replace(/^0/,"")}?text=${encodeURIComponent(whatsappMsg)}`, "_blank");
                        }
                      }
                    }}
                      className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
                      📚 Assign Training
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

                {/* Drop zone + File upload + Paste */}
                <div
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-colors cursor-pointer ${dragOver ? "border-rose-500 bg-rose-50" : "border-warm-gray-200 hover:border-rose-300"}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-input")?.click()}
                >
                  <Upload size={28} className={`mx-auto mb-2 ${dragOver ? "text-rose-500" : "text-warm-gray-300"}`}/>
                  <p className="text-xs text-warm-gray-600 font-semibold mb-1">
                    {dragOver ? "Drop Image Here!" : "Click to Upload ya Drag & Drop"}
                  </p>
                  <p className="text-[10px] text-warm-gray-400">Gallery, Files, WhatsApp image — sab support karta hai</p>
                  <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                    <span className="text-[9px] bg-warm-gray-100 px-2 py-0.5 rounded">📁 Files</span>
                    <span className="text-[9px] bg-warm-gray-100 px-2 py-0.5 rounded">📋 Ctrl+V Paste</span>
                    <span className="text-[9px] bg-warm-gray-100 px-2 py-0.5 rounded">🖱️ Drag & Drop</span>
                    <span className="text-[9px] bg-warm-gray-100 px-2 py-0.5 rounded">🔗 URL Link</span>
                    <span className="text-[9px] bg-warm-gray-100 px-2 py-0.5 rounded">💬 WhatsApp</span>
                  </div>
                  <input id="file-input" type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden"/>
                </div>

                {/* URL input — for Markaz, Daraz, Google, any link */}
                <div className="flex gap-2 mt-2">
                  <input id="img-url-input" type="url" value={pasteUrl} onChange={e => setPasteUrl(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addImageUrl()}
                    placeholder="Markaz / Daraz / Google image URL paste karein..." className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"/>
                  <button onClick={addImageUrl} disabled={!pasteUrl.trim()}
                    className="bg-warm-gray-900 text-white px-4 rounded-lg text-sm font-medium disabled:opacity-30 hover:bg-warm-gray-800">Add</button>
                </div>
                <p className="text-[9px] text-warm-gray-400 mt-1">💡 Markaz/Daraz par image par right-click → "Copy Image Address" → yahan paste karein</p>
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
              <button onClick={saveProd} disabled={saving}
                className={`flex-1 py-3.5 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${saving ? "bg-warm-gray-400 cursor-wait" : "bg-rose-500 hover:bg-rose-600 active:scale-95"}`}>
                {saving ? "⏳ Saving..." : <><Save size={16}/> {editId ? "Update" : "Add Product"}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
