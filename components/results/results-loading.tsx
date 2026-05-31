"use client"

import { Spinner } from "@/components/ui/spinner"

export function ResultsLoading() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <Spinner className="size-5 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">Running query…</p>
    </div>
  )
}
