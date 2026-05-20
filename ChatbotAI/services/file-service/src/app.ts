import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { env, errorMiddleware, rateLimitMiddleware } from "@chatbot/common";
import { fileRoutes } from "./routes/file.route";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan("short"));
  app.use(express.json());
  app.use(rateLimitMiddleware(15 * 60 * 1000, 100));

  // Serve uploaded files statically
  app.use("/uploads", express.static(path.resolve(env.UPLOAD_DIR || "./uploads")));

  app.get("/health", (_req, res) => res.json({ status: "ok", service: "file-service" }));

  app.use("/api/files", fileRoutes);

  app.use(errorMiddleware);

  return app;
}
