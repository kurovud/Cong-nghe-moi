import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware, rateLimitMiddleware } from "@chatbot/common";
import { chatRoutes } from "./routes/chat.route";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan("short"));
  app.use(express.json());
  app.use(rateLimitMiddleware(1 * 60 * 1000, 30)); // 30 requests per minute for AI

  app.get("/health", (_req, res) => res.json({ status: "ok", service: "chat-service" }));

  app.use("/api/chat", chatRoutes);

  app.use(errorMiddleware);

  return app;
}
