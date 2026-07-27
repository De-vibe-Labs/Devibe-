#!/usr/bin/env node
/**
 * Stdio MCP entrypoint. For demos without an MCP host, use:
 *   pnpm --filter @devibe/mcp-server exec tsx src/demo.ts
 */
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpServer } from "./registry.js";

async function main(): Promise<void> {
  const server = createMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
