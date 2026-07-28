import { useState } from "react"
import {
  Coins,
  Database,
  Gauge,
  Plus,
  Shield,
  Sparkles,
  Users,
} from "lucide-react"
import { Card, StatusDot } from "@/components/ui/primitives"
import { agents, type AgentState } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const iconMap = {
  database: Database,
  shield: Shield,
  users: Users,
  gauge: Gauge,
  plus: Plus,
  coins: Coins,
  sparkles: Sparkles,
  code: Database,
  rocket: Sparkles,
} as const

const stateTone: Record<AgentState, "success" | "idle" | "warning" | "danger"> = {
  active: "success",
  idle: "idle",
  thinking: "warning",
  blocked: "danger",
}

export function AgenticMaintenance() {
  const [view, setView] = useState<"grid" | "list">("grid")

  return (
    <Card className="p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold">Agentic maintenance</h2>
          <p className="mt-1 text-sm text-muted-foreground">Real-time feedback from active system agents</p>
        </div>

        <div
          role="group"
          aria-label="Agent view mode"
          className="flex shrink-0 items-center gap-1 rounded-lg border border-border bg-surface-2 p-1"
        >
          {(["grid", "list"] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              aria-pressed={view === mode}
              className={cn(
                "rounded-md px-3 py-1 font-mono text-[10px] tracking-wider uppercase transition-colors",
                view === mode
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {view === "grid" ? (
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {agents.map((agent) => {
            const Icon = iconMap[agent.icon]
            const isOrchestrator = agent.id === "orchestrator"
            return (
              <li
                key={agent.id}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-colors",
                  isOrchestrator
                    ? "border-primary/50 bg-primary/15"
                    : "border-border bg-surface-2/70 hover:border-border-strong",
                )}
              >
                <span className="absolute top-2.5 right-2.5">
                  <StatusDot tone={stateTone[agent.state]} pulse={agent.state !== "idle"} />
                </span>

                <span
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full",
                    isOrchestrator ? "bg-primary text-primary-foreground" : "bg-surface-3 text-primary-soft",
                  )}
                >
                  <Icon className="size-5" />
                </span>

                <span className="w-full truncate text-xs font-medium">{agent.name}</span>
                <span className="w-full truncate font-mono text-[10px] text-muted-foreground">{agent.statusLine}</span>
              </li>
            )
          })}
        </ul>
      ) : (
        <ul className="mt-5 flex flex-col divide-y divide-border">
          {agents.map((agent) => {
            const Icon = iconMap[agent.icon]
            return (
              <li key={agent.id} className="flex items-center gap-3 py-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface-3 text-primary-soft">
                  <Icon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{agent.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{agent.role}</span>
                </span>
                <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:block">{agent.metric}</span>
                <span className="flex w-24 shrink-0 items-center justify-end gap-1.5">
                  <StatusDot tone={stateTone[agent.state]} pulse={agent.state !== "idle"} />
                  <span className="font-mono text-[10px] text-muted-foreground uppercase">{agent.state}</span>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
