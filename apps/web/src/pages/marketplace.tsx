import { Store } from "lucide-react"
import { ComingSoon } from "@/components/app/coming-soon"
import { useDocumentMeta } from "@/lib/use-document-meta"

export function MarketplacePage() {
  useDocumentMeta("Marketplace", "Install community agents, MCP tools and infrastructure templates.")

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
