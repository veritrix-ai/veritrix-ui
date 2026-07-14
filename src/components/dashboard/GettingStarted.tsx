import { Card } from "@/components/ui/card";

export function GettingStarted() {
  return (
    <section className="mt-12 max-w-4xl">
      <h2 className="text-xl font-semibold text-foreground">Getting Started with Veritrix</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
        Install the SDK, send your first trace, and verify it shows up in your dashboard.
      </p>

      <Card className="mt-5 overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-muted via-background to-secondary px-6 py-8 sm:px-10 sm:py-10">
          <GetStartedIllustration />
        </div>
      </Card>
    </section>
  );
}

function GetStartedIllustration() {
  return (
    <svg
      viewBox="0 0 640 220"
      className="mx-auto h-auto w-full max-w-2xl"
      role="img"
      aria-label="Install SDK, run your agent, and capture traces in Veritrix"
    >
      <defs>
        <linearGradient id="gs-panel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--card))" />
          <stop offset="100%" stopColor="hsl(var(--muted))" />
        </linearGradient>
        <linearGradient id="gs-glow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </linearGradient>
        <marker
          id="gs-arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="hsl(var(--primary))" fillOpacity="0.7" />
        </marker>
      </defs>

      {/* ambient glow */}
      <ellipse cx="320" cy="118" rx="280" ry="78" fill="url(#gs-glow)" opacity="0.45" />

      {/* ——— 1. Install ——— */}
      <g transform="translate(24, 36)">
        <rect width="168" height="148" rx="16" fill="url(#gs-panel)" />
        <rect
          x="14"
          y="18"
          width="140"
          height="88"
          rx="10"
          fill="hsl(var(--code))"
        />
        {/* traffic lights */}
        <circle cx="28" cy="32" r="3.5" fill="#FF5F57" opacity="0.9" />
        <circle cx="40" cy="32" r="3.5" fill="#FEBC2E" opacity="0.9" />
        <circle cx="52" cy="32" r="3.5" fill="#28C840" opacity="0.9" />
        {/* code lines */}
        <rect x="26" y="46" width="72" height="5" rx="2.5" fill="hsl(var(--primary))" opacity="0.85">
          <animate attributeName="width" values="72;86;72" dur="3.2s" repeatCount="indefinite" />
        </rect>
        <rect x="26" y="58" width="108" height="5" rx="2.5" fill="hsl(var(--code-muted))" />
        <rect x="26" y="70" width="92" height="5" rx="2.5" fill="hsl(var(--code-muted))" opacity="0.75" />
        <rect x="26" y="82" width="54" height="5" rx="2.5" fill="hsl(var(--primary))" opacity="0.45" />
        <text
          x="84"
          y="132"
          textAnchor="middle"
          fill="hsl(var(--foreground))"
          fontSize="13"
          fontWeight="600"
          fontFamily="var(--font-sans), system-ui, sans-serif"
        >
          Install SDK
        </text>
        <text
          x="84"
          y="150"
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          fontSize="11"
          fontFamily="var(--font-sans), system-ui, sans-serif"
        >
          veritrix.init()
        </text>
      </g>

      {/* connector 1 → 2 */}
      <path
        d="M200 110 H230"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeOpacity="0.55"
        fill="none"
        markerEnd="url(#gs-arrow)"
      />
      <circle cx="215" cy="110" r="3" fill="hsl(var(--primary))">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" repeatCount="indefinite" />
      </circle>

      {/* ——— 2. Run agent ——— */}
      <g transform="translate(236, 36)">
        <rect width="168" height="148" rx="16" fill="url(#gs-panel)" />
        {/* agent node */}
        <rect
          x="48"
          y="22"
          width="72"
          height="28"
          rx="8"
          fill="hsl(var(--primary))"
          fillOpacity="0.18"
          stroke="hsl(var(--primary))"
          strokeWidth="1.5"
        />
        <text
          x="84"
          y="40"
          textAnchor="middle"
          fill="hsl(var(--primary))"
          fontSize="11"
          fontWeight="600"
          fontFamily="var(--font-sans), system-ui, sans-serif"
        >
          Agent
        </text>
        {/* branches to tool + llm */}
        <path
          d="M84 50 V62 M84 62 H44 V70 M84 62 H124 V70"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="1.5"
          strokeOpacity="0.5"
          fill="none"
        />
        <rect
          x="18"
          y="70"
          width="52"
          height="24"
          rx="7"
          fill="hsl(var(--muted))"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />
        <text
          x="44"
          y="86"
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          fontSize="10"
          fontFamily="var(--font-sans), system-ui, sans-serif"
        >
          Tool
        </text>
        <rect
          x="98"
          y="70"
          width="52"
          height="24"
          rx="7"
          fill="hsl(var(--muted))"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />
        <text
          x="124"
          y="86"
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          fontSize="10"
          fontFamily="var(--font-sans), system-ui, sans-serif"
        >
          LLM
        </text>
        {/* pulse ring on agent */}
        <circle cx="84" cy="36" r="22" fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.35">
          <animate attributeName="r" values="18;28;18" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.45;0;0.45" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <text
          x="84"
          y="132"
          textAnchor="middle"
          fill="hsl(var(--foreground))"
          fontSize="13"
          fontWeight="600"
          fontFamily="var(--font-sans), system-ui, sans-serif"
        >
          Run agent
        </text>
        <text
          x="84"
          y="150"
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          fontSize="11"
          fontFamily="var(--font-sans), system-ui, sans-serif"
        >
          Spans open &amp; close
        </text>
      </g>

      {/* connector 2 → 3 */}
      <path
        d="M412 110 H442"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeOpacity="0.55"
        fill="none"
        markerEnd="url(#gs-arrow)"
      />
      <circle cx="427" cy="110" r="3" fill="hsl(var(--primary))">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.8s" begin="0.4s" repeatCount="indefinite" />
      </circle>

      {/* ——— 3. Capture traces ——— */}
      <g transform="translate(448, 36)">
        <rect width="168" height="148" rx="16" fill="url(#gs-panel)" />
        {/* waterfall bars */}
        <g transform="translate(28, 28)">
          <rect width="112" height="10" rx="3" fill="hsl(var(--primary))" opacity="0.95">
            <animate attributeName="width" values="70;112;70" dur="2.8s" repeatCount="indefinite" />
          </rect>
          <rect y="18" x="12" width="88" height="10" rx="3" fill="hsl(var(--primary))" opacity="0.55">
            <animate attributeName="width" values="48;88;48" dur="2.8s" begin="0.2s" repeatCount="indefinite" />
          </rect>
          <rect y="36" x="12" width="64" height="10" rx="3" fill="hsl(var(--primary))" opacity="0.35">
            <animate attributeName="width" values="36;64;36" dur="2.8s" begin="0.4s" repeatCount="indefinite" />
          </rect>
          <rect y="54" x="24" width="72" height="10" rx="3" fill="hsl(var(--muted-foreground))" opacity="0.35" />
        </g>
        <text
          x="84"
          y="132"
          textAnchor="middle"
          fill="hsl(var(--foreground))"
          fontSize="13"
          fontWeight="600"
          fontFamily="var(--font-sans), system-ui, sans-serif"
        >
          Capture traces
        </text>
        <text
          x="84"
          y="150"
          textAnchor="middle"
          fill="hsl(var(--muted-foreground))"
          fontSize="11"
          fontFamily="var(--font-sans), system-ui, sans-serif"
        >
          See them live
        </text>
      </g>
    </svg>
  );
}
