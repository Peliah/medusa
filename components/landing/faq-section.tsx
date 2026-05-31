"use client"

import { MinusIcon, PlusIcon } from "@phosphor-icons/react"
import * as React from "react"

import { ScrollReveal } from "@/components/landing/scroll-reveal"
import { SectionDivider } from "@/components/landing/section-divider"
import { cn } from "@/lib/utils"

const faqs = [
  {
    q: "What is MEDUSA?",
    a: "MEDUSA is a visual query builder for constructing complex, nested database filters without writing raw SQL, MongoDB, or GraphQL syntax by hand.",
  },
  {
    q: "Why visual instead of raw syntax?",
    a: "Nested AND/OR logic is hard to read and easy to get wrong in text. MEDUSA makes structure visible — depth-colored groups, inline validation, and live preview across three output formats.",
  },
  {
    q: "Which query formats are supported?",
    a: "MEDUSA generates live preview output in SQL, MongoDB JSON, and GraphQL filter syntax — all from the same visual query tree.",
  },
  {
    q: "Does it connect to a real database?",
    a: "The demo uses seeded mock datasets with client-side execution. The architecture is designed to plug into real APIs later.",
  },
  {
    q: "How deep can I nest conditions?",
    a: "Unlimited nesting depth with collapsible groups, depth-colored borders, and drag-and-drop reordering within and across groups.",
  },
  {
    q: "Can I save and share queries?",
    a: "Yes — save named presets and browse query history in the builder sidebar.",
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className={cn("border-b border-border", open && "pb-4")}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-medium">{q}</span>
        {open ? (
          <MinusIcon className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <PlusIcon className="size-4 shrink-0 text-muted-foreground" />
        )}
      </button>
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="pb-1 text-sm leading-relaxed text-muted-foreground">
            {a}
          </p>
        </div>
      </div>
    </div>
  )
}

export function FaqSection() {
  return (
    <>
      <SectionDivider />
      <section id="faq" className="landing-section scroll-mt-20">
        <div className="landing-container">
          <ScrollReveal>
            <h2 className="text-center font-heading text-3xl font-medium tracking-tight">
              Frequently asked questions
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="mx-auto mt-12 max-w-2xl">
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
