# DeVibe — AI Engineering Platform Roadmap

**Status:** Planning only (no implementation in this change set)  
**Decision lock:** Hybrid backend — **Supabase** for Auth / Postgres / RLS / Realtime / Storage / Edge Functions / pgvector / Cron / Queues; **MCS cloud adapters** (Cloudflare-primary for edge compute/CDN) for deploy targets.  
**Related:** [MCS specification](../specs/MCS.md) · [Supabase default backend](../architecture/SUPABASE_DEFAULT_BACKEND.md) · [Agentic infrastructure](../architecture/AGENTIC_INFRASTRUCTURE.md)

This document is the multi-phase roadmap for expanding DeVibe from an IDE/orchestrator SDK into an **AI Engineering Platform**: describe an app → agents provision Supabase + infrastructure → deploy via a vendor-neutral MCP Cloud Standard (MCS) → monitor and maintain in production.

---

## North star

```
User request
  → AI generates PRD + architecture
  → Supabase project provisioned (data plane)
  → Application scaffolded
  → MCS adapters provision compute / K8s / serverless
  → Images built, manifests applied, app deployed
  → Monitoring + specialised agents keep production healthy
```

**Invariant:** Agents never bind to a single cloud vendor API. They call **MCS tools**. Adapters translate MCS → provider APIs. Supabase is the default **application data plane**, not the only compute fabric.

---

## Current baseline (Phase 1 — shipped)

| Capability | Today |
|---|---|
| Trigger | Tagged `PRD.md` / `.devibe/project.yaml` + MCP `manage_project` / `sync_from_prd` |
| Cloud | Mocked `CloudProviderInterface` — Cloudflare, AWS, GCP, Azure |
| IaC | Pulumi Cloudflare templates (mock apply) |
| Agents | Product, DevOps, Security, Backend, QA, Orchestrator (prompt stubs + event loop) |
| UI | Vite mockups (landing, chat, IDE, cloud, fleet, orchestration) |
| Backend | No Supabase; in-memory MCP memory; D1 intended early |

---

## Phase map (approve before implementing)

| Phase | Name | Outcome | Depends on |
|---|---|---|---|
| **0** | Spec freeze | MCS v0.1 + Supabase project model + agent/marketplace contracts accepted | — |
| **2a** | Control-plane API | Real `apps/api` + project registry; PRD linkage persists | Phase 0 |
| **2b** | Supabase data plane | Auto-provision Supabase per project; `@devibe/database` / `@devibe/auth` on Supabase; Supabase MCP | Phase 0, 2a |
| **2c** | MCS core runtime | Hosted MCP + MCS tool surface; refactor `CloudProviderInterface` → MCS adapter | Phase 0 |
| **3a** | Edge deploy path | Live Cloudflare adapter (Workers/Pages/R2/CDN) via MCS | Phase 2c |
| **3b** | Container path | Docker MCP + compose; image build/push in agent loop | Phase 2c |
| **3c** | Kubernetes path | Kubernetes MCP + GKE/EKS/AKS/k3s adapters (mocked → live) | Phase 2c, 3b |
| **4** | Multi-cloud adapters | AWS, GCP, Azure, Railway, Render, Vercel, Netlify, Fly, DO, Hetzner, … | Phase 2c |
| **5** | Marketplace | One-click connectors; auto-register MCP tools | Phase 2b, 2c |
| **6** | Agentic ops | Cloud Architect, K8s, Database, Security, Observability, Cost, Reliability agents | Phase 2b–4 |
| **7** | Multi-cloud production | Active-active, blue/green, canary, failover, DR, global LB | Phase 3–6 |
| **8** | Unified DX surface | Single UI for projects, Supabase, MCP, K8s, deploy, secrets, billing | Phase 2–7 |

Phases **2a / 2b / 2c** may run in parallel after Phase 0 approval. Do **not** start Phase 4–8 adapters until MCS tool contracts are stable (semver minor lock).

---

## Phase 0 — Spec freeze (this PR)

Deliverables (documentation only):

