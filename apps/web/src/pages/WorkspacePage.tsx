import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/SiteNav";
import { DualPreview } from "../components/DualPreview";
import { MonacoEditorPane } from "../components/MonacoEditorPane";
import {
  loadGeneratedProject,
  rebuildPreviewHtml,
  updateProjectFile,
  type GeneratedProject,
} from "../lib/generated-project";

type LeftRail =
  | "explorer"
  | "cloud"
  | "mcp"
  | "git"
  | "agents"
  | "deployments"
  | "database"
  | "marketplace"
  | "security";

type BottomPanel = "terminal" | "problems" | "logs" | "tasks" | "deployments" | "ai";

type RightRail = "properties" | "docs" | "monitoring" | "metrics";

type CenterMode = "code" | "preview" | "split";

const LEFT_ITEMS: { id: LeftRail; label: string; icon: string; to?: string }[] = [
  { id: "explorer", label: "Explorer", icon: "folder_open" },
  { id: "cloud", label: "Cloud", icon: "cloud", to: "/dashboard" },
  { id: "mcp", label: "MCP", icon: "hub", to: "/mcp" },
  { id: "git", label: "Git", icon: "commit" },
  { id: "agents", label: "Agents", icon: "smart_toy", to: "/" },
  { id: "deployments", label: "Deployments", icon: "rocket_launch", to: "/cloud" },
  { id: "database", label: "Database", icon: "database", to: "/supabase" },
  { id: "marketplace", label: "Marketplace", icon: "storefront", to: "/marketplace" },
  { id: "security", label: "Security", icon: "shield", to: "/security" },
];

