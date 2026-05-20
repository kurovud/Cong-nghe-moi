import { Request, Response, NextFunction } from "express";
import { successResponse, HttpStatus } from "@chatbot/common";
import { authService } from "../services/auth.service";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(HttpStatus.CREATED).json(successResponse(result, "Đăng ký thành công"));
    } catch (err) { next(err); }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(successResponse(result, "Đăng nhập thành công"));
    } catch (err) { next(err); }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.refreshToken(refreshToken);
      res.json(successResponse(result));
    } catch (err) { next(err); }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);
      res.json(successResponse(null, "Đăng xuất thành công"));
    } catch (err) { next(err); }
  },
};