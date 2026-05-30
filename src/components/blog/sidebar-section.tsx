"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SidebarItem {
  label: string;
  href: string;
  badge?: number;
  child?: SidebarItem[];
}

interface SidebarSectionProps {
  title: string;
  items: SidebarItem[];
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  defaultOpen?: boolean;
}

export function SidebarSection({
  title,
  icon,
  items,
  iconColor,
  iconBg,
  defaultOpen = true,
}: SidebarSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-shadow hover:shadow-md">
        {/* Header */}
        <CollapsibleTrigger asChild>
          <button className="flex w-full items-center gap-3 border-b border-border/50 px-4 py-3.5 text-left transition-colors hover:bg-muted/40">
            {/* Icon */}
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: iconBg, color: iconColor }}
            >
              {icon}
            </div>

            {/* Title */}
            <span className="flex-1 text-[12px]  font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {title}
            </span>

            {/* Count pill */}
            {!open && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {items.length}
              </span>
            )}

            {/* Chevron */}
            <ChevronDown
              size={15}
              className={cn(
                "flex-shrink-0 text-muted-foreground/60 transition-transform duration-250",
                open && "rotate-180",
              )}
            />
          </button>
        </CollapsibleTrigger>

        {/* Body */}
        <CollapsibleContent>
          <div className="space-y-1 p-1.5">
            {items.length ? (
              items.map((item) => <NavRow key={item.href} item={item} />)
            ) : (
              <div
                className="
                  rounded-xl bg-muted
                  px-3 py-3 text-center
                  text-sm text-muted-foreground
                "
              >
                Không có mục nào.
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function NavRow({ item }: { item: any }) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const hasChild = !!item.child?.length;

  if (!hasChild) {
    return (
      <Link
        href={item.href}
        className={cn(
          `
            group flex items-center gap-2.5
            rounded-xl px-3 py-2
            text-sm transition-all
            duration-150
          `,
          `
            text-foreground/80
            hover:bg-muted
            hover:text-foreground
          `,
          item.active &&
            `
              bg-primary/10
              font-medium text-primary
            `,
        )}
      >
        {item.icon && (
          <span
            className={cn(
              `
                shrink-0 opacity-50
                transition-opacity
                group-hover:opacity-80
              `,
              item.active && "opacity-90",
            )}
          >
            {item.icon}
          </span>
        )}

        <span className="flex-1 leading-snug">{item.label}</span>

        {item.badge !== undefined && (
          <ItemBadge value={item.badge} variant={item.badgeVariant} />
        )}
      </Link>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="space-y-1">
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              `
                group flex w-full
                items-center gap-2.5
                rounded-xl px-3 py-2
                text-left text-sm
                transition-all
                duration-150
              `,
              `
                text-foreground/80
                hover:bg-muted
                hover:text-foreground
              `,
            )}
          >
            {item.icon && (
              <span
                className="
                  shrink-0 opacity-50
                  transition-opacity
                  group-hover:opacity-80
                "
              >
                {item.icon}
              </span>
            )}

            <span className="flex-1">{item.label}</span>

            <ChevronDown
              size={15}
              className={cn(
                `
                  shrink-0
                  text-muted-foreground/60
                  transition-transform
                `,
                open && "rotate-180",
              )}
            />
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div
            className="
              ml-4 space-y-1
              border-l border-border/60
              pl-3
            "
          >
            {item.child?.map((child: SidebarItem) => (
              <NavRow key={child.href} item={child} />
            ))}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function ItemBadge({
  value,
  variant = "default",
}: {
  value: string | number;
  variant?: "default" | "new" | "hot";
}) {
  return (
    <span
      className={cn(
        `
          ml-auto shrink-0 rounded-full
          px-2 py-0.5 text-[10.5px]
          font-semibold leading-5
        `,
        variant === "default" && "bg-primary/10 text-primary",
        variant === "new" &&
          `
            bg-[hsl(142_72%_40%/0.12)]
            text-[hsl(142_72%_32%)]
          `,
        variant === "hot" &&
          `
            bg-[hsl(0_72%_56%/0.12)]
            text-[hsl(0_72%_44%)]
          `,
      )}
    >
      {value}
    </span>
  );
}
