import { useState, useCallback, lazy, Suspense } from "react";
import type { Route } from "./+types/home";
import { type Task, type Status } from "~/types/task";
import { Button } from "~/components/ui";
import { KanbanBoard, SearchBar } from "~/components/kanban";
import { useTaskStore, selectTaskCount } from "~/store/taskStore";

const TaskModal = lazy(() =>
  import("~/components/kanban/TaskModal").then((m) => ({ default: m.TaskModal })),
);

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "Gestor de Tareas" },
    { name: "description", content: "Tablero Kanban para gestión de tareas" },
  ];
}

export default function Home() {
  const totalTasks = useTaskStore(selectTaskCount);
  const deleteTask = useTaskStore((s) => s.deleteTask);

  const [modalOpen,     setModalOpen]     = useState(false);
  const [editingTask,   setEditingTask]   = useState<Task | undefined>();
  const [defaultStatus, setDefaultStatus] = useState<Status>("todo");

  const handleAddTask = useCallback((status?: Task["status"]) => {
    setEditingTask(undefined);
    setDefaultStatus(status ?? "todo");
    setModalOpen(true);
  }, []);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  // Delete básico — toasts y confirmación mejorada en Issue #21
  const handleDeleteTask = useCallback((id: string) => {
    if (window.confirm("¿Eliminar esta tarea? Esta acción no se puede deshacer.")) {
      deleteTask(id);
    }
  }, [deleteTask]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingTask(undefined);
  }, []);

  return (
    <div className="min-h-[calc(100vh-56px)] bg-slate-50 dark:bg-slate-950">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Mi Tablero
            </h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {totalTasks} tarea{totalTasks !== 1 ? "s" : ""} · Arrastra las cards para cambiar su estado
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => handleAddTask()}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Nueva Tarea
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-2">
        <SearchBar />
      </div>

      <KanbanBoard
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      <Suspense fallback={null}>
        <TaskModal
          key={`${editingTask?.id ?? "new"}-${defaultStatus}`}
          isOpen={modalOpen}
          onClose={handleCloseModal}
          task={editingTask}
          defaultStatus={defaultStatus}
        />
      </Suspense>
    </div>
  );
}
