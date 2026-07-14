import { ModelBrandIcon } from "@/components/trace-detail/ModelBrandIcon";
import { formatDurationMs } from "@/components/trace-detail/utils";
import { Badge } from "@/components/ui/badge";
import { formatTraceCost } from "@/lib/format";
import type { TraceDetailMeta } from "@/lib/types";

interface TraceMetadataBarProps {
  meta: TraceDetailMeta;
}

export function TraceMetadataBar({ meta }: TraceMetadataBarProps) {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm">
        {meta.model && (
          <span className="inline-flex items-center gap-2 rounded-lg border-0 bg-muted/60 px-2.5 py-1.5 font-medium text-foreground">
            <ModelBrandIcon model={meta.model} size={18} />
            <span className="max-w-[280px] truncate">{meta.model}</span>
          </span>
        )}

        {meta.version && (
          <span className="text-muted-foreground">
            Version{" "}
            <strong className="font-semibold text-foreground">{meta.version}</strong>
          </span>
        )}

        <span className="inline-flex items-center gap-3 rounded-full border-0 bg-muted/40 px-3 py-1.5 text-muted-foreground">
          <span>
            Duration:{" "}
            <strong className="font-semibold text-foreground">
              {formatDurationMs(meta.duration_ms)}
            </strong>
          </span>
          <span className="text-border">|</span>
          <span>
            Total Cost:{" "}
            <strong className="font-semibold text-foreground">
              {meta.total_cost_usd == null ? "N/A" : formatTraceCost(meta.total_cost_usd)}
            </strong>
          </span>
        </span>

        <div className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2 text-muted-foreground">
          <span>
            LLM Calls: <strong className="font-semibold text-foreground">{meta.llm_calls}</strong>
          </span>
          <span>
            Tool Calls: <strong className="font-semibold text-foreground">{meta.tool_calls}</strong>
          </span>
          <span>
            Errors: <strong className="font-semibold text-foreground">{meta.errors}</strong>
          </span>
          <span>
            Total Tokens:{" "}
            <strong className="font-semibold text-foreground">
              {meta.total_tokens.toLocaleString()}
            </strong>
          </span>
        </div>
      </div>

      {meta.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {meta.tags.map((tag) => (
            <Badge key={tag} variant="muted">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
