import { endOfDay, isWithinInterval, startOfDay, subDays } from "date-fns";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Check, ChevronDown, RefreshCw } from "lucide-react";

import {
  DEFAULT_ADVANCED_FILTERS,
  hasActiveAdvancedFilters,
  type TraceAdvancedFiltersState,
} from "@/components/traces/advanced-filters";
import { TraceAdvancedFilters } from "@/components/traces/TraceAdvancedFilters";
import { TraceEmptyState } from "@/components/traces/TraceEmptyState";
import { TraceListTable } from "@/components/traces/TraceListTable";
import { TraceListToolbar } from "@/components/traces/TraceListToolbar";
import { TraceMetricsSection } from "@/components/traces/TraceMetricsSection";
import { TracesPageSkeleton } from "@/components/traces/TracesPageSkeleton";
import { BackendUnavailable } from "@/components/dashboard/BackendUnavailable";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTraces } from "@/lib/api";
import { isBackendUnavailable } from "@/lib/backend-errors";
import type { TraceMetrics, TraceSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

type DatePreset = "7d" | "30d" | "all";

const DATE_PRESETS: Array<{ id: DatePreset; label: string }> = [
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "all", label: "All time" },
];

function matchesAdvancedFilters(
  trace: TraceSummary,
  filters: TraceAdvancedFiltersState,
): boolean {
  if (filters.status !== "all" && trace.status !== filters.status) return false;

  if (filters.tags.length > 0) {
    const tags = trace.tags ?? [];
    if (!filters.tags.every((tag) => tags.includes(tag))) return false;
  }

  if (filters.agents.length > 0) {
    const agentName = trace.name ?? trace.agent_name;
    if (!filters.agents.includes(agentName)) return false;
  }

  if (filters.minDurationMs != null && trace.duration_ms < filters.minDurationMs) return false;
  if (filters.maxDurationMs != null && trace.duration_ms > filters.maxDurationMs) return false;

  const errorCount = trace.error_count ?? (trace.status === "error" ? 1 : 0);
  if (filters.hasErrors === true && errorCount <= 0) return false;
  if (filters.hasErrors === false && errorCount > 0) return false;

  return true;
}

