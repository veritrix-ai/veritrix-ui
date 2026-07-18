import { ApiError, BackendUnavailableError } from "@/lib/backend-errors";
import { isDesignMode } from "@/lib/design-mode";
import {
  getDesignModeWorkspace,
  getMockTrace,
  mockAgentList,
  mockMetricsOverview,
  mockOrganization,
  mockOrgMembers,
  mockTraceList,
} from "@/lib/mock-data";
import type {
  AgentListResponse,
  CreateInviteRequest,
  MeResponse,
  MetricsOverviewData,
  OnboardingRequest,
  OrganizationDetail,
  OrgInvite,
  OrgMember,
  OrgMembersResponse,
  ProjectSummary,
  SpanStatus,
  TraceDetail,
  TraceListResponse,
  UpdateMemberRoleRequest,
} from "@/lib/types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const API_TIMEOUT_MS = 15_000;
const AUTH_TOKEN_TIMEOUT_MS = 5_000;

type TokenProvider = () => Promise<string | null>;

let tokenProvider: TokenProvider = async () => null;

export function configureApiAuth(getToken: TokenProvider) {
  tokenProvider = getToken;
}

async function getTokenWithDeadline(): Promise<string | null> {
  let timeoutId: number | undefined;
  try {
    return await Promise.race([
      tokenProvider(),
      new Promise<null>((resolve) => {
        timeoutId = window.setTimeout(() => resolve(null), AUTH_TOKEN_TIMEOUT_MS);
      }),
    ]);
  } catch {
    return null;
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  }
}

