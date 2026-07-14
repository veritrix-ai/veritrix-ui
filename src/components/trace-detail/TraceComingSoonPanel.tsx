interface TraceComingSoonPanelProps {
  kind: "graph" | "terminal";
}

const COPY = {
  graph: {
    title: "Graph View coming soon",
    description:
      "See agents, tools, and LLM calls as an interactive flow graph — handoffs, branches, and failure paths at a glance.",
  },
  terminal: {
    title: "Terminal Logs coming soon",
    description:
      "Stream and search chronological logs for this run — stdout, errors, and SDK events alongside the trace.",
  },
} as const;

export function TraceComingSoonPanel({ kind }: TraceComingSoonPanelProps) {
  const copy = COPY[kind];

  return (
    <div className="mt-6 flex min-h-[420px] flex-col items-center justify-center rounded-xl border-0 bg-muted/20 px-6 py-12 text-center">
      <div className="mb-6 text-primary">
        {kind === "graph" ? <GraphComingSoonArt /> : <TerminalComingSoonArt />}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{copy.title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
        {copy.description}
      </p>
      <span className="mt-5 inline-flex items-center rounded-full border-0 bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
        In progress
      </span>
    </div>
  );
}

function GraphComingSoonArt() {
  return (
    <svg
      width="220"
      height="148"
      viewBox="0 0 220 148"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="mx-auto"
    >
      <rect
        x="1"
        y="1"
        width="218"
        height="146"
        rx="16"
        className="stroke-border"
        strokeWidth="2"
        fill="hsl(var(--card))"
      />
      <path
        d="M58 74H96M124 46H162M124 102H162M110 60V88"
        className="stroke-border"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M96 74H110M110 46H124M110 102H124"
        className="stroke-primary/50"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="48" cy="74" r="18" className="fill-violet-500/15 stroke-violet-500" strokeWidth="2" />
      <circle cx="110" cy="74" r="14" className="fill-sky-500/15 stroke-sky-500" strokeWidth="2" />
      <rect
        x="154"
        y="30"
        width="36"
        height="28"
        rx="8"
        className="fill-amber-500/15 stroke-amber-500"
        strokeWidth="2"
      />
      <rect
        x="154"
        y="90"
        width="36"
        height="28"
        rx="8"
        className="fill-emerald-500/15 stroke-emerald-500"
        strokeWidth="2"
      />
      <circle cx="48" cy="74" r="4" className="fill-violet-500" />
      <circle cx="110" cy="74" r="3.5" className="fill-sky-500" />
      <circle cx="172" cy="44" r="3" className="fill-amber-500" />
      <circle cx="172" cy="104" r="3" className="fill-emerald-500" />
    </svg>
  );
}

function TerminalComingSoonArt() {
  return (
    <svg
      width="220"
      height="148"
      viewBox="0 0 220 148"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="mx-auto"
    >
      <rect
        x="1"
        y="1"
        width="218"
        height="146"
        rx="16"
        className="stroke-border"
        strokeWidth="2"
        fill="hsl(var(--card))"
      />
      <rect x="16" y="16" width="188" height="116" rx="10" className="fill-muted stroke-border" strokeWidth="1.5" />
      <circle cx="32" cy="34" r="4" className="fill-red-400/80" />
      <circle cx="46" cy="34" r="4" className="fill-amber-400/80" />
      <circle cx="60" cy="34" r="4" className="fill-emerald-400/80" />
      <path
        d="M34 58H54M42 66L34 74H54"
        className="stroke-primary"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M66 74H120"
        className="stroke-muted-foreground/40"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M34 92H148"
        className="stroke-muted-foreground/30"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M34 108H112"
        className="stroke-muted-foreground/25"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect x="168" y="64" width="6" height="16" rx="1.5" className="fill-primary/70">
        <animate attributeName="opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}
