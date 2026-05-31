"use client"

interface ResultsEmptyProps {
  hasRun: boolean
}

export function ResultsEmpty({ hasRun }: ResultsEmptyProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
      <p className="text-sm font-medium text-foreground">
        {hasRun ? "No matches found" : "No results yet"}
      </p>
      <p className="max-w-sm text-xs text-muted-foreground">
        {hasRun
          ? "Try adjusting your conditions or operators to broaden the filter."
          : "Build a valid query above, then run it to see matching records here."}
      </p>
    </div>
  )
}
