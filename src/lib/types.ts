export interface Product {
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
  createdAt: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
}

export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  title: string | null;
  body: string | null;
  verified: boolean;
  createdAt: Date;
}

export interface ProductWithReviews extends Product {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
  categoryName?: string;
}
