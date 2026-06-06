# Gestor de Tareas — MVP Kanban

Tablero Kanban interactivo con drag & drop, filtros y persistencia local.

## Stack
- **React Router v7** — framework + enrutamiento dinámico (`/task/:id`)
- **React 19** + **TypeScript** (strict)
- **Tailwind CSS v4** — diseño mobile-first
- **Zustand** — estado global + persistencia localStorage
- **@dnd-kit** — drag & drop entre columnas
- **Vitest** + Testing Library — pruebas unitarias

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
feature/issue-01  ← desarrollo de cada issue
```

## Scripts
```bash
npm run dev        # servidor de desarrollo
npm run build      # build de producción
npm run typecheck  # verificación de tipos
npm run lint       # análisis estático ESLint
npm run test       # pruebas unitarias
```

## Despliegue (Netlify)
- Build command: `npm run build`
- Publish directory: `build/client`
- URL producción: _pendiente Issue #3_

## Product Backlog
Ver [GitHub Issues](../../issues) para el listado completo de tareas.
