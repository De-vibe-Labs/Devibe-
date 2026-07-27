import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Bot, GitBranch, Plus } from "lucide-react"
import { Badge, Button, Card, StatusDot } from "@/components/ui/primitives"
import { projects, type Health } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Projects",
  description: "Every DeVibe project, its agent swarm and its deployment target.",
}

const healthTone: Record<Health, "success" | "warning" | "danger"> = {
  healthy: "success",
  degraded: "warning",
  critical: "danger",
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Projects</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {projects.length} projects orchestrated by your agent swarm.
          </p>
        </div>
        <Button>
          <Plus className="size-4" />
          New project
        </Button>
      </header>

      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <li key={project.id}>
            <Card className="flex h-full flex-col p-5 transition-colors hover:border-border-strong">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate font-display text-lg font-semibold">{project.name}</h2>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{project.summary}</p>
                </div>
                <StatusDot tone={healthTone[project.health]} pulse={project.health !== "healthy"} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <Badge tone="neutral" className="font-mono text-[10px]">
                  {project.provider}
                </Badge>
                <Badge tone="primary" className="font-mono text-[10px]">
                  <Bot className="size-3" />
                  {project.activeAgents} agents
                </Badge>
              </div>

              <p className="mt-4 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                <GitBranch className="size-3 shrink-0" />
                <span className="truncate">main · deployed {project.lastDeploy}</span>
              </p>

              <Link
                href="/ide"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-soft transition-colors hover:text-foreground"
              >
                Open workspace
                <ArrowRight className="size-3.5" />
              </Link>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  )
}
