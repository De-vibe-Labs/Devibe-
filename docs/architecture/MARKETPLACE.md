# Infrastructure Marketplace (Phase 5 sketch)

**Status:** Phase 0 sketch — implement only after MCS + Supabase MCP are stable.  
**Parent:** [AI Engineering Platform roadmap](../roadmap/AI_ENGINEERING_PLATFORM.md)

## Model

Users install **connectors** with one click. Each connector:

1. Completes OAuth / API key vault storage.
2. Registers an MCP tool namespace (`{connectorId}.*`).
3. Appears in capability discovery for project-scoped agents.

## Initial catalogue

| Connector | Domain |
|---|---|
| Supabase | Dataplane (often pre-installed) |
| Cloudflare, Google Cloud, AWS, Azure | MCS cloud adapters |
| GitHub, GitLab | Source + PR workflows |
| Stripe | Billing |
| Slack, Discord | Notifications |
| Linear | Issues |
| OpenAI, Anthropic | Model providers |
| Twilio, Resend | Messaging / email |
| PostHog | Product analytics |
| Grafana, Prometheus | Observability |

## Package

`packages/marketplace` — catalog Zod schema, install/uninstall API, tool registration hooks into hosted MCP.
