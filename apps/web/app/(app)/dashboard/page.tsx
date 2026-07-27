import type { Metadata } from "next"
import { Download, Play } from "lucide-react"
import { AgenticMaintenance } from "@/components/dashboard/agentic-maintenance"
import { AutonomousActions } from "@/components/dashboard/autonomous-actions"
import { FleetStatus } from "@/components/dashboard/fleet-status"
import { ReadinessScore } from "@/components/dashboard/readiness-score"
import { Badge, Button, StatusDot } from "@/components/ui/primitives"

export const metadata: Metadata = {
  title: "Command Center",
  description: "Monitor your global fleet, agent swarm and autonomous infrastructure actions.",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="primary" className="font-mono text-[10px] tracking-wider uppercase">
              Command center
            </Badge>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground uppercase">
              <StatusDot tone="success" pulse />
              Systems nominal
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            EdgeOS Workspace
          </h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">
            <Download className="size-4" />
            Export logs
          </Button>
          <Button>
            <Play className="size-4" />
            Deploy global cluster
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <FleetStatus />
        <ReadinessScore />
      </div>

      <AgenticMaintenance />
      <AutonomousActions />
    </div>
  )
}