export function TracesPage() {
  const workspace = useWorkspace();
  const [traces, setTraces] = useState<TraceSummary[]>([]);
  const [metrics, setMetrics] = useState<TraceMetrics>({
    total_cost_usd: 0,
    tokens_generated: 0,
    fail_rate: null,
    total_events: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [datePreset, setDatePreset] = useState<DatePreset>("30d");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] =
    useState<TraceAdvancedFiltersState>(DEFAULT_ADVANCED_FILTERS);

  const selectedPreset =
    DATE_PRESETS.find((preset) => preset.id === datePreset) ?? DATE_PRESETS[1];

  const load = async () => {
    if (!workspace.org_id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getTraces({ orgId: workspace.org_id, limit: 100 });
      setTraces(result.traces);
      if (result.metrics) setMetrics(result.metrics);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace.org_id]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    for (const trace of traces) {
      for (const tag of trace.tags ?? []) tags.add(tag);
    }
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [traces]);

  const availableAgents = useMemo(() => {
    const agents = new Set(traces.map((trace) => trace.name ?? trace.agent_name));
    return Array.from(agents).sort((a, b) => a.localeCompare(b));
  }, [traces]);

  const dateFilteredTraces = useMemo(() => {
    if (datePreset === "all") return traces;
    const days = datePreset === "7d" ? 7 : 30;
    const now = new Date();
    return traces.filter((trace) =>
      isWithinInterval(new Date(trace.start_time), {
        start: startOfDay(subDays(now, days)),
        end: endOfDay(now),
      }),
    );
  }, [datePreset, traces]);

  const filteredTraces = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return dateFilteredTraces.filter((trace) => {
      if (!matchesAdvancedFilters(trace, advancedFilters)) return false;
      if (!normalized) return true;
      const haystack = [
        trace.name ?? trace.agent_name,
        trace.run_id,
        trace.trace_id,
        ...(trace.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [advancedFilters, dateFilteredTraces, query]);

  const totalPages = Math.max(1, Math.ceil(filteredTraces.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedTraces = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredTraces.slice(start, start + perPage);
  }, [currentPage, filteredTraces, perPage]);

  const hasFilter =
    query.length > 0 ||
    datePreset !== "all" ||
    hasActiveAdvancedFilters(advancedFilters);

  if (loading) {
    return <TracesPageSkeleton />;
  }

  if (error) {
    return (
      <div className="px-10 py-8">
        <BackendUnavailable
          onRetry={() => void load()}
          title={isBackendUnavailable(error) ? undefined : "Failed to load traces"}
          message={error instanceof Error ? error.message : undefined}
        />
      </div>
    );
  }

  return (
    <div className="px-10 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[2rem] font-semibold tracking-tight text-foreground">Traces</h1>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Refresh traces"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => void load()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="h-8 font-normal">
                {selectedPreset.label}
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[10.5rem]">
              {DATE_PRESETS.map((preset) => (
                <DropdownMenuItem
                  key={preset.id}
                  onSelect={() => {
                    setDatePreset(preset.id);
                    setPage(1);
                  }}
                  className="justify-between gap-4"
                >
                  {preset.label}
                  <Check
                    className={cn(
                      "h-3.5 w-3.5",
                      datePreset === preset.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button type="button" variant="outline" size="sm" className="h-8 font-normal">
            Default Project
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <TraceMetricsSection metrics={metrics} className="mt-8" />

      <Card className="mt-8 overflow-hidden shadow-sm">
        <TraceListToolbar
          query={query}
          onQueryChange={(value) => {
            setQuery(value);
            setPage(1);
          }}
          advancedOpen={advancedOpen}
          onToggleAdvanced={() => setAdvancedOpen((current) => !current)}
          advancedFilters={advancedFilters}
          onClearAdvanced={() => {
            setAdvancedFilters(DEFAULT_ADVANCED_FILTERS);
            setPage(1);
          }}
        />

        <TraceAdvancedFilters
          open={advancedOpen}
          filters={advancedFilters}
          availableTags={availableTags}
          availableAgents={availableAgents}
          onChange={(next) => {
            setAdvancedFilters(next);
            setPage(1);
          }}
          onClear={() => {
            setAdvancedFilters(DEFAULT_ADVANCED_FILTERS);
            setPage(1);
          }}
        />

        {filteredTraces.length === 0 ? (
          <TraceEmptyState hasFilter={hasFilter} />
        ) : (
          <TraceListTable traces={paginatedTraces} />
        )}

        <div className="flex flex-wrap items-center justify-end gap-4 border-t px-4 py-3 text-sm text-muted-foreground">
          <label className="flex items-center gap-2">
            Per page
            <select
              value={String(perPage)}
              onChange={(event) => {
                setPerPage(Number(event.target.value));
                setPage(1);
              }}
              className="h-8 rounded-md border bg-muted px-2 text-sm text-foreground"
            >
              {[10, 20, 50].map((value) => (
                <option key={value} value={String(value)}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <span>
            Page {currentPage} / {totalPages}
          </span>

          <div className="flex items-center gap-1">
            <PaginationButton
              label="First page"
              disabled={currentPage === 1}
              onClick={() => setPage(1)}
            >
              «
            </PaginationButton>
            <PaginationButton
              label="Previous page"
              disabled={currentPage === 1}
              onClick={() => setPage((value) => value - 1)}
            >
              ‹
            </PaginationButton>
            <PaginationButton
              label="Next page"
              disabled={currentPage === totalPages}
              onClick={() => setPage((value) => value + 1)}
            >
              ›
            </PaginationButton>
            <PaginationButton
              label="Last page"
              disabled={currentPage === totalPages}
              onClick={() => setPage(totalPages)}
            >
              »
            </PaginationButton>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PaginationButton({
  children,
  disabled,
  onClick,
  label,
}: {
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="h-8 w-8 text-muted-foreground"
    >
      {children}
    </Button>
  );
}
