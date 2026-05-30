import { AppError } from "@/server/http/app-error";
import { orderRepository } from "@/server/repositories/orders.repository";
import { productRepository } from "@/server/repositories/products.repository";
import type {
  CreateOrderDTO,
  UpdateOrderDTO,
} from "@/validations/order.schema";
import type { OrderRecord } from "@/server/repositories/orders.repository";
import {
  OrderListQuery,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ShippingMethod,
} from "@/types";
import { buildPagination } from "@/server/utils/pagination";

const generateOrderNumber = () =>
  `ORD-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;

const validateProducts = async (items: CreateOrderDTO["items"]) => {
  const productIds = Array.from(new Set(items.map((item) => item.productId)));
  const products = await productRepository.findByIds(productIds);

  if (products.length !== productIds.length) {
    const foundIds = new Set(products.map((product) => product.id));
    const missingIds = productIds.filter((id) => !foundIds.has(id));
    throw new AppError(`Products not found: ${missingIds.join(", ")}`, 404);
  }

  return new Map(products.map((product) => [product.id, product]));
};

const calculateTotal = (
  items: CreateOrderDTO["items"],
  productMap: Map<
    number,
    Awaited<ReturnType<typeof productRepository.findById>>
  >,
) => {
  return items.reduce((sum, item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      throw new AppError(`Product ${item.productId} not found`, 404);
    }
    return sum + Number(product.price) * item.quantity;
  }, 0);
};

export const orderService = {
  createOrder: async (userId: string, data: CreateOrderDTO) => {
    const productMap = await validateProducts(data.items);

    const subtotal = calculateTotal(data.items, productMap);
    const total = subtotal + data.shippingFee;

    const order = await orderRepository.create({
      orderNumber: generateOrderNumber(),
      userId,
      paymentMethod: data.paymentMethod,
      shippingMethod: data.shippingMethod,
      shippingFee: data.shippingFee,
      total,
      note: data.note,
      products: data.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    });

    if (!order) {
      throw new AppError("Unable to create order", 500);
    }

    return order;
  },

  getOrdersByUserId: async (userId: string) => {
    return orderRepository.findByUserId(userId);
  },

  getOrderById: async (userId: string, orderId: string) => {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError("Order not found", 404);
    }

    if (order.userId !== userId) {
      throw new AppError("Forbidden", 403);
    }

    return order;
  },

  getAllOrders: async (
    query: OrderListQuery,
    pagination?: {
      take?: number;
      skip?: number;
    },
  ) => {
    const filters = {
      orderNumber: query.orderNumber,
      userId: query.userId,

      status: query.status,
      paymentStatus: query.paymentStatus,
      paymentMethod: query.paymentMethod,
      shippingMethod: query.shippingMethod,

      minTotal: query.minTotal,
      maxTotal: query.maxTotal,

      createdFrom: query.createdFrom,
      createdTo: query.createdTo,
    };

    const take = pagination?.take ?? 10;
    const skip = pagination?.skip ?? 0;

    const [items, total] = await Promise.all([
      orderRepository.findAll(
        filters,
        { take, skip },
        {
          sortBy: query.sortBy,
          orderBy: query.orderBy,
        },
      ),
      orderRepository.count(filters),
    ]);

    return { items, pagination: buildPagination(total, take, skip) };
  },

  updateOrder: async (orderId: string, data: UpdateOrderDTO) => {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new AppError("Order not found", 404);
    }

    return orderRepository.update(orderId, data);
  },
};
