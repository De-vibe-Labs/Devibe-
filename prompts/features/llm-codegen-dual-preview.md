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

# Feature: LLM code generators + dual mobile/web preview

## Summary

Wire Claude/Codex so build intents run a real code generator (`POST /api/ai/generate`). Prefer Codex for codegen. Persist files client-side and show the best generated build in synced desktop + 390px mobile iframes in `/workspace`.

## Why this feature

- Problem it solves: Chat was text-only; IDE previews were decorative.
- Who it is for: Builders iterating on generated websites/apps.
- How it ties to DeVibe: AI Builder → generated artifact → dual-viewport QA before cloud deploy.

## User stories

1. As a builder, I want "build a cafe landing page" to generate real HTML/CSS/JS, so that I can preview it.
2. As a builder, I want desktop and mobile previews of the same build, so that I ship a responsive version.
3. As a builder, I want Codex to generate code (Claude to plan), so that each model does its best job.

## Acceptance criteria

- [x] `/api/ai/generate` returns files + previewHtml
- [x] Codegen prefers Codex when chat model is Claude
- [x] Chat detects build intents and runs the generator
- [x] Workspace loads generated project with live dual iframes (desktop + 390px)
- [x] Offline/mock generator still produces viewport-ready HTML
- [x] Package / function tests and web typecheck pass
