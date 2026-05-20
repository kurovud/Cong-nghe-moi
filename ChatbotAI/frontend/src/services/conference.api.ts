/**
 * Order/Conference API service — calls backend order-service via API gateway
 */
import { http } from './http';
import { resolveProductImage } from '@/lib/product-image';

function normalizeItemImages(items: any[] = []) {
  return items.map((item) => ({
    ...item,
    image: resolveProductImage(item?.image, item?.category),
  }));
}

function normalizeOrderPayload(payload: any) {
  if (!payload || typeof payload !== 'object') return payload;
  if (Array.isArray(payload.items)) {
    return { ...payload, items: normalizeItemImages(payload.items) };
  }
  return payload;
}

export const cartApi = {
  getCart: () =>
    http.get<any>('/api/cart').then((res) => ({
      ...res,
      data: normalizeItemImages(res?.data ?? []),
    })),
  updateItems: (items: any[]) =>
    http.put<any>('/api/cart', { items }),
  clearCart: () => http.delete<any>('/api/cart'),
};

export const orderApi = {
  createOrder: (data: any) => http.post<any>('/api/orders', data),
  getMyOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    http.get<any>('/api/orders', params as any).then((res) => ({
      ...res,
      data: (res?.data ?? []).map(normalizeOrderPayload),
    })),
  getOrderById: (id: string) =>
    http.get<any>(`/api/orders/${id}`).then((res) => ({
      ...res,
      data: normalizeOrderPayload(res?.data),
    })),
  cancelOrder: (id: string) => http.put<any>(`/api/orders/${id}/cancel`),

  // Admin
  getAllOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    http.get<any>('/api/orders', params as any).then((res) => ({
      ...res,
      data: (res?.data ?? []).map((o: any) => ({ ...normalizeOrderPayload(o), status: String(o.status || '').toLowerCase() })),
    })),
  updateOrderStatus: (id: string, data: { status: string; paymentStatus?: string }) =>
    // Normalize status to backend expected format (UPPERCASE strings)
    (typeof window !== 'undefined'
      ? fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_status',
            orderId: id,
            status: String(data.status || '').toUpperCase(),
            paymentStatus: data.paymentStatus ? String(data.paymentStatus || '').toUpperCase() : undefined,
            token: localStorage.getItem('auth_token'),
          }),
        }).then((r) => r.json())
      : http.put<any>(`/api/orders/${id}/status`, { status: String(data.status || '').toUpperCase(), paymentStatus: data.paymentStatus ? String(data.paymentStatus || '').toUpperCase() : undefined })),
  getOrderStats: () => http.get<any>('/api/orders/stats'),

  validateCoupon: (code: string, subtotal: number) =>
    http.post<any>('/api/coupons/validate', { code, subtotal }),
};

export const wishlistApi = {
  getWishlist: () =>
    http.get<any>('/api/wishlist').then((res) => ({
      ...res,
      data: normalizeItemImages(res?.data ?? []),
    })),
  addItem: (productId: string) => http.post<any>('/api/wishlist', { productId }),
  removeItem: (productId: string) => http.delete<any>(`/api/wishlist/${productId}`),
  checkItem: (productId: string) => http.get<any>(`/api/wishlist/check/${productId}`),
};
