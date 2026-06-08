import { Link } from "react-router";
import { memo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { type Task, PRIORITY_LABELS } from "~/types/task";
import { Badge } from "~/components/ui";
import { cn } from "~/lib/utils";
import { formatRelativeDate } from "~/lib/dateUtils";

interface TaskCardProps {
  task:      Task;
  onEdit?:   (task: Task) => void;
  onDelete?: (id: string) => void;
  overlay?:  boolean;
}

const statusAccent: Record<Task["status"], string> = {
  "todo":        "border-l-blue-400   dark:border-l-blue-500",
  "in-progress": "border-l-amber-400  dark:border-l-amber-500",
  "done":        "border-l-emerald-400 dark:border-l-emerald-500",
};

export const TaskCard = memo(function TaskCard({
  task,
  onEdit,
  onDelete,
  overlay = false,
}: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task.id, data: { task }, disabled: overlay });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <article
      ref={setNodeRef}
      style={style}
      aria-label={`Tarea: ${task.title}`}
      className={cn(
        "group relative rounded-xl border-l-4 border border-slate-200 dark:border-slate-700",
        "bg-white dark:bg-slate-900 shadow-sm transition-all duration-200",
        !overlay && "hover:shadow-md hover:-translate-y-0.5",
        statusAccent[task.status],
        isDragging && "opacity-40 scale-95",
        overlay    && "rotate-1 shadow-2xl opacity-95 scale-105 cursor-grabbing",
      )}
    >
      <span
        {...attributes}
        {...listeners}
        className={cn(
          "absolute left-1 top-1/2 -translate-y-1/2 z-10 touch-none",
          "cursor-grab active:cursor-grabbing rounded p-1",
          "opacity-0 group-hover:opacity-50 hover:!opacity-80 transition-opacity",
          overlay && "opacity-70",
        )}
        aria-label="Arrastrar tarea"
        role="button"
        tabIndex={overlay ? -1 : 0}
      >
        <svg className="h-3.5 w-3.5 text-slate-400" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <circle cx="5"  cy="4"  r="1.5" /><circle cx="11" cy="4"  r="1.5" />
          <circle cx="5"  cy="8"  r="1.5" /><circle cx="11" cy="8"  r="1.5" />
          <circle cx="5"  cy="12" r="1.5" /><circle cx="11" cy="12" r="1.5" />
        </svg>
      </span>

      <div className="px-4 py-3 pl-5 space-y-2">

        <Link
          to={`/task/${task.id}`}
          className="block text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2"
          tabIndex={isDragging ? -1 : 0}
        >
          {task.title}
        </Link>

        {task.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-1 gap-2">
          <Badge variant={`priority-${task.priority}`}>
            {PRIORITY_LABELS[task.priority]}
          </Badge>

          <div className="flex items-center gap-1 shrink-0">
            <time dateTime={task.createdAt} className="text-[10px] text-slate-400 dark:text-slate-500 mr-1">
              {formatRelativeDate(task.createdAt)}
            </time>

            {onEdit && (
              <button
                onClick={(e) => { e.preventDefault(); onEdit(task); }}
                className="rounded-md p-1 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 opacity-0 group-hover:opacity-100 transition-all focus-ring"
                aria-label={`Editar: ${task.title}`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}

            {onDelete && (
              <button
                onClick={(e) => { e.preventDefault(); onDelete(task.id); }}
                className="rounded-md p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-all focus-ring"
                aria-label={`Eliminar: ${task.title}`}
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});
