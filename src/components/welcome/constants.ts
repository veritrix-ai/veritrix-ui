export const COMPANY_SIZES = ["Just me", "2-10", "11-50", "51-200", "200+"] as const;

export const STAGES = [
  "Just playing around",
  "Building MVP",
  "In production",
  "Enterprise rollout",
] as const;

export const HEARD_FROM = [
  "LinkedIn",
  "Twitter / X",
  "Google search",
  "Friend or colleague",
  "Conference or meetup",
  "Other",
] as const;

export const FRAMEWORKS = [
  "CrewAI",
  "OpenAI Agents SDK",
  "LangGraph",
  "Autogen",
  "AG2",
  "Agno",
  "Google ADK",
  "Typescript",
  "LlamaIndex",
  "SmolAgents",
  "Camel AI",
  "TaskWeaver",
  "LlamaStack",
  "IBM WatsonX",
  "LlamaFS",
  "AgentStack",
  "Other",
] as const;

export const PROVIDERS = [
  "OpenAI",
  "Anthropic",
  "Gemini",
  "Cohere",
  "Groq",
  "Mistral",
  "DeepSeek",
  "Qwen",
  "Grok",
  "Cerebras",
  "LiteLLM",
  "OpenRouter",
  "Ollama",
] as const;

export const USAGE_OPTIONS = [
  {
    id: "hobby" as const,
    title: "Hobby",
    description: "Personal projects and experimentation",
    icon: "rocket",
  },
  {
    id: "work" as const,
    title: "Work",
    description: "Professional or commercial use",
    icon: "building",
  },
  {
    id: "help" as const,
    title: "Need help",
    description: "I'm not a developer—help me build an agent",
    icon: "wrench",
  },
] as const;

export const HELP_OPTIONS = [
  {
    id: "logging",
    title: "Logging and debugging",
    description: "I need to debug my agents and understand their logs",
    badge: "Debug sessions 10x faster",
  },
  {
    id: "spending",
    title: "Track spending",
    description: "I need to track how much I'm spending on LLMs",
    badge: "Track LLM provider spend",
  },
  {
    id: "evaluation",
    title: "Evaluation and benchmarking",
    description: "I want to evaluate and test the performance of my agents",
    badge: "Evaluate runs faster",
  },
  {
    id: "deployments",
    title: "Deployments",
    description: "I want to deploy my agents to production",
    badge: "Manage production agents",
  },
  {
    id: "unsure",
    title: "Not sure yet",
    description: "",
    badge: "",
  },
];

export const RESOURCE_DOCS: Record<string, string> = {
  "Google ADK": "https://google.github.io/adk-docs/",
  DeepSeek: "https://api-docs.deepseek.com/",
  CrewAI: "https://docs.crewai.com/",
  LangGraph: "https://langchain-ai.github.io/langgraph/",
  "OpenAI Agents SDK": "https://platform.openai.com/docs/guides/agents",
  LlamaIndex: "https://docs.llamaindex.ai/",
  OpenAI: "https://platform.openai.com/docs",
  Anthropic: "https://docs.anthropic.com/",
  Gemini: "https://ai.google.dev/gemini-api/docs",
};
