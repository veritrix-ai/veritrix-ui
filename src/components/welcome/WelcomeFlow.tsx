import { useState } from "react";
import { useOrganizationList, useUser } from "@clerk/react";
import { useNavigate } from "react-router-dom";

import {
  AboutStep,
  HelpStep,
  ResourcesStep,
  UsageStep,
} from "@/components/welcome/WelcomeSteps";
import { WelcomeShell } from "@/components/welcome/WelcomeShell";
import {
  initialWelcomeFormData,
  type WelcomeFormData,
} from "@/components/welcome/types";
import { useWorkspaceActions } from "@/components/workspace/WorkspaceProvider";
import { Button } from "@/components/ui/button";
import { provisionAccount } from "@/lib/api";

const TOTAL_STEPS = 4;
const PENDING_CLERK_ORG_KEY = "veritrix.pendingClerkOrgId";

function canProceed(step: number, data: WelcomeFormData): boolean {
  if (step === 1) return data.usage !== null;
  if (step === 2) {
    return (
      data.companyName.trim().length > 0 &&
      data.buildingDescription.trim().length > 0 &&
      data.frameworks.length > 0
    );
  }
  if (step === 3) return data.helpGoals.length > 0;
  return step === 4;
}

export function WelcomeFlow() {
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    isLoaded: organizationsLoaded,
    createOrganization,
    setActive,
  } = useOrganizationList();
  const { refreshWorkspace } = useWorkspaceActions();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WelcomeFormData>(initialWelcomeFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingClerkOrgId, setPendingClerkOrgId] = useState<string | null>(() =>
    window.sessionStorage.getItem(PENDING_CLERK_ORG_KEY),
  );

  const updateData = (updates: Partial<WelcomeFormData>) => {
    setData((current) => ({ ...current, ...updates }));
  };

  const toggleHelpGoal = (goal: string) => {
    setData((current) => ({
      ...current,
      helpGoals: current.helpGoals.includes(goal)
        ? current.helpGoals.filter((item) => item !== goal)
        : [...current.helpGoals, goal],
    }));
  };

  const handleNext = async () => {
    if (!canProceed(step, data) || submitting) return;
    setError(null);

    if (step < TOTAL_STEPS) {
      setStep((current) => current + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!data.usage) return;
    if (!organizationsLoaded || !createOrganization || !setActive) {
      setError("Clerk Organizations are still loading. Please try again.");
      return;
    }

    setSubmitting(true);
    try {
      let clerkOrgId = pendingClerkOrgId;
      if (!clerkOrgId) {
        const clerkOrganization = await createOrganization({
          name: data.companyName.trim(),
        });
        clerkOrgId = clerkOrganization.id;
        setPendingClerkOrgId(clerkOrgId);
        window.sessionStorage.setItem(PENDING_CLERK_ORG_KEY, clerkOrgId);
      }

      await provisionAccount({
        org_name: data.companyName.trim(),
        email: user?.primaryEmailAddress?.emailAddress,
        clerk_org_id: clerkOrgId,
        usage: data.usage,
        company_size: data.companySize,
        building_description: data.buildingDescription.trim(),
        stage: data.stage,
        heard_from: data.heardFrom,
        frameworks: data.frameworks,
        providers: data.providers,
        help_goals: data.helpGoals,
      });
      await setActive({ organization: clerkOrgId });
      window.sessionStorage.removeItem(PENDING_CLERK_ORG_KEY);
      await refreshWorkspace();
      navigate("/projects", { replace: true });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Could not create your organization. Please try again.",
      );
      setSubmitting(false);
    }
  };

  return (
    <WelcomeShell
      step={step}
      onBack={step > 1 ? () => setStep((current) => current - 1) : undefined}
    >
      {step === 1 && (
        <UsageStep value={data.usage} onChange={(usage) => updateData({ usage })} />
      )}
      {step === 2 && <AboutStep data={data} onChange={updateData} />}
      {step === 3 && <HelpStep selected={data.helpGoals} onToggle={toggleHelpGoal} />}
      {step === 4 && (
        <ResourcesStep frameworks={data.frameworks} providers={data.providers} />
      )}

      {error && (
        <p className="mt-6 rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button
        type="button"
        size="lg"
        className="mt-10 w-full"
        disabled={
          !canProceed(step, data) ||
          submitting ||
          (step === TOTAL_STEPS && !organizationsLoaded)
        }
        onClick={() => void handleNext()}
      >
        {submitting
          ? "Creating your workspace…"
          : step === TOTAL_STEPS
            ? "Create organization"
            : "Continue"}
      </Button>
    </WelcomeShell>
  );
}
