
import { describe, it, expect } from "vitest";

describe("Entorno de testing", () => {
  it("jsdom está disponible (document existe)", () => {
    expect(document).toBeDefined();
    expect(document.createElement("div")).toBeInstanceOf(HTMLDivElement);
  });

  it("crypto.randomUUID genera IDs únicos", () => {
    const id1 = crypto.randomUUID();
    const id2 = crypto.randomUUID();
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("localStorage está disponible en jsdom", () => {
    localStorage.setItem("test-key", "test-value");
    expect(localStorage.getItem("test-key")).toBe("test-value");
    localStorage.removeItem("test-key");
  });
});
