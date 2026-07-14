import { useEffect, useState } from "react";
import { Lock } from "lucide-react";

import { DashboardPage } from "@/components/dashboard/DashboardPage";
import { GettingStarted } from "@/components/dashboard/GettingStarted";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getTraces } from "@/lib/api";
import { isDesignMode } from "@/lib/design-mode";

export function ProjectsPage() {
  const workspace = useWorkspace();
  const [traceCount, setTraceCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const orgId = workspace.org_id;
  const orgName = workspace.org_name ?? "Your organization";
  const project = workspace.projects[0];

  useEffect(() => {
    if (!orgId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const result = await getTraces({ orgId, limit: 50 });
        if (!cancelled) setTraceCount(result.total ?? result.traces.length);
      } catch {
        if (!cancelled) setTraceCount(0);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orgId]);

  return (
    <DashboardPage title="Projects">
      {isDesignMode() && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-secondary px-4 py-3 text-sm text-secondary-foreground">
          Design mode — showing mock workspace data.
        </div>
      )}

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-medium text-foreground">{orgName}</h2>
          <Badge variant="secondary" className="gap-1.5">
            <span aria-hidden="true">☁</span>
            Hobby
          </Badge>
        </div>
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {workspace.projects.length} / 1 projects used
          </span>
          <Lock className="h-3.5 w-3.5" />
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-36 w-full max-w-xl rounded-xl" />
      ) : (
        <ProjectCard
          name={project?.name ?? "Default Project"}
          organization={orgName}
          traceCount={traceCount}
          isNew={traceCount === 0}
        />
      )}

      <GettingStarted />
    </DashboardPage>
  );
}
