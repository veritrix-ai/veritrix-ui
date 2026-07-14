import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  ChartColumn,
  FolderKanban,
  KeyRound,
  PanelLeft,
  ScrollText,
} from "lucide-react";

export interface PatchNoteEntry {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  link?: { label: string; href: string };
}

export const PATCH_NOTES_VERSION = "v0.1.0";

export const PATCH_NOTES: PatchNoteEntry[] = [
  {
    id: "sidebar",
    icon: PanelLeft,
    title: "Dashboard sidebar navigation",
    description:
      "Move between Projects, Traces, and Metrics from a persistent side nav. Collapse the sidebar to icon-only mode — your preference is saved automatically.",
  },
  {
    id: "traces",
    icon: ScrollText,
    title: "Trace explorer",
    description:
      "Inspect multi-agent runs with a waterfall timeline, interactive graph view, and per-span drilldown for inputs, outputs, and errors.",
    link: { label: "Open Traces", href: "/traces" },
  },
  {
    id: "tokens-cost",
    icon: ChartColumn,
    title: "Token & cost tracking",
    description:
      "LLM spans record prompt and completion tokens. Estimated cost is calculated per span, rolled up per trace, and shown in overall metrics.",
    link: { label: "View Metrics", href: "/metrics" },
  },
  {
    id: "api-keys",
    icon: KeyRound,
    title: "API keys in Settings",
    description:
      "Copy your ingest API key and organization ID from Settings → API Keys. Plug the key into veritrix.init() and traces flow in automatically.",
    link: { label: "Open API Keys", href: "/settings?tab=api-keys" },
  },
  {
    id: "projects",
    icon: FolderKanban,
    title: "Projects & onboarding",
    description:
      "Sign up, complete the welcome wizard, and land on a provisioned org with a default project and API key ready to use.",
    link: { label: "View Projects", href: "/projects" },
  },
  {
    id: "sdk",
    icon: BookOpen,
    title: "Python SDK integration",
    description:
      "Install the veritrix SDK, call init() with your API key, and instrument LangChain or CrewAI agents. Use span.record_usage() on LLM calls for token and cost data.",
  },
];

export const PATCH_NOTES_CHANGELOG_URL = "https://docs.veritrix.ai/changelog";
