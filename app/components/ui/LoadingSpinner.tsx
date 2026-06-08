import { cn } from "~/lib/utils";

interface LoadingSpinnerProps {
  size?:    "sm" | "md" | "lg";
  label?:   string;
  fullPage?: boolean;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

/**
 * Spinner de carga reutilizable.
 * Usado como fallback en Suspense boundaries.
 */
export function LoadingSpinner({
  size     = "md",
  label    = "Cargando…",
  fullPage = false,
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "flex items-center justify-center",
        fullPage && "min-h-[calc(100vh-56px)]",
      )}
    >
      <span
        className={cn(
          "animate-spin rounded-full",
          "border-slate-200 dark:border-slate-700",
          "border-t-indigo-600 dark:border-t-indigo-400",
          sizeClasses[size],
        )}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
