import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const userRepo = {
  findById: (id: string) => prisma.user.findUnique({ where: { id }, include: { addresses: true } }),

  findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),

  create: (data: Prisma.UserCreateInput) => prisma.user.create({ data }),

  update: (id: string, data: Prisma.UserUpdateInput) =>
    prisma.user.update({ where: { id }, data, include: { addresses: true } }),

  delete: (id: string) => prisma.user.delete({ where: { id } }),

  findAll: (page: number, limit: number, search?: string) => {
    const where: Prisma.UserWhereInput = search
      ? { OR: [{ name: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] }
      : {};
    return Promise.all([
      prisma.user.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" }, include: { addresses: true } }),
      prisma.user.count({ where }),
    ]);
  },

  // Address
  createAddress: (data: Prisma.AddressCreateInput) => prisma.address.create({ data }),
  findAddresses: (userId: string) => prisma.address.findMany({ where: { userId }, orderBy: { isDefault: "desc" } }),
  updateAddress: (id: string, data: Prisma.AddressUpdateInput) => prisma.address.update({ where: { id }, data }),
  deleteAddress: (id: string) => prisma.address.delete({ where: { id } }),
  clearDefaultAddresses: (userId: string) =>
    prisma.address.updateMany({ where: { userId, isDefault: true }, data: { isDefault: false } }),

  // Refresh tokens
  createRefreshToken: (userId: string, token: string, expiresAt: Date) =>
    prisma.refreshToken.create({ data: { userId, token, expiresAt } }),
  findRefreshToken: (token: string) => prisma.refreshToken.findUnique({ where: { token }, include: { user: true } }),
  deleteRefreshToken: (token: string) => prisma.refreshToken.delete({ where: { token } }),
  deleteUserRefreshTokens: (userId: string) => prisma.refreshToken.deleteMany({ where: { userId } }),
};