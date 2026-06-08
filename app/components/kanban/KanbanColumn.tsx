import { useDroppable } from "@dnd-kit/core";
import { type Task, type Status, STATUS_LABELS } from "~/types/task";
import { Badge, Button } from "~/components/ui";
import { cn } from "~/lib/utils";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  status:       Status;
  tasks:        Task[];
  onAddTask?:   () => void;
  onEditTask?:  (task: Task) => void;
  onDeleteTask?:(id: string) => void;
}

const columnTheme: Record<Status, {
  header: string;
  accent: string;
  addBtn: string;
  empty:  string;
  over:   string;
}> = {
  "todo": {
    header: "bg-blue-50  dark:bg-blue-950/30  border-blue-200  dark:border-blue-800",
    accent: "text-blue-600 dark:text-blue-400",
    addBtn: "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600",
    empty:  "border-blue-200 dark:border-blue-800/50",
    over:   "ring-2 ring-blue-400  dark:ring-blue-500  bg-blue-50/40  dark:bg-blue-900/10",
  },
  "in-progress": {
    header: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
    accent: "text-amber-600 dark:text-amber-400",
    addBtn: "hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600",
    empty:  "border-amber-200 dark:border-amber-800/50",
    over:   "ring-2 ring-amber-400 dark:ring-amber-500 bg-amber-50/40 dark:bg-amber-900/10",
  },
  "done": {
    header: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
    accent: "text-emerald-600 dark:text-emerald-400",
    addBtn: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600",
    empty:  "border-emerald-200 dark:border-emerald-800/50",
    over:   "ring-2 ring-emerald-400 dark:ring-emerald-500 bg-emerald-50/40 dark:bg-emerald-900/10",
  },
};

export function KanbanColumn({
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const theme = columnTheme[status];

  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      aria-label={`Columna: ${STATUS_LABELS[status]}`}
      className={cn(
        "flex flex-col rounded-2xl border",
        "bg-slate-100/60 dark:bg-slate-800/40",
        "border-slate-200 dark:border-slate-700",
        "transition-all duration-150",
        isOver && theme.over,
      )}
    >

      <div className={cn(
        "flex items-center justify-between rounded-t-2xl border-b px-4 py-3",
        theme.header,
      )}>
        <Badge variant={status} dot>
          {STATUS_LABELS[status]}
        </Badge>
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold",
            "bg-white dark:bg-slate-900 shadow-sm",
            theme.accent,
          )}
          aria-label={`${tasks.length} tareas`}
        >
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex flex-col gap-2.5 flex-1 p-3 min-h-[140px]"
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))}

        {tasks.length === 0 && (
          <div className={cn(
            "flex flex-1 flex-col items-center justify-center",
            "rounded-xl border-2 border-dashed py-8 text-center",
            "transition-colors duration-150",
            isOver ? theme.over : theme.empty,
          )}>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {isOver ? "Suelta aquí ↓" : "Sin tareas"}
            </p>
          </div>
        )}
      </div>

      {onAddTask && (
        <div className="border-t border-slate-200 dark:border-slate-700 p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAddTask}
            className={cn("w-full justify-start gap-1.5 text-slate-500", theme.addBtn)}
            icon={
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            }
          >
            Agregar tarea
          </Button>
        </div>
      )}
    </section>
  );
}
