# DeVibe

AI-native cloud orchestrator — **tagged PRD or MCP call → agent-managed multi-cloud runtime**.

Phase 1 ships a foundation SDK with **mocked** Cloudflare / AWS / GCP / Azure adapters. No real cloud credentials required for demos.

## Humans & agents — start here

| File | Purpose |
|---|---|
| [`PRD.md`](PRD.md) | Source of truth (`devibe:` frontmatter + tags) |
| [`.devibe/project.yaml`](.devibe/project.yaml) | Machine-readable twin of PRD frontmatter |
| [`prompts/required-feature-prompt.md`](prompts/required-feature-prompt.md) | Template for every new feature |
| [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md) | Canonical monorepo layout |
| [`Makefile`](Makefile) | `prd-validate`, `agents-run`, `deploy-cloudflare`, … |

## Quick start

```bash
pnpm install
make prd-validate          # tags + PRD ↔ yaml sync
make agents-run            # mocked plan via orchestration loop
make agents-apply APPROVED=1
make demo                  # fuller mocked apply + scale demo
```

## Required feature prompt

Copy [`prompts/required-feature-prompt.md`](prompts/required-feature-prompt.md) → `prompts/features/<name>.md`, fill `{{FEATURE_NAME}}`, description, stories, and GitHub fields.

Because frontmatter already includes:

```yaml
tags:
  - github-connected
  - cloud-enabled
  - auto-scale
```

…agents unlock full GitHub + multi-cloud management without extra instructions.

Sample filled prompt: [`prompts/features/cloudflare-first-deployment-flow.md`](prompts/features/cloudflare-first-deployment-flow.md).

## Foundation packages

| Package | Role |
|---|---|
| `@devibe/project-config` | Schema, parser, linkage evaluation |
| `@devibe/cloud-providers` | `CloudProviderInterface` + mocked adapters |
| `@devibe/iac-templates` | Pulumi Cloudflare generator |
| `@devibe/mcp-server` | `manage_project` / `sync_from_prd` + agent stubs |

| `/` | Landing |
| `/chat` | AI Builder chat (LLM prompt screen) |
| `/login` · `/signup` | Auth flow |
| `/workspace` | IDE + dual preview |
| `/cloud` | Cloud distribution |
| `/design-prompts` | Copy Figma UI prompts |
| `/orchestration` | Topology + MCP tools |
| `/fleet` | Global fleet dashboard |

```bash
make web-dev      # http://localhost:5173
make web-build
```

Figma Make prompts also live in [`prompts/figma/`](prompts/figma/).

## MCP

```bash
pnpm --filter @devibe/mcp-server start   # stdio MCP server
```

Tools: `sync_from_prd`, `manage_project` (`status` | `plan` | `apply` | `scale` | `destroy` | `sync-memory`).

## Safety

- High-cost / destructive applies need `APPROVED=1` / `approved: true` unless `production_auto: true`
- `make prd-validate` is required before agent scale/deploy targets
