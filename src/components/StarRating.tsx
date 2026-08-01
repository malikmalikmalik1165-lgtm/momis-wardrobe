"use client";

import { Star } from "lucide-react";

interface Props {
  rating: number;
  size?: number;
  showValue?: boolean;
  count?: number;
}

export default function StarRating({
  rating,
  size = 14,
  showValue = false,
  count,
}: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={
              i <= Math.round(rating)
                ? "fill-gold-400 text-gold-400"
                : "fill-warm-gray-200 text-warm-gray-200"
            }
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm font-medium text-warm-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-sm text-warm-gray-400">
          ({count} {count === 1 ? "review" : "reviews"})
        </span>
      )}
    </div>
  );
}
