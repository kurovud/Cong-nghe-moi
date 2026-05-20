import { Router } from "express";
import { authMiddleware } from "@chatbot/common";
import { wishlistController } from "../controllers/conference.controller";

export const wishlistRoutes = Router();
wishlistRoutes.use(authMiddleware as any);

wishlistRoutes.get("/", wishlistController.getWishlist as any);
wishlistRoutes.post("/", wishlistController.addToWishlist as any);
wishlistRoutes.get("/check/:productId", wishlistController.checkWishlist as any);
wishlistRoutes.delete("/:productId", wishlistController.removeFromWishlist as any);
