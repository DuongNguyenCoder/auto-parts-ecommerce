"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { PaginationCustom } from "@/components/ui/pagination-custom";
import { AdminOrderUpdateForm } from "@/features/orders/components/admin/AdminOrderUpdateForm";
import { orderApi } from "@/features/orders/api/order.api";
import type { Order, OrderListQuery } from "@/types";
import type { UpdateOrderDTO } from "@/validations/order.schema";

const DEFAULT_PAGE_SIZE = 10;

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formValues, setFormValues] = useState<UpdateOrderDTO>({});

  const queryClient = useQueryClient();

  const query: OrderListQuery = useMemo(() => ({ page }), [page]);

  const ordersQuery = useQuery({
    queryKey: ["orders", query],
    queryFn: async () => await orderApi.getAllByAdmin({ skip: 0, take: 10 }),
  });

  const orders = ordersQuery.data?.data?.items ?? [];
  // const totalPages = ordersQuery.data?.data?.pagination.totalPages ?? 1;

  console.log("Check fetch orders ===> adminL:", ordersQuery.data);

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateOrderDTO }) =>
      orderApi.updateOrder(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setStatusMessage({
        type: "success",
        text: "Order updated successfully.",
      });
      setSelectedOrder(null);
      setIsModalOpen(false);
    },
    onError: (error: Error) => {
      setStatusMessage({
        type: "error",
        text:
          error instanceof Error ? error.message : "Unable to update order.",
      });
    },
  });

  const isSaving = updateMutation.isPending;

  const openEditModal = (order: Order) => {
    setSelectedOrder(order);
    setFormValues({
      status: order.status,
      paymentStatus: order.paymentStatus,
      note: order.note || null,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (values: UpdateOrderDTO) => {
    if (!selectedOrder) return;

    await updateMutation.mutateAsync({
      id: selectedOrder.id,
      payload: values,
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
      <section className="flex flex-col gap-4 rounded-3xl border border-zinc-200 bg-white px-6 py-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-950">
              Orders administration
            </h1>
            <p className="max-w-2xl text-sm text-zinc-600">
              Manage and track customer orders.
            </p>
          </div>
        </div>

        {statusMessage ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
              statusMessage.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
          >
            {statusMessage.text}
          </div>
        ) : null}
      </section>

      <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm text-zinc-700">
            <thead className="bg-zinc-50 text-zinc-900">
              <tr>
                <th className="px-4 py-4 font-semibold">Order Number</th>
                <th className="px-4 py-4 font-semibold">Date</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 font-semibold">Payment</th>
                <th className="px-4 py-4 font-semibold text-right">Total</th>
                <th className="px-4 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {orders !== undefined && orders.length > 0 ? (
                orders.map((order: Order) => (
                  <tr key={order.id} className="hover:bg-zinc-50">
                    <td className="px-4 py-4 align-top font-medium text-zinc-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-4 align-top text-zinc-600">
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          order.status === "PENDING"
                            ? "border-yellow-300 bg-yellow-100 text-yellow-800"
                            : order.status === "PROCESSING"
                              ? "border-blue-300 bg-blue-100 text-blue-800"
                              : order.status === "SHIPPED"
                                ? "border-purple-300 bg-purple-100 text-purple-800"
                                : order.status === "DELIVERED"
                                  ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                                  : "border-red-300 bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          order.paymentStatus === "PENDING"
                            ? "border-yellow-300 bg-yellow-100 text-yellow-800"
                            : order.paymentStatus === "PAID"
                              ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                              : order.paymentStatus === "FAILED"
                                ? "border-red-300 bg-red-100 text-red-800"
                                : "border-blue-300 bg-blue-100 text-blue-800"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top text-right font-semibold text-zinc-900">
                      {(order.total / 1000).toFixed(0)}k VND
                    </td>
                    <td className="px-4 py-4 align-top space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(order)}
                      >
                        Edit
                      </Button>
                      <a href={`/admin/orders/${order.id}`}>
                        <Button type="button" variant="outline" size="sm">
                          View
                        </Button>
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-sm text-zinc-500"
                  >
                    {ordersQuery.isLoading
                      ? "Loading orders..."
                      : "No orders found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-4">
          <PaginationCustom page={page} totalPages={1} onPageChange={setPage} />
        </div>
      </section>

      <Modal
        open={isModalOpen}
        onOpenChange={closeModal}
        title="Edit order"
        description={
          selectedOrder
            ? `Update order ${selectedOrder.orderNumber}`
            : undefined
        }
        maxWidth="lg"
        loading={isSaving}
        preventClose={isSaving}
      >
        {selectedOrder && (
          <AdminOrderUpdateForm
            order={selectedOrder}
            values={formValues}
            onSubmit={handleFormSubmit}
          />
        )}
      </Modal>
    </div>
  );
}
