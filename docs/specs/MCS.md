# MCS — Model Cloud Standard (v0.1)

**Status:** Draft specification (Phase 0)  
**Goal:** Standardise how AI agents interact with infrastructure so the same tools and APIs work across any cloud.  
**Parent roadmap:** [AI Engineering Platform](../roadmap/AI_ENGINEERING_PLATFORM.md)

---

## 1. Purpose

MCS defines:

1. A **vendor-neutral tool surface** (MCP tools + JSON Schema / Zod) for infrastructure operations.
2. An **adapter contract** that maps those tools onto a cloud provider, Kubernetes distribution, or Docker host.
3. **Capability discovery** so agents know what a connected environment can do.
4. **Audit, approval, and error** semantics shared by all adapters.

Agents speak only MCS. They never call provider SDKs directly.

```
Agent
  ↓  MCS tools (MCP)
MCS Layer  (@devibe/mcs-core)
  ↓  Adapter interface
Cloud Adapter
  ↓  Provider APIs / IaC
Cloud Provider / K8s / Docker
```

---

## 2. Normative profiles

| Profile | ID | Scope |
|---|---|---|
| Cloud | `mcs.cloud` | Deploy apps, DBs, buckets, functions, scale, logs, metrics, regions |
| Kubernetes | `mcs.kubernetes` | Clusters, namespaces, workloads, Helm, exec, monitor |
| Docker | `mcs.docker` | Images, containers, compose, scan, logs |
| Data plane | `mcs.dataplane` | Optional bridge tools; default implementation is Supabase MCP (separate server) |

A platform installation MUST implement `mcs.cloud` for at least one adapter. Kubernetes and Docker are OPTIONAL profiles advertised via capability discovery.

---

## 3. Common types

```ts
/** Opaque platform project id (UUID). */
type ProjectId = string;

/** Adapter id, e.g. "cloudflare" | "aws" | "gke" | "docker-local". */
type AdapterId = string;

type Environment = "preview" | "staging" | "production";

type McsErrorCode =
  | "NOT_SUPPORTED"
  | "UNAUTHORIZED"
  | "APPROVAL_REQUIRED"
  | "QUOTA_EXCEEDED"
  | "NOT_FOUND"
  | "CONFLICT"
  | "PROVIDER_ERROR"
  | "INVALID_ARGUMENT";

interface McsError {
  code: McsErrorCode;
  message: string;
  retryable: boolean;
  details?: Record<string, unknown>;
}

interface McsAudit {
  at: string; // ISO-8601
  actor: string; // agent role or user id
  adapter: AdapterId;
  tool: string;
  projectId: ProjectId;
  requestId: string;
}
```

Every mutating tool MUST emit an audit entry. Destructive or high-cost tools MUST return `APPROVAL_REQUIRED` unless `production_auto` or explicit `approved: true` is set on the project.

---

## 4. Capability discovery

### Tool: `mcs_describe_capabilities`

**Input**

```json
{ "adapterId": "cloudflare", "projectId": "..." }
```

**Output**

```json
{
  "adapterId": "cloudflare",
  "profiles": ["mcs.cloud"],
  "tools": ["deploy_application", "create_bucket", "scale_service", "..."],
  "regions": ["auto", "wnam", "enam", "weur", "apac"],
  "resourceKinds": ["compute", "storage", "queue", "frontend", "ai"],
  "limits": { "maxEstimatedUsdPerMonth": 500 }
}
```

Agents MUST call discovery (or use cached capabilities) before assuming a tool exists.

---

## 5. Profile: `mcs.cloud` — required tools

| Tool | Mutating | Description |
|---|---|---|
| `deploy_application` | yes | Deploy or update an application revision |
| `create_database` | yes | Provision managed DB **when not using Supabase data plane** |
| `create_bucket` | yes | Object storage bucket |
| `create_function` | yes | Serverless / edge function |
| `scale_service` | yes | Scale a named service |
| `restart_service` | yes | Restart / recycle instances |
| `rollback` | yes | Roll back to prior revision |
| `destroy` | yes | Tear down project resources for this adapter |
| `get_logs` | no | Fetch recent logs |
| `get_metrics` | no | Fetch metrics snapshot or query handle |
| `list_regions` | no | Regions / placements |
| `list_clusters` | no | Clusters if adapter manages them (else empty) |
| `list_namespaces` | no | Namespaces if applicable (else empty) |

### Example: `deploy_application`

**Input**

