import type { OrganizationDetail, OrgMembersResponse } from "@/lib/types";

export const mockOrganization: OrganizationDetail = {
  id: "11111111-1111-1111-1111-111111111111",
  name: "Demo Org",
  created_at: "2026-05-01T10:00:00.000Z",
  member_count: 3,
  pending_invite_count: 1,
};

export const mockOrgMembers: OrgMembersResponse = {
  members: [
    {
      id: "member-1",
      email: "design@veritrix.local",
      role: "owner",
      clerk_user_id: "design-user",
      joined_at: "2026-05-01T10:00:00.000Z",
    },
    {
      id: "member-2",
      email: "alex@acme.com",
      role: "admin",
      clerk_user_id: "user-alex",
      joined_at: "2026-05-12T14:20:00.000Z",
    },
    {
      id: "member-3",
      email: "sam@acme.com",
      role: "member",
      clerk_user_id: "user-sam",
      joined_at: "2026-06-02T09:10:00.000Z",
    },
  ],
  invites: [
    {
      id: "invite-1",
      email: "jordan@acme.com",
      role: "viewer",
      status: "pending",
      invited_by: "design-user",
      created_at: "2026-07-08T16:00:00.000Z",
      expires_at: "2026-07-22T16:00:00.000Z",
    },
  ],
};

export const MOCK_CURRENT_USER_EMAIL = "design@veritrix.local";

export interface MockApiKeyEntry {
  projectName: string;
  apiKey: string;
}

export const mockApiKeys: MockApiKeyEntry[] = [
  {
    projectName: "Default Project",
    apiKey: "ao_live_7f3a9c2e1b8d4f6a5e0c9b2a1d8e7f6b60f6fec",
  },
];
