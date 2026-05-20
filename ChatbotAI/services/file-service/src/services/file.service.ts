import { AppError, HttpStatus, ErrorCode } from "@chatbot/common";
import { localStorage } from "../providers/local-storage.provider";

export const fileService = {
  async handleUpload(file: Express.Multer.File) {
    if (!file) throw new AppError("Không có file được upload", HttpStatus.BAD_REQUEST, ErrorCode.FILE_INVALID_TYPE);

    return {
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: localStorage.getFileUrl(file.filename),
    };
  },

  async handleMultiUpload(files: Express.Multer.File[]) {
    return files.map((file) => ({
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      url: localStorage.getFileUrl(file.filename),
    }));
  },

  async deleteFile(filename: string) {
    const deleted = localStorage.deleteFile(filename);
    if (!deleted) throw new AppError("Không tìm thấy file", HttpStatus.NOT_FOUND, ErrorCode.FILE_NOT_FOUND);
  },
};