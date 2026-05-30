import { cn } from "@/lib/utils";
import { Category } from "@/types";

type CategoryTabsProps = {
  items: Category[];
  value: number;
  onChange: (id: number) => void;
};

export function CategoryTabs({ items, value, onChange }: CategoryTabsProps) {
  if (!items || items.length === 0) {
    return null;
  }
  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-none px-0.5 py-0.5 border-b border-border/50">
      {items.map((c) => {
        const isActive = value === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onChange(c.id)}
            className={cn(
              "relative whitespace-nowrap shrink-0 px-4 py-1.5 text-sm transition-all duration-150",
              isActive
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {c.name}

            {/* Active underline indicator */}
            <span
              className={cn(
                "absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary transition-all duration-200",
                isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
