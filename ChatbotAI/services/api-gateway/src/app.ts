import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimitMiddleware } from "@chatbot/common";
import { corsOptions } from "./config/cors";
import { setupProxies } from "./proxies";
import { gatewayErrorMiddleware } from "./middlewares/error.middleware";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors(corsOptions));
  app.use(morgan("short"));
  app.use(rateLimitMiddleware(15 * 60 * 1000, 500));

  // Health check
  app.get("/health", (_req, res) => res.json({ status: "ok", service: "api-gateway" }));

  // Setup all proxy routes
  setupProxies(app);

  // Error handler
  app.use(gatewayErrorMiddleware);

  return app;
}