import { useEffect, useState, type FormEvent } from "react";
import { useSearchParams } from "react-router-dom";

import {
  ApiKeysSettingsPanel,
  type ApiKeyEntry,
} from "@/components/settings/ApiKeysSettingsPanel";
import { BillingSettingsPanel } from "@/components/settings/BillingSettingsPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createOrgInvite,
  removeOrgMember,
  revokeOrgInvite,
  updateOrganization,
  updateOrgMemberRole,
} from "@/lib/api";
import type {
  InviteRole,
  OrganizationDetail,
  OrgInvite,
  OrgMember,
  OrgRole,
} from "@/lib/types";
import { cn } from "@/lib/utils";

type SettingsTab = "general" | "members" | "api-keys" | "billing";
type MembersSubTab = "team" | "pending";

const ROLE_OPTIONS: InviteRole[] = ["admin", "member", "viewer"];

const ROLE_LABELS: Record<OrgRole, string> = {
  owner: "Owner",
  admin: "Admin",
  member: "Member",
  viewer: "Viewer",
};

const TABS: Array<{ id: SettingsTab; label: string }> = [
  { id: "general", label: "General" },
  { id: "members", label: "Manage members" },
  { id: "api-keys", label: "API Keys" },
  { id: "billing", label: "Billing" },
];

const VALID_TABS = new Set<SettingsTab>(["general", "members", "api-keys", "billing"]);

interface SettingsViewProps {
  orgId: string;
  clerkOrganizationId?: string | null;
  organization: OrganizationDetail;
  members: OrgMember[];
  invites: OrgInvite[];
  apiKeys: ApiKeyEntry[];
  currentUserEmail?: string | null;
}

function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function roleBadgeClass(role: OrgRole): string {
  switch (role) {
    case "owner":
      return "bg-primary text-primary-foreground";
    case "admin":
      return "bg-primary/15 text-primary";
    case "member":
      return "bg-muted text-foreground";
    case "viewer":
      return "bg-muted/60 text-muted-foreground";
  }
}

