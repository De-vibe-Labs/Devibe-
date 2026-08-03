import { useMemo, useState } from "react";
import { Icon } from "../components/SiteNav";

interface DualPreviewProps {
  html: string;
  urlLabel?: string;
  onRefresh?: () => void;
}

/** Shared srcDoc rendered in desktop + 390px mobile iframes. */
export function DualPreview({ html, urlLabel = "preview", onRefresh }: DualPreviewProps) {
  const [rev, setRev] = useState(0);
  const srcDoc = useMemo(() => html, [html, rev]);

  function refresh() {
    setRev((n) => n + 1);
    onRefresh?.();
  }

  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex items-center gap-2 border-b border-border px-3 py-2">
          <span className="font-mono text-[10px] text-text-subtle truncate">
            desktop · {urlLabel}
          </span>
          <button
            type="button"
            className="ml-auto dv-btn-secondary px-2 py-0.5 text-[10px]"
            onClick={refresh}
            title="Refresh preview"
          >
            <Icon name="refresh" className="text-sm" />
          </button>
        </div>
        <iframe
          key={`desk-${rev}`}
          title="Desktop web preview"
          sandbox="allow-scripts allow-forms allow-modals allow-popups"
          className="h-full min-h-[220px] w-full flex-1 bg-white"
          srcDoc={srcDoc}
        />
      </div>

      <div className="flex flex-col items-center rounded-xl border border-border bg-surface p-3">
        <div className="mb-2 flex w-full items-center justify-between">
          <p className="text-[11px] text-text-muted">Mobile · 390×844</p>
          <span className="font-mono text-[10px] text-text-subtle">iPhone viewport</span>
        </div>
        <div className="relative w-[min(100%,390px)] overflow-hidden rounded-[28px] border-[6px] border-[#1c1c1e] bg-black shadow-[0_20px_50px_rgba(0,0,0,.45)]">
          <div className="mx-auto mt-2 mb-1 h-1.5 w-20 rounded-full bg-[#2c2c2e]" />
          <iframe
            key={`mobile-${rev}`}
            title="Mobile app preview"
            sandbox="allow-scripts allow-forms allow-modals allow-popups"
            className="block h-[min(62vh,844px)] w-full bg-white"
            style={{ width: "100%", aspectRatio: "390 / 844", maxHeight: 560 }}
            srcDoc={srcDoc}
          />
        </div>
      </div>
    </div>
  );
}
