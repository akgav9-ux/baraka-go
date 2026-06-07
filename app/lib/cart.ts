"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
  image?: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  clear: () => void;
  total: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,

      addItem: (item) => {
        const { items, restaurantId } = get();
        if (restaurantId && restaurantId !== item.restaurantId) {
          if (!confirm("Корзина будет очищена. Добавить из другого ресторана?")) return;
          set({ items: [], restaurantId: item.restaurantId });
        }
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
            restaurantId: item.restaurantId,
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }], restaurantId: item.restaurantId });
        }
      },

      removeItem: (id) => {
        const next = get().items.filter((i) => i.id !== id);
        set({ items: next, restaurantId: next.length ? get().restaurantId : null });
      },

      inc: (id) =>
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)),
        }),

      dec: (id) => {
        const next = get()
          .items.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0);
        set({ items: next, restaurantId: next.length ? get().restaurantId : null });
      },

      clear: () => set({ items: [], restaurantId: null }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "food-cart" }
  )
);