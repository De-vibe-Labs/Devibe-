import { useState } from "react"
import { ChevronDown, ChevronRight, FileCode2, FileJson, FileText, Folder, FolderOpen, Settings2 } from "lucide-react"
import type { FileNode } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const gitStatusTone = {
  M: "text-warning",
  A: "text-success",
  U: "text-accent",
  D: "text-danger",
} as const

function fileIcon(node: FileNode) {
  if (node.language === "yaml") return Settings2
  if (node.language === "json") return FileJson
  if (node.language === "markdown") return FileText
  return FileCode2
}

function FileRow({
  node,
  depth,
  activeId,
  onSelect,
}: {
  node: FileNode
  depth: number
  activeId: string
  onSelect: (node: FileNode) => void
}) {
  const [open, setOpen] = useState(true)

  if (node.kind === "folder") {
    const Chevron = open ? ChevronDown : ChevronRight
    const FolderIcon = open ? FolderOpen : Folder
    return (
      <li>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className="flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <Chevron className="size-3.5 shrink-0" />
          <FolderIcon className="size-4 shrink-0" />
          <span className="truncate">{node.name}</span>
        </button>

        {open && node.children ? (
          <ul>
            {node.children.map((child) => (
              <FileRow key={child.id} node={child} depth={depth + 1} activeId={activeId} onSelect={onSelect} />
            ))}
          </ul>
        ) : null}
      </li>
    )
  }

  const Icon = fileIcon(node)
  const active = node.id === activeId

  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(node)}
        aria-current={active ? "true" : undefined}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md py-1.5 pr-2 text-sm transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
        )}
        style={{ paddingLeft: `${depth * 12 + 22}px` }}
      >
        <Icon className="size-4 shrink-0" />
        <span className="min-w-0 flex-1 truncate text-left">{node.name}</span>
        {node.gitStatus ? (
          <span
            className={cn(
              "shrink-0 font-mono text-[10px] font-bold",
              active ? "text-primary-foreground" : gitStatusTone[node.gitStatus],
            )}
          >
            {node.gitStatus}
          </span>
        ) : null}
      </button>
    </li>
  )
}

export function FileExplorer({
  tree,
  activeId,
  onSelect,
}: {
  tree: FileNode[]
  activeId: string
  onSelect: (node: FileNode) => void
}) {
  return (
    <nav aria-label="Project files" className="flex h-full flex-col overflow-y-auto border-r border-border bg-surface-1 py-3">
      <p className="px-3 pb-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">Explorer</p>
      <p className="px-3 pb-1 font-mono text-[11px] font-semibold tracking-wide text-foreground uppercase">
        Genesis-Alpha
      </p>
      <ul className="mt-1 px-1.5">
        {tree.map((node) => (
          <FileRow key={node.id} node={node} depth={0} activeId={activeId} onSelect={onSelect} />
        ))}
      </ul>
    </nav>
  )
}
