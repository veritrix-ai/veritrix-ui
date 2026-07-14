import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { BackendUnavailable } from "@/components/dashboard/BackendUnavailable";
import { AgentsTab } from "@/components/trace-detail/AgentsTab";
import { TraceComingSoonPanel } from "@/components/trace-detail/TraceComingSoonPanel";
import { TraceDetailHeader } from "@/components/trace-detail/TraceDetailHeader";
import { TraceDetailSkeleton } from "@/components/trace-detail/TraceDetailSkeleton";
import { TraceMetadataBar } from "@/components/trace-detail/TraceMetadataBar";
import {
  TraceViewTabs,
  type TraceDetailTab,
  type TraceViewMode,
} from "@/components/trace-detail/TraceViewTabs";
import { TreeView } from "@/components/trace-detail/TreeView";
import { WaterfallView } from "@/components/trace-detail/WaterfallView";
import { deriveTraceMeta } from "@/components/trace-detail/utils";
import { getTrace } from "@/lib/api";
import { isBackendUnavailable } from "@/lib/backend-errors";
import type { TraceDetail } from "@/lib/types";

export function TraceDetailPage() {
  const { traceId = "" } = useParams();
  const [trace, setTrace] = useState<TraceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [activeTab, setActiveTab] = useState<TraceDetailTab>("view");
  const [activeView, setActiveView] = useState<TraceViewMode>("waterfall");
  const [selectedSpanId, setSelectedSpanId] = useState<string | null>(null);

  const load = async () => {
    if (!traceId) return;
    setLoading(true);
    setError(null);
    try {
      const detail = await getTrace(traceId);
      setTrace(detail);
      setSelectedSpanId(
        detail.spans.find((span) => span.span_type === "agent")?.span_id ??
          detail.spans[0]?.span_id ??
          null,
      );
    } catch (err) {
      setError(err);
      setTrace(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traceId]);

  const meta = useMemo(() => {
    if (!trace) return null;
    const derived = deriveTraceMeta(trace.spans);
    if (!trace.meta) return derived;
    return {
      ...derived,
      ...trace.meta,
      model: trace.meta.model ?? derived.model,
      tags: trace.meta.tags?.length ? trace.meta.tags : derived.tags,
    };
  }, [trace]);

  if (loading) return <TraceDetailSkeleton />;

  if (error) {
    return (
      <div className="px-10 py-8">
        <BackendUnavailable
          onRetry={() => void load()}
          title={isBackendUnavailable(error) ? undefined : "Failed to load trace"}
          message={error instanceof Error ? error.message : undefined}
        />
      </div>
    );
  }

  if (!trace || !meta) {
    return (
      <div className="px-10 py-8 text-sm text-muted-foreground">Trace not found.</div>
    );
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(trace, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${trace.trace_id}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-10 py-8">
      <TraceDetailHeader
        meta={meta}
        traceId={trace.trace_id}
        runId={trace.run_id}
        onExport={handleExport}
      />
      <TraceMetadataBar meta={meta} />
      <TraceViewTabs
        activeTab={activeTab}
        activeView={activeView}
        onTabChange={setActiveTab}
        onViewChange={setActiveView}
      />

      {activeTab === "view" && activeView === "waterfall" && (
        <WaterfallView
          spans={trace.spans}
          selectedSpanId={selectedSpanId}
          onSelectSpan={setSelectedSpanId}
        />
      )}

      {activeTab === "view" && activeView === "tree" && (
        <TreeView
          spans={trace.spans}
          selectedSpanId={selectedSpanId}
          onSelectSpan={setSelectedSpanId}
        />
      )}

      {activeTab === "view" && activeView === "graph" && (
        <TraceComingSoonPanel kind="graph" />
      )}

      {activeTab === "agents" && <AgentsTab agents={trace.agents ?? []} />}

      {activeTab === "terminal" && <TraceComingSoonPanel kind="terminal" />}
    </div>
  );
}
