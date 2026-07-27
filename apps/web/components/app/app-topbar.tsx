"use client"

import { useState } from "react"
import { Bell, Menu, Search, Settings, X } from "lucide-react"
import { AppSidebar } from "@/components/app/app-sidebar"
import { StatusDot } from "@/components/ui/primitives"

export function AppTopbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-surface-1/85 px-4 backdrop-blur-xl lg:px-6">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="-ml-1 flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground lg:hidden"
        >
          <Menu className="size-5" />
        </button>

        <label className="relative hidden min-w-0 flex-1 items-center sm:flex md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" aria-hidden="true" />
          <span className="sr-only">Search infrastructure</span>
          <input
            type="search"
            placeholder="Search infrastructure..."
            className="h-10 w-full rounded-full border border-border bg-surface-2 pl-9 pr-4 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
          />
        </label>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <Bell className="size-5" />
            <span className="absolute top-2 right-2">
              <StatusDot tone="accent" />
            </span>
          </button>
          <button
            type="button"
            aria-label="Settings"
            className="hidden size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground sm:flex"
          >
            <Settings className="size-5" />
          </button>

          <div className="ml-2 flex items-center gap-3 border-l border-border pl-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium leading-tight">Marcus Stone</p>
              <p className="text-xs text-muted-foreground">Lvl 4 Admin</p>
            </div>
            <span className="flex size-9 items-center justify-center rounded-full border border-primary/40 bg-primary/20 text-sm font-semibold text-primary-soft">
              MS
            </span>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-deep/80 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw]">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close navigation"
              className="absolute top-4 right-3 z-10 flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-2 hover:text-foreground"
            >
              <X className="size-4" />
            </button>
            <AppSidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  )
}
