import type { Route } from "./+types/home";
import { Button, Badge, Avatar } from "~/components/ui";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Gestor de Tareas" },
    { name: "description", content: "Tablero Kanban para gestión de tareas" },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Gestor de Tareas
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Tablero Kanban · Sistema de diseño base ✓
          </p>
        </div>
        <Button icon={<span>+</span>}>Nueva Tarea</Button>
      </header>

      {/* Design system preview */}
      <div className="card p-6 space-y-6 max-w-2xl">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Componentes UI
        </h2>

        {/* Buttons */}
        <section className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Botones</p>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primario</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Eliminar</Button>
            <Button variant="primary" size="sm">Pequeño</Button>
            <Button variant="primary" loading>Cargando</Button>
          </div>
        </section>

        {/* Badges — status */}
        <section className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Estados</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="todo" dot>Por hacer</Badge>
            <Badge variant="in-progress" dot>En progreso</Badge>
            <Badge variant="done" dot>Completado</Badge>
          </div>
        </section>

        {/* Badges — priority */}
        <section className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Prioridades</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="priority-high">🔴 Alta</Badge>
            <Badge variant="priority-medium">🟡 Media</Badge>
            <Badge variant="priority-low">⚪ Baja</Badge>
          </div>
        </section>

        {/* Avatars */}
        <section className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Avatares</p>
          <div className="flex items-center gap-3">
            <Avatar name="Ana García" size="lg" />
            <Avatar name="Carlos López" size="md" />
            <Avatar name="María Rodríguez" size="sm" />
            <Avatar name="Juan Pérez" size="xs" />
          </div>
        </section>
      </div>
    </div>
  );
}
