import { Filter, SlidersHorizontal } from "lucide-react";

import {
  countActiveAdvancedFilters,
  type TraceAdvancedFiltersState,
} from "@/components/traces/advanced-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TraceListToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  advancedOpen: boolean;
  onToggleAdvanced: () => void;
  advancedFilters: TraceAdvancedFiltersState;
  onClearAdvanced: () => void;
}

export function TraceListToolbar({
  query,
  onQueryChange,
  advancedOpen,
  onToggleAdvanced,
  advancedFilters,
  onClearAdvanced,
}: TraceListToolbarProps) {
  const activeCount = countActiveAdvancedFilters(advancedFilters);

  return (
    <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3">
      <div className="relative min-w-[220px] flex-1">
        <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Filter by name, ID, or tag"
          className="bg-muted pl-9"
        />
      </div>

      <Button
        type="button"
        variant={advancedOpen || activeCount > 0 ? "secondary" : "outline"}
        onClick={onToggleAdvanced}
        aria-expanded={advancedOpen}
      >
        <SlidersHorizontal className="h-4 w-4" />
        Advanced
        {activeCount > 0 && (
          <Badge className="ml-0.5 h-5 min-w-5 justify-center px-1.5 py-0 text-[10px]">
            {activeCount}
          </Badge>
        )}
      </Button>

      {activeCount > 0 && (
        <Button type="button" variant="ghost" onClick={onClearAdvanced}>
          Clear filters
        </Button>
      )}
    </div>
  );
}
