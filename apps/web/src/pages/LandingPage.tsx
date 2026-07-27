import { Link } from "react-router-dom";
import { Icon, SiteNav } from "../components/SiteNav";

export function LandingPage() {
  return (
    <div className="grain min-h-screen">
      <SiteNav />
      <main className="pt-16">
        <section className="hero-glow relative flex min-h-[88vh] flex-col items-center justify-center px-6 text-center">
          <div className="animate-fade-up relative z-10 mx-auto mt-10 max-w-4xl space-y-8">
            <div className="animate-pulse-soft inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary-container/20 px-3 py-1 font-mono text-xs text-secondary">
              <Icon name="auto_awesome" className="text-sm" />
              Beta: v2.4 Orchestration Engine is now live
            </div>
            <h1 className="bg-gradient-to-b from-white to-white/55 bg-clip-text font-display text-5xl font-bold leading-[1.08] tracking-tight text-transparent md:text-7xl">
              De Vibe
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-on-surface-variant md:text-xl">
              Turn any idea into production-ready software. Autonomous agents plan, provision, and
              scale Cloudflare-first infrastructure from a tagged PRD.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
              <Link
                to="/workspace"
                className="w-full rounded-xl bg-primary px-8 py-4 text-lg font-bold text-on-primary shadow-xl shadow-primary/20 transition hover:scale-[1.02] active:scale-95 sm:w-auto"
              >
                Start building for free
              </Link>
              <Link
                to="/orchestration"
                className="glass flex w-full items-center justify-center gap-2 rounded-xl px-8 py-4 text-lg font-bold transition hover:bg-surface-container-high sm:w-auto"
              >
                <Icon name="play_circle" />
                Watch orchestration
              </Link>
            </div>
            <div className="pt-16 opacity-70">
              <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-on-surface-variant">
                Trusted by visionary builders at
              </p>
              <div className="flex flex-wrap justify-center gap-x-10 gap-y-4">
                {["Cloudflare", "GitHub", "Pulumi", "Neon"].map((name) => (
                  <div
                    key={name}
                    className="animate-shimmer h-7 min-w-24 rounded-md bg-white/10 px-4 py-1 text-xs font-medium text-white/70"
                  >
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
            <FeatureWide
              icon="smart_toy"
              title="Multi-agent Orchestration"
              body="Specialized agents for Security, DevOps, Backend, and QA collaborate on your repo via structured JSON events and MCP tools."
              className="md:col-span-8"
              accent="text-tertiary"
            />
            <Feature
              icon="description"
              title="Product Agent"
              body="Turns loose ideas into tagged PRDs and .devibe/project.yaml metadata."
              className="md:col-span-4 border-l-4 border-l-primary"
              accent="text-primary"
              code='$ analyze "payment gateway for SaaS"'
            />
            <Feature
              icon="terminal"
              title="IDE + Previews"
              body="Real-time generation with desktop and mobile sandboxed previews."
              className="md:col-span-4"
              accent="text-secondary"
            />
            <Feature
              icon="rocket_launch"
              title="One-click Deploy"
              body="Cloudflare-first edge deploy with mocked multi-cloud adapters today."
              className="md:col-span-4"
              accent="text-success"
            />
            <Feature
              icon="account_tree"
              title="GitHub Workflow"
              body="Agents open PRs, review code, and keep docs in sync with every commit."
              className="md:col-span-4"
              accent="text-on-primary-container"
            />
          </div>
        </section>

        <section className="bg-surface-deep py-20">
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-14 text-center">
              <h2 className="mb-3 font-display text-3xl text-white md:text-5xl">
                From idea to scale in minutes
              </h2>
              <p className="text-on-surface-variant">
                The shortest path between a concept and a global product.
              </p>
            </div>
            <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4">
              <div className="absolute top-12 left-0 hidden h-px w-full bg-gradient-to-r from-transparent via-outline-variant to-transparent md:block" />
              {[
                ["lightbulb", "1. Idea", "Describe your vision in plain English."],
                ["polyline", "2. Design", "Agents draft infra and schema for review."],
                ["code", "3. Code", "Typed code, tests, and Pulumi modules."],
                ["trending_up", "4. Scale", "Auto-scale with cost and security gates."],
              ].map(([icon, title, body]) => (
                <div key={title} className="relative z-10 flex flex-col items-center space-y-5 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-high text-primary shadow-lg shadow-primary/10">
                    <Icon name={icon} className="text-3xl" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-display text-white">{title}</h4>
                    <p className="text-sm text-on-surface-variant">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="border-t border-outline-variant/40 px-6 py-10 text-center text-sm text-on-surface-variant">
          © {new Date().getFullYear()} De Vibe AI Cloud. Cloud + GitHub linked — full lifecycle
          management available.
        </footer>
      </main>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
  className = "",
  accent,
  code,
}: {
  icon: string;
  title: string;
  body: string;
  className?: string;
  accent: string;
  code?: string;
}) {
  return (
    <div className={`glass flex flex-col justify-between rounded-3xl p-8 ${className}`}>
      <div className="space-y-4">
        <Icon name={icon} className={`text-4xl ${accent}`} />
        <h3 className="font-display text-xl text-white">{title}</h3>
        <p className="text-sm text-on-surface-variant">{body}</p>
      </div>
      {code ? (
        <div className="mt-8 rounded-xl border border-outline-variant bg-surface-container-highest/40 p-4 font-mono text-xs text-primary">
          {code}
        </div>
      ) : null}
    </div>
  );
}

function FeatureWide(props: {
  icon: string;
  title: string;
  body: string;
  className?: string;
  accent: string;
}) {
  return <Feature {...props} />;
}
