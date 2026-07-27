import type { CloudProviderId } from "@devibe/project-config";
import type {
  ApplyInput,
  ApplyResult,
  AuditEntry,
  CloudProviderInterface,
  CloudResource,
  InfrastructurePlan,
  PlanChange,
  PlanInput,
  ProviderCapabilities,
  ResourceKind,
  ScaleResult,
  ScaleTarget,
} from "./types.js";

function now(): string {
  return new Date().toISOString();
}

function id(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

const STORE = new Map<string, CloudResource[]>();

function key(provider: CloudProviderId, projectId: string): string {
  return `${provider}::${projectId}`;
}

export interface MockAdapterOptions {
  id: CloudProviderId;
  displayName: string;
  capabilities: ProviderCapabilities;
  /** Default region label when preference is "auto". */
  defaultRegion: string;
  /** Blueprint used when planning a small-scale stack. */
  blueprint: Array<{
    kind: ResourceKind;
    name: string;
    monthlyUsd: number;
    meta?: Record<string, unknown>;
  }>;
}

/**
 * Fully mocked adapter — plan/apply/scale/destroy mutate an in-memory store only.
 * Safe for demos without cloud credentials.
 */
export function createMockAdapter(opts: MockAdapterOptions): CloudProviderInterface {
  const auditLog: AuditEntry[] = [];

  function audit(action: string, detail: string, actor: string): AuditEntry {
    const entry: AuditEntry = {
      at: now(),
      provider: opts.id,
      action,
      detail,
      actor,
    };
    auditLog.push(entry);
    return entry;
  }

  function resolveRegion(pref: string): string {
    return !pref || pref === "auto" ? opts.defaultRegion : pref;
  }

  return {
    id: opts.id,
    displayName: opts.displayName,
    capabilities: opts.capabilities,

    async plan(input: PlanInput): Promise<InfrastructurePlan> {
      const region = resolveRegion(input.regionPreference);
      const wants = new Set(input.wants ?? opts.blueprint.map((b) => b.kind));
      const existing = STORE.get(key(opts.id, input.projectId)) ?? [];
      const existingNames = new Set(existing.map((r) => r.name));

      const changes: PlanChange[] = [];
      for (const item of opts.blueprint) {
        if (!wants.has(item.kind)) continue;
        const resource: CloudResource = {
          id: id(item.kind),
          provider: opts.id,
          kind: item.kind,
          name: `${input.projectName}-${item.name}`,
          region,
          status: "planned",
          estimatedMonthlyUsd: scaleCost(item.monthlyUsd, input.scalePolicy),
          meta: { ...item.meta, mock: true },
        };
        changes.push({
          action: existingNames.has(resource.name) ? "update" : "create",
          resource,
          summary: `${existingNames.has(resource.name) ? "Update" : "Create"} ${item.kind} ${resource.name} on ${opts.displayName}`,
        });
      }

      const plan: InfrastructurePlan = {
        planId: id("plan"),
        provider: opts.id,
        projectId: input.projectId,
        scalePolicy: input.scalePolicy,
        changes,
        estimatedDeltaUsdPerMonth: changes.reduce(
          (sum, c) => sum + (c.action === "create" ? c.resource.estimatedMonthlyUsd : 0),
          0,
        ),
        mock: true,
        createdAt: now(),
      };
      audit("plan", `Generated ${changes.length} changes (Δ $${plan.estimatedDeltaUsdPerMonth}/mo)`, input.actor);
      return plan;
    },

    async apply(input: ApplyInput): Promise<ApplyResult> {
      const { plan, productionAuto, actor, approved = true } = input;
      const destructive = plan.changes.some((c) => c.action === "destroy" || c.action === "replace");
      const highCost = plan.estimatedDeltaUsdPerMonth > 50;

      if ((destructive || highCost) && !productionAuto && !approved) {
        throw new Error(
          `Human approval required for ${destructive ? "destructive" : "high-cost"} apply on ${opts.id} (production_auto=false).`,
        );
      }

      const resources: CloudResource[] = plan.changes.map((c) => ({
        ...c.resource,
        status: "active" as const,
      }));
      STORE.set(key(opts.id, plan.projectId), resources);

      const entries = [
        audit("apply", `Applied plan ${plan.planId} → ${resources.length} resources`, actor),
      ];

      return {
        applyId: id("apply"),
        planId: plan.planId,
        provider: opts.id,
        resources,
        audit: entries,
        mock: true,
        appliedAt: now(),
      };
    },

    async scale(
      input: ScaleTarget & { projectId: string; actor: string },
    ): Promise<ScaleResult> {
      const resources = STORE.get(key(opts.id, input.projectId)) ?? [];
      const match =
        resources.find((r) => r.name.includes(input.service) && r.kind === "compute") ??
        resources.find((r) => r.kind === "compute");
      const previous = typeof match?.meta.capacity === "number" ? match.meta.capacity : 1;
      if (match) {
        match.meta.capacity = input.desired;
        match.status = "scaling";
        // settle
        match.status = "active";
      }
      audit(
        "scale",
        `Scaled ${input.service} ${previous} → ${input.desired} (${input.environment})`,
        input.actor,
      );
      return {
        provider: opts.id,
        service: input.service,
        previous,
        current: input.desired,
        region: match?.region ?? opts.defaultRegion,
        mock: true,
        scaledAt: now(),
      };
    },

    async listResources(projectId: string): Promise<CloudResource[]> {
      return [...(STORE.get(key(opts.id, projectId)) ?? [])];
    },

    async destroy(projectId: string, actor: string): Promise<ApplyResult> {
      const existing = STORE.get(key(opts.id, projectId)) ?? [];
      STORE.delete(key(opts.id, projectId));
      const entries = [audit("destroy", `Destroyed ${existing.length} resources`, actor)];
      return {
        applyId: id("apply"),
        planId: id("plan"),
        provider: opts.id,
        resources: existing.map((r) => ({ ...r, status: "destroyed" })),
        audit: entries,
        mock: true,
        appliedAt: now(),
      };
    },
  };
}

function scaleCost(base: number, policy: PlanInput["scalePolicy"]): number {
  switch (policy) {
    case "cost-optimized":
      return Math.round(base * 0.7 * 100) / 100;
    case "performance":
      return Math.round(base * 1.4 * 100) / 100;
    default:
      return base;
  }
}

/** Test helper — wipe in-memory mock state. */
export function resetMockCloudStore(): void {
  STORE.clear();
}
