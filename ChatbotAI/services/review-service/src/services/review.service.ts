import { AppError, HttpStatus, ErrorCode } from "@chatbot/common";
import { reviewRepo } from "../repositories/review.repo";

export const reviewService = {
  async getProductReviews(productId: string, page: number, limit: number) {
    const [reviews, total] = await reviewRepo.findByProduct(productId, page, limit);
    const stats = await reviewRepo.getProductStats(productId);
    const distribution = await reviewRepo.getRatingDistribution(productId);

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      stats: {
        averageRating: stats._avg.rating || 0,
        totalReviews: stats._count,
        distribution: distribution.reduce((acc: any, d: any) => { acc[d.rating] = d._count; return acc; }, {}),
      },
    };
  },

  async getUserReviews(userId: string) {
    return reviewRepo.findByUser(userId);
  },

  async createReview(userId: string, userName: string, data: {
    productId: string; rating: number; title: string; content: string; pros?: string[]; cons?: string[];
  }) {
    const existing = await reviewRepo.checkExists(userId, data.productId);
    if (existing) throw new AppError("Bạn đã đánh giá sản phẩm này", HttpStatus.CONFLICT, ErrorCode.REVIEW_ALREADY_EXISTS);

    const review = await reviewRepo.create({
      ...data,
      userId,
      userName,
      pros: data.pros || [],
      cons: data.cons || [],
    });

    return review;
  },

  async updateReview(id: string, userId: string, data: any) {
    const review = await reviewRepo.findById(id);
    if (!review) throw new AppError("Đánh giá không tồn tại", HttpStatus.NOT_FOUND, ErrorCode.REVIEW_NOT_FOUND);
    if (review.userId !== userId) throw new AppError("Không có quyền", HttpStatus.FORBIDDEN, ErrorCode.AUTH_FORBIDDEN);

    return reviewRepo.update(id, data);
  },

  async deleteReview(id: string, userId: string, isAdmin = false) {
    const review = await reviewRepo.findById(id);
    if (!review) throw new AppError("Đánh giá không tồn tại", HttpStatus.NOT_FOUND, ErrorCode.REVIEW_NOT_FOUND);
    if (!isAdmin && review.userId !== userId) throw new AppError("Không có quyền", HttpStatus.FORBIDDEN, ErrorCode.AUTH_FORBIDDEN);

    return reviewRepo.delete(id);
  },

  async getProductStats(productId: string) {
    const stats = await reviewRepo.getProductStats(productId);
    return { averageRating: stats._avg.rating || 0, totalReviews: stats._count };
  },

  // Admin
  async getAllReviews(page: number, limit: number) {
    const [reviews, total] = await reviewRepo.findAll(page, limit);
    return { reviews, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async moderateReview(id: string, status: string) {
    return reviewRepo.update(id, { status });
  },
};