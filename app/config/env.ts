/**
 * Validación de variables de entorno con Zod.
 *
 * En Vite, solo las variables con prefijo VITE_ son accesibles en el cliente.
 * Este módulo valida que tengan el formato correcto al arrancar la app.
 *
 * Uso: import { env } from "~/config/env"
 *      env.VITE_APP_NAME  // string tipado y validado
 */
import { z } from "zod";

// ─── Schema ──────────────────────────────────────────────────────────────────

const envSchema = z.object({
  /** Nombre de la app mostrado en la pestaña del navegador */
  VITE_APP_NAME: z
    .string()
    .min(1, "VITE_APP_NAME no puede estar vacío")
    .default("Gestor de Tareas"),

  /** Versión semántica — formato x.y.z */
  VITE_APP_VERSION: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, "VITE_APP_VERSION debe tener formato x.y.z (ej. 1.0.0)")
    .default("1.0.0"),

  /** Modo de Vite: development | production | test */
  MODE: z.enum(["development", "production", "test"]),
});

export type Env = z.infer<typeof envSchema>;

// ─── Validación ───────────────────────────────────────────────────────────────

function parseEnv(): Env {
  const result = envSchema.safeParse({
    VITE_APP_NAME:    import.meta.env.VITE_APP_NAME,
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
    MODE:             import.meta.env.MODE,
  });

  if (!result.success) {
    // Formatea los errores de forma legible para el desarrollador
    const issues = result.error.issues
      .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    const message = `[env] Variables de entorno inválidas:\n${issues}\n\nCopia .env.example a .env.local y completa los valores.`;

    // En desarrollo lanza error claro; en producción solo registra
    if (import.meta.env.DEV) {
      throw new Error(message);
    } else {
      console.error(message);
    }
  }

  // Si hay error en producción, usamos los defaults del schema
  return (result.success ? result.data : envSchema.parse({})) as Env;
}

// ─── Exportación ──────────────────────────────────────────────────────────────

/**
 * Variables de entorno validadas y tipadas.
 * Se ejecuta una sola vez al importar el módulo.
 */
export const env = parseEnv();
