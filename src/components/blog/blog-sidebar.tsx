import Link from "next/link";
import { brandApi, categoryApi, postCategoryApi } from "@/features/api";
import type { Brand, Category, PostCategory } from "@/types";
import { Car, ChevronDown, LayoutGrid, Newspaper } from "lucide-react";

import { cn } from "@/lib/utils";
import { SidebarSection } from "@/components/blog/sidebar-section";
import { postCategoryService } from "@/server/services/post-categories.service";
import { categoryService } from "@/server/services/categories.service";
import { brandService } from "@/server/services/brands.service";

interface SidebarItem {
  label: string;
  href: string;
  badge?: number;
  child?: SidebarItem[];
}

export default async function BlogSidebar() {
  // const [postCategoriesRes, brandsRes, categoriesRes] = await Promise.all([
  //   postCategoryApi.getAll({ take: 100 }),
  //   brandApi.getAll({ take: 100 }),
  //   categoryApi.getAll({ take: 100 }),
  // ]);
  const postCategoriesRes = await postCategoryService.list({}, { take: 100 });
  const categoriesRes = await categoryService.list({}, { take: 100 });
  const brandsRes = await brandService.list({}, { take: 100 });

  const postCategories = postCategoriesRes?.items ?? [];
  const brands = brandsRes?.items ?? [];
  const categories = categoriesRes?.items ?? [];

  const postCategoryItems: SidebarItem[] = postCategories.map(
    (category: PostCategory) => ({
      label: category.name,
      href: `/blog/${category.slug}`,
    }),
  );

  const brandItems: SidebarItem[] = brands.map((brand: any) => ({
    label: brand?.name,
    href: `/hang-xe/${brand.slug}`,
    child: brand?.models?.map((model: any) => ({
      label: model.name,
      href: `/dong-xe/${model.slug}`,
    })),
  }));

  const categoryItems: SidebarItem[] = categories.map((category: Category) => ({
    label: category.name,
    href: `/san-pham?categoryId=${category.id}`,
  }));

  return (
    <aside className="space-y-3 lg:sticky lg:top-24">
      <SidebarSection
        title="Thư mục tin tức"
        icon={<Newspaper size={14} />}
        iconColor="hsl(207 90% 50%)"
        iconBg="hsl(207 90% 54% / 0.12)"
        items={postCategoryItems}
        defaultOpen={true}
      />

      <SidebarSection
        title="Phụ tùng ô tô theo hãng xe"
        icon={<Car size={14} />}
        iconColor="hsl(199 89% 42%)"
        iconBg="hsl(199 89% 48% / 0.12)"
        items={brandItems}
        defaultOpen={false}
      />

      <SidebarSection
        title="Danh mục phụ tùng ô tô"
        icon={<LayoutGrid size={14} />}
        iconColor="hsl(142 72% 35%)"
        iconBg="hsl(142 72% 40% / 0.12)"
        items={categoryItems}
        defaultOpen={true}
      />
    </aside>
  );
}
