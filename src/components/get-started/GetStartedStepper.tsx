import { GET_STARTED_STEPS } from "@/components/get-started/constants";
import type { GetStartedStep } from "@/components/get-started/types";
import { cn } from "@/lib/utils";

interface GetStartedStepperProps {
  currentStep: GetStartedStep;
  onStepClick?: (step: GetStartedStep) => void;
}

const stepOrder = GET_STARTED_STEPS.map((step) => step.id);

export function GetStartedStepper({ currentStep, onStepClick }: GetStartedStepperProps) {
  const currentIndex = stepOrder.indexOf(currentStep);

  return (
    <nav aria-label="Get started progress" className="flex flex-wrap items-center gap-2 text-sm">
      {GET_STARTED_STEPS.map((step, index) => {
        const isActive = step.id === currentStep;
        const isComplete = index < currentIndex;
        const isClickable = isComplete && onStepClick;

        return (
          <div key={step.id} className="flex items-center gap-2">
            {index > 0 && <span className="text-muted-foreground">&gt;</span>}
            {isClickable ? (
              <button
                type="button"
                onClick={() => onStepClick(step.id)}
                className="rounded-md p-2 font-medium text-muted-foreground hover:bg-transparent hover:text-foreground h-auto px-0 py-0"
              >
                {step.label}
              </button>
            ) : (
              <span
                className={cn(
                  "font-medium",
                  isActive
                    ? "font-semibold text-primary"
                    : isComplete
                      ? "text-foreground"
                      : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
