import { describe, it, expect } from "vitest";
import { filterTasks, sortTasks } from "./useFilteredTasks";
import { type Task } from "~/types/task";

const MOCK_TASKS: Task[] = [
  {
    id:          "t1",
    title:       "Diseñar wireframes del tablero",
    description: "Crear prototipos en Penpot.",
    status:      "todo",
    priority:    "high",
    createdAt:   "2026-01-01T10:00:00.000Z",
  },
  {
    id:          "t2",
    title:       "Escribir pruebas unitarias",
    description: "4 tests con Vitest y Testing Library.",
    status:      "todo",
    priority:    "medium",
    createdAt:   "2026-01-02T10:00:00.000Z",
  },
  {
    id:          "t3",
    title:       "Configurar Netlify CI/CD",
    description: "Conectar repo y verificar pipeline.",
    status:      "done",
    priority:    "low",
    createdAt:   "2026-01-03T10:00:00.000Z",
  },
];

describe("filterTasks", () => {

  it("TEST 3 — filtra por searchTerm en el título (case-insensitive)", () => {
    const result = filterTasks(MOCK_TASKS, "wireframes", "all");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("t1");
  });

  it("busca también dentro de la descripción", () => {
    const result = filterTasks(MOCK_TASKS, "Vitest", "all");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("t2");
  });

  it("devuelve array vacío si ninguna tarea coincide", () => {
    const result = filterTasks(MOCK_TASKS, "react native", "all");

    expect(result).toHaveLength(0);
  });

  it("sin searchTerm devuelve todas las tareas (sin filtro de texto)", () => {
    const result = filterTasks(MOCK_TASKS, "", "all");

    expect(result).toHaveLength(3);
  });

  it("filtra por prioridad cuando filterByPriority !== all", () => {
    const result = filterTasks(MOCK_TASKS, "", "high");

    expect(result).toHaveLength(1);
    expect(result[0].priority).toBe("high");
  });

  it("combina searchTerm Y prioridad con lógica AND", () => {
    const result = filterTasks(MOCK_TASKS, "pruebas", "medium");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("t2");

    const noMatch = filterTasks(MOCK_TASKS, "pruebas", "high");
    expect(noMatch).toHaveLength(0);
  });
});


describe("sortTasks", () => {
  it("date-desc: la tarea más reciente aparece primero", () => {
    const sorted = sortTasks(MOCK_TASKS, "date-desc");

    expect(sorted[0].id).toBe("t3");
    expect(sorted[2].id).toBe("t1");
  });

  it("date-asc: la tarea más antigua aparece primero", () => {
    const sorted = sortTasks(MOCK_TASKS, "date-asc");

    expect(sorted[0].id).toBe("t1");
    expect(sorted[2].id).toBe("t3");
  });

  it("priority: high antes que medium antes que low", () => {
    const sorted = sortTasks(MOCK_TASKS, "priority");

    expect(sorted[0].priority).toBe("high");
    expect(sorted[1].priority).toBe("medium");
    expect(sorted[2].priority).toBe("low");
  });
});
