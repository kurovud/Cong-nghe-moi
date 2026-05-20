import rateLimit from "express-rate-limit";

export function rateLimitMiddleware(windowMs = 15 * 60 * 1000, max = 100) {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, error: { code: "RATE_LIMIT", message: "Quá nhiều yêu cầu, vui lòng thử lại sau" } },
    standardHeaders: true,
    legacyHeaders: false,
  });
}