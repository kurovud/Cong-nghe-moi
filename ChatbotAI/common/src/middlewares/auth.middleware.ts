import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt.util";
import { AppError } from "../errors/app-error";
import { ErrorCode } from "../constants/error-codes";
import { HttpStatus } from "../constants/http-status";
import { AuthRequest } from "../types/express";
import { Role } from "../constants/roles";

export function authMiddleware(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next(new AppError("Token không được cung cấp", HttpStatus.UNAUTHORIZED, ErrorCode.AUTH_TOKEN_MISSING));
  }
  try {
    const token = header.split(" ")[1];
    const payload = verifyToken(token) as JwtPayload;
    (req as AuthRequest).user = payload;
    next();
  } catch {
    next(new AppError("Token không hợp lệ hoặc đã hết hạn", HttpStatus.UNAUTHORIZED, ErrorCode.AUTH_TOKEN_INVALID));
  }
}

export function adminMiddleware(req: Request, _res: Response, next: NextFunction) {
  const user = (req as AuthRequest).user;
  if (!user || user.role !== "ADMIN") {
    return next(new AppError("Bạn không có quyền truy cập", HttpStatus.FORBIDDEN, ErrorCode.AUTH_FORBIDDEN));
  }
  next();
}

export function roleMiddleware(roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as AuthRequest).user;
    if (!user || !roles.includes(user.role as Role)) {
      return next(new AppError("Bạn không có quyền truy cập", HttpStatus.FORBIDDEN, ErrorCode.AUTH_FORBIDDEN));
    }
    next();
  };
}

export const staffOrAdminMiddleware = roleMiddleware([Role.STAFF, Role.ADMIN]);