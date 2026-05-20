import { Router } from "express";
import { authMiddleware } from "@chatbot/common";
import { upload } from "../utils/multer";
import { fileController } from "../controllers/file.controller";

export const fileRoutes = Router();

fileRoutes.use(authMiddleware as any);

fileRoutes.post("/upload", upload.single("file"), fileController.uploadFile as any);
fileRoutes.post("/upload-multiple", upload.array("files", 10), fileController.uploadMultiple as any);
fileRoutes.delete("/:filename", fileController.deleteFile as any);