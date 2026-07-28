import { Rocket } from "lucide-react"
import { ComingSoon } from "@/components/app/coming-soon"
import { useDocumentMeta } from "@/lib/use-document-meta"

export function DeploymentsPage() {
  useDocumentMeta("Deployments", "Rollouts, rollbacks and release history across every provider.")

  return (
    <ComingSoon
      icon={Rocket}
      title="Deployments"
      description="Rollouts, rollbacks and release history across every provider."
      bullets={[
        "Full release timeline with commit, author and target region",
        "One-click rollback to any previous healthy deploy",
        "Progressive canary rollouts driven by the DevOps agent",
        "Build logs streamed from each provider in a single view",
      ]}
    />
  )
}
