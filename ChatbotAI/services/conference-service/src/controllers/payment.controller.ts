import { Request, Response, NextFunction } from "express";
import { orderService } from "../services/conference.service";

// Minimal webhook handler scaffold for payment providers (MoMo, VNPAY)
// These endpoints accept provider POSTs and attempt to mark the order as PAID.

export async function momoWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    // Example payload: { orderId: '...', resultCode: 0, amount: 12345 }
    const { orderId, resultCode } = req.body as any;
    if (!orderId) return res.status(400).json({ error: 'missing orderId' });
    // MoMo uses resultCode 0 for success
    if (Number(resultCode) === 0) {
      try {
        await orderService.updateOrderStatus(orderId, 'CONFIRMED', 'PAID');
      } catch (err) {
        // still respond 200 to provider; log error
        console.error('momoWebhook update error', err);
      }
    }
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function vnpayWebhook(req: Request, res: Response, next: NextFunction) {
  try {
    // Example payload: { vnp_TxnRef: 'orderId', vnp_ResponseCode: '00' }
    const body = req.body as any;
    const orderId = body.vnp_TxnRef || body.orderId;
    const code = body.vnp_ResponseCode || body.responseCode;
    if (!orderId) return res.status(400).json({ error: 'missing orderId' });
    // VNPay success code is '00'
    if (String(code) === '00') {
      try {
        await orderService.updateOrderStatus(orderId, 'CONFIRMED', 'PAID');
      } catch (err) {
        console.error('vnpayWebhook update error', err);
      }
    }
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
