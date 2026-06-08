export type Status   = "todo" | "in-progress" | "done";
export type Priority = "low" | "medium" | "high";

export interface Task {
  id:          string;
  title:       string;
  description: string;
  status:      Status;
  priority:    Priority;
  createdAt:   string;
}

export type NewTaskData = Omit<Task, "id" | "createdAt">;

export type UpdateTaskData = Partial<Omit<Task, "id" | "createdAt">>;

export const STATUS_LABELS: Record<Status, string> = {
  "todo":        "Por hacer",
  "in-progress": "En progreso",
  "done":        "Completado",
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low:    "Baja",
  medium: "Media",
  high:   "Alta",
};

export const COLUMN_ORDER: Status[] = ["todo", "in-progress", "done"];

export const PRIORITY_WEIGHT: Record<Priority, number> = {
  high:   3,
  medium: 2,
  low:    1,
};
