---
devibe:
  version: 1
  tags:
    - github-connected
    - cloud-enabled
    - auto-scale
  github:
    owner: De-vibe-Labs
    repo: Devibe-
    default_branch: main
  cloud:
    primary: cloudflare
    adapters: [cloudflare, aws, gcp, azure]
    region_preference: auto
    scale_policy: cost-optimized
  memory:
    project_id: 550e8400-e29b-41d4-a716-446655440000
  production_auto: false
---

# DeVibe — Product Requirements Document

**Single source of truth** for agents. Presence of the `devibe:` frontmatter tags above unlocks full GitHub + multi-cloud lifecycle management (`manage_project` / `sync_from_prd`).

Keep this file in sync with [`.devibe/project.yaml`](.devibe/project.yaml). Validate with `make prd-validate`.

## Vision

DeVibe is an **AI Engineering Platform**: turn a tagged PRD or feature prompt into a globally distributed, agent-managed application. **Supabase** is the default **data plane** (Postgres, Auth, RLS, Realtime, Storage, Edge Functions, pgvector, Cron, queues). **MCS (Model Cloud Standard)** is the vendor-neutral layer agents use to deploy compute and infrastructure to any cloud. Cloudflare remains the default **edge compute / CDN** adapter for cost-optimised projects; AWS, GCP, Azure, Kubernetes, Docker, and further adapters plug in behind the same MCS tools.

Phase 1 ships a foundation SDK (mocked multi-cloud + local MCP). The multi-phase expansion roadmap lives in [`docs/roadmap/AI_ENGINEERING_PLATFORM.md`](docs/roadmap/AI_ENGINEERING_PLATFORM.md) — **approve phases before implementation**.

## Goals

1. **Hybrid by default** — Supabase for application data/auth/memory; MCS adapters for edge/serverless/containers/K8s.
2. **Near-zero cost edge path** — Cloudflare Workers, Durable Objects, R2/Queues, Pages, Workers AI + AI Gateway as the primary compute adapter.
3. **Infrastructure as agent-managed code** — Pulumi (and later Helm/manifests) generated and planned by specialised agents.
4. **One trigger** — a tagged PRD / `.devibe/project.yaml` or a single MCP call is enough once GitHub + cloud (+ dataplane) are linked.
5. **Vendor-neutral agents** — agents call MCS + Supabase MCP tools; they never bind to a single cloud SDK.
6. **Safety** — cost budgets, approval gates for destructive/high-cost applies, full audit events (Security Agent).

## Non-goals (Phase 1)

- Full control-plane UI (mockups exist; not required for the foundation SDK).
- Live cloud API applies (adapters are **mocked** end-to-end; real providers come later).
- Full NestJS/Next.js product surface (skeleton layout documented in `PROJECT_STRUCTURE.md`).
- Implementing MCS adapters, Supabase provisioning, or marketplace connectors before Phase 0 approval (see roadmap).

## Personas

| Persona | Needs |
|---|---|
| Founder / builder | Drop a PRD, get Supabase data plane + deployable edge stack + agent loop |
| Platform engineer | MCS adapters, IaC modules, approval gates, marketplace connectors |
| Security reviewer | Audit trail of every MCP / IaC / Supabase admin action |

## Core capabilities

### Trigger & linkage

- Parse `devibe:` frontmatter or `.devibe/project.yaml`.
- Require tags `github-connected` + `cloud-enabled` (optional `auto-scale`) with valid GitHub + cloud blocks.
- Banner when active: **Cloud + GitHub linked — full lifecycle management available.**
- **Planned (Phase 2b):** optional `dataplane.provider: supabase` block — see [Supabase architecture](docs/architecture/SUPABASE_DEFAULT_BACKEND.md). Do not add to frontmatter until `@devibe/project-config` schema is extended.

### Multi-agent loop

| Agent | Responsibility |
|---|---|
| Product | Owns PRD / feature prompts and metadata tags |
| DevOps | Reads tags → generates Pulumi / MCS applies via adapters |
| Security | Approval gates, secret hygiene, audit log |
| Backend | Edge/serverless shapes + Supabase dataplane coordination |
| QA | Readiness checks after apply |
| Orchestrator | Routes `manage_project` / `sync_from_prd` |

**Planned (Phase 6):** Cloud Architect, Kubernetes, Database, Observability, Cost Optimisation, Reliability — [Agentic infrastructure](docs/architecture/AGENTIC_INFRASTRUCTURE.md).

### Cloud adapters (Phase 1 mocked)

- Cloudflare (primary small-scale / edge)
- AWS, GCP, Azure (same interface; plan/apply simulated)

**Planned:** MCS profiles for Docker, Kubernetes, and an expanded provider catalogue — [MCS v0.1](docs/specs/MCS.md).

### MCP tools

- `sync_from_prd` — parse tagged content; optionally auto-manage
- `manage_project` — `status` \| `plan` \| `apply` \| `scale` \| `destroy` \| `sync-memory`

**Planned:** Platform MCS tool surface + per-project Supabase MCP + marketplace connectors.

## Success metrics

- Tagged PRD validates via `make prd-validate` without edits.
- `make agents-run` completes a mocked plan (and optional apply with approval).
- DevOps Agent emits a Pulumi Cloudflare preview for every plan.
- High-cost / destroy paths block unless `approved` or `production_auto`.
- **Roadmap:** Phase 0 docs accepted before any Phase 2+ implementation PR.

## Scaling path

1. **Small** — Supabase dataplane + single Cloudflare compute boundary (Workers/Pages/R2).
2. **Promote** — user workloads to AWS/GCP/Azure (and more) via MCS adapters; dataplane stays Supabase unless BYO.
3. **Multi-cloud** — Kubernetes / Docker profiles, global traffic, blue/green & canary, agent auto-scaling and reliability loops.

Detailed phase gates: [`docs/roadmap/AI_ENGINEERING_PLATFORM.md`](docs/roadmap/AI_ENGINEERING_PLATFORM.md).

## Related files

- [`.devibe/project.yaml`](.devibe/project.yaml) — machine-readable twin of this frontmatter
- [`prompts/required-feature-prompt.md`](prompts/required-feature-prompt.md) — template for every new feature
- [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md) — canonical monorepo layout agents must follow
- [`Makefile`](Makefile) — `prd-validate`, `agents-run`, `deploy-cloudflare`, …
- [`docs/roadmap/AI_ENGINEERING_PLATFORM.md`](docs/roadmap/AI_ENGINEERING_PLATFORM.md) — AI Engineering Platform phases
- [`docs/specs/MCS.md`](docs/specs/MCS.md) — Model Cloud Standard draft