async function getAuthHeaders(): Promise<HeadersInit> {
  if (isDesignMode()) {
    return { "Content-Type": "application/json" };
  }

  let token = await getTokenWithDeadline();
  // Brief retry — Clerk can return null for a tick right after sign-in.
  if (!token) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    token = await getTokenWithDeadline();
  }
  if (!token) {
    throw new ApiError("Missing authentication token", 401);
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = await getAuthHeaders();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        ...headers,
        ...init?.headers,
      },
    });
  } catch {
    throw new BackendUnavailableError(
      "The API is taking longer than expected. It may still be waking up.",
    );
  } finally {
    window.clearTimeout(timeout);
  }

  if (!response.ok) {
    if (response.status >= 500) {
      throw new BackendUnavailableError();
    }

    let message = `Request failed: ${response.statusText}`;
    try {
      const payload = (await response.json()) as { error?: string };
      if (payload.error) message = payload.error;
    } catch {
      // keep default
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) return undefined as T;

  const text = await response.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export async function getMe(): Promise<MeResponse> {
  if (isDesignMode()) return getDesignModeWorkspace();
  return fetchApi<MeResponse>("/v1/me");
}

export async function provisionAccount(body: OnboardingRequest): Promise<MeResponse> {
  if (isDesignMode()) {
    return { ...getDesignModeWorkspace(), org_name: body.org_name, provisioned: true };
  }
  return fetchApi<MeResponse>("/v1/onboarding", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function renameProject(
  orgId: string,
  projectId: string,
  name: string,
): Promise<ProjectSummary> {
  if (isDesignMode()) return { id: projectId, name };
  const search = new URLSearchParams({ org_id: orgId });
  return fetchApi<ProjectSummary>(`/v1/projects/${projectId}?${search.toString()}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export async function deleteProject(
  orgId: string,
  projectId: string,
  confirmName: string,
): Promise<void> {
  if (isDesignMode()) return;
  const search = new URLSearchParams({ org_id: orgId });
  await fetchApi<void>(`/v1/projects/${projectId}?${search.toString()}`, {
    method: "DELETE",
    body: JSON.stringify({ confirm_name: confirmName }),
  });
}

export interface TraceListParams {
  orgId: string;
  limit?: number;
  offset?: number;
  status?: SpanStatus;
}

export async function getTraces(params: TraceListParams): Promise<TraceListResponse> {
  if (isDesignMode()) return mockTraceList;

  const search = new URLSearchParams({
    org_id: params.orgId,
    limit: String(params.limit ?? 50),
    offset: String(params.offset ?? 0),
  });
  if (params.status) search.set("status", params.status);
  return fetchApi<TraceListResponse>(`/v1/traces?${search.toString()}`);
}

export async function getTrace(traceId: string): Promise<TraceDetail> {
  if (isDesignMode()) return getMockTrace(traceId);
  return fetchApi<TraceDetail>(`/v1/traces/${traceId}`);
}

export async function getAgents(orgId: string): Promise<AgentListResponse> {
  if (isDesignMode()) return mockAgentList;
  const search = new URLSearchParams({ org_id: orgId });
  return fetchApi<AgentListResponse>(`/v1/agents?${search.toString()}`);
}

export async function getMetricsOverview(orgId: string): Promise<MetricsOverviewData> {
  if (isDesignMode()) return mockMetricsOverview;
  const search = new URLSearchParams({ org_id: orgId });
  const data = await fetchApi<MetricsOverviewData>(`/v1/metrics/overview?${search.toString()}`);
  return {
    ...data,
    failed_spans: data.failed_spans ?? [],
    trace_cost_distribution: data.trace_cost_distribution ?? [],
  };
}

function orgQuery(orgId: string): string {
  return new URLSearchParams({ org_id: orgId }).toString();
}

export async function getOrganization(orgId: string): Promise<OrganizationDetail> {
  if (isDesignMode()) return { ...mockOrganization, id: orgId };
  return fetchApi<OrganizationDetail>(`/v1/organization?${orgQuery(orgId)}`);
}

export async function updateOrganization(
  orgId: string,
  name: string,
): Promise<OrganizationDetail> {
  if (isDesignMode()) return { ...mockOrganization, id: orgId, name };
  return fetchApi<OrganizationDetail>(`/v1/organization?${orgQuery(orgId)}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export async function linkClerkOrganization(
  orgId: string,
  clerkOrgId: string,
): Promise<void> {
  if (isDesignMode()) return;
  await fetchApi<void>(`/v1/organization/clerk-link?${orgQuery(orgId)}`, {
    method: "PATCH",
    body: JSON.stringify({ clerk_org_id: clerkOrgId }),
  });
}

export async function getOrgMembers(orgId: string): Promise<OrgMembersResponse> {
  if (isDesignMode()) return structuredClone(mockOrgMembers);
  return fetchApi<OrgMembersResponse>(`/v1/organization/members?${orgQuery(orgId)}`);
}

export async function createOrgInvite(
  orgId: string,
  body: CreateInviteRequest,
): Promise<OrgInvite> {
  if (isDesignMode()) {
    return {
      id: `invite-${Date.now()}`,
      email: body.email.toLowerCase(),
      role: body.role,
      status: "pending",
      invited_by: "design-user",
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }
  return fetchApi<OrgInvite>(`/v1/organization/invites?${orgQuery(orgId)}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateOrgMemberRole(
  orgId: string,
  memberId: string,
  body: UpdateMemberRoleRequest,
): Promise<OrgMember> {
  if (isDesignMode()) {
    const member = mockOrgMembers.members.find((entry) => entry.id === memberId);
    if (!member) throw new ApiError("Member not found", 404);
    return { ...member, role: body.role };
  }
  return fetchApi<OrgMember>(`/v1/organization/members/${memberId}?${orgQuery(orgId)}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function removeOrgMember(orgId: string, memberId: string): Promise<void> {
  if (isDesignMode()) return;
  await fetchApi<void>(`/v1/organization/members/${memberId}?${orgQuery(orgId)}`, {
    method: "DELETE",
  });
}

export async function revokeOrgInvite(orgId: string, inviteId: string): Promise<void> {
  if (isDesignMode()) return;
  await fetchApi<void>(`/v1/organization/invites/${inviteId}?${orgQuery(orgId)}`, {
    method: "DELETE",
  });
}

export { ApiError };
