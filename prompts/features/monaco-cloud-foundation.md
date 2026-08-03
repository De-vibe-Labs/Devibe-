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

# Feature: Monaco Cloud foundation

## Summary

Establish **Monaco Cloud** — an AI-native cloud OS centered on Monaco Editor — with: real Monaco IDE chrome, first-party `monaco` CLI, Universal MCP Standard + Marketplace catalog, secure QR developer access (no credentials in QR), and module shells for Security, Cloud Dashboard, Kubernetes, and Supabase managers.

## Why this feature

- Problem it solves: DeVibe has chat/codegen/previews but lacks a production IDE OS, CLI, marketplace, and secure device pairing.
- Who it is for: Developers who build, deploy, and scale from one Monaco surface.
- How it ties to DeVibe: Extends Phase 8 unified DX; keeps MCS + Supabase dataplane as backends.

## User stories

1. As a developer, I want a Monaco IDE with explorer/cloud/MCP/git/agents sidebars, so that I operate the full cloud OS from one editor.
2. As a developer, I want `monaco deploy|dev|mcp|…` CLI commands, so that local and CI share one workflow.
3. As a team lead, I want QR pairing that never embeds secrets, so that mobile/desktop devices join workspaces safely.

## Acceptance criteria

- [x] Architecture doc for Monaco Cloud modules
- [x] `@devibe/cli` exposes `monaco` bin with core command surface
- [x] `@devibe/qr-access` issues signed pairing payloads (no credentials)
- [x] `@devibe/mcp-marketplace` catalogs supported MCP servers + universal capability schema
- [x] Workspace uses Monaco Editor with left/bottom/right panels + dual preview
- [x] Module routes: marketplace, security, k8s, supabase, dashboard
- [x] Tests + web typecheck/build pass
