import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Car,
  Newspaper,
  Image,
  Tags,
  Users,
  RectangleEllipsis,
  ShoppingBag,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
};

export const ADMIN_NAVIGATION: AdminNavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Sản phẩm",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Danh mục",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Hãng xe",
    href: "/admin/brands",
    icon: Car,
  },
  {
    title: "Dòng xe",
    href: "/admin/car-models",
    icon: RectangleEllipsis,
  },
  {
    title: "Bài viết",
    href: "/admin/posts",
    icon: Newspaper,
  },
  {
    title: "Danh mục bài viết",
    href: "/admin/post-categories",
    icon: Tags,
  },
  {
    title: "Banner",
    href: "/admin/banners",
    icon: Image,
  },
  {
    title: "Đơn đặt hàng",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Người dùng",
    href: "/admin/users",
    icon: Users,
  },
];
