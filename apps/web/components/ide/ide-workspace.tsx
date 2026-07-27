"use client"

import { useMemo, useState } from "react"
import { GitBranch, Play, Rocket, Sparkles, X } from "lucide-react"
import { CodeEditor } from "@/components/ide/code-editor"
import { FileExplorer } from "@/components/ide/file-explorer"
import { PreviewPanels } from "@/components/ide/preview-panels"
import { Badge, Button, StatusDot } from "@/components/ui/primitives"
import { fileTree, type FileNode } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

/** Flattens the tree so tabs can resolve a node by id. */
function flatten(nodes: FileNode[]): FileNode[] {
  return nodes.flatMap((node) => (node.kind === "folder" ? flatten(node.children ?? []) : [node]))
}

export function IdeWorkspace() {
  const files = useMemo(() => flatten(fileTree), [])
  const orbFile = files.find((file) => file.id === "agentorb") ?? files[0]

  const [openTabs, setOpenTabs] = useState<FileNode[]>(() =>
    [orbFile, files.find((file) => file.id === "config")].filter(Boolean) as FileNode[],
  )
  const [activeId, setActiveId] = useState(orbFile.id)
  const [pane, setPane] = useState<"code" | "preview">("code")

  const activeFile = openTabs.find((tab) => tab.id === activeId) ?? openTabs[0]

  function openFile(node: FileNode) {
    setOpenTabs((prev) => (prev.some((tab) => tab.id === node.id) ? prev : [...prev, node]))
    setActiveId(node.id)
    setPane("code")
  }

  function closeTab(id: string) {
    setOpenTabs((prev) => {
      const next = prev.filter((tab) => tab.id !== id)
      if (id === activeId && next.length) setActiveId(next[next.length - 1].id)
      return next
    })
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Workspace bar */}
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-border bg-surface-1 px-4 py-2.5">
        <h1 className="font-display text-sm font-semibold">Workspace</h1>
        <Badge tone="neutral" className="font-mono text-[10px]">
          Genesis-Alpha
        </Badge>
        <span className="hidden items-center gap-1.5 rounded-full border border-primary/35 bg-primary/10 px-2.5 py-1 font-mono text-[10px] text-primary-soft sm:inline-flex">
          <Sparkles className="size-3 animate-pulse" />
          Frontend Agent is refining styles...
        </span>

        <div className="ml-auto flex items-center gap-2">
          <div
            role="group"
            aria-label="Workspace pane"
            className="flex items-center gap-0.5 rounded-lg border border-border bg-surface-2 p-0.5 xl:hidden"
          >
            {(["code", "preview"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPane(mode)}
                aria-pressed={pane === mode}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                  pane === mode ? "bg-primary text-primary-foreground" : "text-muted-foreground",
                )}
              >
                {mode}
              </button>
            ))}
          </div>

          <Button size="sm" variant="secondary">
            <Play className="size-3.5" />
            Run
          </Button>
          <Button size="sm">
            <Rocket className="size-3.5" />
            Deploy
          </Button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[13rem_minmax(0,1fr)_20rem]">
        <div className={cn("min-h-0", pane === "code" ? "hidden lg:block" : "hidden lg:block")}>
          <FileExplorer tree={fileTree} activeId={activeId} onSelect={openFile} />
        </div>

        {/* Editor column */}
        <div className={cn("flex min-h-0 min-w-0 flex-col", pane === "preview" && "hidden xl:flex")}>
          <div role="tablist" aria-label="Open files" className="flex shrink-0 overflow-x-auto border-b border-border bg-surface-1">
            {openTabs.map((tab) => (
              <div
                key={tab.id}
                className={cn(
                  "group flex shrink-0 items-center gap-2 border-r border-border px-3.5 py-2.5",
                  tab.id === activeId ? "border-b-2 border-b-primary bg-surface-2" : "bg-transparent",
                )}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab.id === activeId}
                  onClick={() => setActiveId(tab.id)}
                  className={cn(
                    "flex items-center gap-2 font-mono text-xs transition-colors",
                    tab.id === activeId ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Sparkles className="size-3 shrink-0 text-primary-soft" />
                  {tab.name}
                </button>
                <button
                  type="button"
                  onClick={() => closeTab(tab.id)}
                  aria-label={`Close ${tab.name}`}
                  className="flex size-4 items-center justify-center rounded text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="min-h-0 flex-1">
            {activeFile ? (
              <CodeEditor
                path={activeFile.name}
                value={activeFile.content ?? ""}
                language={activeFile.language}
              />
            ) : (
              <p className="p-6 font-mono text-xs text-muted-foreground">No file open.</p>
            )}
          </div>
        </div>

        {/* Previews */}
        <div className={cn("min-h-0", pane === "preview" ? "block" : "hidden xl:block")}>
          <PreviewPanels />
        </div>
      </div>

      {/* Status bar */}
      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-t border-border bg-surface-1 px-4 py-2 font-mono text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 text-success">
          <StatusDot tone="success" />
          Sync to GitHub (main)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <GitBranch className="size-3" />1 outgoing change
        </span>
        <span className="ml-auto hidden sm:inline">UTF-8</span>
        <span className="hidden sm:inline">TypeScript JSX</span>
        <span>Ln 14, Col 24</span>
      </div>
    </div>
  )
}
