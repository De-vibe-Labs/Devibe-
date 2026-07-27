import type { Metadata } from "next"
import { Rocket } from "lucide-react"
import { ComingSoon } from "@/components/app/coming-soon"

export const metadata: Metadata = {
  title: "Deployments",
  description: "Rollouts, rollbacks and release history across every provider.",
}

export default function DeploymentsPage() {
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
