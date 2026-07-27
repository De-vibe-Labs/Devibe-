---
devibe:
  version: 1
  tags:
    - github-connected
    - cloud-enabled
    - auto-scale
  github:
    owner: De-vibe-Labs
    repo: genesis-alpha
    default_branch: main
  cloud:
    primary: cloudflare
    adapters: [cloudflare, aws]
    region_preference: auto
    scale_policy: cost-optimized
  memory:
    project_id: 550e8400-e29b-41d4-a716-446655440000
---

# Genesis Alpha — Product Requirements

Turn a tagged PRD into a globally distributed, agent-managed runtime.

## Goals

- Start serverless/edge-first on Cloudflare (Workers, D1, R2, Queues).
- Keep adapters provider-agnostic so AWS/GCP/Azure can be promoted later.
- A single `sync_from_prd` or `manage_project` MCP call is enough once
  GitHub + cloud tags are present.
