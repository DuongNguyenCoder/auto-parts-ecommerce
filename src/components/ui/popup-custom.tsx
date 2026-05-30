"use client";

import * as React from "react";

import { Loader2 } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type PopupCustomRenderProps = {
  close: () => void;
};

type PopupCustomProps = {
  trigger: React.ReactNode;

  title?: React.ReactNode;
  description?: React.ReactNode;

  children?: React.ReactNode;

  renderContent?: (props: PopupCustomRenderProps) => React.ReactNode;

  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;

  width?: number | string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;

  modal?: boolean;

  className?: string;
  contentClassName?: string;

  centered?: boolean;

  showFooter?: boolean;
  showCancel?: boolean;
  showConfirm?: boolean;

  cancelText?: string;
  confirmText?: string;

  loading?: boolean;
  disabled?: boolean;

  closeOnConfirm?: boolean;
  closeOnCancel?: boolean;

  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
};

export function PopupCustom({
  trigger,

  title,
  description,

  children,
  renderContent,

  open: controlledOpen,
  defaultOpen,
  onOpenChange,

  centered = false,

  width = 420,
  align = "center",
  side = "bottom",
  sideOffset = 8,

  modal = false,

  className,
  contentClassName,

  showFooter = false,
  showCancel = true,
  showConfirm = true,

  cancelText = "Cancel",
  confirmText = "Confirm",

  loading = false,
  disabled = false,

  closeOnConfirm = true,
  closeOnCancel = true,

  onConfirm,
  onCancel,
}: PopupCustomProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);

  const isControlled = controlledOpen !== undefined;

  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value);
      }

      onOpenChange?.(value);
    },
    [isControlled, onOpenChange],
  );

  const close = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleCancel = React.useCallback(() => {
    onCancel?.();

    if (closeOnCancel) {
      close();
    }
  }, [close, closeOnCancel, onCancel]);

  const handleConfirm = React.useCallback(async () => {
    await onConfirm?.();

    if (closeOnConfirm) {
      close();
    }
  }, [close, closeOnConfirm, onConfirm]);

  if (centered) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>

        <DialogContent className="max-w-md rounded-3xl p-0">
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <div className="inline-flex">{trigger}</div>
      </PopoverTrigger>

      <PopoverContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "rounded-2xl border bg-background p-0 shadow-lg",
          contentClassName,
        )}
        style={{
          width: typeof width === "number" ? `${width}px` : width,
        }}
      >
        <div className={cn("flex flex-col", className)}>
          {(title || description) && (
            <div className="space-y-1 border-b px-5 py-4">
              {title && <h3 className="text-sm font-semibold">{title}</h3>}

              {description && (
                <p className="text-muted-foreground text-sm">{description}</p>
              )}
            </div>
          )}

          <div className="p-5">
            {renderContent ? renderContent({ close }) : children}
          </div>

          {showFooter && (
            <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
              {showCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  {cancelText}
                </Button>
              )}

              {showConfirm && (
                <Button
                  type="button"
                  onClick={handleConfirm}
                  disabled={loading || disabled}
                >
                  {loading && <Loader2 className="mr-2 size-4 animate-spin" />}

                  {confirmText}
                </Button>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
