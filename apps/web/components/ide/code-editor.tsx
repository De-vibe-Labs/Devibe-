"use client"

import Editor from "@monaco-editor/react"
import type { BeforeMount } from "@monaco-editor/react"

/** Maps our fixture language ids onto Monaco language ids. */
const languageMap: Record<string, string> = {
  typescript: "typescript",
  json: "json",
  yaml: "yaml",
  markdown: "markdown",
}

export function CodeEditor({
  value,
  language,
  path,
}: {
  value: string
  language?: string
  path: string
}) {
  const handleBeforeMount: BeforeMount = (monaco) => {
    // The fixtures reference packages that aren't installed in the browser worker,
    // so suppress resolution noise instead of showing false errors.
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: false,
    })
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
    })

    monaco.editor.defineTheme("devibe", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "6b6b76", fontStyle: "italic" },
        { token: "keyword", foreground: "c084fc" },
        { token: "string", foreground: "5eead4" },
        { token: "number", foreground: "fbbf24" },
        { token: "type", foreground: "7dd3fc" },
        { token: "type.identifier", foreground: "7dd3fc" },
      ],
      colors: {
        "editor.background": "#0b0c10",
        "editor.foreground": "#e8e8ec",
        "editorLineNumber.foreground": "#4a4a55",
        "editorLineNumber.activeForeground": "#ccbeff",
        "editor.selectionBackground": "#7c3aed44",
        "editor.lineHighlightBackground": "#14161f",
        "editorCursor.foreground": "#ccbeff",
        "editorIndentGuide.background1": "#1c1c22",
        "editorGutter.background": "#0b0c10",
      },
    })
  }

  return (
    <Editor
      key={path}
      path={path}
      value={value}
      language={languageMap[language ?? ""] ?? "plaintext"}
      beforeMount={handleBeforeMount}
      theme="devibe"
      loading={<span className="font-mono text-xs text-muted-foreground">Loading editor...</span>}
      options={{
        fontSize: 13,
        fontFamily: "var(--font-mono), ui-monospace, monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        padding: { top: 16, bottom: 16 },
        renderLineHighlight: "line",
        cursorBlinking: "smooth",
        tabSize: 2,
        automaticLayout: true,
        scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
      }}
    />
  )
}
