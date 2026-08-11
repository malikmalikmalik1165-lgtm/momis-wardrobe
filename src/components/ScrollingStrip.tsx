"use client";

import Image from "next/image";
import Link from "next/link";

interface Props {
  products: { id: number; slug: string; name: string; images: string[]; price: string }[];
}

export default function ScrollingStrip({ products }: Props) {
  if (products.length === 0) return null;
  const doubled = [...products, ...products];

  return (
    <div className="overflow-hidden bg-white py-5 border-y border-warm-gray-100">
      <div className="flex animate-scroll w-max">
        {doubled.map((p, i) => (
          <Link key={`${p.id}-${i}`} href={`/product/${p.slug}`}
            className="flex-shrink-0 w-24 sm:w-28 mx-2 group">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-warm-gray-100 mb-1.5">
              {p.images?.[0] && (
                <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="112px" />
              )}
            </div>
            <p className="text-[10px] text-warm-gray-600 truncate text-center group-hover:text-rose-500 transition-colors">{p.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
