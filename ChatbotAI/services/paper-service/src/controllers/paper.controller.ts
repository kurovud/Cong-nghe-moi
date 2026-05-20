import { Request, Response, NextFunction } from "express";
import { successResponse, paginatedResponse, HttpStatus, AuthRequest } from "@chatbot/common";
import { productService, buildService, faqService, knowledgeService } from "../services/paper.service";

export const productController = {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, category, brand, search, minPrice, maxPrice, sort, order } = req.query;
      const result = await productService.getProducts(
        Number(page), Number(limit),
        { category: category as string, brand: brand as string, search: search as string,
          minPrice: minPrice ? Number(minPrice) : undefined, maxPrice: maxPrice ? Number(maxPrice) : undefined,
          sort: sort as string, order: order as string }
      );
      res.json(paginatedResponse(result.products, result.total, result.page, result.limit));
    } catch (err) { next(err); }
  },

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductById(req.params.id);
      res.json(successResponse(product));
    } catch (err) { next(err); }
  },

  async getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getProductBySlug(req.params.slug);
      res.json(successResponse(product));
    } catch (err) { next(err); }
  },

  async getProductsByIds(req: Request, res: Response, next: NextFunction) {
    try {
      const { ids } = req.body;
      const products = await productService.getProductsByIds(ids);
      res.json(successResponse(products));
    } catch (err) { next(err); }
  },

  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.createProduct(req.body);
      res.status(HttpStatus.CREATED).json(successResponse(product));
    } catch (err) { next(err); }
  },

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.updateProduct(req.params.id, req.body);
      res.json(successResponse(product));
    } catch (err) { next(err); }
  },

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      await productService.deleteProduct(req.params.id);
      res.json(successResponse(null, "Xóa sản phẩm thành công"));
    } catch (err) { next(err); }
  },

  async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await productService.getCategories();
      res.json(successResponse(categories));
    } catch (err) { next(err); }
  },

  async getBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await productService.getBrands(req.query.category as string);
      res.json(successResponse(brands));
    } catch (err) { next(err); }
  },

  async searchProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productService.searchProducts(req.query.q as string);
      res.json(successResponse(products));
    } catch (err) { next(err); }
  },
};

export const buildController = {
  async getBuilds(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await buildService.getBuilds(Number(page), Number(limit));
      res.json(paginatedResponse(result.builds, result.total, result.page, result.limit));
    } catch (err) { next(err); }
  },

  async getBuildBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const build = await buildService.getBuildBySlug(req.params.slug);
      res.json(successResponse(build));
    } catch (err) { next(err); }
  },

  async createBuild(req: Request, res: Response, next: NextFunction) {
    try {
      const build = await buildService.createBuild(req.body);
      res.status(HttpStatus.CREATED).json(successResponse(build));
    } catch (err) { next(err); }
  },

  async getCompatRules(_req: Request, res: Response, next: NextFunction) {
    try {
      const rules = await buildService.getCompatRules();
      res.json(successResponse(rules));
    } catch (err) { next(err); }
  },

  async getAssemblyGuides(_req: Request, res: Response, next: NextFunction) {
    try {
      const guides = await buildService.getAssemblyGuides();
      res.json(successResponse(guides));
    } catch (err) { next(err); }
  },

  async getGuideBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const guide = await buildService.getGuideBySlug(req.params.slug);
      res.json(successResponse(guide));
    } catch (err) { next(err); }
  },
};

export const faqController = {
  async getFaqs(req: Request, res: Response, next: NextFunction) {
    try {
      const faqs = await faqService.getFaqs(req.query.category as string);
      res.json(successResponse(faqs));
    } catch (err) { next(err); }
  },

  async createFaq(req: Request, res: Response, next: NextFunction) {
    try {
      const faq = await faqService.createFaq(req.body);
      res.status(HttpStatus.CREATED).json(successResponse(faq));
    } catch (err) { next(err); }
  },

  async searchFaqs(req: Request, res: Response, next: NextFunction) {
    try {
      const faqs = await faqService.searchFaqs(req.query.q as string);
      res.json(successResponse(faqs));
    } catch (err) { next(err); }
  },
};

export const knowledgeController = {
  async getKnowledge(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await knowledgeService.getKnowledge(Number(page), Number(limit));
      res.json(paginatedResponse(result.articles, result.total, result.page, result.limit));
    } catch (err) { next(err); }
  },

  async createKnowledge(req: Request, res: Response, next: NextFunction) {
    try {
      const article = await knowledgeService.createKnowledge(req.body);
      res.status(HttpStatus.CREATED).json(successResponse(article));
    } catch (err) { next(err); }
  },

  async searchKnowledge(req: Request, res: Response, next: NextFunction) {
    try {
      const articles = await knowledgeService.searchKnowledge(req.query.q as string);
      res.json(successResponse(articles));
    } catch (err) { next(err); }
  },
};