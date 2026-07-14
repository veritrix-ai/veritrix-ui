import { ArrowRight, Wrench } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TraceAgentDetail } from "@/lib/types";

interface AgentsTabProps {
  agents: TraceAgentDetail[];
}

export function AgentsTab({ agents }: AgentsTabProps) {
  if (agents.length === 0) {
    return (
      <div className="mt-6 flex min-h-[320px] items-center justify-center rounded-xl border-0 text-sm text-muted-foreground">
        No agents found on this trace.
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2">
      {agents.map((agent) => (
        <Card key={agent.name} className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{agent.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Handoffs
              </p>
              {agent.handoffs.length === 0 ? (
                <p className="text-muted-foreground">None</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {agent.handoffs.map((handoff) => (
                    <span
                      key={handoff}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      <ArrowRight className="h-3 w-3" />
                      {handoff}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Tools
              </p>
              {agent.tools.length === 0 ? (
                <p className="text-muted-foreground">None</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {agent.tools.map((tool) => (
                    <span
                      key={tool}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      <Wrench className="h-3 w-3" />
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
