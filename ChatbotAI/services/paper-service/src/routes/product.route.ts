import { Router } from "express";
import { authMiddleware, staffOrAdminMiddleware } from "@chatbot/common";
import { productController } from "../controllers/paper.controller";

export const productRoutes = Router();

productRoutes.get("/", productController.getProducts as any);
productRoutes.get("/search", productController.searchProducts as any);
productRoutes.get("/categories", productController.getCategories as any);
productRoutes.get("/brands", productController.getBrands as any);
productRoutes.get("/slug/:slug", productController.getProductBySlug as any);
productRoutes.get("/:id", productController.getProductById as any);
productRoutes.post("/by-ids", productController.getProductsByIds as any);

// Admin
productRoutes.post("/", authMiddleware as any, staffOrAdminMiddleware as any, productController.createProduct as any);
productRoutes.put("/:id", authMiddleware as any, staffOrAdminMiddleware as any, productController.updateProduct as any);
productRoutes.delete("/:id", authMiddleware as any, staffOrAdminMiddleware as any, productController.deleteProduct as any);
