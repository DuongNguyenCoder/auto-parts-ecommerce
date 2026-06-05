"use client";

import { useState } from "react";
import {
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
} from "lucide-react";
import {
  useUnprocessedOrders,
  useDashboardUsers,
  useDashboardPosts,
  useDashboardProducts,
  useDashboardConsultations,
  useOrdersByStatus,
} from "@/features/dashboard/hooks/use-dashboard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

/**
 * Dashboard overview card component
 */
function OverviewCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  href,
  color = "primary",
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: { value: number; direction: "up" | "down" };
  href?: string;
  color?: "primary" | "orange" | "rose" | "emerald" | "blue";
}) {
  const colorStyles = {
    primary: "bg-primary/10 text-primary",
    orange: "bg-orange-500/10 text-orange-600",
    rose: "bg-rose-500/10 text-rose-600",
    emerald: "bg-emerald-500/10 text-emerald-600",
    blue: "bg-blue-500/10 text-blue-600",
  };

  const content = (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-zinc-300">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-zinc-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-950">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-zinc-500">{subtitle}</p>}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <TrendingUp
                className={cn(
                  "h-4 w-4",
                  trend.direction === "up"
                    ? "text-emerald-600"
                    : "text-rose-600",
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.direction === "up"
                    ? "text-emerald-600"
                    : "text-rose-600",
                )}
              >
                {trend.direction === "up" ? "+" : "-"}
                {trend.value}%
              </span>
            </div>
          )}
        </div>
        <div className={cn("rounded-xl p-3", colorStyles[color])}>{Icon}</div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

/**
 * Order status card component
 */
function OrderStatusCard({
  status,
  count,
  color,
}: {
  status: string;
  count: number;
  color: "rose" | "orange" | "blue" | "emerald";
}) {
  const colorStyles = {
    rose: "border-rose-200 bg-rose-50",
    orange: "border-orange-200 bg-orange-50",
    blue: "border-blue-200 bg-blue-50",
    emerald: "border-emerald-200 bg-emerald-50",
  };

  const textStyles = {
    rose: "text-rose-700",
    orange: "text-orange-700",
    blue: "text-blue-700",
    emerald: "text-emerald-700",
  };

  return (
    <div className={cn("rounded-xl border p-4", colorStyles[color])}>
      <p className={cn("text-sm font-medium", textStyles[color])}>{status}</p>
      <p className={cn("mt-1 text-2xl font-bold", textStyles[color])}>
        {count}
      </p>
    </div>
  );
}

/**
 * Main dashboard component
 */
