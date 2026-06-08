import { type ReactNode } from "react";
import { cn } from "~/lib/utils";

export type BadgeVariant =
  | "todo"
  | "in-progress"
  | "done"
  | "priority-high"
  | "priority-medium"
  | "priority-low"
  | "default";

export interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  "todo":            "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400",
  "in-progress":     "bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400",
  "done":            "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "priority-high":   "bg-red-100    text-red-700    dark:bg-red-900/30    dark:text-red-400",
  "priority-medium": "bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400",
  "priority-low":    "bg-slate-100  text-slate-600  dark:bg-slate-800     dark:text-slate-400",
  "default":         "bg-slate-100  text-slate-600  dark:bg-slate-800     dark:text-slate-400",
};

const dotStyles: Record<BadgeVariant, string> = {
  "todo":            "bg-blue-500",
  "in-progress":     "bg-amber-500",
  "done":            "bg-emerald-500",
  "priority-high":   "bg-red-500",
  "priority-medium": "bg-amber-500",
  "priority-low":    "bg-slate-400",
  "default":         "bg-slate-400",
};

export function Badge({ variant = "default", children, className, dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", dotStyles[variant])} aria-hidden="true" />
      )}
      {children}
    </span>
  );
}
