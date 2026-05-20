import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2).max(500),
  category: z.string().min(1),
  brand: z.string().min(1),
  price: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  image: z.string().optional(),
  shortDesc: z.string().optional(),
  specs: z.record(z.any()).optional(),
  stock: z.number().int().min(0).default(100),
  tags: z.array(z.string()).optional(),
  compatKey: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const createBuildSchema = z.object({
  name: z.string().min(2),
  purpose: z.string(),
  price: z.number().positive(),
  image: z.string().optional(),
  components: z.array(z.object({ category: z.string(), productId: z.string().optional(), name: z.string() })),
  description: z.string().optional(),
});

export const createFaqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(5),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const createKnowledgeSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(10),
  tags: z.array(z.string()).optional(),
  source: z.string().optional(),
});