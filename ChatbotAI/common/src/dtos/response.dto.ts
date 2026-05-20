export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; errors?: any[] };
  pagination?: { page: number; limit: number; total: number; totalPages: number };
}