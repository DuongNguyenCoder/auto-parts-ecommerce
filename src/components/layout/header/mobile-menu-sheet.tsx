"use client";

import Link from "next/link";

import {
  Car,
  ChevronRight,
  Headset,
  Heart,
  LayoutGrid,
  LogIn,
  Menu,
  PhoneCall,
  ShoppingCart,
  User,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

import { SearchBar } from "./search-bar";
import { useRouter } from "next/navigation";
import { Brand, Category } from "@/types";
import Image from "next/image";

const CATEGORIES = [
  "Engine Parts",
  "Brake System",
  "Suspension",
  "Lighting",
  "Oil & Fluids",
  "Electrical",
];

const NAV_LINKS = [
  {
    label: "Sản phẩm",
    href: "/san-pham",
  },
  {
    label: "Giới thiệu",
    href: "/gioi-thieu",
  },
  {
    label: "Tin tức - khuyến mãi",
    href: "/tin-tuc-khuyen-mai",
  },
  // {
  //   label: "Track Order",
  //   href: "/track-order",
  // },
];

export function MobileMenuSheet({
  session,
  isAuthencated,
  brands,
  categories,
  onChangeButonAuth,
}: {
  session: any;
  isAuthencated: boolean;
  brands: Brand[];
  categories: Category[];
  onChangeButonAuth: () => void;
}) {
  const router = useRouter();

  const handleAuth = () => {
    if (isAuthencated) {
      onChangeButonAuth();
    } else {
      router.push("/dang-nhap");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="
            rounded-xl
            hover:bg-muted
            lg:hidden
          "
          aria-label="Open navigation menu"
        >
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="
          w-[90vw]
          max-w-[380px]
          border-r
          p-0
        "
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>Browse categories and pages</SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col">
          {/* TOP */}
          <div className="border-b border-border p-5">
            <Link
              href="/"
              className="
                flex items-center gap-3
                text-lg font-bold
                text-foreground
              "
            >
              <div className="relative rounded-full border border-primary overflow-hidden p-1 shadow-sm">
                <Image
                  src="/logo-1080x1080-autotx.png"
                  alt="Auto Thọ Xuân Logo"
                  height={50}
                  width={50}
                  className="object-cover rounded-full"
                />
              </div>

              <div>
                <p className="font-semibold">Auto Thọ Xuân</p>

                <p className="text-xs text-muted-foreground">
                  Phụ tùng chính hãng giá tốt
                </p>
              </div>
            </Link>

            <div className="mt-5">
              <SearchBar />
            </div>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-5 py-5">
            {/* ACCOUNT */}
            <div className="space-y-3">
              <Button className="h-11 w-full justify-start gap-3 rounded-xl">
                <User className="size-5" />
                My Account
              </Button>

              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={handleAuth}
                  className="
                  h-11 w-full
                  justify-start gap-3
                  rounded-xl
                "
                >
                  <LogIn className="size-5" />
                  {isAuthencated ? "Đăng xuất" : "Đăng nhập"}
                </Button>
              </SheetClose>
            </div>

            <Separator className="my-6" />

            {/* QUICK ACTIONS */}
            <div className="grid grid-cols-2 gap-3">
              {/* <Button
                variant="outline"
                className="
                  h-14 rounded-2xl
                  justify-start gap-3
                "
              >
                <Heart className="size-5" />
                <p className="hidden xs:block">Wishlist</p>
              </Button> */}

              <Button
                variant="outline"
                onClick={() => router.push("/gio-hang")}
                className="
                  h-14 rounded-2xl
                  justify-start gap-3
                "
              >
                <ShoppingCart className="size-5" />
                Giỏ hàng
              </Button>
            </div>

            <Separator className="my-6" />

            {/* CATEGORIES */}
            <Accordion
              type="single"
              collapsible
              className="w-full border-b border-border pb-1.5 space-y-1"
            >
              <AccordionItem value="brands" className="border-none">
                <AccordionTrigger className="py-1 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Car className="size-5" />

                    <span className="font-semibold">Phụ tùng theo dòng xe</span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pt-3">
                  <SheetClose className="w-full flex flex-col gap-1">
                    {brands.map((brand) => (
                      <button
                        key={brand.slug}
                        type="button"
                        onClick={() => router.push(`/hang-xe/${brand.slug}`)}
                        className="
            flex items-center gap-3
            rounded-xl px-3 py-2
            text-left
            transition-colors
            hover:bg-muted
          "
                      >
                        <Car className="size-4 shrink-0 text-muted-foreground" />

                        <span className="font-medium">{brand.name}</span>
                      </button>
                    ))}
                  </SheetClose>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="categories">
                <AccordionTrigger className="py-1 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="size-5" />

                    <span className="font-semibold">Danh mục phụ tùng</span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="pt-4">
                  <SheetClose className="space-y-2 w-full flex flex-col">
                    {categories.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          router.push(`/san-pham?categoryId=${item.id}`)
                        }
                        className="
                          flex items-center justify-between
                          rounded-xl px-3 py-3
                          text-sm font-medium
                          transition-all duration-200
                          hover:bg-muted
                        "
                      >
                        {item.name}

                        <ChevronRight className="size-4 text-muted-foreground" />
                      </button>
                    ))}
                  </SheetClose>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Separator className="my-6" />

            {/* NAV LINKS */}
            <div className="space-y-2">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    flex items-center justify-between
                    rounded-xl px-3 py-3
                    text-sm font-medium
                    transition-all duration-200
                    hover:bg-muted
                  "
                >
                  {item.label}

                  <ChevronRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t border-border p-5">
            <Button
              variant="outline"
              className="
                h-12 w-full
                justify-start gap-3
                rounded-xl flex bg-button-ghost-hover text-sm
              "
            >
              <Link href="tel:0982575404" className="flex gap-3">
                <PhoneCall className="size-5" />
                0982 575 404
              </Link>
            </Button>

            <Button
              variant="outline"
              className="
                mt-3 h-12 w-full
                justify-start gap-3
                rounded-xl flex bg-button-ghost-hover text-sm
              "
            >
              <Link href="tel:0367200596" className="flex gap-3">
                <PhoneCall className="size-5" />
                0367 200 596
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
