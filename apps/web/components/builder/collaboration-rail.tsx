import { GitBranch } from "lucide-react"
import { Eyebrow, StatusDot } from "@/components/ui/primitives"
import { agents, collaborationTrace, projects } from "@/lib/mock-data"

const toneText = {
  primary: "text-primary-soft",
  success: "text-success",
  accent: "text-accent",
} as const

export function CollaborationRail() {
  const activeProject = projects[0]

  return (
    <div className="flex flex-col gap-6 border-l border-border bg-surface-1 p-4">
      <div>
        <Eyebrow>Active project</Eyebrow>
        <div className="mt-3 rounded-xl border border-border bg-surface-2/70 p-3.5">
          <p className="truncate text-sm font-semibold">{activeProject.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{activeProject.summary}</p>
          <p className="mt-3 flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
            <GitBranch className="size-3 shrink-0" />
            <span className="truncate">main · deployed {activeProject.lastDeploy}</span>
          </p>
        </div>
      </div>

      <div>
        <Eyebrow>Swarm</Eyebrow>
        <ul className="mt-3 flex flex-col gap-1.5">
          {agents.slice(0, 5).map((agent) => (
            <li key={agent.id} className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
              <StatusDot
                tone={agent.state === "active" ? "success" : agent.state === "idle" ? "idle" : "warning"}
                pulse={agent.state !== "idle"}
              />
              <span className="min-w-0 flex-1 truncate text-xs">{agent.name}</span>
              <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{agent.statusLine}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Eyebrow>Collaboration trace</Eyebrow>
        <ol className="mt-3 flex flex-col gap-2">
          {collaborationTrace.map((entry) => (
            <li key={entry.id} className="rounded-lg border border-border bg-surface-2/60 p-3">
              <p className={`font-mono text-[10px] font-medium ${toneText[entry.tone]}`}>{entry.agent}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{entry.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
