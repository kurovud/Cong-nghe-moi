import { Request, Response, NextFunction } from "express";
import { logger } from "@chatbot/common";

export function gatewayErrorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error("Gateway error:", err.message);
  res.status(502).json({
    success: false,
    error: { code: "GATEWAY_ERROR", message: "Service không khả dụng, vui lòng thử lại sau" },
  });
}