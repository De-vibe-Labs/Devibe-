import { Zap } from "lucide-react"
import { Card, Meter } from "@/components/ui/primitives"

const metrics = [
  { id: "cpu", label: "CPU utilization", value: "42.8%", pct: 43, tone: "accent" as const },
  { id: "latency", label: "Latency (p99)", value: "14ms", pct: 18, tone: "accent" as const },
]

export function LiveOrchestration() {
  return (
    <Card className="border-primary/40 bg-surface-1/95 p-4 shadow-[0_0_40px_rgba(124,58,237,0.18)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/20">
          <Zap className="size-4 text-primary-soft" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Live orchestration</p>
          <p className="truncate text-xs text-muted-foreground">
            Active agent: <span className="font-mono text-accent">Agent-922</span>
          </p>
        </div>
      </div>

      <dl className="mt-4 flex flex-col gap-3">
        {metrics.map((metric) => (
          <div key={metric.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-2">
              <dt className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">{metric.label}</dt>
              <dd className="font-mono text-xs text-accent">{metric.value}</dd>
            </div>
            <Meter value={metric.pct} tone={metric.tone} label={metric.label} className="mt-1.5" />
          </div>
        ))}
      </dl>

      <p className="mt-4 rounded-lg border border-border bg-surface-2/80 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground italic">
        &quot;Analyzing edge traffic patterns for eu-west-1. Optimizing cold-start routes...&quot;
      </p>
    </Card>
  )
}
