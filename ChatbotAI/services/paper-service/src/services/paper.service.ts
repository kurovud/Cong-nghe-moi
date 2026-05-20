import { AppError, HttpStatus, ErrorCode, slugify } from "@chatbot/common";
import { Prisma } from "@prisma/client";
import { productRepo, buildRepo, compatRepo, guideRepo, faqRepo, knowledgeRepo } from "../repositories/paper.repo";

export const productService = {
  async getProducts(page: number, limit: number, filters: {
    category?: string; brand?: string; search?: string;
    minPrice?: number; maxPrice?: number; sort?: string; order?: string;
  }) {
    const where: Prisma.ProductWhereInput = { status: "active" };
    if (filters.category) where.category = filters.category;
    if (filters.brand) where.brand = filters.brand;
    if (filters.minPrice || filters.maxPrice) {
      where.price = {};
      if (filters.minPrice) where.price.gte = filters.minPrice;
      if (filters.maxPrice) where.price.lte = filters.maxPrice;
    }
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { brand: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    const orderBy: any = {};
    const sortField = filters.sort || "createdAt";
    orderBy[sortField] = filters.order || "desc";

    const [products, total] = await productRepo.findAll(page, limit, where, orderBy);
    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getProductById(id: string) {
    const product = await productRepo.findById(id);
    if (!product) throw new AppError("Sản phẩm không tồn tại", HttpStatus.NOT_FOUND, ErrorCode.PRODUCT_NOT_FOUND);
    return product;
  },

  async getProductBySlug(slug: string) {
    const product = await productRepo.findBySlug(slug);
    if (!product) throw new AppError("Sản phẩm không tồn tại", HttpStatus.NOT_FOUND, ErrorCode.PRODUCT_NOT_FOUND);
    return product;
  },

  async getProductsByIds(ids: string[]) {
    return productRepo.findByIds(ids);
  },

  async createProduct(data: any) {
    const slug = slugify(data.name) + "-" + Date.now();
    return productRepo.create({ ...data, slug });
  },

  async updateProduct(id: string, data: any) {
    return productRepo.update(id, data);
  },

  async deleteProduct(id: string) {
    return productRepo.delete(id);
  },

  async getCategories() {
    const result = await productRepo.findCategories();
    return result.map((r) => r.category);
  },

  async getBrands(category?: string) {
    const result = await productRepo.findBrands(category);
    return result.map((r) => r.brand);
  },

  async searchProducts(query: string) {
    return productRepo.search(query);
  },
};

export const buildService = {
  async getBuilds(page: number, limit: number) {
    const [builds, total] = await buildRepo.findAll(page, limit);
    return { builds, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async getBuildBySlug(slug: string) {
    const build = await buildRepo.findBySlug(slug);
    if (!build) throw new AppError("Cấu hình không tồn tại", HttpStatus.NOT_FOUND, ErrorCode.PRODUCT_NOT_FOUND);
    return build;
  },

  async createBuild(data: any) {
    const slug = slugify(data.name) + "-" + Date.now();
    return buildRepo.create({ ...data, slug });
  },

  async getCompatRules() {
    return compatRepo.findAll();
  },

  async getAssemblyGuides() {
    return guideRepo.findAll();
  },

  async getGuideBySlug(slug: string) {
    return guideRepo.findBySlug(slug);
  },
};

export const faqService = {
  async getFaqs(category?: string) {
    return faqRepo.findAll(category);
  },

  async createFaq(data: any) {
    return faqRepo.create(data);
  },

  async updateFaq(id: string, data: any) {
    return faqRepo.update(id, data);
  },

  async deleteFaq(id: string) {
    return faqRepo.delete(id);
  },

  async searchFaqs(query: string) {
    return faqRepo.search(query);
  },
};

export const knowledgeService = {
  async getKnowledge(page: number, limit: number) {
    const [articles, total] = await knowledgeRepo.findAll(page, limit);
    return { articles, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  async createKnowledge(data: any) {
    return knowledgeRepo.create(data);
  },

  async searchKnowledge(query: string) {
    return knowledgeRepo.search(query);
  },
};