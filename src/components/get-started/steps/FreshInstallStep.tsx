import { ApiKeyField } from "@/components/dashboard/ApiKeyField";
import { CodeSnippet } from "@/components/get-started/CodeSnippet";
import {
  buildLocalQuickstartScript,
  getIngestUrl,
} from "@/lib/get-started-snippets";

interface FreshInstallStepProps {
  apiKey: string;
  onBack: () => void;
  onContinueToVerify: () => void;
  onSwitchPath: () => void;
}

export function FreshInstallStep({
  apiKey,
  onBack,
  onContinueToVerify,
  onSwitchPath,
}: FreshInstallStepProps) {
  const ingestUrl = getIngestUrl();
  const script = buildLocalQuickstartScript(apiKey, ingestUrl);

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="rounded-md p-2 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground h-auto px-0"
      >
        &lt; Back
      </button>

      <h2 className="mt-4 text-2xl font-semibold text-foreground">Quick start (local)</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Copy the snippet, run it in a terminal or Python file, and Veritrix will receive your
        first trace.
      </p>

      <div className="mt-8 rounded-2xl border-0 bg-card shadow-sm">
        <div className="space-y-8 p-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground">1. Install &amp; run</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Save as <code className="rounded bg-muted px-1">quickstart.py</code> or paste into
              a Python REPL. The SDK installs from GitHub until it is on PyPI.
            </p>
            <CodeSnippet code={script} className="mt-3" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">2. Your API key</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Already embedded above — keep this key secret.
            </p>
            <ApiKeyField apiKey={apiKey} className="mt-3" />
          </div>

          <div className="rounded-xl border bg-muted px-4 py-3 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Before you run</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Ingest API running on {ingestUrl}</li>
              <li>
                Docker services up (<code className="rounded bg-card px-1">docker compose up -d</code>)
              </li>
              <li>
                Run:{" "}
                <code className="rounded bg-card px-1">python quickstart.py</code>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onContinueToVerify}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            Next: Verify traces appeared &gt;
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Prefer Google Colab?{" "}
        <button
          type="button"
          onClick={onSwitchPath}
          className="font-medium text-foreground underline"
        >
          Open the Colab notebook
        </button>
      </p>
    </div>
  );
}
