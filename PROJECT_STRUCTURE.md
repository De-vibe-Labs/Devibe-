# Canonical DeVibe monorepo layout
#
# Agents MUST place new code under these paths. Phase 1 ships the foundation
# packages under `packages/*`. Application skeletons are stubbed for growth.

```
.
├── PRD.md                          # Source of truth (devibe: frontmatter)
├── .devibe/
│   └── project.yaml                # Machine-readable twin of PRD frontmatter
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
├── packages/                       # Shared libraries (Phase 1 implemented)
│   ├── project-config/             # @devibe/project-config
│   ├── cloud-providers/            # @devibe/cloud-providers (mocked adapters)
│   ├── iac-templates/              # @devibe/iac-templates
│   ├── mcp-server/                 # @devibe/mcp-server
│   ├── agents/                     # Future: shared agent prompt registry
│   ├── ui/                         # Future: design system
│   ├── database/                   # Future: Drizzle / D1 schemas
│   └── auth/                       # Future: auth helpers
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
4. Provider logic only through `CloudProviderInterface` in `packages/cloud-providers`.
5. MCP tools live in `packages/mcp-server` — prefer extending `manage_project` / `sync_from_prd` before adding one-off tools.
6. Run `make prd-validate` before `make agents-run` or any scale/deploy target.

## Phase mapping

| Phase | Layout focus |
|---|---|
| 1 (now) | `packages/*` foundation + root PRD/Makefile triggers |
| 2 | Flesh out `apps/web`, `apps/api`; real Cloudflare apply path |
| 3 | Multi-cloud promote via adapters; optional Kubernetes modules |
