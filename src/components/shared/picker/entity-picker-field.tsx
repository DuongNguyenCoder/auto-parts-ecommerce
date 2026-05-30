"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
  Badge,
} from "@/components/ui";

import { Input } from "@/components/ui/input";
import { Search, X, Check, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn, inputCls, inputErrorCls } from "@/lib/utils";
import { Entity, EntityPickerProps } from "@/components/shared/picker/type";

export function EntityPickerField<T extends Entity>({
  value,
  onChange,
  fetcher,
  getLabel,
  renderSelected,
  renderOption,
  label = "Select items",
  placeholder = "Search...",
  hint,
  className,
}: EntityPickerProps<T>) {
  const [keyword, setKeyword] = useState("");
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const normalizeId = (id: T["id"]) => Number(id);

  const selectedIds = useMemo(() => {
    return (value ?? []).map(Number);
  }, [value]);

  const selectedItems = useMemo(() => {
    return value.map((id) => ({
      id,
      name: String(id), // fallback safe
    })) as T[];
  }, [value]);

  useEffect(() => {
    if (!keyword) {
      setOptions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const res = await fetcher(keyword);
      setOptions(res);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [keyword, fetcher]);

  const toggle = (item: T) => {
    const id = normalizeId(item.id);

    const exists = selectedIds.includes(id);

    if (exists) {
      onChange(selectedIds.filter((x) => normalizeId(x) !== id));
    } else {
      onChange([...selectedIds, normalizeId(item.id)]);
    }
    setOpen(false);
    setKeyword("");
  };

  const remove = (id: T["id"]) => {
    const normalized = normalizeId(id);

    onChange(selectedIds.filter((x) => x !== normalized));
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* label */}
      <div className="text-sm font-medium">{label}</div>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}

      {/* selected */}
      {!!selectedItems.length && (
        <div className="flex flex-wrap gap-2 rounded-md border p-3">
          {selectedItems.map((item) => {
            const remove = () => toggle(item);
            console.log("item ========>??", item);

            if (renderSelected) {
              return renderSelected(item, remove);
            }

            return (
              <Badge
                key={item.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                <span className="max-w-[180px] truncate">
                  {getLabel?.(item) ?? item.name}
                </span>

                <button
                  type="button"
                  onClick={remove}
                  className="rounded-sm p-0.5 hover:bg-zinc-300"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* search */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={keyword}
              placeholder={placeholder}
              className={cn(inputCls, "pl-9")}
              onChange={(e) => {
                setKeyword(e.target.value);
                setOpen(true);
              }}
            />

            {loading && (
              <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin" />
            )}
          </div>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] p-0"
        >
          <Command shouldFilter={false}>
            <CommandList>
              <ScrollArea className="max-h-72">
                {!loading && !options.length && (
                  <CommandEmpty>No results</CommandEmpty>
                )}

                <CommandGroup>
                  {options.map((item) => {
                    const active = selectedIds.includes(normalizeId(item.id));

                    if (renderOption) {
                      return (
                        <CommandItem
                          key={item.id}
                          onSelect={() => toggle(item)}
                          className="cursor-pointer"
                        >
                          {renderOption(item, { selected: active })}
                        </CommandItem>
                      );
                    }

                    return (
                      <CommandItem
                        key={item.id}
                        onSelect={() => toggle(item)}
                        className="cursor-pointer"
                      >
                        <div className="flex w-full items-center justify-between">
                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {getLabel?.(item) ?? item.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              ID: {item.id}
                            </p>
                          </div>

                          {active && <Check className="size-4" />}
                        </div>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
