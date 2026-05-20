import { Response, NextFunction } from "express";
import { AuthRequest, successResponse, paginatedResponse, HttpStatus } from "@chatbot/common";
import { userService } from "../services/user.service";

export const userController = {
  async getProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.getProfile(req.user!.userId);
      res.json(successResponse(user));
    } catch (err) { next(err); }
  },

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateProfile(req.user!.userId, req.body);
      res.json(successResponse(user, "Cập nhật thông tin thành công"));
    } catch (err) { next(err); }
  },

  async changePassword(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await userService.changePassword(req.user!.userId, req.body.currentPassword, req.body.newPassword);
      res.json(successResponse(null, "Đổi mật khẩu thành công"));
    } catch (err) { next(err); }
  },

  // Addresses
  async getAddresses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const addresses = await userService.getAddresses(req.user!.userId);
      res.json(successResponse(addresses));
    } catch (err) { next(err); }
  },

  async addAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = await userService.addAddress(req.user!.userId, req.body);
      res.status(HttpStatus.CREATED).json(successResponse(address, "Thêm địa chỉ thành công"));
    } catch (err) { next(err); }
  },

  async updateAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const address = await userService.updateAddress(req.user!.userId, req.params.addressId, req.body);
      res.json(successResponse(address, "Cập nhật địa chỉ thành công"));
    } catch (err) { next(err); }
  },

  async deleteAddress(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await userService.deleteAddress(req.user!.userId, req.params.addressId);
      res.json(successResponse(null, "Xóa địa chỉ thành công"));
    } catch (err) { next(err); }
  },

  // Admin
  async getAllUsers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const result = await userService.getAllUsers(Number(page), Number(limit), search as string);
      res.json(paginatedResponse(result.users, result.total, result.page, result.limit));
    } catch (err) { next(err); }
  },

  async updateUserStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await userService.updateUserStatus(req.params.userId, req.body.status);
      res.json(successResponse(null, "Cập nhật trạng thái thành công"));
    } catch (err) { next(err); }
  },

  async createUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.createManagedUser(req.body);
      res.status(HttpStatus.CREATED).json(successResponse(user, "Tạo tài khoản thành công"));
    } catch (err) { next(err); }
  },

  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await userService.updateManagedUser(req.params.userId, req.body);
      res.json(successResponse(user, "Cập nhật tài khoản thành công"));
    } catch (err) { next(err); }
  },

  async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await userService.deleteManagedUser(req.params.userId, req.user!.userId);
      res.json(successResponse(null, "Xóa tài khoản thành công"));
    } catch (err) { next(err); }
  },
};