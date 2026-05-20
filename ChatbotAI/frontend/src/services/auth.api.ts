/**
 * Auth API service — calls backend auth-service via API gateway
 */
import { http } from './http';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: any;
    accessToken: string;
    refreshToken: string;
  };
}

export const authApi = {
  login: (data: LoginRequest) => http.post<AuthResponse>('/api/auth/login', data),

  register: (data: RegisterRequest) => http.post<AuthResponse>('/api/auth/register', data),

  refreshToken: (refreshToken: string) =>
    http.post<AuthResponse>('/api/auth/refresh-token', { refreshToken }),

  logout: (refreshToken: string) =>
    http.post<{ success: boolean }>('/api/auth/logout', { refreshToken }),

  getProfile: () => http.get<{ success: boolean; data: any }>('/api/users/profile'),

  updateProfile: (data: any) => http.put<{ success: boolean; data: any }>('/api/users/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    http.put<{ success: boolean }>('/api/users/change-password', data),
};
