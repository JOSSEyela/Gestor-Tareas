import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  type Task,
  type Status,
  type NewTaskData,
  type UpdateTaskData,
} from "~/types/task";


interface TaskState {
  tasks: Task[];
}

interface TaskActions {
  addTask:    (data: NewTaskData) => void;
  updateTask: (id: string, updates: UpdateTaskData) => void;
  deleteTask: (id: string) => void;
  moveTask:   (id: string, newStatus: Status) => void;
  clearTasks: () => void;
}

export type TaskStore = TaskState & TaskActions;


const INITIAL_TASKS: Task[] = [
  {
    id:          "task-001",
    title:       "Diseñar wireframes del tablero",
    description: "Crear los prototipos de baja fidelidad en Penpot para las 3 vistas principales.",
    status:      "todo",
    priority:    "high",
    createdAt:   new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id:          "task-002",
    title:       "Implementar drag & drop",
    description: "Integrar @dnd-kit para el movimiento de tarjetas entre columnas Kanban.",
    status:      "in-progress",
    priority:    "high",
    createdAt:   new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id:          "task-003",
    title:       "Configurar Netlify CI/CD",
    description: "Conectar el repositorio GitHub con Netlify y verificar el primer deploy.",
    status:      "done",
    priority:    "medium",
    createdAt:   new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id:          "task-004",
    title:       "Escribir pruebas unitarias",
    description: "4 tests con Vitest: addTask, moveTask, filtrado y validación del formulario.",
    status:      "todo",
    priority:    "medium",
    createdAt:   new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id:          "task-005",
    title:       "Configurar ESLint estricto",
    description: "Reglas de TypeScript y React Hooks sin excepciones.",
    status:      "done",
    priority:    "low",
    createdAt:   new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];


export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: INITIAL_TASKS,

      addTask: (data) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...data,
              id:        crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task,
          ),
        })),

      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      moveTask: (id, newStatus) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status: newStatus } : task,
          ),
        })),

      clearTasks: () => set({ tasks: [] }),
    }),
    {
      name:    "gestor-tareas-state",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({ tasks: state.tasks }),

      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.error("[Zustand] Error al restaurar desde localStorage:", error);
        }
      },

      version: 1,
    },
  ),
);


export const selectTasksByStatus =
  (status: Status) => (state: TaskStore) =>
    state.tasks.filter((t) => t.status === status);


export const selectTaskCount = (state: TaskStore) => state.tasks.length;
