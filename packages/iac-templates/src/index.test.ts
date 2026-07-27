import { describe, expect, it } from "vitest";
import { renderCloudflarePulumiModule, listTemplateIds } from "../src/index.js";

describe("pulumi cloudflare template", () => {
  it("renders a TypeScript module with Workers/D1/R2/Queue/Pages", () => {
    const src = renderCloudflarePulumiModule({
      projectName: "Genesis Alpha",
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      scalePolicy: "cost-optimized",
    });
    expect(listTemplateIds()).toContain("pulumi-cloudflare-small-scale");
    expect(src).toMatch(/@pulumi\/cloudflare/);
    expect(src).toMatch(/D1Database/);
    expect(src).toMatch(/R2Bucket/);
    expect(src).toMatch(/WorkersScript/);
    expect(src).toMatch(/PagesProject/);
    expect(src).toMatch(/genesis-alpha/);
  });
});
