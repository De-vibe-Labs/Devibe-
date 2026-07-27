import { Link } from "react-router-dom";
import { Icon } from "../components/SiteNav";

const tools = [
  { name: "Terraform Cloud", status: "Executing: Plan", tone: "text-tertiary" },
  { name: "K8s Scaler", status: "Idle: Optimization", tone: "text-success" },
  { name: "Deploy Hook", status: "Pending Approval", tone: "text-warning" },
];

export function OrchestrationPage() {
  return (
    <div className="flex min-h-screen bg-surface-deep text-on-surface">
      <aside className="hidden w-64 flex-col border-r border-outline-variant/40 p-4 md:flex">
        <Link to="/" className="mb-8 font-display text-lg font-bold text-primary">
          De Vibe
        </Link>
        <p className="mb-2 text-[10px] uppercase tracking-widest text-on-surface-variant">
          Orchestration Tools
        </p>
        <nav className="mb-8 space-y-1 text-sm">
          {[
            ["Overview", "dashboard", true],
            ["Infrastructure", "hub", false],
            ["AI Agents", "smart_toy", false],
          ].map(([label, icon, active]) => (
            <div
              key={label as string}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                active ? "bg-primary-container/25 text-primary" : "text-on-surface-variant"
              }`}
            >
              <Icon name={icon as string} />
              {label}
            </div>
          ))}
        </nav>
        <p className="mb-2 text-[10px] uppercase tracking-widest text-on-surface-variant">
          MCP Active Tools
        </p>
        <ul className="space-y-2 text-xs">
          {tools.map((t) => (
            <li key={t.name} className="glass rounded-lg px-3 py-2">
              <div className="font-medium text-white">{t.name}</div>
              <div className={t.tone}>{t.status}</div>
            </li>
          ))}
        </ul>
        <div className="mt-auto rounded-xl bg-primary-container/20 p-4 text-xs text-on-primary-container">
          Upgrade to Pro — unlock unlimited agent nodes and multi-cloud peering.
        </div>
      </aside>

      <main className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-outline-variant/40 px-6 py-4">
          <input
            className="w-full max-w-md rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="Search clusters…"
          />
          <div className="ml-4 flex gap-3 text-on-surface-variant">
            <Icon name="notifications" />
            <Icon name="settings" />
          </div>
        </header>

        <div className="relative flex-1 p-6">
          <div className="mb-6 flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-success/40 bg-success/10 px-3 py-1 text-xs text-success">
              <span className="h-2 w-2 rounded-full bg-success" />
              Cloud Status: Healthy
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-3 py-1 text-xs text-warning">
              <Icon name="warning" className="text-sm" />
              1 Warning in US-EAST
            </span>
          </div>

          <div className="glass relative mx-auto flex min-h-[360px] max-w-4xl items-center justify-between rounded-3xl p-8">
            <Node label="Global Users" icon="public" />
            <div className="hidden h-px flex-1 bg-outline-variant/50 md:block" />
            <div className="flex flex-col gap-6">
              <Node label="EU-WEST-1" icon="lan" />
              <Node label="AP-SOUTH-1" icon="lan" />
            </div>
            <div className="hidden h-px flex-1 bg-outline-variant/50 md:block" />
            <Node label="AI Gateway" icon="auto_awesome" glow />
            <div className="hidden h-px flex-1 bg-outline-variant/50 md:block" />
            <div className="flex flex-col gap-6">
              <Node label="Clusters" icon="grid_view" />
              <Node label="Serverless DB" icon="database" />
            </div>
          </div>

          <div className="glass absolute right-8 bottom-8 w-72 rounded-2xl p-4 shadow-2xl">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Icon name="bolt" className="text-warning" />
              Live Orchestration
            </div>
            <p className="mb-3 text-xs text-secondary">
              Active Agent: <span className="text-tertiary">Agent-922</span>
            </p>
            <Meter label="CPU Utilization" value="42.8%" width="w-[43%]" />
            <Meter label="Latency (P99)" value="14ms" width="w-[22%]" />
            <p className="mt-3 rounded-lg bg-surface-container-lowest p-2 font-mono text-[10px] text-on-surface-variant">
              Analyzing edge traffic patterns for EU-West-1. Optimizing cold-start routes…
            </p>
          </div>
        </div>

        <footer className="border-t border-outline-variant/40 px-6 py-3 text-xs text-on-surface-variant">
          © {new Date().getFullYear()} De Vibe AI Cloud. All systems operational.
        </footer>
      </main>
    </div>
  );
}

function Node({
  label,
  icon,
  glow,
}: {
  label: string;
  icon: string;
  glow?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container ${
          glow ? "shadow-[0_0_28px_rgba(110,60,251,0.45)] text-primary" : "text-on-surface"
        }`}
      >
        <Icon name={icon} />
      </div>
      <span className="text-[11px] text-on-surface-variant">{label}</span>
    </div>
  );
}

function Meter({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between text-[11px] text-on-surface-variant">
        <span>{label}</span>
        <span className="text-success">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-container-highest">
        <div className={`h-full rounded-full bg-success ${width}`} />
      </div>
    </div>
  );
}
