import { Link } from "react-router";
import type { Route } from "./+types/home";
import { Button, Badge } from "~/components/ui";
import { useTaskStore, selectTaskCount } from "~/store/taskStore";
import { COLUMN_ORDER, STATUS_LABELS, PRIORITY_LABELS } from "~/types/task";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Gestor de Tareas" },
    { name: "description", content: "Tablero Kanban para gestión de tareas" },
  ];
}

export default function Home() {
  const tasks      = useTaskStore((s) => s.tasks);
  const totalTasks = useTaskStore(selectTaskCount);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Gestor de Tareas
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {totalTasks} tarea{totalTasks !== 1 ? "s" : ""} en total
          </p>
        </div>
        <Button icon={<span aria-hidden="true">+</span>}>Nueva Tarea</Button>
      </header>

      {/* Columnas Kanban — preview del estado */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {COLUMN_ORDER.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);
          return (
            <div key={status} className="card p-4 space-y-3">
              {/* Cabecera de columna */}
              <div className="flex items-center justify-between">
                <Badge variant={status} dot>
                  {STATUS_LABELS[status]}
                </Badge>
                <span className="text-xs font-semibold text-slate-400">
                  {columnTasks.length}
                </span>
              </div>

              {/* Tarjetas de tareas */}
              {columnTasks.map((task) => (
                <Link
                  key={task.id}
                  to={`/task/${task.id}`}
                  className="block rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 space-y-2 animate-fade-in hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all duration-150 group"
                >
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {task.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {task.description}
                  </p>
                  <Badge variant={`priority-${task.priority}`}>
                    {PRIORITY_LABELS[task.priority]}
                  </Badge>
                </Link>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
