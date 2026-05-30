import { buildOrderBy } from "@/lib/server/buildOrderBy";
import { prisma } from "@/server/prisma";
import { OrderSortField, SortOrder } from "@/types";
import { PaymentMethod, ShippingMethod } from "@/types/order.type";
import type { OrderStatus, PaymentStatus } from "@/types/order.type";
import { ORDER_SORT_FIELDS } from "@/types/query/order-query.type";

const orderProductProductSelect = {
  id: true,
  slug: true,
  name: true,
  imageUrl: true,
  price: true,
  categoryId: true,
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  fitments: {
    select: {
      id: true,
      brandId: true,
      name: true,
      year: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} as const;

const orderSelect = {
  id: true,
  orderNumber: true,
  userId: true,
  status: true,
  paymentStatus: true,
  paymentMethod: true,
  shippingMethod: true,
  total: true,
  shippingFee: true,
  note: true,
  createdAt: true,
  updatedAt: true,
  products: {
    select: {
      id: true,
      orderId: true,
      productId: true,
      quantity: true,
      product: {
        select: orderProductProductSelect,
      },
    },
  },
} as const;

export type OrderRecord = Awaited<ReturnType<typeof orderRepository.findById>>;

export const orderRepository = {
  create: (data: {
    orderNumber: string;
    userId: string;
    paymentMethod: PaymentMethod;
    shippingMethod: ShippingMethod;
    shippingFee: number;
    total: number;
    note?: string | null;
    products: { productId: number; quantity: number }[];
  }) =>
    prisma.order.create({
      data: {
        orderNumber: data.orderNumber,
        userId: data.userId,
        paymentMethod: data?.paymentMethod,
        shippingMethod: data?.shippingMethod,
        shippingFee: data.shippingFee,
        total: data.total,
        note: data.note,
        products: {
          create: data.products.map((product) => ({
            product: { connect: { id: product.productId } },
            quantity: product.quantity,
          })),
        },
      },
      select: orderSelect,
    }),

  findById: (id: string) =>
    prisma.order.findUnique({
      where: { id },
      select: orderSelect,
    }),

  findByUserId: (userId: string) =>
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: orderSelect,
    }),

  findAll: (
    where?: {
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
    },
    pagination?: { take?: number; skip?: number },
    sort?: {
      sortBy?: OrderSortField;
      orderBy?: SortOrder;
    },
  ) =>
    prisma.order.findMany({
      where: buildWhereClause(where),

      take: pagination?.take,
      skip: pagination?.skip,
      select: orderSelect,

      orderBy: buildOrderBy(ORDER_SORT_FIELDS, sort?.sortBy, sort?.orderBy) ?? {
        createdAt: "desc",
      },
    }),

  count: (where?: {
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
  }) =>
    prisma.order.count({
      where: buildWhereClause(where),
    }),

  update: (
    id: string,
    data: {
      status?: OrderStatus;
      paymentStatus?: PaymentStatus;
      paymentMethod?: PaymentMethod;
      shippingMethod?: ShippingMethod;
      note?: string | null;
    },
  ) =>
    prisma.order.update({
      where: { id },
      data,
      select: orderSelect,
    }),
};

const buildWhereClause = (where?: {
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
}) => ({
  orderNumber: where?.orderNumber
    ? {
        contains: where.orderNumber,
        mode: "insensitive" as const,
      }
    : undefined,

  userId: where?.userId,

  status: where?.status,
  paymentStatus: where?.paymentStatus,
  paymentMethod: where?.paymentMethod,
  shippingMethod: where?.shippingMethod,

  total:
    where?.minTotal !== undefined || where?.maxTotal !== undefined
      ? {
          gte: where.minTotal,
          lte: where.maxTotal,
        }
      : undefined,

  createdAt:
    where?.createdFrom || where?.createdTo
      ? {
          gte: where.createdFrom ? new Date(where.createdFrom) : undefined,
          lte: where.createdTo ? new Date(where.createdTo) : undefined,
        }
      : undefined,
});
