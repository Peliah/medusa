"use client"

import Link from "next/link"
import * as React from "react"

import { GITHUB_README_URL, SCHEMA_CHIPS } from "@/components/landing/constants"
import { ScrollReveal } from "@/components/landing/scroll-reveal"
import { SectionDivider } from "@/components/landing/section-divider"
import { cn } from "@/lib/utils"

const tabs = [
  { id: "templates", label: "with Templates" },
  { id: "schemas", label: "explore Schemas" },
  { id: "docs", label: "read the Docs" },
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
    active === "schemas" ? (
      <div className="mt-10 flex flex-wrap items-center gap-3">
        {SCHEMA_CHIPS.map((schema) => (
          <span
            key={schema.id}
            className="rounded-4xl border border-border px-3 py-1.5 text-xs"
          >
            {schema.label}
          </span>
        ))}
        <Link
          href="/builder"
          className="text-sm text-primary transition-colors hover:text-primary/80"
        >
          Open the query builder
        </Link>
      </div>
    ) : active === "docs" ? (
      <div className="landing-resource-card mt-10 max-w-2xl p-6">
        <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
          Documentation
        </p>
        <h3 className="mt-3 font-heading text-xl font-medium">
          Project README on GitHub
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Architecture, local setup, testing, and deployment notes live in the
          repository README.
        </p>
        <a
          href={GITHUB_README_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-sm text-primary transition-colors hover:text-primary/80"
        >
          Read the README on GitHub
        </a>
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
                <a
                  href={GITHUB_README_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Read the guide on GitHub
                </a>
              </div>
              <div className="landing-resource-card">
                <p className="text-sm text-muted-foreground">
                  Three fictional datasets power the demo — intelligence
                  operatives, global cities, and system incidents. Each schema
                  drives its own operators, inputs, and mock records.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SCHEMA_CHIPS.map((schema) => (
                    <span
                      key={schema.id}
                      className="rounded-4xl border border-border px-3 py-1 text-xs"
                    >
                      {schema.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/builder"
              className="mt-8 inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Open the query builder
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
