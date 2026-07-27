import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { TOOLS, type ToolContext } from "./tools/index.js";
import { AGENTS } from "./agents/index.js";

const SERVER_INFO = { name: "devibe-mcp-server", version: "0.1.0" } as const;

function resultOf(value: unknown): CallToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
    structuredContent:
      value && typeof value === "object"
        ? (value as Record<string, unknown>)
        : { value },
  };
}

function errorResult(err: unknown): CallToolResult {
  const message = err instanceof Error ? err.message : String(err);
  return {
    content: [{ type: "text", text: JSON.stringify({ error: message }, null, 2) }],
    isError: true,
  };
}

function actorFrom(extra: {
  authInfo?: { clientId?: string; extra?: Record<string, unknown> };
}): string {
  const fromExtra = extra.authInfo?.extra?.["actorId"];
  if (typeof fromExtra === "string" && fromExtra) return fromExtra;
  return extra.authInfo?.clientId ?? "anonymous";
}

interface RegistrableTool {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: never, ctx: ToolContext) => Promise<unknown>;
}

function registerTool(server: McpServer, tool: RegistrableTool): void {
  (server as McpServer & {
    registerTool: (
      name: string,
      config: { title: string; description: string; inputSchema: unknown },
      handler: (args: unknown, extra: unknown) => Promise<CallToolResult>,
    ) => void;
  }).registerTool(
    tool.name,
    {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
    },
    async (args: unknown, extra: unknown): Promise<CallToolResult> => {
      const ctx: ToolContext = { actorId: actorFrom(extra as never) };
      try {
        const out = await tool.handler(args as never, ctx);
        return resultOf(out);
      } catch (err) {
        return errorResult(err);
      }
    },
  );
}

export function describeRouting(): Record<string, unknown> {
  return {
    agents: AGENTS.map((a) => ({
      role: a.role,
      name: a.name,
      description: a.description,
      tools: a.tools,
    })),
    tools: TOOLS.map((t) => t.name),
    phase: "1-mocked-multi-cloud",
  };
}

/** Build an MCP server exposing manage_project + sync_from_prd. */
export function createMcpServer(): McpServer {
  const server = new McpServer(SERVER_INFO, {
    capabilities: { tools: {}, resources: {} },
  });

  for (const tool of TOOLS) {
    registerTool(server, tool as unknown as RegistrableTool);
  }

  server.registerResource(
    "routing",
    "devibe://routing",
    { title: "DeVibe agent & tool routing", mimeType: "application/json" },
    async () => ({
      contents: [
        {
          uri: "devibe://routing",
          mimeType: "application/json",
          text: JSON.stringify(describeRouting(), null, 2),
        },
      ],
    }),
  );

  server.registerResource(
    "project-schema",
    "devibe://project-schema",
    { title: "DeVibe project.yaml schema notes", mimeType: "text/markdown" },
    async () => ({
      contents: [
        {
          uri: "devibe://project-schema",
          mimeType: "text/markdown",
          text: [
            "# .devibe/project.yaml",
            "",
            "Required tags for full lifecycle management:",
            "- `github-connected`",
            "- `cloud-enabled`",
            "",
            "Optional: `auto-scale`",
            "",
            "Providers (mocked in Phase 1): cloudflare, aws, gcp, azure",
          ].join("\n"),
        },
      ],
    }),
  );

  return server;
}

export const toolNames = TOOLS.map((t) => t.name);
