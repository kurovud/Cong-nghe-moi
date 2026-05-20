/* ══════════════════════════════════════════════
   ORDER STORE — In-memory orders (globalThis)
   ══════════════════════════════════════════════ */

import type {
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ShippingAddress,
  OrderItem,
  Coupon,
} from "@/types/order.type";

interface OrderStore {
  orders: Order[];
  coupons: Coupon[];
}

const getStore = (): OrderStore => {
  const g = globalThis as unknown as { __orderStore?: OrderStore };
  if (!g.__orderStore) {
    g.__orderStore = {
      orders: [],
      coupons: [
        {
          code: "WELCOME10",
          type: "percent",
          value: 10,
          minOrder: 5_000_000,
          maxDiscount: 2_000_000,
          usageLimit: 100,
          usedCount: 12,
          expiresAt: "2026-12-31",
          active: true,
        },
        {
          code: "FREESHIP",
          type: "fixed",
          value: 50_000,
          minOrder: 2_000_000,
          usageLimit: 500,
          usedCount: 45,
          expiresAt: "2026-12-31",
          active: true,
        },
        {
          code: "NEWUSER20",
          type: "percent",
          value: 20,
          minOrder: 10_000_000,
          maxDiscount: 5_000_000,
          usageLimit: 50,
          usedCount: 8,
          expiresAt: "2026-06-30",
          active: true,
        },
        {
          code: "FLASH500K",
          type: "fixed",
          value: 500_000,
          minOrder: 15_000_000,
          usageLimit: 20,
          usedCount: 20,
          expiresAt: "2026-03-15",
          active: false,
        },
      ],
    };
  }
  return g.__orderStore;
};

/* ── Shipping fee calculation ── */
export const calcShippingFee = (address: ShippingAddress): number => {
  const hcmHn = /(hồ chí minh|hà nội|hcm|hn)/i;
  if (hcmHn.test(address.province)) return 30_000;
  return 50_000;
};

/* ── Coupon validation ── */
export const validateCoupon = (
  code: string,
  subtotal: number
): { valid: boolean; discount: number; message: string } => {
  const coupon = getStore().coupons.find(
    (c) => c.code.toUpperCase() === code.toUpperCase()
  );
  if (!coupon) return { valid: false, discount: 0, message: "Mã không tồn tại" };
  if (!coupon.active) return { valid: false, discount: 0, message: "Mã đã hết hiệu lực" };
  if (coupon.usedCount >= coupon.usageLimit)
    return { valid: false, discount: 0, message: "Mã đã hết lượt sử dụng" };
  if (new Date(coupon.expiresAt) < new Date())
    return { valid: false, discount: 0, message: "Mã đã hết hạn" };
  if (subtotal < coupon.minOrder)
    return {
      valid: false,
      discount: 0,
      message: `Đơn tối thiểu ${new Intl.NumberFormat("vi-VN").format(coupon.minOrder)}₫`,
    };

  let discount =
    coupon.type === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value;
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  return { valid: true, discount, message: `Giảm ${new Intl.NumberFormat("vi-VN").format(discount)}₫` };
};

/* ── Create order ── */
export const createOrder = (data: {
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  note?: string;
}): Order => {
  const store = getStore();
  const now = new Date().toISOString();
  const order: Order = {
    id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    userId: data.userId,
    items: data.items,
    shippingAddress: data.shippingAddress,
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentMethod === "cod" ? "pending" : "pending",
    status: "pending",
    subtotal: data.subtotal,
    shippingFee: data.shippingFee,
    discount: data.discount,
    total: data.subtotal + data.shippingFee - data.discount,
    couponCode: data.couponCode,
    note: data.note,
    timeline: [{ status: "pending", timestamp: now, note: "Đơn hàng được tạo" }],
    createdAt: now,
    updatedAt: now,
  };
  store.orders.unshift(order);

  // consume coupon
  if (data.couponCode) {
    const coupon = store.coupons.find(
      (c) => c.code.toUpperCase() === data.couponCode!.toUpperCase()
    );
    if (coupon) coupon.usedCount++;
  }

  return order;
};

/* ── Read orders ── */
export const getOrdersByUser = (userId: string): Order[] =>
  getStore().orders.filter((o) => o.userId === userId);

export const getOrderById = (id: string): Order | undefined =>
  getStore().orders.find((o) => o.id === id);

export const getAllOrders = (): Order[] => getStore().orders;

/* ── Update order status ── */
export const updateOrderStatus = (
  id: string,
  status: OrderStatus,
  note?: string
): Order | null => {
  const order = getOrderById(id);
  if (!order) return null;
  const now = new Date().toISOString();
  order.status = status;
  order.updatedAt = now;
  order.timeline.push({ status, timestamp: now, note });

  // auto update payment status
  if (status === "delivered" && order.paymentMethod === "cod") {
    order.paymentStatus = "paid";
  }
  if (status === "cancelled" && order.paymentStatus === "paid") {
    order.paymentStatus = "refunded";
  }
  return order;
};

export const updatePaymentStatus = (
  id: string,
  paymentStatus: PaymentStatus
): Order | null => {
  const order = getOrderById(id);
  if (!order) return null;
  order.paymentStatus = paymentStatus;
  order.updatedAt = new Date().toISOString();
  return order;
};

/* ── Stats ── */
export const getOrderStats = () => {
  const orders = getStore().orders;
  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled" && o.status !== "returned")
    .reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = orders.filter((o) => o.status === "delivered").length;
  return { totalRevenue, totalOrders, pendingOrders, completedOrders };
};

/* ── Coupons ── */
export const getAllCoupons = (): Coupon[] => getStore().coupons;
