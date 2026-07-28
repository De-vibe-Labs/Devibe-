import { Features } from "@/components/marketing/features"
import { FinalCta } from "@/components/marketing/final-cta"
import { Hero } from "@/components/marketing/hero"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { OrchestrationHighlight } from "@/components/marketing/orchestration-highlight"
import { Pricing } from "@/components/marketing/pricing"
import { SiteHeader } from "@/components/marketing/site-header"
import { useDocumentMeta } from "@/lib/use-document-meta"

export function HomePage() {
  useDocumentMeta(
    "DeVibe",
    "Describe what you want, and an agent swarm plans, builds, tests and deploys it across every major cloud.",
  )

  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <Features />
        <HowItWorks />
        <OrchestrationHighlight />
        <Pricing />
        <FinalCta />
      </main>
    </>
  )
}
