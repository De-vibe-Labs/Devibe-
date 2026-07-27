import type {
  ApplyResult,
  InfrastructurePlan,
  ScaleResult,
  CloudResource,
} from "@devibe/cloud-providers";
import { getAdapter, resolveAdapters } from "@devibe/cloud-providers";
import {
  type DevibeProject,
  type LinkageStatus,
  evaluateLinkage,
  formatLinkageBanner,
} from "@devibe/project-config";
import { renderCloudflarePulumiModule } from "@devibe/iac-templates";

export type ManageAction =
  | "status"
  | "plan"
  | "apply"
  | "scale"
  | "destroy"
  | "sync-memory";

export interface AgentEvent {
  at: string;
  agent: string;
  type: string;
  payload: Record<string, unknown>;
}

export interface ManageProjectResult {
  ok: boolean;
  banner: string;
  linkage: LinkageStatus;
  action: ManageAction;
  events: AgentEvent[];
  plan?: InfrastructurePlan;
  apply?: ApplyResult;
  scale?: ScaleResult;
  resources?: CloudResource[];
  iacPreview?: string;
  memory?: Record<string, unknown>;
  error?: string;
}

export interface SyncFromPrdResult {
  ok: boolean;
  banner: string;
  linkage: LinkageStatus;
  project: DevibeProject;
  events: AgentEvent[];
  followUp?: ManageProjectResult;
}

const MEMORY = new Map<string, Record<string, unknown>>();

function event(agent: string, type: string, payload: Record<string, unknown>): AgentEvent {
  return { at: new Date().toISOString(), agent, type, payload };
}

function projectIdOf(project: DevibeProject): string {
  return project.memory?.project_id ?? "00000000-0000-4000-8000-000000000000";
}

function projectNameOf(project: DevibeProject): string {
  return project.github?.repo ?? "devibe-project";
}

/**
 * Core orchestration loop triggered by MCP `manage_project`.
 * Uses mocked CloudProviderInterface adapters end-to-end.
 */
