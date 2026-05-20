import dotenv from "dotenv";
dotenv.config();

export function loadEnv() {
  dotenv.config();
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "0", 10),
  DATABASE_URL: process.env.DATABASE_URL || "",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  JWT_SECRET: process.env.JWT_SECRET || "default_jwt_secret",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  // Service URLs
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || "http://localhost:4001",
  PRODUCT_SERVICE_URL: process.env.PRODUCT_SERVICE_URL || "http://localhost:4002",
  ORDER_SERVICE_URL: process.env.ORDER_SERVICE_URL || "http://localhost:4003",
  REVIEW_SERVICE_URL: process.env.REVIEW_SERVICE_URL || "http://localhost:4004",
  NOTIFICATION_SERVICE_URL: process.env.NOTIFICATION_SERVICE_URL || "http://localhost:4005",
  FILE_SERVICE_URL: process.env.FILE_SERVICE_URL || "http://localhost:4006",
  CHAT_SERVICE_URL: process.env.CHAT_SERVICE_URL || "http://localhost:4007",
  // Mail
  MAIL_HOST: process.env.MAIL_HOST || "smtp.gmail.com",
  MAIL_PORT: parseInt(process.env.MAIL_PORT || "587", 10),
  MAIL_USER: process.env.MAIL_USER || "",
  MAIL_PASS: process.env.MAIL_PASS || "",
  // AI
  GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY || "",
  // File
  UPLOAD_DIR: process.env.UPLOAD_DIR || "./uploads",
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10),
};
