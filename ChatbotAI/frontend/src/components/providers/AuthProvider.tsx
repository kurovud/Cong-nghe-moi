"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { User, Cart, WishlistItem, AppNotification } from "@/types/order.type";
import { authApi } from "@/services/auth.api";
import { cartApi, wishlistApi } from "@/services/conference.api";
import { notificationApi } from "@/services/notification.api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  cart: Cart;
  wishlist: WishlistItem[];
  notifications: AppNotification[];
  unreadCount: number;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshCart: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

const emptyCart: Cart = { items: [], totalItems: 0, totalPrice: 0, discountTotal: 0 };

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  cart: emptyCart,
  wishlist: [],
  notifications: [],
  unreadCount: 0,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: () => {},
  refreshCart: async () => {},
  refreshWishlist: async () => {},
  refreshNotifications: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const mapUser = (raw: any): User => ({
    id: raw.id,
    email: raw.email,
    name: raw.name,
    phone: raw.phone,
    avatar: raw.avatar,
    role:
      String(raw.role || "USER").toUpperCase() === "ADMIN"
        ? "admin"
        : String(raw.role || "USER").toUpperCase() === "STAFF"
          ? "staff"
          : "customer",
    addresses: raw.addresses ?? [],
    createdAt: raw.createdAt ?? new Date().toISOString(),
  });

  const mapCart = (items: any[]): Cart => {
    const safeItems = Array.isArray(items) ? items : [];
    const totalItems = safeItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const totalPrice = safeItems.reduce((sum, item) => {
      const unit = Number(item.discountPrice ?? item.price ?? 0);
      return sum + unit * Number(item.quantity || 0);
    }, 0);
    const discountTotal = safeItems.reduce((sum, item) => {
      if (!item.discountPrice) return sum;
      return sum + (Number(item.price || 0) - Number(item.discountPrice || 0)) * Number(item.quantity || 0);
    }, 0);
    return { items: safeItems, totalItems, totalPrice, discountTotal };
  };

  const refreshCart = useCallback(async () => {
    if (!token) {
      setCart(emptyCart);
      return;
    }
    try {
      const data = await cartApi.getCart();
      setCart(mapCart(data?.data ?? []));
    } catch { /* ignore */ }
  }, [token]);

  const refreshWishlist = useCallback(async () => {
    if (!token) {
      setWishlist([]);
      return;
    }
    try {
      const data = await wishlistApi.getWishlist();
      setWishlist(data?.data ?? []);
    } catch { /* ignore */ }
  }, [token]);

  const refreshNotifications = useCallback(async () => {
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      const data = await notificationApi.getNotifications();
      const list = data?.data?.notifications ?? [];
      setNotifications(list);
      setUnreadCount(Number(data?.data?.unreadCount ?? list.filter((item: any) => !item.read).length));
    } catch { /* ignore */ }
  }, [token]);

  // restore session on mount
  useEffect(() => {
    const devHost = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const devForce = devHost && typeof window !== "undefined" && localStorage.getItem("DEV_FORCE_ADMIN") === "1";
    if (devForce) {
      const devUser = mapUser({ id: "dev-admin", email: "admin@pcbuildershop.vn", name: "Dev Admin", role: "ADMIN", createdAt: new Date().toISOString() });
      setUser(devUser);
      setToken("dev-token");
      setLoading(false);
      return;
    }

    const savedToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (savedToken) {
      authApi.getProfile()
        .then((data) => {
          if (data?.success && data?.data) {
            setUser(mapUser(data.data));
            setToken(savedToken);
          } else {
            localStorage.removeItem("auth_token");
          }
        })
        .catch(() => localStorage.removeItem("auth_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // refresh protected user data only when session is available
  useEffect(() => {
    if (user && token) {
      refreshCart();
      refreshWishlist();
      refreshNotifications();
      return;
    }

    setCart(emptyCart);
    setWishlist([]);
    setNotifications([]);
    setUnreadCount(0);
  }, [user, token, refreshCart, refreshWishlist, refreshNotifications]);

  const loginFn = async (email: string, password: string) => {
    try {
      const data = await authApi.login({ email, password });
      const payload = data?.data;
      if (!payload?.accessToken || !payload?.user) {
        return { success: false, error: "Đăng nhập thất bại" };
      }
      setUser(mapUser(payload.user));
      setToken(payload.accessToken);
      localStorage.setItem("auth_token", payload.accessToken);
      localStorage.setItem("refresh_token", payload.refreshToken || "");
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error?.message || "Lỗi kết nối" };
    }
  };

  const registerFn = async (data: { email: string; password: string; name: string; phone?: string }) => {
    try {
      const res = await authApi.register(data);
      const payload = res?.data;
      if (!payload?.accessToken || !payload?.user) {
        return { success: false, error: "Đăng ký thất bại" };
      }
      setUser(mapUser(payload.user));
      setToken(payload.accessToken);
      localStorage.setItem("auth_token", payload.accessToken);
      localStorage.setItem("refresh_token", payload.refreshToken || "");
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error?.message || "Lỗi kết nối" };
    }
  };

  const logoutFn = () => {
    const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
    if (refreshToken) authApi.logout(refreshToken).catch(() => {});
    setUser(null);
    setToken(null);
    setCart(emptyCart);
    setWishlist([]);
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
  };

  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      setToken(null);
      setCart(emptyCart);
      setWishlist([]);
      setNotifications([]);
      setUnreadCount(0);
    };

    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        cart,
        wishlist,
        notifications,
        unreadCount,
        login: loginFn,
        register: registerFn,
        logout: logoutFn,
        refreshCart,
        refreshWishlist,
        refreshNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
