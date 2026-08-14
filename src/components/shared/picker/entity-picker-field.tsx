"use client";

import { X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn, inputCls } from "@/lib/utils";
import { Badge } from "@/components/ui";
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
    return (value as any[]).map((id) => {
      const normalized = normalizeId(id as unknown as T["id"]);
      const found = options.find((o) => normalizeId(o.id) === normalized);
      return (
        (found as T) ??
        ({ id: id as unknown as T["id"], name: String(id) } as T)
      );
    });
  }, [value, options]);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Fetch all options once on mount (used for select list)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await fetcher("");
        if (!mounted) return;
        setOptions(res ?? []);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [fetcher]);

  // close on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!open) return;
      if (!wrapperRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!wrapperRef.current.contains(e.target)) setOpen(false);
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const toggle = (item: T) => {
    const id = normalizeId(item.id);
    const exists = selectedIds.includes(id);

    if (exists) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
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

      {/* dropdown multi-select */}
      <div className="relative" ref={wrapperRef}>
        <div
          role="button"
          tabIndex={0}
          onClick={() => setOpen((s) => !s)}
          className={cn(
            inputCls,
            "flex items-center justify-between cursor-pointer",
          )}
        >
          <div className="min-w-0">
            {selectedItems.length > 0 ? (
              <div className="flex gap-2 flex-wrap">
                {selectedItems.map((s) => (
                  <span key={String(s.id)} className="max-w-[200px] truncate">
                    {getLabel?.(s) ?? s.name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-slate-400">{placeholder}</span>
            )}
          </div>

          <div className="ml-2 text-slate-400">▾</div>
        </div>

        {open && (
          <div className="mt-1 w-full rounded-md border bg-white shadow-sm">
            <div className="max-h-56 overflow-auto">
              {loading ? (
                <div className="p-3 text-sm text-slate-500">Loading...</div>
              ) : options.length === 0 ? (
                <div className="p-3 text-sm text-slate-500">No results</div>
              ) : (
                options.map((item) => {
                  const id = normalizeId(item.id);
                  const checked = selectedIds.includes(id);
                  return (
                    <label
                      key={String(item.id)}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(item)}
                        className="h-4 w-4"
                      />

                      <div className="min-w-0">
                        <div className="truncate font-medium">
                          {getLabel?.(item) ?? item.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ID: {String(item.id)}
                        </div>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
