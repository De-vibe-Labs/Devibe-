import { Link } from "react-router-dom";
import { Icon } from "../components/SiteNav";

const providers = [
  {
    name: "Cloudflare",
    role: "Network",
    detail: "Edge Load 92% · Scaling instances in us-east-1…",
    tone: "text-warning",
    icon: "cloud",
  },
  {
    name: "GCP Artifacts",
    role: "Storage",
    detail: "99.99% Availability · Buckets optimized by AI Orchestrator",
    tone: "text-success",
    icon: "inventory_2",
  },
  {
    name: "AWS Lambda",
    role: "Compute",
    detail: "~$42.10/hr · Spot instances active (Region: global)",
    tone: "text-secondary",
    icon: "memory",
  },
];

const agents = [
  ["database", false],
  ["shield", false],
  ["engineering", true],
  ["monitoring", false],
  ["health_and_safety", false],
  ["payments", false],
] as const;

const actions = [
  {
    agent: "ORCHESTRATOR",
    time: "14:22:04",
    text: "Detected a latency spike in eu-west-3 and is provisioning 4 edge clusters on Cloudflare Workers.",
  },
  {
    agent: "SECURITY",
    time: "14:21:58",
    text: 'Identified a suspicious login pattern and is rotating IAM session tokens for project "Genesis-Alpha."',
  },
  {
    agent: "COST GUARD",
    time: "14:21:30",
    text: "Swapped AWS On-Demand for Spot in us-west-1, estimating +$182.40/day savings.",
  },
  {
    agent: "DEVOPS",
    time: "14:20:12",
    text: "Executed an automated rollback for a performance regression detected in staging.",
  },
];

export function FleetPage() {
  return (
    <div className="flex min-h-screen bg-surface-deep text-on-surface">
      <aside className="hidden w-56 flex-col border-r border-outline-variant/40 p-4 lg:flex">
        <Link to="/" className="mb-8 font-display text-lg font-bold text-primary">
          De Vibe
        </Link>
        {["Home", "Projects", "Agents", "Code", "Deployments", "Marketplace"].map((item, i) => (
          <div
            key={item}
            className={`mb-1 rounded-lg px-3 py-2 text-sm ${
              i === 0 ? "bg-primary-container/25 text-primary" : "text-on-surface-variant"
            }`}
          >
            {item}
          </div>
        ))}
        <div className="mt-auto rounded-xl bg-primary-container/20 p-3 text-xs text-on-primary-container">
          Upgrade to Pro for multi-region orchestration & AI auto-scaling.
        </div>
      </aside>

      <main className="flex-1">
        <header className="flex items-center justify-between border-b border-outline-variant/40 px-6 py-4">
          <div>
            <p className="font-display text-xl text-white">EdgeOS Workspace</p>
            <p className="text-xs text-on-surface-variant">Global fleet intelligence</p>
          </div>
          <div className="text-right text-xs text-on-surface-variant">
            <div className="text-on-surface">Marcus Stone</div>
            <div>Lvl 4 Admin</div>
          </div>
        </header>

        <div className="grid gap-5 p-6 xl:grid-cols-[1fr_280px]">
          <section className="space-y-5">
            <h2 className="font-display text-lg text-white">Global Fleet Status</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {providers.map((p) => (
                <div key={p.name} className="glass rounded-2xl p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{p.name}</p>
                      <p className="text-xs text-on-surface-variant">{p.role}</p>
                    </div>
                    <Icon name={p.icon} className={p.tone} />
                  </div>
                  <p className={`text-xs ${p.tone}`}>{p.detail}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-outline-variant/40 bg-black/40 px-4 py-3 font-mono text-xs text-tertiary">
              LATENCY: LONDON 14ms · TRAFFIC: TOKYO 8.4 GB/s
            </div>

            <div>
              <h3 className="mb-3 font-display text-white">Agentic Maintenance</h3>
              <div className="flex flex-wrap gap-3">
                {agents.map(([icon, thinking]) => (
                  <div
                    key={icon}
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container ${
                      thinking
                        ? "animate-pulse-soft text-primary shadow-[0_0_22px_rgba(110,60,251,0.45)]"
                        : "text-on-surface-variant"
                    }`}
                    title={thinking ? "Thinking…" : icon}
                  >
                    <Icon name={icon === "engineering" ? "settings" : icon === "monitoring" ? "monitoring" : icon === "payments" ? "payments" : icon} />
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-white">Autonomous Actions</h3>
                <span className="text-xs text-on-surface-variant">12 events/min</span>
              </div>
              <ul className="space-y-3">
                {actions.map((a) => (
                  <li key={a.time} className="border-b border-outline-variant/30 pb-3 text-xs last:border-0">
                    <span className="font-mono text-primary">[{a.agent}]</span>{" "}
                    <span className="text-on-surface-variant">({a.time})</span>
                    <p className="mt-1 text-on-surface">{a.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <aside className="glass h-fit rounded-2xl p-5">
            <p className="mb-2 text-xs uppercase tracking-widest text-on-surface-variant">
              Readiness Score
            </p>
            <div className="mx-auto mb-4 flex h-36 w-36 items-center justify-center rounded-full border-4 border-primary/40 shadow-[0_0_30px_rgba(110,60,251,0.25)]">
              <div className="text-center">
                <div className="font-display text-3xl text-white">88</div>
                <div className="text-xs text-on-surface-variant">/ 100</div>
              </div>
            </div>
            <p className="mb-1 text-sm text-success">Unit Tests 100%</p>
            <p className="mb-4 text-sm text-warning">Security Patches · Lacking 2</p>
            <button className="w-full rounded-xl bg-primary-container py-3 text-sm font-bold text-on-primary-container">
              Initiate Auto-Fix
            </button>
          </aside>
        </div>

        <footer className="border-t border-outline-variant/40 px-6 py-3 text-xs text-on-surface-variant">
          v2.4.1-STABLE · Infrastructure Logs · Cost Guardrails · Security Pulse
        </footer>
      </main>
    </div>
  );
}
