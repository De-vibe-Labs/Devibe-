import type { Metadata } from "next"
import { HelpCircle } from "lucide-react"
import { ComingSoon } from "@/components/app/coming-soon"

export const metadata: Metadata = {
  title: "Support",
  description: "Docs, incident history and direct access to the DeVibe team.",
}

export default function SupportPage() {
  return (
    <ComingSoon
      icon={HelpCircle}
      title="Support"
      description="Docs, incident history and direct access to the DeVibe team."
      bullets={[
        "Searchable docs for agents, MCP tools and provider adapters",
        "Incident history with root cause written up by the agent swarm",
        "Open a ticket with full orchestration context attached",
        "Status page for every connected cloud provider",
      ]}
    />
  )
}
