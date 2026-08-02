"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";

interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  images: string[];
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setResults([]);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.slice(0, 6));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative max-w-2xl mx-auto mt-20 sm:mt-32 mx-4 sm:mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-warm-gray-100">
            <Search className="text-warm-gray-400" size={22} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products... (e.g., dress, bag, heels)"
              className="flex-1 text-lg outline-none placeholder-warm-gray-400"
            />
            {loading ? (
              <Loader2 className="text-warm-gray-400 animate-spin" size={20} />
            ) : (
              <button onClick={onClose} className="p-1 hover:bg-warm-gray-100 rounded-full">
                <X className="text-warm-gray-400" size={20} />
              </button>
            )}
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {query.length < 2 ? (
              <div className="p-6 text-center text-warm-gray-400">
                <p>Type to search...</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {["Dresses", "Bags", "Shoes", "Tops"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-warm-gray-100 text-warm-gray-600 rounded-full text-sm hover:bg-warm-gray-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : results.length === 0 && !loading ? (
              <div className="p-8 text-center">
                <p className="text-warm-gray-500 mb-2">Koi product nahi mila &quot;{query}&quot;</p>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="text-rose-500 text-sm hover:underline"
                >
                  WhatsApp par poochein →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-warm-gray-50">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-4 hover:bg-warm-gray-50 transition-colors"
                  >
                    <div className="relative w-16 h-20 bg-warm-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images[0] && (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-warm-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm font-semibold text-rose-500">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="p-4 border-t border-warm-gray-100 bg-warm-gray-50">
              <Link
                href={`/shop?search=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="block text-center text-sm text-rose-500 font-medium hover:underline"
              >
                View all results →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
