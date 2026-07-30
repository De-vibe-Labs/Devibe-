import { describe, expect, it } from "vitest";
import { createMcpServerDefinition, listAvailablePlugins, cloudPluginTools } from "./index.js";

describe("mcp-builder", () => {
  it("lists plugins including cloud", () => {
    const plugins = listAvailablePlugins();
    expect(plugins.some((p) => p.id === "cloud")).toBe(true);
  });

  it("builds a server with cloud plugin MCS tools", () => {
    const def = createMcpServerDefinition({
      name: "fleet-cloud",
      plugins: ["cloud"],
      transport: "stdio",
      cloud: {
        primary: "cloudflare",
        adapters: ["cloudflare", "aws"],
        mock: true,
      },
    });
    expect(def.tools.some((t) => t.name === "deploy_application")).toBe(true);
    expect(def.tools.some((t) => t.name === "manage_project")).toBe(true);
    expect(def.clientConfig.mcpServers).toBeTruthy();
    expect(def.bootstrapTs).toContain("createMcpServer");
    expect(def.cloud?.primary).toBe("cloudflare");
  });

  it("exposes stable MCS cloud tool set", () => {
    const tools = cloudPluginTools({
      primary: "cloudflare",
      adapters: ["cloudflare"],
      mock: true,
    });
    expect(tools.map((t) => t.name)).toContain("scale_service");
    expect(tools.map((t) => t.name)).toContain("list_regions");
  });
});
