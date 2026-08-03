import { resolveModel, type AiModel, runRawCompletion } from "./ai.js";

export interface GeneratedFile {
  path: string;
  content: string;
  language?: string;
}

export interface GeneratedApp {
  title: string;
  summary: string;
  entry: string;
  files: GeneratedFile[];
  /** Self-contained HTML for iframe srcDoc (desktop + mobile) */
  previewHtml: string;
  model: AiModel;
  mock?: boolean;
  error?: string;
}

const CODEGEN_SYSTEM = `You are DeVibe Frontend Code Generator — a senior product engineer.
Generate a polished, production-quality single-page website/app from the user's brief.

OUTPUT RULES (strict):
1. Respond with ONLY valid JSON (no markdown fences, no commentary).
2. Schema:
{
  "title": "string",
  "summary": "1-2 sentence product summary",
  "entry": "index.html",
  "files": [
    { "path": "index.html", "content": "...", "language": "html" },
    { "path": "styles.css", "content": "...", "language": "css" },
    { "path": "app.js", "content": "...", "language": "javascript" }
  ]
}
3. Prefer 1–3 files. Always include index.html as entry.
4. The result MUST look excellent on BOTH desktop (≥1024px) and mobile (390px width).
5. index.html MUST include:
   - <meta name="viewport" content="width=device-width, initial-scale=1" />
   - Linked styles.css / app.js when those files exist (relative paths)
6. Design requirements:
   - One cohesive composition (not a dashboard unless asked)
   - Strong brand/title as hero signal
   - Expressive typography (use Google Fonts link, not Inter/Roboto/Arial/system)
   - Atmospheric background (gradient, subtle pattern, or image URL)
   - Full-bleed hero for landing/promotional apps
   - Mobile-first CSS with clear breakpoints
   - At least 2–3 intentional CSS/JS motions (entrance, hover, scroll-friendly)
   - Avoid purple-on-white cliché, cream+terracotta cliché, broadsheet newspaper look
   - No emoji decoration unless the brief asks
7. Make the app feel finished: real copy, clear CTA, accessible contrast, no placeholder lorem.
8. Escape JSON properly (newlines as \\n).`;

/** Prefer Codex for multi-file codegen when the user picked a chat/general model. */
export function pickCodegenModel(requestedId?: string): AiModel {
  const requested = requestedId ? resolveModel(requestedId) : null;
  if (requested?.kind === "codex") return requested;
  // Best available Codex coding model as default generator
  return resolveModel("gpt-5.2-codex");
}

