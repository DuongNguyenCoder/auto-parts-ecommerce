"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

interface Props {
  status: Order["status"];
  className?: string;
}

const statusConfig = {
  PENDING: {
    label: "Chờ xử lý",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  PROCESSING: {
    label: "Đang xử lý",
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
  SHIPPED: {
    label: "Đã gửi",
    color: "bg-purple-100 text-purple-800 border-purple-300",
  },
  DELIVERED: {
    label: "Đã giao",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-800 border-red-300",
  },
} as const;

export function OrderStatusBadge({ status, className }: Props) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        config.color,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
