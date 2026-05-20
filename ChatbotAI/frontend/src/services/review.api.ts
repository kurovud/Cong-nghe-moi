/**
 * Review API service — calls backend review-service via API gateway
 */
import { http } from './http';

export const reviewApi = {
  getProductReviews: (productId: string, params?: { page?: number; limit?: number; sort?: string }) =>
    http.get<any>(`/api/reviews/product/${productId}`, params as any),

  getProductStats: (productId: string) =>
    http.get<any>(`/api/reviews/product/${productId}/stats`),

  createReview: (data: { productId: string; rating: number; title: string; content: string; pros?: string[]; cons?: string[] }) =>
    http.post<any>('/api/reviews', data),

  updateReview: (id: string, data: any) =>
    http.put<any>(`/api/reviews/${id}`, data),

  deleteReview: (id: string) =>
    http.delete<any>(`/api/reviews/${id}`),

  // Admin
  getAllReviews: (params?: { page?: number; limit?: number; status?: string }) =>
    http.get<any>('/api/reviews', params as any),

  moderateReview: (id: string, data: { status: string }) =>
    http.put<any>(`/api/reviews/${id}/moderate`, data),
};
