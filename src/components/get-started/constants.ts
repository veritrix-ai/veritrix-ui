import type { ExampleItem, GetStartedStep, PricingPlan } from "./types";

export const GET_STARTED_STEPS: { id: GetStartedStep; label: string }[] = [
  { id: "choose", label: "Get Started" },
  { id: "install", label: "Install" },
  { id: "plans", label: "Plans" },
  { id: "verify", label: "Verify" },
];

export const DEFAULT_API_KEY = "ao_live_7f3a9c2e1b8d4f6a5e0c9b2a1d8e7f6b60f6fec";

export const FRAMEWORK_EXAMPLES: ExampleItem[] = [
  {
    id: "crewai-job-posting",
    tab: "frameworks",
    name: "Job Posting Generator",
    subtitle: "CrewAI",
    framework: "CrewAI",
    bullets: [
      "Multi-agent system for job posting generation",
      "Research Analyst agent for market research",
      "Writer Agent for content creation",
      "Review Specialist for quality assurance",
    ],
    colabUrl: "https://colab.research.google.com/github/AgentOps-AI/agentops",
    examplesUrl: "https://github.com/AgentOps-AI/agentops/tree/main/examples",
    accentClass: "bg-sky-100 text-sky-700",
  },
  {
    id: "openai-customer-service",
    tab: "frameworks",
    name: "Customer Service System",
    subtitle: "OpenAI Agents SDK",
    framework: "OpenAI Agents SDK",
    bullets: [
      "Multi-agent airline customer service system",
      "FAQ Agent for common questions",
      "Seat Booking Agent for reservations",
      "Triage Agent for routing requests",
    ],
    colabUrl: "https://colab.research.google.com/github/AgentOps-AI/agentops",
    examplesUrl: "https://github.com/AgentOps-AI/agentops/tree/main/examples",
    accentClass: "bg-violet-100 text-violet-700",
  },
  {
    id: "google-adk-data-science",
    tab: "frameworks",
    name: "Data Science Assistant",
    subtitle: "Google ADK",
    framework: "Google ADK",
    bullets: [
      "Data analysis and visualization agent",
      "SQL query generation and execution",
      "Chart and report generation",
    ],
    colabUrl: "https://colab.research.google.com/github/AgentOps-AI/agentops",
    examplesUrl: "https://github.com/AgentOps-AI/agentops/tree/main/examples",
    accentClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "agno-finance",
    tab: "frameworks",
    name: "Finance Agent",
    subtitle: "Agno",
    framework: "Agno",
    bullets: [
      "Financial data analysis agent",
      "Portfolio tracking and insights",
      "Market trend analysis",
    ],
    colabUrl: "https://colab.research.google.com/github/AgentOps-AI/agentops",
    examplesUrl: "https://github.com/AgentOps-AI/agentops/tree/main/examples",
    accentClass: "bg-amber-100 text-amber-700",
  },
  {
    id: "ag2-stock",
    tab: "frameworks",
    name: "Stock Analysis",
    subtitle: "AG2",
    framework: "AG2",
    bullets: [
      "Multi-agent stock analysis system",
      "Research and data gathering agents",
      "Investment recommendation synthesis",
    ],
    colabUrl: "https://colab.research.google.com/github/AgentOps-AI/agentops",
    examplesUrl: "https://github.com/AgentOps-AI/agentops/tree/main/examples",
    accentClass: "bg-rose-100 text-rose-700",
  },
];

export const PROVIDER_EXAMPLES: ExampleItem[] = [
  {
    id: "xai-grok-vision",
    tab: "providers",
    name: "Grok Vision",
    subtitle: "xAI",
    framework: "xAI",
    bullets: [
      "Multimodal AI with vision capabilities",
      "Process images and text together",
      "Build vision-enabled applications",
    ],
    colabUrl: "https://colab.research.google.com/github/AgentOps-AI/agentops",
    examplesUrl: "https://github.com/AgentOps-AI/agentops/tree/main/examples",
    accentClass: "bg-muted text-muted-foreground",
  },
  {
    id: "openai-sync",
    tab: "providers",
    name: "OpenAI Example (Sync)",
    subtitle: "OpenAI",
    framework: "OpenAI",
    bullets: [
      "Synchronous OpenAI API integration",
      "Basic agent tracing setup",
      "Token and cost tracking",
    ],
    colabUrl: "https://colab.research.google.com/github/AgentOps-AI/agentops",
    examplesUrl: "https://github.com/AgentOps-AI/agentops/tree/main/examples",
    accentClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "openai-async",
    tab: "providers",
    name: "OpenAI Example (Async)",
    subtitle: "OpenAI",
    framework: "OpenAI",
    bullets: [
      "Asynchronous OpenAI API integration",
      "Concurrent request handling",
      "Performance-optimized tracing",
    ],
    colabUrl: "https://colab.research.google.com/github/AgentOps-AI/agentops",
    examplesUrl: "https://github.com/AgentOps-AI/agentops/tree/main/examples",
    accentClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "openai-web-search",
    tab: "providers",
    name: "Web Search with OpenAI",
    subtitle: "OpenAI",
    framework: "OpenAI",
    bullets: [
      "Agent with web search capabilities",
      "Real-time information retrieval",
      "Search result synthesis",
    ],
    colabUrl: "https://colab.research.google.com/github/AgentOps-AI/agentops",
    examplesUrl: "https://github.com/AgentOps-AI/agentops/tree/main/examples",
    accentClass: "bg-emerald-100 text-emerald-700",
  },
];

export const ALL_EXAMPLES = [...FRAMEWORK_EXAMPLES, ...PROVIDER_EXAMPLES];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: "$0",
    period: "per month",
    description: "Free up to 100 sessions",
    cta: "Start for Free",
    features: [
      "Agent Agnostic SDK",
      "LLM Cost Tracking",
      "Replay Analytics",
      "1 Project",
      "7 Day Log Retention",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$40",
    period: "per month",
    description: "Up to 1,000 sessions",
    cta: "Upgrade",
    highlighted: true,
    features: [
      "Everything in Basic",
      "Increased event limit",
      "Unlimited log retention",
      "Trace/event export",
      "Dedicated support",
      "RBAC",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "starts at",
    description: "Going beyond? Let's chat",
    cta: "Get a Demo",
    features: [
      "Everything in Pro",
      "SLA",
      "Custom SSO",
      "On-premise deployment",
      "SOC-2, HIPAA, GDPR, ISO27001",
    ],
  },
];

export const EXISTING_CODEBASE_SNIPPET = `pip install "git+https://github.com/AgentOps-AI/agentops.git#subdirectory=sdk"

import veritrix

veritrix.init(api_key="YOUR_API_KEY")`;
