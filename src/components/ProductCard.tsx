"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/currency";

interface Props {
  product: {
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
  };
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCartStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images[0] || "",
    });
  };

  const discount =
    product.compareAtPrice
      ? Math.round(
          ((parseFloat(product.compareAtPrice) - parseFloat(product.price)) /
            parseFloat(product.compareAtPrice)) *
            100
        )
      : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative aspect-[3/4] bg-warm-gray-100 rounded-xl overflow-hidden mb-4">
        {product.images[0] && (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}

        {/* Badge */}
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-full ${
              product.badge === "Sale"
                ? "bg-rose-500 text-white"
                : product.badge === "New Arrival" || product.badge === "New"
                ? "bg-warm-gray-900 text-white"
                : product.badge === "Best Seller"
                ? "bg-gold-500 text-white"
                : "bg-white/90 text-warm-gray-900"
            }`}
          >
            {product.badge}
          </span>
        )}

        {/* Quick Add */}
        <button
          onClick={handleQuickAdd}
          className="absolute bottom-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-warm-gray-900 hover:text-white shadow-lg"
        >
          <ShoppingBag size={16} />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      <div className="space-y-1.5 px-1">
        <h3 className="text-sm font-medium text-warm-gray-900 group-hover:text-rose-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={11}
                  className={
                    i <= Math.round(product.averageRating)
                      ? "fill-gold-400 text-gold-400"
                      : "fill-warm-gray-200 text-warm-gray-200"
                  }
                />
              ))}
            </div>
            <span className="text-[11px] text-warm-gray-400">
              ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-warm-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <>
              <span className="text-xs text-warm-gray-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
              <span className="text-xs font-medium text-rose-500">
                -{discount}%
              </span>
            </>
          )}
        </div>

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="flex gap-1 pt-1 flex-wrap">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color}
                className="text-[10px] text-warm-gray-400 border border-warm-gray-200 px-1.5 py-0.5 rounded"
              >
                {color}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
