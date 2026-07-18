import { useEffect, type ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

import { VeritrixLogo } from "@/components/auth/VeritrixLogo";

export function WelcomeShell({
  step,
  totalSteps = 4,
  onBack,
  children,
}: {
  step: number;
  totalSteps?: number;
  onBack?: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains("dark");
    root.classList.remove("dark");
    return () => {
      if (wasDark) root.classList.add("dark");
    };
  }, []);

  return (
    <div className="min-h-screen bg-surface px-5 py-8 text-foreground sm:px-8">
      <div className="mx-auto max-w-3xl">
        <VeritrixLogo />

        <div className="mt-10 rounded-3xl bg-card p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="flex items-center justify-between gap-4">
            {onBack ? (
              <button
                type="button"
                onClick={onBack}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <span className="text-sm font-medium text-muted-foreground">
                Tell us about yourself
              </span>
            )}
            <span className="text-sm font-medium text-muted-foreground">
              Step {step} of {totalSteps}
            </span>
          </div>

          <div className="mt-5 flex gap-2" aria-label={`Onboarding step ${step} of ${totalSteps}`}>
            {Array.from({ length: totalSteps }, (_, index) => (
              <span
                key={index}
                className={`h-1.5 flex-1 rounded-full ${
                  index < step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <div className="mt-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
