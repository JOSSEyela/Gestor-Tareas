import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    // Garantiza una única instancia de React — evita "Invalid hook call"
    // cuando librerías (zustand, dnd-kit, etc.) traen su propia copia
    dedupe: ["react", "react-dom", "react-router"],
    tsconfigPaths: true,
  },
  optimizeDeps: {
    include: ["react", "react-dom"],
  },
  server: {
    port: 5174,
    strictPort: true,
  },
});