1. [MCS open specification v0.1](../specs/MCS.md)
2. [Supabase default backend architecture](../architecture/SUPABASE_DEFAULT_BACKEND.md)
3. [Agentic infrastructure engine](../architecture/AGENTIC_INFRASTRUCTURE.md)
4. Updated [PRD.md](../../PRD.md) vision + hybrid cloud/data-plane blocks
5. Updated [PROJECT_STRUCTURE.md](../../PROJECT_STRUCTURE.md) target layout
6. Feature prompt: [`prompts/features/ai-engineering-platform-mcs.md`](../../prompts/features/ai-engineering-platform-mcs.md)

**Exit criteria:** Stakeholders approve tool names, Supabase auto-provision shape, and phase order before any runtime code.

---

## Phase 2a — Control-plane API

**Goal:** Persist projects, linkage, audit, and agent runs outside the in-memory MCP `MEMORY` map.

- Implement `apps/api` (Workers-first or NestJS behind Workers gateway — prefer edge-compatible handlers).
- Project CRUD, PRD sync webhooks, approval gate API, audit log store.
- Platform secrets vault interface (never expose raw credentials to LLMs).
- Wire `apps/web` auth screens to real session endpoints (Supabase Auth in 2b).

**Packages:** grow `apps/api`; thin clients in `packages/project-config`.

---

## Phase 2b — Supabase as default data plane

See [SUPABASE_DEFAULT_BACKEND.md](../architecture/SUPABASE_DEFAULT_BACKEND.md).

Every customer project auto-receives:

```
Project
├── PostgreSQL (+ pgvector)
├── Auth + RLS
├── Storage bucket(s)
├── Edge Functions
├── Realtime channels
├── Cron + queue patterns (pg_cron / Postgres queues)
├── Env vars / secrets refs
├── AI memory store (vector + relational)
└── Analytics hooks (optional PostHog connector later)
```

- Package `@devibe/supabase` (or flesh `packages/database` + `packages/auth`).
- **Supabase MCP server** auto-provisioned per project (tool list in architecture doc).
- Migrations, RLS generators, TypeScript type generation as first-class agent tools.
- DeVibe control plane may also use Supabase for its own Auth/DB (same phase or immediately after customer path).

**Non-goal this phase:** Replacing Cloudflare edge compute with Supabase Edge Functions for all workloads — Edge Functions are available; primary global compute/CDN remains MCS adapters.

---

## Phase 2c — MCS core runtime

See [MCS.md](../specs/MCS.md).

- Introduce `@devibe/mcs-core` — Zod schemas for MCS tools, resource model, errors, capability discovery.
- Refactor `@devibe/cloud-providers` so existing adapters implement **MCS Cloud Adapter** (map `plan`/`apply`/`scale`/`destroy` onto MCS primitives).
- Hosted MCP transport (Streamable HTTP / SSE) with OAuth for agent clients; keep stdio for local CLI.
- Tool registry: platform MCS tools + per-project Supabase MCP + marketplace connectors.

**Compatibility:** Keep `manage_project` / `sync_from_prd` as orchestration façades that call MCS underneath.

---

## Phase 3a — Live Cloudflare (edge + CDN)

- Real Cloudflare adapter: Workers, Pages, R2, Queues, Durable Objects, CDN, DNS.
- Pulumi modules move from mock to `pulumi up` with approval gates.
- Default **compute primary** remains Cloudflare for cost-optimised small projects.

---

## Phase 3b — Docker MCP

MCS Docker profile tools:

`build_image`, `run_container`, `stop_container`, `push_image`, `pull_image`, `docker_compose_up`, `docker_compose_down`, `scan_image`, `view_container_logs`

- Package `@devibe/mcp-docker` (stdio + registerable connector).
- Agent loop: scaffold Dockerfile/compose when architecture chooses containers.

---

## Phase 3c — Kubernetes MCP

MCS Kubernetes profile + distribution drivers: GKE, EKS, AKS, k3s, OpenShift, Rancher, Talos, self-hosted.

Tools: `create_cluster`, `delete_cluster`, `create_namespace`, `deploy_pod`, `deploy_service`, `deploy_ingress`, `create_secret`, `create_configmap`, `view_logs`, `restart_deployment`, `scale_deployment`, `kubectl_exec`, `helm_install`, `helm_upgrade`, `monitor_cluster`

- Start with **mocked** cluster lifecycle; live drivers behind capability flags.
- Manifest generation from architecture agent → apply via MCS.

