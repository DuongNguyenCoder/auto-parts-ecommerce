import Link from "next/link";

import { Menu } from "lucide-react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { HEADER_CATEGORIES, HEADER_NAV_ITEMS } from "./constants";
import { MegaMenuContent } from "./mega-menu-content";
import { NavMenuItem } from "./nav-menu-item";
import { Brand } from "@/types";
export async function NavHeader({ brands }: { brands: Brand[] }) {
  // const brandsRes = await brandApi.getAll({ take: 100 });
  // const brands = brandsRes.data?.items || [];

  // console.log("Brands: ", brands);
  return (
    <nav
      className="
        hidden border-b
        border-border bg-card
        lg:block
      "
    >
      <div className="container-page">
        <div className="flex h-14 items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center">
            {/* ALL CATEGORIES */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className="
                      mr-4 h-11 rounded-2xl
                      bg-primary px-5
                      font-semibold
                      text-primary-foreground
                      hover:bg-primary-hover
                    "
                  >
                    <Menu className="mr-2 size-5" />
                    Phụ tùng theo dòng xe
                  </NavigationMenuTrigger>

                  <NavigationMenuContent>
                    <MegaMenuContent brands={brands} />
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* NAV ITEMS */}
            <div className="flex items-center">
              {HEADER_NAV_ITEMS.map((item) => (
                <NavMenuItem
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  badge={item.badge}
                />
              ))}
            </div>
          </div>

          {/* RIGHT CTA */}
          <Link
            href="/ho-tro"
            className="
              text-sm font-medium
              text-muted-foreground
              transition-colors
              hover:text-primary
            "
          >
            Hỗ trợ
          </Link>
        </div>
      </div>
    </nav>
  );
}
