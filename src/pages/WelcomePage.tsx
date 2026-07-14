import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useUser } from "@clerk/react";

import { AuthShell } from "@/components/auth/AuthShell";
import {
  useWorkspace,
  useWorkspaceActions,
} from "@/components/workspace/WorkspaceProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { provisionAccount } from "@/lib/api";
import { isDesignMode } from "@/lib/design-mode";

function WelcomeForm() {
  const navigate = useNavigate();
  const { user } = useUser();
  const workspace = useWorkspace();
  const { refreshWorkspace } = useWorkspaceActions();
  const [orgName, setOrgName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (workspace.provisioned) {
    return <Navigate to="/get-started" replace />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const name = orgName.trim();
    if (!name) return;

    setSubmitting(true);
    setError(null);
    try {
      await provisionAccount({
        org_name: name,
        email: user?.primaryEmailAddress?.emailAddress,
      });
      await refreshWorkspace();
      navigate("/get-started", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create organization");
      setSubmitting(false);
    }
  };

  return (
    <AuthShell mode="welcome">
      <Card>
        <CardHeader>
          <CardTitle>Set up your organization</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Choose a name for your Veritrix organization to finish provisioning.
          </p>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization name</Label>
              <Input
                id="org-name"
                value={orgName}
                onChange={(event) => setOrgName(event.target.value)}
                placeholder="Acme AI"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting || !orgName.trim()}>
              {submitting ? "Creating…" : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthShell>
  );
}

export function WelcomePage() {
  if (isDesignMode()) {
    return <Navigate to="/projects" replace />;
  }
  return <WelcomeForm />;
}
