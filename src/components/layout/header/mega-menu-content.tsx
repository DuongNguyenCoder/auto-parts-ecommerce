"use client";

import Link from "next/link";

import { ChevronRight } from "lucide-react";
import { Brand } from "@/types";
import { useRouter } from "next/navigation";

type MegaMenuContentProps = {
  brands: Brand[];
};

export function MegaMenuContent({ brands }: MegaMenuContentProps) {
  const router = useRouter();
  return (
    <div className="grid min-w-[800px] grid-cols-4 gap-6 p-6">
      {brands.map((brand) => (
        <div key={brand.name}>
          <h3
            onClick={() => router.push(`/hang-xe/${brand.slug}`)}
            className="
              mb-4 flex items-center
              justify-between font-semibold
              text-foreground
              hover:text-primary
              cursor-pointer
            "
          >
            {brand.name}

            <ChevronRight className="size-4" />
          </h3>

          <div className="space-y-2">
            {brand?.models?.map((child) => (
              <Link
                key={child.id}
                href={`/dong-xe/${child.slug}`}
                className="
                  block rounded-lg px-2 py-2
                  text-sm text-muted-foreground
                  transition-colors
                  hover:bg-muted
                  hover:text-primary
                "
              >
                {child.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
