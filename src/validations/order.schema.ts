import { z } from "zod";

export const paymentMethodSchema = z.enum([
  "CASH_ON_DELIVERY",
  "BANK_TRANSFER",
  "CREDIT_CARD",
  "E_WALLET",
]);

export const shippingMethodSchema = z.enum(["DELIVERY", "PICKUP"]);

export const orderStatusSchema = z.enum([
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export const paymentStatusSchema = z.enum([
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
]);

export const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  paymentMethod: paymentMethodSchema.default("CASH_ON_DELIVERY"),
  shippingMethod: shippingMethodSchema.default("DELIVERY"),
  shippingFee: z.number().nonnegative().default(0),
  note: z.string().trim().optional(),
});

export const updateOrderSchema = z.object({
  status: orderStatusSchema.optional(),
  paymentStatus: paymentStatusSchema.optional(),
  paymentMethod: paymentMethodSchema.optional(),
  shippingMethod: shippingMethodSchema.optional(),
  note: z.string().trim().optional().nullable(),
});

export type OrderItemDTO = z.infer<typeof orderItemSchema>;
export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
export type UpdateOrderDTO = z.infer<typeof updateOrderSchema>;
