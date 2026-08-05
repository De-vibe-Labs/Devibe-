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

# Feature: Firebase login + Stripe pricing & referrals

## Summary

Firebase email, Google, and GitHub sign-in; chat routes to `/login` when GitHub connect (or authenticated codegen) is prompted; Stripe pricing plans with a referral discount/credit model.

## Acceptance criteria

- [x] Firebase OAuth supports Google + GitHub; email/password unchanged
- [x] Chat detects GitHub-connect intents and navigates to login with intent
- [x] Unsigned codegen / github-connected prompts also route to login
- [x] `/pricing` + `/api/billing/plans|checkout|referral` with mock Stripe fallback
- [x] Tests + typecheck
