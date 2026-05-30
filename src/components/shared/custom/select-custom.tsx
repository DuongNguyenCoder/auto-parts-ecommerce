"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectCustomProps<T> = {
  items: T[];

  value?: string;
  onChange?: (value: string, item?: T) => void;

  placeholder?: string;

  disabled?: boolean;
  loading?: boolean;

  emptyText?: string;

  className?: string;
  triggerClassName?: string;
  contentClassName?: string;

  getLabel: (item: T) => React.ReactNode;
  getValue: (item: T) => string;
};

export function SelectCustom<T>({
  items,

  value,
  onChange,

  placeholder = "Select option",

  disabled = false,
  loading = false,

  emptyText = "No data",

  className,
  triggerClassName,
  contentClassName,

  getLabel,
  getValue,
}: SelectCustomProps<T>) {
  const handleChange = React.useCallback(
    (selectedValue: string) => {
      const selectedItem = items.find(
        (item) => getValue(item) === selectedValue,
      );

      onChange?.(selectedValue, selectedItem);
    },
    [getValue, items, onChange],
  );

  return (
    <Select
      value={value}
      onValueChange={handleChange}
      disabled={disabled || loading}
    >
      <SelectTrigger
        className={cn("h-11 rounded-xl border-zinc-200", triggerClassName)}
      >
        <SelectValue placeholder={placeholder} />

        {/* <ChevronDown className="size-4 opacity-70" /> */}
      </SelectTrigger>

      <SelectContent className={cn("rounded-2xl", contentClassName)}>
        {items.length === 0 ? (
          <div
            className="
              px-3 py-6 text-center
              text-sm text-muted-foreground
            "
          >
            {loading ? "Loading..." : emptyText}
          </div>
        ) : (
          items.map((item) => {
            const itemValue = getValue(item);

            return (
              <SelectItem
                key={itemValue}
                value={itemValue}
                className="
                  cursor-pointer rounded-xl
                "
              >
                <div className="flex items-center gap-2">
                  {getLabel(item)}

                  {/* {value === itemValue && <Check className="ml-auto size-4" />} */}
                </div>
              </SelectItem>
            );
          })
        )}
      </SelectContent>
    </Select>
  );
}
