import type { Metadata } from "next"
import { Store } from "lucide-react"
import { ComingSoon } from "@/components/app/coming-soon"

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Install community agents, MCP tools and infrastructure templates.",
}

export default function MarketplacePage() {
  return (
    <ComingSoon
      icon={Store}
      title="Marketplace"
      description="Install community agents, MCP tools and infrastructure templates."
      bullets={[
        "Browse verified agents by capability and provider support",
        "One-click install of MCP tools into your orchestration graph",
        "Publish your own agents and share them with your team",
        "Pinned versions with changelogs and permission review",
      ]}
    />
  )
}
