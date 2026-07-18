import type { ReactNode } from "react";

interface DataEmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode;
}

export function DataEmptyState({ title, message, action }: DataEmptyStateProps) {
  return (
    <div className="rounded-xl bg-card px-6 py-14 text-center shadow-sm">
      <svg
        viewBox="0 0 224 128"
        fill="none"
        className="mx-auto h-32 w-56 text-primary"
        aria-hidden="true"
      >
        <path
          d="M34 105h156"
          stroke="currentColor"
          strokeOpacity=".16"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect x="49" y="25" width="126" height="80" rx="12" className="fill-background" />
        <rect
          x="49"
          y="25"
          width="126"
          height="80"
          rx="12"
          stroke="currentColor"
          strokeOpacity=".24"
          strokeWidth="2"
        />
        <rect x="65" y="42" width="58" height="7" rx="3.5" fill="currentColor" opacity=".18" />
        <rect x="65" y="59" width="94" height="5" rx="2.5" fill="currentColor" opacity=".09" />
        <rect x="65" y="72" width="76" height="5" rx="2.5" fill="currentColor" opacity=".09" />
        <circle cx="154" cy="89" r="22" className="fill-card" />
        <circle
          cx="154"
          cy="89"
          r="21"
          stroke="currentColor"
          strokeOpacity=".32"
          strokeWidth="2"
        />
        <path
          d="M146 89h16M154 81v16"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="39" cy="70" r="3" fill="currentColor" opacity=".2" />
        <circle cx="188" cy="48" r="4" fill="currentColor" opacity=".16" />
      </svg>
      <h2 className="mt-2 text-lg font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
