import { mockMetricsOverview } from "@/lib/mock-metrics";
import {
  MOCK_CURRENT_USER_EMAIL,
  mockApiKeys,
  mockOrganization,
  mockOrgMembers,
} from "@/lib/mock-settings";
import { getMockTraceDetail } from "@/lib/mock-trace-detail";
import { mockTraceMetrics, mockTraces } from "@/lib/mock-traces";
import type {
  AgentListResponse,
  MeResponse,
  TraceDetail,
  TraceListResponse,
} from "@/lib/types";

export const DEMO_ORG_ID = "11111111-1111-1111-1111-111111111111";

export function getDesignModeWorkspace(): MeResponse {
  return {
    clerk_user_id: "design-user",
    email: MOCK_CURRENT_USER_EMAIL,
    org_id: DEMO_ORG_ID,
    org_name: mockOrganization.name,
    provisioned: true,
    projects: [{ id: "22222222-2222-2222-2222-222222222222", name: "Default Project" }],
    api_keys: mockApiKeys.map((entry, index) => ({
      id: `mock-key-${index + 1}`,
      key_value: entry.apiKey,
      name: "Development Key",
      project_name: entry.projectName,
    })),
  };
}

export const mockTraceList: TraceListResponse = {
  total: mockTraces.length,
  metrics: mockTraceMetrics,
  traces: mockTraces,
};

export function getMockTrace(traceId: string): TraceDetail {
  return getMockTraceDetail(traceId) ?? getMockTraceDetail("trace_cs_001")!;
}

export const mockAgentList: AgentListResponse = {
  agents: [
    {
      agent_id: "agent_research",
      agent_name: "Research Agent",
      framework: "crewai",
      total_runs: 128,
      error_rate: 0.08,
      avg_duration_ms: 6200,
      last_seen: "2026-07-10T10:14:22.000Z",
    },
    {
      agent_id: "agent_support",
      agent_name: "Support Router",
      framework: "langchain",
      total_runs: 412,
      error_rate: 0.02,
      avg_duration_ms: 1800,
      last_seen: "2026-07-10T09:58:11.000Z",
    },
    {
      agent_id: "agent_sales",
      agent_name: "Sales Crew",
      framework: "crewai",
      total_runs: 86,
      error_rate: 0.12,
      avg_duration_ms: 4900,
      last_seen: "2026-07-10T09:41:03.000Z",
    },
  ],
};

export {
  mockMetricsOverview,
  mockOrganization,
  mockOrgMembers,
};
