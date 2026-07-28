# `@devibe/web`

Vite + React + TypeScript web app ported from the DeVibe HTML mockups.

## Routes

| Path | Screen |
|---|---|
| `/` | Landing |
| `/chat` | AI Builder chat (LLM prompt screen) |
| `/login` · `/signup` | Auth flow |
| `/workspace` | Monaco-style IDE + dual preview |
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
