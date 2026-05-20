/* ══════════════════════════════════════════════
   CART STORE — In-memory cart (globalThis)
   ══════════════════════════════════════════════ */

import type { Cart, CartItem } from "@/types/order.type";
import type { Product } from "@/types/product.type";

interface CartStore {
  carts: Record<string, Cart>; // userId → Cart
}

const getStore = (): CartStore => {
  const g = globalThis as unknown as { __cartStore?: CartStore };
  if (!g.__cartStore) {
    g.__cartStore = { carts: {} };
  }
  return g.__cartStore;
};

const emptyCart = (): Cart => ({
  items: [],
  totalItems: 0,
  totalPrice: 0,
  discountTotal: 0,
});

const recalc = (cart: Cart) => {
  cart.totalItems = cart.items.reduce((s, i) => s + i.quantity, 0);
  cart.totalPrice = cart.items.reduce(
    (s, i) => s + (i.discountPrice ?? i.price) * i.quantity,
    0
  );
  cart.discountTotal = cart.items.reduce(
    (s, i) =>
      s + (i.discountPrice ? (i.price - i.discountPrice) * i.quantity : 0),
    0
  );
};

/* ── Public API ── */

export const getCart = (userId: string): Cart => {
  const store = getStore();
  if (!store.carts[userId]) store.carts[userId] = emptyCart();
  return store.carts[userId];
};

export const addToCart = (
  userId: string,
  product: Product,
  quantity = 1
): Cart => {
  const cart = getCart(userId);
  const existing = cart.items.find((i) => i.productId === product.id);

  if (existing) {
    existing.quantity = Math.min(
      existing.quantity + quantity,
      existing.maxStock
    );
  } else {
    cart.items.push({
      productId: product.id,
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.image,
      quantity: Math.min(quantity, product.stock),
      maxStock: product.stock,
    });
  }
  recalc(cart);
  return cart;
};

export const updateCartItem = (
  userId: string,
  productId: string,
  quantity: number
): Cart => {
  const cart = getCart(userId);
  const item = cart.items.find((i) => i.productId === productId);
  if (item) {
    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId !== productId);
    } else {
      item.quantity = Math.min(quantity, item.maxStock);
    }
  }
  recalc(cart);
  return cart;
};

export const removeFromCart = (userId: string, productId: string): Cart => {
  const cart = getCart(userId);
  cart.items = cart.items.filter((i) => i.productId !== productId);
  recalc(cart);
  return cart;
};

export const clearCart = (userId: string): Cart => {
  const store = getStore();
  store.carts[userId] = emptyCart();
  return store.carts[userId];
};
