"use client"

import { Spinner } from "@/components/ui/spinner"

export function ResultsLoading() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 py-4">
      <Spinner className="size-4 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">Running query…</p>
    </div>
  )
}
