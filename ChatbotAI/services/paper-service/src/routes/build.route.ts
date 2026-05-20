import { Router } from "express";
import { authMiddleware, adminMiddleware } from "@chatbot/common";
import { buildController } from "../controllers/paper.controller";

export const buildRoutes = Router();

buildRoutes.get("/", buildController.getBuilds as any);
buildRoutes.get("/compat-rules", buildController.getCompatRules as any);
buildRoutes.get("/assembly-guides", buildController.getAssemblyGuides as any);
buildRoutes.get("/assembly-guides/:slug", buildController.getGuideBySlug as any);
buildRoutes.get("/:slug", buildController.getBuildBySlug as any);

// Admin
buildRoutes.post("/", authMiddleware as any, adminMiddleware as any, buildController.createBuild as any);
