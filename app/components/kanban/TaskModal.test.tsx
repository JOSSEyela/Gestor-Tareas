import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor }                        from "@testing-library/react";
import userEvent                                  from "@testing-library/user-event";
import { renderWithProviders }                    from "~/test/testUtils";
import { TaskModal }                              from "./TaskModal";
import { useTaskStore }                           from "~/store/taskStore";

beforeEach(() => {

  useTaskStore.setState({ tasks: [] });
  localStorage.clear();
});


describe("TaskModal — validación del formulario", () => {

  it("TEST 4 — muestra error si el título tiene menos de 3 caracteres", async () => {
    const user    = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(
      <TaskModal isOpen onClose={onClose} />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Nueva tarea")).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/título/i);
    await user.type(titleInput, "AB");
    await user.tab();

    const submitBtn = screen.getByRole("button", { name: /crear tarea/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByRole("alert")).toHaveTextContent(/al menos 3 caracteres/i);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("muestra error si el título está vacío al enviar", async () => {
    const user    = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(<TaskModal isOpen onClose={onClose} />);

    const submitBtn = screen.getByRole("button", { name: /crear tarea/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/obligatorio/i);
    });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("cierra el modal cuando el formulario es válido", async () => {
    const user    = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(<TaskModal isOpen onClose={onClose} />);

    const titleInput = screen.getByLabelText(/título/i);
    await user.type(titleInput, "Tarea de ejemplo válida");

    const submitBtn = screen.getByRole("button", { name: /crear tarea/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledOnce();
    });
  });

  it("agrega la tarea al store cuando el formulario es válido", async () => {
    const user    = userEvent.setup();
    const onClose = vi.fn();

    renderWithProviders(<TaskModal isOpen onClose={onClose} />);

    await user.type(screen.getByLabelText(/título/i), "Nueva tarea de test");
    await user.click(screen.getByRole("button", { name: /crear tarea/i }));

    await waitFor(() => {
      const tasks = useTaskStore.getState().tasks;
      expect(tasks).toHaveLength(1);
      expect(tasks[0].title).toBe("Nueva tarea de test");
    });
  });
});
