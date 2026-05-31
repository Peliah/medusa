"use client"

import {
  BracketsCurlyIcon,
  FunnelIcon,
  GitBranchIcon,
  LightningIcon,
  TreeStructureIcon,
} from "@phosphor-icons/react"

import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: TreeStructureIcon,
    title: "Unlimited nesting",
    description:
      "Build (A AND B) OR (C AND D) with collapsible groups. Depth is visible at a glance with color-coded borders.",
  },
  {
    icon: FunnelIcon,
    title: "Schema-driven UI",
    description:
      "Field types control operators and inputs — date pickers for dates, enums as selects, tag inputs for arrays.",
  },
  {
    icon: BracketsCurlyIcon,
    title: "Tri-format preview",
    description:
      "Watch SQL, MongoDB, and GraphQL output update live as you add rules. Copy or export in one click.",
  },
  {
    icon: LightningIcon,
    title: "Instant execution",
    description:
      "Run queries against seeded mock datasets. Sort, paginate, and inspect matches without a backend.",
  },
  {
    icon: GitBranchIcon,
    title: "Undo & history",
    description:
      "Immer-powered undo/redo on every change. Replay past queries from history or load saved presets.",
  },
]

export function FeaturesSection() {
  const { ref, inView } = useInView<HTMLElement>()

  return (
    <section id="features" ref={ref} className="scroll-mt-20 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={cn(
            "mb-14 max-w-2xl transition-all duration-700",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <p className="text-sm font-medium text-primary">Features</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything you need to ship filters fast
          </h2>
          <p className="mt-3 text-muted-foreground">
            MEDUSA is built for teams who need Postman-grade query building
            without leaving the browser.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <article
              key={feature.title}
              className={cn(
                "group rounded-2xl border bg-card p-6 transition-all duration-500 hover:border-primary/40 hover:shadow-md",
                inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              )}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="size-5" weight="duotone" />
              </div>
              <h3 className="font-heading text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
