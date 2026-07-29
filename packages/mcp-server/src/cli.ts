#!/usr/bin/env node
/**
 * Stdio MCP entrypoint. For demos without an MCP host, use:
 *   pnpm --filter @devibe/mcp-server exec tsx src/demo.ts
 *
 * Enable cloud plugin tools:
 *   pnpm --filter @devibe/mcp-server start -- --plugins=cloud
 */
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer, type CreateMcpServerOptions } from "./registry.js";

function parsePlugins(): CreateMcpServerOptions {
  const pluginsFlag = process.argv.find((a) => a.startsWith("--plugins="));
  const plugins = pluginsFlag
    ? pluginsFlag
        .slice("--plugins=".length)
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean)
    : ["cloud"];
  return {
    plugins: plugins as CreateMcpServerOptions["plugins"],
    cloud: { primary: "cloudflare", mock: true },
  };
}

async function main(): Promise<void> {
  const server = createMcpServer(parsePlugins());
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
