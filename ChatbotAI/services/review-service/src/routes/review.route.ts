import { Router } from "express";
import { authMiddleware, adminMiddleware, validateMiddleware, createReviewSchema, updateReviewSchema } from "@chatbot/common";
import { reviewController } from "../controllers/review.controller";

export const reviewRoutes = Router();

// Public
reviewRoutes.get("/product/:productId", reviewController.getProductReviews as any);
reviewRoutes.get("/product/:productId/stats", reviewController.getProductStats as any);

// Auth required
reviewRoutes.get("/my", authMiddleware as any, reviewController.getUserReviews as any);
reviewRoutes.post("/", authMiddleware as any, validateMiddleware(createReviewSchema), reviewController.createReview as any);
reviewRoutes.put("/:id", authMiddleware as any, validateMiddleware(updateReviewSchema), reviewController.updateReview as any);
reviewRoutes.delete("/:id", authMiddleware as any, reviewController.deleteReview as any);

// Admin
reviewRoutes.get("/all", authMiddleware as any, adminMiddleware as any, reviewController.getAllReviews as any);
reviewRoutes.put("/:id/moderate", authMiddleware as any, adminMiddleware as any, reviewController.moderateReview as any);