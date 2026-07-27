import { describe, expect, it, beforeEach } from "vitest";
import { resetMockCloudStore } from "@devibe/cloud-providers";
import { parseProjectYaml } from "@devibe/project-config";
import {
  manageProject,
  syncFromPrd,
  resetOrchestrationMemory,
} from "../src/services/orchestration.js";
import { toolNames, describeRouting } from "../src/registry.js";

const SAMPLE = `
devibe:
  version: 1
  tags:
    - github-connected
    - cloud-enabled
    - auto-scale
  github:
    owner: De-vibe-Labs
    repo: genesis-alpha
    default_branch: main
  cloud:
    primary: cloudflare
    adapters: [cloudflare, aws, gcp, azure]
    region_preference: auto
    scale_policy: cost-optimized
  memory:
    project_id: 550e8400-e29b-41d4-a716-446655440000
`;

describe("orchestration MCP loop", () => {
  beforeEach(() => {
    resetMockCloudStore();
    resetOrchestrationMemory();
  });

  it("exposes manage_project and sync_from_prd", () => {
    expect(toolNames).toEqual(["manage_project", "sync_from_prd"]);
    expect(describeRouting().agents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ role: "devops" }),
        expect.objectContaining({ role: "security" }),
      ]),
    );
  });

  it("sync_from_prd unlocks management and can auto-plan", async () => {
    const { project } = parseProjectYaml(SAMPLE);
    const result = await syncFromPrd({
      project,
      autoManage: true,
      manageAction: "plan",
      actor: "test",
    });
    expect(result.ok).toBe(true);
    expect(result.banner).toMatch(/full lifecycle management/i);
    expect(result.followUp?.plan?.mock).toBe(true);
    expect(result.followUp?.iacPreview).toMatch(/pulumi/i);
  });

  it("manage_project apply provisions mocked multi-kind resources", async () => {
    const { project } = parseProjectYaml(SAMPLE);
    const result = await manageProject({
      project,
      action: "apply",
      approved: true,
      actor: "test",
    });
    expect(result.ok).toBe(true);
    expect(result.apply?.mock).toBe(true);
    expect(result.resources?.length).toBeGreaterThanOrEqual(5);
    expect(result.events.some((e) => e.agent === "security")).toBe(true);
    expect(result.events.some((e) => e.agent === "qa")).toBe(true);
  });

  it("blocks apply without approval when high-cost on non-CF primary", async () => {
    const { project } = parseProjectYaml(`
devibe:
  version: 1
  tags: [github-connected, cloud-enabled]
  github:
    owner: acme
    repo: heavy
  cloud:
    primary: aws
    adapters: [aws]
    scale_policy: performance
  memory:
    project_id: 550e8400-e29b-41d4-a716-446655440001
`);
    const result = await manageProject({
      project,
      action: "apply",
      approved: false,
      actor: "test",
    });
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/approval/i);
  });
});
