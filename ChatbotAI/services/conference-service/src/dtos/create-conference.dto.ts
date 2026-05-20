import { z } from "zod";

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    price: z.number(),
    discountPrice: z.number().optional(),
    quantity: z.number().int().min(1),
    image: z.string().optional(),
  })).min(1),
  shippingAddress: z.object({
    fullName: z.string(),
    phone: z.string(),
    province: z.string(),
    district: z.string(),
    ward: z.string(),
    street: z.string(),
  }),
  paymentMethod: z.enum(["COD", "BANK_TRANSFER", "MOMO", "VNPAY", "CREDIT_CARD"]).default("COD"),
  couponCode: z.string().optional(),
  note: z.string().optional(),
});