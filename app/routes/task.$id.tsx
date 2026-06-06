import { useParams, Link } from "react-router";
import type { Route } from "./+types/task.$id";

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Detalle de Tarea | Gestor de Tareas" }];
}

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-lg">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          ← Volver al tablero
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          Tarea #{id}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Vista de detalle — en construcción (Issue #17)
        </p>
      </div>
    </div>
  );
}
