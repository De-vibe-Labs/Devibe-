# 3. AI Builder Workspace – Chat Prompt Interface

ChatGPT-style multi-agent builder with prompt composer + tags.

---

Design the core AI Builder Workspace for DeVibe – a ChatGPT-style interface optimized for multi-agent software creation.

Desktop 1440px, dark mode (#09090B).

Layout:
- Left sidebar (240px): Project list, "New project", recent chats, agent status indicators (Product Agent, UX Agent, Frontend, Backend, DevOps, Security, QA – with online/idle dots).

- Main area: Conversation thread. User messages right-aligned in subtle cards. AI agent responses left-aligned with agent avatar + name badge (e.g. "DevOps Agent"). Support for code blocks, structured JSON events, file previews, and "Apply to IDE" buttons.

- Bottom: Large multi-line prompt input with:
  - Placeholder "Describe your product idea or paste a PRD..."
  - Attachment button (docs, GitHub repo)
  - Model selector (GPT-5, Claude Opus, Gemini…)
  - "Send" + keyboard shortcut hint
  - Small tags that appear when detected: "github-connected" "cloud-enabled" "auto-scale"

Top bar: Project name, "Open IDE", "Deploy", agent activity pulse.

Include states: empty (suggested prompts), streaming response, multi-agent collaboration view (agents discussing in threaded cards), and error/retry.

Style must feel intelligent and collaborative, not generic chat.

Style: Apple × Linear × OpenAI × Vercel. Primary #7C3AED, accent #2563EB, borders #27272A, Inter/Geist.
