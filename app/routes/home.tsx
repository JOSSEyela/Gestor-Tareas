import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Gestor de Tareas" },
    { name: "description", content: "Tablero Kanban para gestión de tareas" },
  ];
}

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Gestor de Tareas
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Tablero Kanban — en construcción
        </p>
      </div>
    </div>
  );
}
