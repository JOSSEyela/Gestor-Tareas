import { Link } from "react-router";
import type { Route } from "./+types/404";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Página no encontrada | Gestor de Tareas" },
    { name: "description", content: "La página que buscas no existe." },
  ];
}

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center px-4">
      <div className="text-center animate-fade-in">

        <p className="text-8xl font-black text-slate-200 dark:text-slate-800 select-none">
          404
        </p>

        <div className="-mt-4 space-y-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Página no encontrada
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            La ruta que intentas acceder no existe o fue movida.
          </p>
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Volver al tablero
        </Link>
      </div>
    </main>
  );
}
