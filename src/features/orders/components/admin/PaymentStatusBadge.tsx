"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

interface Props {
  status: Order["paymentStatus"];
  className?: string;
}

const statusConfig = {
  PENDING: {
    label: "Chờ thanh toán",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  PAID: {
    label: "Đã thanh toán",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  FAILED: {
    label: "Thanh toán thất bại",
    color: "bg-red-100 text-red-800 border-red-300",
  },
  REFUNDED: {
    label: "Đã hoàn tiền",
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
} as const;

export function PaymentStatusBadge({ status, className }: Props) {
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
