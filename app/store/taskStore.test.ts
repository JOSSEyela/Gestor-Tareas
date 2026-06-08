import { describe, it, expect, beforeEach } from "vitest";
import { useTaskStore } from "./taskStore";

function resetStore() {
  useTaskStore.setState({ tasks: [] });
  localStorage.clear();
}


describe("taskStore", () => {
  beforeEach(resetStore);


  it("TEST 1 — addTask: agrega la tarea con todos los campos correctos", () => {
    const { addTask } = useTaskStore.getState();

    addTask({
      title:       "Implementar login",
      description: "Autenticación con JWT",
      priority:    "high",
      status:      "todo",
    });

    const { tasks } = useTaskStore.getState();

    expect(tasks).toHaveLength(1);

    const task = tasks[0];

    expect(task.title).toBe("Implementar login");
    expect(task.description).toBe("Autenticación con JWT");
    expect(task.priority).toBe("high");
    expect(task.status).toBe("todo");

    expect(task.id).toBeDefined();
    expect(task.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    expect(task.createdAt).toBeDefined();
    expect(new Date(task.createdAt).getTime()).not.toBeNaN();
  });

  it("addTask: múltiples tareas se agregan sin sobrescribirse", () => {
    const { addTask } = useTaskStore.getState();

    addTask({ title: "Tarea A", description: "", priority: "low",  status: "todo" });
    addTask({ title: "Tarea B", description: "", priority: "high", status: "done" });

    const { tasks } = useTaskStore.getState();
    expect(tasks).toHaveLength(2);
    expect(tasks[0].title).toBe("Tarea A");
    expect(tasks[1].title).toBe("Tarea B");
  });

  it("TEST 2 — moveTask: cambia el status de todo a in-progress", () => {
    const { addTask, moveTask } = useTaskStore.getState();

    addTask({ title: "Tarea movible", description: "", priority: "medium", status: "todo" });
    const taskId = useTaskStore.getState().tasks[0].id;

    moveTask(taskId, "in-progress");

    const updatedTask = useTaskStore.getState().tasks[0];
    expect(updatedTask.status).toBe("in-progress");
  });

  it("moveTask: solo cambia la tarea indicada, el resto no se modifica", () => {
    const { addTask, moveTask } = useTaskStore.getState();

    addTask({ title: "Tarea 1", description: "", priority: "low",  status: "todo" });
    addTask({ title: "Tarea 2", description: "", priority: "high", status: "todo" });

    const id1 = useTaskStore.getState().tasks[0].id;
    moveTask(id1, "done");

    const [task1, task2] = useTaskStore.getState().tasks;
    expect(task1.status).toBe("done");
    expect(task2.status).toBe("todo");
  });

  it("deleteTask: elimina la tarea correcta por id", () => {
    const { addTask, deleteTask } = useTaskStore.getState();

    addTask({ title: "Para eliminar", description: "", priority: "low", status: "todo" });
    const id = useTaskStore.getState().tasks[0].id;

    deleteTask(id);

    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });
});
