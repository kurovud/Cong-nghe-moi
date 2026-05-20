import { Router } from "express";
import { authMiddleware, staffOrAdminMiddleware } from "@chatbot/common";
import { orderController } from "../controllers/conference.controller";

export const orderRoutes = Router();
orderRoutes.use(authMiddleware as any);

orderRoutes.post("/", orderController.createOrder as any);
orderRoutes.get("/", orderController.getOrders as any);
orderRoutes.get("/stats", staffOrAdminMiddleware as any, orderController.getStats as any);
orderRoutes.get("/all", staffOrAdminMiddleware as any, orderController.getAllOrders as any);
orderRoutes.get("/:id", orderController.getOrderById as any);
orderRoutes.put("/:id/cancel", orderController.cancelOrder as any);
orderRoutes.put("/:id/status", staffOrAdminMiddleware as any, orderController.updateOrderStatus as any);
orderRoutes.delete("/:id", staffOrAdminMiddleware as any, orderController.deleteOrder as any);
