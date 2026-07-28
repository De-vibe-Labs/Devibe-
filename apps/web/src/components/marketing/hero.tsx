import { Link } from "react-router-dom"
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react"
import { Badge, Button } from "@/components/ui/primitives"
import { HeroWorkspaceMock } from "./hero-workspace-mock"

const logos = ["NORTHWIND", "HELIOSTAT", "ATLAS", "KERNEL", "OBSIDIAN"]

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:px-8 lg:pt-32">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 h-[520px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,58,237,0.18),transparent_65%)]"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <Badge tone="primary" className="animate-pulse-soft font-mono">
          <Sparkles className="size-3" />
          Beta: v2.4 orchestration engine is live
        </Badge>

        <h1 className="mt-6 font-display text-4xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl lg:text-7xl">
          Turn any idea into production-ready software
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
          DeVibe runs a swarm of autonomous agents — Product, UX, Frontend, Backend, DevOps, Security and QA — that
          design your architecture, write the code, and scale it across every cloud.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="w-full sm:w-auto">
            Start building free
            <ArrowRight className="size-4" />
          </Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            <PlayCircle className="size-4" />
            Watch demo
          </Button>
        </div>

        <p className="mt-4 font-mono text-xs text-muted-foreground">
          No credit card · GitHub-native · Deploys to your own cloud
        </p>
      </div>

      {/* Product mock */}
      <div className="relative mx-auto mt-16 max-w-6xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-8 -top-8 bottom-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(124,58,237,0.14),transparent_70%)]"
        />
        <HeroWorkspaceMock />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -bottom-1 h-32 bg-gradient-to-t from-background to-transparent"
        />
      </div>

      {/* Logo cloud */}
      <div className="mx-auto mt-16 max-w-4xl text-center">
        <p className="font-mono text-xs tracking-[0.22em] text-muted-foreground uppercase">
          Trusted by builders shipping at scale
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {logos.map((logo) => (
            <span
              key={logo}
              className="font-display text-sm font-semibold tracking-[0.18em] text-muted-foreground/50 transition-colors hover:text-muted-foreground"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-16 text-center">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-primary-soft transition-colors hover:text-foreground"
        >
          Explore the live product surfaces
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