export function SettingsView({
  orgId,
  clerkOrganizationId,
  organization,
  members: initialMembers,
  invites: initialInvites,
  apiKeys,
  currentUserEmail,
}: SettingsViewProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [membersSubTab, setMembersSubTab] = useState<MembersSubTab>("team");
  const [orgName, setOrgName] = useState(organization.name);
  const [savedName, setSavedName] = useState(organization.name);
  const [members, setMembers] = useState(initialMembers);
  const [invites, setInvites] = useState(initialInvites);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<InviteRole>("member");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && VALID_TABS.has(tab as SettingsTab)) {
      setActiveTab(tab as SettingsTab);
    }
  }, [searchParams]);

  const selectTab = (tab: SettingsTab) => {
    setActiveTab(tab);
    const next = new URLSearchParams(searchParams);
    if (tab === "general") {
      next.delete("tab");
    } else {
      next.set("tab", tab);
    }
    setSearchParams(next, { replace: true });
  };

  const handleSaveName = async () => {
    const next = orgName.trim();
    if (!next || next === savedName) return;
    setError(null);
    setMessage(null);
    try {
      const updated = await updateOrganization(orgId, next);
      setSavedName(updated.name);
      setOrgName(updated.name);
      setMessage("Organization name updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update organization");
    }
  };

  const handleInvite = async (event: FormEvent) => {
    event.preventDefault();
    const email = inviteEmail.trim().toLowerCase();
    if (!email) return;
    setError(null);
    setMessage(null);

    if (members.some((member) => member.email.toLowerCase() === email)) {
      setError("That email is already a member");
      return;
    }
    if (invites.some((invite) => invite.email.toLowerCase() === email)) {
      setError("An invite is already pending for that email");
      return;
    }

    try {
      const invite = await createOrgInvite(orgId, { email, role: inviteRole });
      setInvites((current) => [invite, ...current]);
      setInviteEmail("");
      setInviteRole("member");
      setMembersSubTab("pending");
      setMessage(`Invite sent to ${email}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send invite");
    }
  };

  const handleRoleChange = async (memberId: string, role: InviteRole) => {
    setError(null);
    setMessage(null);
    try {
      const updated = await updateOrgMemberRole(orgId, memberId, { role });
      setMembers((current) =>
        current.map((member) => (member.id === memberId ? updated : member)),
      );
      setMessage("Member access updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setError(null);
    setMessage(null);
    try {
      await removeOrgMember(orgId, memberId);
      setMembers((current) => current.filter((member) => member.id !== memberId));
      setMessage("Member removed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove member");
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    setError(null);
    setMessage(null);
    try {
      await revokeOrgInvite(orgId, inviteId);
      setInvites((current) => current.filter((invite) => invite.id !== inviteId));
      setMessage("Invite revoked");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to revoke invite");
    }
  };

  return (
    <div className="space-y-4">
      {(error || message) && (
        <div
          className={cn(
            "rounded-xl border-0 px-4 py-3 text-sm",
            error
              ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300"
              : "bg-secondary text-secondary-foreground dark:bg-accent dark:text-accent-foreground",
          )}
        >
          {error ?? message}
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(value) => selectTab(value as SettingsTab)}
        className="w-full"
      >
        <TabsList className="flex w-fit max-w-full flex-wrap">
          {TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general">
          <section className="rounded-xl border-0 bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">General</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your organization profile and basic details.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
              <label className="min-w-0 flex-1">
                <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Organization name
                </span>
                <Input
                  value={orgName}
                  onChange={(event) => setOrgName(event.target.value)}
                  className="h-11 bg-muted/40"
                />
              </label>
              <Button
                type="button"
                onClick={handleSaveName}
                disabled={!orgName.trim() || orgName.trim() === savedName}
                className="h-11"
              >
                Save changes
              </Button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-muted/50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Members
                </p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{members.length}</p>
              </div>
              <div className="rounded-lg bg-muted/50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Pending invites
                </p>
                <p className="mt-1 text-2xl font-semibold text-foreground">{invites.length}</p>
              </div>
              <div className="rounded-lg bg-muted/50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Organization ID
                </p>
                <p className="mt-1 truncate font-mono text-sm text-foreground/80">{orgId}</p>
              </div>
            </div>
          </section>
        </TabsContent>

        <TabsContent value="members">
          <div className="space-y-6 rounded-xl border-0 bg-card p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Manage members</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Invite people to your organisation and manage who has access.
              </p>
            </div>

            <section>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Invite members
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Send an email invite. They&apos;ll join with the role you choose.
              </p>

              <form
                onSubmit={handleInvite}
                className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center"
              >
                <Input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  placeholder="colleague@company.com"
                  className="h-11 min-w-0 flex-1 bg-muted/40"
                />
                <select
                  value={inviteRole}
                  onChange={(event) => setInviteRole(event.target.value as InviteRole)}
                  className="h-11 rounded-lg border-0 bg-muted/40 px-3 text-sm text-foreground outline-none ring-ring focus:bg-card focus:ring-2"
                >
                  {ROLE_OPTIONS.map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </option>
                  ))}
                </select>
                <Button type="submit" disabled={!inviteEmail.trim()} className="h-11">
                  Send invite
                </Button>
              </form>
            </section>

            <div className="inline-flex rounded-xl border-0 bg-muted p-1 dark:bg-black/30">
              <button
                type="button"
                onClick={() => setMembersSubTab("team")}
                className={cn(
                  "rounded-lg border-0 px-5 py-2 text-sm font-medium transition-all",
                  membersSubTab === "team"
                    ? "bg-background text-foreground shadow-sm dark:bg-white/12 dark:text-white dark:shadow-none"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Team
              </button>
              <button
                type="button"
                onClick={() => setMembersSubTab("pending")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border-0 px-5 py-2 text-sm font-medium transition-all",
                  membersSubTab === "pending"
                    ? "bg-background text-foreground shadow-sm dark:bg-white/12 dark:text-white dark:shadow-none"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Pending invites
                <span className="rounded-full bg-muted-foreground/20 px-1.5 py-0.5 text-[11px] font-semibold text-foreground/70">
                  {invites.length}
                </span>
              </button>
            </div>

            {membersSubTab === "team" ? (
              <section className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  People in this organisation. Owners cannot be removed.
                </p>
                {members.map((member) => {
                  const isYou =
                    currentUserEmail &&
                    member.email.toLowerCase() === currentUserEmail.toLowerCase();
                  const isOwner = member.role === "owner";

                  return (
                    <div
                      key={member.id}
                      className="flex flex-col gap-3 rounded-xl bg-muted/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-foreground">
                            {displayNameFromEmail(member.email)}
                            {isYou ? " (you)" : ""}
                          </p>
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
                              roleBadgeClass(member.role),
                            )}
                          >
                            {ROLE_LABELS[member.role]}
                          </span>
                        </div>
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">
                          {member.email}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground/80">
                          Joined{" "}
                          {new Date(member.joined_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isOwner && (
                          <>
                            <select
                              value={member.role}
                              onChange={(event) =>
                                handleRoleChange(member.id, event.target.value as InviteRole)
                              }
                              className="rounded-lg border-0 bg-card px-2.5 py-1.5 text-sm text-foreground outline-none ring-ring focus:ring-2"
                            >
                              {ROLE_OPTIONS.map((role) => (
                                <option key={role} value={role}>
                                  {ROLE_LABELS[role]}
                                </option>
                              ))}
                            </select>
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => handleRemoveMember(member.id)}
                              className="h-8 bg-red-50 px-3 text-sm font-medium text-red-600 hover:bg-red-100 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </section>
            ) : (
              <section className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Invites waiting to be accepted. You can revoke them anytime.
                </p>
                {invites.length === 0 ? (
                  <div className="rounded-xl bg-muted/50 px-4 py-10 text-center text-sm text-muted-foreground">
                    No pending invites.
                  </div>
                ) : (
                  invites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex flex-col gap-3 rounded-xl bg-muted/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-foreground">{invite.email}</p>
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold",
                              roleBadgeClass(invite.role),
                            )}
                          >
                            {ROLE_LABELS[invite.role]}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground/80">
                          Sent{" "}
                          {new Date(invite.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleRevokeInvite(invite.id)}
                        className="h-8 bg-red-50 px-3 text-sm font-medium text-red-600 hover:bg-red-100 hover:text-red-700"
                      >
                        Revoke
                      </Button>
                    </div>
                  ))
                )}
              </section>
            )}
          </div>
        </TabsContent>

        <TabsContent value="api-keys">
          <ApiKeysSettingsPanel
            organizationName={savedName}
            orgId={orgId}
            apiKeys={apiKeys}
          />
        </TabsContent>

        <TabsContent value="billing">
          <BillingSettingsPanel
            orgId={orgId}
            clerkOrganizationId={clerkOrganizationId}
            organizationName={savedName}
            billingEmail={currentUserEmail}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
