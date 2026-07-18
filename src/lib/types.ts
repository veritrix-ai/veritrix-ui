export type SpanStatus = "ok" | "error";
export type SpanType = "agent" | "tool" | "llm" | "delegation" | "other";
export type Framework = "langchain" | "crewai" | "manual" | "openai";

export interface Span {
  trace_id: string;
  span_id: string;
  parent_span_id: string | null;
  agent_id: string;
  agent_name: string;
  run_id: string;
  framework: Framework;
  span_type: SpanType;
  start_time: string;
  end_time: string;
  duration_ms: number;
  status: SpanStatus;
  error_message: string | null;
  attributes: Record<string, unknown>;
  input_preview: string;
  output_preview: string;
  model?: string;
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  cost_usd?: number | null;
}

export interface TraceDetailMeta {
  name: string;
  version?: string;
  model?: string;
  duration_ms: number;
  total_cost_usd?: number | null;
  llm_calls: number;
  tool_calls: number;
  errors: number;
  total_tokens: number;
  tags: string[];
  start_time: string;
}

export interface TraceAgentDetail {
  name: string;
  handoffs: string[];
  tools: string[];
}

export interface TraceDetail {
  trace_id: string;
  run_id: string;
  spans: Span[];
  meta?: TraceDetailMeta;
  agents?: TraceAgentDetail[];
}

export interface TraceSummary {
  trace_id: string;
  run_id: string;
  agent_name: string;
  name?: string;
  status: SpanStatus;
  duration_ms: number;
  span_count: number;
  start_time: string;
  tags?: string[];
  cost_usd?: number;
  error_count?: number;
}

export interface TraceMetrics {
  total_cost_usd: number;
  tokens_generated: number;
  fail_rate: number | null;
  total_events: number;
  monthly_spans?: number;
  monthly_span_limit?: number;
}

export interface SpanEndStatePoint {
  date: string;
  success: number;
  indeterminate: number;
  fail: number;
}

export interface SpanEndStateDistribution {
  success: number;
  indeterminate: number;
  fail: number;
}

export interface MetricsHistogramBucket {
  label: string;
  value: number;
}

export interface MetricsOverviewData {
  overview: Required<Pick<TraceMetrics, "monthly_spans" | "monthly_span_limit">> & TraceMetrics;
  span_end_states: SpanEndStatePoint[];
  span_end_states_distribution: SpanEndStateDistribution;
  spans_per_trace: MetricsHistogramBucket[];
  trace_duration_distribution: MetricsHistogramBucket[];
  failed_spans: MetricsHistogramBucket[];
  trace_cost_distribution: MetricsHistogramBucket[];
}

export type OrgRole = "owner" | "admin" | "member" | "viewer";
export type InviteRole = "admin" | "member" | "viewer";
export type InviteStatus = "pending" | "accepted" | "revoked" | "expired";

export interface OrganizationDetail {
  id: string;
  name: string;
  created_at: string;
  member_count: number;
  pending_invite_count: number;
}

export interface OrgMember {
  id: string;
  email: string;
  role: OrgRole;
  clerk_user_id: string | null;
  joined_at: string;
}

export interface OrgInvite {
  id: string;
  email: string;
  role: InviteRole;
  status: InviteStatus;
  invited_by: string | null;
  created_at: string;
  expires_at: string;
}

export interface OrgMembersResponse {
  members: OrgMember[];
  invites: OrgInvite[];
}

export interface CreateInviteRequest {
  email: string;
  role: InviteRole;
}

export interface UpdateMemberRoleRequest {
  role: InviteRole;
}

export interface TraceListResponse {
  traces: TraceSummary[];
  total: number;
  metrics?: TraceMetrics;
}

export interface AgentSummary {
  agent_id: string;
  agent_name: string;
  framework: Framework;
  total_runs: number;
  error_rate: number;
  avg_duration_ms: number;
  last_seen: string;
}

export interface AgentListResponse {
  agents: AgentSummary[];
}

export interface ProjectSummary {
  id: string;
  name: string;
}

export interface ApiKeySummary {
  id: string;
  key_value: string;
  name: string;
  project_name: string;
}

export interface MeResponse {
  clerk_user_id: string;
  email: string;
  org_id: string | null;
  clerk_org_id: string | null;
  org_name: string | null;
  projects: ProjectSummary[];
  api_keys: ApiKeySummary[];
  provisioned: boolean;
}

export interface OnboardingRequest {
  org_name: string;
  email?: string;
  clerk_org_id?: string;
  usage: "hobby" | "work" | "help";
  company_size: string;
  building_description: string;
  stage: string;
  heard_from: string;
  frameworks: string[];
  providers: string[];
  help_goals: string[];
}