```json
{
  "projectId": "550e8400-e29b-41d4-a716-446655440000",
  "adapterId": "cloudflare",
  "environment": "production",
  "name": "api",
  "artifact": { "type": "worker" | "container" | "static" | "function", "ref": "..." },
  "regions": ["auto"],
  "env": { "SUPABASE_URL": { "secretRef": "supabase.url" } },
  "strategy": "rolling" | "blue_green" | "canary",
  "approved": false
}
```

**Output**

```json
{
  "deploymentId": "...",
  "status": "pending" | "in_progress" | "healthy" | "failed",
  "url": "https://...",
  "revision": "…",
  "audit": { "...": "..." }
}
```

### Mapping from Phase 1 `CloudProviderInterface`

| Today | MCS |
|---|---|
| `plan` | Adapter-local dry-run; orchestration may expose `mcs_plan` as a façade |
| `apply` | Sequence of `deploy_application` / `create_*` |
| `scale` | `scale_service` |
| `destroy` | `destroy` |
| `listResources` | Adapter inventory; future `list_resources` extension |

Phase 2c MUST provide a compatibility shim so `manage_project` continues to work.

---

## 6. Profile: `mcs.kubernetes`

| Tool | Mutating |
|---|---|
| `create_cluster` | yes |
| `delete_cluster` | yes |
| `create_namespace` | yes |
| `deploy_pod` | yes |
| `deploy_service` | yes |
| `deploy_ingress` | yes |
| `create_secret` | yes |
| `create_configmap` | yes |
| `view_logs` | no |
| `restart_deployment` | yes |
| `scale_deployment` | yes |
| `kubectl_exec` | yes (high risk — approval default) |
| `helm_install` | yes |
| `helm_upgrade` | yes |
| `monitor_cluster` | no |

**Distributions (drivers):** `gke`, `eks`, `aks`, `k3s`, `openshift`, `rancher`, `talos`, `self_hosted`.

Driver id is passed as `distribution` on cluster tools. Unsupported distributions return `NOT_SUPPORTED`.

---

## 7. Profile: `mcs.docker`

| Tool | Mutating |
|---|---|
| `build_image` | yes |
| `run_container` | yes |
| `stop_container` | yes |
| `push_image` | yes |
| `pull_image` | yes |
| `docker_compose_up` | yes |
| `docker_compose_down` | yes |
| `scan_image` | no |
| `view_container_logs` | no |

---

## 8. Adapter contract (TypeScript sketch)

```ts
export interface McsCloudAdapter {
  readonly id: AdapterId;
  readonly displayName: string;
  describeCapabilities(projectId: ProjectId): Promise<CapabilityManifest>;
  // one method per mcs.cloud tool — or a generic invoke(tool, input)
  invoke(tool: string, input: unknown, ctx: McsContext): Promise<unknown>;
}
```

Adapters MUST:

1. Advertise only implemented tools.
2. Map provider errors to `McsError`.
3. Never return raw secrets in tool outputs.
4. Record audit entries for mutations.
5. Respect project cost budgets when present.

---

## 9. MCP binding

- **Local:** stdio MCP server registering MCS tools (namespace prefix `mcs_` or bare names with server metadata).
- **Hosted:** Streamable HTTP MCP with OAuth; tools scoped by project + installed connectors.
- **Composition:** Platform MCS server + per-project Supabase MCP + marketplace connector servers.

Tool naming for marketplace connectors: `{connectorId}.{tool}` to avoid collisions (e.g. `stripe.create_customer`).

Core MCS cloud tools MAY remain unprefixed for agent ergonomics when the server is the platform MCS server.

---

## 10. Conformance

Package (future): `@devibe/mcs-conformance`

- Golden request/response fixtures per tool.
- Mock adapter that always passes.
- Live adapter suite behind credentials.
- CI gate before listing an adapter in the marketplace.

**Versioning:** MCS v0.x may break; v1.0 freezes required `mcs.cloud` tools. Adapters declare `mcsVersion`.

---

## 11. Out of scope for v0.1

- Billing settlement APIs
- Full IAM policy language
- Cross-cloud network fabric specification
- Guaranteed identical latency/cost across providers

---

## 12. Open questions (resolve before Phase 2c code)

1. Façade tool `mcs_plan` vs orchestration-only planning?
2. Exact hosted MCP OAuth scopes?
3. Whether `create_database` is discouraged when Supabase is attached (recommended: return guidance + soft-fail when `dataplane: supabase` is set)?

**Working default for (3):** If project `dataplane.provider === "supabase"`, `create_database` on cloud adapters returns `NOT_SUPPORTED` with message to use Supabase MCP (`create_table` / migrations) unless `forceManagedDb: true`.
