"use client"

import { cn } from "@/lib/utils"
import type { Schema } from "@/lib/query-engine/types"

interface SchemaCardProps {
  schema: Schema
  active: boolean
  onSelect: () => void
}

export function SchemaCard({ schema, active, onSelect }: SchemaCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
        active
          ? "border-primary bg-primary/10"
          : "border-border bg-background hover:bg-muted/50"
      )}
    >
      <div className="flex items-center gap-2">
        <span>{schema.emoji}</span>
        <span className="text-sm font-medium">{schema.name}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {schema.recordCount} records · {schema.fields.length} fields
      </p>
    </button>
  )
}
