import { Express } from "express";
import { env } from "@chatbot/common";
import { createServiceProxy } from "../middlewares/proxy.middleware";

export function setupProxies(app: Express) {
  // Auth Service
  app.use("/api/auth", createServiceProxy(env.AUTH_SERVICE_URL, { "^/": "/api/auth/" }));
  app.use("/api/users", createServiceProxy(env.AUTH_SERVICE_URL, { "^/": "/api/users/" }));

  // Product Service
  app.use("/api/products", createServiceProxy(env.PRODUCT_SERVICE_URL, { "^/": "/api/products/" }));
  app.use("/api/builds", createServiceProxy(env.PRODUCT_SERVICE_URL, { "^/": "/api/builds/" }));
  app.use("/api/faq", createServiceProxy(env.PRODUCT_SERVICE_URL, { "^/": "/api/faq/" }));
  app.use("/api/knowledge", createServiceProxy(env.PRODUCT_SERVICE_URL, { "^/": "/api/knowledge/" }));

  // Order Service
  app.use("/api/cart", createServiceProxy(env.ORDER_SERVICE_URL, { "^/": "/api/cart/" }));
  app.use("/api/orders", createServiceProxy(env.ORDER_SERVICE_URL, { "^/": "/api/orders/" }));
  app.use("/api/wishlist", createServiceProxy(env.ORDER_SERVICE_URL, { "^/": "/api/wishlist/" }));
  app.use("/api/coupons", createServiceProxy(env.ORDER_SERVICE_URL, { "^/": "/api/coupons/" }));
  app.use("/api/payments", createServiceProxy(env.ORDER_SERVICE_URL, { "^/": "/api/payments/" }));

  // Review Service
  app.use("/api/reviews", createServiceProxy(env.REVIEW_SERVICE_URL, { "^/": "/api/reviews/" }));

  // Notification Service
  app.use(
    "/api/notifications",
    createServiceProxy(env.NOTIFICATION_SERVICE_URL, { "^/": "/api/notifications/" })
  );

  // File Service
  app.use("/api/files", createServiceProxy(env.FILE_SERVICE_URL, { "^/": "/api/files/" }));
  app.use("/uploads", createServiceProxy(env.FILE_SERVICE_URL, { "^/": "/uploads/" }));

  // Chat/AI Service
  app.use("/api/chat", createServiceProxy(env.CHAT_SERVICE_URL, { "^/": "/api/chat/" }));
  app.use(
    "/api/analytics",
    createServiceProxy(env.CHAT_SERVICE_URL, { "^/$": "/api/chat/analytics", "^/(.+)$": "/api/chat/analytics/$1" })
  );
}
