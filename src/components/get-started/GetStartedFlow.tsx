import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { GetStartedStepper } from "@/components/get-started/GetStartedStepper";
import { ChoosePathStep } from "@/components/get-started/steps/ChoosePathStep";
import { ColabInstallStep } from "@/components/get-started/steps/ColabInstallStep";
import { ExistingInstallStep } from "@/components/get-started/steps/ExistingInstallStep";
import { FreshInstallStep } from "@/components/get-started/steps/FreshInstallStep";
import { VerifyStep } from "@/components/get-started/steps/VerifyStep";
import type { GetStartedStep, IntegrationPath } from "@/components/get-started/types";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";

export function GetStartedFlow() {
  const navigate = useNavigate();
  const workspace = useWorkspace();
  const [step, setStep] = useState<GetStartedStep>("choose");
  const [path, setPath] = useState<IntegrationPath>("fresh");

  const apiKey = workspace.api_keys[0]?.key_value ?? "";
  const orgId = workspace.org_id ?? "";

  const handleSelectPath = (selectedPath: IntegrationPath) => {
    setPath(selectedPath);
    setStep("install");
  };

  const handleSwitchPath = (nextPath: IntegrationPath) => {
    setPath(nextPath);
    setStep("install");
  };

  return (
    <div className="px-10 py-8">
      <h1 className="text-[2rem] font-semibold tracking-tight text-foreground">
        Start using Veritrix
      </h1>

      <div className="mt-4">
        <GetStartedStepper currentStep={step} onStepClick={(targetStep) => setStep(targetStep)} />
      </div>

      <div className="mt-10">
        {step === "choose" && <ChoosePathStep onSelect={handleSelectPath} />}

        {step === "install" && path === "fresh" && (
          <FreshInstallStep
            apiKey={apiKey}
            onBack={() => setStep("choose")}
            onContinueToVerify={() => setStep("verify")}
            onSwitchPath={() => handleSwitchPath("colab")}
          />
        )}

        {step === "install" && path === "colab" && (
          <ColabInstallStep
            apiKey={apiKey}
            onBack={() => setStep("choose")}
            onContinueToVerify={() => setStep("verify")}
            onSwitchPath={() => handleSwitchPath("fresh")}
          />
        )}

        {step === "install" && path === "existing" && (
          <ExistingInstallStep
            apiKey={apiKey}
            onBack={() => setStep("choose")}
            onContinueToVerify={() => setStep("verify")}
            onSwitchPath={() => setStep("choose")}
          />
        )}

        {step === "verify" && (
          <VerifyStep
            orgId={orgId}
            apiKey={apiKey}
            onComplete={() => navigate("/traces")}
          />
        )}
      </div>
    </div>
  );
}
