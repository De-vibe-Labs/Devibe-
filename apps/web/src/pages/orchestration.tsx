import { EyeOff } from "lucide-react"
import { LiveOrchestration } from "@/components/orchestration/live-orchestration"
import { McpTools } from "@/components/orchestration/mcp-tools"
import { ProviderBreakdown } from "@/components/orchestration/provider-breakdown"
import { TopologyCanvas } from "@/components/orchestration/topology-canvas"
import { StatusDot } from "@/components/ui/primitives"
import { useDocumentMeta } from "@/lib/use-document-meta"

export function OrchestrationPage() {
  useDocumentMeta(
    "Orchestration",
    "Visualise how DeVibe distributes your workloads across Cloudflare, AWS, GCP and Azure.",
  )

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col gap-5 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 font-mono text-xs">
          <StatusDot tone="success" pulse />
          Cloud status: healthy
        </span>
        <span className="inline-flex items-center gap-2 rounded-lg border border-warning/40 bg-warning/10 px-3 py-1.5 font-mono text-xs text-warning">
          <EyeOff className="size-3.5" />
          1 warning in us-east
        </span>
      </header>

      <h1 className="sr-only">Cloud orchestration topology</h1>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 xl:grid-cols-[16rem_minmax(0,1fr)]">
        <div className="flex flex-col gap-6">
          <McpTools />
          <ProviderBreakdown />
        </div>

        <div className="relative flex min-h-0 flex-col">
          <TopologyCanvas />
          <div className="mt-4 xl:absolute xl:right-4 xl:bottom-4 xl:mt-0 xl:w-80">
            <LiveOrchestration />
          </div>
        </div>
      </div>
    </div>
  )
}
