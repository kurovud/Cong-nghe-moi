import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const productRepo = {
  findAll: (page: number, limit: number, where: Prisma.ProductWhereInput = {}, orderBy: any = { createdAt: "desc" }) =>
    Promise.all([
      prisma.product.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy }),
      prisma.product.count({ where }),
    ]),

  findById: (id: string) => prisma.product.findUnique({ where: { id } }),
  findBySlug: (slug: string) => prisma.product.findUnique({ where: { slug } }),
  findByIds: (ids: string[]) => prisma.product.findMany({ where: { id: { in: ids } } }),

  create: (data: Prisma.ProductCreateInput) => prisma.product.create({ data }),
  update: (id: string, data: Prisma.ProductUpdateInput) => prisma.product.update({ where: { id }, data }),
  delete: (id: string) => prisma.product.delete({ where: { id } }),

  findCategories: () => prisma.product.findMany({ distinct: ["category"], select: { category: true } }),
  findBrands: (category?: string) => {
    const where = category ? { category } : {};
    return prisma.product.findMany({ where, distinct: ["brand"], select: { brand: true } });
  },

  updateRating: (id: string, rating: number, reviewCount: number) =>
    prisma.product.update({ where: { id }, data: { rating, reviewCount } }),

  search: (query: string, limit = 20) =>
    prisma.product.findMany({
      where: { OR: [
        { name: { contains: query, mode: "insensitive" } },
        { brand: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
        { tags: { has: query.toLowerCase() } },
      ]},
      take: limit,
    }),
};

export const buildRepo = {
  findAll: (page: number, limit: number) =>
    Promise.all([
      prisma.prebuiltPC.findMany({ skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.prebuiltPC.count(),
    ]),
  findById: (id: string) => prisma.prebuiltPC.findUnique({ where: { id } }),
  findBySlug: (slug: string) => prisma.prebuiltPC.findUnique({ where: { slug } }),
  create: (data: Prisma.PrebuiltPCCreateInput) => prisma.prebuiltPC.create({ data }),
  update: (id: string, data: Prisma.PrebuiltPCUpdateInput) => prisma.prebuiltPC.update({ where: { id }, data }),
  delete: (id: string) => prisma.prebuiltPC.delete({ where: { id } }),
};

export const compatRepo = {
  findAll: () => prisma.compatRule.findMany(),
  create: (data: Prisma.CompatRuleCreateInput) => prisma.compatRule.create({ data }),
  delete: (id: string) => prisma.compatRule.delete({ where: { id } }),
};

export const guideRepo = {
  findAll: () => prisma.assemblyGuide.findMany(),
  findBySlug: (slug: string) => prisma.assemblyGuide.findUnique({ where: { slug } }),
  create: (data: Prisma.AssemblyGuideCreateInput) => prisma.assemblyGuide.create({ data }),
};

export const faqRepo = {
  findAll: (category?: string) => {
    const where = category ? { category } : {};
    return prisma.fAQ.findMany({ where, orderBy: { createdAt: "desc" } });
  },
  findById: (id: string) => prisma.fAQ.findUnique({ where: { id } }),
  create: (data: Prisma.FAQCreateInput) => prisma.fAQ.create({ data }),
  update: (id: string, data: Prisma.FAQUpdateInput) => prisma.fAQ.update({ where: { id }, data }),
  delete: (id: string) => prisma.fAQ.delete({ where: { id } }),
  search: (query: string) =>
    prisma.fAQ.findMany({
      where: { OR: [
        { question: { contains: query, mode: "insensitive" } },
        { answer: { contains: query, mode: "insensitive" } },
      ]},
    }),
};

export const knowledgeRepo = {
  findAll: (page: number, limit: number) =>
    Promise.all([
      prisma.knowledge.findMany({ skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.knowledge.count(),
    ]),
  findById: (id: string) => prisma.knowledge.findUnique({ where: { id } }),
  create: (data: Prisma.KnowledgeCreateInput) => prisma.knowledge.create({ data }),
  update: (id: string, data: Prisma.KnowledgeUpdateInput) => prisma.knowledge.update({ where: { id }, data }),
  delete: (id: string) => prisma.knowledge.delete({ where: { id } }),
  search: (query: string) =>
    prisma.knowledge.findMany({
      where: { OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ]},
      take: 20,
    }),
};