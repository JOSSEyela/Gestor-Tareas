import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  test: {
    environment:  "jsdom",
    globals:      true,
    setupFiles:   ["./app/test/setup.ts"],
    include:      ["app/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include:  ["app/**/*.{ts,tsx}"],
      exclude:  ["app/**/*.test.{ts,tsx}", "app/test/**"],
    },
  },
});
