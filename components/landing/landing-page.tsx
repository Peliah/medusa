import {
  ExecutionFeatureSection,
  PreviewFeatureSection,
} from "@/components/landing/feature-sections"
import { HeroSection } from "@/components/landing/hero-section"
import { LandingFooter } from "@/components/landing/landing-footer"
import { LandingHeader } from "@/components/landing/landing-header"
import { LogoMarquee } from "@/components/landing/logo-marquee"
import { ResourcesSection } from "@/components/landing/resources-section"

export function LandingPage() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <LandingHeader />
      <main>
        <HeroSection />
        <LogoMarquee />
        <div id="features">
          <PreviewFeatureSection />
          <ExecutionFeatureSection />
        </div>
        <ResourcesSection />
      </main>
      <LandingFooter />
    </div>
  )
}
