import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Shared input class
export const inputCls = cn(
  "h-11 w-full rounded-2xl border-[1.5px] border-sky-100 bg-slate-50 px-4",
  "text-[14px] text-slate-900 placeholder:text-slate-400",
  "outline-none transition-all duration-200",
  "focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100/70",
  "hover:border-sky-200",
);

export const inputErrorCls =
  "border-rose-300 bg-rose-50/50 focus:border-rose-400 focus:ring-rose-100/70";
