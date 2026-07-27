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

DeVibe is an AI-native cloud orchestrator: turn a tagged PRD or feature prompt into a globally distributed, agent-managed runtime. Start serverless/edge-first on Cloudflare, stay provider-agnostic via `CloudProviderInterface`, and grow into multi-cloud without rewriting the agent loop.

## Goals

1. **Near-zero cost by default** — Cloudflare Workers, Durable Objects, D1/R2/Queues, Pages, Workers AI + AI Gateway.
2. **Infrastructure as agent-managed code** — Pulumi (TypeScript) modules generated and planned by the DevOps Agent.
3. **One trigger** — a tagged PRD / `.devibe/project.yaml` or a single MCP call is enough once GitHub + cloud are linked.
4. **Safety** — cost budgets, approval gates for destructive/high-cost applies, full audit events (Security Agent).

## Non-goals (Phase 1)

- Full control-plane UI (mockups exist; not required for the foundation SDK).
- Live cloud API applies (adapters are **mocked** end-to-end; real providers come later).
- Full NestJS/Next.js product surface (skeleton layout documented in `PROJECT_STRUCTURE.md`).

## Personas

| Persona | Needs |
|---|---|
| Founder / builder | Drop a PRD, get deployable edge stack + agent loop |
| Platform engineer | Provider adapters, IaC modules, approval gates |
| Security reviewer | Audit trail of every MCP / IaC action |

## Core capabilities

### Trigger & linkage

- Parse `devibe:` frontmatter or `.devibe/project.yaml`.
- Require tags `github-connected` + `cloud-enabled` (optional `auto-scale`) with valid GitHub + cloud blocks.
- Banner when active: **Cloud + GitHub linked — full lifecycle management available.**

### Multi-agent loop

| Agent | Responsibility |
|---|---|
| Product | Owns PRD / feature prompts and metadata tags |
| DevOps | Reads tags → generates Pulumi → plan/apply via adapters |
| Security | Approval gates, secret hygiene, audit log |
| Backend | Edge/serverless service shapes (Workers, queues, D1) |
| QA | Readiness checks after apply |
| Orchestrator | Routes `manage_project` / `sync_from_prd` |

### Cloud adapters (Phase 1 mocked)

- Cloudflare (primary small-scale)
- AWS, GCP, Azure (same interface; plan/apply simulated)

### MCP tools

- `sync_from_prd` — parse tagged content; optionally auto-manage
- `manage_project` — `status` \| `plan` \| `apply` \| `scale` \| `destroy` \| `sync-memory`

## Success metrics

- Tagged PRD validates via `make prd-validate` without edits.
- `make agents-run` completes a mocked plan (and optional apply with approval).
- DevOps Agent emits a Pulumi Cloudflare preview for every plan.
- High-cost / destroy paths block unless `approved` or `production_auto`.

## Scaling path

1. **Small** — single Cloudflare boundary, per-project Workers/Pages/D1/R2.
2. **Promote** — user workloads to their AWS/GCP/Azure accounts via adapters.
3. **Multi-cloud** — optional Kubernetes, global traffic, agent auto-scaling policies.

## Related files

- [`.devibe/project.yaml`](.devibe/project.yaml) — machine-readable twin of this frontmatter
- [`prompts/required-feature-prompt.md`](prompts/required-feature-prompt.md) — template for every new feature
- [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md) — canonical monorepo layout agents must follow
- [`Makefile`](Makefile) — `prd-validate`, `agents-run`, `deploy-cloudflare`, …
