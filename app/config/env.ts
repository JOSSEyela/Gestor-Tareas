import { z } from "zod";

const envSchema = z.object({
  VITE_APP_NAME: z
    .string()
    .min(1, "VITE_APP_NAME no puede estar vacío")
    .default("Gestor de Tareas"),

  VITE_APP_VERSION: z
    .string()
    .regex(/^\d+\.\d+\.\d+$/, "VITE_APP_VERSION debe tener formato x.y.z (ej. 1.0.0)")
    .default("1.0.0"),

  MODE: z.enum(["development", "production", "test"]),
});

export type Env = z.infer<typeof envSchema>;


function parseEnv(): Env {
  const result = envSchema.safeParse({
    VITE_APP_NAME:    import.meta.env.VITE_APP_NAME,
    VITE_APP_VERSION: import.meta.env.VITE_APP_VERSION,
    MODE:             import.meta.env.MODE,
  });

  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `  • ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    const message = `[env] Variables de entorno inválidas:\n${issues}\n\nCopia .env.example a .env.local y completa los valores.`;

    if (import.meta.env.DEV) {
      throw new Error(message);
    } else {
      console.error(message);
    }
  }

  return (result.success ? result.data : envSchema.parse({})) as Env;
}

export const env = parseEnv();
