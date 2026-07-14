export type TraceStatusFilter = "all" | "ok" | "error";

export interface TraceAdvancedFiltersState {
  status: TraceStatusFilter;
  tags: string[];
  agents: string[];
  minDurationMs: number | null;
  maxDurationMs: number | null;
  hasErrors: boolean | null;
}

export const DEFAULT_ADVANCED_FILTERS: TraceAdvancedFiltersState = {
  status: "all",
  tags: [],
  agents: [],
  minDurationMs: null,
  maxDurationMs: null,
  hasErrors: null,
};

export const DURATION_PRESETS = [
  { id: "any", label: "Any", minDurationMs: null, maxDurationMs: null },
  { id: "lt1s", label: "< 1s", minDurationMs: null, maxDurationMs: 1000 },
  { id: "1to5s", label: "1–5s", minDurationMs: 1000, maxDurationMs: 5000 },
  { id: "5to30s", label: "5–30s", minDurationMs: 5000, maxDurationMs: 30000 },
  { id: "gt30s", label: "> 30s", minDurationMs: 30000, maxDurationMs: null },
] as const;

export function countActiveAdvancedFilters(filters: TraceAdvancedFiltersState): number {
  let count = 0;
  if (filters.status !== "all") count += 1;
  if (filters.tags.length > 0) count += 1;
  if (filters.agents.length > 0) count += 1;
  if (filters.minDurationMs != null || filters.maxDurationMs != null) count += 1;
  if (filters.hasErrors != null) count += 1;
  return count;
}

export function hasActiveAdvancedFilters(filters: TraceAdvancedFiltersState): boolean {
  return countActiveAdvancedFilters(filters) > 0;
}
