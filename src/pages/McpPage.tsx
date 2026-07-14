import { useWorkspace } from "@/components/workspace/WorkspaceProvider";
import { McpView } from "@/components/mcp/McpView";
import { MCP_DEMO_API_KEY } from "@/components/mcp/mcp-content";

export function McpPage() {
  const workspace = useWorkspace();
  const apiKey = workspace.api_keys[0]?.key_value ?? MCP_DEMO_API_KEY;

  return (
    <div className="px-10 py-8">
      <h1 className="text-[2rem] font-semibold tracking-tight text-foreground">MCP Server</h1>
      <div className="mt-6">
        <McpView apiKey={apiKey} />
      </div>
    </div>
  );
}
