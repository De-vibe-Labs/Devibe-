import { MessageCircle, Terminal } from "lucide-react"
import { Button } from "@/components/ui/primitives"
import { SmartLink } from "./smart-link"

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-2.92-.88-2.92-2.79 0-.89.32-1.62.84-2.19-.08-.21-.36-1.05.08-2.18 0 0 .69-.22 2.25.84a5.6 5.6 0 0 1 1.51-.2c.51 0 1.03.07 1.51.2 1.56-1.06 2.25-.84 2.25-.84.44 1.13.16 1.97.08 2.18.52.57.84 1.3.84 2.19 0 1.92-1.15 2.59-2.93 2.79.3.26.56.76.56 1.54 0 1.11-.01 2.01-.01 2.29 0 .21.15.46.55.38A7.995 7.995 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

const footerColumns = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Orchestration", href: "#orchestration" },
      { label: "Command center", href: "/dashboard" },
    ],
  },
  {
    heading: "Surfaces",
    links: [
      { label: "AI builder", href: "/builder" },
      { label: "IDE", href: "/ide" },
      { label: "Cloud distribution", href: "/orchestration" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Privacy", href: "#" },
    ],
  },
]

export function FinalCta() {
  return (
    <>
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(124,58,237,0.2),transparent_65%)]"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-5xl">Ready to ship?</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            Join 10,000+ developers building the future of software with autonomous agents.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button variant="contrast" size="lg" className="w-full sm:w-auto">
              Create your account
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Book a demo
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-deep px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4">
            <span className="font-display text-xl font-bold text-primary-soft">DeVibe</span>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              The intelligent orchestration layer for the multi-cloud era.
            </p>
            <div className="flex gap-2">
              {[
                { icon: GithubMark, label: "GitHub" },
                { icon: Terminal, label: "Docs" },
                { icon: MessageCircle, label: "Community" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                >
                  <Icon className="size-4" />
                  <span className="sr-only">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-semibold">{column.heading}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <SmartLink
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary-soft"
                    >
                      {link.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-border pt-8 font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase md:flex-row">
          <p>© 2026 DeVibe Cloud · All systems operational</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <span>Infrastructure logs</span>
            <span>Security pulse</span>
            <span>Cost guardrails</span>
          </div>
        </div>
      </footer>
    </>
  )
}
