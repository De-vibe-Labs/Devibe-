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

# Feature: AI Engineering Platform — MCS + Supabase hybrid roadmap

## Summary

Expand DeVibe from a Phase 1 mocked cloud-orchestrator SDK into an AI Engineering Platform: Supabase as the default application data plane (Auth, Postgres, RLS, Realtime, Storage, Edge Functions, pgvector, Cron, queues), and MCS (Model Cloud Standard) as the vendor-neutral MCP tool layer for deploying compute/infra to any cloud. Cloudflare remains the default edge compute/CDN adapter. This change set delivers **Phase 0 documentation only** — a multi-phase roadmap and open specs for stakeholder approval before implementation.

## Why this feature

- Problem it solves: Agents and builders are blocked from a coherent multi-cloud + realtime backend story; today’s Cloudflare/D1-first mocks do not cover Auth/RLS/vectors/marketplace/K8s.
- Who it is for: Founders, platform engineers, and agent authors who need one abstraction for infra + a batteries-included backend.
- How it ties to DeVibe's edge-first / agent-managed infra goals: Keeps Cloudflare as primary MCS compute adapter while standardising all providers behind MCS and making Supabase the default dataplane.

## User stories

1. As a platform stakeholder, I want a phased roadmap with exit criteria, so that we can approve implementation increments without scope explosion.
2. As an agent author, I want a written MCS tool contract, so that adapters and marketplace connectors share one interface.
3. As a builder, I want every project to auto-receive a Supabase-shaped dataplane in the architecture docs, so that Auth/DB/Realtime/Storage are assumed by default.

## Acceptance criteria

- [x] Roadmap published at `docs/roadmap/AI_ENGINEERING_PLATFORM.md` with phases 0–8 and hybrid decision lock (1D plan + 2C Supabase/MCS hybrid)
- [x] MCS v0.1 draft at `docs/specs/MCS.md` (cloud, kubernetes, docker profiles)
- [x] Supabase hybrid architecture at `docs/architecture/SUPABASE_DEFAULT_BACKEND.md`
- [x] Agentic infrastructure roster at `docs/architecture/AGENTIC_INFRASTRUCTURE.md`
- [x] `PRD.md` / `PROJECT_STRUCTURE.md` / README updated to point at the roadmap without breaking frontmatter validation
- [ ] Tagged PRD / this prompt still passes `make prd-validate`
- [ ] No runtime packages or adapters implemented in this change set (docs/roadmap only)
- [ ] DevOps Agent can still `manage_project` plan (mocked) without regression
- [ ] Security Agent records audit events for any infra change (unchanged Phase 1 behaviour)

## Technical notes (optional)

- Preferred surface: `docs/*`, `PRD.md`, `PROJECT_STRUCTURE.md`, `README.md`, `prompts/features/`
- New MCP tools needed? (y/n) — **n** in this PR; specified for later phases
- Cloud resources expected: documented only (Workers / Supabase / K8s / Docker via MCS)
- Frontmatter MUST NOT gain `dataplane` until `@devibe/project-config` schema ships in Phase 2b

## Out of scope

- Implementing `@devibe/mcs-core`, Supabase provisioning, marketplace, or live adapters
- Changing Phase 1 mock adapter behaviour
- Adding all 18 cloud providers’ code

---

**Agent instructions:** Because the frontmatter already includes `github-connected`, `cloud-enabled`, and `auto-scale`, treat GitHub + cloud as linked. For **this** feature, do not run live deploys — documentation and validation only unless a later phase PR explicitly requests implementation.
