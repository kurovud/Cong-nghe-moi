import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware, rateLimitMiddleware } from "@chatbot/common";
import { authRoutes } from "./routes/auth.route";
import { userRoutes } from "./routes/user.route";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan("short"));
  app.use(express.json());
  app.use(rateLimitMiddleware(15 * 60 * 1000, 200));

  app.get("/health", (_req, res) => res.json({ status: "ok", service: "auth-service" }));

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);

  app.use(errorMiddleware);

  return app;
}