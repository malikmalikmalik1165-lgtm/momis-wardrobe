"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingBag, Eye, Heart } from "lucide-react";
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
  const [imgFailed, setImgFailed] = useState(false);

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

  const discount = product.compareAtPrice
    ? Math.round(
        ((parseFloat(product.compareAtPrice) - parseFloat(product.price)) /
          parseFloat(product.compareAtPrice)) *
          100
      )
    : 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="bg-white rounded-xl border border-warm-gray-100 overflow-hidden hover:shadow-xl hover:border-warm-gray-200 transition-all duration-300 hover:-translate-y-1">
        {/* Image — agar import ki gayi image load na ho (kharab URL/host) to
            clean placeholder dikhayein, blank/broken box nahi */}
        <div className="relative aspect-[3/4] bg-warm-gray-50 overflow-hidden">
          {product.images[0] && !imgFailed ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-warm-gray-300">
              <ShoppingBag size={30} />
              <span className="text-[9px] mt-1.5 tracking-[0.2em] uppercase">Momis Wardrobe</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {discount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow">
                -{discount}%
              </span>
            )}
            {product.badge && (
              <span className="bg-warm-gray-900/85 backdrop-blur-sm text-white text-[9px] font-semibold px-2 py-1 rounded-md">
                {product.badge}
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <button
              onClick={handleQuickAdd}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-colors text-warm-gray-600"
              title="Add to Bag"
            >
              <ShoppingBag size={15} />
            </button>
            <button
              onClick={(e) => e.preventDefault()}
              className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-colors text-warm-gray-600"
              title="Wishlist"
            >
              <Heart size={15} />
            </button>
          </div>

          {/* Quick Add Bar — bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-warm-gray-900/90 backdrop-blur-sm text-white py-2.5 text-center text-xs font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300 cursor-pointer"
            onClick={handleQuickAdd}>
            + Add to Bag
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          {/* Name */}
          <h3 className="text-[13px] font-medium text-warm-gray-800 line-clamp-2 leading-tight min-h-[32px] group-hover:text-rose-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            {product.reviewCount > 0 ? (
              <>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={10}
                      className={
                        i <= Math.round(product.averageRating)
                          ? "fill-amber-400 text-amber-400"
                          : "fill-warm-gray-200 text-warm-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-[10px] text-warm-gray-400">
                  ({product.reviewCount})
                </span>
              </>
            ) : (
              <span className="text-[10px] text-warm-gray-300">New Product</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mt-2 flex-wrap">
            <span className="text-base font-extrabold text-warm-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-warm-gray-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Colors */}
          {product.colors.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {product.colors.slice(0, 3).map((color) => (
                <span
                  key={color}
                  className="text-[9px] text-warm-gray-400 border border-warm-gray-200 px-1.5 py-0.5 rounded"
                >
                  {color}
                </span>
              ))}
              {product.colors.length > 3 && (
                <span className="text-[9px] text-warm-gray-300">+{product.colors.length - 3}</span>
              )}
            </div>
          )}

          {/* Free shipping badge */}
          {parseFloat(product.price) >= 5000 && (
            <div className="mt-2">
              <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium">
                🚚 Free Delivery
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
