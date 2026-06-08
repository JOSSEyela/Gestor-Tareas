import { Suspense } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Toaster } from "react-hot-toast";

import type { Route } from "./+types/root";
import { Navbar }         from "~/components/layout";
import { LoadingSpinner } from "~/components/ui";
import { env }            from "~/config/env";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="application-name" content={env.VITE_APP_NAME} />
        <meta name="version"          content={env.VITE_APP_VERSION} />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-slate-50 dark:bg-slate-950">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner size="lg" fullPage />}>
          <Outlet />
        </Suspense>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            fontFamily:   "Inter, ui-sans-serif, system-ui, sans-serif",
            fontSize:     "14px",
            fontWeight:   "500",
            padding:      "12px 16px",
            boxShadow:    "0 8px 32px rgba(0,0,0,0.12)",
          },
          success: {
            iconTheme: { primary: "#10b981", secondary: "#ecfdf5" },
          },
          error: {
            iconTheme: { primary: "#ef4444", secondary: "#fef2f2" },
          },
        }}
      />
    </div>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "Ocurrio un error inesperado.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "La pagina que buscas no existe."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <p className="text-7xl font-black text-slate-200 dark:text-slate-800 select-none">
          {error instanceof Error ? "500" : message}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
          {details}
        </h1>
        {stack && (
          <pre className="mt-4 max-w-2xl overflow-x-auto rounded-lg bg-slate-100 dark:bg-slate-900 p-4 text-left text-xs">
            <code>{stack}</code>
          </pre>
        )}
      </div>
    </main>
  );
}
