/**
 * Base HTTP client for communicating with the API Gateway
 */
const API_GATEWAY = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${API_GATEWAY}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string>),
  };

  // Auto attach JWT for browser requests to protected endpoints.
  if (typeof window !== 'undefined' && !headers.Authorization) {
    const token = localStorage.getItem('auth_token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...fetchOptions,
    headers,
    credentials: 'include',
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));

    if (typeof window !== 'undefined' && res.status === 401) {
      const message = String((body as any)?.error?.message || (body as any)?.message || '').toLowerCase();
      const sessionSensitiveEndpoint =
        endpoint.startsWith('/api/users/') || endpoint.startsWith('/api/auth/refresh-token');
      const tokenExpiredSignal =
        message.includes('token') ||
        message.includes('jwt') ||
        message.includes('expired') ||
        message.includes('hết hạn') ||
        message.includes('phiên đăng nhập');

      // Avoid forcing logout on any arbitrary 401 (e.g., temporarily misconfigured protected services).
      if (sessionSensitiveEndpoint || tokenExpiredSignal) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }

    throw new Error((body as any)?.error?.message || (body as any)?.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const http = {
  get: <T>(url: string, params?: Record<string, any>) =>
    request<T>(url, { method: 'GET', params }),

  post: <T>(url: string, data?: any) =>
    request<T>(url, { method: 'POST', body: data ? JSON.stringify(data) : undefined }),

  put: <T>(url: string, data?: any) =>
    request<T>(url, { method: 'PUT', body: data ? JSON.stringify(data) : undefined }),

  delete: <T>(url: string, data?: any) =>
    request<T>(url, { method: 'DELETE', body: data ? JSON.stringify(data) : undefined }),
};

/**
 * Internal server-side HTTP client (for Next.js API routes → backend)
 * Uses server-side URL (docker networking or localhost)
 */
const INTERNAL_API = process.env.API_GATEWAY_URL || 'http://localhost:4000';

export async function serverFetch<T>(
  endpoint: string,
  init?: RequestInit & { params?: Record<string, string | number | boolean | undefined> }
): Promise<T> {
  const { params, ...fetchInit } = init || {};

  let url = `${INTERNAL_API}${endpoint}`;
  if (params) {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') sp.append(k, String(v));
    });
    const qs = sp.toString();
    if (qs) url += `?${qs}`;
  }

  const res = await fetch(url, {
    ...fetchInit,
    headers: {
      'Content-Type': 'application/json',
      ...(fetchInit?.headers as Record<string, string>),
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(body.message || `HTTP ${res.status}`);
  }

  return res.json();
}
