import { Request, Response, NextFunction } from "express";
import { successResponse, HttpStatus, AuthRequest } from "@chatbot/common";
import { chatService } from "../services/chatbot.service";
import crypto from "crypto";

export const chatController = {
  async chat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, sessionId } = req.body;
      const sid = sessionId || crypto.randomUUID();

      if (!message || typeof message !== "string" || message.trim().length === 0) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Vui lòng nhập tin nhắn" },
        });
        return;
      }

      const result = await chatService.chat(sid, message.trim());
      res.json(successResponse(result));
    } catch (err) { next(err); }
  },

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await chatService.getHistory(req.params.sessionId);
      res.json(successResponse(history));
    } catch (err) { next(err); }
  },

  async clearHistory(req: Request, res: Response, next: NextFunction) {
    try {
      await chatService.clearHistory(req.params.sessionId);
      res.json(successResponse(null, "Đã xóa lịch sử chat"));
    } catch (err) { next(err); }
  },

  async feedback(req: Request, res: Response, next: NextFunction) {
    try {
      const { responseId, rating } = req.body;
      if (!responseId || !["like", "dislike"].includes(rating)) {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: { code: "VALIDATION_ERROR", message: "responseId và rating (like/dislike) là bắt buộc" },
        });
        return;
      }

      const result = await chatService.submitFeedback(responseId, rating);
      res.json(successResponse(result));
    } catch (err) {
      next(err);
    }
  },

  async analytics(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await chatService.getAnalytics();
      res.json(successResponse(result));
    } catch (err) {
      next(err);
    }
  },
};
