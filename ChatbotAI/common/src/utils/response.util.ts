interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: { code: string; details?: unknown };
  pagination?: { page: number; limit: number; total: number; totalPages: number };
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  const body: ApiResponse<T> = { success: true, data };
  if (message) body.message = message;
  return body;
}

export function errorResponse(
  message: string,
  code = "INTERNAL_ERROR",
  details?: unknown
): ApiResponse {
  return { success: false, message, error: { code, details } };
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
