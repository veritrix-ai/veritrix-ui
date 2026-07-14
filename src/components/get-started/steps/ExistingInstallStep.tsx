import { ApiKeyField } from "@/components/dashboard/ApiKeyField";
import { CodeSnippet } from "@/components/get-started/CodeSnippet";
import { DEFAULT_API_KEY } from "@/components/get-started/constants";
import { buildExistingCodebaseSnippet } from "@/lib/get-started-snippets";

interface ExistingInstallStepProps {
  apiKey: string;
  onBack: () => void;
  onContinueToVerify: () => void;
  onSwitchPath: () => void;
}

export function ExistingInstallStep({
  apiKey,
  onBack,
  onContinueToVerify,
  onSwitchPath,
}: ExistingInstallStepProps) {
  const resolvedKey = apiKey || DEFAULT_API_KEY;
  const snippet = buildExistingCodebaseSnippet(resolvedKey);

  return (
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="rounded-md p-2 text-sm text-muted-foreground hover:bg-transparent hover:text-foreground h-auto px-0"
      >
        &lt; Back
      </button>

      <h2 className="mt-4 text-2xl font-semibold text-foreground">Existing codebase</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Install the SDK and call <code className="rounded bg-muted px-1">veritrix.init()</code>{" "}
        once at the start of your agent app.
      </p>

      <div className="mt-8 rounded-2xl border-0 bg-card shadow-sm">
        <div className="space-y-8 p-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground">1. Install &amp; initialize</h3>
            <CodeSnippet code={snippet} className="mt-3" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">2. Your API key</h3>
            <ApiKeyField apiKey={resolvedKey} className="mt-3" />
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
        Prefer a quick start instead?{" "}
        <button
          type="button"
          onClick={onSwitchPath}
          className="font-medium text-foreground underline"
        >
          Choose a different path
        </button>
      </p>
    </div>
  );
}
