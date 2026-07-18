import { useEffect, useState } from "react";

import { MetricsOverviewView } from "@/components/metrics/MetricsOverviewView";
import { MetricsPageSkeleton } from "@/components/metrics/MetricsPageSkeleton";
import { BackendUnavailable } from "@/components/dashboard/BackendUnavailable";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { getMetricsOverview } from "@/lib/api";
import { isBackendUnavailable } from "@/lib/backend-errors";
import type { MetricsOverviewData } from "@/lib/types";

const EMPTY_METRICS: MetricsOverviewData = {
  overview: {
    total_cost_usd: 0,
    tokens_generated: 0,
    fail_rate: null,
    total_events: 0,
    monthly_spans: 0,
    monthly_span_limit: 0,
  },
  span_end_states: [],
  span_end_states_distribution: {
    success: 0,
    indeterminate: 0,
    fail: 0,
  },
  spans_per_trace: [],
  trace_duration_distribution: [],
  failed_spans: [],
  trace_cost_distribution: [],
};

export function MetricsPage() {
  const workspace = useWorkspace();
  const [data, setData] = useState<MetricsOverviewData | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!workspace.org_id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setData(await getMetricsOverview(workspace.org_id));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace.org_id]);

  if (loading) return <MetricsPageSkeleton />;
  if (error) {
    return (
      <div className="px-10 py-8">
        <BackendUnavailable
          onRetry={() => void load()}
          title={isBackendUnavailable(error) ? undefined : "Failed to load metrics"}
          message={error instanceof Error ? error.message : undefined}
        />
      </div>
    );
  }
  return <MetricsOverviewView data={data ?? EMPTY_METRICS} />;
}
