import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Archivos e directorios ignorados
  {
    ignores: ["build/**", ".react-router/**", "node_modules/**"],
  },

  // Configuración base para archivos TypeScript / TSX
  {
    extends: [js.configs.recommended, ...tseslint.configs.strict],
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // React Hooks — obliga el orden correcto y las dependencias completas
      ...reactHooks.configs.recommended.rules,

      // Avisa si un componente exporta algo que no sea el componente (Vite HMR)
      // allowConstantExport + react-router exports (meta, links, loader, action, headers)
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
          allowExportNames: [
            "meta",
            "links",
            "loader",
            "action",
            "headers",
            "handle",
            "shouldRevalidate",
            "ErrorBoundary",
            "Layout",
          ],
        },
      ],

      // Variables sin usar son error; prefijo _ las permite intencionalmente
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Imports de tipos deben usar "import type" para tree-shaking limpio
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // No permitir any explícito — TypeScript strict
      "@typescript-eslint/no-explicit-any": "error",

      // No usar ! non-null assertion sin necesidad
      "@typescript-eslint/no-non-null-assertion": "warn",
    },
  }
);
