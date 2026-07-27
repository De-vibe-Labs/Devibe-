import { describe, expect, it, beforeEach } from "vitest";
import {
  getAdapter,
  listAdapters,
  resetMockCloudStore,
  cloudflareAdapter,
} from "../src/index.js";

describe("mocked cloud adapters", () => {
  beforeEach(() => {
    resetMockCloudStore();
  });

  it("registers all four providers", () => {
    expect(listAdapters().map((a) => a.id).sort()).toEqual([
      "aws",
      "azure",
      "cloudflare",
      "gcp",
    ]);
  });

  it("plans and applies a Cloudflare stack end-to-end", async () => {
    const plan = await cloudflareAdapter.plan({
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      projectName: "genesis-alpha",
      scalePolicy: "cost-optimized",
      regionPreference: "auto",
      actor: "devops-agent",
    });
    expect(plan.mock).toBe(true);
    expect(plan.changes.length).toBeGreaterThanOrEqual(5);
    expect(plan.provider).toBe("cloudflare");

    const applied = await cloudflareAdapter.apply({
      plan,
      productionAuto: false,
      approved: true,
      actor: "devops-agent",
    });
    expect(applied.resources.every((r) => r.status === "active")).toBe(true);

    const listed = await cloudflareAdapter.listResources(plan.projectId);
    expect(listed.length).toBe(applied.resources.length);

    const scaled = await cloudflareAdapter.scale({
      projectId: plan.projectId,
      service: "edge-worker",
      desired: 4,
      environment: "production",
      actor: "orchestrator",
    });
    expect(scaled.current).toBe(4);
    expect(scaled.mock).toBe(true);
  });

  it("blocks high-cost apply without approval when production_auto is false", async () => {
    const aws = getAdapter("aws");
    const plan = await aws.plan({
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      projectName: "genesis-alpha",
      scalePolicy: "performance",
      regionPreference: "us-west-2",
      actor: "devops-agent",
    });
    expect(plan.estimatedDeltaUsdPerMonth).toBeGreaterThan(50);

    await expect(
      aws.apply({
        plan,
        productionAuto: false,
        approved: false,
        actor: "devops-agent",
      }),
    ).rejects.toThrow(/Human approval required/);
  });
});
