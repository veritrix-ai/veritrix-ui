export interface McpToolDefinition {
  name: string;
  description: string;
  parameters: string;
  returns?: string;
}

export const MCP_TOOLS: McpToolDefinition[] = [
  {
    name: "auth",
    description:
      "Authorize using a Veritrix project API key. The server will automatically prompt for this when needed.",
    parameters: "api_key (string)",
  },
  {
    name: "get_project",
    description: "Get details about the current project.",
    parameters: "None",
    returns: "Project information including ID, name, and environment",
  },
  {
    name: "get_trace",
    description: "Get trace information by ID.",
    parameters: "trace_id (string)",
    returns: "Trace details and metrics",
  },
  {
    name: "get_span",
    description: "Get span information by ID.",
    parameters: "span_id (string)",
    returns: "Span attributes and metrics",
  },
  {
    name: "get_complete_trace",
    description: "Get complete trace information by ID.",
    parameters: "trace_id (string)",
    returns: "Complete trace and associated span details",
  },
];

export interface McpInstallTarget {
  id: string;
  label: string;
  filename?: string;
  intro?: string;
  paths?: Array<{ platform: string; path: string }>;
  language?: string;
  buildConfig: (apiKey: string) => string;
}

export function buildMcpServerConfig(apiKey: string): string {
  return JSON.stringify(
    {
      mcpServers: {
        veritrix: {
          command: "npx",
          args: ["-y", "veritrix-mcp"],
          env: {
            VERITRIX_API_KEY: apiKey || "YOUR_API_KEY",
          },
        },
      },
    },
    null,
    2,
  );
}

export function buildCursorMcpConfig(apiKey: string): string {
  return JSON.stringify(
    {
      mcpServers: {
        veritrix: {
          command: "npx",
          args: ["-y", "veritrix-mcp@latest"],
          env: {
            VERITRIX_API_KEY: apiKey || "YOUR_API_KEY",
          },
        },
      },
    },
    null,
    2,
  );
}

export const MCP_INSTALL_TARGETS: McpInstallTarget[] = [
  {
    id: "cursor",
    label: "Cursor",
    filename: ".cursor/mcp.json",
    intro: "Add to your Cursor MCP configuration file.",
    paths: [{ platform: "Project", path: ".cursor/mcp.json" }],
    language: "json",
    buildConfig: buildCursorMcpConfig,
  },
  {
    id: "claude",
    label: "Claude Desktop",
    filename: "claude_desktop_config.json",
    intro: "Add to your Claude Desktop configuration file.",
    paths: [
      {
        platform: "macOS",
        path: "~/Library/Application Support/Claude/claude_desktop_config.json",
      },
      {
        platform: "Windows",
        path: "%APPDATA%\\Claude\\claude_desktop_config.json",
      },
    ],
    language: "json",
    buildConfig: buildMcpServerConfig,
  },
  {
    id: "vscode",
    label: "VSCode, Windsurf, and Zed",
    filename: "mcp.json",
    intro: "Add to your editor MCP settings (location varies by tool).",
    paths: [
      { platform: "VS Code", path: ".vscode/mcp.json" },
      { platform: "Windsurf", path: "~/.codeium/windsurf/mcp_config.json" },
    ],
    language: "json",
    buildConfig: buildMcpServerConfig,
  },
  {
    id: "smithery",
    label: "Smithery",
    intro: "Install via Smithery CLI (coming soon).",
    buildConfig: () => "npx -y @smithery/cli install veritrix-mcp",
    language: "bash",
  },
];

export const MCP_FEEDBACK_URL = "mailto:support@veritrix.ai?subject=MCP%20Server%20Feedback";

/** Placeholder until workspace API keys are wired. */
export const MCP_DEMO_API_KEY = "vx_sk_demo_xxxxxxxxxxxxxxxx";
