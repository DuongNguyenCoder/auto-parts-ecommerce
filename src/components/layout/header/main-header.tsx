"use client";

import Link from "next/link";

import {
  ArrowRightFromLine,
  Heart,
  PackageSearch,
  ShoppingCart,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MobileMenuSheet } from "./mobile-menu-sheet";
import { SearchBar } from "./search-bar";
import { useCartStore } from "@/stores";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Brand, Category } from "@/types";
import Image from "next/image";

type MainHeaderProps = {
  wishlistCount?: number;
  brands: Brand[];
  categories: Category[];
};

export function MainHeader({
  wishlistCount = 1,
  brands,
  categories,
}: MainHeaderProps) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const cartCount = items.length;

  const { session, isAuthenticated, logout } = useAuth();
  console.log("Check isAuthenticated ====> ", session);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="bg-background">
      <div className="container-page py-3 lg:py-4">
        {/* ======================
           DESKTOP + TABLET
        ====================== */}
        <div
          className="
            grid items-center gap-4
            lg:grid-cols-[250px_1fr_auto]
          "
        >
          {/* LOGO + MOBILE MENU */}
          <div className="flex items-center justify-between lg:justify-start">
            <div className="flex items-center gap-2 sm:gap-3">
              <MobileMenuSheet
                session={session}
                isAuthencated={isAuthenticated}
                brands={brands}
                categories={categories}
                onChangeButonAuth={handleLogout}
              />

              <Link
                href="/"
                className="
                  flex items-center gap-3
                  transition-opacity
                  hover:opacity-90
                "
              >
                <div className="relative rounded-full border border-border shadow-md overflow-hidden p-1">
                  <Image
                    src="/logo-1080x1080-autotx.png"
                    alt="Auto Thọ Xuân Logo"
                    height={56}
                    width={56}
                    className="object-cover rounded-full"
                  />
                </div>

                <div className="block">
                  <h2
                    className="
                      text-base font-bold
                      tracking-tight
                      text-foreground
                      sm:text-lg
                    "
                  >
                    Auto Thọ Xuân
                  </h2>

                  <p
                    className="
                      hidden text-xs
                      text-muted-foreground
                      sm:block
                    "
                  >
                    Phụ tùng ô tô chính hãng
                  </p>
                </div>
              </Link>
            </div>

            {/* MOBILE CART */}
            <div className="flex items-center lg:hidden">
              <Link href="/gio-hang">
                <Button
                  variant="ghost"
                  size="icon"
                  className="
                    relative rounded-xl
                    hover:bg-muted
                  "
                  aria-label="Shopping cart"
                >
                  <ShoppingCart className="size-6" />

                  {cartCount > 0 && (
                    <Badge
                      className="
                        absolute -right-1 -top-1
                        flex size-5 items-center
                        justify-center rounded-full
                        p-0 text-[10px]
                      "
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            </div>
          </div>

          {/* SEARCH */}
          <div className="order-2 lg:order-0">
            <SearchBar />
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="hidden items-center gap-2 lg:flex">
            {/* WISHLIST */}
            <Link href="#">
              <Button
                variant="ghost"
                className="
                  relative h-12 rounded-2xl
                  px-4 transition-all
                  hover:bg-muted
                "
              >
                <Heart className="size-5" />

                {wishlistCount > 0 && (
                  <Badge
                    className="
                      absolute right-2 top-2
                      flex size-5 items-center
                      justify-center rounded-full
                      p-0 text-[10px]
                    "
                  >
                    {wishlistCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* ACCOUNT */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="
                    h-12 gap-3 rounded-2xl
                    px-4 hover:bg-muted
                  "
                >
                  <div
                    className="
                      flex size-9 items-center
                      justify-center rounded-full
                      bg-muted
                    "
                  >
                    <User className="size-5" />
                  </div>

                  <div className="text-left">
                    {!isAuthenticated ? (
                      <>
                        {" "}
                        <p className="text-xs text-muted-foreground">Account</p>
                        <p className="font-semibold">Sign In</p>
                      </>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Hi, {session?.user.email.slice(0, 5)}...
                      </p>
                    )}
                  </div>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                {!isAuthenticated ? (
                  <>
                    <DropdownMenuItem
                      onClick={() => router.push("/dang-nhap")}
                      popoverTarget=""
                      className="rounded-xl"
                    >
                      {" "}
                      Đăng nhập
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => router.push("/dang-ky")}
                      className="rounded-xl"
                    >
                      Đăng ký
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    {session?.user.role === "ADMIN" && (
                      <DropdownMenuItem
                        onClick={() => router.push("/admin")}
                        className="rounded-xl flex group"
                      >
                        <ArrowRightFromLine
                          size={16}
                          className="group-hover:animate-pulse"
                        />{" "}
                        Quản trị viên
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-xl"
                    >
                      Đăng xuất
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem className="rounded-xl">
                  Đơn hàng đã đặt
                </DropdownMenuItem>

                <DropdownMenuItem className="rounded-xl">
                  Sản phẩm yêu thích
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* CART */}
            <Link href="/gio-hang">
              <Button
                className="
                  relative h-12 gap-3
                  rounded-2xl px-5
                  bg-primary
                  hover:bg-primary-hover
                "
              >
                <div className="relative">
                  <ShoppingCart className="size-5" />

                  {cartCount > 0 && (
                    <Badge
                      className="
                        absolute -right-3 -top-3
                        flex size-5 items-center
                        justify-center rounded-full
                        border-2 border-primary
                        bg-background
                        p-0 text-[10px]
                        text-foreground
                      "
                    >
                      {cartCount}
                    </Badge>
                  )}
                </div>

                <div className="text-left">
                  <p className="text-xs opacity-80">Giỏ hàng</p>

                  <p className="text-[9px] font-semibold">Xem giỏ hàng</p>
                </div>
              </Button>
            </Link>
          </div>
        </div>

        {/* TABLET ACTIONS */}
        <div
          className="
            mt-3 hidden
            items-center justify-end gap-2
            lg:hidden sm:flex
          "
        >
          <Link href="/track-order">
            <Button variant="outline" size="sm" className="rounded-xl">
              <PackageSearch className="mr-2 size-4" />
              Track Order
            </Button>
          </Link>

          <Link href="/account">
            <Button variant="outline" size="sm" className="rounded-xl">
              <User className="mr-2 size-4" />
              Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
