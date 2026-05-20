import { Router } from "express";
import { authMiddleware, adminMiddleware } from "@chatbot/common";
import { couponController } from "../controllers/conference.controller";

export const couponRoutes = Router();

couponRoutes.post("/validate", authMiddleware as any, couponController.validateCoupon as any);
couponRoutes.get("/", authMiddleware as any, adminMiddleware as any, couponController.getCoupons as any);
couponRoutes.post("/", authMiddleware as any, adminMiddleware as any, couponController.createCoupon as any);
