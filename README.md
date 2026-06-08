# Gestor de Tareas — MVP Kanban

Tablero Kanban interactivo con drag & drop, filtros y persistencia local.

## Stack
- **React Router v7** — framework + enrutamiento dinámico (`/task/:id`)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** — diseño mobile-first
- **Zustand** — estado global + persistencia localStorage
- **@dnd-kit** — drag & drop entre columnas
- **Vitest** + Testing Library — 21 pruebas unitarias

## Roles del equipo
| Integrante | Roles |
|---|---|
| Integrante A | DevOps & Git Flow Lead + Performance & Audit Lead |
| Integrante B | QA Engineer & Testing Lead + State & Logic Engineer |
| Integrante C | Core Frontend Developer UI/UX + Interacciones |

## Flujo de ramas
```
main        ← producción (protegida, requiere PR + aprobación de QA)
develop     ← integración continua
feature/issue-XX  ← desarrollo de cada issue
```

## Scripts
```bash
npm run dev        # servidor de desarrollo (localhost:5174)
npm run build      # build de producción → build/client/
npm run typecheck  # verificación de tipos TypeScript
npm run lint       # análisis estático ESLint
npm run test       # 21 pruebas unitarias con Vitest
```

## Despliegue continuo (Netlify)

Configurado en `netlify.toml`:

| Parámetro | Valor |
|---|---|
| Build command | `npm run build` |
| Publish directory | `build/client` |
| Node version | 20 |
| SPA redirect | `/* → /index.html 200` |

**Conectar con Netlify:**
1. Crear repositorio público en GitHub y hacer push de la rama `main`
2. En Netlify → "Add new site" → "Import an existing project" → GitHub
3. Seleccionar el repo `gestor-tareas-frontend`
4. Netlify detecta `netlify.toml` automáticamente → Deploy

**URL producción:** _(agregar URL de Netlify aquí tras el primer deploy)_

## Product Backlog
Ver [GitHub Issues](../../issues) para el listado completo de tareas.
