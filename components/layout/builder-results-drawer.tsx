"use client"

import { CaretUpIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"

export function BuilderResultsDrawer() {
  const resultsOpen = useUIStore((state) => state.resultsOpen)
  const toggleResults = useUIStore((state) => state.toggleResults)

  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden border-t border-border bg-card transition-[height] duration-300 ease-out",
        resultsOpen ? "h-[clamp(200px,35vh,400px)]" : "h-10"
      )}
    >
      <button
        type="button"
        onClick={toggleResults}
        className="flex h-10 w-full items-center justify-between px-4 text-sm"
      >
        <span className="text-muted-foreground">
          Results ·{" "}
          <span className="text-foreground">Run a query to see matches</span>
        </span>
        <CaretUpIcon
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            resultsOpen && "rotate-180"
          )}
        />
      </button>

      {resultsOpen && (
        <div className="flex h-[calc(100%-2.5rem)] min-h-0 flex-col items-center justify-center gap-3 overflow-y-auto px-4 pb-4">
          <p className="text-sm text-muted-foreground">
            Execution simulator coming soon. Build your query tree above, then
            run it here.
          </p>
          <Button variant="outline" size="sm" onClick={toggleResults}>
            Collapse
          </Button>
        </div>
      )}
    </div>
  )
}
