import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BackendUnavailableProps {
  title?: string;
  message?: string;
  fullPage?: boolean;
  onRetry?: () => void;
  autoRetrySeconds?: number;
}

export function BackendUnavailable({
  title = "Unable to connect to backend services",
  message = "Your data is safe. The API may still be waking up, so we'll keep trying in the background.",
  fullPage = false,
  onRetry,
  autoRetrySeconds,
}: BackendUnavailableProps) {
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
  const [secondsUntilRetry, setSecondsUntilRetry] = useState(autoRetrySeconds ?? 0);

  useEffect(() => {
    if (!onRetry || !autoRetrySeconds) return;

    setSecondsUntilRetry(autoRetrySeconds);
    const interval = window.setInterval(() => {
      setSecondsUntilRetry((seconds) => {
        if (seconds > 1) return seconds - 1;
        onRetry();
        return autoRetrySeconds;
      });
    }, 1_000);

    return () => window.clearInterval(interval);
  }, [autoRetrySeconds, onRetry]);

  const content = (
    <div className="mx-auto flex max-w-xl flex-col items-center text-center">
      <div className="relative h-40 w-64 text-primary" aria-hidden="true">
        <svg viewBox="0 0 256 160" fill="none" className="h-full w-full">
          <path
            d="M47 126h162"
            stroke="currentColor"
            strokeOpacity=".18"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <rect x="61" y="45" width="134" height="82" rx="14" className="fill-card" />
          <rect
            x="61"
            y="45"
            width="134"
            height="82"
            rx="14"
            stroke="currentColor"
            strokeOpacity=".28"
            strokeWidth="2"
          />
          <rect x="77" y="62" width="64" height="8" rx="4" fill="currentColor" opacity=".2" />
          <rect x="77" y="78" width="101" height="6" rx="3" fill="currentColor" opacity=".1" />
          <rect x="77" y="92" width="82" height="6" rx="3" fill="currentColor" opacity=".1" />
          <path
            d="M96 112h64"
            stroke="currentColor"
            strokeOpacity=".18"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="190" cy="49" r="24" className="fill-background" />
          <circle
            cx="190"
            cy="49"
            r="23"
            stroke="currentColor"
            strokeOpacity=".35"
            strokeWidth="2"
          />
          <path
            d="M181 49a9 9 0 0 1 15.8-5.9M199 49a9 9 0 0 1-15.8 5.9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="m196.4 38.7.4 4.4-4.4.4M183.6 59.3l-.4-4.4 4.4-.4"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="43" cy="105" r="4" fill="currentColor" opacity=".24" />
          <circle cx="217" cy="99" r="3" fill="currentColor" opacity=".2" />
        </svg>
      </div>

      <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
        Reconnecting
      </div>
      <h1 className="mt-4 text-xl font-semibold text-foreground">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{message}</p>

      {onRetry && (
        <Button type="button" onClick={onRetry} className="mt-6">
          <RefreshCw className="h-4 w-4" />
          {autoRetrySeconds && secondsUntilRetry > 0
            ? `Try now · retrying in ${secondsUntilRetry}s`
            : "Try again"}
        </Button>
      )}
      <details className="mt-5 text-xs text-muted-foreground">
        <summary className="cursor-pointer">Connection details</summary>
        <code className="mt-2 block rounded bg-muted px-2 py-1">{apiUrl}</code>
      </details>
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
