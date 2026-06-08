import { useState } from "react";
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

function useActiveFilterCount() {
  const filterByPriority = useFilterStore((s) => s.filterByPriority);
  const sortBy           = useFilterStore((s) => s.sortBy);
  return (filterByPriority !== "all" ? 1 : 0) + (sortBy !== "date-desc" ? 1 : 0);
}

export function SearchBar() {
  const searchTerm       = useFilterStore((s) => s.searchTerm);
  const filterByPriority = useFilterStore((s) => s.filterByPriority);
  const sortBy           = useFilterStore((s) => s.sortBy);
  const setSearchTerm    = useFilterStore((s) => s.setSearchTerm);
  const setFilterByPriority = useFilterStore((s) => s.setFilterByPriority);
  const setSortBy        = useFilterStore((s) => s.setSortBy);
  const clearFilters     = useFilterStore((s) => s.clearFilters);
  const hasActive        = useFilterStore(selectHasActiveFilters);
  const activeCount      = useActiveFilterCount();

  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">

        <div className="relative flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

        <button
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
          aria-label="Mostrar u ocultar filtros"
          className={cn(
            "lg:hidden flex items-center gap-1.5 shrink-0 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
            filtersOpen || activeCount > 0
              ? "border-indigo-400 bg-indigo-50 text-indigo-700 dark:border-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300"
              : "border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300",
          )}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 4a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm4 4a1 1 0 011-1h2a1 1 0 010 2h-2a1 1 0 01-1-1z" />
          </svg>
          Filtros
          {activeCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </button>

        {hasActive && (
          <button
            onClick={clearFilters}
            className="shrink-0 rounded-xl border border-red-300 dark:border-red-700 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors focus-ring"
            aria-label="Limpiar todos los filtros"
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      <div
        className={cn(
          "grid grid-cols-2 gap-2 overflow-hidden transition-all duration-200",
          "lg:flex lg:flex-row lg:max-h-none lg:opacity-100",
          filtersOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0 lg:opacity-100",
        )}
        aria-hidden={!filtersOpen}
      >
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
      </div>
    </div>
  );
}