export function AdminDashboard() {
  const [expandedOrders, setExpandedOrders] = useState(false);

  // Fetch data
  const unprocessedOrders = useUnprocessedOrders();
  const pendingOrders = useOrdersByStatus("PENDING");
  const processingOrders = useOrdersByStatus("PROCESSING");
  const shippedOrders = useOrdersByStatus("SHIPPED");
  const deliveredOrders = useOrdersByStatus("DELIVERED");
  const users = useDashboardUsers();
  const posts = useDashboardPosts();
  const products = useDashboardProducts();
  console.log("PRODUCT CHECK => ", products);
  const consultations = useDashboardConsultations();

  const pendingCount = pendingOrders.data?.length ?? 0;
  const processingCount = processingOrders.data?.length ?? 0;
  const shippedCount = shippedOrders.data?.length ?? 0;
  const deliveredCount = deliveredOrders.data?.length ?? 0;
  const totalOrders =
    pendingCount + processingCount + shippedCount + deliveredCount;
  const unprocessedCount = pendingCount + processingCount;

  const totalUsers = users.data?.pagination?.total ?? 0;
  const totalPosts = posts.data?.pagination?.total ?? 0;
  const totalProducts = products.data?.pagination?.total ?? 0;
  const totalConsultations = consultations.data?.pagination?.total ?? 0;

  const isLoadingMetrics =
    pendingOrders.isLoading ||
    processingOrders.isLoading ||
    shippedOrders.isLoading ||
    deliveredOrders.isLoading ||
    users.isLoading ||
    posts.isLoading ||
    products.isLoading ||
    consultations.isLoading;

  return (
    <div className="mx-auto w-full max-w-7xl flex flex-col gap-8 px-6 py-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-950">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Quản lý tổng quát hệ thống - đơn hàng, sản phẩm, bài viết, người dùng
        </p>
      </div>

      {/* Main metrics grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <OverviewCard
          title="Tổng đơn hàng"
          value={totalOrders}
          icon={<ShoppingCart className="h-6 w-6" />}
          color="primary"
          href="/admin/orders"
          subtitle="Tất cả đơn hàng"
        />
        <OverviewCard
          title="Tổng sản phẩm"
          value={totalProducts}
          icon={<Package className="h-6 w-6" />}
          color="blue"
          href="/admin/products"
          subtitle="Các sản phẩm đang bán"
        />
        <OverviewCard
          title="Tổng người dùng"
          value={totalUsers}
          icon={<Users className="h-6 w-6" />}
          color="emerald"
          href="/admin/users"
          subtitle="Tài khoản đã đăng ký"
        />
        <OverviewCard
          title="Bài viết blog"
          value={totalPosts}
          icon={<MessageSquare className="h-6 w-6" />}
          color="orange"
          href="/admin/posts"
          subtitle="Bài viết đã xuất bản"
        />
      </div>

      {/* Unprocessed orders alert */}
      {unprocessedCount > 0 && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-rose-900">
                Đơn hàng chưa xử lý
              </h3>
              <p className="mt-1 text-sm text-rose-700">
                Bạn có <strong>{unprocessedCount}</strong> đơn hàng (
                {pendingCount} chờ xử lý + {processingCount} đang xử lý) cần
                được chú ý.
              </p>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-3 border-rose-300 hover:bg-rose-100"
              >
                <Link href="/admin/orders">Xem chi tiết</Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Orders breakdown section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">
              Phân loại đơn hàng
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Tình trạng của các đơn hàng hiện tại
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/orders">Quản lý đơn hàng</Link>
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OrderStatusCard
            status="Chờ xử lý"
            count={pendingCount}
            color="rose"
          />
          <OrderStatusCard
            status="Đang xử lý"
            count={processingCount}
            color="orange"
          />
          <OrderStatusCard status="Đã gửi" count={shippedCount} color="blue" />
          <OrderStatusCard
            status="Đã giao"
            count={deliveredCount}
            color="emerald"
          />
        </div>
      </div>

      {/* Consultations section */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-orange-500/10 p-3 text-orange-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-950">Tư vấn khách hàng</h3>
              <p className="mt-1 text-sm text-zinc-600">
                Yêu cầu tư vấn cần trả lời
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-zinc-950">
              {totalConsultations}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Tổng yêu cầu</p>
          </div>
        </div>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-4 w-full sm:w-auto"
        >
          <Link href="/admin/consultations">Xem tất cả tư vấn</Link>
        </Button>
      </div>

      {/* Quick actions grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <Package className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-950">Quản lý sản phẩm</h3>
          </div>
          <p className="text-sm text-zinc-600 mb-4">
            Thêm, sửa, xóa sản phẩm và quản lý kho hàng
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/products">Vào trang sản phẩm</Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-950">Quản lý người dùng</h3>
          </div>
          <p className="text-sm text-zinc-600 mb-4">
            Xem danh sách tài khoản và quản lý quyền truy cập
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/users">Vào trang người dùng</Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-orange-500/10 p-2 text-orange-600">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-950">Quản lý bài viết</h3>
          </div>
          <p className="text-sm text-zinc-600 mb-4">
            Viết, chỉnh sửa, xuất bản bài viết blog
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/posts">Vào trang bài viết</Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-zinc-950">Quản lý đơn hàng</h3>
          </div>
          <p className="text-sm text-zinc-600 mb-4">
            Xem chi tiết, cập nhật trạng thái đơn hàng
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/admin/orders">Vào trang đơn hàng</Link>
          </Button>
        </div>
      </div>

      {/* Loading states indicator */}
      {isLoadingMetrics && (
        <div className="text-center py-4">
          <p className="text-sm text-zinc-500">Đang tải dữ liệu...</p>
        </div>
      )}
    </div>
  );
}
