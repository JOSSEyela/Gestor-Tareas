import { create } from "zustand";
import { type Priority } from "~/types/task";


export type SortBy = "date-desc" | "date-asc" | "priority";

interface FilterState {
  searchTerm:       string;
  filterByPriority: Priority | "all";
  sortBy:           SortBy;
}

interface FilterActions {
  setSearchTerm:       (term: string)              => void;
  setFilterByPriority: (p: Priority | "all")       => void;
  setSortBy:           (sort: SortBy)              => void;
  clearFilters:        ()                           => void;
}

export type FilterStore = FilterState & FilterActions;


const DEFAULT_STATE: FilterState = {
  searchTerm:       "",
  filterByPriority: "all",
  sortBy:           "date-desc",
};


export const useFilterStore = create<FilterStore>()((set) => ({
  ...DEFAULT_STATE,

  setSearchTerm:       (term)     => set({ searchTerm: term }),
  setFilterByPriority: (priority) => set({ filterByPriority: priority }),
  setSortBy:           (sort)     => set({ sortBy: sort }),
  clearFilters:        ()         => set({ ...DEFAULT_STATE }),
}));

export const selectHasActiveFilters = (state: FilterStore) =>
  state.searchTerm       !== DEFAULT_STATE.searchTerm       ||
  state.filterByPriority !== DEFAULT_STATE.filterByPriority ||
  state.sortBy           !== DEFAULT_STATE.sortBy;
