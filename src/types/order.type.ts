import type { Product } from "@/types/product.type";

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type PaymentMethod =
  | "CASH_ON_DELIVERY"
  | "BANK_TRANSFER"
  | "CREDIT_CARD"
  | "E_WALLET";

export type ShippingMethod = "DELIVERY" | "PICKUP";

export type OrderProduct = {
  id: number;
  orderId: string;
  productId: number;
  quantity: number;
  product: Product;
};

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  products: OrderProduct[];
  name?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  shippingMethod: ShippingMethod;
  total: number;
  shippingFee: number;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
};
