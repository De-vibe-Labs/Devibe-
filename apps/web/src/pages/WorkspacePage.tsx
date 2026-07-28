import { Link } from "react-router-dom";
import { Icon } from "../components/SiteNav";

const files = [
  { name: ".devibe", kind: "folder", status: "" },
  { name: "config.yaml", kind: "file", status: "M", indent: true },
  { name: "src", kind: "folder", status: "" },
  { name: "index.tsx", kind: "file", status: "A", indent: true },
  { name: "AgentOrb.tsx", kind: "file", status: "U", indent: true, active: true },
  { name: "package.json", kind: "file", status: "" },
  { name: "README.md", kind: "file", status: "" },
];

const codeLines = [
  "import { motion } from 'framer-motion'",
  "",
  "export function AgentOrb() {",
  "  return (",
  "    <motion.div",
  "      className=\"orb\"",
  "      animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}",
  "      transition={{ repeat: Infinity, duration: 2.4 }}",
  "    />",
  "  )",
  "}",
  "",
  "// DeVibe AI: Added sophisticated glow transition",
];

export function WorkspacePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#09090B] text-on-surface">
      <header className="flex h-14 items-center justify-between border-b border-outline-variant/50 px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="font-display text-sm font-bold text-primary">
            DeVibe Workspace
          </Link>
          <span className="text-outline">/</span>
          <span className="font-mono text-xs text-on-surface-variant">Genesis-Alpha</span>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-primary/30 bg-primary-container/15 px-3 py-1 text-xs text-primary md:flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          Frontend Agent is refining styles…
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-outline-variant px-3 py-1.5 text-xs">
            Code
          </button>
          <button className="rounded-md border border-outline-variant px-3 py-1.5 text-xs text-on-surface-variant">
            Preview
          </button>
          <button className="rounded-md bg-primary-container px-3 py-1.5 text-xs font-bold text-on-primary-container">
            Deploy
          </button>
          <button className="rounded-md bg-surface-container-high px-3 py-1.5 text-xs">Run</button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[220px_1fr_320px]">
        <aside className="border-r border-outline-variant/40 bg-surface-deep p-3 font-mono text-xs">
          <p className="mb-3 text-[10px] uppercase tracking-widest text-on-surface-variant">
            GENESIS-ALPHA
          </p>
          <ul className="space-y-1">
            {files.map((f) => (
              <li
                key={f.name + f.kind}
                className={`flex items-center gap-2 rounded px-2 py-1 ${
                  f.active ? "bg-primary-container/30 text-primary" : "text-on-surface-variant"
                } ${f.indent ? "ml-3" : ""}`}
              >
                <Icon name={f.kind === "folder" ? "folder" : "description"} className="text-sm" />
                <span className="flex-1">{f.name}</span>
                {f.status ? <span className="text-[10px] text-warning">{f.status}</span> : null}
              </li>
            ))}
          </ul>
        </aside>

        <section className="flex min-h-[420px] flex-col border-r border-outline-variant/40">
          <div className="border-b border-outline-variant/40 px-4 py-2 font-mono text-xs text-on-surface-variant">
            AgentOrb.tsx
          </div>
          <pre className="flex-1 overflow-auto p-4 font-mono text-[12px] leading-6">
            {codeLines.map((line, i) => (
              <div
                key={i}
                className={`flex gap-4 ${
                  line.includes("DeVibe AI")
                    ? "my-1 rounded bg-surface-container-high/80 px-2"
                    : ""
                }`}
              >
                <span className="w-6 select-none text-right text-outline">{i + 1}</span>
                <code>{line || " "}</code>
              </div>
            ))}
          </pre>
          <div className="flex items-center justify-between border-t border-outline-variant/40 px-4 py-2 text-[11px] text-on-surface-variant">
            <span>Sync to GitHub (main) · 1 outgoing change</span>
            <span>UTF-8 · TypeScript JSX</span>
          </div>
        </section>

        <aside className="flex flex-col gap-3 bg-surface-deep p-3">
          <div className="glass flex-1 rounded-xl p-4">
            <p className="mb-2 font-mono text-[10px] text-on-surface-variant">
              devibe.app/preview/genesis-alpha
            </p>
            <div className="flex h-40 flex-col items-center justify-center rounded-lg bg-surface-container-lowest">
              <div className="mb-3 h-12 w-12 animate-pulse-soft rounded-full bg-primary-container shadow-[0_0_30px_rgba(110,60,251,0.55)]" />
              <p className="font-display text-sm text-white">Genesis Alpha</p>
              <p className="mt-1 px-4 text-center text-xs text-on-surface-variant">
                The orchestrator is online and processing data flows.
              </p>
            </div>
          </div>
          <div className="glass rounded-xl p-4">
            <p className="mb-2 text-xs text-on-surface-variant">Mobile preview</p>
            <div className="mx-auto h-48 w-28 rounded-2xl border border-outline-variant bg-surface-container-lowest p-3">
              <p className="font-display text-xs text-white">Genesis</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                <div className="h-full w-2/3 bg-primary" />
              </div>
            </div>
          </div>
          <Link
            to="/orchestration"
            className="fixed right-6 bottom-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-[0_0_28px_rgba(110,60,251,0.5)] lg:static lg:h-12 lg:w-full lg:rounded-xl"
            aria-label="Open orchestration"
          >
            <Icon name="smart_toy" />
          </Link>
        </aside>
      </div>
    </div>
  );
}
