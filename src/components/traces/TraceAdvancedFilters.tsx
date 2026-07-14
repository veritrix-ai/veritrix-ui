import {
  DURATION_PRESETS,
  countActiveAdvancedFilters,
  type TraceAdvancedFiltersState,
  type TraceStatusFilter,
} from "@/components/traces/advanced-filters";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TraceAdvancedFiltersProps {
  open: boolean;
  filters: TraceAdvancedFiltersState;
  availableTags: string[];
  availableAgents: string[];
  onChange: (next: TraceAdvancedFiltersState) => void;
  onClear: () => void;
}

function toggleValue(values: string[], value: string): string[] {
  return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
}

export function TraceAdvancedFilters({
  open,
  filters,
  availableTags,
  availableAgents,
  onChange,
  onClear,
}: TraceAdvancedFiltersProps) {
  if (!open) return null;

  const activeCount = countActiveAdvancedFilters(filters);
  const activeDurationPreset =
    DURATION_PRESETS.find(
      (preset) =>
        preset.minDurationMs === filters.minDurationMs &&
        preset.maxDurationMs === filters.maxDurationMs,
    )?.id ?? "custom";

  return (
    <div className="space-y-4 border-b bg-muted/40 px-4 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Advanced filters</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Narrow traces by status, tags, agent, duration, and errors.
          </p>
        </div>
        {activeCount > 0 && (
          <Button type="button" variant="link" className="h-auto p-0" onClick={onClear}>
            Clear all ({activeCount})
          </Button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <FilterField label="Status">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: "all", label: "All" },
                { id: "ok", label: "OK" },
                { id: "error", label: "Error" },
              ] as const
            ).map((option) => (
              <Chip
                key={option.id}
                active={filters.status === option.id}
                onClick={() => onChange({ ...filters, status: option.id as TraceStatusFilter })}
              >
                {option.label}
              </Chip>
            ))}
          </div>
        </FilterField>

        <FilterField label="Errors">
          <div className="flex flex-wrap gap-1.5">
            <Chip
              active={filters.hasErrors === null}
              onClick={() => onChange({ ...filters, hasErrors: null })}
            >
              Any
            </Chip>
            <Chip
              active={filters.hasErrors === true}
              onClick={() => onChange({ ...filters, hasErrors: true })}
            >
              Has errors
            </Chip>
            <Chip
              active={filters.hasErrors === false}
              onClick={() => onChange({ ...filters, hasErrors: false })}
            >
              No errors
            </Chip>
          </div>
        </FilterField>

        <FilterField label="Duration">
          <div className="flex flex-wrap gap-1.5">
            {DURATION_PRESETS.map((preset) => (
              <Chip
                key={preset.id}
                active={activeDurationPreset === preset.id}
                onClick={() =>
                  onChange({
                    ...filters,
                    minDurationMs: preset.minDurationMs,
                    maxDurationMs: preset.maxDurationMs,
                  })
                }
              >
                {preset.label}
              </Chip>
            ))}
          </div>
        </FilterField>

        <FilterField label="Tags">
          {availableTags.length === 0 ? (
            <p className="text-xs text-muted-foreground">No tags available</p>
          ) : (
            <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
              {availableTags.map((tag) => (
                <Chip
                  key={tag}
                  active={filters.tags.includes(tag)}
                  onClick={() => onChange({ ...filters, tags: toggleValue(filters.tags, tag) })}
                >
                  {tag}
                </Chip>
              ))}
            </div>
          )}
        </FilterField>

        <FilterField label="Agent">
          {availableAgents.length === 0 ? (
            <p className="text-xs text-muted-foreground">No agents available</p>
          ) : (
            <div className="flex max-h-24 flex-wrap gap-1.5 overflow-y-auto">
              {availableAgents.map((agent) => (
                <Chip
                  key={agent}
                  active={filters.agents.includes(agent)}
                  onClick={() =>
                    onChange({ ...filters, agents: toggleValue(filters.agents, agent) })
                  }
                >
                  {agent}
                </Chip>
              ))}
            </div>
          )}
        </FilterField>
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-background text-muted-foreground ring-1 ring-border hover:bg-accent hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
