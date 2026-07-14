import { useEffect, useState } from "react";

import { ApiKeyField } from "@/components/dashboard/ApiKeyField";
import { getTraces } from "@/lib/api";

interface VerifyStepProps {
  orgId: string;
  apiKey: string;
  onComplete: () => void;
}

const POLL_INTERVAL_MS = 3000;

export function VerifyStep({ orgId, apiKey, onComplete }: VerifyStepProps) {
  const [checking, setChecking] = useState(false);
  const [polling, setPolling] = useState(true);
  const [traceCount, setTraceCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const checkTraces = async (): Promise<number> => {
    if (!orgId) {
      throw new Error("Organization is not ready yet. Finish onboarding first.");
    }
    const result = await getTraces({ orgId, limit: 1 });
    setTraceCount(result.total);
    return result.total;
  };

  const handleCheck = async () => {
    setChecking(true);
    setError(null);

    try {
      const count = await checkTraces();
      if (count === 0) {
        setError("No traces yet. Run your snippet or Colab notebook, then check again.");
      } else {
        setPolling(false);
      }
    } catch (checkError) {
      setError(
        checkError instanceof Error
          ? checkError.message
          : "Could not reach the backend. Make sure the App API is running.",
      );
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (!polling || !orgId) return undefined;

    let cancelled = false;

    const poll = async () => {
      try {
        const count = await checkTraces();
        if (!cancelled && count > 0) {
          setPolling(false);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError(
            "Waiting for traces… Make sure ingest (8001) and your agent/Colab notebook are running.",
          );
        }
      }
    };

    void poll();
    const intervalId = window.setInterval(() => void poll(), POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polling, orgId]);

  const verified = traceCount > 0;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border-0 bg-card shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-foreground">Waiting for your first trace</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Run the local snippet or finish the Colab notebook. This page checks your org every few
            seconds.
          </p>
          <ApiKeyField apiKey={apiKey} className="mt-4" />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border-0 bg-card shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">
                {verified ? "Trace received" : polling ? "Listening for traces…" : "Not detected yet"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {verified
                  ? `${traceCount} trace${traceCount === 1 ? "" : "s"} in your org`
                  : "Run your code, then traces will show up here and on the Traces page."}
              </p>
            </div>
            {polling && !verified && (
              <span
                className="inline-flex h-10 w-10 animate-pulse rounded-full bg-accent"
                aria-hidden="true"
              />
            )}
          </div>

          <button
            type="button"
            onClick={() => void handleCheck()}
            disabled={checking}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border-0 bg-muted px-3 py-3 text-sm font-semibold hover:bg-muted/80 disabled:opacity-50"
          >
            {checking ? "Checking..." : "Check now"}
          </button>

          {error && !verified && (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
              {error}
            </div>
          )}

          {verified && (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-100">
              Your first trace is in Veritrix. Open the Traces page to explore it.
              <button
                type="button"
                onClick={onComplete}
                className="mt-3 block h-auto px-0 font-semibold text-emerald-900 underline hover:text-emerald-700 dark:text-emerald-50 dark:hover:text-emerald-200"
              >
                Go to Traces
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
