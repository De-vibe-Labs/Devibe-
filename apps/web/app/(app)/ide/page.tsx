import type { Metadata } from "next"
import { IdeWorkspace } from "@/components/ide/ide-workspace"

export const metadata: Metadata = {
  title: "Workspace",
  description: "Edit agent-generated code with live desktop and mobile previews.",
}

export default function IdePage() {
  return <IdeWorkspace />
}
