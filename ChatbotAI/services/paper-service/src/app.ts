import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware, rateLimitMiddleware } from "@chatbot/common";
import { productRoutes } from "./routes/product.route";
import { buildRoutes } from "./routes/build.route";
import { faqRoutes } from "./routes/faq.route";
import { knowledgeRoutes } from "./routes/knowledge.route";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan("short"));
  app.use(express.json());
  app.use(rateLimitMiddleware(15 * 60 * 1000, 300));

  app.get("/health", (_req, res) => res.json({ status: "ok", service: "product-service" }));

  app.use("/api/products", productRoutes);
  app.use("/api/builds", buildRoutes);
  app.use("/api/faq", faqRoutes);
  app.use("/api/knowledge", knowledgeRoutes);

  app.use(errorMiddleware);

  return app;
}
