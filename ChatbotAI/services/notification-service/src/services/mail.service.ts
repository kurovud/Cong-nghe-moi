import { env, logger } from "@chatbot/common";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: false,
  auth: env.MAIL_USER ? { user: env.MAIL_USER, pass: env.MAIL_PASS } : undefined,
});

export const mailService = {
  async sendOrderConfirmation(to: string, orderNumber: string, totalPrice: number) {
    try {
      await transporter.sendMail({
        from: `"PC Shop" <${env.MAIL_USER || "noreply@pcshop.vn"}>`,
        to,
        subject: `Xác nhận đơn hàng #${orderNumber}`,
        html: `
          <h2>Đơn hàng của bạn đã được xác nhận!</h2>
          <p>Mã đơn: <strong>${orderNumber}</strong></p>
          <p>Tổng tiền: <strong>${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice)}</strong></p>
          <p>Cảm ơn bạn đã mua hàng tại PC Shop!</p>
        `,
      });
      logger.info(`Order confirmation sent to ${to}`);
    } catch (err) {
      logger.error(`Failed to send order confirmation to ${to}:`, err);
    }
  },

  async sendOrderStatusUpdate(to: string, orderNumber: string, status: string) {
    const statusMap: Record<string, string> = {
      CONFIRMED: "đã xác nhận",
      PROCESSING: "đang xử lý",
      SHIPPING: "đang vận chuyển",
      DELIVERED: "đã giao hàng",
      CANCELLED: "đã hủy",
    };
    try {
      await transporter.sendMail({
        from: `"PC Shop" <${env.MAIL_USER || "noreply@pcshop.vn"}>`,
        to,
        subject: `Cập nhật đơn hàng #${orderNumber}`,
        html: `
          <h2>Cập nhật trạng thái đơn hàng</h2>
          <p>Đơn hàng <strong>#${orderNumber}</strong> ${statusMap[status] || status}.</p>
        `,
      });
    } catch (err) {
      logger.error(`Failed to send status update to ${to}:`, err);
    }
  },
};