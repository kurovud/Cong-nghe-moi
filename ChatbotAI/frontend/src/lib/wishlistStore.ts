/* ══════════════════════════════════════════════
   WISHLIST STORE — In-memory (globalThis)
   ══════════════════════════════════════════════ */

import type { WishlistItem } from "@/types/order.type";
import type { Product } from "@/types/product.type";

interface WishlistStore {
  wishlists: Record<string, WishlistItem[]>; // userId → items
}

const getStore = (): WishlistStore => {
  const g = globalThis as unknown as { __wishlistStore?: WishlistStore };
  if (!g.__wishlistStore) {
    g.__wishlistStore = { wishlists: {} };
  }
  return g.__wishlistStore;
};

export const getWishlist = (userId: string): WishlistItem[] => {
  const store = getStore();
  if (!store.wishlists[userId]) store.wishlists[userId] = [];
  return store.wishlists[userId];
};

export const addToWishlist = (userId: string, product: Product): WishlistItem[] => {
  const list = getWishlist(userId);
  if (list.find((i) => i.productId === product.id)) return list;
  list.push({
    productId: product.id,
    name: product.name,
    category: product.category,
    brand: product.brand,
    price: product.price,
    discountPrice: product.discountPrice,
    image: product.image,
    addedAt: new Date().toISOString(),
  });
  return list;
};

export const removeFromWishlist = (userId: string, productId: string): WishlistItem[] => {
  const store = getStore();
  const list = getWishlist(userId);
  store.wishlists[userId] = list.filter((i) => i.productId !== productId);
  return store.wishlists[userId];
};

export const isInWishlist = (userId: string, productId: string): boolean => {
  return getWishlist(userId).some((i) => i.productId === productId);
};
