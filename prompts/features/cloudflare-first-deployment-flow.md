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
    adapters: [cloudflare, aws]
    region_preference: auto
    scale_policy: cost-optimized
  memory:
    project_id: 550e8400-e29b-41d4-a716-446655440000
  production_auto: false
---

# Feature: Cloudflare-first deployment flow

## Summary

Give DeVibe a first-class **Cloudflare-first deployment path**: from a tagged PRD, the DevOps Agent plans and (with approval) applies a small-scale edge stack — Workers + Durable Objects, D1, R2, Queues, Pages, and AI Gateway — then records deployment memory and emits structured agent events. AWS remains a secondary adapter for later promotion.

## Why this feature

- Problem it solves: Founders need a near-zero-cost, globally distributed default without hand-writing IaC.
- Who it is for: Builders using the AI Builder Workspace / MCP tools, and DevOps/Security agents.
- How it ties to DeVibe's edge-first / agent-managed infra goals: Matches the Cloudflare adapter blueprint and Pulumi starter already in `@devibe/iac-templates`.

## User stories

1. As a founder, I want `make agents-run` to plan a Cloudflare stack from `PRD.md`, so that I see lifecycle management unlock without extra prompts.
2. As a platform engineer, I want `manage_project` apply (with approval) to provision mocked Workers/D1/R2/Queues/Pages, so that demos work without cloud credentials.
3. As a security reviewer, I want high-cost or destroy actions to require approval when `production_auto` is false, so that small projects stay safe by default.

## Acceptance criteria

- [x] Root `PRD.md` and `.devibe/project.yaml` share matching tags and GitHub/cloud blocks
- [x] `make prd-validate` passes
- [x] `make agents-run` completes a mocked `plan` and prints the linkage banner
- [x] `manage_project` apply with `approved: true` creates active mocked Cloudflare resources
- [x] Pulumi Cloudflare preview is included on plan/apply results
- [x] Security Agent emits audit events for apply
- [x] Tagged PRD / this prompt still passes `make prd-validate`

## Technical notes

- Preferred surface: `packages/cloud-providers`, `packages/iac-templates`, `packages/mcp-server`, `infra/pulumi`
- New MCP tools needed? n (reuse `manage_project` / `sync_from_prd`)
- Cloud resources expected: Workers, D1, R2, Queues, Pages, AI Gateway

## Out of scope

- Live Cloudflare API calls (remain mocked in Phase 1)
- Full Monaco IDE dual-preview UI
- Multi-region database promotion to Neon/pgvector

---

**Agent instructions:** Because the frontmatter already includes `github-connected`, `cloud-enabled`, and `auto-scale`, treat GitHub + cloud as linked and run the full management loop (IaC, deploy, scale, monitor) for this feature unless acceptance criteria say otherwise.
