import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { createPortal } from "react-dom";
import {
  type Task,
  type Status,
  type Priority,
  STATUS_LABELS,
  PRIORITY_LABELS,
  COLUMN_ORDER,
} from "~/types/task";
import { useTaskStore } from "~/store/taskStore";
import { Button, Badge } from "~/components/ui";
import { cn } from "~/lib/utils";


interface FormValues {
  title:       string;
  description: string;
  priority:    Priority;
  status:      Status;
}

interface FormErrors {
  title?: string;
}

interface TaskModalProps {
  isOpen:         boolean;
  onClose:        () => void;
  task?:          Task;
  defaultStatus?: Status;
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.title.trim()) {
    errors.title = "El título es obligatorio.";
  } else if (values.title.trim().length < 3) {
    errors.title = "El título debe tener al menos 3 caracteres.";
  }
  return errors;
}

export function TaskModal({ isOpen, onClose, task, defaultStatus = "todo" }: TaskModalProps) {
  const addTask    = useTaskStore((s) => s.addTask);
  const updateTask = useTaskStore((s) => s.updateTask);

  const isEditMode = Boolean(task);
  const modalRef   = useRef<HTMLDivElement>(null);

  const [values, setValues]   = useState<FormValues>(() => ({
    title:       task?.title       ?? "",
    description: task?.description ?? "",
    priority:    task?.priority    ?? "medium",
    status:      task?.status      ?? defaultStatus,
  }));
  const [errors, setErrors]   = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const modal = modalRef.current;
    if (!modal) return;

    const firstInput = modal.querySelector<HTMLElement>("input, textarea, select, button");
    firstInput?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = modal.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus(); }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));
      if (touched[name as keyof FormValues]) {
        const next = { ...values, [name]: value } as FormValues;
        setErrors(validate(next));
      }
    },
    [values, touched],
  );

  const handleBlur = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(values));
  }, [values]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setTouched({ title: true });
        return;
      }

      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 150));

      if (isEditMode && task) {
        updateTask(task.id, {
          title:       values.title.trim(),
          description: values.description.trim(),
          priority:    values.priority,
          status:      values.status,
        });
      } else {
        addTask({
          title:       values.title.trim(),
          description: values.description.trim(),
          priority:    values.priority,
          status:      values.status,
        });
      }

      setIsSubmitting(false);
      onClose();
    },
    [values, isEditMode, task, addTask, updateTask, onClose],
  );

  if (!isOpen) return null;

  const priorityOptions: Priority[] = ["high", "medium", "low"];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl",
          "bg-white dark:bg-slate-900",
          "border border-slate-200 dark:border-slate-700",
          "shadow-2xl animate-fade-in-scale",
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-6 py-4">
          <h2
            id="modal-title"
            className="text-base font-semibold text-slate-900 dark:text-white"
          >
            {isEditMode ? "Editar tarea" : "Nueva tarea"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-white transition-colors focus-ring"
            aria-label="Cerrar modal"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4 px-6 py-5">

            <div className="space-y-1.5">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Título <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Ej: Diseñar la pantalla de login"
                autoComplete="off"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
                className={cn(
                  "w-full rounded-xl border px-3.5 py-2.5 text-sm",
                  "bg-white dark:bg-slate-800 text-slate-900 dark:text-white",
                  "placeholder:text-slate-400 dark:placeholder:text-slate-500",
                  "transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0",
                  errors.title && touched.title
                    ? "border-red-400 focus:ring-red-400"
                    : "border-slate-300 dark:border-slate-600 focus:ring-indigo-500 focus:border-indigo-500",
                )}
              />
              {errors.title && touched.title && (
                <p id="title-error" role="alert" className="flex items-center gap-1 text-xs text-red-500">
                  <svg className="h-3.5 w-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Descripción
                <span className="ml-1 text-xs text-slate-400">(opcional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={values.description}
                onChange={handleChange}
                placeholder="Describe el objetivo de esta tarea…"
                className="w-full resize-none rounded-xl border border-slate-300 dark:border-slate-600 px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-offset-0"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Prioridad
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={values.priority}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-offset-0 transition-colors cursor-pointer"
                >
                  {priorityOptions.map((p) => (
                    <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Estado
                </label>
                <select
                  id="status"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-offset-0 transition-colors cursor-pointer"
                >
                  {COLUMN_ORDER.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 px-3 py-2">
              <span className="text-xs text-slate-400">Vista previa:</span>
              <Badge variant={values.status} dot>{STATUS_LABELS[values.status]}</Badge>
              <Badge variant={`priority-${values.priority}`}>{PRIORITY_LABELS[values.priority]}</Badge>
            </div>

          </div>

          <div className="flex justify-end gap-2 border-t border-slate-200 dark:border-slate-700 px-6 py-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={isSubmitting}>
              {isEditMode ? "Guardar cambios" : "Crear tarea"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
