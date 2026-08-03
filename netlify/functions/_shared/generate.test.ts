import { describe, expect, it } from "vitest";
import { buildPreviewHtml, mockGeneratedApp, pickCodegenModel } from "./generate.ts";
import { resolveModel } from "./ai.ts";

describe("codegen model selection", () => {
  it("keeps Codex when requested", () => {
    expect(pickCodegenModel("gpt-5-codex").kind).toBe("codex");
  });

  it("defaults Claude chat picks to best Codex for generation", () => {
    const model = pickCodegenModel("claude-sonnet");
    expect(model.kind).toBe("codex");
    expect(model.id).toBe("gpt-5.2-codex");
  });
});

describe("preview html assembly", () => {
  it("inlines css/js and ensures viewport meta", () => {
    const html = buildPreviewHtml(
      [
        {
          path: "index.html",
          content:
            '<html><head><title>T</title><link rel="stylesheet" href="styles.css" /></head><body><script src="app.js"></script></body></html>',
        },
        { path: "styles.css", content: "body{color:red}" },
        { path: "app.js", content: "console.log(1)" },
      ],
      "index.html",
    );
    expect(html).toContain("viewport");
    expect(html).toContain("body{color:red}");
    expect(html).toContain("console.log(1)");
    expect(html).toMatch(/<!DOCTYPE html>/i);
  });
});

describe("mock generator quality", () => {
  it("produces dual-viewport ready html", () => {
    const app = mockGeneratedApp(
      "Build a coastal cafe landing page with reservation CTA",
      resolveModel("gpt-5.2-codex"),
    );
    expect(app.files.length).toBeGreaterThanOrEqual(2);
    expect(app.previewHtml).toContain("viewport");
    expect(app.previewHtml.toLowerCase()).toContain("<!doctype html>");
    expect(app.previewHtml).toMatch(/svh|clamp|390|mobile/i);
  });
});
