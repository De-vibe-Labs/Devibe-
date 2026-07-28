# 4. Monaco IDE + Dual Preview

File tree, Monaco editor, desktop + mobile live previews.

---

Design the full IDE view for DeVibe with Monaco editor and live dual previews.

Desktop 1440–1600px, dark theme matching VS Code / Linear aesthetic (#09090B base, #7C3AED accents).

Layout (3-column or resizable panels):

Left panel (240px): File explorer (tree with .tsx, .ts, package.json, etc.), Git status, search.

Center (flexible): Monaco editor – full VS Code look (syntax highlighting, minimap, tabs, line numbers, AI inline suggestions in violet). Top tabs for open files. Bottom status bar with language, agent suggestions count, "Sync to GitHub".

Right panel (split vertically):
- Top: Desktop web preview (iframe-style, with device frame, URL bar, refresh, open external). Shows the live generated website.
- Bottom: Mobile preview (iPhone 15 / Pixel frame, 390px width, responsive toggle). Shows the same app on mobile with device chrome.

Top toolbar: Run, Preview, Deploy to Cloud, Share, Agent actions ("Ask Frontend Agent to fix responsive", "Scale this on Cloudflare").

Include empty state, loading skeleton while agents generate code, and a "Diff" view when agents propose changes.

Make the Monaco area look pixel-perfect and professional. Previews should feel real and interactive.
