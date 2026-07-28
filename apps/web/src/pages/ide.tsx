import { IdeWorkspace } from "@/components/ide/ide-workspace"
import { useDocumentMeta } from "@/lib/use-document-meta"

export default function IdePage() {
  useDocumentMeta("Workspace", "Edit agent-generated code with live desktop and mobile previews.")

  return <IdeWorkspace />
}
