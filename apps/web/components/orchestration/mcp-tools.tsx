import { CheckCircle2, PauseCircle, RefreshCw } from "lucide-react"
import { Eyebrow } from "@/components/ui/primitives"
import { mcpTools } from "@/lib/mock-data"

const stateMeta = {
  running: { icon: RefreshCw, className: "text-accent", border: "border-accent/50", spin: true },
  idle: { icon: CheckCircle2, className: "text-success", border: "border-success/50", spin: false },
  pending: { icon: PauseCircle, className: "text-warning", border: "border-warning/50", spin: false },
} as const

export function McpTools() {
  return (
    <div>
      <Eyebrow>MCP active tools</Eyebrow>
      <ul className="mt-3 flex flex-col gap-2">
        {mcpTools.map((tool) => {
          const meta = stateMeta[tool.state]
          return (
            <li
              key={tool.id}
              className={`flex items-center gap-3 rounded-xl border ${meta.border} bg-surface-2/70 px-3.5 py-3`}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-sm font-semibold">{tool.name}</span>
                <span className="block truncate text-xs text-muted-foreground">{tool.status}</span>
              </span>
              <meta.icon
                className={`size-4 shrink-0 ${meta.className} ${meta.spin ? "animate-spin [animation-duration:2.5s]" : ""}`}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
