export interface GeneratedFile {
  path: string;
  content: string;
  language?: string;
}

export interface GeneratedProject {
  id: string;
  title: string;
  summary: string;
  entry: string;
  files: GeneratedFile[];
  previewHtml: string;
  prompt: string;
  modelId: string;
  modelLabel?: string;
  mock?: boolean;
  updatedAt: number;
}

const STORAGE_KEY = "devibe.generated.project.v1";

export function saveGeneratedProject(
  project: Omit<GeneratedProject, "id" | "updatedAt"> & { id?: string },
): GeneratedProject {
  const next: GeneratedProject = {
    ...project,
    id: project.id ?? crypto.randomUUID(),
    updatedAt: Date.now(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // quota / private mode — still return in-memory shape for this session
  }
  return next;
}

export function loadGeneratedProject(): GeneratedProject | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GeneratedProject;
  } catch {
    return null;
  }
}

export function clearGeneratedProject(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function updateProjectFile(
  project: GeneratedProject,
  path: string,
  content: string,
): GeneratedProject {
  const files = project.files.map((f) => (f.path === path ? { ...f, content } : f));
  const previewHtml = rebuildPreviewHtml(files, project.entry);
  return saveGeneratedProject({ ...project, files, previewHtml });
}

/** Client-side mirror of server buildPreviewHtml for live edits. */
export function rebuildPreviewHtml(files: GeneratedFile[], entry: string): string {
  const byPath = new Map(files.map((f) => [f.path, f.content]));
  const htmlPath = byPath.has(entry)
    ? entry
    : files.find((f) => f.path.endsWith(".html"))?.path;
  if (!htmlPath) return "<!DOCTYPE html><html><body><p>No HTML entry</p></body></html>";
  let html = byPath.get(htmlPath) ?? "";

  html = html.replace(
    /<link\b[^>]*href=["']([^"']+\.css)["'][^>]*>/gi,
    (full, href: string) => {
      const css = byPath.get(href.replace(/^\.\//, ""));
      return css ? `<style data-devibe-inline="${href}">\n${css}\n</style>` : full;
    },
  );
  html = html.replace(
    /<script\b[^>]*src=["']([^"']+\.js)["'][^>]*>\s*<\/script>/gi,
    (full, src: string) => {
      const js = byPath.get(src.replace(/^\.\//, ""));
      return js ? `<script data-devibe-inline="${src}">\n${js}\n</script>` : full;
    },
  );

  if (!/<meta[^>]+viewport/i.test(html)) {
    html = html.replace(
      /<head([^>]*)>/i,
      `<head$1>\n  <meta name="viewport" content="width=device-width, initial-scale=1" />`,
    );
  }
  if (!/<!doctype/i.test(html)) html = `<!DOCTYPE html>\n${html}`;
  return html;
}
