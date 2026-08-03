import { Link } from "react-router-dom";
import { SiteNav, Icon } from "../components/SiteNav";

const CARDS = [
  { title: "Projects", value: "3", hint: "Genesis-Alpha active", to: "/workspace" },
  { title: "Deployments", value: "12", hint: "Cloudflare preview", to: "/cloud" },
  { title: "MCP Servers", value: "23", hint: "Marketplace catalog", to: "/marketplace" },
  { title: "Agents", value: "9", hint: "AI DevOps online", to: "/" },
];

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-text-subtle">Cloud Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold">Monaco Cloud control plane</h1>
        <p className="mt-2 text-sm text-text-muted">
          Edge runtime · Git · Kubernetes · Supabase · billing — operated from one OS.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <Link key={c.title} to={c.to} className="dv-card p-5 transition hover:border-border-strong">
              <p className="text-xs text-text-subtle">{c.title}</p>
              <p className="mt-2 text-3xl font-semibold">{c.value}</p>
              <p className="mt-1 text-xs text-text-muted">{c.hint}</p>
            </Link>
          ))}
        </div>
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          <section className="dv-card p-5">
            <h2 className="mb-3 text-sm font-semibold">Edge Cloud Runtime</h2>
            <ul className="space-y-2 text-xs text-text-muted">
              <li className="flex justify-between"><span>Cloudflare Workers</span><span className="text-success">primary</span></li>
              <li className="flex justify-between"><span>AWS / GCP / Azure</span><span>MCS adapters</span></li>
              <li className="flex justify-between"><span>CLI</span><span className="font-mono text-primary">monaco cloud</span></li>
            </ul>
          </section>
          <section className="dv-card p-5">
            <h2 className="mb-3 text-sm font-semibold">Quick actions</h2>
            <div className="flex flex-wrap gap-2">
              {[
                ["/workspace", "Open IDE", "code"],
                ["/kubernetes", "K8s Manager", "deployed_code"],
                ["/supabase", "Supabase", "database"],
                ["/security", "Security", "shield"],
              ].map(([to, label, icon]) => (
                <Link key={to} to={to} className="dv-btn-secondary px-3 py-2 text-xs">
                  <Icon name={icon} className="text-sm" /> {label}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
