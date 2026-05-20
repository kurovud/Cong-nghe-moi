import { Router } from "express";
import { authMiddleware } from "@chatbot/common";
import { cartController } from "../controllers/conference.controller";

export const cartRoutes = Router();
cartRoutes.use(authMiddleware as any);

cartRoutes.get("/", cartController.getCart as any);
cartRoutes.put("/", cartController.updateCart as any);
cartRoutes.delete("/", cartController.clearCart as any);
