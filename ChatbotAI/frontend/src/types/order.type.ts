/* ══════════════════════════════════════════════
   CART TYPES
   ══════════════════════════════════════════════ */

export interface CartItem {
  productId: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  image: string;
  quantity: number;
  maxStock: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  discountTotal: number;
}

/* ══════════════════════════════════════════════
   ORDER TYPES
   ══════════════════════════════════════════════ */

export type OrderStatus =
  | "pending"       // Chờ xác nhận
  | "confirmed"     // Đã xác nhận
  | "processing"    // Đang chuẩn bị
  | "shipping"      // Đang giao hàng
  | "delivered"     // Đã giao / Hoàn thành
  | "returned"      // Đã trả hàng
  | "cancelled"     // Đã hủy
  | "refunded";     // Đã hoàn tiền

export type PaymentMethod =
  | "cod"           // Thanh toán khi nhận hàng
  | "bank_transfer" // Chuyển khoản ngân hàng
  | "momo"          // Ví MoMo
  | "zalopay"       // ZaloPay
  | "credit_card"   // Thẻ tín dụng
  | "installment";  // Trả góp

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  note?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  image: string;
  quantity: number;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  note?: string;
  timeline: OrderTimeline[];
  createdAt: string;
  updatedAt: string;
}

/* ══════════════════════════════════════════════
   USER TYPES
   ══════════════════════════════════════════════ */

export type UserRole = "customer" | "staff" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  addresses: ShippingAddress[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/* ══════════════════════════════════════════════
   WISHLIST
   ══════════════════════════════════════════════ */

export interface WishlistItem {
  productId: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number;
  image: string;
  addedAt: string;
}

/* ══════════════════════════════════════════════
   PRODUCT REVIEW
   ══════════════════════════════════════════════ */

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  content: string;
  pros?: string[];
  cons?: string[];
  verified: boolean; // mua hàng xác thực
  createdAt: string;
}

/* ══════════════════════════════════════════════
   COUPON
   ══════════════════════════════════════════════ */

export type CouponType = "percent" | "fixed";

export interface Coupon {
  code: string;
  type: CouponType;
  value: number; // % hoặc VNĐ
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
}

/* ══════════════════════════════════════════════
   NOTIFICATION
   ══════════════════════════════════════════════ */

export type NotificationType = "order" | "promo" | "system" | "review";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}
