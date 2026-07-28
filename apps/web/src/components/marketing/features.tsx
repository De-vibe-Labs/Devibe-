import { Bot, Database, FileText, GitBranch, Rocket, Terminal } from "lucide-react"
import { Eyebrow, GlassCard } from "@/components/ui/primitives"

export function Features() {
  return (
    <section id="features" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <Eyebrow>Capabilities</Eyebrow>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
            A full engineering org, running on your repo
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            Every agent is specialised, and they talk to each other. That is the difference between a code generator and
            a team.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Multi-agent orchestration — large */}
          <GlassCard className="group relative overflow-hidden p-6 md:col-span-8 md:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -bottom-24 size-72 rounded-full bg-[radial-gradient(circle,rgba(0,220,229,0.16),transparent_65%)] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
            />
            <div className="relative max-w-lg">
              <Bot className="size-8 text-accent" />
              <h3 className="mt-4 font-display text-xl font-semibold">Multi-agent orchestration</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Swarm intelligence lets specialised agents for Security, DevOps and Frontend collaborate in real time on
                the same repository — reviewing each other&apos;s work before anything merges.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Product", "UX", "Frontend", "Backend", "DevOps", "Security", "QA"].map((role) => (
                  <span
                    key={role}
                    className="rounded-full border border-border bg-surface-2 px-2.5 py-1 font-mono text-[10px] tracking-wide text-muted-foreground"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Product agent */}
          <GlassCard className="relative flex flex-col justify-between overflow-hidden p-6 md:col-span-4 md:p-8">
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-0.5 bg-primary" />
            <div>
              <FileText className="size-8 text-primary-soft" />
              <h3 className="mt-4 font-display text-xl font-semibold">Product Agent</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Turns loose ideas into rigid technical specs, PRDs and database schemas.
              </p>
            </div>
            <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-deep/70 px-3 py-2.5">
              <code className="font-mono text-xs whitespace-nowrap text-primary-soft">
                <span className="text-muted-foreground">$ </span>
                devibe analyze &quot;payment gateway&quot;
              </code>
            </div>
          </GlassCard>

          {/* IDE */}
          <GlassCard className="p-6 md:col-span-4 md:p-8">
            <Terminal className="size-8 text-primary-soft" />
            <h3 className="mt-4 font-display text-xl font-semibold">IDE + live previews</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Monaco editor with inline agent suggestions, plus sandboxed desktop and mobile previews for every change.
            </p>
          </GlassCard>

          {/* Deploy */}
          <GlassCard className="p-6 md:col-span-4 md:p-8">
            <Rocket className="size-8 text-success" />
            <h3 className="mt-4 font-display text-xl font-semibold">One-click multi-cloud deploy</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Code to edge in seconds. Load balancing, SSL and regional failover are configured for you.
            </p>
          </GlassCard>

          {/* GitHub */}
          <GlassCard className="p-6 md:col-span-4 md:p-8">
            <GitBranch className="size-8 text-accent" />
            <h3 className="mt-4 font-display text-xl font-semibold">GitHub-native workflow</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Agents open PRs, review diffs and keep documentation current with every commit. Nothing happens off-repo.
            </p>
          </GlassCard>

          {/* Memory — full width */}
          <GlassCard className="flex flex-col items-start gap-8 bg-gradient-to-r from-surface-2 to-primary/10 p-6 md:col-span-12 md:flex-row md:items-center md:p-8">
            <div className="flex-1">
              <Database className="size-8 text-accent" />
              <h3 className="mt-4 font-display text-xl font-semibold">Long-term project memory</h3>
              <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">
                Agents remember past architectural decisions, so choices stay consistent across your entire
                microservices landscape — even months later.
              </p>
            </div>
            <dl className="flex w-full shrink-0 items-center justify-between gap-6 border-t border-border pt-6 md:w-auto md:justify-end md:gap-10 md:border-t-0 md:border-l md:pt-0 md:pl-10">
              {[
                { value: "100k+", label: "Tokens / context" },
                { value: "99.9%", label: "Recall" },
                { value: "<5ms", label: "Lookup" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <dt className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-bold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </GlassCard>
        </div>
      </div>
    </section>
  )
}
