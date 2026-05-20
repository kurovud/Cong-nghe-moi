// ─── Config ───
export { env, loadEnv } from "./config/env";
export { logger } from "./config/logger";
export { createRedisClient } from "./config/redis";

// ─── Constants ───
export { ErrorCode } from "./constants/error-codes";
export { HttpStatus } from "./constants/http-status";
export { Role } from "./constants/roles";
export { Events } from "./constants/events";

// ─── Errors ───
export { AppError } from "./errors/app-error";
export { NotFoundError } from "./errors/notfound-error";
export { ValidationError } from "./errors/validation-error";

// ─── Middlewares ───
export { authMiddleware, adminMiddleware, roleMiddleware, staffOrAdminMiddleware } from "./middlewares/auth.middleware";
export { errorMiddleware } from "./middlewares/error.middleware";
export { rateLimitMiddleware } from "./middlewares/rate-limit.middleware";
export { validateMiddleware } from "./middlewares/validate.middleware";

// ─── Utils ───
export { hashPassword, comparePassword } from "./utils/hash.util";
export { signAccessToken, signRefreshToken, verifyToken } from "./utils/jwt.util";
export { successResponse, errorResponse, paginatedResponse } from "./utils/response.util";
export { generateId, slugify } from "./utils/string.util";
export { formatVND, formatDate } from "./utils/date.util";

// ─── DTOs ───
export { PaginationQuery } from "./dtos/pagination.dto";
export type { PaginationQueryType } from "./dtos/pagination.dto";
export type { ApiResponse } from "./dtos/response.dto";

// ─── Validators ───
export {
	registerSchema,
	loginSchema,
	updateProfileSchema,
	changePasswordSchema,
	addressSchema,
	adminCreateUserSchema,
	adminUpdateUserSchema,
} from "./validators/auth.validator";
export { createProductSchema, updateProductSchema, createBuildSchema, createFaqSchema, createKnowledgeSchema } from "./validators/paper.validator";
export { createReviewSchema, updateReviewSchema } from "./validators/review.validator";

// ─── Types ───
export type { JwtPayload } from "./types/jwt";
export type { AuthRequest } from "./types/express";
