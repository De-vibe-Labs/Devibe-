# DeVibe / Monaco Cloud

**Monaco Cloud** — Build. Deploy. Scale. Anywhere.

AI-native cloud OS centered on [Monaco Editor](https://microsoft.github.io/monaco-editor/), with DeVibe’s MCS + Supabase dataplane underneath.

Architecture: [`docs/architecture/MONACO_CLOUD.md`](docs/architecture/MONACO_CLOUD.md)

Phase 1 ships a foundation SDK with **mocked** Cloudflare / AWS / GCP / Azure adapters. No real cloud credentials required for demos.

**Roadmap (Phase 0 docs):** [`docs/roadmap/AI_ENGINEERING_PLATFORM.md`](docs/roadmap/AI_ENGINEERING_PLATFORM.md) — hybrid Supabase data plane + MCS cloud adapters; approve phases before coding.

## Humans & agents — start here

| File | Purpose |
|---|---|
| [`PRD.md`](PRD.md) | Source of truth (`devibe:` frontmatter + tags) |
| [`.devibe/project.yaml`](.devibe/project.yaml) | Machine-readable twin of PRD frontmatter |
| [`docs/roadmap/AI_ENGINEERING_PLATFORM.md`](docs/roadmap/AI_ENGINEERING_PLATFORM.md) | Multi-phase platform expansion plan |
| [`docs/specs/MCS.md`](docs/specs/MCS.md) | Model Cloud Standard (draft) |
| [`docs/architecture/MONACO_CLOUD.md`](docs/architecture/MONACO_CLOUD.md) | Monaco Cloud OS modules + CLI + QR |
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
make web-dev               # Vite + Netlify Functions (auth, AI, MCP builder)
```

### Auth · AI · MCP Builder

| Surface | Path |
|---|---|
| Sign in / Sign up | `/login`, `/signup` — Firebase Google (preferred) → Netlify Identity → local |
| AI Builder (home) | `/` — Claude plans · Codex generates via `/api/ai/chat` + `/api/ai/generate` |
| MCP Server Builder | `/mcp` — compose servers with **Cloud plugin** |
| IDE (Monaco) | `/workspace` — Monaco Editor + dual preview + OS chrome |
| MCP Marketplace | `/marketplace` |
| Security Center | `/security` — QR pairing (no credentials) |
| Cloud Dashboard | `/dashboard` |
| Pricing | `/pricing` — Stripe plans + referral codes |

Set `VITE_FIREBASE_*` for Firebase Google Sign-In (see `.env.example`). Without Firebase, Netlify Identity is used after deploy; locally auth falls back to a demo session store. Enable AI Features on Netlify for live Claude / Codex; otherwise the local code generator still produces previewable apps.

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
| `@devibe/auth` | Firebase Google Sign-In + Netlify Identity + local fallback |
| `@devibe/mcp-builder` | MCP server composer + Cloud / Supabase / Docker / K8s plugins |
| `@devibe/mcp-server` | `manage_project` / `sync_from_prd` + optional cloud plugin tools |

| `/` | AI Builder chat prompt (entry) |
| `/home` | Marketing landing |
| `/mcp` | MCP Server Builder + Cloud plugin |
| `/login` · `/signup` | Auth flow |
| `/workspace` | IDE + live desktop & mobile previews |
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
