import { PRICING_PLANS } from "@/components/get-started/constants";
import { cn } from "@/lib/utils";

interface PlansStepProps {
  onBack: () => void;
  onSkip: () => void;
  onSelectPlan: () => void;
}

export function PlansStep({ onBack, onSkip, onSelectPlan }: PlansStepProps) {
  return (
    <div>
      <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground">
        Free to get started. Flexibility at scale.
      </h2>

      <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-3">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "flex flex-col rounded-2xl border-0 bg-card shadow-sm",
              plan.highlighted && "border-primary bg-primary text-primary-foreground",
            )}
          >
            <div className="flex flex-1 flex-col p-6">
              <h3
                className={cn(
                  "text-lg font-semibold",
                  plan.highlighted ? "text-primary-foreground" : "text-foreground",
                )}
              >
                {plan.name}
              </h3>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span
                  className={cn(
                    "ml-1 text-sm",
                    plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground",
                  )}
                >
                  {plan.period}
                </span>
              </div>
              <p
                className={cn(
                  "mt-2 text-sm",
                  plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground",
                )}
              >
                {plan.description}
              </p>

              <button
                type="button"
                onClick={onSelectPlan}
                className={cn(
                  "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold disabled:opacity-50",
                  plan.highlighted
                    ? "bg-card text-primary hover:bg-secondary"
                    : "border-0 bg-card hover:bg-muted",
                )}
              >
                {plan.cta}
              </button>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={cn(
                      "flex gap-2 text-sm",
                      plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    <span className={plan.highlighted ? "text-emerald-300" : "text-emerald-600"}>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-5xl items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center gap-2 rounded-xl border-0 bg-card px-3 py-2 text-sm hover:bg-muted"
        >
          &lt; Back to installation
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
        >
          Skip
          <span aria-hidden="true">&gt;</span>
        </button>
      </div>
    </div>
  );
}
