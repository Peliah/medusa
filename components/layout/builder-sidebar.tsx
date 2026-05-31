"use client"

import { schemas } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { useQueryStore } from "@/store/query-store"

export function BuilderSidebar() {
  const schemaId = useQueryStore((state) => state.schemaId)
  const setSchema = useQueryStore((state) => state.setSchema)

  return (
    <aside className="builder-panel border-r border-border bg-card">
      <div className="builder-panel__header border-b border-border px-4 py-3">
        <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          Schemas
        </p>
      </div>
      <div className="builder-panel__body p-3">
        <div className="space-y-2">
          {schemas.map((schema) => (
            <button
              key={schema.id}
              type="button"
              onClick={() => setSchema(schema.id)}
              className={cn(
                "w-full rounded-lg border px-3 py-2.5 text-left transition-colors",
                schemaId === schema.id
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
          ))}
        </div>

        <div className="mt-4 border-t border-border pt-3">
          <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            History
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            No queries run yet. Execute a query to see history here.
          </p>
        </div>
      </div>
    </aside>
  )
}
