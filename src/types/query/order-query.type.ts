import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ShippingMethod,
} from "@/types";
import { BaseListQuery } from "@/types/query/query.type";

export type OrderSortField =
  | "orderNumber"
  | "total"
  | "shippingFee"
  | "createdAt"
  | "updatedAt";

export const ORDER_SORT_FIELDS = [
  "orderNumber",
  "total",
  "shippingFee",
  "createdAt",
  "updatedAt",
] as const;

export type OrderListQuery = BaseListQuery<OrderSortField> & {
  orderNumber?: string;

  userId?: string;

  status?: OrderStatus;

  paymentStatus?: PaymentStatus;

  paymentMethod?: PaymentMethod;

  shippingMethod?: ShippingMethod;

  minTotal?: number;

  maxTotal?: number;

  createdFrom?: string;

  createdTo?: string;
};
