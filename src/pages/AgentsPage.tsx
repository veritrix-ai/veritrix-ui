import { useEffect, useState } from "react";

import { BackendUnavailable } from "@/components/dashboard/BackendUnavailable";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAgents } from "@/lib/api";
import { isBackendUnavailable } from "@/lib/backend-errors";
import { formatDurationMs } from "@/components/trace-detail/utils";
import type { AgentSummary } from "@/lib/types";

export function AgentsPage() {
  const workspace = useWorkspace();
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const load = async () => {
    if (!workspace.org_id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await getAgents(workspace.org_id);
      setAgents(result.agents);
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

  return (
    <div className="px-10 py-8">
      <h1 className="text-[2rem] font-semibold tracking-tight text-foreground">Agents</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        See which agents are active and how they are performing.
      </p>

      <div className="mt-8">
        {loading && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-36 rounded-xl" />
            ))}
          </div>
        )}

        {error != null && (
          <BackendUnavailable
            onRetry={() => void load()}
            title={isBackendUnavailable(error) ? undefined : "Failed to load agents"}
            message={error instanceof Error ? error.message : undefined}
          />
        )}

        {!loading && !error && agents.length === 0 && (
          <div className="rounded-xl border-0 px-6 py-16 text-center text-sm text-muted-foreground">
            No agents found yet. Run an instrumented agent to see it here.
          </div>
        )}

        {!loading && !error && agents.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.agent_id} className="shadow-sm">
                <CardContent className="px-5 py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-foreground">{agent.agent_name}</h2>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {agent.agent_id}
                      </p>
                    </div>
                    <Badge variant="secondary">{agent.framework}</Badge>
                  </div>
                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-muted-foreground">Runs</dt>
                      <dd className="font-medium text-foreground">
                        {agent.total_runs.toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Error rate</dt>
                      <dd className="font-medium text-foreground">
                        {(agent.error_rate * 100).toFixed(1)}%
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Avg duration</dt>
                      <dd className="font-medium text-foreground">
                        {formatDurationMs(agent.avg_duration_ms)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Last seen</dt>
                      <dd className="font-medium text-foreground">
                        {new Date(agent.last_seen).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
