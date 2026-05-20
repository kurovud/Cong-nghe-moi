import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const cartRepo = {
  findByUserId: (userId: string) => prisma.cart.findUnique({ where: { userId } }),
  upsert: (userId: string, items: any) =>
    prisma.cart.upsert({ where: { userId }, create: { userId, items }, update: { items } }),
  delete: (userId: string) => prisma.cart.delete({ where: { userId } }).catch(() => null),
};

export const orderRepo = {
  create: (data: Prisma.OrderCreateInput) => prisma.order.create({ data }),

  findById: (id: string) => prisma.order.findUnique({ where: { id } }),
  findByOrderNumber: (orderNumber: string) => prisma.order.findUnique({ where: { orderNumber } }),

  findByUserId: (userId: string, page: number, limit: number, status?: string) => {
    const where: Prisma.OrderWhereInput = { userId };
    if (status) where.status = status as any;
    return Promise.all([
      prisma.order.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.order.count({ where }),
    ]);
  },

  findAll: (page: number, limit: number, status?: string) => {
    const where: Prisma.OrderWhereInput = status ? { status: status as any } : {};
    return Promise.all([
      prisma.order.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.order.count({ where }),
    ]);
  },

  update: (id: string, data: Prisma.OrderUpdateInput) => prisma.order.update({ where: { id }, data }),

  delete: (id: string) => prisma.order.delete({ where: { id } }),

  getStats: () => Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { totalPrice: true }, where: { paymentStatus: "PAID" } }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
  ]),
};

export const wishlistRepo = {
  findByUserId: (userId: string) => prisma.wishlist.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
  add: (userId: string, productId: string) =>
    prisma.wishlist.upsert({ where: { userId_productId: { userId, productId } }, create: { userId, productId }, update: {} }),
  remove: (userId: string, productId: string) =>
    prisma.wishlist.delete({ where: { userId_productId: { userId, productId } } }).catch(() => null),
  check: (userId: string, productId: string) =>
    prisma.wishlist.findUnique({ where: { userId_productId: { userId, productId } } }),
};

export const couponRepo = {
  findByCode: (code: string) => prisma.coupon.findUnique({ where: { code } }),
  findAll: () => prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }),
  create: (data: Prisma.CouponCreateInput) => prisma.coupon.create({ data }),
  incrementUsage: (id: string) => prisma.coupon.update({ where: { id }, data: { usedCount: { increment: 1 } } }),
};