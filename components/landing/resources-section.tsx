"use client"

import Link from "next/link"
import * as React from "react"

import { QueryDemo } from "@/components/landing/query-demo"
import { ScrollReveal } from "@/components/landing/scroll-reveal"
import { SectionDivider } from "@/components/landing/section-divider"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "templates", label: "with Templates" },
  { id: "schemas", label: "explore Schemas" },
  { id: "demo", label: "try the Demo" },
  { id: "docs", label: "read the Docs" },
  { id: "export", label: "export Queries" },
] as const

type TabId = (typeof tabs)[number]["id"]

const templateCards = [
  {
    tag: "Agents filter",
    title: "Active operatives with high clearance",
    description: "LEVEL_5 agents with 10+ completed missions.",
  },
  {
    tag: "Cities filter",
    title: "Capital cities over 1M population",
    description: "Urban analytics for major metropolitan areas.",
  },
  {
    tag: "Incidents filter",
    title: "Open critical severity events",
    description: "Unresolved incidents requiring immediate attention.",
  },
]

export function ResourcesSection() {
  const [active, setActive] = React.useState<TabId>("templates")

  const tabContent =
    active === "demo" ? (
      <div className="mt-10">
        <QueryDemo embedded />
      </div>
    ) : (
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {templateCards.map((card, i) => (
          <ScrollReveal key={card.title} delay={i * 80}>
            <article className="landing-resource-card h-full">
              <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                {card.tag}
              </p>
              <h3 className="mt-3 font-heading text-lg font-medium">
                {card.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {card.description}
              </p>
            </article>
          </ScrollReveal>
        ))}
      </div>
    )

  return (
    <>
      <SectionDivider />
      <section id="resources" className="landing-section scroll-mt-20">
        <div className="landing-container">
          <ScrollReveal>
            <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              Build your first query
            </h2>
            <div className="mt-6 flex flex-wrap gap-x-1 gap-y-2 text-sm text-muted-foreground">
              {tabs.map((tab, i) => (
                <React.Fragment key={tab.id}>
                  {i > 0 && <span className="text-border">|</span>}
                  <button
                    type="button"
                    onClick={() => setActive(tab.id)}
                    className={cn(
                      "transition-colors hover:text-foreground",
                      active === tab.id && "text-foreground"
                    )}
                  >
                    {tab.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </ScrollReveal>

          {tabContent}

          <ScrollReveal delay={200}>
            <div className="mt-10 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
              <div className="landing-resource-card flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
                    Principles
                  </p>
                  <h3 className="mt-3 font-heading text-xl font-medium">
                    Building Visual Query Trees
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Recursive groups, schema-driven inputs, and pure query
                    engines — the architecture behind MEDUSA.
                  </p>
                </div>
                <p className="mt-6 text-xs text-muted-foreground">
                  Read the guide →
                </p>
              </div>
              <div className="landing-resource-card">
                <p className="text-sm text-muted-foreground">
                  Three fictional datasets power the demo — intelligence
                  operatives, global cities, and system incidents. Each schema
                  drives its own operators, inputs, and mock records.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["🛸 Agents", "🌆 Cities", "⚡ Incidents"].map((s) => (
                    <span
                      key={s}
                      className="rounded-4xl border border-border px-3 py-1 text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/builder"
              className="mt-8 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Open the query builder →
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
