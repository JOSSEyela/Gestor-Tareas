import { useEffect, useRef } from "react";
import { createPortal }       from "react-dom";
import { Button }              from "./Button";
import { cn }                  from "~/lib/utils";

interface ConfirmDialogProps {
  isOpen:   boolean;
  title:    string;
  message:  string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel:  () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Eliminar",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    cancelRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
        className={cn(
          "relative z-10 w-full max-w-sm rounded-2xl p-6",
          "bg-white dark:bg-slate-900",
          "border border-slate-200 dark:border-slate-700",
          "shadow-2xl animate-fade-in-scale",
        )}
      >
        
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <svg
            className="h-6 w-6 text-red-600 dark:text-red-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.834-1.964-.834-2.732 0L3.732 16.5c-.77.833.193 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h2
          id="confirm-title"
          className="text-base font-semibold text-slate-900 dark:text-white"
        >
          {title}
        </h2>
        <p
          id="confirm-message"
          className="mt-1 text-sm text-slate-500 dark:text-slate-400"
        >
          {message}
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <Button
            ref={cancelRef}
            variant="secondary"
            size="sm"
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
