import { useMemo } from "react";
import { type Status, type Task, PRIORITY_WEIGHT } from "~/types/task";
import { useTaskStore }   from "~/store/taskStore";
import { useFilterStore } from "~/store/filterStore";
import { type SortBy }    from "~/store/filterStore";

export function sortTasks(tasks: Task[], sortBy: SortBy): Task[] {
  return [...tasks].sort((a, b) => {
    switch (sortBy) {
      case "priority":
        return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
      case "date-asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "date-desc":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
}


export function filterTasks(
  tasks:           Task[],
  searchTerm:      string,
  filterByPriority: "all" | Task["priority"],
): Task[] {
  let result = tasks;

  if (searchTerm.trim()) {
    const term = searchTerm.trim().toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        t.description.toLowerCase().includes(term),
    );
  }

  if (filterByPriority !== "all") {
    result = result.filter((t) => t.priority === filterByPriority);
  }

  return result;
}


export function useFilteredTasksByColumn(status: Status): Task[] {
  const tasks           = useTaskStore((s)   => s.tasks);
  const searchTerm      = useFilterStore((s) => s.searchTerm);
  const filterByPriority = useFilterStore((s) => s.filterByPriority);
  const sortBy          = useFilterStore((s)  => s.sortBy);

  return useMemo(() => {
    const byColumn = tasks.filter((t) => t.status === status);

    const filtered = filterTasks(byColumn, searchTerm, filterByPriority);

    return sortTasks(filtered, sortBy);
  }, [tasks, status, searchTerm, filterByPriority, sortBy]);
}
