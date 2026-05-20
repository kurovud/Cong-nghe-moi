import { AppError, HttpStatus, ErrorCode } from "@chatbot/common";
import { cartRepo, orderRepo, wishlistRepo, couponRepo } from "../repositories/conference.repo";

function generateOrderNumber(): string {
  const d = new Date();
  const prefix = `ORD${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${rand}`;
}

export const cartService = {
  async getCart(userId: string) {
    const cart = await cartRepo.findByUserId(userId);
    return cart ? cart.items : [];
  },

  async updateCart(userId: string, items: any[]) {
    const cart = await cartRepo.upsert(userId, items);
    return cart.items;
  },

  async clearCart(userId: string) {
    await cartRepo.delete(userId);
  },
};

export const orderService = {
  async createOrder(userId: string, data: {
    items: any[]; shippingAddress: any; paymentMethod?: string; couponCode?: string; note?: string;
  }) {
    let subtotal = 0;
    for (const item of data.items) {
      subtotal += (item.discountPrice || item.price) * item.quantity;
    }

    let discount = 0;
    if (data.couponCode) {
      const coupon = await couponRepo.findByCode(data.couponCode);
      if (coupon && coupon.isActive && (!coupon.expiresAt || coupon.expiresAt > new Date())) {
        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
          throw new AppError("Mã giảm giá đã hết lượt sử dụng", HttpStatus.BAD_REQUEST, ErrorCode.ORDER_INVALID_STATUS);
        }
        if (coupon.minOrder && subtotal < coupon.minOrder) {
          throw new AppError(`Đơn hàng tối thiểu ${coupon.minOrder}đ`, HttpStatus.BAD_REQUEST, ErrorCode.ORDER_INVALID_STATUS);
        }
        if (coupon.discountType === "percent") {
          discount = subtotal * coupon.discountValue / 100;
          if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        } else {
          discount = coupon.discountValue;
        }
        await couponRepo.incrementUsage(coupon.id);
      }
    }

    const shippingFee = subtotal >= 2000000 ? 0 : 30000;
    const totalPrice = subtotal - discount + shippingFee;

    const order = await orderRepo.create({
      orderNumber: generateOrderNumber(),
      userId,
      items: data.items,
      subtotal,
      shippingFee,
      discount,
      totalPrice,
      couponCode: data.couponCode,
      paymentMethod: (data.paymentMethod || "COD") as any,
      shippingAddress: data.shippingAddress,
      note: data.note,
    });

    // Clear cart after order
    await cartRepo.delete(userId).catch(() => {});

    return order;
  },

  async getOrders(userId: string, page: number, limit: number, status?: string) {
    const [orders, total] = await orderRepo.findByUserId(userId, page, limit, status);
    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getOrderById(id: string, userId?: string) {
    const order = await orderRepo.findById(id);
    if (!order) throw new AppError("Đơn hàng không tồn tại", HttpStatus.NOT_FOUND, ErrorCode.ORDER_NOT_FOUND);
    if (userId && order.userId !== userId) throw new AppError("Không có quyền truy cập", HttpStatus.FORBIDDEN, ErrorCode.AUTH_FORBIDDEN);
    return order;
  },

  async cancelOrder(id: string, userId: string) {
    const order = await orderRepo.findById(id);
    if (!order) throw new AppError("Đơn hàng không tồn tại", HttpStatus.NOT_FOUND, ErrorCode.ORDER_NOT_FOUND);
    if (order.userId !== userId) throw new AppError("Không có quyền", HttpStatus.FORBIDDEN, ErrorCode.AUTH_FORBIDDEN);
    if (!["PENDING", "CONFIRMED"].includes(order.status))
      throw new AppError("Không thể hủy đơn hàng ở trạng thái này", HttpStatus.BAD_REQUEST, ErrorCode.ORDER_INVALID_STATUS);

    return orderRepo.update(id, { status: "CANCELLED" });
  },

  // Admin
  async getAllOrders(page: number, limit: number, status?: string) {
    const [orders, total] = await orderRepo.findAll(page, limit, status);
    return { orders, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async updateOrderStatus(id: string, status: string, paymentStatus?: string) {
    const data: any = { status };
    if (paymentStatus) data.paymentStatus = paymentStatus;
    return orderRepo.update(id, data);
  },

  async deleteOrder(id: string) {
    const order = await orderRepo.findById(id);
    if (!order) throw new AppError("Đơn hàng không tồn tại", HttpStatus.NOT_FOUND, ErrorCode.ORDER_NOT_FOUND);
    return orderRepo.delete(id);
  },

  async getStats() {
    const [totalOrders, revenue, statusGroups] = await orderRepo.getStats();
    return {
      totalOrders,
      totalRevenue: revenue._sum.totalPrice || 0,
      byStatus: statusGroups.reduce((acc: any, g: any) => { acc[g.status] = g._count; return acc; }, {}),
    };
  },
};

export const wishlistService = {
  async getWishlist(userId: string) {
    return wishlistRepo.findByUserId(userId);
  },

  async addToWishlist(userId: string, productId: string) {
    return wishlistRepo.add(userId, productId);
  },

  async removeFromWishlist(userId: string, productId: string) {
    return wishlistRepo.remove(userId, productId);
  },

  async checkWishlist(userId: string, productId: string) {
    const item = await wishlistRepo.check(userId, productId);
    return !!item;
  },
};

export const couponService = {
  async validateCoupon(code: string, subtotal: number) {
    const coupon = await couponRepo.findByCode(code);
    if (!coupon || !coupon.isActive) throw new AppError("Mã giảm giá không hợp lệ", HttpStatus.BAD_REQUEST, ErrorCode.ORDER_INVALID_STATUS);
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new AppError("Mã giảm giá đã hết hạn", HttpStatus.BAD_REQUEST, ErrorCode.ORDER_INVALID_STATUS);
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new AppError("Mã giảm giá đã hết lượt", HttpStatus.BAD_REQUEST, ErrorCode.ORDER_INVALID_STATUS);
    if (coupon.minOrder && subtotal < coupon.minOrder) throw new AppError(`Đơn hàng tối thiểu ${coupon.minOrder}đ`, HttpStatus.BAD_REQUEST, ErrorCode.ORDER_INVALID_STATUS);

    let discount = 0;
    if (coupon.discountType === "percent") {
      discount = subtotal * coupon.discountValue / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }

    return { valid: true, discount, coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue } };
  },

  async getCoupons() {
    return couponRepo.findAll();
  },

  async createCoupon(data: any) {
    return couponRepo.create(data);
  },
};