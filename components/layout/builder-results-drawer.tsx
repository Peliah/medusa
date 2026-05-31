"use client"

import { CaretUpIcon } from "@phosphor-icons/react"

import { ResultsDrawerContent } from "@/components/results/results-drawer-content"
import { Spinner } from "@/components/ui/spinner"
import { useQueryExecution } from "@/hooks/use-query-execution"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui-store"

export function BuilderResultsDrawer() {
  const resultsOpen = useUIStore((state) => state.resultsOpen)
  const toggleResults = useUIStore((state) => state.toggleResults)
  const { matchCount, isLoading, hasResults } = useQueryExecution()

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
          {isLoading ? (
            <span className="inline-flex items-center gap-1.5 text-foreground">
              <Spinner className="size-3.5" />
              Running…
            </span>
          ) : hasResults ? (
            <span className="text-foreground">
              {matchCount} {matchCount === 1 ? "match" : "matches"}
            </span>
          ) : (
            <span className="text-foreground">Run a query to see matches</span>
          )}
        </span>
        <CaretUpIcon
          className={cn(
            "size-4 text-muted-foreground transition-transform",
            resultsOpen && "rotate-180"
          )}
        />
      </button>

      {resultsOpen && (
        <div className="h-[calc(100%-2.5rem)] min-h-0">
          <ResultsDrawerContent />
        </div>
      )}
    </div>
  )
}