export async function manageProject(input: {
  project: DevibeProject;
  action: ManageAction;
  target?: "preview" | "staging" | "production";
  service?: string;
  desired?: number;
  approved?: boolean;
  actor: string;
}): Promise<ManageProjectResult> {
  const events: AgentEvent[] = [];
  const linkage = evaluateLinkage(input.project);
  const banner = formatLinkageBanner(linkage);

  events.push(
    event("orchestrator", "manage_project.received", {
      action: input.action,
      target: input.target ?? "production",
      actor: input.actor,
    }),
  );

  if (!linkage.managementLoopActive && input.action !== "status") {
    events.push(
      event("security", "gate.blocked", {
        reason: "GitHub + cloud linkage incomplete",
        missing: linkage.missing,
      }),
    );
    return {
      ok: false,
      banner,
      linkage,
      action: input.action,
      events,
      error: `Cannot ${input.action}: ${banner}`,
    };
  }

  events.push(event("devops", "linkage.confirmed", { linkage }));

  const cloud = input.project.cloud!;
  const primary = getAdapter(cloud.primary);
  const adapters = resolveAdapters(cloud.adapters);
  const pid = projectIdOf(input.project);
  const pname = projectNameOf(input.project);

  events.push(
    event("devops", "adapters.resolved", {
      primary: primary.id,
      adapters: adapters.map((a) => a.id),
      mock: true,
    }),
  );

  try {
    switch (input.action) {
      case "status": {
        const resources = linkage.cloudEnabled
          ? await primary.listResources(pid)
          : [];
        events.push(event("devops", "status.ok", { resourceCount: resources.length }));
        return { ok: true, banner, linkage, action: "status", events, resources };
      }
      case "plan": {
        const plan = await primary.plan({
          projectId: pid,
          projectName: pname,
          scalePolicy: cloud.scale_policy,
          regionPreference: cloud.region_preference,
          actor: input.actor,
        });
        const iacPreview = renderCloudflarePulumiModule({
          projectName: pname,
          projectId: pid,
          scalePolicy: cloud.scale_policy,
        });
        events.push(
          event("devops", "plan.created", {
            planId: plan.planId,
            changes: plan.changes.length,
            estimatedDeltaUsdPerMonth: plan.estimatedDeltaUsdPerMonth,
          }),
        );
        events.push(event("security", "plan.reviewed", { highCost: plan.estimatedDeltaUsdPerMonth > 50 }));
        return { ok: true, banner, linkage, action: "plan", events, plan, iacPreview };
      }
      case "apply": {
        const plan = await primary.plan({
          projectId: pid,
          projectName: pname,
          scalePolicy: cloud.scale_policy,
          regionPreference: cloud.region_preference,
          actor: input.actor,
        });
        events.push(event("devops", "plan.created", { planId: plan.planId }));

        const apply = await primary.apply({
          plan,
          productionAuto: input.project.production_auto,
          approved: input.approved ?? false,
          actor: input.actor,
        });
        events.push(
          event("devops", "apply.completed", {
            applyId: apply.applyId,
            resources: apply.resources.length,
            mock: true,
          }),
        );
        events.push(event("qa", "readiness.check", { score: 88, mock: true }));
        events.push(event("security", "audit.recorded", { applyId: apply.applyId }));

        const memory = {
          projectId: pid,
          lastApplyId: apply.applyId,
          lastPlanId: plan.planId,
          providers: cloud.adapters,
          updatedAt: new Date().toISOString(),
        };
        MEMORY.set(pid, memory);
        events.push(event("orchestrator", "memory.updated", memory));

        return {
          ok: true,
          banner,
          linkage,
          action: "apply",
          events,
          plan,
          apply,
          resources: apply.resources,
          memory,
          iacPreview: renderCloudflarePulumiModule({
            projectName: pname,
            projectId: pid,
            scalePolicy: cloud.scale_policy,
          }),
        };
      }
      case "scale": {
        const scale = await primary.scale({
          projectId: pid,
          service: input.service ?? "edge-worker",
          desired: input.desired ?? 2,
          environment: input.target ?? "production",
          actor: input.actor,
        });
        events.push(event("devops", "scale.completed", { ...scale }));
        events.push(
          event("backend", "runtime.adjusted", {
            service: scale.service,
            capacity: scale.current,
          }),
        );
        return { ok: true, banner, linkage, action: "scale", events, scale };
      }
      case "destroy": {
        if (!input.project.production_auto && !input.approved) {
          events.push(
            event("security", "gate.blocked", {
              reason: "Destructive destroy requires approval or production_auto",
            }),
          );
          return {
            ok: false,
            banner,
            linkage,
            action: "destroy",
            events,
            error: "Human approval required for destroy",
          };
        }
        const apply = await primary.destroy(pid, input.actor);
        events.push(event("devops", "destroy.completed", { applyId: apply.applyId }));
        MEMORY.delete(pid);
        return { ok: true, banner, linkage, action: "destroy", events, apply };
      }
      case "sync-memory": {
        const memory = MEMORY.get(pid) ?? {
          projectId: pid,
          note: "No prior deployments in mock memory",
          updatedAt: new Date().toISOString(),
        };
        events.push(event("orchestrator", "memory.synced", memory));
        return { ok: true, banner, linkage, action: "sync-memory", events, memory };
      }
      default:
        return {
          ok: false,
          banner,
          linkage,
          action: input.action,
          events,
          error: `Unknown action: ${input.action}`,
        };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    events.push(event("security", "error", { message }));
    return { ok: false, banner, linkage, action: input.action, events, error: message };
  }
}

/** Parse PRD / project metadata and optionally kick off manage_project. */
export async function syncFromPrd(input: {
  project: DevibeProject;
  autoManage?: boolean;
  manageAction?: ManageAction;
  approved?: boolean;
  actor: string;
}): Promise<SyncFromPrdResult> {
  const events: AgentEvent[] = [
    event("product", "prd.parsed", {
      tags: input.project.tags,
      github: input.project.github ?? null,
      cloud: input.project.cloud ?? null,
    }),
  ];
  const linkage = evaluateLinkage(input.project);
  const banner = formatLinkageBanner(linkage);
  events.push(event("orchestrator", "linkage.evaluated", { linkage, banner }));

  let followUp: ManageProjectResult | undefined;
  if (input.autoManage && linkage.managementLoopActive) {
    followUp = await manageProject({
      project: input.project,
      action: input.manageAction ?? "plan",
      approved: input.approved,
      actor: input.actor,
    });
    events.push(...followUp.events);
  }

  return {
    ok: linkage.managementLoopActive,
    banner,
    linkage,
    project: input.project,
    events,
    followUp,
  };
}

export function resetOrchestrationMemory(): void {
  MEMORY.clear();
}
