import { useParams, Link, useNavigate } from "react-router";
import type { Route } from "./+types/task.$id";
import { Badge, Button } from "~/components/ui";
import { useTaskStore } from "~/store/taskStore";
import { STATUS_LABELS, PRIORITY_LABELS } from "~/types/task";

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Detalle de Tarea | Gestor de Tareas" }];
}

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const task = useTaskStore((s) => s.tasks.find((t) => t.id === id));

  if (!task) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4">
        <div className="text-center animate-fade-in">
          <p className="text-6xl font-black text-slate-200 dark:text-slate-800 select-none">404</p>
          <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-white">
            Tarea no encontrada
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            La tarea <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">#{id}</code> no existe.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            ← Volver al tablero
          </Link>
        </div>
      </div>
    );
  }

  const createdDate = new Date(task.createdAt).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 animate-fade-in">

      <nav aria-label="Breadcrumb" className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          }
          onClick={() => navigate(-1)}
        >
          Volver
        </Button>
      </nav>

      <article className="card p-6 space-y-5">

        <header className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-snug flex-1">
              {task.title}
            </h1>
            <Badge variant={task.status} dot>
              {STATUS_LABELS[task.status]}
            </Badge>
          </div>
          <Badge variant={`priority-${task.priority}`}>
            {PRIORITY_LABELS[task.priority]} prioridad
          </Badge>
        </header>

        <hr className="border-slate-200 dark:border-slate-700" />

        <section aria-labelledby="desc-heading">
          <h2 id="desc-heading" className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Descripción
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {task.description || <span className="italic text-slate-400">Sin descripción</span>}
          </p>
        </section>

        <hr className="border-slate-200 dark:border-slate-700" />

        <footer className="flex flex-wrap gap-4 text-xs text-slate-400">
          <span>
            <span className="font-medium text-slate-500 dark:text-slate-400">ID:</span>{" "}
            <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{task.id}</code>
          </span>
          <span>
            <span className="font-medium text-slate-500 dark:text-slate-400">Creada:</span>{" "}
            {createdDate}
          </span>
        </footer>
      </article>
    </div>
  );
}
