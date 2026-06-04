import { cn } from "@/lib/utils";

import { MainHeader } from "./main-header";
import { NavHeader } from "./nav-header";
import { TopHeader } from "./top-header";
import { brandService } from "@/server/services/brands.service";
import { categoryService } from "@/server/services/categories.service";

type HeaderProps = {
  className?: string;
};

export async function Header({ className }: HeaderProps) {
  const brandsRes = await brandService.list({}, { take: 100 });
  const categoriesRes = await categoryService.list({}, { take: 100 });

  const brands = brandsRes?.items || [];
  const categories = categoriesRes?.items || [];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      <TopHeader />

      <div className="border-b border-border">
        <MainHeader brands={brands} categories={categories} />
      </div>

      <NavHeader brands={brands} />
    </header>
  );
}
