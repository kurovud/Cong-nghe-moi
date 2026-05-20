import { Request, Response, NextFunction } from "express";
import { AuthRequest, successResponse, HttpStatus } from "@chatbot/common";
import { inAppService } from "../services/inapp.service";
import { mailService } from "../services/mail.service";

export const notificationController = {
  async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notifications = await inAppService.getAll(req.user!.userId);
      const unreadCount = await inAppService.getUnreadCount(req.user!.userId);
      res.json(successResponse({ notifications, unreadCount }));
    } catch (err) { next(err); }
  },

  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await inAppService.markAsRead(req.user!.userId, req.params.id);
      res.json(successResponse(null, "Đã đánh dấu đã đọc"));
    } catch (err) { next(err); }
  },

  async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await inAppService.markAllAsRead(req.user!.userId);
      res.json(successResponse(null, "Đã đánh dấu tất cả đã đọc"));
    } catch (err) { next(err); }
  },

  async clear(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await inAppService.clear(req.user!.userId);
      res.json(successResponse(null, "Đã xóa tất cả thông báo"));
    } catch (err) { next(err); }
  },

  // Internal API for other services to push notifications
  async pushNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, type, title, message, data } = req.body;
      const notification = await inAppService.create(userId, { userId, type, title, message, data });
      res.status(HttpStatus.CREATED).json(successResponse(notification));
    } catch (err) { next(err); }
  },

  // Internal API for sending emails
  async sendOrderEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, orderNumber, totalPrice, type } = req.body;
      if (type === "confirmation") {
        await mailService.sendOrderConfirmation(email, orderNumber, totalPrice);
      } else if (type === "status_update") {
        await mailService.sendOrderStatusUpdate(email, orderNumber, req.body.status);
      }
      res.json(successResponse(null, "Email đã gửi"));
    } catch (err) { next(err); }
  },
};