---

## Phase 4 — Multi-cloud adapter catalogue

Uniform MCS tools for every provider (adapter-only differences):

`deploy_application`, `create_database`, `create_bucket`, `create_function`, `scale_service`, `restart_service`, `rollback`, `destroy`, `get_logs`, `get_metrics`, `list_regions`, `list_clusters`, `list_namespaces`

| Wave | Providers |
|---|---|
| 4.1 | AWS, GCP, Azure (promote from Phase 1 mocks) |
| 4.2 | Vercel, Netlify, Railway, Render, Fly.io |
| 4.3 | DigitalOcean, Hetzner, Linode, Scaleway, OVH |
| 4.4 | Oracle Cloud, Bare Metal, generic Docker host |
| 4.5 | Capability matrix UI + conformance tests (`mcs-conformance`) |

Each adapter ships: capability manifest, region list, cost estimators, audit mapping.

---

## Phase 5 — Infrastructure marketplace

One-click connectors that register MCP tool sets:

Supabase, Cloudflare, Google Cloud, AWS, Azure, GitHub, GitLab, Stripe, Slack, Discord, Linear, OpenAI, Anthropic, Twilio, Resend, PostHog, Grafana, Prometheus, …

- Package `@devibe/marketplace` — catalog schema, install/uninstall, OAuth device flows, tool namespacing (`connector.stripe.*`).
- UI: Marketplace page in `apps/web` (replace teaser copy).

---

## Phase 6 — Agentic infrastructure engine

Specialised agents (see [AGENTIC_INFRASTRUCTURE.md](../architecture/AGENTIC_INFRASTRUCTURE.md)):

| Agent | Focus |
|---|---|
| Cloud Architect | Topology, networking, multi-region design |
| Kubernetes | Clusters, upgrades, HPA, rollouts |
| Database | Schemas, migrations, indexes, backups, query plans |
| Security | IAM, secrets, vulns, compliance, RLS review |
| Observability | Dashboards, tracing, metrics, alerts |
| Cost Optimisation | Rightsizing, idle resources, region/sku advice |
| Reliability | Uptime, retry failed deploys, DR drills |

Existing Product / DevOps / Security / Backend / QA / Orchestrator remain; new agents extend `packages/agents`.

---

## Phase 7 — Multi-cloud production workflows

- Active-active multi-region
- Blue/green, canary, rolling updates
- Automatic failover + global load balancing
- CDN integration (Cloudflare or provider CDN via MCS)
- Disaster recovery + automated backups (Supabase + object storage adapters)
- Multi-cloud redundancy policies in `.devibe/project.yaml`

---

## Phase 8 — Unified developer experience

Single interface surfaces:

Projects · Repositories · AI Agents · Supabase · MCP Servers · Kubernetes · Containers · Deployments · Databases · Secrets · Storage · Functions · Observability · Billing · Marketplace

- Promote UI mockups to production routes backed by `apps/api` + MCS + Supabase.
- IDE workspace gains real git + agent chat + resource inspector (not only Monaco mock).

---

## Risk register

| Risk | Mitigation |
|---|---|
| MCS tool surface churn breaks adapters | Semver + conformance suite before Phase 4 waves |
| Supabase org/project quotas / billing | Soft limits, BYO Supabase org keys, cost agent |
| Credential leakage to LLMs | Vault + opaque refs; Security Agent redaction |
| Scope explosion | Hard gate: no Phase N+1 without Phase N exit criteria |
| Cloudflare vs Supabase Edge Function confusion | Document compute vs data-plane split in every PRD |

---

## Approval checklist (before coding Phase 2+)

- [ ] MCS v0.1 tool names and resource model accepted
- [ ] Hybrid Supabase + MCS compute model accepted
- [ ] Phase order (2a/2b/2c parallelisation) accepted
- [ ] First implementation PR targets a single phase ID in commit/PR title

---

## Document owners

| Doc | Owner role |
|---|---|
| This roadmap | Product + Platform |
| MCS.md | Platform / MCP |
| SUPABASE_DEFAULT_BACKEND.md | Backend + Database Agent |
| AGENTIC_INFRASTRUCTURE.md | Orchestration |
