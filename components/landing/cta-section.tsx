"use client"

import Link from "next/link"

import { SectionDivider } from "@/components/landing/section-divider"
import { ScrollReveal } from "@/components/landing/scroll-reveal"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <>
      <SectionDivider />
      <section className="landing-section">
        <div className="landing-container">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
                Ship better queries
              </h2>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="rounded-4xl bg-foreground px-7 text-background hover:bg-foreground/90"
                >
                  <Link href="/builder">Get started</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-4xl border-border px-7"
                >
                  <Link href="#faq">Documentation</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
