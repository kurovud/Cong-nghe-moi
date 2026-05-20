import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware, rateLimitMiddleware } from "@chatbot/common";
import { cartRoutes } from "./routes/cart.route";
import { orderRoutes } from "./routes/order.route";
import { wishlistRoutes } from "./routes/wishlist.route";
import { couponRoutes } from "./routes/coupon.route";
import { paymentRoutes } from "./routes/payment.route";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(morgan("short"));
  app.use(express.json());
  app.use(rateLimitMiddleware(15 * 60 * 1000, 300));

  app.get("/health", (_req, res) => res.json({ status: "ok", service: "order-service" }));

  app.use("/api/cart", cartRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/wishlist", wishlistRoutes);
  app.use("/api/coupons", couponRoutes);
  app.use("/api/payments", paymentRoutes);

  app.use(errorMiddleware);

  return app;
}
