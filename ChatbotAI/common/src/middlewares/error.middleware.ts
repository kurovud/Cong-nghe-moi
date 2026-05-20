import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error";
import { HttpStatus } from "../constants/http-status";
import { logger } from "../config/logger";

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message, ...(err as any).errors && { errors: (err as any).errors } },
    });
    return;
  }

  logger.error("Unhandled error:", err);
  res.status(HttpStatus.INTERNAL).json({
    success: false,
    error: { code: "INTERNAL_ERROR", message: "Đã xảy ra lỗi hệ thống" },
  });
}