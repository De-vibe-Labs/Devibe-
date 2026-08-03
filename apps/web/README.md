# `@devibe/web`

Vite + React + TypeScript web app ported from the DeVibe HTML mockups.

## Routes

| Path | Screen |
|---|---|
| `/` | AI Builder chat prompt (product entry) |
| `/chat` | Redirects to `/` |
| `/home` | Marketing landing |
| `/login` · `/signup` | Auth flow |
| `/mcp` | MCP Server Builder |
| `/workspace` | IDE + live desktop (web) & 390px mobile previews |
| `/cloud` | Cloud distribution & deployment |
| `/design-prompts` | Copy Figma Make UI prompts |
| `/orchestration` | Topology + MCP tools |
| `/fleet` | Global fleet dashboard |

## Commands

```bash
pnpm --filter @devibe/web dev
pnpm --filter @devibe/web build
# or from repo root:
make web-dev
make web-build
```
