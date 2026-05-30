"use client";

import * as React from "react";
import { Loader2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────────────────

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onOpenChange: (open: boolean) => void;

  children: React.ReactNode;
  actions?: React.ReactNode;

  className?: string;
  contentClassName?: string;

  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "6xl" | "full";

  loading?: boolean;

  /**
   * Prevent close when submitting
   */
  preventClose?: boolean;

  /**
   * Show X button
   */
  showCloseButton?: boolean;

  /**
   * Optional badge label shown in header (e.g. "Product Management")
   */
  badge?: string;
};

// ─── Width map ────────────────────────────────────────────────────────────────

const modalWidthMap: Record<NonNullable<ModalProps["maxWidth"]>, string> = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "6xl": "sm:max-w-6xl",
  full: "sm:max-w-[95vw]",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Modal({
  open,
  title,
  description,
  onOpenChange,

  children,
  actions,

  className,
  contentClassName,

  maxWidth = "3xl",
  loading = false,
  preventClose = false,
  showCloseButton = true,
  badge,
}: ModalProps) {
  // ── Logic: unchanged ────────────────────────────────────────────────────────
  const handleOpenChange = React.useCallback(
    (value: boolean) => {
      if (preventClose || loading) return;
      onOpenChange(value);
    },
    [preventClose, loading, onOpenChange],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        onPointerDownOutside={(event) => {
          if (preventClose || loading) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          if (preventClose || loading) event.preventDefault();
        }}
        className={cn(
          "flex max-h-[90vh] flex-col overflow-hidden p-0",
          "gap-0 rounded-[28px]",
          "border border-sky-100/80",
          "bg-white/95 backdrop-blur-2xl",
          "shadow-[0_24px_64px_rgba(56,189,248,0.12),0_4px_16px_rgba(148,163,184,0.10)]",
          modalWidthMap[maxWidth],
          className,
        )}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <DialogHeader
          className={cn(
            "relative border-b border-sky-100/70 px-6 py-5 text-left",
            // Soft sky-tinted header bg
            "bg-gradient-to-br from-sky-50/60 via-white to-white",
          )}
        >
          <div className="pr-10 space-y-1">
            {/* Optional badge */}
            {badge && (
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-widest text-sky-600">
                {badge}
              </span>
            )}

            <DialogTitle className="text-[17px] font-semibold tracking-normal text-slate-900">
              {title}
            </DialogTitle>

            {description && (
              <DialogDescription className="mt-0.5 text-[13px] leading-relaxed text-slate-500">
                {description}
              </DialogDescription>
            )}
          </div>

          {/* Close button */}
          {showCloseButton && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={loading}
              onClick={() => handleOpenChange(false)}
              className={cn(
                "absolute right-4 top-4",
                "h-8 w-8 rounded-xl",
                "text-slate-400 transition-all duration-200",
                "hover:bg-sky-50 hover:text-slate-700",
                "active:scale-95",
                "disabled:opacity-40",
              )}
            >
              <X className="size-4" />
            </Button>
          )}
        </DialogHeader>

        {/* ── Content ────────────────────────────────────────────────────── */}
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-6 py-6",
            "[&::-webkit-scrollbar]:w-1.5",
            "[&::-webkit-scrollbar-track]:bg-transparent",
            "[&::-webkit-scrollbar-thumb]:rounded-full",
            "[&::-webkit-scrollbar-thumb]:bg-sky-200",
            "[&::-webkit-scrollbar-thumb:hover]:bg-sky-300",
            contentClassName,
          )}
        >
          {children}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        {actions && (
          <DialogFooter
            className={cn(
              "border-t border-sky-100/70 px-6 py-4",
              // Matching subtle footer bg
              "bg-gradient-to-br from-sky-50/40 via-white to-white",
              "flex-row items-center justify-end gap-2",
            )}
          >
            {/* Loading indicator — left side, logic unchanged */}
            {loading && (
              <div className="mr-auto flex items-center gap-2 text-[13px] text-slate-500">
                <Loader2 className="size-4 animate-spin text-sky-400" />
                Đang xử lý...
              </div>
            )}

            {actions}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