export async function runGenerateApp(input: {
  prompt: string;
  modelId?: string;
  refine?: string;
}): Promise<GeneratedApp> {
  const model = pickCodegenModel(input.modelId);
  const userContent = [
    `Build brief:\n${input.prompt.trim()}`,
    input.refine?.trim()
      ? `\nRefinement / QA focus:\n${input.refine.trim()}`
      : "\nOptimize for the best dual-viewport experience: desktop web + iPhone-width (390px) mobile preview.",
  ].join("\n");

  try {
    const raw = await runRawCompletion({
      model,
      system: CODEGEN_SYSTEM,
      messages: [{ role: "user", content: userContent }],
      maxTokens: 8192,
    });
    const parsed = parseGeneratedJson(raw);
    const files = normalizeFiles(parsed.files);
    const entry = parsed.entry || files.find((f) => f.path.endsWith(".html"))?.path || "index.html";
    const previewHtml = buildPreviewHtml(files, entry);
    return {
      title: parsed.title || deriveTitle(input.prompt),
      summary: parsed.summary || "Generated app ready for desktop and mobile preview.",
      entry,
      files,
      previewHtml,
      model,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const fallback = mockGeneratedApp(input.prompt, model);
    return { ...fallback, mock: true, error: message };
  }
}

interface ParsedGen {
  title?: string;
  summary?: string;
  entry?: string;
  files?: Array<{ path?: string; content?: string; language?: string }>;
}

function parseGeneratedJson(raw: string): ParsedGen {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced?.[1]?.trim() ?? trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("Generator returned no JSON object");
  return JSON.parse(candidate.slice(start, end + 1)) as ParsedGen;
}

function normalizeFiles(
  files: ParsedGen["files"],
): GeneratedFile[] {
  const list = (files ?? [])
    .filter((f) => f?.path && typeof f.content === "string")
    .map((f) => ({
      path: String(f!.path).replace(/^\.\//, ""),
      content: String(f!.content),
      language: f!.language,
    }));
  if (!list.length) throw new Error("Generator returned no files");
  if (!list.some((f) => f.path.endsWith(".html"))) {
    throw new Error("Generator missing index.html");
  }
  return list;
}

export function buildPreviewHtml(files: GeneratedFile[], entry: string): string {
  const byPath = new Map(files.map((f) => [f.path, f.content]));
  const htmlPath = byPath.has(entry) ? entry : files.find((f) => f.path.endsWith(".html"))!.path;
  let html = byPath.get(htmlPath) ?? "";

  // Inline relative CSS/JS so iframe srcDoc does not need a server.
  html = html.replace(
    /<link\b[^>]*href=["']([^"']+\.css)["'][^>]*>/gi,
    (_m, href: string) => {
      const css = byPath.get(href.replace(/^\.\//, ""));
      return css ? `<style data-devibe-inline="${href}">\n${css}\n</style>` : _m;
    },
  );
  html = html.replace(
    /<script\b[^>]*src=["']([^"']+\.js)["'][^>]*>\s*<\/script>/gi,
    (_m, src: string) => {
      const js = byPath.get(src.replace(/^\.\//, ""));
      return js ? `<script data-devibe-inline="${src}">\n${js}\n</script>` : _m;
    },
  );

  if (!/<meta[^>]+viewport/i.test(html)) {
    html = html.replace(
      /<head([^>]*)>/i,
      `<head$1>\n  <meta name="viewport" content="width=device-width, initial-scale=1" />`,
    );
  }
  if (!/<!doctype/i.test(html)) {
    html = `<!DOCTYPE html>\n${html}`;
  }
  return html;
}

function deriveTitle(prompt: string): string {
  const cleaned = prompt.replace(/\s+/g, " ").trim();
  if (cleaned.length <= 48) return cleaned || "Generated App";
  return `${cleaned.slice(0, 45)}…`;
}

function slugify(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 32) || "app"
  );
}

/** High-quality offline generator so dual previews always work without API keys. */
export function mockGeneratedApp(prompt: string, model: AiModel): GeneratedApp {
  const title = deriveTitle(prompt);
  const brand = title.split(/[\s—–:-]/)[0] || "DeVibe";
  const slug = slugify(brand);
  const accent = pickAccent(prompt);
  const summary = `Responsive ${brand} experience tuned for desktop and 390px mobile preview.`;

  const css = `:root {
  --bg0: ${accent.bg0};
  --bg1: ${accent.bg1};
  --ink: ${accent.ink};
  --muted: ${accent.muted};
  --accent: ${accent.accent};
  --accent-2: ${accent.accent2};
  --card: ${accent.card};
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Sora", sans-serif;
}
* { box-sizing: border-box; }
html, body { margin: 0; min-height: 100%; }
body {
  font-family: var(--font-body);
  color: var(--ink);
  background:
    radial-gradient(1200px 600px at 10% -10%, ${accent.glow} 0%, transparent 55%),
    radial-gradient(900px 500px at 100% 0%, ${accent.glow2} 0%, transparent 50%),
    linear-gradient(165deg, var(--bg0), var(--bg1));
  line-height: 1.5;
}
.hero {
  min-height: 100svh;
  display: grid;
  align-items: end;
  padding: clamp(1.25rem, 4vw, 3.5rem);
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: "";
  position: absolute;
  inset: 8% 6% auto auto;
  width: min(48vw, 420px);
  aspect-ratio: 4/5;
  border-radius: 28px;
  background:
    linear-gradient(145deg, ${accent.mediaA}, ${accent.mediaB});
  box-shadow: 0 30px 80px rgba(0,0,0,.28);
  transform: rotate(4deg);
  animation: floatIn 1.1s cubic-bezier(.2,.8,.2,1) both;
}
@media (max-width: 720px) {
  .hero::before {
    position: relative;
    inset: auto;
    width: 100%;
    max-width: 320px;
    margin: 0 auto 1.5rem;
    transform: none;
    justify-self: center;
  }
  .hero { align-items: start; padding-top: 1.5rem; }
}
.brand {
  font-family: var(--font-display);
  font-size: clamp(2.6rem, 8vw, 5.5rem);
  line-height: .95;
  letter-spacing: -0.03em;
  margin: 0 0 .75rem;
  max-width: 12ch;
  animation: rise .8s ease both;
}
.lede {
  max-width: 34rem;
  color: var(--muted);
  font-size: clamp(1rem, 2.4vw, 1.2rem);
  margin: 0 0 1.5rem;
  animation: rise .9s .08s ease both;
}
.actions { display: flex; flex-wrap: wrap; gap: .75rem; animation: rise 1s .14s ease both; }
.btn {
  appearance: none; border: 0; cursor: pointer;
  border-radius: 999px; padding: .85rem 1.25rem;
  font: 600 .95rem var(--font-body);
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
}
.btn:hover { transform: translateY(-2px); }
.btn-primary {
  background: var(--accent); color: ${accent.onAccent};
  box-shadow: 0 12px 30px ${accent.glow};
}
.btn-ghost {
  background: transparent; color: var(--ink);
  border: 1px solid color-mix(in srgb, var(--ink) 22%, transparent);
}
.panel {
  margin: 0 clamp(1.25rem, 4vw, 3.5rem) 3rem;
  padding: 1.25rem 1.35rem;
  border-radius: 20px;
  background: var(--card);
  backdrop-filter: blur(10px);
  border: 1px solid color-mix(in srgb, var(--ink) 10%, transparent);
  animation: rise 1.05s .2s ease both;
}
.panel h2 { margin: 0 0 .35rem; font-family: var(--font-display); font-size: 1.35rem; }
.panel p { margin: 0; color: var(--muted); font-size: .95rem; }
@keyframes rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
}
@keyframes floatIn {
  from { opacity: 0; transform: translateY(24px) rotate(4deg) scale(.96); }
  to { opacity: 1; transform: rotate(4deg) scale(1); }
}`;

  const js = `const cta = document.querySelector("[data-cta]");
const note = document.querySelector("[data-note]");
cta?.addEventListener("click", () => {
  if (!note) return;
  note.textContent = "Preview synced · desktop + mobile viewports share this build.";
  note.animate(
    [{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }],
    { duration: 320, fill: "forwards", easing: "ease-out" },
  );
});`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=Sora:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <main class="hero">
    <div>
      <p class="lede" style="margin-bottom:.35rem;font-size:.8rem;letter-spacing:.14em;text-transform:uppercase;opacity:.7">${escapeHtml(slug)}</p>
      <h1 class="brand">${escapeHtml(brand)}</h1>
      <p class="lede">${escapeHtml(prompt.slice(0, 160))}${prompt.length > 160 ? "…" : ""}</p>
      <div class="actions">
        <button class="btn btn-primary" type="button" data-cta>Launch preview</button>
        <button class="btn btn-ghost" type="button">View details</button>
      </div>
    </div>
  </main>
  <section class="panel">
    <h2>Built for every screen</h2>
    <p data-note>This ${escapeHtml(brand)} build is generated for web and mobile previews side-by-side in the DeVibe IDE.</p>
  </section>
  <script src="app.js"></script>
</body>
</html>`;

  const files: GeneratedFile[] = [
    { path: "index.html", content: html, language: "html" },
    { path: "styles.css", content: css, language: "css" },
    { path: "app.js", content: js, language: "javascript" },
  ];

  return {
    title,
    summary,
    entry: "index.html",
    files,
    previewHtml: buildPreviewHtml(files, "index.html"),
    model,
  };
}

function escapeHtml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function pickAccent(prompt: string) {
  const p = prompt.toLowerCase();
  if (p.includes("finance") || p.includes("bank") || p.includes("trade")) {
    return {
      bg0: "#06141f",
      bg1: "#0c2a24",
      ink: "#e7f6f1",
      muted: "#9cb8ae",
      accent: "#3ddc97",
      accent2: "#f0c75e",
      onAccent: "#042016",
      card: "rgba(8,28,24,.72)",
      glow: "rgba(61,220,151,.35)",
      glow2: "rgba(240,199,94,.22)",
      mediaA: "#134e4a",
      mediaB: "#3ddc97",
    };
  }
  if (p.includes("food") || p.includes("cafe") || p.includes("restaurant")) {
    return {
      bg0: "#1a100c",
      bg1: "#2a1810",
      ink: "#f7efe6",
      muted: "#c4a992",
      accent: "#e4572e",
      accent2: "#f2c14e",
      onAccent: "#1a0a06",
      card: "rgba(40,24,16,.75)",
      glow: "rgba(228,87,46,.35)",
      glow2: "rgba(242,193,78,.2)",
      mediaA: "#7c2d12",
      mediaB: "#e4572e",
    };
  }
  // Default: deep teal / copper — avoids purple cliché
  return {
    bg0: "#071318",
    bg1: "#10242b",
    ink: "#edf4f6",
    muted: "#9bb0b8",
    accent: "#d97757",
    accent2: "#5eead4",
    onAccent: "#1a0b07",
    card: "rgba(12,30,36,.78)",
    glow: "rgba(217,119,87,.32)",
    glow2: "rgba(94,234,212,.18)",
    mediaA: "#0f766e",
    mediaB: "#d97757",
  };
}
