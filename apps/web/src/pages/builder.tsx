import { ChatPanel } from "@/components/builder/chat-panel"
import { CollaborationRail } from "@/components/builder/collaboration-rail"
import { useDocumentMeta } from "@/lib/use-document-meta"

export function BuilderPage() {
  useDocumentMeta(
    "AI Builder",
    "Describe what you want to build and watch the DeVibe agent swarm plan, code and deploy it.",
  )

  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-1 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <ChatPanel />
      <aside className="hidden overflow-y-auto xl:block">
        <CollaborationRail />
      </aside>
    </div>
  )
}
