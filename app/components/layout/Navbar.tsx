import { NavLink } from "react-router";
import { cn } from "~/lib/utils";
import { useTaskStore, selectTaskCount } from "~/store/taskStore";

export function Navbar() {
  const totalTasks = useTaskStore(selectTaskCount);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">

          <NavLink
            to="/"
            className="flex shrink-0 items-center gap-2 text-slate-900 dark:text-white"
            aria-label="Ir al tablero"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-base font-bold select-none"
              aria-hidden="true"
            >
              K
            </span>
            <span className="hidden sm:block text-sm font-bold tracking-tight">
              Gestor de Tareas
            </span>
          </NavLink>

          <nav className="flex items-center gap-1" aria-label="Navegación principal">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
                )
              }
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
              </svg>
              Tablero
            </NavLink>
          </nav>

          <span
            className="ml-auto shrink-0 rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400"
            aria-label={`${totalTasks} tareas en total`}
          >
            {totalTasks} {totalTasks === 1 ? "tarea" : "tareas"}
          </span>
        </div>
      </div>
    </header>
  );
}
