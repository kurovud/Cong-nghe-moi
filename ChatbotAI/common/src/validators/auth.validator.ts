import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  name: z.string().min(2, "Họ tên tối thiểu 2 ký tự").max(100),
  phone: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6, "Mật khẩu mới tối thiểu 6 ký tự"),
});

export const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(9),
  province: z.string().min(1),
  district: z.string().min(1),
  ward: z.string().min(1),
  street: z.string().min(1),
  isDefault: z.boolean().default(false),
});

export const adminCreateUserSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
  name: z.string().min(2, "Họ tên tối thiểu 2 ký tự").max(100),
  phone: z.string().optional(),
  role: z.enum(["USER", "STAFF"]).default("USER"),
  status: z.enum(["ACTIVE", "INACTIVE", "BANNED"]).default("ACTIVE"),
});

export const adminUpdateUserSchema = z.object({
  email: z.string().email("Email không hợp lệ").optional(),
  name: z.string().min(2, "Họ tên tối thiểu 2 ký tự").max(100).optional(),
  phone: z.string().optional(),
  role: z.enum(["USER", "STAFF"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "BANNED"]).optional(),
});