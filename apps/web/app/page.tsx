import { Features } from "@/components/marketing/features"
import { FinalCta } from "@/components/marketing/final-cta"
import { Hero } from "@/components/marketing/hero"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { OrchestrationHighlight } from "@/components/marketing/orchestration-highlight"
import { Pricing } from "@/components/marketing/pricing"
import { SiteHeader } from "@/components/marketing/site-header"

export default function HomePage() {
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
