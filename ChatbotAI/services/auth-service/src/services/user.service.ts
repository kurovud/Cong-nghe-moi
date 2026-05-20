import { hashPassword, comparePassword, AppError, HttpStatus, ErrorCode, Role } from "@chatbot/common";
import { userRepo } from "../repositories/user.repo";

export const userService = {
  async getProfile(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw new AppError("Không tìm thấy người dùng", HttpStatus.NOT_FOUND, ErrorCode.AUTH_USER_NOT_FOUND);
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async updateProfile(userId: string, data: { name?: string; phone?: string; avatar?: string }) {
    const user = await userRepo.update(userId, data);
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await userRepo.findById(userId);
    if (!user) throw new AppError("Không tìm thấy người dùng", HttpStatus.NOT_FOUND, ErrorCode.AUTH_USER_NOT_FOUND);

    const valid = await comparePassword(currentPassword, user.password);
    if (!valid) throw new AppError("Mật khẩu hiện tại không đúng", HttpStatus.BAD_REQUEST, ErrorCode.AUTH_INVALID_CREDENTIALS);

    const hashed = await hashPassword(newPassword);
    await userRepo.update(userId, { password: hashed });
  },

  // Address management
  async getAddresses(userId: string) {
    return userRepo.findAddresses(userId);
  },

  async addAddress(userId: string, data: any) {
    if (data.isDefault) {
      await userRepo.clearDefaultAddresses(userId);
    }
    return userRepo.createAddress({ ...data, user: { connect: { id: userId } } });
  },

  async updateAddress(userId: string, addressId: string, data: any) {
    if (data.isDefault) {
      await userRepo.clearDefaultAddresses(userId);
    }
    return userRepo.updateAddress(addressId, data);
  },

  async deleteAddress(userId: string, addressId: string) {
    const addresses = await userRepo.findAddresses(userId);
    const owns = addresses.some((a: any) => a.id === addressId);
    if (!owns) throw new AppError("Không tìm thấy địa chỉ", HttpStatus.NOT_FOUND, ErrorCode.NOT_FOUND);
    return userRepo.deleteAddress(addressId);
  },

  // Admin
  async getAllUsers(page: number, limit: number, search?: string) {
    const [users, total] = await userRepo.findAll(page, limit, search);
    return {
      users: users.map(({ password, ...u }) => u),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  async updateUserStatus(userId: string, status: "ACTIVE" | "INACTIVE" | "BANNED") {
    return userRepo.update(userId, { status });
  },

  async createManagedUser(data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
    role?: "USER" | "STAFF";
    status?: "ACTIVE" | "INACTIVE" | "BANNED";
  }) {
    const existing = await userRepo.findByEmail(data.email);
    if (existing) {
      throw new AppError("Email đã được sử dụng", HttpStatus.CONFLICT, ErrorCode.AUTH_EMAIL_EXISTS);
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepo.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      phone: data.phone,
      role: (data.role ?? Role.USER) as any,
      status: (data.status ?? "ACTIVE") as any,
    });

    const { password, ...safeUser } = user;
    return safeUser;
  },

  async updateManagedUser(
    userId: string,
    data: {
      email?: string;
      name?: string;
      phone?: string;
      role?: "USER" | "STAFF";
      status?: "ACTIVE" | "INACTIVE" | "BANNED";
    }
  ) {
    const target = await userRepo.findById(userId);
    if (!target) throw new AppError("Không tìm thấy người dùng", HttpStatus.NOT_FOUND, ErrorCode.AUTH_USER_NOT_FOUND);
    if (target.role === Role.ADMIN) {
      throw new AppError("Không thể chỉnh sửa tài khoản quản trị tại màn này", HttpStatus.FORBIDDEN, ErrorCode.AUTH_FORBIDDEN);
    }

    if (data.email && data.email !== target.email) {
      const existing = await userRepo.findByEmail(data.email);
      if (existing && existing.id !== userId) {
        throw new AppError("Email đã được sử dụng", HttpStatus.CONFLICT, ErrorCode.AUTH_EMAIL_EXISTS);
      }
    }

    const user = await userRepo.update(userId, {
      email: data.email,
      name: data.name,
      phone: data.phone,
      role: data.role as any,
      status: data.status as any,
    });
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async deleteManagedUser(userId: string, actorUserId: string) {
    if (userId === actorUserId) {
      throw new AppError("Không thể tự xóa chính mình", HttpStatus.BAD_REQUEST, ErrorCode.AUTH_FORBIDDEN);
    }

    const target = await userRepo.findById(userId);
    if (!target) throw new AppError("Không tìm thấy người dùng", HttpStatus.NOT_FOUND, ErrorCode.AUTH_USER_NOT_FOUND);
    if (target.role === Role.ADMIN) {
      throw new AppError("Không thể xóa tài khoản quản trị", HttpStatus.FORBIDDEN, ErrorCode.AUTH_FORBIDDEN);
    }

    await userRepo.deleteUserRefreshTokens(userId);
    await userRepo.delete(userId);
  },
};