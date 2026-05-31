"use client"

import Link from "next/link"
import { PlayIcon } from "@phosphor-icons/react"

import { ThemeToggle } from "@/components/landing/theme-toggle"
import { Button } from "@/components/ui/button"
import { schemas } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { useQueryStore } from "@/store/query-store"
import { useUIStore } from "@/store/ui-store"

export function BuilderHeader() {
  const schemaId = useQueryStore((state) => state.schemaId)
  const setSchema = useQueryStore((state) => state.setSchema)
  const setResultsOpen = useUIStore((state) => state.setResultsOpen)

  return (
    <header className="flex h-full shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-5">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight"
        >
          MEDUSA
        </Link>

        <div className="hidden items-center rounded-4xl border border-border bg-muted/50 p-1 sm:flex">
          {schemas.map((schema) => (
            <button
              key={schema.id}
              type="button"
              onClick={() => setSchema(schema.id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-4xl px-3 py-1 text-xs transition-colors",
                schemaId === schema.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span>{schema.emoji}</span>
              {schema.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={() => setResultsOpen(true)}
          className="gap-1.5"
        >
          <PlayIcon className="size-3.5" />
          <span className="hidden sm:inline">Run query</span>
          <span className="sm:hidden">Run</span>
        </Button>
        <ThemeToggle />
      </div>
    </header>
  )
}
