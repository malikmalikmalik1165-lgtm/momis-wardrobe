"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Star,
  ShoppingBag,
  Heart,
  ChevronRight,
  Check,
  Truck,
  RotateCcw,
  Shield,
  MessageCircle,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import StarRating from "@/components/StarRating";
import { formatPrice } from "@/lib/currency";

interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  title: string | null;
  body: string | null;
  verified: boolean;
  createdAt: Date;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  compareAtPrice: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  badge: string | null;
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
  categoryName: string;
}

interface RelatedProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  compareAtPrice: string | null;
  images: string[];
  badge: string | null;
}

interface Props {
  product: Product;
  related: RelatedProduct[];
}

export default function ProductDetail({ product, related }: Props) {
  const { addItem } = useCartStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0] || ""
  );
  const [activeTab, setActiveTab] = useState<"description" | "reviews">(
    "description"
  );
  const [added, setAdded] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({ author: "", rating: 5, title: "", body: "" });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [allReviews, setAllReviews] = useState(product.reviews);

  const handleReviewSubmit = async () => {
    if (!reviewForm.author || !reviewForm.body) return;
    setReviewSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          author: reviewForm.author,
          rating: reviewForm.rating,
          title: reviewForm.title,
          body: reviewForm.body,
        }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setAllReviews([...allReviews, newReview]);
        setReviewSuccess(true);
        setReviewForm({ author: "", rating: 5, title: "", body: "" });
        setTimeout(() => setReviewSuccess(false), 4000);
        setShowReviewForm(false);
      }
    } catch {}
    finally { setReviewSubmitting(false); }
  };

  const discount = product.compareAtPrice
    ? Math.round(
        ((parseFloat(product.compareAtPrice) - parseFloat(product.price)) /
          parseFloat(product.compareAtPrice)) *
          100
      )
    : 0;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images[0] || "",
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: product.reviews.filter((r) => r.rating === rating).length,
    percentage:
      product.reviews.length > 0
        ? (product.reviews.filter((r) => r.rating === rating).length /
            product.reviews.length) *
          100
        : 0,
  }));

  return (
    <div className="pt-[calc(2.5rem+4rem)] sm:pt-[calc(2.5rem+5rem)]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center gap-2 text-xs text-warm-gray-400">
          <Link href="/" className="hover:text-warm-gray-600">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/shop" className="hover:text-warm-gray-600">
            Shop
          </Link>
          {product.categoryName && (
            <>
              <ChevronRight size={12} />
              <span className="hover:text-warm-gray-600">
                {product.categoryName}
              </span>
            </>
          )}
          <ChevronRight size={12} />
          <span className="text-warm-gray-600">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] bg-warm-gray-50 rounded-2xl overflow-hidden">
              {product.images[selectedImage] && (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
              {product.badge && (
                <span
                  className={`absolute top-4 left-4 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full ${
                    product.badge === "Sale"
                      ? "bg-rose-500 text-white"
                      : product.badge === "New Arrival" ||
                        product.badge === "New"
                      ? "bg-warm-gray-900 text-white"
                      : product.badge === "Best Seller"
                      ? "bg-gold-500 text-white"
                      : "bg-white/90 text-warm-gray-900"
                  }`}
                >
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === i
                        ? "border-warm-gray-900"
                        : "border-transparent hover:border-warm-gray-300"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:py-4">
            <div className="space-y-6">
              {/* Title & Price */}
              <div>
                <p className="text-xs text-warm-gray-400 uppercase tracking-wider mb-2">
                  {product.categoryName}
                </p>
                <h1
                  className="font-serif text-2xl sm:text-3xl lg:text-4xl text-warm-gray-900 mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {product.name}
                </h1>

                {/* Rating */}
                {product.reviewCount > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <StarRating
                      rating={product.averageRating}
                      showValue
                      count={product.reviewCount}
                    />
                  </div>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl font-semibold text-warm-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <>
                      <span className="text-lg text-warm-gray-400 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                      <span className="text-sm font-medium text-rose-500 bg-rose-50 px-2 py-0.5 rounded">
                        Save {discount}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-warm-gray-500 leading-relaxed text-sm">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-warm-gray-700 mb-3 block">
                    Color:{" "}
                    <span className="font-normal text-warm-gray-400">
                      {selectedColor}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                          selectedColor === color
                            ? "border-warm-gray-900 bg-warm-gray-900 text-white"
                            : "border-warm-gray-200 text-warm-gray-600 hover:border-warm-gray-400"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-warm-gray-700 mb-3 block">
                    Size:{" "}
                    <span className="font-normal text-warm-gray-400">
                      {selectedSize || "Select a size"}
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 flex items-center justify-center text-sm border rounded-lg transition-colors ${
                          selectedSize === size
                            ? "border-warm-gray-900 bg-warm-gray-900 text-white"
                            : "border-warm-gray-200 text-warm-gray-600 hover:border-warm-gray-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={product.sizes.length > 0 && !selectedSize}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm tracking-wider uppercase font-medium transition-all duration-300 ${
                    added
                      ? "bg-green-600 text-white"
                      : product.sizes.length > 0 && !selectedSize
                      ? "bg-warm-gray-300 text-warm-gray-500 cursor-not-allowed"
                      : "bg-warm-gray-900 text-white hover:bg-warm-gray-800"
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={16} /> Added to Bag
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} /> Add to Bag
                    </>
                  )}
                </button>
                <button className="w-14 h-14 flex items-center justify-center border border-warm-gray-200 rounded hover:border-rose-300 hover:text-rose-500 transition-colors">
                  <Heart size={20} />
                </button>
              </div>

              {/* WhatsApp Order */}
              <a
                href={`https://wa.me/923295578925?text=${encodeURIComponent(
                  `Assalam o Alaikum! Mujhe ye product order karna hai:\n\n*${product.name}*\nPrice: Rs. ${parseFloat(product.price).toLocaleString()}\n${selectedSize ? `Size: ${selectedSize}` : ""}\n${selectedColor ? `Color: ${selectedColor}` : ""}\n\nPlease confirm availability.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3.5 rounded-lg text-sm font-semibold transition-colors"
              >
                <MessageCircle size={18} />
                WhatsApp Se Order Karein
              </a>

              {/* Call to Order */}
              <a
                href="tel:03295578925"
                className="flex items-center justify-center gap-2 border-2 border-warm-gray-200 hover:border-warm-gray-300 text-warm-gray-700 px-4 py-3 rounded-lg text-sm transition-colors"
              >
                📞 Call: 03295578925
              </a>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-warm-gray-100">
                <div className="text-center">
                  <Truck size={18} className="mx-auto text-warm-gray-400 mb-1" />
                  <p className="text-[10px] text-warm-gray-500">
                    Free Delivery 5K+
                  </p>
                </div>
                <div className="text-center">
                  <RotateCcw
                    size={18}
                    className="mx-auto text-warm-gray-400 mb-1"
                  />
                  <p className="text-[10px] text-warm-gray-500">
                    30-Day Returns
                  </p>
                </div>
                <div className="text-center">
                  <Shield
                    size={18}
                    className="mx-auto text-warm-gray-400 mb-1"
                  />
                  <p className="text-[10px] text-warm-gray-500">
                    Secure Checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16 border-t border-warm-gray-100 pt-12">
          <div className="flex gap-8 border-b border-warm-gray-100 mb-8">
            <button
              onClick={() => setActiveTab("description")}
              className={`pb-4 text-sm tracking-wider uppercase transition-colors relative ${
                activeTab === "description"
                  ? "text-warm-gray-900 font-semibold"
                  : "text-warm-gray-400 hover:text-warm-gray-600"
              }`}
            >
              Description
              {activeTab === "description" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-warm-gray-900" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 text-sm tracking-wider uppercase transition-colors relative ${
                activeTab === "reviews"
                  ? "text-warm-gray-900 font-semibold"
                  : "text-warm-gray-400 hover:text-warm-gray-600"
              }`}
            >
              Reviews ({product.reviewCount})
              {activeTab === "reviews" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-warm-gray-900" />
              )}
            </button>
          </div>

          {activeTab === "description" ? (
            <div className="max-w-3xl">
              <p className="text-warm-gray-600 leading-relaxed">
                {product.description}
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-warm-gray-800 mb-2">
                    Details
                  </h3>
                  <ul className="text-sm text-warm-gray-500 space-y-1.5">
                    <li>• Premium quality materials</li>
                    <li>• Carefully crafted construction</li>
                    <li>• Dry clean recommended</li>
                    <li>• Imported</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-warm-gray-800 mb-2">
                    Shipping & Returns
                  </h3>
                  <ul className="text-sm text-warm-gray-500 space-y-1.5">
                    <li>• Free delivery on orders over Rs. 5,000</li>
                    <li>• Express delivery available</li>
                    <li>• 30-day hassle-free returns</li>
                    <li>• Full refund or exchange</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Rating Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <div className="text-center md:text-left">
                  <div className="text-5xl font-semibold text-warm-gray-900 mb-2">
                    {product.averageRating.toFixed(1)}
                  </div>
                  <StarRating
                    rating={product.averageRating}
                    size={18}
                  />
                  <p className="text-sm text-warm-gray-400 mt-2">
                    Based on {product.reviewCount} reviews
                  </p>
                </div>

                <div className="md:col-span-2 space-y-2">
                  {ratingDistribution.map((dist) => (
                    <div key={dist.rating} className="flex items-center gap-3">
                      <span className="text-sm text-warm-gray-500 w-6">
                        {dist.rating}★
                      </span>
                      <div className="flex-1 bg-warm-gray-100 rounded-full h-2.5">
                        <div
                          className="bg-gold-400 h-2.5 rounded-full transition-all"
                          style={{ width: `${dist.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-warm-gray-400 w-8">
                        {dist.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Write Review Button + Success */}
              {reviewSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3 animate-fade-in">
                  <Check size={20} className="text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Review submit ho gaya! ✨</p>
                    <p className="text-xs text-green-600">Shukriya aap ke feedback ka!</p>
                  </div>
                </div>
              )}

              {!showReviewForm ? (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="mb-8 flex items-center gap-2 bg-warm-gray-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-warm-gray-800 transition-colors"
                >
                  ✍️ Write a Review
                </button>
              ) : (
                <div className="mb-8 bg-warm-gray-50 rounded-2xl p-5 sm:p-6 border border-warm-gray-100 animate-fade-in">
                  <h3 className="font-semibold text-warm-gray-900 mb-4 flex items-center gap-2">
                    ✍️ Apna Review Likhein
                  </h3>
                  <div className="space-y-4">
                    {/* Star Selection */}
                    <div>
                      <label className="block text-xs font-medium text-warm-gray-600 mb-2">Rating *</label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: i })}
                            onMouseEnter={() => setHoverRating(i)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-0.5 transition-transform hover:scale-125"
                          >
                            <Star
                              size={28}
                              className={
                                i <= (hoverRating || reviewForm.rating)
                                  ? "fill-amber-400 text-amber-400"
                                  : "fill-warm-gray-200 text-warm-gray-200"
                              }
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-warm-gray-500">
                          {reviewForm.rating === 5 ? "Excellent! ⭐" : reviewForm.rating === 4 ? "Great! 👍" : reviewForm.rating === 3 ? "Good 🙂" : reviewForm.rating === 2 ? "Fair" : "Poor"}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-warm-gray-600 mb-1">Aap ka Naam *</label>
                        <input
                          type="text"
                          value={reviewForm.author}
                          onChange={(e) => setReviewForm({ ...reviewForm, author: e.target.value })}
                          placeholder="e.g., Ayesha K."
                          className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-warm-gray-600 mb-1">Title (optional)</label>
                        <input
                          type="text"
                          value={reviewForm.title}
                          onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                          placeholder="e.g., Bohat pyari dress!"
                          className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-warm-gray-600 mb-1">Review *</label>
                      <textarea
                        value={reviewForm.body}
                        onChange={(e) => setReviewForm({ ...reviewForm, body: e.target.value })}
                        rows={3}
                        placeholder="Apna experience share karein... fabric quality, fitting, delivery, etc."
                        className="w-full border border-warm-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleReviewSubmit}
                        disabled={reviewSubmitting || !reviewForm.author || !reviewForm.body}
                        className="flex-1 bg-rose-500 text-white py-3 rounded-xl text-sm font-semibold hover:bg-rose-600 disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
                      >
                        {reviewSubmitting ? "Submitting..." : "Submit Review ✓"}
                      </button>
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="px-5 py-3 border border-warm-gray-200 rounded-xl text-sm text-warm-gray-600 hover:bg-warm-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {allReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-warm-gray-100 pb-6 last:border-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <StarRating rating={review.rating} size={12} />
                          {review.verified && (
                            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-medium">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        {review.title && (
                          <h4 className="text-sm font-semibold text-warm-gray-800">
                            {review.title}
                          </h4>
                        )}
                      </div>
                    </div>
                    {review.body && (
                      <p className="text-sm text-warm-gray-500 leading-relaxed">
                        {review.body}
                      </p>
                    )}
                    <p className="text-xs text-warm-gray-400 mt-2">
                      {review.author}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-warm-gray-100">
            <h2
              className="font-serif text-2xl text-warm-gray-900 mb-8"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-8">
              {related.map((p) => (
                <Link key={p.id} href={`/product/${p.slug}`} className="group block">
                  <div className="relative aspect-[3/4] bg-warm-gray-100 rounded-xl overflow-hidden mb-4">
                    {p.images[0] && (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-warm-gray-900 group-hover:text-rose-600 transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm font-semibold text-warm-gray-900 mt-1">
                    {formatPrice(p.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
