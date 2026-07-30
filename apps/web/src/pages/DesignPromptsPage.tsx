import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SiteNav, Icon } from "../components/SiteNav";
import { FIGMA_PROMPTS } from "../data/figmaPrompts";

export function DesignPromptsPage() {
  const [activeId, setActiveId] = useState(FIGMA_PROMPTS[0].id);
  const [copied, setCopied] = useState(false);
  const active = useMemo(
    () => FIGMA_PROMPTS.find((p) => p.id === activeId) ?? FIGMA_PROMPTS[0],
    [activeId],
  );

  async function copyPrompt() {
    await navigator.clipboard.writeText(active.prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="grain min-h-screen bg-bg text-text">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-6 pt-24 pb-16">
        <div className="mb-8 max-w-2xl">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-primary">
            Figma Make / AI
          </p>
          <h1 className="mb-3 text-3xl font-semibold tracking-tight">DeVibe UI prompts</h1>
          <p className="text-sm text-text-muted">
            Production-ready prompts for Figma Make, Figma AI, or any design LLM. Copy one at a
            time, then say “Keep this visual style and design system” before the next frame.
            Implemented screens:{" "}
            <Link className="text-primary hover:underline" to="/">
              Chat
            </Link>
            ,{" "}
            <Link className="text-primary hover:underline" to="/login">
              Auth
            </Link>
            ,{" "}
            <Link className="text-primary hover:underline" to="/workspace">
              IDE
            </Link>
            ,{" "}
            <Link className="text-primary hover:underline" to="/cloud">
              Cloud
            </Link>
            .
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-2">
            {FIGMA_PROMPTS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveId(p.id)}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  p.id === activeId
                    ? "border-primary/50 bg-primary-soft"
                    : "border-border bg-surface-card hover:border-border-strong"
                }`}
              >
                <p className="text-sm font-medium">{p.title}</p>
                <p className="mt-1 text-xs text-text-muted">{p.summary}</p>
              </button>
            ))}
          </aside>

          <section className="dv-card overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
              <div>
                <h2 className="text-sm font-medium">{active.title}</h2>
                <p className="text-xs text-text-subtle">Also saved under prompts/figma/</p>
              </div>
              <button type="button" className="dv-btn-primary px-3 py-1.5 text-xs" onClick={copyPrompt}>
                <Icon name={copied ? "check" : "content_copy"} className="text-sm" />
                {copied ? "Copied" : "Copy for Figma"}
              </button>
            </div>
            <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap p-4 font-mono text-[12px] leading-relaxed text-text-muted">
              {active.prompt}
            </pre>
          </section>
        </div>
      </main>
    </div>
  );
}
