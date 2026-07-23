import { ApiKeyField } from "@/components/dashboard/ApiKeyField";
import { ExternalLink } from "lucide-react";
import { CodeSnippet } from "@/components/get-started/CodeSnippet";
import {
  buildColabInstallExplanation,
  COLAB_NOTEBOOKS,
  getColabNotebookUrl,
  getIngestUrl,
} from "@/lib/get-started-snippets";

interface ColabInstallStepProps {
  apiKey: string;
  onBack: () => void;
  onContinueToVerify: () => void;
  onSwitchPath: () => void;
}

export function ColabInstallStep({
  apiKey,
  onBack,
  onContinueToVerify,
  onSwitchPath,
}: ColabInstallStepProps) {
  const ingestUrl = getIngestUrl();
  const colabUrl = getColabNotebookUrl(COLAB_NOTEBOOKS.customerSupport);

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="rounded-md p-2 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground h-auto px-0"
      >
        &lt; Back
      </button>

      <h2 className="mt-4 text-2xl font-semibold text-foreground">Google Colab</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Open the notebook, paste your API key, run all cells, and traces will appear in your
        dashboard.
      </p>

      <div className="mt-8 rounded-2xl border-0 bg-card shadow-sm">
        <div className="space-y-8 p-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground">1. Open the notebook</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              The notebook installs the SDK and runs an airline customer-support multi-agent demo.
            </p>
            <a
              href={colabUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
            >
              <span aria-hidden="true">▶</span>
              Open in Google Colab
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">2. Your API key</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Paste this into the notebook&apos;s{" "}
              <code className="rounded bg-muted px-1">VERITRIX_API_KEY</code> field when Colab
              prompts you. You will also need an{" "}
              <code className="rounded bg-muted px-1">OPENAI_API_KEY</code>.
            </p>
            <ApiKeyField apiKey={apiKey} className="mt-3" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">3. How Colab fetches the library</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Colab runs <code className="rounded bg-muted px-1">pip install</code> in the first
              cell. Until the SDK is published to PyPI, it installs directly from GitHub:
            </p>
            <CodeSnippet code={buildColabInstallExplanation()} className="mt-3" />
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-100">
            <p className="font-medium">Running against a local backend?</p>
            <p className="mt-1">
              Colab cannot reach <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">localhost</code>.
              Expose your ingest API with a tunnel (e.g.{" "}
              <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">ngrok http 8001</code>) and set{" "}
              <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/60">VERITRIX_ENDPOINT</code> in the
              notebook to your public URL. Default ingest URL shown here:{" "}
              <span className="font-mono">{ingestUrl}</span>
            </p>
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
        Prefer to run locally?{" "}
        <button
          type="button"
          onClick={onSwitchPath}
          className="font-medium text-foreground underline"
        >
          Use a local code snippet instead
        </button>
      </p>
    </div>
  );
}
