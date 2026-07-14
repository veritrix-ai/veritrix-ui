import {
  SPAN_TYPE_COLORS,
  WATERFALL_LEGEND,
  formatTimelineSeconds,
} from "@/components/trace-detail/utils";
import type { WaterfallRow } from "@/components/trace-detail/utils";
import { cn } from "@/lib/utils";

interface WaterfallChartProps {
  rows: WaterfallRow[];
  totalDurationMs: number;
  selectedSpanId: string | null;
  showBarText: boolean;
  showTooltip: boolean;
  onSelectSpan: (spanId: string) => void;
}

const ROW_HEIGHT = 36;

export function WaterfallChart({
  rows,
  totalDurationMs,
  selectedSpanId,
  showBarText,
  showTooltip,
  onSelectSpan,
}: WaterfallChartProps) {
  const safeDuration = Math.max(totalDurationMs, 1);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => ({
    fraction,
    label: formatTimelineSeconds(safeDuration * fraction),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-2 border-b border-border/70 px-5 py-3">
        {WATERFALL_LEGEND.map((item) => (
          <span
            key={item.type}
            className="inline-flex items-center gap-2 rounded-full border-0 bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-sm"
          >
            <span className={cn("h-2.5 w-2.5 rounded-full", item.dot)} />
            {item.label}
          </span>
        ))}
      </div>

      <div className="max-h-[min(480px,55vh)] overflow-auto px-5 py-4">
        <div className="relative min-w-[560px]">
          <div
            className="pointer-events-none absolute inset-x-0 top-0"
            style={{ height: rows.length * ROW_HEIGHT }}
          >
            {ticks.map((tick) => (
              <div
                key={tick.fraction}
                className="absolute top-0 bottom-0 border-l border-dashed border-border/70"
                style={{ left: `${tick.fraction * 100}%` }}
              />
            ))}
          </div>

          <div className="relative" style={{ height: rows.length * ROW_HEIGHT }}>
            {rows.map((row, index) => {
              const colors = SPAN_TYPE_COLORS[row.span.span_type];
              const left = (row.offsetMs / safeDuration) * 100;
              const width = Math.max((row.span.duration_ms / safeDuration) * 100, 0.8);
              const selected = row.span.span_id === selectedSpanId;
              const label = row.label;
              const title = showTooltip
                ? `${label} · ${formatTimelineSeconds(row.span.duration_ms)}`
                : undefined;
              const labelOnLeft = left + width > 72;

              return (
                <div
                  key={row.span.span_id}
                  className="absolute inset-x-0 border-b border-dashed border-border/40"
                  style={{ top: index * ROW_HEIGHT, height: ROW_HEIGHT }}
                >
                  <button
                    type="button"
                    title={title}
                    onClick={() => onSelectSpan(row.span.span_id)}
                    className={cn(
                      "absolute top-1/2 z-10 h-5 -translate-y-1/2 rounded-md shadow-[0_1px_3px_rgba(15,23,42,0.18)] transition-all",
                      colors.bar,
                      selected
                        ? "ring-2 ring-foreground/25 ring-offset-1 ring-offset-background"
                        : "hover:brightness-95",
                      row.span.status === "error" && "ring-2 ring-destructive/50",
                    )}
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      minWidth: 10,
                    }}
                  />

                  {showBarText && (
                    <button
                      type="button"
                      title={title}
                      onClick={() => onSelectSpan(row.span.span_id)}
                      className={cn(
                        "absolute top-1/2 z-10 max-w-[200px] -translate-y-1/2 truncate text-left text-[12px] leading-none",
                        selected
                          ? "font-semibold text-foreground"
                          : "font-medium text-foreground/80 hover:text-foreground",
                        labelOnLeft ? "pr-2 text-right" : "pl-2",
                      )}
                      style={
                        labelOnLeft
                          ? { right: `calc(${100 - left}% + 4px)` }
                          : { left: `calc(${left}% + ${width}% + 2px)` }
                      }
                    >
                      {label}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="relative mt-3 h-6 border-t border-border">
            {ticks.map((tick) => (
              <span
                key={tick.fraction}
                className="absolute top-2 -translate-x-1/2 text-[11px] text-muted-foreground first:translate-x-0 last:-translate-x-full"
                style={{ left: `${tick.fraction * 100}%` }}
              >
                {tick.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
