import type { Metadata } from "next"
import { ChatPanel } from "@/components/builder/chat-panel"
import { CollaborationRail } from "@/components/builder/collaboration-rail"

export const metadata: Metadata = {
  title: "AI Builder",
  description: "Describe what you want to build and watch the DeVibe agent swarm plan, code and deploy it.",
}

export default function BuilderPage() {
  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-1 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <ChatPanel />
      <aside className="hidden overflow-y-auto xl:block">
        <CollaborationRail />
      </aside>
    </div>
  )
}
