"use client";

import { cn } from "@/lib/utils";
import { Brand } from "@/types";

type CarModelTabsProps = {
  items: Brand["models"];
  value: number;
  onChange: (id: number) => void;
};
import { Car } from "lucide-react";
import { useRef } from "react";

export function CarModelTabs({ items, value, onChange }: CarModelTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      {/* Fade masks for scroll indication */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-background to-transparent z-10" />

      <div
        ref={scrollRef}
        className="flex gap-1.5 overflow-x-auto scrollbar-none px-2 py-1"
      >
        {items.map((m) => {
          const isActive = value === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onChange(m.id)}
              className={cn(
                "relative flex items-center gap-1.5 whitespace-nowrap rounded-md px-3.5 py-1.5 text-sm font-medium transition-all duration-150 shrink-0",
                isActive
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              )}
            >
              <Car
                size={13}
                className={cn(
                  "shrink-0",
                  isActive ? "opacity-100" : "opacity-50",
                )}
              />
              {m.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
