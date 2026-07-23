const GITHUB_REPO = "veritrix-ai/veritrix-sdk";
const DEFAULT_BRANCH = "master";

export function getIngestUrl(): string {
  return import.meta.env.VITE_INGEST_URL ?? "http://localhost:8001";
}

export function getColabNotebookUrl(notebookPath: string): string {
  return `https://colab.research.google.com/github/${GITHUB_REPO}/blob/${DEFAULT_BRANCH}/${notebookPath}`;
}

export function buildExistingCodebaseSnippet(apiKey: string): string {
  return `pip install "git+https://github.com/${GITHUB_REPO}.git"

import veritrix

veritrix.init(api_key="${apiKey}")`;
}

export function buildLocalQuickstartScript(apiKey: string, ingestUrl: string): string {
  return `pip install "git+https://github.com/${GITHUB_REPO}.git"

import time
import veritrix

veritrix.init(
    api_key="${apiKey}",
    endpoint="${ingestUrl}",
    default_tags=["getting-started"],
    framework="manual",
    agent_name="Quickstart Agent",
)

with veritrix.trace("hello-agent", span_type="agent", input_data={"message": "Hello Veritrix"}):
    time.sleep(0.1)
    with veritrix.trace("sample-tool", span_type="tool", input_data="ping"):
        time.sleep(0.05)

veritrix.end()
print("Done — check the Traces page in your Veritrix dashboard.")`;
}

export function buildColabInstallExplanation(): string {
  return `Colab installs the Veritrix SDK with pip from GitHub (until it is on PyPI):

!pip install -q "git+https://github.com/${GITHUB_REPO}.git"

After publish to PyPI, this becomes:

!pip install -q veritrix`;
}

export const COLAB_NOTEBOOKS = {
  quickstart: "examples/getting_started.ipynb",
  customerSupport: "examples/customer_support_agent.ipynb",
} as const;
