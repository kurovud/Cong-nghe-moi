import { Request, Response, NextFunction } from "express";
import { successResponse, HttpStatus } from "@chatbot/common";
import { fileService } from "../services/file.service";

export const fileController = {
  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await fileService.handleUpload(req.file!);
      res.status(HttpStatus.CREATED).json(successResponse(result, "Upload thành công"));
    } catch (err) { next(err); }
  },

  async uploadMultiple(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      const result = await fileService.handleMultiUpload(files);
      res.status(HttpStatus.CREATED).json(successResponse(result, "Upload thành công"));
    } catch (err) { next(err); }
  },

  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      await fileService.deleteFile(req.params.filename);
      res.json(successResponse(null, "Xóa file thành công"));
    } catch (err) { next(err); }
  },
};