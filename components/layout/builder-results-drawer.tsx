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

  const rowLabel = isLoading
    ? "Running…"
    : hasResults
      ? `${matchCount} row${matchCount === 1 ? "" : "s"}`
      : "Run a query"

  return (
    <div
      className={cn(
        "shrink-0 overflow-hidden border-t border-border bg-card transition-[height] duration-300 ease-out",
        resultsOpen ? "h-[clamp(11rem,30vh,22rem)]" : "h-9"
      )}
    >
      <button
        type="button"
        onClick={toggleResults}
        className="flex h-9 w-full items-center justify-between gap-2 px-[var(--builder-pad-x)] text-xs"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="builder-section-label">Results</span>
          <span className="truncate text-muted-foreground">· {rowLabel}</span>
          {isLoading ? <Spinner className="size-3 shrink-0" /> : null}
        </span>
        <CaretUpIcon
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform",
            resultsOpen && "rotate-180"
          )}
        />
      </button>

      {resultsOpen ? (
        <div className="h-[calc(100%-2.25rem)] min-h-0">
          <ResultsDrawerContent />
        </div>
      ) : null}
    </div>
  )
}
