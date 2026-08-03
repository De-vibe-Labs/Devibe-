import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/SiteNav";
import { DualPreview } from "../components/DualPreview";
import {
  loadGeneratedProject,
  updateProjectFile,
  type GeneratedProject,
} from "../lib/generated-project";

type Pane = "code" | "preview" | "split";

export function WorkspacePage() {
  const [project, setProject] = useState<GeneratedProject | null>(null);
  const [activePath, setActivePath] = useState<string>("index.html");
  const [pane, setPane] = useState<Pane>("split");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const loaded = loadGeneratedProject();
    setProject(loaded);
    if (loaded) setActivePath(loaded.entry || loaded.files[0]?.path || "index.html");
  }, []);

  const activeFile = useMemo(
    () => project?.files.find((f) => f.path === activePath) ?? project?.files[0],
    [project, activePath],
  );

  function onEdit(content: string) {
    if (!project || !activeFile) return;
    setDirty(true);
    const next = updateProjectFile(project, activeFile.path, content);
    setProject(next);
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-4 text-text">
        <Icon name="code" className="text-3xl text-primary" />
        <h1 className="text-xl font-semibold">No generated app yet</h1>
        <p className="max-w-md text-center text-sm text-text-muted">
          Ask the AI Builder to generate a website or app. Codex runs the code generator and
          opens desktop + mobile previews here.
        </p>
        <Link to="/" className="dv-btn-primary px-4 py-2 text-sm">
          Open AI Builder
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-bg text-text">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/" className="text-sm font-semibold text-primary">
            DeVibe Workspace
          </Link>
          <span className="text-text-subtle">/</span>
          <span className="truncate font-mono text-xs text-text-muted">{project.title}</span>
          {project.mock ? (
            <span className="dv-tag hidden sm:inline">local generator</span>
          ) : (
            <span className="dv-tag hidden sm:inline">{project.modelLabel ?? project.modelId}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {(
            [
              ["code", "Code"],
              ["preview", "Preview"],
              ["split", "Split"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setPane(id)}
              className={`rounded-md px-3 py-1.5 text-xs ${
                pane === id
                  ? "bg-primary-soft text-primary"
                  : "border border-border text-text-muted"
              }`}
            >
              {label}
            </button>
          ))}
          <Link to="/" className="dv-btn-secondary px-3 py-1.5 text-xs">
            Chat
          </Link>
          <Link to="/cloud" className="dv-btn-primary px-3 py-1.5 text-xs">
            Deploy
          </Link>
        </div>
      </header>

      <div
        className={`grid min-h-0 flex-1 ${
          pane === "split"
            ? "grid-cols-1 lg:grid-cols-[200px_1fr_360px]"
            : pane === "code"
              ? "grid-cols-1 lg:grid-cols-[200px_1fr]"
              : "grid-cols-1 lg:grid-cols-[200px_1fr]"
        }`}
      >
        <aside className="border-r border-border bg-surface p-3 font-mono text-xs overflow-auto">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-text-subtle">Files</p>
          <ul className="space-y-1">
            {project.files.map((f) => (
              <li key={f.path}>
                <button
                  type="button"
                  onClick={() => setActivePath(f.path)}
                  className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left ${
                    f.path === activeFile?.path
                      ? "bg-primary-soft text-primary"
                      : "text-text-muted hover:bg-surface-elevated"
                  }`}
                >
                  <Icon name="description" className="text-sm" />
                  <span className="truncate">{f.path}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11px] leading-relaxed text-text-subtle">
            {project.summary}
          </p>
        </aside>

        {pane !== "preview" ? (
          <section className="flex min-h-0 flex-col border-r border-border">
            <div className="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-xs text-text-muted">
              <span>{activeFile?.path}</span>
              <span>{dirty ? "Edited · preview live" : "Synced"}</span>
            </div>
            <textarea
              className="min-h-[320px] flex-1 resize-none bg-bg p-4 font-mono text-[12px] leading-6 text-text outline-none"
              value={activeFile?.content ?? ""}
              onChange={(e) => onEdit(e.target.value)}
              spellCheck={false}
            />
            <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[11px] text-text-subtle">
              <span>Desktop + mobile iframes share this build</span>
              <span>UTF-8 · {activeFile?.language ?? "text"}</span>
            </div>
          </section>
        ) : null}

        {pane !== "code" ? (
          <aside className={`min-h-0 overflow-auto bg-surface p-3 ${pane === "preview" ? "" : ""}`}>
            <DualPreview
              html={project.previewHtml}
              urlLabel={`devibe.app/preview/${project.id.slice(0, 8)}`}
            />
          </aside>
        ) : null}
      </div>
    </div>
  );
}
