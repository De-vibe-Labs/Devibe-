import { useEffect, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";

interface MonacoEditorPaneProps {
  path: string;
  value: string;
  language?: string;
  onChange?: (value: string) => void;
}

function languageFromPath(path: string): string {
  if (path.endsWith(".tsx") || path.endsWith(".ts")) return "typescript";
  if (path.endsWith(".jsx") || path.endsWith(".js")) return "javascript";
  if (path.endsWith(".css")) return "css";
  if (path.endsWith(".html")) return "html";
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".md")) return "markdown";
  if (path.endsWith(".yml") || path.endsWith(".yaml")) return "yaml";
  return "plaintext";
}

export function MonacoEditorPane({ path, value, language, onChange }: MonacoEditorPaneProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  useEffect(() => {
    editorRef.current?.setScrollPosition({ scrollTop: 0 });
  }, [path]);

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      path={path}
      language={language ?? languageFromPath(path)}
      value={value}
      onChange={(v) => onChange?.(v ?? "")}
      onMount={(editor) => {
        editorRef.current = editor;
      }}
      options={{
        fontSize: 13,
        fontFamily: "Geist Mono, JetBrains Mono, ui-monospace, monospace",
        minimap: { enabled: true, scale: 0.75 },
        smoothScrolling: true,
        cursorBlinking: "smooth",
        automaticLayout: true,
        padding: { top: 12 },
        renderLineHighlight: "line",
        scrollBeyondLastLine: false,
        tabSize: 2,
      }}
      loading={<div className="flex h-full items-center justify-center text-xs text-text-muted">Loading Monaco…</div>}
    />
  );
}
