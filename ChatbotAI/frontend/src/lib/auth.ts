/**
 * Server-side auth utilities for Next.js API routes
 * Validates JWT from cookie/header and extracts user info
 */
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_production';

export interface AuthUser {
  userId: string;
  email: string;
  role: string;
}

/**
 * Extract the Bearer token from an Authorization header or cookie
 */
export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Cookie fallback
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/accessToken=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Decode a JWT payload without verification (for Next.js API route proxying)
 * For actual verification, the backend services handle it
 */
export function decodeToken(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

/**
 * Get auth headers to forward to backend services
 */
export function getAuthHeaders(request: Request): Record<string, string> {
  const token = extractToken(request);
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
