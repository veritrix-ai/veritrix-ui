import { Link } from "react-router-dom";
import { ArrowDownUp, Bookmark } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatTraceCost,
  formatTraceDuration,
  formatTraceTimestamp,
} from "@/lib/format";
import type { TraceSummary } from "@/lib/types";

interface TraceListTableProps {
  traces: TraceSummary[];
}

const COLUMNS = [
  "Name",
  "Timestamp",
  "Tags",
  "Status",
  "Duration",
  "Cost",
  "# of Spans",
  "Errors",
] as const;

export function TraceListTable({ traces }: TraceListTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[1100px]">
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {COLUMNS.map((column) => (
              <TableHead key={column}>
                <span className="inline-flex items-center gap-1">
                  {column}
                  <ArrowDownUp className="h-3 w-3 opacity-50" />
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {traces.map((trace) => (
            <TraceRow key={trace.trace_id} trace={trace} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function TraceRow({ trace }: { trace: TraceSummary }) {
  const displayName = trace.name ?? trace.agent_name;
  const durationRatio = Math.min(trace.duration_ms / 120000, 1);

  return (
    <TableRow>
      <TableCell>
        <Link to={`/traces/${trace.trace_id}`} className="flex min-w-[220px] items-start gap-3">
          <Bookmark className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/40" />
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {displayName.slice(0, 2).toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block font-semibold text-foreground">{displayName}</span>
            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
              {trace.run_id}
            </span>
          </span>
        </Link>
      </TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {formatTraceTimestamp(trace.start_time)}
      </TableCell>
      <TableCell>
        <div className="flex max-w-[180px] flex-col gap-1">
          {(trace.tags ?? []).map((tag) => (
            <Badge key={tag} variant="secondary" className="w-fit">
              {tag}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <span
          className={
            trace.status === "error"
              ? "font-medium uppercase text-destructive"
              : "font-medium uppercase text-emerald-600"
          }
        >
          {trace.status === "error" ? "Error" : "OK"}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex min-w-[100px] items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-amber-400"
              style={{ width: `${Math.max(durationRatio * 100, 8)}%` }}
            />
          </div>
          <span className="whitespace-nowrap text-muted-foreground">
            {formatTraceDuration(trace.duration_ms)}
          </span>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap text-muted-foreground">
        {formatTraceCost(trace.cost_usd ?? 0)}
      </TableCell>
      <TableCell className="text-muted-foreground">{trace.span_count}</TableCell>
      <TableCell className="text-muted-foreground">{trace.error_count ?? 0}</TableCell>
    </TableRow>
  );
}
