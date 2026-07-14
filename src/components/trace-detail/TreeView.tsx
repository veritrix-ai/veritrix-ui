import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { SpanDetailPanel } from "@/components/trace-detail/SpanDetailPanel";
import {
  buildSpanTree,
  collectExpandableSpanIds,
  collectSpanIds,
  formatDurationMs,
  getSpanDisplayName,
  getSpanTypeBadge,
  type SpanTreeNode,
} from "@/components/trace-detail/utils";
import { Button } from "@/components/ui/button";
import type { Span } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TreeViewProps {
  spans: Span[];
  selectedSpanId: string | null;
  onSelectSpan: (spanId: string) => void;
}

export function TreeView({ spans, selectedSpanId, onSelectSpan }: TreeViewProps) {
  const tree = useMemo(() => buildSpanTree(spans), [spans]);
  const allExpandableIds = useMemo(() => collectExpandableSpanIds(tree), [tree]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(collectSpanIds(tree)),
  );

  const selectedSpan = spans.find((span) => span.span_id === selectedSpanId) ?? null;

  const toggleExpanded = (spanId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(spanId)) next.delete(spanId);
      else next.add(spanId);
      return next;
    });
  };

  return (
    <div className="mt-6 flex items-start overflow-hidden rounded-xl border-0 bg-card shadow-sm">
      <div className="min-w-0 flex-1 self-stretch border-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Trace Tree View</h2>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setExpandedIds(new Set(allExpandableIds))}
            >
              Expand All
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setExpandedIds(new Set())}
            >
              Collapse All
            </Button>
          </div>
        </div>

        <div className="max-h-[min(480px,55vh)] overflow-y-auto p-2">
          {tree.map((node) => (
            <TreeNodeRow
              key={node.span.span_id}
              node={node}
              depth={0}
              expandedIds={expandedIds}
              selectedSpanId={selectedSpanId}
              onToggleExpanded={toggleExpanded}
              onSelectSpan={onSelectSpan}
            />
          ))}
        </div>
      </div>

      <div className="w-[420px] shrink-0 overflow-y-auto xl:w-[460px]">
        <SpanDetailPanel
          span={selectedSpan}
          emptyMessage="Select a span from the tree to inspect details."
        />
      </div>
    </div>
  );
}

function TreeNodeRow({
  node,
  depth,
  expandedIds,
  selectedSpanId,
  onToggleExpanded,
  onSelectSpan,
}: {
  node: SpanTreeNode;
  depth: number;
  expandedIds: Set<string>;
  selectedSpanId: string | null;
  onToggleExpanded: (spanId: string) => void;
  onSelectSpan: (spanId: string) => void;
}) {
  const hasChildren = node.children.length > 0;
  const expanded = expandedIds.has(node.span.span_id);
  const selected = node.span.span_id === selectedSpanId;
  const badge = getSpanTypeBadge(node.span.span_type);

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors",
          selected ? "bg-secondary" : "hover:bg-muted/60",
        )}
        style={{ paddingLeft: 8 + depth * 16 }}
      >
        {hasChildren ? (
          <button
            type="button"
            className="rounded p-0.5 text-muted-foreground hover:bg-muted"
            onClick={() => onToggleExpanded(node.span.span_id)}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <span className="w-5" />
        )}

        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          onClick={() => onSelectSpan(node.span.span_id)}
        >
          <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold", badge.className)}>
            {badge.label}
          </span>
          <span className="truncate font-medium text-foreground">
            {getSpanDisplayName(node.span)}
          </span>
          <span className="ml-auto shrink-0 text-xs text-muted-foreground">
            {formatDurationMs(node.span.duration_ms)}
          </span>
        </button>
      </div>

      {hasChildren &&
        expanded &&
        node.children.map((child) => (
          <TreeNodeRow
            key={child.span.span_id}
            node={child}
            depth={depth + 1}
            expandedIds={expandedIds}
            selectedSpanId={selectedSpanId}
            onToggleExpanded={onToggleExpanded}
            onSelectSpan={onSelectSpan}
          />
        ))}
    </div>
  );
}
