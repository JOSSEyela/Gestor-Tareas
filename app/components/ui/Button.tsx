import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "~/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-indigo-600 text-white shadow-sm",
    "hover:bg-indigo-700 active:bg-indigo-800",
    "dark:bg-indigo-500 dark:hover:bg-indigo-400",
  ].join(" "),
  secondary: [
    "bg-white text-slate-700 border border-slate-300 shadow-sm",
    "hover:bg-slate-50 active:bg-slate-100",
    "dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600",
    "dark:hover:bg-slate-700",
  ].join(" "),
  ghost: [
    "text-slate-600",
    "hover:bg-slate-100 active:bg-slate-200",
    "dark:text-slate-400 dark:hover:bg-slate-800",
  ].join(" "),
  danger: [
    "bg-red-600 text-white shadow-sm",
    "hover:bg-red-700 active:bg-red-800",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-9 px-4 text-sm gap-2   rounded-lg",
  lg: "h-11 px-6 text-base gap-2.5 rounded-xl",
};

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, icon, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center font-medium",
        "transition-all duration-150 ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  ),
);

Button.displayName = "Button";
