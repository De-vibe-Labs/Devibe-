# DeVibe Foundation SDK

Phase 1 foundation for **agent-managed, serverless/edge-first multi-cloud** infrastructure.

A single MCP call (`manage_project` / `sync_from_prd`) or a tagged `.devibe/project.yaml` / PRD is enough for agents to detect **GitHub + cloud connected**, then plan, provision, scale, and manage — using **fully mocked** Cloudflare / AWS / GCP / Azure adapters (no real cloud credentials required).

## Packages

| Package | Role |
|---|---|
| [`@devibe/project-config`](packages/project-config) | `project.yaml` / PRD front-matter schema, parser, linkage evaluation |
| [`@devibe/cloud-providers`](packages/cloud-providers) | `CloudProviderInterface` + mocked CF/AWS/GCP/Azure adapters |
| [`@devibe/iac-templates`](packages/iac-templates) | Pulumi Cloudflare starter the DevOps Agent generates |
| [`@devibe/mcp-server`](packages/mcp-server) | MCP tools, orchestration loop, Product/DevOps/Security/Backend/QA stubs |

Example metadata: [`examples/genesis-alpha`](examples/genesis-alpha).

## Quick start

```bash
pnpm install
pnpm build
pnpm test

# End-to-end mocked demo
pnpm --filter @devibe/mcp-server exec tsx src/demo.ts

# Stdio MCP server (for Cursor / Claude / etc.)
pnpm --filter @devibe/mcp-server start
```

## Trigger system

```yaml
# .devibe/project.yaml
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
    adapters: [cloudflare, aws, gcp, azure]
    region_preference: auto
    scale_policy: cost-optimized
  memory:
    project_id: 550e8400-e29b-41d4-a716-446655440000
```

When `github-connected` + `cloud-enabled` tags resolve with valid config, the banner becomes:

> Cloud + GitHub linked — full lifecycle management available.

## MCP tools

- **`sync_from_prd`** — parse tagged PRD / YAML; optionally auto-run `manage_project`
- **`manage_project`** — `status` | `plan` | `apply` | `scale` | `destroy` | `sync-memory`

Safety: high-cost / destructive applies require `approved: true` or `production_auto: true`. Every action emits structured JSON agent events (orchestrator, devops, security, qa, backend).

## Architecture (Phase 1)

```
PRD / project.yaml ──► sync_from_prd ──► linkage check
                              │
                              ▼
                      manage_project
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        DevOps Agent    Security Agent    QA Agent
              │
              ▼
   CloudProviderInterface (mocked)
   CF | AWS | GCP | Azure
              │
              ▼
   Pulumi Cloudflare template preview + in-memory resources
```

## Scaling path (not implemented here)

1. **Small** — single Cloudflare account, per-project Workers/Pages/D1/R2 (mock today)
2. **Multi-tenant** — promote workloads to user AWS/GCP/Azure via adapters
3. **Full multi-cloud** — optional Kubernetes, global traffic, agent auto-scaling policies

## License

Private — De-vibe-Labs
