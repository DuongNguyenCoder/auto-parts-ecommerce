"use client";

import Link from "next/link";
import { Brand } from "@/types";
import BrandCard from "./brand-card";

type Props = {
  brands: any[];
};

export function BrandGrid({ brands }: Props) {
  if (!brands?.length) return null;

  return (
    <section aria-label="Browse brands" className="my-6">
      {/* Grid only visible from md and up */}
      <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {brands.map((brand) => {
          const href = `/hang-xe/${brand.slug}`;

          return (
            <Link key={brand.id} href={href} className="block h-full">
              <BrandCard brand={brand} />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
