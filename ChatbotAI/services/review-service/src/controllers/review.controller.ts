import { Request, Response, NextFunction } from "express";
import { AuthRequest, successResponse, paginatedResponse, HttpStatus } from "@chatbot/common";
import { reviewService } from "../services/review.service";

export const reviewController = {
  async getProductReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await reviewService.getProductReviews(req.params.productId, Number(page), Number(limit));
      res.json(successResponse(result));
    } catch (err) { next(err); }
  },

  async getUserReviews(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const reviews = await reviewService.getUserReviews(req.user!.userId);
      res.json(successResponse(reviews));
    } catch (err) { next(err); }
  },

  async createReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.createReview(req.user!.userId, req.body.userName || "Người dùng", req.body);
      res.status(HttpStatus.CREATED).json(successResponse(review, "Đánh giá thành công"));
    } catch (err) { next(err); }
  },

  async updateReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.updateReview(req.params.id, req.user!.userId, req.body);
      res.json(successResponse(review, "Cập nhật đánh giá thành công"));
    } catch (err) { next(err); }
  },

  async deleteReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await reviewService.deleteReview(req.params.id, req.user!.userId, req.user!.role === "ADMIN");
      res.json(successResponse(null, "Xóa đánh giá thành công"));
    } catch (err) { next(err); }
  },

  async getProductStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await reviewService.getProductStats(req.params.productId);
      res.json(successResponse(stats));
    } catch (err) { next(err); }
  },

  // Admin
  async getAllReviews(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await reviewService.getAllReviews(Number(page), Number(limit));
      res.json(paginatedResponse(result.reviews, result.total, result.page, result.limit));
    } catch (err) { next(err); }
  },

  async moderateReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.moderateReview(req.params.id, req.body.status);
      res.json(successResponse(review));
    } catch (err) { next(err); }
  },
};