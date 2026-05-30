import { CartContainer } from "@/features/carts/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giỏ hàng | Auto Parts",
  description: "Xem và quản lý giỏ hàng của bạn",
};

export default function CartPage() {
  return <CartContainer />;
}
