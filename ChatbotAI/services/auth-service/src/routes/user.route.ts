import { Router } from "express";
import {
	authMiddleware,
	adminMiddleware,
	validateMiddleware,
	updateProfileSchema,
	changePasswordSchema,
	addressSchema,
	adminCreateUserSchema,
	adminUpdateUserSchema,
} from "@chatbot/common";
import { userController } from "../controllers/user.controller";

export const userRoutes = Router();

// All routes require auth
userRoutes.use(authMiddleware as any);

userRoutes.get("/profile", userController.getProfile as any);
userRoutes.put("/profile", validateMiddleware(updateProfileSchema), userController.updateProfile as any);
userRoutes.put("/change-password", validateMiddleware(changePasswordSchema), userController.changePassword as any);

// Address
userRoutes.get("/addresses", userController.getAddresses as any);
userRoutes.post("/addresses", validateMiddleware(addressSchema), userController.addAddress as any);
userRoutes.put("/addresses/:addressId", validateMiddleware(addressSchema.partial()), userController.updateAddress as any);
userRoutes.delete("/addresses/:addressId", userController.deleteAddress as any);

// Admin
userRoutes.get("/", adminMiddleware as any, userController.getAllUsers as any);
userRoutes.post("/", adminMiddleware as any, validateMiddleware(adminCreateUserSchema), userController.createUser as any);
userRoutes.put("/:userId", adminMiddleware as any, validateMiddleware(adminUpdateUserSchema), userController.updateUser as any);
userRoutes.delete("/:userId", adminMiddleware as any, userController.deleteUser as any);
userRoutes.put("/:userId/status", adminMiddleware as any, userController.updateUserStatus as any);