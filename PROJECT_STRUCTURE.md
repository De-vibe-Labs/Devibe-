# Canonical DeVibe monorepo layout
#
# Agents MUST place new code under these paths. Phase 1 ships the foundation
# packages under `packages/*`. Application skeletons are stubbed for growth.
# AI Engineering Platform target layout is marked (planned) — see
# docs/roadmap/AI_ENGINEERING_PLATFORM.md before implementing.

```
.
├── PRD.md                          # Source of truth (devibe: frontmatter)
├── .devibe/
│   └── project.yaml                # Machine-readable twin of PRD frontmatter
├── docs/                           # Platform architecture & specs (Phase 0+)
│   ├── architecture/
│   ├── roadmap/
│   └── specs/                      # MCS open specification
├── prompts/
│   ├── required-feature-prompt.md  # Template for every new feature
│   └── features/                   # Filled feature prompts
├── scripts/
│   └── validate-prd-tags.js        # make prd-validate guard
├── Makefile                        # agents-run, deploy-cloudflare, …
├── package.json                    # pnpm workspace root
├── pnpm-workspace.yaml
├── turbo.json                      # Task graph (optional turbo pipeline)
├── tsconfig.base.json
│
├── apps/                           # Product surfaces (stubs → grow here)
│   ├── web/                        # Vite + React (Cloudflare Pages)
│   └── api/                        # NestJS / Workers API (edge-first)
│
├── packages/                       # Shared libraries
│   ├── project-config/             # @devibe/project-config
│   ├── cloud-providers/            # @devibe/cloud-providers → evolves to MCS adapters
│   ├── iac-templates/              # @devibe/iac-templates
│   ├── mcp-server/                 # @devibe/mcp-server
│   ├── agents/                     # Shared agent prompt registry
│   ├── ui/                         # Design system
│   ├── database/                   # Drizzle → Supabase Postgres
│   ├── auth/                       # @devibe/auth — Firebase Google + Netlify Identity + local
│   ├── mcp-builder/                # @devibe/mcp-builder — MCP server composer + cloud plugin
│   ├── supabase/                   # (planned) provision + Supabase MCP tools
│   ├── mcs-core/                   # (planned) MCS types, errors, capability schemas
│   ├── mcs-conformance/            # (planned) adapter conformance suite
│   ├── mcp-docker/                 # (planned) Docker MCS profile server
│   ├── mcp-kubernetes/             # (planned) Kubernetes MCS profile server
│   └── marketplace/                # (planned) connector catalog + install
│
├── netlify/
│   └── functions/                  # AI chat, MCP builder API
│
├── infra/
│   └── pulumi/                     # Checked-in / generated Pulumi stacks
│       └── cloudflare/             # Small-scale Cloudflare starter
│
└── examples/
    └── genesis-alpha/              # Sample tagged project (demo)
```

## Rules for agents

1. **Never** invent a parallel config — update `PRD.md` and `.devibe/project.yaml` together.
2. New features start from `prompts/required-feature-prompt.md` (copy into `prompts/features/`).
3. IaC changes go under `infra/pulumi/` or are generated via `@devibe/iac-templates`.
4. Provider logic only through `CloudProviderInterface` in `packages/cloud-providers` (Phase 2c+: MCS adapter contract in `@devibe/mcs-core`).
5. MCP tools live in `packages/mcp-server` — prefer extending `manage_project` / `sync_from_prd` before adding one-off tools; new MCS/Supabase tools follow the specs under `docs/`.
6. Run `make prd-validate` before `make agents-run` or any scale/deploy target.
7. **Do not implement roadmap Phase N+1 without an approved Phase N exit** — see `docs/roadmap/AI_ENGINEERING_PLATFORM.md`.

## Phase mapping

| Phase | Layout focus |
|---|---|
| 1 (now) | `packages/*` foundation + root PRD/Makefile triggers |
| 0 (docs) | `docs/roadmap`, `docs/specs/MCS.md`, architecture notes |
| 2 | `apps/web`, `apps/api`; Supabase dataplane; MCS core; real Cloudflare apply |
| 3 | Docker + Kubernetes MCS packages |
| 4+ | Multi-cloud adapters, marketplace, agentic ops, unified DX |
