import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware, rateLimitMiddleware } from "@chatbot/common";
import { reviewRoutes } from "./routes/review.route";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan("short"));
  app.use(express.json());
  app.use(rateLimitMiddleware(15 * 60 * 1000, 200));

  app.get("/health", (_req, res) => res.json({ status: "ok", service: "review-service" }));

  app.use("/api/reviews", reviewRoutes);

  app.use(errorMiddleware);

  return app;
}
