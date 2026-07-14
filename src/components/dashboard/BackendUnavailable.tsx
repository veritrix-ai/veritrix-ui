import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BackendUnavailableProps {
  title?: string;
  message?: string;
  fullPage?: boolean;
  onRetry?: () => void;
}

export function BackendUnavailable({
  title = "Unable to connect to backend services",
  message = "The dashboard could not reach the Veritrix API. Make sure the API, ClickHouse, and Postgres are running, then try again.",
  fullPage = false,
  onRetry,
}: BackendUnavailableProps) {
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

  const content = (
    <div className="mx-auto flex max-w-lg flex-col items-center text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
          <path
            d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h1 className="mt-6 text-xl font-semibold text-foreground">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{message}</p>
      <p className="mt-4 text-xs text-muted-foreground">
        API endpoint: <code className="rounded bg-muted px-1.5 py-0.5">{apiUrl}</code>
      </p>

      {onRetry && (
        <Button type="button" onClick={onRetry} className="mt-6">
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 py-16">
        {content}
      </div>
    );
  }

  return <div className="rounded-xl border-0 bg-card px-6 py-10 shadow-sm">{content}</div>;
}
