/**
 * Product/Paper API service — calls backend product-service via API gateway
 */
import { http } from './http';
import { normalizeProductImage, normalizeProductImageList } from '@/lib/product-image';

function normalizeProductPayload(response: any) {
  if (Array.isArray(response?.data)) {
    return { ...response, data: normalizeProductImageList(response.data) };
  }

  if (response?.data && typeof response.data === 'object' && response.data.image !== undefined) {
    return { ...response, data: normalizeProductImage(response.data) };
  }

  return response;
}

export const productApi = {
  getProducts: (params?: { category?: string; brand?: string; search?: string; minPrice?: number; maxPrice?: number; page?: number; limit?: number; sort?: string; order?: string }) =>
    http.get<any>('/api/products', params as any).then(normalizeProductPayload),

  getProductById: (id: string) => http.get<any>(`/api/products/${id}`).then(normalizeProductPayload),

  searchProducts: (q: string, limit?: number) =>
    http.get<any>('/api/products', { q, limit } as any).then(normalizeProductPayload),

  getCategories: () => http.get<any>('/api/products/categories'),

  getBrands: (category?: string) =>
    http.get<any>('/api/products/brands', { category } as any),

  // Admin
  createProduct: (data: any) => http.post<any>('/api/products', data).then(normalizeProductPayload),
  updateProduct: (id: string, data: any) => http.put<any>(`/api/products/${id}`, data).then(normalizeProductPayload),
  deleteProduct: (id: string) => http.delete<any>(`/api/products/${id}`),
};

export const buildApi = {
  getBuilds: (params?: { purpose?: string; minPrice?: number; maxPrice?: number; page?: number; limit?: number }) =>
    http.get<any>('/api/builds', params as any),

  getBuildById: (id: string) => http.get<any>(`/api/builds/${id}`),

  getCompatRules: () => http.get<any>('/api/builds/compat-rules'),

  getAssemblyGuides: () => http.get<any>('/api/builds/assembly-guides'),

  getAssemblyGuideBySlug: (slug: string) => http.get<any>(`/api/builds/assembly-guides/${slug}`),
};

export const faqApi = {
  getFaqs: (params?: { category?: string; search?: string; page?: number; limit?: number }) =>
    http.get<any>('/api/faq', params as any),

  getFaqById: (id: string) => http.get<any>(`/api/faq/${id}`),
};

export const knowledgeApi = {
  getKnowledge: (params?: { search?: string; page?: number; limit?: number }) =>
    http.get<any>('/api/knowledge', params as any),

  getKnowledgeById: (id: string) => http.get<any>(`/api/knowledge/${id}`),
};
