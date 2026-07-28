import { Link } from "react-router-dom";
import { Icon } from "../components/SiteNav";

const OPTIONS = [
  {
    title: "Edge-first",
    subtitle: "Cloudflare Workers + D1 + R2",
    badge: "Recommended",
    detail: "Near-zero cost, globally distributed by default.",
  },
  {
    title: "Serverless multi-cloud",
    subtitle: "AWS · GCP · Azure adapters",
    badge: null,
    detail: "Promote workloads via CloudProviderInterface.",
  },
  {
    title: "Kubernetes",
    subtitle: "EKS Fargate / GKE Autopilot",
    badge: null,
    detail: "For heavier long-running services.",
  },
  {
    title: "Hybrid",
    subtitle: "User’s own cloud accounts",
    badge: null,
    detail: "Per-project credentials in encrypted vault.",
  },
];

const RESOURCES = [
  { name: "genesis-alpha-edge-worker", kind: "Worker", usage: 42 },
  { name: "genesis-alpha-d1", kind: "D1", usage: 18 },
  { name: "genesis-alpha-r2-artifacts", kind: "R2", usage: 33 },
  { name: "genesis-alpha-agent-events", kind: "Queue", usage: 12 },
];

export function CloudPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <header className="flex h-14 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm font-semibold">
            DeVibe
          </Link>
          <span className="text-border-strong">/</span>
          <span className="text-sm">Genesis-Alpha</span>
          <div className="ml-2 hidden gap-2 sm:flex">
            <span className="dv-tag">github-connected</span>
            <span className="dv-tag">cloud-enabled</span>
            <span className="dv-tag">auto-scale</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/chat" className="dv-btn-secondary px-3 py-1.5 text-xs">
            AI Builder
          </Link>
          <button type="button" className="dv-btn-primary px-3 py-1.5 text-xs">
            Apply changes
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 p-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <section className="dv-card p-5">
            <h2 className="mb-4 text-sm font-medium">Current architecture</h2>
            <div className="flex flex-wrap items-center justify-center gap-4 py-6">
              <ArchNode label="DeVibe Control Plane" glow />
              <Icon name="arrow_forward" className="text-text-subtle" />
              {["Cloudflare", "AWS", "GCP", "Azure"].map((p, i) => (
                <ArchNode key={p} label={p} primary={i === 0} />
              ))}
            </div>
            <p className="text-center text-xs text-text-muted">
              A tagged PRD or single MCP call is enough to plan, provision, and scale.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-medium">One-click distribution</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {OPTIONS.map((o) => (
                <button
                  key={o.title}
                  type="button"
                  className="dv-card p-4 text-left transition hover:border-primary/50"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{o.title}</p>
                    {o.badge ? (
                      <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] text-primary">
                        {o.badge}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-accent">{o.subtitle}</p>
                  <p className="mt-2 text-xs text-text-muted">{o.detail}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="dv-card p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-medium">Scale policy</h2>
              <div className="flex rounded-lg border border-border p-0.5 text-xs">
                {["Cost-optimized", "Balanced", "Performance"].map((p, i) => (
                  <button
                    key={p}
                    type="button"
                    className={`rounded-md px-3 py-1.5 ${
                      i === 0 ? "bg-primary text-white" : "text-text-muted"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <ul className="space-y-3">
              {RESOURCES.map((r) => (
                <li key={r.name} className="flex items-center gap-3 text-xs">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex justify-between">
                      <span className="truncate font-mono text-text-muted">{r.name}</span>
                      <span className="text-text-subtle">{r.kind}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-highest">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${r.usage}%` }}
                      />
                    </div>
                  </div>
                  <button type="button" className="dv-btn-secondary shrink-0 px-2 py-1 text-[10px]">
                    Manage via MCP
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <div className="flex flex-wrap gap-2">
            <button type="button" className="dv-btn-secondary px-3 py-2 text-xs">
              Generate IaC (Pulumi)
            </button>
            <button type="button" className="dv-btn-secondary px-3 py-2 text-xs">
              Open PR on GitHub
            </button>
            <button type="button" className="dv-btn-primary px-3 py-2 text-xs">
              Promote to production
            </button>
          </div>
        </div>

        <aside className="dv-card h-fit p-4">
          <h3 className="mb-3 text-sm font-medium">Recent agent actions</h3>
          <ul className="space-y-3 text-xs text-text-muted">
            <li>
              <span className="text-primary">DevOps</span> scaled Cloudflare Workers ×4
            </li>
            <li>
              <span className="text-primary">Security</span> scanned IAM session tokens
            </li>
            <li>
              <span className="text-primary">QA</span> readiness score 88/100
            </li>
            <li>
              <span className="text-primary">Cost Guard</span> switched to Spot (+$182/day)
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

function ArchNode({
  label,
  glow,
  primary,
}: {
  label: string;
  glow?: boolean;
  primary?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 text-center text-xs ${
        glow
          ? "border-primary/40 bg-primary-soft text-primary shadow-[0_0_24px_rgba(124,58,237,0.25)]"
          : primary
            ? "border-success/40 bg-success/10 text-success"
            : "border-border bg-surface-card text-text-muted"
      }`}
    >
      {label}
    </div>
  );
}
