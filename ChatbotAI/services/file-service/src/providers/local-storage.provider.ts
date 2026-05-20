import fs from "fs";
import path from "path";
import { env } from "@chatbot/common";

export const localStorage = {
  getFilePath(filename: string): string {
    return path.join(env.UPLOAD_DIR || "./uploads", filename);
  },

  deleteFile(filename: string): boolean {
    try {
      const filePath = this.getFilePath(filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  getFileUrl(filename: string): string {
    return `/uploads/${filename}`;
  },
};