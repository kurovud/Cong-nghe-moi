import { hashPassword, comparePassword, signAccessToken, signRefreshToken, verifyToken, AppError, HttpStatus, ErrorCode } from "@chatbot/common";
import { userRepo } from "../repositories/user.repo";
import crypto from "crypto";

export const authService = {
  async register(data: { email: string; password: string; name: string; phone?: string }) {
    const existing = await userRepo.findByEmail(data.email);
    if (existing) throw new AppError("Email đã được sử dụng", HttpStatus.CONFLICT, ErrorCode.AUTH_EMAIL_EXISTS);

    const hashed = await hashPassword(data.password);
    const user = await userRepo.create({ ...data, password: hashed });

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ ...payload, nonce: crypto.randomUUID() });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await userRepo.createRefreshToken(user.id, refreshToken, expiresAt);

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar },
      accessToken,
      refreshToken,
    };
  },

  async login(email: string, password: string) {
    const user = await userRepo.findByEmail(email);
    if (!user) throw new AppError("Email hoặc mật khẩu không đúng", HttpStatus.UNAUTHORIZED, ErrorCode.AUTH_INVALID_CREDENTIALS);
    if (user.status !== "ACTIVE") throw new AppError("Tài khoản đã bị khóa", HttpStatus.FORBIDDEN, ErrorCode.AUTH_FORBIDDEN);

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new AppError("Email hoặc mật khẩu không đúng", HttpStatus.UNAUTHORIZED, ErrorCode.AUTH_INVALID_CREDENTIALS);

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ ...payload, nonce: crypto.randomUUID() });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await userRepo.createRefreshToken(user.id, refreshToken, expiresAt);

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar, phone: user.phone },
      accessToken,
      refreshToken,
    };
  },

  async refreshToken(token: string) {
    const stored = await userRepo.findRefreshToken(token);
    if (!stored || stored.expiresAt < new Date()) {
      if (stored) await userRepo.deleteRefreshToken(token);
      throw new AppError("Refresh token không hợp lệ", HttpStatus.UNAUTHORIZED, ErrorCode.AUTH_TOKEN_INVALID);
    }

    try {
      verifyToken(token, true);
    } catch {
      await userRepo.deleteRefreshToken(token);
      throw new AppError("Refresh token đã hết hạn", HttpStatus.UNAUTHORIZED, ErrorCode.AUTH_TOKEN_EXPIRED);
    }

    await userRepo.deleteRefreshToken(token);

    const user = stored.user;
    const payload = { userId: user.id, email: user.email, role: user.role };
    const newAccess = signAccessToken(payload);
    const newRefresh = signRefreshToken({ ...payload, nonce: crypto.randomUUID() });

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await userRepo.createRefreshToken(user.id, newRefresh, expiresAt);

    return { accessToken: newAccess, refreshToken: newRefresh };
  },

  async logout(refreshToken: string) {
    try {
      await userRepo.deleteRefreshToken(refreshToken);
    } catch {
      // Token might already be deleted
    }
  },
};