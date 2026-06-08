import { useMemo } from "react";
import { type Status, type Task, PRIORITY_WEIGHT } from "~/types/task";
import { useTaskStore }   from "~/store/taskStore";
import { useFilterStore } from "~/store/filterStore";
import { type SortBy }    from "~/store/filterStore";

// ─── Función de ordenamiento pura (testeable) ────────────────────────────────

export function sortTasks(tasks: Task[], sortBy: SortBy): Task[] {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        // Mayor peso = mayor prioridad → aparece primero
        return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      case "date-asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "date-desc":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
}

// ─── Función de filtrado pura (testeable) ────────────────────────────────────

export function filterTasks(
  tasks:           Task[],
  searchTerm:      string,
  filterByPriority: "all" | Task["priority"],
): Task[] {
  let result = tasks;

  // Filtro de texto — busca en título Y descripción (case-insensitive)
  if (searchTerm.trim()) {
    const term = searchTerm.trim().toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term),
    );
  }

  // Filtro de prioridad (AND con el de texto)
  if (filterByPriority !== "all") {
    result = result.filter((t) => t.priority === filterByPriority);
  }

  return result;
}

// ─── Hook principal ──────────────────────────────────────────────────────────

/**
 * Devuelve las tareas de una columna aplicando todos los filtros activos.
 * Usa useMemo para evitar re-computar si las dependencias no cambian.
 *
 * @param status - Columna Kanban a filtrar
 * @returns Tareas filtradas, buscadas y ordenadas listas para renderizar
 */
export function useFilteredTasksByColumn(status: Status): Task[] {
  const tasks           = useTaskStore((s)   => s.tasks);
  const searchTerm      = useFilterStore((s) => s.searchTerm);
  const filterByPriority = useFilterStore((s) => s.filterByPriority);
  const sortBy          = useFilterStore((s)  => s.sortBy);

  return useMemo(() => {
    // 1. Filtrar por columna
    const byColumn = tasks.filter((t) => t.status === status);

    // 2. Aplicar filtros de texto y prioridad (criterios combinados AND)
    const filtered = filterTasks(byColumn, searchTerm, filterByPriority);

    // 3. Ordenar
    return sortTasks(filtered, sortBy);
  }, [tasks, status, searchTerm, filterByPriority, sortBy]);
}
