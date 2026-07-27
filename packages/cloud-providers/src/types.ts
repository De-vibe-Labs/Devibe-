import type { CloudProviderId, ScalePolicy } from "@devibe/project-config";

export type ResourceKind =
  | "compute"
  | "database"
  | "storage"
  | "queue"
  | "ai"
  | "frontend"
  | "network"
  | "secret";

export type ResourceStatus = "planned" | "provisioning" | "active" | "scaling" | "destroyed" | "failed";

export interface CloudResource {
  id: string;
  provider: CloudProviderId;
  kind: ResourceKind;
  name: string;
  region: string;
  status: ResourceStatus;
  estimatedMonthlyUsd: number;
  meta: Record<string, unknown>;
}

export interface PlanChange {
  action: "create" | "update" | "replace" | "destroy" | "noop";
  resource: CloudResource;
  summary: string;
}

export interface InfrastructurePlan {
  planId: string;
  provider: CloudProviderId;
  projectId: string;
  scalePolicy: ScalePolicy;
  changes: PlanChange[];
  estimatedDeltaUsdPerMonth: number;
  mock: true;
  createdAt: string;
}

export interface ApplyResult {
  applyId: string;
  planId: string;
  provider: CloudProviderId;
  resources: CloudResource[];
  audit: AuditEntry[];
  mock: true;
  appliedAt: string;
}

export interface ScaleTarget {
  /** Logical service name, e.g. "api" or "edge-worker". */
  service: string;
  /** Desired capacity hint (RPS, instances, or DO concurrency). */
  desired: number;
  environment: "preview" | "staging" | "production";
}

export interface ScaleResult {
  provider: CloudProviderId;
  service: string;
  previous: number;
  current: number;
  region: string;
  mock: true;
  scaledAt: string;
}

export interface AuditEntry {
  at: string;
  provider: CloudProviderId;
  action: string;
  detail: string;
  actor: string;
}

export interface ProviderCapabilities {
  compute: string[];
  database: string[];
  storage: string[];
  queues: string[];
  ai: string[];
  frontend: string[];
}

export interface PlanInput {
  projectId: string;
  projectName: string;
  scalePolicy: ScalePolicy;
  regionPreference: string;
  /** Desired resource kinds to include in the plan. */
  wants?: ResourceKind[];
  actor: string;
}

export interface ApplyInput {
  plan: InfrastructurePlan;
  /** When false, refuse high-cost/destructive applies unless production_auto. */
  productionAuto: boolean;
  actor: string;
  /** Simulate approval gate refusal. */
  approved?: boolean;
}

/** Provider-agnostic adapter contract used by DevOps agents and MCP tools. */
export interface CloudProviderInterface {
  readonly id: CloudProviderId;
  readonly displayName: string;
  readonly capabilities: ProviderCapabilities;
  plan(input: PlanInput): Promise<InfrastructurePlan>;
  apply(input: ApplyInput): Promise<ApplyResult>;
  scale(input: ScaleTarget & { projectId: string; actor: string }): Promise<ScaleResult>;
  listResources(projectId: string): Promise<CloudResource[]>;
  destroy(projectId: string, actor: string): Promise<ApplyResult>;
}
