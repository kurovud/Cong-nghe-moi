import { Router } from "express";
import { authMiddleware } from "@chatbot/common";
import { confirmPayment, momoWebhook, vnpayWebhook } from "../controllers/payment.controller";

export const paymentRoutes = Router();

// Public webhook endpoints — providers will POST here
paymentRoutes.post("/momo-webhook", momoWebhook);
paymentRoutes.post("/vnpay-webhook", vnpayWebhook);

// Authenticated manual confirmation endpoint (used by mock gateway flow)
paymentRoutes.post("/confirm", authMiddleware as any, confirmPayment as any);

export default paymentRoutes;
