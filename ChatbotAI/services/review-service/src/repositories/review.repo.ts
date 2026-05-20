import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const reviewRepo = {
  findByProduct: (productId: string, page: number, limit: number) =>
    Promise.all([
      prisma.review.findMany({ where: { productId, status: "active" }, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.review.count({ where: { productId, status: "active" } }),
    ]),

  findByUser: (userId: string) =>
    prisma.review.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),

  findById: (id: string) => prisma.review.findUnique({ where: { id } }),

  create: (data: Prisma.ReviewCreateInput) => prisma.review.create({ data }),

  update: (id: string, data: Prisma.ReviewUpdateInput) => prisma.review.update({ where: { id }, data }),

  delete: (id: string) => prisma.review.delete({ where: { id } }),

  getProductStats: (productId: string) =>
    prisma.review.aggregate({
      where: { productId, status: "active" },
      _avg: { rating: true },
      _count: true,
    }),

  getRatingDistribution: (productId: string) =>
    prisma.review.groupBy({
      by: ["rating"],
      where: { productId, status: "active" },
      _count: true,
    }),

  findAll: (page: number, limit: number) =>
    Promise.all([
      prisma.review.findMany({ skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.review.count(),
    ]),

  checkExists: (userId: string, productId: string) =>
    prisma.review.findFirst({ where: { userId, productId } }),
};