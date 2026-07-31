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

# Feature: Firebase Google Sign-In

## Summary

Add Firebase Authentication with Google Sign-In to `@devibe/auth` and the web login/signup flow. Prefer Firebase when `VITE_FIREBASE_*` is configured; keep Netlify Identity and local session as fallbacks.

## Why this feature

- Problem it solves: Real Google OAuth without waiting on Netlify Identity deploy setup.
- Who it is for: Builders signing into DeVibe from `/login` and `/signup`.
- How it ties to DeVibe's edge-first / agent-managed infra goals: Portable auth client that works on Vite/Netlify/Vercel hosts via standard Firebase web config.

## User stories

1. As a builder, I want to Continue with Google via Firebase, so that I get a real authenticated session.
2. As a developer, I want env-based Firebase config, so that local and production can share the same auth package.
3. As a demo user without Firebase keys, I want local/Netlify fallbacks, so that the app still works.

## Acceptance criteria

- [x] `@devibe/auth` resolves Firebase → Identity → local
- [x] Google OAuth uses Firebase popup (redirect fallback) when configured
- [x] Auth UI reflects active backend and available providers
- [x] `.env.example` documents `VITE_FIREBASE_*`
- [x] Package tests and `make prd-validate` pass
