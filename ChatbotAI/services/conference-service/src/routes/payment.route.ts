import { Router } from "express";
import { momoWebhook, vnpayWebhook } from "../controllers/payment.controller";

export const paymentRoutes = Router();

// Public webhook endpoints — providers will POST here
paymentRoutes.post("/momo-webhook", momoWebhook);
paymentRoutes.post("/vnpay-webhook", vnpayWebhook);

export default paymentRoutes;
