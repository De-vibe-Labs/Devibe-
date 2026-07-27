import { Check, Cloud, Database, Globe, Server, Sparkles } from "lucide-react"
import { Badge, Eyebrow, GlassCard, StatusDot } from "@/components/ui/primitives"

const rails = [
  {
    id: "cloudflare",
    name: "Cloudflare Workers",
    detail: "Edge compute distribution",
    icon: Cloud,
    color: "text-[#f38020]",
    bg: "bg-[#f38020]/15",
  },
  {
    id: "hyperscalers",
    name: "AWS · GCP · Azure",
    detail: "Stateful core services",
    icon: Server,
    color: "text-primary-soft",
    bg: "bg-primary/15",
  },
  {
    id: "data",
    name: "D1 · RDS · Cloud SQL",
    detail: "Replicated data layer",
    icon: Database,
    color: "text-accent",
    bg: "bg-accent/15",
  },
]

export function OrchestrationHighlight() {
  return (
    <section id="orchestration" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <GlassCard className="mx-auto max-w-7xl overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-14">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>Distribution</Eyebrow>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              True multi-cloud <span className="text-primary-soft">orchestration</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
              Stop being locked into a single provider. DeVibe distributes workloads across global infrastructure based
              on latency, cost and data-sovereignty requirements.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <Badge tone="success" className="font-mono">
                github-connected
              </Badge>
              <Badge tone="primary" className="font-mono">
                cloud-enabled
              </Badge>
              <Badge tone="accent" className="font-mono">
                auto-scale
              </Badge>
            </div>

            <ul className="mt-8 flex flex-col gap-3">
              {rails.map((rail) => (
                <li
                  key={rail.id}
                  className="flex items-center gap-4 rounded-xl border border-border bg-surface-2/60 p-4"
                >
                  <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${rail.bg}`}>
                    <rail.icon className={`size-5 ${rail.color}`} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{rail.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{rail.detail}</span>
                  </span>
                  <Check className="size-5 shrink-0 text-success" />
                </li>
              ))}
            </ul>
          </div>

          {/* Topology diagram */}
          <div className="relative">
            <div className="relative rounded-2xl border border-border bg-deep/70 p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                  Live topology
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-success">
                  <StatusDot tone="success" pulse />
                  Healthy
                </span>
              </div>

              <svg
                viewBox="0 0 320 260"
                role="img"
                aria-label="Traffic flows from global users through two edge regions into the DeVibe AI gateway, which routes to compute clusters and a serverless database."
                className="mt-4 w-full"
              >
                <defs>
                  <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Links */}
                <g fill="none" strokeWidth="1.25" strokeDasharray="4 5" className="animate-dash">
                  <path d="M52 130 L120 62" stroke="#00dce5" strokeOpacity="0.5" />
                  <path d="M52 130 L120 198" stroke="#00dce5" strokeOpacity="0.5" />
                  <path d="M188 62 L246 122" stroke="#7c3aed" strokeOpacity="0.6" />
                  <path d="M188 198 L246 138" stroke="#7c3aed" strokeOpacity="0.6" />
                </g>
                <g fill="none" strokeWidth="1.25" strokeDasharray="4 5" className="animate-dash">
                  <path d="M290 130 L268 74" stroke="#7c3aed" strokeOpacity="0.45" />
                  <path d="M290 130 L268 186" stroke="#7c3aed" strokeOpacity="0.45" />
                </g>

                {/* Origin */}
                <circle cx="34" cy="130" r="17" fill="#14161f" stroke="#3a3a42" />
                <text x="34" y="164" textAnchor="middle" className="fill-muted-foreground font-mono text-[8px]">
                  USERS
                </text>

                {/* Edge regions */}
                <rect x="120" y="44" width="68" height="36" rx="8" fill="#0e1017" stroke="#00dce5" strokeOpacity="0.6" />
                <text x="154" y="66" textAnchor="middle" className="fill-accent font-mono text-[8px]">
                  EU-WEST-1
                </text>

                <rect
                  x="120"
                  y="180"
                  width="68"
                  height="36"
                  rx="8"
                  fill="#0e1017"
                  stroke="#00dce5"
                  strokeOpacity="0.6"
                />
                <text x="154" y="202" textAnchor="middle" className="fill-accent font-mono text-[8px]">
                  AP-SOUTH-1
                </text>

                {/* Hub */}
                <circle cx="246" cy="130" r="44" fill="url(#hubGlow)" />
                <circle cx="246" cy="130" r="21" fill="#14161f" stroke="#7c3aed" strokeWidth="1.5" />
                <text x="246" y="168" textAnchor="middle" className="fill-primary-soft font-mono text-[8px]">
                  AI GATEWAY
                </text>

                {/* Sinks */}
                <rect x="264" y="52" width="50" height="34" rx="8" fill="#181b25" stroke="#3a3a42" />
                <text x="289" y="73" textAnchor="middle" className="fill-foreground font-mono text-[7px]">
                  CLUSTERS
                </text>
                <text x="289" y="100" textAnchor="middle" className="fill-muted-foreground font-mono text-[7px]">
                  12 nodes
                </text>

                <rect x="264" y="172" width="50" height="34" rx="8" fill="#181b25" stroke="#3a3a42" />
                <text x="289" y="193" textAnchor="middle" className="fill-foreground font-mono text-[7px]">
                  DATABASE
                </text>
                <text x="289" y="220" textAnchor="middle" className="fill-muted-foreground font-mono text-[7px]">
                  D1 replicated
                </text>
              </svg>

              {/* Hub icon overlays */}
              <div className="pointer-events-none absolute top-[46%] left-[10%] hidden -translate-y-1/2 sm:block">
                <Globe className="size-4 text-muted-foreground" />
              </div>

              <div className="mt-2 flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/10 p-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/25">
                  <Sparkles className="size-4 text-primary-soft" />
                </span>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  <span className="font-medium text-foreground">DevOps Agent</span> is analysing edge traffic for
                  EU-West-1 and optimising cold-start routes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </section>
  )
}
