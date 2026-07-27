import { Zap } from "lucide-react"
import { Card, StatusDot } from "@/components/ui/primitives"
import { autonomousActions } from "@/lib/mock-data"

const sourceTone = {
  primary: "text-primary-soft",
  danger: "text-danger",
  success: "text-success",
  accent: "text-accent",
} as const

export function AutonomousActions() {
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold">
          <Zap className="size-5 text-primary-soft" />
          Autonomous actions
        </h2>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[10px] text-muted-foreground">
          <StatusDot tone="success" pulse />
          Live stream: 12 events/min
        </span>
      </div>

      <ol className="mt-5 flex flex-col gap-2">
        {autonomousActions.map((action) => (
          <li
            key={action.id}
            className="rounded-xl border border-border bg-surface-2/60 p-4 transition-colors hover:border-border-strong"
          >
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <time className="font-mono text-xs text-muted-foreground tabular-nums">{action.time}</time>
              <span className={`font-mono text-xs font-medium ${sourceTone[action.tone]}`}>[{action.source}]</span>
            </div>
            <p className="mt-1.5 font-mono text-xs leading-relaxed text-muted-foreground">{action.body}</p>
          </li>
        ))}
      </ol>
    </Card>
  )
}
