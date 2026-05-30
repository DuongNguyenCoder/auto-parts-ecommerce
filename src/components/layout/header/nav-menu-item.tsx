import Link from "next/link";

import { Badge } from "@/components/ui";

type NavMenuItemProps = {
  href: string;
  label: string;
  badge?: string;
};

export function NavMenuItem({ href, label, badge }: NavMenuItemProps) {
  return (
    <Link
      href={href}
      className="
        group relative
        flex shrink-0 items-center gap-2
        rounded-xl px-4 py-3
        text-sm font-medium
        text-foreground
        transition-all duration-200
        hover:bg-muted
        hover:text-primary
      "
    >
      {label}

      {badge && (
        <Badge
          className="
            rounded-full
            bg-danger
            text-white
          "
        >
          {badge}
        </Badge>
      )}

      <span
        className="
          absolute bottom-1 left-4
          h-[2px] w-0
          bg-primary
          transition-all duration-300
          group-hover:w-[calc(100%-32px)]
        "
      />
    </Link>
  );
}
