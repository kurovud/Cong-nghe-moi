import { Response, NextFunction } from "express";
import { AuthRequest, successResponse, paginatedResponse, HttpStatus } from "@chatbot/common";
import { cartService, orderService, wishlistService, couponService } from "../services/conference.service";

export const cartController = {
  async getCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const items = await cartService.getCart(req.user!.userId);
      res.json(successResponse(items));
    } catch (err) { next(err); }
  },

  async updateCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const items = await cartService.updateCart(req.user!.userId, req.body.items);
      res.json(successResponse(items, "Cập nhật giỏ hàng thành công"));
    } catch (err) { next(err); }
  },

  async clearCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await cartService.clearCart(req.user!.userId);
      res.json(successResponse(null, "Đã xóa giỏ hàng"));
    } catch (err) { next(err); }
  },
};

export const orderController = {
  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.createOrder(req.user!.userId, req.body);
      res.status(HttpStatus.CREATED).json(successResponse(order, "Đặt hàng thành công"));
    } catch (err) { next(err); }
  },

  async getOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, status } = req.query;
      const result = await orderService.getOrders(req.user!.userId, Number(page), Number(limit), status as string);
      res.json(paginatedResponse(result.orders, result.total, result.page, result.limit));
    } catch (err) { next(err); }
  },

  async getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getOrderById(req.params.id, req.user!.userId);
      res.json(successResponse(order));
    } catch (err) { next(err); }
  },

  async cancelOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.cancelOrder(req.params.id, req.user!.userId);
      res.json(successResponse(order, "Hủy đơn hàng thành công"));
    } catch (err) { next(err); }
  },

  // Admin
  async getAllOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, status } = req.query;
      const result = await orderService.getAllOrders(Number(page), Number(limit), status as string);
      res.json(paginatedResponse(result.orders, result.total, result.page, result.limit));
    } catch (err) { next(err); }
  },

  async updateOrderStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.updateOrderStatus(req.params.id, req.body.status, req.body.paymentStatus);
      res.json(successResponse(order, "Cập nhật trạng thái thành công"));
    } catch (err) { next(err); }
  },

  async deleteOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await orderService.deleteOrder(req.params.id);
      res.json(successResponse(null, "Xóa đơn hàng thành công"));
    } catch (err) { next(err); }
  },

  async getStats(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await orderService.getStats();
      res.json(successResponse(stats));
    } catch (err) { next(err); }
  },
};

export const wishlistController = {
  async getWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const items = await wishlistService.getWishlist(req.user!.userId);
      res.json(successResponse(items));
    } catch (err) { next(err); }
  },

  async addToWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await wishlistService.addToWishlist(req.user!.userId, req.body.productId);
      res.json(successResponse(null, "Đã thêm vào danh sách yêu thích"));
    } catch (err) { next(err); }
  },

  async removeFromWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await wishlistService.removeFromWishlist(req.user!.userId, req.params.productId);
      res.json(successResponse(null, "Đã xóa khỏi danh sách yêu thích"));
    } catch (err) { next(err); }
  },

  async checkWishlist(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const inWishlist = await wishlistService.checkWishlist(req.user!.userId, req.params.productId);
      res.json(successResponse({ inWishlist }));
    } catch (err) { next(err); }
  },
};

export const couponController = {
  async validateCoupon(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await couponService.validateCoupon(req.body.code, req.body.subtotal);
      res.json(successResponse(result));
    } catch (err) { next(err); }
  },

  async getCoupons(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const coupons = await couponService.getCoupons();
      res.json(successResponse(coupons));
    } catch (err) { next(err); }
  },

  async createCoupon(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const coupon = await couponService.createCoupon(req.body);
      res.status(HttpStatus.CREATED).json(successResponse(coupon));
    } catch (err) { next(err); }
  },
};