import { describe, expect, it } from "vitest";
import { listMarketplace, MCP_MARKETPLACE_CATALOG, getMarketplaceEntry } from "./catalog.js";
import { UniversalMcpCapabilitySchema } from "./types.js";

describe("mcp marketplace", () => {
  it("includes required providers", () => {
    const ids = MCP_MARKETPLACE_CATALOG.map((e) => e.id);
    for (const id of ["supabase", "github", "kubernetes", "openai", "anthropic", "cloudflare"]) {
      expect(ids).toContain(id);
    }
  });

  it("every entry satisfies universal capabilities schema", () => {
    for (const entry of MCP_MARKETPLACE_CATALOG) {
      expect(UniversalMcpCapabilitySchema.parse(entry.capabilities).tools).toBe(true);
    }
  });

  it("filters by query", () => {
    expect(listMarketplace({ q: "vector" }).length).toBeGreaterThan(0);
    expect(getMarketplaceEntry("supabase")?.featured).toBe(true);
  });
});
