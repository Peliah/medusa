import Link from "next/link"

import { LANDING_SECTIONS } from "@/components/landing/constants"
import { HeroDashboardMock } from "@/components/landing/hero-dashboard-mock"
import { HeroNetworkGraphic } from "@/components/landing/hero-network-graphic"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="landing-hero-glow relative min-h-svh overflow-hidden pt-14">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <HeroNetworkGraphic />
      </div>

      <div className="landing-container relative flex min-h-[calc(100svh-3.5rem)] flex-col justify-center py-16 lg:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <Link
            href={LANDING_SECTIONS.resources}
            className="mb-8 inline-flex items-center gap-2 text-sm text-primary transition-opacity hover:opacity-80"
          >
            <span className="h-3 w-px bg-primary" aria-hidden />
            Explore schemas: Agents, Cities, Incidents
          </Link>

          <h1 className="font-heading text-4xl font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Build more{" "}
            <em className="font-heading text-muted-foreground not-italic">
              capable
            </em>{" "}
            queries
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg">
            MEDUSA is the modern TypeScript stack for constructing nested
            database filters — preview SQL, MongoDB, and GraphQL without writing
            raw syntax.
          </p>

          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" className="rounded-4xl px-7">
              <Link href="/builder">Start building</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 w-full max-w-3xl px-4">
          <HeroDashboardMock />
        </div>
      </div>
    </section>
  )
}
