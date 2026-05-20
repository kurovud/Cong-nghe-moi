import { Router } from "express";
import { authMiddleware } from "@chatbot/common";
import { notificationController } from "../controllers/notification.controller";

export const notificationRoutes = Router();

// User-facing routes (require auth)
notificationRoutes.get("/", authMiddleware as any, notificationController.getNotifications as any);
notificationRoutes.put("/:id/read", authMiddleware as any, notificationController.markAsRead as any);
notificationRoutes.put("/read-all", authMiddleware as any, notificationController.markAllAsRead as any);
notificationRoutes.delete("/", authMiddleware as any, notificationController.clear as any);

// Internal APIs (used by other services via service-to-service calls — no auth)
notificationRoutes.post("/push", notificationController.pushNotification as any);
notificationRoutes.post("/email/order", notificationController.sendOrderEmail as any);