import { Router } from "express";
import { authMiddleware, adminMiddleware } from "@chatbot/common";
import { knowledgeController } from "../controllers/paper.controller";

export const knowledgeRoutes = Router();

knowledgeRoutes.get("/", knowledgeController.getKnowledge as any);
knowledgeRoutes.get("/search", knowledgeController.searchKnowledge as any);

// Admin
knowledgeRoutes.post("/", authMiddleware as any, adminMiddleware as any, knowledgeController.createKnowledge as any);
