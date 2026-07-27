import { AlertTriangle, CheckCircle2, Cloud, RefreshCw } from "lucide-react"
import { Card, Meter, StatusDot } from "@/components/ui/primitives"
import { edgeMetrics, fleetServices, type Health } from "@/lib/mock-data"

const healthMeta: Record<Health, { icon: typeof CheckCircle2; className: string; accent: string; meter: "success" | "warning" | "danger" }> = {
  healthy: { icon: CheckCircle2, className: "text-success", accent: "before:bg-success", meter: "success" },
  degraded: { icon: AlertTriangle, className: "text-warning", accent: "before:bg-warning", meter: "warning" },
  critical: { icon: AlertTriangle, className: "text-danger", accent: "before:bg-danger", meter: "danger" },
}

export function FleetStatus() {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold">
          <Cloud className="size-5 text-accent" />
          Global fleet status
        </h2>
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-success">
          <StatusDot tone="success" pulse />
          ACTIVE
        </span>
      </div>

      <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {fleetServices.map((service) => {
          const meta = healthMeta[service.health]
          return (
            <li
              key={service.id}
              className={`relative overflow-hidden rounded-xl border border-border bg-surface-2/70 p-4 before:absolute before:inset-y-0 before:left-0 before:w-0.5 ${meta.accent}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
                  {service.category}
                </span>
                <meta.icon className={`size-4 shrink-0 ${meta.className}`} />
              </div>

              <p className="mt-1 truncate font-display text-base font-semibold">{service.provider}</p>

              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-2">
                <span className="text-xs text-muted-foreground">{service.metricLabel}</span>
                <span className={`font-mono text-xs ${meta.className}`}>{service.metricValue}</span>
              </div>
              <Meter
                value={service.utilization}
                tone={meta.meter}
                label={`${service.provider} ${service.metricLabel}`}
                className="mt-1.5"
              />

              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{service.note}</p>
            </li>
          )
        })}
      </ul>

      {/* Edge traffic strip */}
      <div className="relative mt-4 overflow-hidden rounded-xl border border-border bg-deep/60 p-4">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
            Edge traffic
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <RefreshCw className="size-3 animate-spin [animation-duration:3s]" />
            live
          </span>
        </div>

        <svg viewBox="0 0 400 90" role="presentation" className="mt-3 w-full">
          <defs>
            <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00dce5" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#00dce5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 70 C40 58 60 30 100 34 C140 38 150 66 190 62 C230 58 246 22 290 26 C330 30 348 54 400 44 L400 90 L0 90 Z"
            fill="url(#trafficFill)"
          />
          <path
            d="M0 70 C40 58 60 30 100 34 C140 38 150 66 190 62 C230 58 246 22 290 26 C330 30 348 54 400 44"
            fill="none"
            stroke="#00dce5"
            strokeWidth="1.5"
          />
        </svg>

        <ul className="mt-2 flex flex-wrap gap-2">
          {edgeMetrics.map((metric) => (
            <li key={metric.id} className="rounded-lg border border-border bg-surface-2/80 px-3 py-2">
              <span className="block font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
                {metric.label}
              </span>
              <span className="mt-0.5 block font-mono text-sm text-accent">{metric.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
