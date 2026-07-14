import { Link } from "react-router-dom";
import { ArrowLeft, Bookmark, Download, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatTraceTimestamp } from "@/lib/format";
import type { TraceDetailMeta } from "@/lib/types";

interface TraceDetailHeaderProps {
  meta: TraceDetailMeta;
  traceId: string;
  runId: string;
  onExport?: () => void;
}

export function TraceDetailHeader({
  meta,
  traceId,
  runId,
  onExport,
}: TraceDetailHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="h-8 w-8" aria-label="Back to traces">
            <Link to="/traces">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold capitalize tracking-tight text-foreground">
            {meta.name}
          </h1>
        </div>
        <p className="mt-2 truncate text-sm text-muted-foreground">
          {runId || traceId} · {formatTraceTimestamp(meta.start_time)}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="icon" className="h-9 w-9" aria-label="Bookmark">
          <Bookmark className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" size="icon" className="h-9 w-9" aria-label="Refresh">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button type="button" variant="outline" onClick={onExport}>
          <Download className="h-4 w-4" />
          Export Trace
        </Button>
      </div>
    </div>
  );
}
