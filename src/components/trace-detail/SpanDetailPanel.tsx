import { useState, type ReactNode } from "react";
import { Copy } from "lucide-react";

import { LlmPrettifyContent } from "@/components/trace-detail/PrettifyContent";
import { ModelBrandIcon } from "@/components/trace-detail/ModelBrandIcon";
import {
  formatDurationMs,
  getSpanKind,
  getSpanTypeBadge,
} from "@/components/trace-detail/utils";
import { Badge } from "@/components/ui/badge";
import { formatTraceCost, formatTraceTime } from "@/lib/format";
import {
  getSpanAgentName,
  getSpanDisplayName,
  getSpanTags,
  parseLlmMessages,
  parseSpanIo,
} from "@/lib/span-content";
import type { Span } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SpanDetailPanelProps {
  span: Span | null;
  emptyMessage?: string;
}

type DetailTab = "prettify" | "json";

export function SpanDetailPanel({
  span,
  emptyMessage = "Select a span to inspect details.",
}: SpanDetailPanelProps) {
  const [tab, setTab] = useState<DetailTab>("prettify");

  if (!span) {
    return (
      <div className="flex h-full min-h-[320px] items-center justify-center p-6 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const displayName = getSpanDisplayName(span);
  const agentName = getSpanAgentName(span);
  const isLlm = span.span_type === "llm";
  const jsonPayload = buildSpanJson(span, displayName, agentName);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border px-5 py-5">
        {isLlm ? (
          <LlmSpanHeader span={span} displayName={displayName} />
        ) : (
          <GenericSpanHeader
            span={span}
            displayName={displayName}
            agentName={agentName}
            tags={getSpanTags(span)}
          />
        )}
      </div>

      <div className="border-b border-border px-5">
        <div className="flex gap-6">
          <TabButton active={tab === "prettify"} onClick={() => setTab("prettify")}>
            Prettify
          </TabButton>
          <TabButton active={tab === "json"} onClick={() => setTab("json")}>
            Raw JSON
          </TabButton>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6">
        {tab === "json" ? (
          <JsonBlock payload={jsonPayload} />
        ) : isLlm ? (
          <LlmPrettifyContent span={span} messages={parseLlmMessages(span)} />
        ) : (
          <GenericPrettifyContent span={span} />
        )}
      </div>
    </div>
  );
}

function LlmSpanHeader({ span, displayName }: { span: Span; displayName: string }) {
  return (
    <>
      <h3 className="text-lg font-semibold text-foreground">{displayName}</h3>

      <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
        <DetailStat label="Time">
          {formatTraceTime(span.start_time)} - {formatTraceTime(span.end_time)}
        </DetailStat>
        <DetailStat label="Model">
          <span className="inline-flex items-center gap-1.5">
            <ModelBrandIcon model={span.model} size={18} />
            {span.model ?? "N/A"}
          </span>
        </DetailStat>
        <DetailStat label="Duration">{formatDurationMs(span.duration_ms)}</DetailStat>
        <DetailStat label="Cost">
          {span.cost_usd == null ? "N/A" : formatTraceCost(span.cost_usd)}
        </DetailStat>
        {span.total_tokens != null && (
          <>
            <DetailStat label="Prompt">{span.prompt_tokens ?? 0}</DetailStat>
            <DetailStat label="Completion">{span.completion_tokens ?? 0}</DetailStat>
            <DetailStat label="Total">{span.total_tokens}</DetailStat>
          </>
        )}
      </div>
    </>
  );
}

function GenericSpanHeader({
  span,
  displayName,
  agentName,
  tags,
}: {
  span: Span;
  displayName: string;
  agentName: string;
  tags: string[];
}) {
  const typeBadge = getSpanTypeBadge(span.span_type);

  return (
    <>
      <div className="flex flex-wrap items-start gap-2">
        <span
          className={cn(
            "inline-flex rounded px-2 py-0.5 text-[10px] font-semibold uppercase",
            typeBadge.className,
          )}
        >
          {typeBadge.label}
        </span>
        <Badge
          variant={span.status === "error" ? "default" : "secondary"}
          className={span.status === "error" ? "bg-destructive" : ""}
        >
          {span.status === "error" ? "Error" : "OK"}
        </Badge>
        <span className="inline-flex rounded bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
          {span.framework}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-foreground">{displayName}</h3>
      {agentName !== displayName && (
        <p className="mt-1 text-sm text-muted-foreground">Agent: {agentName}</p>
      )}

      {span.status === "error" && span.error_message && (
        <div className="mt-3 rounded-lg border-0 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {span.error_message}
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <DetailStat label="Time">
          {formatTraceTime(span.start_time)} - {formatTraceTime(span.end_time)}
        </DetailStat>
        <DetailStat label="Duration">{formatDurationMs(span.duration_ms)}</DetailStat>
        {span.model && <DetailStat label="Model">{span.model}</DetailStat>}
        <DetailStat label="Cost">
          {span.cost_usd == null ? "N/A" : formatTraceCost(span.cost_usd)}
        </DetailStat>
      </div>

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

function GenericPrettifyContent({ span }: { span: Span }) {
  const io = parseSpanIo(span);
  const usefulAttributes = Object.entries(span.attributes).filter(([key, value]) => {
    if (key.startsWith("agentops.") && ["agent_id", "run_id", "framework", "span_type"].some((s) => key.endsWith(s))) {
      return false;
    }
    if (value == null || value === "") return false;
    if (typeof value === "object") return true;
    return String(value).trim().length > 0;
  });

  if (!io.input && !io.output && usefulAttributes.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No prettified content available for this span. Try selecting an LLM or tool span for
        prompt/response detail.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {(io.inputTruncated || io.outputTruncated) && (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Content may be truncated at 500 characters.
        </p>
      )}

      {io.input && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {span.span_type === "tool" ? "Tool input" : "Input"}
          </p>
          <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-muted p-4 text-sm leading-6 text-foreground">
            {io.input}
          </pre>
        </section>
      )}

      {io.output && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {span.span_type === "tool" ? "Tool output" : "Output"}
          </p>
          <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-muted p-4 text-sm leading-6 text-foreground">
            {io.output}
          </pre>
        </section>
      )}

      {!io.input && !io.output && usefulAttributes.length > 0 && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Attributes
          </p>
          <dl className="mt-2 space-y-3 rounded-xl bg-muted p-4">
            {usefulAttributes.slice(0, 12).map(([key, value]) => (
              <div key={key}>
                <dt className="text-xs font-medium text-muted-foreground">{key}</dt>
                <dd className="mt-1 whitespace-pre-wrap break-words text-sm text-foreground">
                  {typeof value === "string" ? value : JSON.stringify(value, null, 2)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}

function JsonBlock({ payload }: { payload: string }) {
  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Copy JSON"
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={() => void navigator.clipboard.writeText(payload)}
      >
        <Copy className="h-4 w-4" />
      </button>
      <pre className="overflow-x-auto rounded-xl bg-zinc-950 p-4 text-xs leading-6 text-zinc-100 dark:bg-muted">
        {payload}
      </pre>
    </div>
  );
}

function buildSpanJson(span: Span, displayName: string, agentName: string): string {
  return JSON.stringify(
    {
      span_id: span.span_id,
      parent_span_id: span.parent_span_id,
      span_name: displayName,
      agent_name: agentName,
      span_kind: getSpanKind(span.span_type),
      span_type: span.span_type,
      framework: span.framework,
      status: span.status,
      error_message: span.error_message,
      start_time: span.start_time,
      end_time: span.end_time,
      duration_ms: span.duration_ms,
      model: span.model,
      prompt_tokens: span.prompt_tokens,
      completion_tokens: span.completion_tokens,
      total_tokens: span.total_tokens,
      cost_usd: span.cost_usd,
      attributes: span.attributes,
      input: span.input_preview,
      output: span.output_preview,
    },
    null,
    2,
  );
}

function DetailStat({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium text-foreground">{children}</p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border-b-2 py-3 text-sm font-medium transition-colors",
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
