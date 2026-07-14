import type { Span, SpanType, TraceDetailMeta } from "@/lib/types";

export interface SpanTreeNode {
  span: Span;
  offsetMs: number;
  children: SpanTreeNode[];
}

export interface WaterfallRow {
  span: Span;
  depth: number;
  offsetMs: number;
  label: string;
}

export const SPAN_TYPE_COLORS: Record<
  SpanType,
  { dot: string; bar: string; label: string }
> = {
  agent: { dot: "bg-violet-500", bar: "bg-violet-400", label: "Agent" },
  llm: { dot: "bg-sky-400", bar: "bg-sky-300", label: "Llm" },
  tool: { dot: "bg-amber-400", bar: "bg-amber-300", label: "Tool" },
  delegation: { dot: "bg-emerald-400", bar: "bg-emerald-300", label: "Delegation" },
  other: { dot: "bg-slate-500", bar: "bg-slate-400", label: "Other" },
};

export const WATERFALL_LEGEND: Array<{ type: SpanType; label: string; dot: string }> = [
  { type: "agent", label: "Agent", dot: "bg-violet-500" },
  { type: "llm", label: "Llm", dot: "bg-sky-400" },
  { type: "tool", label: "Tool", dot: "bg-amber-400" },
  { type: "other", label: "Other", dot: "bg-slate-500" },
];

export function getSpanDisplayName(span: Span): string {
  const spanName =
    span.attributes["agentops.span_name"] ?? span.attributes.span_name;
  if (typeof spanName === "string" && spanName.trim()) return spanName;

  if (span.span_type === "llm") {
    const snippet = span.output_preview || span.input_preview;
    if (snippet) {
      const cleaned = snippet.replace(/\s+/g, " ").trim();
      if (cleaned.length > 48) return `${cleaned.slice(0, 48)}…`;
      return cleaned;
    }
  }

  return span.agent_name;
}

export function getSpanKind(spanType: SpanType): string {
  switch (spanType) {
    case "agent":
      return "Agent";
    case "llm":
      return "LLM";
    case "tool":
      return "Tool";
    case "delegation":
      return "Delegation";
    default:
      return "Internal";
  }
}

export function getSpanTypeBadge(spanType: SpanType): { label: string; className: string } {
  switch (spanType) {
    case "agent":
      return { label: "Agent", className: "bg-violet-100 text-violet-700" };
    case "tool":
      return { label: "Tool", className: "bg-amber-100 text-amber-800" };
    case "llm":
      return { label: "LLM", className: "bg-sky-100 text-sky-700" };
    case "delegation":
      return { label: "Delegation", className: "bg-emerald-100 text-emerald-700" };
    case "other":
      return { label: "Other", className: "bg-slate-100 text-slate-600" };
    default:
      return { label: "Span", className: "bg-slate-100 text-slate-600" };
  }
}

export function formatTimelineSeconds(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatDurationMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.round((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

export function buildSpanTree(spans: Span[]): SpanTreeNode[] {
  if (spans.length === 0) return [];

  const traceStart = Math.min(...spans.map((span) => new Date(span.start_time).getTime()));
  const childrenByParent = new Map<string | null, Span[]>();

  for (const span of spans) {
    const parentId = span.parent_span_id;
    const siblings = childrenByParent.get(parentId) ?? [];
    siblings.push(span);
    childrenByParent.set(parentId, siblings);
  }

  for (const siblings of childrenByParent.values()) {
    siblings.sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
    );
  }

  const buildNodes = (parentId: string | null): SpanTreeNode[] => {
    const children = childrenByParent.get(parentId) ?? [];
    return children.map((item) => ({
      span: item,
      offsetMs: new Date(item.start_time).getTime() - traceStart,
      children: buildNodes(item.span_id),
    }));
  };

  return buildNodes(null);
}

export function collectExpandableSpanIds(nodes: SpanTreeNode[]): string[] {
  const ids: string[] = [];
  const walk = (items: SpanTreeNode[]) => {
    for (const node of items) {
      if (node.children.length > 0) ids.push(node.span.span_id);
      walk(node.children);
    }
  };
  walk(nodes);
  return ids;
}

export function collectSpanIds(nodes: SpanTreeNode[]): string[] {
  const ids: string[] = [];
  const walk = (items: SpanTreeNode[]) => {
    for (const node of items) {
      ids.push(node.span.span_id);
      walk(node.children);
    }
  };
  walk(nodes);
  return ids;
}

export function buildWaterfallRows(spans: Span[]): WaterfallRow[] {
  const tree = buildSpanTree(spans);
  const rows: WaterfallRow[] = [];

  const walk = (nodes: SpanTreeNode[], depth: number) => {
    for (const node of nodes) {
      rows.push({
        span: node.span,
        depth,
        offsetMs: node.offsetMs,
        label: getSpanDisplayName(node.span),
      });
      walk(node.children, depth + 1);
    }
  };

  walk(tree, 0);
  return rows;
}

export function getTraceDurationMs(spans: Span[]): number {
  if (spans.length === 0) return 1;
  const start = Math.min(...spans.map((span) => new Date(span.start_time).getTime()));
  const end = Math.max(...spans.map((span) => new Date(span.end_time).getTime()));
  return Math.max(end - start, 1);
}

export function deriveTraceMeta(spans: Span[]): TraceDetailMeta {
  if (spans.length === 0) {
    return {
      name: "Trace",
      duration_ms: 0,
      llm_calls: 0,
      tool_calls: 0,
      errors: 0,
      total_tokens: 0,
      tags: [],
      start_time: new Date().toISOString(),
    };
  }

  const start = Math.min(...spans.map((span) => new Date(span.start_time).getTime()));
  const end = Math.max(...spans.map((span) => new Date(span.end_time).getTime()));
  const root = spans.find((span) => span.parent_span_id === null) ?? spans[0];
  const model = spans.find((span) => span.model)?.model ?? undefined;

  return {
    name: root.agent_name,
    model,
    duration_ms: Math.max(end - start, 0),
    llm_calls: spans.filter((span) => span.span_type === "llm").length,
    tool_calls: spans.filter((span) => span.span_type === "tool").length,
    errors: spans.filter((span) => span.status === "error").length,
    total_tokens: spans.reduce((sum, span) => sum + (span.total_tokens ?? 0), 0),
    tags: [],
    start_time: new Date(start).toISOString(),
  };
}
