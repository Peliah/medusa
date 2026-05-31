"use client"

import * as React from "react"

import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

const schemas = [
  {
    id: "agents",
    emoji: "🛸",
    name: "Agents",
    description: "Covert intelligence operatives — codenames, clearance, missions.",
    records: 87,
    fields: 9,
    sample: "Ghost · LEVEL_5 · 47 missions",
  },
  {
    id: "cities",
    emoji: "🌆",
    name: "Cities",
    description: "Global urban analytics — population, GDP, crime index.",
    records: 124,
    fields: 10,
    sample: "Tokyo · 37M · Democracy",
  },
  {
    id: "incidents",
    emoji: "⚡",
    name: "Incidents",
    description: "System anomaly log — severity, status, response time.",
    records: 203,
    fields: 9,
    sample: "API timeout · critical · open",
  },
]

export function SchemasSection() {
  const { ref, inView } = useInView<HTMLElement>()
  const [active, setActive] = React.useState(0)

  React.useEffect(() => {
    if (!inView) return
    const id = window.setInterval(() => {
      setActive((a) => (a + 1) % schemas.length)
    }, 3500)
    return () => window.clearInterval(id)
  }, [inView])

  const schema = schemas[active]

  return (
    <section
      id="schemas"
      ref={ref}
      className="scroll-mt-20 border-t bg-muted/30 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div
            className={cn(
              "transition-all duration-700",
              inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            )}
          >
            <p className="text-sm font-medium text-primary">Data sources</p>
            <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Three domains. One builder.
            </h2>
            <p className="mt-3 text-muted-foreground">
              Switch between Agents, Cities, and Incidents. Each schema drives
              its own operators, inputs, and mock dataset.
            </p>

            <div className="mt-8 flex flex-col gap-2">
              {schemas.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                    active === i
                      ? "border-primary bg-card shadow-sm"
                      : "border-transparent bg-transparent hover:bg-card/80"
                  )}
                >
                  <span className="text-xl">{s.emoji}</span>
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {s.records} records · {s.fields} fields
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div
            className={cn(
              "rounded-2xl border bg-card p-6 transition-all duration-500",
              inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}
          >
            <div className="flex items-center gap-3 border-b pb-4">
              <span className="text-2xl">{schema.emoji}</span>
              <div>
                <p className="font-heading text-xl font-semibold">
                  {schema.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {schema.records} records
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {schema.description}
            </p>
            <div className="mt-6 rounded-xl bg-muted p-4">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Sample record
              </p>
              <p className="mt-2 font-mono text-sm">{schema.sample}</p>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["string", "number", "enum", "date", "boolean", "array"].map(
                (type) => (
                  <span
                    key={type}
                    className="rounded-lg border bg-background px-2 py-1 text-center font-mono text-xs text-muted-foreground"
                  >
                    {type}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
