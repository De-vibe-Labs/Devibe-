# Monaco Cloud — AI Cloud Operating System

**Product:** Monaco Cloud  
**Tagline:** Build. Deploy. Scale. Anywhere.  
**Editor core:** [Monaco Editor](https://microsoft.github.io/monaco-editor/)  
**Repo linkage:** DeVibe monorepo (`@devibe/*`) — Monaco Cloud is the unified DX surface over MCS + Supabase.

This is **not** only a code editor. It is an AI-native cloud OS for developers.

---

## Primary modules

| Module | Package / route | Role |
|---|---|---|
| Monaco IDE | `/workspace` | Explorer, editor, dual preview, panels |
| AI Agent Workspace | `/` · `/agents` | Multi-agent chat + codegen |
| Cloud CLI | `@devibe/cli` (`monaco`) | First-party operator CLI |
| MCP Builder | `/mcp` | Visual MCP server composer |
| MCP Marketplace | `/marketplace` · `@devibe/mcp-marketplace` | One-click connectors |
| Edge Cloud Runtime | MCS adapters | Cloudflare-first edge compute |
| Git Manager | IDE Git rail + `monaco github` | OAuth / GitHub App — never passwords |
| Kubernetes Manager | `/kubernetes` | Namespaces, deploy, Helm stubs |
| Supabase Manager | `/supabase` | DB, Auth, Storage, Realtime, vectors |
| Cloud Dashboard | `/dashboard` | Projects, deploys, metrics |
| Security Center | `/security` | Sessions, keys, QR, audit |
| QR Developer Access | `@devibe/qr-access` | Signed pairing — **no credentials in QR** |
| Team Workspace | roles in Security / Dashboard | Owner → Viewer + custom |
| AI DevOps | agents via MCP | Infra, Security, K8s, Cost, Recovery |

---

## Universal MCP Standard

Every MCP server exposes (see `@devibe/mcp-marketplace` schema):

Authentication · Permissions · Tools · Resources · Events · Logging · Health Checks · Secrets · Versioning · Metrics · Documentation

Supported catalog seeds: Supabase, GitHub, Cloudflare, GCP, AWS, Azure, Kubernetes, Docker, Stripe, Slack, Discord, Linear, OpenAI, Anthropic, Redis, Postgres, MongoDB, Pinecone, Qdrant, Resend, Twilio, Vercel, Terraform.

---

## Secure QR Cloud Access

QR payload fields (**never** passwords, API keys, or refresh tokens):

```
encryptedSessionToken | projectId | workspaceId | deviceRegistrationRequest | expiry | signature
```

Flow: scan → authenticate → verify device → short-lived access token → trust device → connect workspace.

---

## CLI (`monaco`)

`login` · `init` · `create project` · `deploy` · `dev` · `logs` · `shell` · `database` · `secrets` · `env` · `ai` · `mcp` · `plugins` · `cloud` · `k8s` · `docker` · `github` · `rollback` · `monitor` · `tunnel` · `sync` · `build` · `release` · `agents` · `workspaces` · `billing`

---

## Security posture

- OAuth / magic links / passkeys / WebAuthn / 2FA (roadmap wiring; Firebase Google live today)
- Secrets via vault refs only — never in logs or QR
- RBAC: Owner, Admin, Developer, Maintainer, Guest, Viewer, Custom
- Recovery: encrypted package, recovery codes, recovery QR, restore wizard

---

## Phase alignment

Foundation code in this change set is **Phase 8 DX scaffold** on top of existing Phase 1 SDK + codegen dual-preview. Live Supabase/K8s/GitHub App provisioning remains gated by roadmap Phases 2–6.
