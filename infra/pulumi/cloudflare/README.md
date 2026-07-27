# Pulumi — Cloudflare small-scale stack

Agent-managed IaC entrypoint. The DevOps Agent also generates an equivalent
module via `@devibe/iac-templates` (`renderCloudflarePulumiModule`).

Phase 1 applies go through **mocked** `CloudProviderInterface` adapters
(`make agents-apply APPROVED=1`). Use `pulumi up` only when leaving mock mode
with real Cloudflare credentials.
