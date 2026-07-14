import { Link } from "react-router-dom";
import { Activity } from "lucide-react";

import { Button } from "@/components/ui/button";

interface TraceEmptyStateProps {
  hasFilter?: boolean;
}

export function TraceEmptyState({ hasFilter }: TraceEmptyStateProps) {
  return (
    <div className="mx-4 my-6 rounded-xl border-0 bg-muted/40 px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm">
        <Activity className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground">No traces found</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
        {hasFilter
          ? "No traces match your current filters. Try adjusting your search or date range."
          : "Seems like you don't have any traces yet. Create your first trace to see analytics and insights."}
      </p>
      {!hasFilter && (
        <Button asChild className="mt-6">
          <Link to="/get-started">Get started</Link>
        </Button>
      )}
    </div>
  );
}
