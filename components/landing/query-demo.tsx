"use client"

import * as React from "react"
import {
  BracketsCurlyIcon,
  CodeIcon,
  DatabaseIcon,
  PlusIcon,
} from "@phosphor-icons/react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

type SchemaId = "agents" | "cities" | "incidents"

const schemas: {
  id: SchemaId
  label: string
  emoji: string
  rules: { field: string; op: string; value: string }[]
  sql: string
  mongo: string
  graphql: string
}[] = [
  {
    id: "agents",
    label: "Agents",
    emoji: "🛸",
    rules: [
      { field: "clearanceLevel", op: "equals", value: "LEVEL_5" },
      { field: "missionsCompleted", op: "greater than", value: "10" },
    ],
    sql: `SELECT *\nFROM agents\nWHERE clearanceLevel = 'LEVEL_5'\n  AND missionsCompleted > 10`,
    mongo: `{\n  "clearanceLevel": { "$eq": "LEVEL_5" },\n  "missionsCompleted": { "$gt": 10 }\n}`,
    graphql: `query FilterAgents {\n  agents(where: {\n    clearanceLevel: { _eq: "LEVEL_5" }\n    missionsCompleted: { _gt: 10 }\n  }) { codename }\n}`,
  },
  {
    id: "cities",
    label: "Cities",
    emoji: "🌆",
    rules: [
      { field: "population", op: "greater than", value: "1000000" },
      { field: "isCapital", op: "equals", value: "true" },
    ],
    sql: `SELECT *\nFROM cities\nWHERE population > 1000000\n  AND isCapital = TRUE`,
    mongo: `{\n  "population": { "$gt": 1000000 },\n  "isCapital": true\n}`,
    graphql: `query FilterCities {\n  cities(where: {\n    population: { _gt: 1000000 }\n    isCapital: { _eq: true }\n  }) { name }\n}`,
  },
  {
    id: "incidents",
    label: "Incidents",
    emoji: "⚡",
    rules: [
      { field: "severity", op: "equals", value: "critical" },
      { field: "status", op: "equals", value: "open" },
    ],
    sql: `SELECT *\nFROM incidents\nWHERE severity = 'critical'\n  AND status = 'open'`,
    mongo: `{\n  "severity": { "$eq": "critical" },\n  "status": { "$eq": "open" }\n}`,
    graphql: `query FilterIncidents {\n  incidents(where: {\n    severity: { _eq: "critical" }\n    status: { _eq: "open" }\n  }) { title }\n}`,
  },
]

export function QueryDemo({ embedded = false }: { embedded?: boolean }) {
  const { ref, inView } = useInView<HTMLElement>()
  const [activeSchema, setActiveSchema] = React.useState<SchemaId>("agents")
  const [format, setFormat] = React.useState<"sql" | "mongo" | "graphql">("sql")
  const [pulse, setPulse] = React.useState(false)

  const schema = schemas.find((s) => s.id === activeSchema) ?? schemas[0]

  React.useEffect(() => {
    if (!inView && !embedded) return
    const id = window.setInterval(() => {
      setActiveSchema((current) => {
        const idx = schemas.findIndex((s) => s.id === current)
        return schemas[(idx + 1) % schemas.length].id
      })
      setPulse(true)
      window.setTimeout(() => setPulse(false), 400)
    }, 4500)
    return () => window.clearInterval(id)
  }, [inView, embedded])

  function selectSchema(id: SchemaId) {
    setActiveSchema(id)
    setPulse(true)
    window.setTimeout(() => setPulse(false), 400)
  }

  const preview =
    format === "sql"
      ? schema.sql
      : format === "mongo"
        ? schema.mongo
        : schema.graphql

  const demoCard = (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card transition-all duration-700",
        !embedded &&
          (inView ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0")
      )}
    >
      <div className="flex flex-col border-b border-border bg-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex flex-wrap gap-2">
          {schemas.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => selectSchema(s.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-4xl border px-3 py-1.5 text-sm transition-all",
                activeSchema === s.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              <span>{s.emoji}</span>
              {s.label}
            </button>
          ))}
        </div>
        <Badge variant="outline" className="mt-2 w-fit sm:mt-0">
          {schema.rules.length} conditions · AND
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className="border-b border-border p-4 sm:p-5 lg:border-r lg:border-b-0">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Query builder
            </span>
            <span className="rounded-4xl bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
              AND
            </span>
          </div>

          <div
            className={cn(
              "space-y-2 transition-opacity duration-300",
              pulse && "opacity-70"
            )}
          >
            {schema.rules.map((rule, i) => (
              <div
                key={`${schema.id}-${rule.field}`}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background p-3"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs">
                  {rule.field}
                </span>
                <span className="text-xs text-muted-foreground">{rule.op}</span>
                <span className="rounded-md border border-border px-2 py-1 font-mono text-xs text-primary">
                  {rule.value}
                </span>
              </div>
            ))}

            <button
              type="button"
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              aria-label="Add rule (demo)"
            >
              <PlusIcon className="size-3.5" />
              Add rule
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <Tabs
            value={format}
            onValueChange={(v) => setFormat(v as "sql" | "mongo" | "graphql")}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Live preview
              </span>
              <TabsList className="h-8">
                <TabsTrigger value="sql" className="gap-1 px-2.5 text-xs">
                  <DatabaseIcon className="size-3" />
                  SQL
                </TabsTrigger>
                <TabsTrigger value="mongo" className="gap-1 px-2.5 text-xs">
                  <BracketsCurlyIcon className="size-3" />
                  Mongo
                </TabsTrigger>
                <TabsTrigger value="graphql" className="gap-1 px-2.5 text-xs">
                  <CodeIcon className="size-3" />
                  GQL
                </TabsTrigger>
              </TabsList>
            </div>

            {(["sql", "mongo", "graphql"] as const).map((f) => (
              <TabsContent key={f} value={f} className="mt-0">
                <pre
                  className={cn(
                    "max-h-56 overflow-auto rounded-lg border border-border bg-foreground p-4 font-mono text-xs leading-relaxed text-background transition-opacity duration-300",
                    pulse && "opacity-80"
                  )}
                >
                  <code>{preview}</code>
                </pre>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Updates as you build ·{" "}
              <span className="text-foreground">12 matched</span> records
            </p>
            <Button size="sm" variant="secondary">
              Run query
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  if (embedded) {
    return demoCard
  }

  return (
    <section id="demo" ref={ref} className="landing-section scroll-mt-20">
      <div className="landing-container">
        <div
          className={cn(
            "mb-10 text-center transition-all duration-700",
            inView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          )}
        >
          <h2 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
            See it work in real time
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Switch schemas and watch conditions map to live query output. No
            syntax required.
          </p>
        </div>
        {demoCard}
      </div>
    </section>
  )
}
