export interface FigmaPrompt {
  id: string;
  title: string;
  summary: string;
  prompt: string;
}

export const FIGMA_PROMPTS: FigmaPrompt[] = [
  {
    id: "landing",
    title: "1. Landing Page (Marketing Website)",
    summary: "Full feature SaaS landing — hero, features, pricing, CTA.",
    prompt: `Design a premium dark-mode SaaS landing page for DeVibe (de-vibe.dev), an AI-native software creation platform.

Style: Apple × Linear × OpenAI × Vercel. Background #09090B, primary #7C3AED, accent #2563EB, text white/gray, Inter/Geist font. Extremely clean, minimal, high-end developer aesthetic.

Desktop 1440px width.

Structure (top to bottom):

1. Sticky navigation: Logo "DeVibe" left, links (Product, Features, Pricing, Docs, Enterprise), "Sign in" + glowing "Start building" CTA right.

2. Hero section: Large headline "Turn any idea into production-ready software with AI agents", subheadline explaining multi-agent collaboration (Product, UX, Frontend, Backend, DevOps, Security, QA). Two CTAs: primary "Start free" (violet) and secondary "Watch demo". Floating abstract AI agent network visualization or subtle particle effect on the right. Live product screenshot mock of the AI Builder chat + Monaco IDE.

3. Logo cloud: "Trusted by builders at" with subtle grayscale logos.

4. Features grid (6 cards, 3x2):
   - AI Product Agent
   - Multi-agent orchestration
   - Monaco IDE + live previews
   - One-click multi-cloud deployment
   - GitHub-native workflow
   - Long-term project memory
   Each card has icon, title, short description, and subtle hover glow.

5. How it works (horizontal 4-step process with numbered circles and connecting lines): Idea → PRD + Design → Code + Test → Deploy & Scale.

6. Deep feature section: Split layout showing the full AI Builder workspace (chat left, Monaco + dual previews right) with callouts for agent activity, cloud adapters, and MCP triggers.

7. Cloud distribution highlight: Visual diagram of Cloudflare → AWS / GCP / Azure adapters with tags "github-connected" + "cloud-enabled".

8. Pricing section: 3 clean cards (Free, Pro, Enterprise) with feature lists and CTAs.

9. Developer ecosystem + Marketplace teaser.

10. Final CTA banner + footer with links.

Include subtle grain, soft shadows, and micro-interactions notes. Make it feel intelligent and inevitable.`,
  },
  {
    id: "auth",
    title: "2. Login / Auth Screens",
    summary: "Login, signup, OAuth success, first-time welcome — 4 frames.",
    prompt: `Design a complete authentication flow for DeVibe in dark mode (#09090B background, #7C3AED primary, #2563EB accent, Inter/Geist).

Create 4 frames:

Frame 1 – Login:
Centered card (max-width 420px) with soft border. Logo top. Headline "Welcome back". Email + password fields (clean floating labels). "Continue" primary button. Divider "or". Large GitHub OAuth button (full width, dark), Google OAuth button. "Don't have an account? Sign up". Subtle security note at bottom. Background has very soft abstract gradient orbs in violet/blue.

Frame 2 – Sign up:
Similar card. Name, email, password + confirm. Same OAuth options. Checkbox for terms. Primary "Create account".

Frame 3 – OAuth success / linking:
After GitHub connect: success state showing "GitHub connected" + "Cloud credentials ready" with tags, then "Continue to workspace".

Frame 4 – Empty / first-time state after login:
Simple welcome screen: "Your first project is one prompt away" with large textarea-style prompt input and "Build with DeVibe" button.

All screens must feel premium, fast, and fully integrated with GitHub + multi-cloud from the first step. Use consistent input styles, focus rings in violet, and loading states.`,
  },
  {
    id: "chat",
    title: "3. AI Builder Workspace – Chat Prompt Interface",
    summary: "ChatGPT-style multi-agent builder with prompt composer + tags.",
    prompt: `Design the core AI Builder Workspace for DeVibe – a ChatGPT-style interface optimized for multi-agent software creation.

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

Style: Apple × Linear × OpenAI × Vercel. Primary #7C3AED, accent #2563EB, borders #27272A, Inter/Geist.`,
  },
  {
    id: "ide",
    title: "4. Monaco IDE + Dual Preview",
    summary: "File tree, Monaco editor, desktop + mobile live previews.",
    prompt: `Design the full IDE view for DeVibe with Monaco editor and live dual previews.

Desktop 1440–1600px, dark theme matching VS Code / Linear aesthetic (#09090B base, #7C3AED accents).

Layout (3-column or resizable panels):

Left panel (240px): File explorer (tree with .tsx, .ts, package.json, etc.), Git status, search.

Center (flexible): Monaco editor – full VS Code look (syntax highlighting, minimap, tabs, line numbers, AI inline suggestions in violet). Top tabs for open files. Bottom status bar with language, agent suggestions count, "Sync to GitHub".

Right panel (split vertically):
- Top: Desktop web preview (iframe-style, with device frame, URL bar, refresh, open external). Shows the live generated website.
- Bottom: Mobile preview (iPhone 15 / Pixel frame, 390px width, responsive toggle). Shows the same app on mobile with device chrome.

Top toolbar: Run, Preview, Deploy to Cloud, Share, Agent actions ("Ask Frontend Agent to fix responsive", "Scale this on Cloudflare").

Include empty state, loading skeleton while agents generate code, and a "Diff" view when agents propose changes.

Make the Monaco area look pixel-perfect and professional. Previews should feel real and interactive.`,
  },
  {
    id: "cloud",
    title: "5. Cloud Distribution & Deployment",
    summary: "Architecture diagram, distribution cards, scale policy, MCP actions.",
    prompt: `Design the Cloud Distribution & Deployment management screen for DeVibe.

Dark mode, #09090B, primary #7C3AED, accent #2563EB.

Purpose: Let users (and AI agents) see and control how the project is distributed across cloud providers.

Layout:

Top: Project name + status badges ("github-connected", "cloud-enabled", "auto-scale").

Main content:

1. Current architecture diagram (interactive visual):
   - Central "DeVibe Control Plane"
   - Connected providers as cards: Cloudflare (primary, green status), AWS, Google Cloud, Azure, with latency/region info and cost estimate.
   - Arrows showing traffic routing and adapters.

2. One-click distribution options (grid of cards):
   - "Edge-first (Cloudflare Workers + D1 + R2)" – recommended for small scale
   - "Serverless multi-cloud"
   - "Kubernetes (EKS / GKE Autopilot)"
   - "Hybrid (user’s own accounts)"

3. Scale policy selector: Cost-optimized / Performance / Balanced. Slider or segmented control.

4. Live resource list: Workers, databases, R2 buckets, functions – with usage bars and "Manage via MCP" or "Agent can scale this".

5. Action bar: "Generate IaC (Pulumi/Terraform)", "Apply changes", "Open PR on GitHub", "Promote to production".

Include a side panel showing recent agent actions (DevOps Agent scaled Cloudflare Workers, Security Agent scanned, etc.).

This screen must clearly communicate that a simple tagged PRD or MCP call is enough to manage everything.`,
  },
];
