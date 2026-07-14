import { useEffect, useState } from "react";

import { BackendUnavailable } from "@/components/dashboard/BackendUnavailable";
import { SettingsView } from "@/components/settings/SettingsView";
import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrganization, getOrgMembers } from "@/lib/api";
import { isBackendUnavailable } from "@/lib/backend-errors";
import type { OrganizationDetail, OrgInvite, OrgMember } from "@/lib/types";

export function SettingsPage() {
  const workspace = useWorkspace();
  const orgId = workspace.org_id ?? "";
  const [organization, setOrganization] = useState<OrganizationDetail | null>(null);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [invites, setInvites] = useState<OrgInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const load = async () => {
    if (!orgId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [org, membership] = await Promise.all([
        getOrganization(orgId),
        getOrgMembers(orgId),
      ]);
      setOrganization(org);
      setMembers(membership.members);
      setInvites(membership.invites);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId]);

  const apiKeys = workspace.api_keys.map((key) => ({
    projectName: key.project_name,
    apiKey: key.key_value,
  }));

  return (
    <div className="px-10 py-8">
      <div>
        <h1 className="text-[2rem] font-semibold tracking-tight text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage organization details, members, API keys, and billing.
        </p>
      </div>

      <div className="mt-8">
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-80 rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        )}
        {error != null && (
          <BackendUnavailable
            onRetry={() => void load()}
            title={isBackendUnavailable(error) ? undefined : "Failed to load settings"}
            message={error instanceof Error ? error.message : undefined}
          />
        )}
        {!loading && !error && organization && (
          <SettingsView
            orgId={orgId}
            organization={organization}
            members={members}
            invites={invites}
            apiKeys={apiKeys}
            currentUserEmail={workspace.email}
          />
        )}
      </div>
    </div>
  );
}
