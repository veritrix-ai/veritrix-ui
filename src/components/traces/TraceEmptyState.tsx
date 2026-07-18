import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

interface TraceEmptyStateProps {
  hasFilter?: boolean;
}

export function TraceEmptyState({ hasFilter }: TraceEmptyStateProps) {
  return (
    <div className="mx-4 my-6 rounded-xl border-0 bg-muted/40 px-6 py-16 text-center">
      <svg
        viewBox="0 0 120 120"
        fill="none"
        className="mx-auto h-24 w-24 text-primary"
        aria-hidden="true"
      >
        <circle cx="60" cy="60" r="48" fill="currentColor" opacity=".06" />
        <ellipse
          cx="60"
          cy="60"
          rx="34"
          ry="14"
          transform="rotate(38 60 60)"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity=".32"
        />
        <ellipse
          cx="60"
          cy="60"
          rx="34"
          ry="14"
          transform="rotate(-38 60 60)"
          stroke="currentColor"
          strokeWidth="2"
          strokeOpacity=".32"
        />
        <circle cx="60" cy="60" r="7" fill="currentColor" opacity=".85" />
        <circle cx="33" cy="40" r="4" fill="currentColor" opacity=".5" />
        <circle cx="87" cy="80" r="4" fill="currentColor" opacity=".5" />
      </svg>
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
