import { useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

import { SpanDetailPanel } from "@/components/trace-detail/SpanDetailPanel";
import { WaterfallChart } from "@/components/trace-detail/WaterfallChart";
import { buildWaterfallRows, getTraceDurationMs } from "@/components/trace-detail/utils";
import type { Span } from "@/lib/types";
import { cn } from "@/lib/utils";

interface WaterfallViewProps {
  spans: Span[];
  selectedSpanId: string | null;
  onSelectSpan: (spanId: string) => void;
}

export function WaterfallView({ spans, selectedSpanId, onSelectSpan }: WaterfallViewProps) {
  const [showBarText, setShowBarText] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [panelWidth, setPanelWidth] = useState(420);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const rows = useMemo(() => buildWaterfallRows(spans), [spans]);
  const totalDurationMs = useMemo(() => getTraceDurationMs(spans), [spans]);
  const selectedSpan = spans.find((span) => span.span_id === selectedSpanId) ?? null;

  const onResizeStart = (event: ReactMouseEvent) => {
    event.preventDefault();
    dragRef.current = { startX: event.clientX, startWidth: panelWidth };

    const onMove = (moveEvent: MouseEvent) => {
      if (!dragRef.current) return;
      const delta = dragRef.current.startX - moveEvent.clientX;
      const next = Math.min(560, Math.max(320, dragRef.current.startWidth + delta));
      setPanelWidth(next);
    };

    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className="mt-6 flex items-start overflow-hidden rounded-xl border-0 bg-card shadow-sm">
      <div className="relative min-w-0 flex-1 self-stretch bg-muted/20 pb-16">
        <WaterfallChart
          rows={rows}
          totalDurationMs={totalDurationMs}
          selectedSpanId={selectedSpanId}
          showBarText={showBarText}
          showTooltip={showTooltip}
          onSelectSpan={onSelectSpan}
        />

        <div className="absolute bottom-3 left-4 z-20 rounded-xl border-0 bg-card px-3.5 py-2.5 shadow-md">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={showBarText}
              onChange={(event) => setShowBarText(event.target.checked)}
              className="h-3.5 w-3.5 rounded border-border accent-foreground"
            />
            Show Bar Text
          </label>
          <label className="mt-2 flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={showTooltip}
              onChange={(event) => setShowTooltip(event.target.checked)}
              className="h-3.5 w-3.5 rounded border-border accent-foreground"
            />
            Show tooltip
          </label>
        </div>
      </div>

      <div
        className="relative min-h-[420px] shrink-0 self-stretch border-0 bg-card"
        style={{ width: panelWidth }}
      >
        <button
          type="button"
          aria-label="Resize detail panel"
          onMouseDown={onResizeStart}
          className={cn(
            "absolute top-1/2 left-0 z-20 flex h-10 w-4 -translate-x-1/2 -translate-y-1/2",
            "cursor-col-resize items-center justify-center rounded-md border-0 bg-card shadow-sm",
            "hover:bg-muted",
          )}
        >
          <span className="flex flex-col gap-0.5">
            <span className="h-0.5 w-2.5 rounded-full bg-muted-foreground/70" />
            <span className="h-0.5 w-2.5 rounded-full bg-muted-foreground/70" />
            <span className="h-0.5 w-2.5 rounded-full bg-muted-foreground/70" />
          </span>
        </button>
        <div className="h-full max-h-[min(720px,75vh)] overflow-y-auto">
          <SpanDetailPanel span={selectedSpan} />
        </div>
      </div>
    </div>
  );
}
