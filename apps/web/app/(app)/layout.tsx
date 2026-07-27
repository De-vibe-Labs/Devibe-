import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app/app-sidebar"
import { AppTopbar } from "@/components/app/app-topbar"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-0 h-screen">
          <AppSidebar />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
