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
    adapters: [cloudflare, aws, gcp, azure]
    region_preference: auto
    scale_policy: cost-optimized
  memory:
    project_id: 550e8400-e29b-41d4-a716-446655440000
  production_auto: false
---

# Feature: Login, Claude/Codex AI APIs, MCP Server Builder + Cloud plugin

## Summary

Ship a real login system (Netlify Identity with local fallback), Claude + Codex chat APIs via Netlify Functions / AI Gateway, and an MCP Server Builder UI that installs the Cloud plugin (MCS tools).

## Acceptance criteria

- [x] `@devibe/auth` with Identity + local session
- [x] Auth pages wire to login/signup/oauth; `/chat` and `/mcp` require auth
- [x] `/api/ai/chat` and `/api/ai/models` for Claude + Codex models
- [x] `@devibe/mcp-builder` + `/mcp` UI with cloud plugin
- [x] MCP server `createMcpServer({ plugins: ['cloud'] })` registers cloud tools
- [ ] `make prd-validate` and package tests pass
