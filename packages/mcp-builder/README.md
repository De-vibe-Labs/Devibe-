# `@devibe/mcp-builder`

Compose MCP servers from plugins and emit client configs + TypeScript bootstraps.

```ts
import { createMcpServerDefinition } from "@devibe/mcp-builder";

const server = createMcpServerDefinition({
  name: "fleet-cloud",
  plugins: ["cloud"],
  cloud: { primary: "cloudflare", adapters: ["cloudflare", "aws", "gcp", "azure"], mock: true },
});
```

The **cloud** plugin registers MCS tools (`deploy_application`, `scale_service`, …) aligned with `@devibe/cloud-providers`.
