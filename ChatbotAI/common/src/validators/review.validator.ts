import { z } from "zod";

export const createReviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(2).max(200),
  content: z.string().min(5).max(2000),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().min(2).max(200).optional(),
  content: z.string().min(5).max(2000).optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
});