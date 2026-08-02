"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  Users,
  ShoppingBag,
  X,
  Save,
  LogIn,
  FolderOpen,
  ShoppingCart,
  Settings,
  Eye,
  MessageCircle,
  Percent,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { formatPrice } from "@/lib/currency";

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string | null;
  categoryId: number | null;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  badge: string | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface JoinRequest {
  id: number;
  name: string;
  phone: string;
  city: string;
  message: string | null;
  status: string;
  createdAt: string;
}

interface Order {
  id: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: string;
  shipping: string;
  total: string;
  status: string;
  createdAt: string;
}

interface DiscountCode {
  id: number;
  code: string;
  discountPercent: number;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  createdAt: string;
}

type TabType = "products" | "categories" | "orders" | "requests" | "discounts" | "settings";

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [discountForm, setDiscountForm] = useState({ code: "", percent: "", maxUses: "" });
  
  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    compareAtPrice: "",
    categoryId: "",
    images: "",
    sizes: "",
    colors: "",
    badge: "",
    featured: false,
    inStock: true,
  });

  // Category form
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
    image: "",
  });

  // Settings
  const [settings, setSettings] = useState({
    storeName: "Momis Wardrobe",
    whatsappLink: "https://chat.whatsapp.com/B9JHotGfxhICVZASVkwUIa",
    freeShippingThreshold: "5000",
    shippingRate: "250",
  });

  useEffect(() => {
    const saved = localStorage.getItem("momis-admin-auth");
    if (saved === "true") {
      setIsLoggedIn(true);
      loadData();
    } else {
      setLoading(false);
    }

    // Load settings
    const savedSettings = localStorage.getItem("momis-settings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleLogin = () => {
    if (password === "momidani") {
      setIsLoggedIn(true);
      localStorage.setItem("momis-admin-auth", "true");
      loadData();
    } else {
      alert("Ghalat password!");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodsRes, catsRes, reqsRes, ordersRes, discRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
        fetch("/api/join-requests"),
        fetch("/api/orders/list"),
        fetch("/api/admin/discounts"),
      ]);
      setProducts(await prodsRes.json());
      setCategories(await catsRes.json());
      if (reqsRes.ok) setRequests(await reqsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (discRes.ok) setDiscounts(await discRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDiscount = async () => {
    if (!discountForm.code || !discountForm.percent) {
      alert("Code aur percentage zaroor bharein!");
      return;
    }
    try {
      const res = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: discountForm.code,
          discountPercent: parseInt(discountForm.percent),
          maxUses: discountForm.maxUses ? parseInt(discountForm.maxUses) : null,
        }),
      });
      if (res.ok) {
        alert("Discount code ban gaya!");
        setShowDiscountForm(false);
        setDiscountForm({ code: "", percent: "", maxUses: "" });
        loadData();
      } else {
        const err = await res.json();
        alert(err.error || "Code nahi bana");
      }
    } catch {
      alert("Error aayi");
    }
  };

  const handleToggleDiscount = async (id: number, active: boolean) => {
    await fetch(`/api/admin/discounts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    loadData();
  };

  const handleDeleteDiscount = async (id: number) => {
    if (!confirm("Delete karein?")) return;
    await fetch(`/api/admin/discounts/${id}`, { method: "DELETE" });
    loadData();
  };

  // Product functions
  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      compareAtPrice: "",
      categoryId: "",
      images: "",
      sizes: "",
      colors: "",
      badge: "",
      featured: false,
      inStock: true,
    });
    setEditingProduct(null);
  };

  const openAddProduct = () => {
    resetProductForm();
    setShowProductForm(true);
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice || "",
      categoryId: product.categoryId?.toString() || "",
      images: product.images.join("\n"),
      sizes: product.sizes.join(", "),
      colors: product.colors.join(", "),
      badge: product.badge || "",
      featured: product.featured,
      inStock: product.inStock,
    });
    setShowProductForm(true);
  };

  const handleProductSubmit = async () => {
    if (!productForm.name || !productForm.price || !productForm.description) {
      alert("Name, Price aur Description zaroor bharein!");
      return;
    }

    const payload = {
      name: productForm.name,
      description: productForm.description,
      price: productForm.price,
      compareAtPrice: productForm.compareAtPrice || null,
      categoryId: productForm.categoryId ? parseInt(productForm.categoryId) : null,
      images: productForm.images.split("\n").map((s) => s.trim()).filter(Boolean),
      sizes: productForm.sizes.split(",").map((s) => s.trim()).filter(Boolean),
      colors: productForm.colors.split(",").map((s) => s.trim()).filter(Boolean),
      badge: productForm.badge || null,
      featured: productForm.featured,
      inStock: productForm.inStock,
    };

    try {
      const url = editingProduct
        ? `/api/admin/products/${editingProduct.id}`
        : "/api/admin/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert(editingProduct ? "Product update ho gaya!" : "Naya product add ho gaya!");
        setShowProductForm(false);
        resetProductForm();
        loadData();
      } else {
        alert("Kuch ghalat ho gaya. Dobara try karein.");
      }
    } catch {
      alert("Error aayi. Internet check karein.");
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Kya aap yeh product delete karna chahte hain?")) return;

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Product delete ho gaya!");
        loadData();
      }
    } catch {
      alert("Delete nahi ho saka.");
    }
  };

  // Category functions
  const resetCategoryForm = () => {
    setCategoryForm({ name: "", description: "", image: "" });
    setEditingCategory(null);
  };

  const openAddCategory = () => {
    resetCategoryForm();
    setShowCategoryForm(true);
  };

  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
    });
    setShowCategoryForm(true);
  };

  const handleCategorySubmit = async () => {
    if (!categoryForm.name) {
      alert("Category name zaroor bharein!");
      return;
    }

    try {
      const url = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryForm),
      });

      if (res.ok) {
        alert(editingCategory ? "Category update ho gayi!" : "Nayi category add ho gayi!");
        setShowCategoryForm(false);
        resetCategoryForm();
        loadData();
      } else {
        alert("Kuch ghalat ho gaya.");
      }
    } catch {
      alert("Error aayi.");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Kya aap yeh category delete karna chahte hain?")) return;

    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Category delete ho gayi!");
        loadData();
      }
    } catch {
      alert("Delete nahi ho saki.");
    }
  };

  // Save settings
  const handleSaveSettings = () => {
    localStorage.setItem("momis-settings", JSON.stringify(settings));
    alert("Settings save ho gayi!");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-warm-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogIn className="text-rose-500" size={28} />
            </div>
            <h1 className="font-serif text-2xl text-warm-gray-900">Admin Login</h1>
            <p className="text-warm-gray-400 text-sm mt-2">Momis Wardrobe Dashboard</p>
          </div>

          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Password darj karein"
              className="w-full border border-warm-gray-200 rounded-lg px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-warm-gray-900 text-white py-3 rounded-lg font-medium hover:bg-warm-gray-800 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-warm-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-warm-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-xl sm:text-2xl text-warm-gray-900">
              Momis <span className="text-rose-500">Admin</span>
            </h1>
            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                className="text-sm text-warm-gray-500 hover:text-warm-gray-700 flex items-center gap-1"
              >
                <Eye size={14} /> View Site
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem("momis-admin-auth");
                  setIsLoggedIn(false);
                }}
                className="text-sm text-rose-500 hover:text-rose-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <Package className="text-rose-400 mb-2" size={24} />
            <p className="text-2xl font-bold text-warm-gray-900">{products.length}</p>
            <p className="text-xs text-warm-gray-400">Products</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <FolderOpen className="text-purple-400 mb-2" size={24} />
            <p className="text-2xl font-bold text-warm-gray-900">{categories.length}</p>
            <p className="text-xs text-warm-gray-400">Categories</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <ShoppingCart className="text-green-400 mb-2" size={24} />
            <p className="text-2xl font-bold text-warm-gray-900">{orders.length}</p>
            <p className="text-xs text-warm-gray-400">Orders</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <Users className="text-blue-400 mb-2" size={24} />
            <p className="text-2xl font-bold text-warm-gray-900">{requests.length}</p>
            <p className="text-xs text-warm-gray-400">Join Requests</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 sm:gap-4 border-b border-warm-gray-200 mb-6 overflow-x-auto">
          {[
            { key: "products", label: "Products", icon: Package },
            { key: "categories", label: "Categories", icon: FolderOpen },
            { key: "orders", label: "Orders", icon: ShoppingCart },
            { key: "requests", label: "Join Requests", icon: Users },
            { key: "discounts", label: "Discounts", icon: Percent },
            { key: "settings", label: "Settings", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`pb-3 px-2 sm:px-3 text-xs sm:text-sm font-medium transition-colors relative flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.key ? "text-warm-gray-900" : "text-warm-gray-400"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.key === "requests" && requests.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {requests.length}
                </span>
              )}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        
        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <>
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={openAddProduct}
                className="flex items-center justify-center gap-2 bg-rose-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-rose-600 transition-colors"
              >
                <Plus size={18} /> Naya Product
              </button>
              <button
                onClick={async () => {
                  const res = await fetch("/api/admin/import-markaz", { method: "POST" });
                  const data = await res.json();
                  if (data.success) {
                    alert(`Women's collection imported! Inserted: ${data.inserted}, Updated: ${data.updated}, Rs. ${data.marginAdded} margin added.`);
                    loadData();
                  } else {
                    alert("Import failed. Dobara try karein.");
                  }
                }}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-rose-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
              >
                ✨ Import Full Women's Collection
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-warm-gray-50 border-b border-warm-gray-100">
                    <tr>
                      <th className="text-left text-xs font-semibold text-warm-gray-500 uppercase tracking-wider px-4 py-3">Product</th>
                      <th className="text-left text-xs font-semibold text-warm-gray-500 uppercase tracking-wider px-4 py-3">Price</th>
                      <th className="text-left text-xs font-semibold text-warm-gray-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Category</th>
                      <th className="text-right text-xs font-semibold text-warm-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-warm-gray-50">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-warm-gray-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {product.images[0] && (
                              <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-warm-gray-100 flex-shrink-0">
                                <Image src={product.images[0]} alt={product.name} fill className="object-cover" sizes="48px" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-warm-gray-900 truncate">{product.name}</p>
                              {product.badge && <span className="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded">{product.badge}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-semibold text-warm-gray-900">{formatPrice(product.price)}</p>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className="text-sm text-warm-gray-500">{categories.find((c) => c.id === product.categoryId)?.name || "—"}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditProduct(product)} className="p-2 text-warm-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><Pencil size={16} /></button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-warm-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === "categories" && (
          <>
            <button
              onClick={openAddCategory}
              className="mb-6 flex items-center gap-2 bg-purple-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
            >
              <Plus size={18} /> Nayi Category
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {cat.image && (
                    <div className="relative h-32 bg-warm-gray-100">
                      <Image src={cat.image} alt={cat.name} fill className="object-cover" sizes="300px" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-warm-gray-900">{cat.name}</h3>
                    <p className="text-xs text-warm-gray-400 mt-1">{cat.description || "No description"}</p>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => openEditCategory(cat)} className="flex-1 py-2 text-xs bg-warm-gray-100 text-warm-gray-700 rounded-lg hover:bg-warm-gray-200">Edit</button>
                      <button onClick={() => handleDeleteCategory(cat.id)} className="py-2 px-3 text-xs bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm text-center py-12">
                <ShoppingCart className="mx-auto text-warm-gray-200 mb-3" size={40} />
                <p className="text-warm-gray-400">Abhi tak koi order nahi aaya</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    {/* Order header */}
                    <div className="p-4 sm:p-5 flex flex-wrap items-start justify-between gap-3 border-b border-warm-gray-100">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-warm-gray-900">{order.trackingId || `#${order.id}`}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                            order.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                            order.status === "processing" ? "bg-purple-100 text-purple-700" :
                            order.status === "shipped" ? "bg-orange-100 text-orange-700" :
                            order.status === "delivered" ? "bg-green-100 text-green-700" :
                            order.status === "cancelled" ? "bg-rose-100 text-rose-700" :
                            "bg-warm-gray-100 text-warm-gray-700"
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-warm-gray-900">{order.customerName}</p>
                        {order.customerPhone && <p className="text-xs text-warm-gray-500">📞 {order.customerPhone}</p>}
                        <p className="text-xs text-warm-gray-400">📍 {order.shippingAddress}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-warm-gray-900">{formatPrice(order.total)}</p>
                        <p className="text-[10px] text-warm-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short" })}
                        </p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="px-4 sm:px-5 py-3 text-xs text-warm-gray-500 border-b border-warm-gray-50">
                      {order.items.map((item: any, i: number) => (
                        <span key={i}>{item.name} x{item.quantity}{i < order.items.length - 1 ? " • " : ""}</span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="p-4 sm:p-5 flex flex-wrap gap-2 items-center">
                      {/* Status Change */}
                      <select
                        value={order.status}
                        onChange={async (e) => {
                          await fetch(`/api/admin/orders/${order.id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ status: e.target.value }),
                          });
                          loadData();
                        }}
                        className="text-xs border border-warm-gray-200 rounded-lg px-3 py-2 bg-white"
                      >
                        <option value="pending">⏳ Pending</option>
                        <option value="confirmed">✅ Confirmed</option>
                        <option value="processing">📦 Processing</option>
                        <option value="shipped">🚚 Shipped</option>
                        <option value="out_for_delivery">🏃 Out for Delivery</option>
                        <option value="delivered">✓ Delivered</option>
                        <option value="cancelled">✕ Cancelled</option>
                      </select>

                      {/* Courier Info */}
                      <input
                        type="text"
                        placeholder="Courier Name"
                        defaultValue={order.courierName || ""}
                        onBlur={async (e) => {
                          if (e.target.value !== (order.courierName || "")) {
                            await fetch(`/api/admin/orders/${order.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ courierName: e.target.value }),
                            });
                            loadData();
                          }
                        }}
                        className="text-xs border border-warm-gray-200 rounded-lg px-3 py-2 w-28"
                      />
                      <input
                        type="text"
                        placeholder="Tracking #"
                        defaultValue={order.courierTrackingId || ""}
                        onBlur={async (e) => {
                          if (e.target.value !== (order.courierTrackingId || "")) {
                            await fetch(`/api/admin/orders/${order.id}`, {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                courierTrackingId: e.target.value,
                                courierName: order.courierName || "TCS",
                              }),
                            });
                            loadData();
                          }
                        }}
                        className="text-xs border border-warm-gray-200 rounded-lg px-3 py-2 w-32"
                      />

                      {/* WhatsApp notify */}
                      {order.customerPhone && (
                        <a
                          href={`https://wa.me/92${order.customerPhone.replace(/^0/, "")}?text=${encodeURIComponent(
                            `Assalam o Alaikum ${order.customerName}!\n\nAap ka order ${order.trackingId || "#" + order.id} ka update:\n\n📦 Status: ${order.status.toUpperCase()}\n${order.courierName ? `🚚 Courier: ${order.courierName}` : ""}\n${order.courierTrackingId ? `📋 Tracking: ${order.courierTrackingId}` : ""}\n\nTrack karein: momis-wardrobe-vert.vercel.app/track\n\nShukriya!\nMomis Wardrobe 💕`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 bg-green-500 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-green-600"
                        >
                          <MessageCircle size={12} /> Notify
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REQUESTS TAB */}
        {activeTab === "requests" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <Users className="mx-auto text-warm-gray-200 mb-3" size={40} />
                <p className="text-warm-gray-400">Abhi tak koi request nahi aayi</p>
              </div>
            ) : (
              <div className="divide-y divide-warm-gray-100">
                {requests.map((req) => (
                  <div key={req.id} className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-warm-gray-900">{req.name}</h3>
                        <p className="text-sm text-warm-gray-500 mt-1">📞 {req.phone}</p>
                        <p className="text-sm text-warm-gray-500">📍 {req.city}</p>
                        {req.message && <p className="text-sm text-warm-gray-400 mt-2 italic">&ldquo;{req.message}&rdquo;</p>}
                      </div>
                      <a
                        href={`https://wa.me/92${req.phone.replace(/^0/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex-shrink-0"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DISCOUNTS TAB */}
        {activeTab === "discounts" && (
          <>
            <button
              onClick={() => setShowDiscountForm(true)}
              className="mb-6 flex items-center gap-2 bg-rose-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-rose-600"
            >
              <Plus size={18} /> Naya Discount Code
            </button>

            {showDiscountForm && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6 max-w-md">
                <h3 className="font-semibold text-warm-gray-900 mb-4">Naya Code Banayein</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-warm-gray-600 mb-1">Code *</label>
                    <input
                      type="text"
                      value={discountForm.code}
                      onChange={(e) => setDiscountForm({ ...discountForm, code: e.target.value.toUpperCase() })}
                      placeholder="e.g., MOMIS20"
                      className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 uppercase focus:outline-none focus:ring-2 focus:ring-rose-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-warm-gray-600 mb-1">Discount % *</label>
                      <input
                        type="number"
                        value={discountForm.percent}
                        onChange={(e) => setDiscountForm({ ...discountForm, percent: e.target.value })}
                        placeholder="e.g., 15"
                        min="1"
                        max="100"
                        className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-warm-gray-600 mb-1">Max Uses (optional)</label>
                      <input
                        type="number"
                        value={discountForm.maxUses}
                        onChange={(e) => setDiscountForm({ ...discountForm, maxUses: e.target.value })}
                        placeholder="Unlimited"
                        className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={handleCreateDiscount} className="flex-1 bg-rose-500 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-rose-600">Create</button>
                    <button onClick={() => setShowDiscountForm(false)} className="px-4 py-2.5 border border-warm-gray-200 rounded-lg text-sm text-warm-gray-600">Cancel</button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {discounts.length === 0 ? (
                <div className="text-center py-12">
                  <Percent className="mx-auto text-warm-gray-200 mb-3" size={40} />
                  <p className="text-warm-gray-400">Koi discount code nahi hai</p>
                  <p className="text-xs text-warm-gray-300 mt-1">Upar button se banayein</p>
                </div>
              ) : (
                <div className="divide-y divide-warm-gray-100">
                  {discounts.map((d) => (
                    <div key={d.id} className="p-4 flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-warm-gray-900 bg-warm-gray-100 px-2 py-0.5 rounded">{d.code}</span>
                          <span className="text-sm text-rose-500 font-semibold">{d.discountPercent}% OFF</span>
                          {!d.active && <span className="text-xs bg-warm-gray-200 text-warm-gray-500 px-2 py-0.5 rounded">Inactive</span>}
                        </div>
                        <p className="text-xs text-warm-gray-400 mt-1">
                          Used: {d.usedCount}{d.maxUses ? ` / ${d.maxUses}` : " (unlimited)"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleDiscount(d.id, d.active)}
                          className={`p-2 rounded-lg ${d.active ? "text-green-500 hover:bg-green-50" : "text-warm-gray-400 hover:bg-warm-gray-50"}`}
                          title={d.active ? "Deactivate" : "Activate"}
                        >
                          {d.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        </button>
                        <button
                          onClick={() => handleDeleteDiscount(d.id)}
                          className="p-2 text-warm-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
            <h2 className="font-semibold text-warm-gray-900 mb-6 flex items-center gap-2">
              <Settings size={18} /> Store Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-warm-gray-600 mb-1">Store Name</label>
                <input
                  type="text"
                  value={settings.storeName}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-warm-gray-600 mb-1">WhatsApp Community Link</label>
                <input
                  type="url"
                  value={settings.whatsappLink}
                  onChange={(e) => setSettings({ ...settings, whatsappLink: e.target.value })}
                  className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-warm-gray-600 mb-1">Free Shipping Threshold (Rs.)</label>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => setSettings({ ...settings, freeShippingThreshold: e.target.value })}
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-warm-gray-600 mb-1">Shipping Rate (Rs.)</label>
                  <input
                    type="number"
                    value={settings.shippingRate}
                    onChange={(e) => setSettings({ ...settings, shippingRate: e.target.value })}
                    className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSaveSettings}
                  className="bg-warm-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-warm-gray-800 transition-colors flex items-center gap-2"
                >
                  <Save size={16} /> Save Settings
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-warm-gray-100">
                <h3 className="font-medium text-warm-gray-700 mb-3">Change Password</h3>
                <p className="text-xs text-warm-gray-400 mb-3">Password change karne ke liye developer se contact karein.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PRODUCT FORM MODAL */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-warm-gray-100">
              <h2 className="font-serif text-xl text-warm-gray-900">
                {editingProduct ? "Product Edit Karein" : "Naya Product Add Karein"}
              </h2>
              <button onClick={() => setShowProductForm(false)} className="p-2 hover:bg-warm-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-warm-gray-600 mb-1">Product Name *</label>
                <input type="text" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="e.g., Silk Evening Gown" className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200" />
              </div>

              <div>
                <label className="block text-xs font-medium text-warm-gray-600 mb-1">Description *</label>
                <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={3} placeholder="Product ki tafseel likhein..." className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-warm-gray-600 mb-1">Price (Rs.) *</label>
                  <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} placeholder="e.g., 5500" className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-warm-gray-600 mb-1">Compare Price</label>
                  <input type="number" value={productForm.compareAtPrice} onChange={(e) => setProductForm({ ...productForm, compareAtPrice: e.target.value })} placeholder="e.g., 7000" className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-warm-gray-600 mb-1">Category</label>
                <select value={productForm.categoryId} onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })} className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200">
                  <option value="">Select Category</option>
                  {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-warm-gray-600 mb-1">Image URLs (Har line par ek)</label>
                <textarea value={productForm.images} onChange={(e) => setProductForm({ ...productForm, images: e.target.value })} rows={3} placeholder="https://example.com/image1.jpg" className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200 font-mono text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-warm-gray-600 mb-1">Sizes (comma se alag)</label>
                  <input type="text" value={productForm.sizes} onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })} placeholder="S, M, L, XL" className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-warm-gray-600 mb-1">Colors (comma se alag)</label>
                  <input type="text" value={productForm.colors} onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })} placeholder="Black, White, Red" className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-warm-gray-600 mb-1">Badge</label>
                <input type="text" value={productForm.badge} onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })} placeholder="e.g., New Arrival, Sale" className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-200" />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={productForm.featured} onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })} className="w-4 h-4 accent-rose-500" />
                  <span className="text-sm text-warm-gray-700">Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={productForm.inStock} onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })} className="w-4 h-4 accent-green-500" />
                  <span className="text-sm text-warm-gray-700">In Stock</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-warm-gray-100 flex gap-3">
              <button onClick={() => setShowProductForm(false)} className="flex-1 py-3 border border-warm-gray-200 rounded-lg text-sm font-medium text-warm-gray-600 hover:bg-warm-gray-50">Cancel</button>
              <button onClick={handleProductSubmit} className="flex-1 py-3 bg-rose-500 text-white rounded-lg text-sm font-medium hover:bg-rose-600 flex items-center justify-center gap-2">
                <Save size={16} /> {editingProduct ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY FORM MODAL */}
      {showCategoryForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-md my-8 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-warm-gray-100">
              <h2 className="font-serif text-xl text-warm-gray-900">
                {editingCategory ? "Category Edit Karein" : "Nayi Category Add Karein"}
              </h2>
              <button onClick={() => setShowCategoryForm(false)} className="p-2 hover:bg-warm-gray-100 rounded-full"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-warm-gray-600 mb-1">Category Name *</label>
                <input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} placeholder="e.g., Dresses" className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200" />
              </div>

              <div>
                <label className="block text-xs font-medium text-warm-gray-600 mb-1">Description</label>
                <textarea value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} rows={2} placeholder="Category ki tafseel..." className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200" />
              </div>

              <div>
                <label className="block text-xs font-medium text-warm-gray-600 mb-1">Image URL</label>
                <input type="url" value={categoryForm.image} onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })} placeholder="https://example.com/image.jpg" className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200" />
              </div>
            </div>

            <div className="p-6 border-t border-warm-gray-100 flex gap-3">
              <button onClick={() => setShowCategoryForm(false)} className="flex-1 py-3 border border-warm-gray-200 rounded-lg text-sm font-medium text-warm-gray-600 hover:bg-warm-gray-50">Cancel</button>
              <button onClick={handleCategorySubmit} className="flex-1 py-3 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 flex items-center justify-center gap-2">
                <Save size={16} /> {editingCategory ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
