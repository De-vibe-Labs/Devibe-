import { Settings } from "lucide-react"
import { ComingSoon } from "@/components/app/coming-soon"
import { useDocumentMeta } from "@/lib/use-document-meta"

export function SettingsPage() {
  useDocumentMeta("Settings", "Workspace, provider credentials and agent guardrail configuration.")

  return (
    <ComingSoon
      icon={Settings}
      title="Settings"
      description="Workspace, provider credentials and agent guardrail configuration."
      bullets={[
        "Connect AWS, GCP and Cloudflare credentials per environment",
        "Set cost guardrails and require approval above a spend threshold",
        "Scope which agents may act autonomously versus propose only",
        "Manage team members, roles and audit log retention",
      ]}
    />
  )
}
