import { SiteNav } from "../components/SiteNav";

const SERVICES = [
  ["Database", "PostgreSQL + pgvector"],
  ["Authentication", "Supabase Auth + RLS"],
  ["Storage", "Buckets + CDN"],
  ["Realtime", "Channels"],
  ["Edge Functions", "Serverless TS"],
  ["Vector Database", "Embeddings store"],
  ["Policies", "RLS generators"],
  ["Cron Jobs", "pg_cron"],
  ["Backups", "PITR hooks"],
  ["Database MCP", "Auto-provisioned tools"],
];

export function SupabaseManagerPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 pt-24 pb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-text-subtle">Supabase Manager</p>
        <h1 className="mt-2 text-3xl font-semibold">Default data plane</h1>
        <p className="mt-2 text-sm text-text-muted">
          Auto-create project dataplane. CLI: <code className="text-primary">monaco database</code>
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {SERVICES.map(([title, body]) => (
            <div key={title} className="dv-card p-4">
              <h2 className="text-sm font-medium">{title}</h2>
              <p className="mt-1 text-xs text-text-muted">{body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
