import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { HttpStatus } from "../constants/http-status";

export function validateMiddleware(schema: ZodSchema, source: "body" | "query" | "params" = "body") {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req[source] = schema.parse(req[source]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.errors.map((e) => ({ field: e.path.join("."), message: e.message }));
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Dữ liệu không hợp lệ", errors },
        });
        return;
      }
      next(err);
    }
  };
}