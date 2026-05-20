import { Router } from "express";
import { validateMiddleware, loginSchema, registerSchema } from "@chatbot/common";
import { authController } from "../controllers/auth.controller";

export const authRoutes = Router();

authRoutes.post("/register", validateMiddleware(registerSchema), authController.register as any);
authRoutes.post("/login", validateMiddleware(loginSchema), authController.login as any);
authRoutes.post("/refresh-token", authController.refreshToken as any);
authRoutes.post("/logout", authController.logout as any);