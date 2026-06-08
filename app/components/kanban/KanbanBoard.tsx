import { type Task } from "~/types/task";
import { COLUMN_ORDER } from "~/types/task";
import { useTaskStore } from "~/store/taskStore";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  onAddTask?:   (defaultStatus?: Task["status"]) => void;
  onEditTask?:  (task: Task) => void;
  onDeleteTask?:(id: string) => void;
}

export function KanbanBoard({
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanBoardProps) {
  const tasks = useTaskStore((s) => s.tasks);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {COLUMN_ORDER.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);

          return (
            <KanbanColumn
              key={status}
              status={status}
              tasks={columnTasks}
              onAddTask={onAddTask ? () => onAddTask(status) : undefined}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          );
        })}
      </div>
    </div>
  );
}
