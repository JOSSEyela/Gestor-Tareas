import { lazy, Suspense, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useParams, Link, useNavigate } from "react-router";
import type { Route } from "./+types/task.$id";
import { Badge, Button, ConfirmDialog } from "~/components/ui";
import { useTaskStore } from "~/store/taskStore";
import {
  type Status,
  STATUS_LABELS,
  PRIORITY_LABELS,
  COLUMN_ORDER,
} from "~/types/task";

const TaskModal = lazy(() =>
  import("~/components/kanban/TaskModal").then((m) => ({ default: m.TaskModal })),
);

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Detalle de Tarea | Gestor de Tareas" },
    { name: "description", content: "Vista de detalle de una tarea del tablero Kanban" },
  ];
}

const statusIcon: Record<Status, string> = {
  "todo":        "⬜",
  "in-progress": "🔄",
  "done":        "✅",
};

export default function TaskDetail() {
  const { id }       = useParams<{ id: string }>();
  const navigate     = useNavigate();
  const task         = useTaskStore((s) => s.tasks.find((t) => t.id === id));
  const moveTask     = useTaskStore((s) => s.moveTask);
  const deleteTask   = useTaskStore((s) => s.deleteTask);

  const [editOpen,    setEditOpen]    = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleStatusChange = useCallback(
    (newStatus: Status) => {
      if (task && task.status !== newStatus) {
        moveTask(task.id, newStatus);
      }
    },
    [task, moveTask],
  );

  const handleDelete = useCallback(() => {
    if (!task) return;
    setConfirmOpen(true);
  }, [task]);

  const handleConfirmDelete = useCallback(() => {
    if (!task) return;
    deleteTask(task.id);
    toast.success("Tarea eliminada");
    setConfirmOpen(false);
    navigate("/", { replace: true });
  }, [task, deleteTask, navigate]);

  const handleCancelDelete = useCallback(() => setConfirmOpen(false), []);

  if (!task) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <p className="text-8xl font-black text-slate-200 dark:text-slate-800 select-none">404</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            Tarea no encontrada
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            La tarea con ID{" "}
            <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              {id}
            </code>{" "}
            no existe o fue eliminada.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Volver al tablero
          </Link>
        </div>
      </div>
    );
  }

  const createdDate = new Date(task.createdAt).toLocaleDateString("es-CO", {
    weekday: "long",
    day:     "2-digit",
    month:   "long",
    year:    "numeric",
    hour:    "2-digit",
    minute:  "2-digit",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 animate-fade-in">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          }
        >
          Volver
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setEditOpen(true)}
            icon={
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          >
            Editar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            icon={
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            }
          >
            Eliminar
          </Button>
        </div>
      </div>

      <article className="card p-6 space-y-6">

        <header className="space-y-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-snug">
            {task.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={task.status} dot>
              {STATUS_LABELS[task.status]}
            </Badge>
            <Badge variant={`priority-${task.priority}`}>
              {PRIORITY_LABELS[task.priority]} prioridad
            </Badge>
          </div>
        </header>

        <hr className="border-slate-200 dark:border-slate-700" />

        <section aria-labelledby="desc-heading">
          <h2
            id="desc-heading"
            className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Descripción
          </h2>
          {task.description ? (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          ) : (
            <p className="text-sm italic text-slate-400 dark:text-slate-500">
              Sin descripción. Edita la tarea para agregar una.
            </p>
          )}
        </section>

        <hr className="border-slate-200 dark:border-slate-700" />

        <section aria-labelledby="status-heading">
          <h2
            id="status-heading"
            className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400"
          >
            Mover a columna
          </h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Cambiar estado de la tarea">
            {COLUMN_ORDER.map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                disabled={task.status === status}
                aria-pressed={task.status === status}
                className={
                  task.status === status
                    ? "cursor-default rounded-xl border-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 text-sm font-semibold text-indigo-700 dark:text-indigo-300"
                    : "rounded-xl border-2 border-slate-200 dark:border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-600 dark:hover:border-indigo-700 dark:hover:text-indigo-400 transition-colors"
                }
              >
                {statusIcon[status]} {STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </section>

        <hr className="border-slate-200 dark:border-slate-700" />

        <footer className="space-y-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-16 font-medium text-slate-500 dark:text-slate-400 shrink-0">ID</span>
            <code className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 break-all">
              {task.id}
            </code>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-16 font-medium text-slate-500 dark:text-slate-400 shrink-0">Creada</span>
            <time dateTime={task.createdAt} className="text-slate-500 dark:text-slate-400 capitalize">
              {createdDate}
            </time>
          </div>
        </footer>
      </article>

      <Suspense fallback={null}>
        <TaskModal
          key={`edit-${task.id}`}
          isOpen={editOpen}
          onClose={() => setEditOpen(false)}
          task={task}
        />
      </Suspense>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="¿Eliminar tarea?"
        message={`"${task.title}" será eliminada permanentemente.`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
