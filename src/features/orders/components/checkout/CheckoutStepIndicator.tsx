"use client";

import { cn } from "@/lib/utils";

interface Props {
  steps: string[];
  activeIndex: number;
}

export function CheckoutStepIndicator({ steps, activeIndex }: Props) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => {
          const isActive = index === activeIndex;
          const isCompleted = index < activeIndex;

          return (
            <div
              key={step}
              className={cn(
                "rounded-2xl border p-4 text-sm transition",
                isActive
                  ? "border-primary bg-primary/5 text-primary"
                  : isCompleted
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-white text-gray-600",
              )}
            >
              <div className="font-semibold">Bước {index + 1}</div>
              <div className="mt-2 leading-snug">{step}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
