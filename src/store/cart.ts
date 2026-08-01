"use client";

import { create } from "zustand";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: number, size?: string, color?: string) => void;
  updateQuantity: (
    productId: number,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

function getKey(item: { productId: number; size?: string; color?: string }) {
  return `${item.productId}-${item.size || ""}-${item.color || ""}`;
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("momis-cart");
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("momis-cart", JSON.stringify(items));
  } catch {}
}

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCartFromStorage(),
  isOpen: false,

  addItem: (item) => {
    const items = [...get().items];
    const existingIndex = items.findIndex(
      (i) =>
        i.productId === item.productId &&
        i.size === item.size &&
        i.color === item.color
    );
    if (existingIndex >= 0) {
      items[existingIndex].quantity += 1;
    } else {
      items.push({ ...item, quantity: 1 });
    }
    saveCartToStorage(items);
    set({ items, isOpen: true });
  },

  removeItem: (productId, size, color) => {
    const items = get().items.filter(
      (i) =>
        !(
          i.productId === productId &&
          i.size === size &&
          i.color === color
        )
    );
    saveCartToStorage(items);
    set({ items });
  },

  updateQuantity: (productId, quantity, size, color) => {
    const items = get().items.map((i) => {
      if (
        i.productId === productId &&
        i.size === size &&
        i.color === color
      ) {
        return { ...i, quantity: Math.max(0, quantity) };
      }
      return i;
    }).filter((i) => i.quantity > 0);
    saveCartToStorage(items);
    set({ items });
  },

  clearCart: () => {
    saveCartToStorage([]);
    set({ items: [] });
  },

  toggleCart: () => set({ isOpen: !get().isOpen }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
  subtotal: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
