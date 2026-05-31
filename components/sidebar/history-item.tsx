"use client"

import { ClockCounterClockwiseIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"
import type { HistoryEntry } from "@/store/history-store"

interface HistoryItemProps {
  entry: HistoryEntry
  onRestore: () => void
}

export function HistoryItem({ entry, onRestore }: HistoryItemProps) {
  const ranAt = new Date(entry.ranAt)

  return (
    <button
      type="button"
      onClick={onRestore}
      className={cn(
        "flex w-full items-start gap-2 rounded-lg border border-border bg-background px-3 py-2 text-left transition-colors hover:bg-muted/50"
      )}
    >
      <ClockCounterClockwiseIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">
          {entry.label}
        </span>
        <span className="block text-xs text-muted-foreground">
          {ranAt.toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
      </span>
    </button>
  )
}
