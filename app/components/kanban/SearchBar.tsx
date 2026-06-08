import { useFilterStore, selectHasActiveFilters } from "~/store/filterStore";
import { PRIORITY_LABELS, type Priority }         from "~/types/task";
import { type SortBy }                            from "~/store/filterStore";
import { cn }                                     from "~/lib/utils";

const PRIORITY_OPTIONS: Array<{ value: Priority | "all"; label: string }> = [
  { value: "all",    label: "Todas las prioridades" },
  { value: "high",   label: `🔴 ${PRIORITY_LABELS.high}`   },
  { value: "medium", label: `🟡 ${PRIORITY_LABELS.medium}` },
  { value: "low",    label: `⚪ ${PRIORITY_LABELS.low}`    },
];

const SORT_OPTIONS: Array<{ value: SortBy; label: string }> = [
  { value: "date-desc", label: "Más recientes" },
  { value: "date-asc",  label: "Más antiguas"  },
  { value: "priority",  label: "Por prioridad" },
];

export function SearchBar() {
  const searchTerm      = useFilterStore((s) => s.searchTerm);
  const filterByPriority = useFilterStore((s) => s.filterByPriority);
  const sortBy           = useFilterStore((s) => s.sortBy);
  const setSearchTerm    = useFilterStore((s) => s.setSearchTerm);
  const setFilterByPriority = useFilterStore((s) => s.setFilterByPriority);
  const setSortBy        = useFilterStore((s) => s.setSortBy);
  const clearFilters     = useFilterStore((s) => s.clearFilters);
  const hasActive        = useFilterStore(selectHasActiveFilters);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">

      {/* ── Input de búsqueda ── */}
      <div className="relative flex-1">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar tareas…"
          aria-label="Buscar tareas por título o descripción"
          className={cn(
            "w-full rounded-xl border border-slate-300 dark:border-slate-600",
            "bg-white dark:bg-slate-800 text-slate-900 dark:text-white",
            "pl-9 pr-3 py-2 text-sm placeholder:text-slate-400",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
            "transition-colors",
          )}
        />
      </div>

      {/* ── Selector de prioridad ── */}
      <select
        value={filterByPriority}
        onChange={(e) => setFilterByPriority(e.target.value as Priority | "all")}
        aria-label="Filtrar por prioridad"
        className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
      >
        {PRIORITY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* ── Selector de orden ── */}
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortBy)}
        aria-label="Ordenar tareas"
        className="rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* ── Botón limpiar (solo si hay filtros activos) ── */}
      {hasActive && (
        <button
          onClick={clearFilters}
          className="shrink-0 rounded-xl border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring"
          aria-label="Limpiar todos los filtros"
        >
          ✕ Limpiar
        </button>
      )}
    </div>
  );
}
