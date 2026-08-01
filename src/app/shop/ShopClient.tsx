"use client";

import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { SlidersHorizontal, X } from "lucide-react";
import { useState, Suspense } from "react";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  compareAtPrice: string | null;
  images: string[];
  badge: string | null;
  averageRating: number;
  reviewCount: number;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  featured: boolean;
  categoryName: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
}

interface Props {
  products: Product[];
  categories: Category[];
  currentCategory: string;
  currentSort: string;
}

function ShopContent({ products, categories, currentCategory, currentSort }: Props) {
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (currentSort !== "newest") params.set("sort", currentSort);
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams();
    if (currentCategory) params.set("category", currentCategory);
    if (sort !== "newest") params.set("sort", sort);
    router.push(`/shop${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const activeCat = categories.find((c) => c.slug === currentCategory);

  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)]">
      {/* Page Header */}
      <div className="bg-white border-b border-warm-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <span className="text-rose-500 text-xs tracking-[0.3em] uppercase">
            Collection
          </span>
          <h1
            className="font-serif text-3xl sm:text-4xl lg:text-5xl text-warm-gray-900 mt-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {activeCat ? activeCat.name : "All Products"}
          </h1>
          {activeCat?.description && (
            <p className="text-warm-gray-500 mt-3 max-w-lg">
              {activeCat.description}
            </p>
          )}
          <p className="text-sm text-warm-gray-400 mt-4">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange("")}
              className={`px-4 py-2 text-xs tracking-wider uppercase rounded-full transition-colors ${
                !currentCategory
                  ? "bg-warm-gray-900 text-white"
                  : "bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`px-4 py-2 text-xs tracking-wider uppercase rounded-full transition-colors ${
                  currentCategory === cat.slug
                    ? "bg-warm-gray-900 text-white"
                    : "bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <label className="text-xs text-warm-gray-400 uppercase tracking-wider">
              Sort by
            </label>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-sm bg-white border border-warm-gray-200 rounded-lg px-3 py-2 text-warm-gray-700 focus:outline-none focus:ring-2 focus:ring-rose-200"
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-warm-gray-400 text-lg mb-2">
              No products found
            </p>
            <p className="text-sm text-warm-gray-300">
              Try changing your filters or browse all products
            </p>
            <button
              onClick={() => handleCategoryChange("")}
              className="mt-6 bg-warm-gray-900 text-white px-6 py-2.5 text-sm tracking-wider uppercase"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopClient(props: Props) {
  return (
    <Suspense fallback={<div className="pt-40 text-center">Loading...</div>}>
      <ShopContent {...props} />
    </Suspense>
  );
}
