import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { type Task, type Status, COLUMN_ORDER } from "~/types/task";
import { useTaskStore }              from "~/store/taskStore";
import { useFilteredTasksByColumn }  from "~/hooks/useFilteredTasks";
import { KanbanColumn }              from "./KanbanColumn";
import { TaskCard }                  from "./TaskCard";

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
  const tasks    = useTaskStore((s) => s.tasks);
  const moveTask = useTaskStore((s) => s.moveTask);
  const [activeTask, setActiveTask] = useState<Task | null>(null);


  const todoTasks       = useFilteredTasksByColumn("todo");
  const inProgressTasks = useFilteredTasksByColumn("in-progress");
  const doneTasks       = useFilteredTasksByColumn("done");

  const filteredByColumn: Record<Status, Task[]> = {
    "todo":        todoTasks,
    "in-progress": inProgressTasks,
    "done":        doneTasks,
  };


  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  const handleDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      const task = tasks.find((t) => t.id === active.id);
      if (task) setActiveTask(task);
    },
    [tasks],
  );

  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveTask(null);
      if (!over) return;
      const taskId    = active.id as string;
      const newStatus = over.id   as Status;
      const task      = tasks.find((t) => t.id === taskId);
      if (task && task.status !== newStatus) moveTask(taskId, newStatus);
    },
    [tasks, moveTask],
  );

  const handleDragCancel = useCallback(() => setActiveTask(null), []);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {COLUMN_ORDER.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={filteredByColumn[status]}
              onAddTask={onAddTask ? () => onAddTask(status) : undefined}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={{ duration: 180, easing: "ease-out" }}>
        {activeTask ? <TaskCard task={activeTask} overlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
