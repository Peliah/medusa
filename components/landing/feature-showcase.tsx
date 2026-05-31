"use client"

import { ArrowRightIcon } from "@phosphor-icons/react"
import * as React from "react"

import { ScrollReveal } from "@/components/landing/scroll-reveal"
import { SectionDivider } from "@/components/landing/section-divider"
import { cn } from "@/lib/utils"

export function FeatureLink({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button type="button" className="landing-feature-link group w-full" onClick={onClick}>
      <span>{children}</span>
      <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
    </button>
  )
}

export function FeatureShowcase({
  eyebrow,
  title,
  subtitle,
  subheading,
  links,
  secondaryHeading,
  illustration,
  reversed = false,
}: {
  eyebrow: string
  title: string
  subtitle: string
  subheading: string
  links: string[]
  secondaryHeading?: string
  illustration: React.ReactNode
  reversed?: boolean
}) {
  return (
    <>
      <SectionDivider />
      <section className="landing-section">
        <div className="landing-container">
          <div
            className={cn(
              "grid items-center gap-12 lg:grid-cols-2 lg:gap-16",
              reversed && "lg:[&>*:first-child]:order-2"
            )}
          >
            <ScrollReveal>
              <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                {eyebrow}
              </p>
              <h2 className="mt-3 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
                {title}
              </h2>
              <p className="mt-4 max-w-lg text-muted-foreground">{subtitle}</p>

              <p className="mt-8 text-sm font-medium text-foreground">
                {subheading}
              </p>
              <div className="mt-2">
                {links.map((link) => (
                  <FeatureLink key={link}>{link}</FeatureLink>
                ))}
              </div>

              {secondaryHeading && (
                <p className="mt-8 text-sm font-medium text-foreground">
                  {secondaryHeading}
                </p>
              )}
            </ScrollReveal>

            <ScrollReveal delay={120}>{illustration}</ScrollReveal>
          </div>
        </div>
      </section>
    </>
  )
}
