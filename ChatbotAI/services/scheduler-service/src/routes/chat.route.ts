import { Router } from "express";
import { chatController } from "../controllers/chat.controller";

export const chatRoutes = Router();

chatRoutes.post("/", chatController.chat as any);
chatRoutes.post("/feedback", chatController.feedback as any);
chatRoutes.get("/analytics", chatController.analytics as any);
chatRoutes.get("/history/:sessionId", chatController.getHistory as any);
chatRoutes.delete("/history/:sessionId", chatController.clearHistory as any);
