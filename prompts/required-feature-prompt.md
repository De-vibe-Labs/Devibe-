---
devibe:
  version: 1
  tags:
    - github-connected
    - cloud-enabled
    - auto-scale
  github:
    owner: {{GITHUB_OWNER}}
    repo: {{GITHUB_REPO}}
    default_branch: main
  cloud:
    primary: cloudflare
    adapters: [cloudflare, aws, gcp, azure]
    region_preference: auto
    scale_policy: cost-optimized
  memory:
    project_id: {{PROJECT_UUID}}
  production_auto: false
---

# Feature: {{FEATURE_NAME}}

## Summary

{{DETAILED_DESCRIPTION}}

## Why this feature

- Problem it solves:
- Who it is for:
- How it ties to DeVibe's edge-first / agent-managed infra goals:

## User stories

1. As a …, I want …, so that ….
2. As a …, I want …, so that ….
3. As a …, I want …, so that ….

## Acceptance criteria

- [ ] …
- [ ] …
- [ ] Tagged PRD / this prompt still passes `make prd-validate`
- [ ] DevOps Agent can `manage_project` plan (and apply with approval) without extra instructions
- [ ] Security Agent records audit events for any infra change

## Technical notes (optional)

- Preferred surface: `apps/web` | `apps/api` | `packages/*` | `infra/pulumi`
- New MCP tools needed? (y/n)
- Cloud resources expected: Workers / D1 / R2 / Queues / Pages / other

## Out of scope

-

---

**Agent instructions:** Because the frontmatter already includes `github-connected`, `cloud-enabled`, and `auto-scale`, treat GitHub + cloud as linked and run the full management loop (IaC, deploy, scale, monitor) for this feature unless acceptance criteria say otherwise.