const DEFAULT_FILES: GeneratedProject = {
  id: "monaco-starter",
  title: "Monaco Cloud",
  summary: "AI Cloud OS starter — Build. Deploy. Scale. Anywhere.",
  entry: "index.html",
  prompt: "Monaco Cloud starter",
  modelId: "local",
  modelLabel: "starter",
  updatedAt: Date.now(),
  files: [
    {
      path: "README.md",
      language: "markdown",
      content: `# Monaco Cloud

Build. Deploy. Scale. Anywhere.

 monorepo IDE · \`monaco\` CLI · MCP Marketplace · QR pairing
`,
    },
    {
      path: "index.html",
      language: "html",
      content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Monaco Cloud</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="wrap">
    <p class="eyebrow">Monaco Cloud</p>
    <h1>Build. Deploy. Scale. Anywhere.</h1>
    <p class="lede">AI-native cloud OS powered by Monaco Editor.</p>
    <button type="button" data-cta>Open workspace</button>
  </main>
  <script src="app.js"></script>
</body>
</html>`,
    },
    {
      path: "styles.css",
      language: "css",
      content: `body{margin:0;font-family:Georgia,serif;background:linear-gradient(160deg,#0b1220,#132238);color:#e8eef7;min-height:100vh}
.wrap{padding:clamp(2rem,6vw,5rem);max-width:40rem}
.eyebrow{letter-spacing:.2em;text-transform:uppercase;font-size:.75rem;opacity:.7}
h1{font-size:clamp(2.4rem,7vw,4rem);line-height:1;margin:.4rem 0 1rem}
.lede{opacity:.8;font-size:1.1rem}
button{margin-top:1.5rem;border:0;border-radius:999px;padding:.85rem 1.3rem;background:#e8a87c;color:#1a0f0a;font-weight:700;cursor:pointer}`,
    },
    {
      path: "app.js",
      language: "javascript",
      content: `document.querySelector("[data-cta]")?.addEventListener("click",()=>{document.querySelector(".lede").textContent="Desktop + mobile previews synced."});`,
    },
  ],
  previewHtml: "",
};

function withPreview(project: GeneratedProject): GeneratedProject {
  if (project.previewHtml) return project;
  return { ...project, previewHtml: rebuildPreviewHtml(project.files, project.entry) };
}

export function WorkspacePage() {
  const [project, setProject] = useState<GeneratedProject | null>(null);
  const [activePath, setActivePath] = useState("index.html");
  const [left, setLeft] = useState<LeftRail>("explorer");
  const [bottom, setBottom] = useState<BottomPanel>("ai");
  const [right, setRight] = useState<RightRail>("properties");
  const [center, setCenter] = useState<CenterMode>("split");
  const [termLines, setTermLines] = useState<string[]>([
    "$ monaco version",
    "monaco 0.1.0 (Monaco Cloud)",
    "$ monaco help",
  ]);

  useEffect(() => {
    const loaded = loadGeneratedProject();
    const base = withPreview(loaded ?? DEFAULT_FILES);
    setProject(base);
    setActivePath(base.entry || base.files[0]?.path || "index.html");
  }, []);

  const activeFile = useMemo(
    () => project?.files.find((f) => f.path === activePath) ?? project?.files[0],
    [project, activePath],
  );

  function onEdit(content: string) {
    if (!project || !activeFile) return;
    if (project.id === "monaco-starter") {
      const files = project.files.map((f) =>
        f.path === activeFile.path ? { ...f, content } : f,
      );
      setProject({
        ...project,
        files,
        previewHtml: rebuildPreviewHtml(files, project.entry),
        updatedAt: Date.now(),
      });
      return;
    }
    setProject(updateProjectFile(project, activeFile.path, content));
  }

  function runCliHint(cmd: string) {
    setBottom("terminal");
    setTermLines((lines) => [...lines, `$ ${cmd}`, `→ queued in Monaco Cloud CLI`]);
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg text-text-muted text-sm">
        Booting Monaco Cloud IDE…
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-bg text-text">
      {/* Title bar */}
      <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/home" className="text-sm font-semibold tracking-tight">
            Monaco Cloud
          </Link>
          <span className="hidden text-[11px] text-text-subtle sm:inline">
            Build. Deploy. Scale. Anywhere.
          </span>
          <span className="truncate font-mono text-[11px] text-text-muted">
            {project.title}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
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
              onClick={() => setCenter(id)}
              className={`rounded-md px-2.5 py-1 text-[11px] ${
                center === id ? "bg-primary-soft text-primary" : "text-text-muted"
              }`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            className="dv-btn-secondary px-2.5 py-1 text-[11px]"
            onClick={() => runCliHint("monaco deploy --env preview")}
          >
            Deploy
          </button>
          <Link to="/" className="dv-btn-primary px-2.5 py-1 text-[11px]">
            Agents
          </Link>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[52px_minmax(0,1fr)]">
        {/* Activity bar */}
        <nav className="flex flex-col items-center gap-1 border-r border-border bg-surface py-2">
          {LEFT_ITEMS.map((item) =>
            item.to && item.id !== left ? (
              <Link
                key={item.id}
                to={item.to}
                title={item.label}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-text-muted hover:bg-surface-elevated hover:text-text"
              >
                <Icon name={item.icon} className="text-[20px]" />
              </Link>
            ) : (
              <button
                key={item.id}
                type="button"
                title={item.label}
                onClick={() => setLeft(item.id)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  left === item.id
                    ? "bg-primary-soft text-primary"
                    : "text-text-muted hover:bg-surface-elevated"
                }`}
              >
                <Icon name={item.icon} className="text-[20px]" />
              </button>
            ),
          )}
        </nav>

        <div
          className={`grid min-h-0 min-w-0 ${
            center === "split"
              ? "grid-rows-[1fr_180px] lg:grid-cols-[220px_minmax(0,1fr)_300px] lg:grid-rows-[1fr_180px]"
              : "grid-rows-[1fr_180px] lg:grid-cols-[220px_minmax(0,1fr)_280px] lg:grid-rows-[1fr_180px]"
          }`}
        >
          {/* Sidebar */}
          <aside className="min-h-0 overflow-auto border-b border-border bg-surface p-3 lg:border-r lg:border-b-0">
            <p className="mb-2 text-[10px] font-medium uppercase tracking-widest text-text-subtle">
              {LEFT_ITEMS.find((i) => i.id === left)?.label}
            </p>
            {left === "explorer" ? (
              <ul className="space-y-1 font-mono text-xs">
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
                      {f.path}
                    </button>
                  </li>
                ))}
              </ul>
            ) : left === "git" ? (
              <div className="space-y-2 text-xs text-text-muted">
                <p>GitHub OAuth / GitHub App — passwords never stored.</p>
                <button
                  type="button"
                  className="dv-btn-secondary w-full py-1.5"
                  onClick={() => runCliHint("monaco github")}
                >
                  Connect GitHub
                </button>
              </div>
            ) : left === "agents" ? (
              <ul className="space-y-1 text-xs text-text-muted">
                {[
                  "Infrastructure",
                  "Security",
                  "Database",
                  "Git",
                  "Kubernetes",
                  "Deployment",
                  "Monitoring",
                  "Cost",
                  "Recovery",
                ].map((a) => (
                  <li key={a} className="rounded px-2 py-1.5 hover:bg-surface-elevated">
                    {a} Agent
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-text-muted">
                Open the dedicated {left} module from the activity bar or run{" "}
                <code className="text-primary">monaco {left === "database" ? "database" : left}</code>.
              </p>
            )}
          </aside>

          {/* Editor + optional preview */}
          <section
            className={`min-h-0 min-w-0 border-b border-border lg:border-b-0 ${
              center === "split"
                ? "grid grid-rows-2 lg:col-span-1 lg:row-span-1 lg:grid-rows-1 lg:grid-cols-2"
                : "lg:col-span-1"
            }`}
          >
            {center !== "preview" ? (
              <div className="flex min-h-0 flex-col border-r border-border">
                <div className="flex items-center justify-between border-b border-border px-3 py-1.5 font-mono text-[11px] text-text-muted">
                  <span>{activeFile?.path}</span>
                  <span>Monaco Editor</span>
                </div>
                <div className="min-h-[200px] flex-1">
                  <MonacoEditorPane
                    path={activeFile?.path ?? "file"}
                    value={activeFile?.content ?? ""}
                    language={activeFile?.language}
                    onChange={onEdit}
                  />
                </div>
              </div>
            ) : null}
            {center !== "code" ? (
              <div className="min-h-0 overflow-auto bg-surface p-2">
                <DualPreview
                  html={project.previewHtml}
                  urlLabel={`monaco.cloud/preview/${project.id.slice(0, 8)}`}
                />
              </div>
            ) : null}
          </section>

          {/* Right sidebar */}
          <aside className="hidden min-h-0 overflow-auto border-l border-border bg-surface p-3 lg:block lg:row-span-1">
            <div className="mb-3 flex flex-wrap gap-1">
              {(
                [
                  ["properties", "Props"],
                  ["docs", "Docs"],
                  ["monitoring", "Monitor"],
                  ["metrics", "Metrics"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setRight(id)}
                  className={`rounded px-2 py-1 text-[10px] ${
                    right === id ? "bg-primary-soft text-primary" : "text-text-subtle"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {right === "properties" ? (
              <dl className="space-y-2 text-xs text-text-muted">
                <div>
                  <dt className="text-text-subtle">Project</dt>
                  <dd>{project.title}</dd>
                </div>
                <div>
                  <dt className="text-text-subtle">Entry</dt>
                  <dd className="font-mono">{project.entry}</dd>
                </div>
                <div>
                  <dt className="text-text-subtle">Files</dt>
                  <dd>{project.files.length}</dd>
                </div>
                <div>
                  <dt className="text-text-subtle">Generator</dt>
                  <dd>{project.modelLabel ?? project.modelId}</dd>
                </div>
              </dl>
            ) : right === "docs" ? (
              <p className="text-xs text-text-muted">{project.summary}</p>
            ) : (
              <p className="text-xs text-text-muted">
                Cloud metrics & monitoring stream via MCP health checks (wire Phase 6 agents).
              </p>
            )}
          </aside>

          {/* Bottom panel */}
          <div className="col-span-full flex min-h-0 flex-col border-t border-border bg-surface">
            <div className="flex gap-1 border-b border-border px-2">
              {(
                [
                  ["terminal", "Terminal"],
                  ["problems", "Problems"],
                  ["logs", "Logs"],
                  ["tasks", "Tasks"],
                  ["deployments", "Deployments"],
                  ["ai", "AI Chat"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setBottom(id)}
                  className={`px-2 py-1.5 text-[11px] ${
                    bottom === id
                      ? "border-b border-primary text-primary"
                      : "text-text-subtle"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-3 font-mono text-[11px] text-text-muted">
              {bottom === "terminal" ? (
                termLines.map((line, i) => <div key={i}>{line}</div>)
              ) : bottom === "ai" ? (
                <div>
                  Product + Frontend agents ready.{" "}
                  <Link to="/" className="text-primary hover:underline">
                    Open AI Agent Workspace
                  </Link>
                </div>
              ) : bottom === "problems" ? (
                <div>No problems detected in workspace.</div>
              ) : bottom === "logs" ? (
                <div>
                  [edge] healthy
                  <br />
                  [mcp] marketplace catalog loaded
                </div>
              ) : bottom === "tasks" ? (
                <div>
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => runCliHint("monaco build")}
                  >
                    Run monaco build
                  </button>
                </div>
              ) : (
                <div>
                  Preview environment idle.{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => runCliHint("monaco deploy")}
                  >
                    monaco deploy
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
