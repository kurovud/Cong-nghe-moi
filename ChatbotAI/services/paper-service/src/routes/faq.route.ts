import { Router } from "express";
import { authMiddleware, adminMiddleware } from "@chatbot/common";
import { faqController } from "../controllers/paper.controller";

export const faqRoutes = Router();

faqRoutes.get("/", faqController.getFaqs as any);
faqRoutes.get("/search", faqController.searchFaqs as any);

// Admin
faqRoutes.post("/", authMiddleware as any, adminMiddleware as any, faqController.createFaq as any);
