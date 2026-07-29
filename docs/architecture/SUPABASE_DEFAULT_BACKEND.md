# Supabase as Default Backend (Hybrid Model)

**Status:** Phase 0 architecture  
**Decision:** Hybrid — Supabase owns the **application data plane**; MCS cloud adapters (Cloudflare-primary for small/edge) own **compute, CDN, and global deploy**.  
**Parent roadmap:** [AI Engineering Platform](../roadmap/AI_ENGINEERING_PLATFORM.md)

---

## 1. Why hybrid

| Concern | Owner |
|---|---|
| Auth, Postgres, RLS, Realtime, Storage, pgvector, Cron, Postgres queues, AI memory | **Supabase** |
| Edge compute, CDN, global routing, Workers/Pages, multi-cloud promote | **MCS adapters** (Cloudflare first) |
| Containers / Kubernetes | **MCS Docker / Kubernetes profiles** |
| Agent tool access to data plane | **Per-project Supabase MCP** |
| Agent tool access to infra | **Platform MCS MCP** |

Supabase Edge Functions are first-class and auto-provisioned, but they are **not** the default global CDN/compute fabric. Prefer Cloudflare (or other MCS adapters) for edge delivery unless the architecture agent chooses Supabase Functions for colocated DB logic.

---

## 2. Auto-provisioned project shape

When a project is created (or PRD tagged `cloud-enabled` + dataplane supabase):

```
Project
├── PostgreSQL Database
├── Authentication
├── Storage Bucket(s)
├── Edge Functions (runtime ready)
├── Vector (pgvector)
├── Realtime Channels
├── File Uploads (Storage)
├── Environment Variables (refs in vault)
├── AI Memory Store (tables + embeddings)
└── Analytics hooks (optional connectors)
```

Plus MCS-side defaults:

```
├── Primary compute adapter (default: cloudflare)
├── CDN / DNS (adapter-specific)
├── Preview + production environments
└── Audit + approval policy
```

---

## 3. Core Supabase services (platform expectations)

| Service | Use in DeVibe projects |
|---|---|
| PostgreSQL | System of record; migrations via agent |
| Auth | End-user and (optionally) builder auth |
| RLS | Default-deny; generated policies |
| Realtime | Presence, collaborative, live dashboards |
| Storage | User uploads, assets (not dynamic structured data) |
| Edge Functions | DB-adjacent serverless |
| pgvector | RAG / AI memory |
| Cron | Scheduled jobs (`pg_cron` / Supabase scheduled functions) |
| Queues | Postgres queue patterns (e.g. `pgmq` / job tables) |
| MCP layer | Per-project Supabase MCP server |

---

## 4. Supabase MCP server (per project)

Auto-provisioned tools (names are normative for Phase 2b):

| Tool | Purpose |
|---|---|
| `create_table` | DDL helper with RLS awareness |
| `create_migration` | Versioned migration file |
| `run_sql` | Controlled SQL (read vs write scopes) |
| `create_bucket` | Storage bucket |
| `deploy_edge_function` | Deploy Supabase Edge Function |
| `create_rpc` | Postgres RPC / function |
| `search_vectors` | pgvector similarity search |
| `create_policy` | RLS policy |
| `generate_rls` | AI-assisted RLS from schema + roles |
| `backup_database` | Trigger backup / snapshot |
| `restore_database` | Restore (approval required) |
| `view_logs` | Platform / function logs |
| `seed_database` | Seed scripts |
| `generate_typescript_types` | Typed client generation |

Agents call these **without boilerplate SDKs**. Credentials stay in vault; MCP runtime injects service role only server-side.

### Safety

- `run_sql` write + `restore_database` + destructive DDL → Security Agent + approval gate.
- Separate tool scopes: `supabase.read`, `supabase.write`, `supabase.admin`.

---

## 5. Package layout (target)

```
packages/
  database/          # Drizzle schemas, migrations helpers → Supabase Postgres
  auth/              # Supabase Auth helpers for apps + control plane
  supabase/          # NEW: provision client, MCP tool implementations, types
apps/
  api/               # Project provision orchestration calling Supabase Management API
```

Control plane may use the same Supabase project or a dedicated platform project; customer data MUST be isolated (separate Supabase projects preferred).

---

## 6. PRD / project.yaml extensions (Phase 2b)

```yaml
devibe:
  dataplane:
    provider: supabase
    project_ref: null          # filled after provision
    features:
      - auth
      - rls
      - realtime
      - storage
      - edge_functions
      - pgvector
      - cron
      - queues
  cloud:
    primary: cloudflare        # MCS compute primary
    adapters: [cloudflare, aws, gcp, azure]
```

`make prd-validate` will gain schema checks for `dataplane` once Phase 2b starts.

---

## 7. Production workflow (data plane slice)

```
AI architecture
  → create Supabase project
  → apply initial migration + RLS
  → configure Auth providers
  → create storage buckets
  → generate Edge Functions (as needed)
  → seed + generate TS types
  → publish env secret refs to MCS deploy
  → Cloudflare (or other) deploy consumes SUPABASE_URL / anon / service refs
```

---

## 8. Explicit non-goals (this architecture)

- Replacing MCS with Supabase-only hosting for all apps.
- Using Supabase Storage as a general-purpose database.
- Exposing service-role keys to browser or LLM context.

---

## 9. Phase 2b exit criteria

- [ ] Creating a DeVibe project provisions a Supabase project (or links BYO).
- [ ] Supabase MCP tools available to agents for that project.
- [ ] Sample app deploys to Cloudflare with Supabase Auth + DB wired.
- [ ] Audit events for all mutating Supabase MCP calls.
