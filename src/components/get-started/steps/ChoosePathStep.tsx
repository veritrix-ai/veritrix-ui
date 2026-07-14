import type { IntegrationPath } from "@/components/get-started/types";

interface ChoosePathStepProps {
  onSelect: (path: IntegrationPath) => void;
}

export function ChoosePathStep({ onSelect }: ChoosePathStepProps) {
  return (
    <div>
      <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground">
        Let&apos;s get you started with Veritrix
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-muted-foreground">
        Run a quick snippet locally, open a Google Colab notebook, or add Veritrix to an existing
        project.
      </p>

      <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
        <PathCard
          title="Local quick start"
          description="Copy a Python snippet, run it on your machine, and send your first trace."
          badge="Fastest"
          iconClass="bg-secondary text-secondary-foreground"
          onSelect={() => onSelect("fresh")}
        />
        <PathCard
          title="Google Colab"
          description="Open a notebook in Colab — pip installs the SDK and runs a sample agent."
          badge="No setup"
          iconClass="bg-accent text-accent-foreground"
          onSelect={() => onSelect("colab")}
        />
        <PathCard
          title="Existing codebase"
          description="Add Veritrix to a project you already have with a few lines of code."
          badge="Integrate"
          iconClass="bg-muted text-muted-foreground"
          onSelect={() => onSelect("existing")}
        />
      </div>
    </div>
  );
}

function PathCard({
  title,
  description,
  badge,
  iconClass,
  onSelect,
}: {
  title: string;
  description: string;
  badge: string;
  iconClass: string;
  onSelect: () => void;
}) {
  return (
    <button type="button" onClick={onSelect} className="text-left">
      <div className="h-full rounded-2xl border-0 bg-card shadow-sm transition-shadow hover:shadow-md">
        <div className="p-8">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold ${iconClass}`}
          >
            {title.slice(0, 1)}
          </div>
          <h3 className="mt-6 text-xl font-semibold text-foreground">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
          <span className="mt-6 inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-sm font-medium text-primary">
            {badge}
            <span aria-hidden="true">&gt;</span>
          </span>
        </div>
      </div>
    </button>
  );
}
