"use client"

import { BookmarkSimpleIcon, TrashIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SavedPreset } from "@/store/history-store"

interface PresetItemProps {
  preset: SavedPreset
  onLoad: () => void
  onDelete: () => void
}

export function PresetItem({ preset, onLoad, onDelete }: PresetItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1.5"
      )}
    >
      <button
        type="button"
        onClick={onLoad}
        className="flex min-w-0 flex-1 items-center gap-2 text-left"
      >
        <BookmarkSimpleIcon className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate text-sm">{preset.name}</span>
      </button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={`Delete preset ${preset.name}`}
        onClick={onDelete}
      >
        <TrashIcon className="size-3.5" />
      </Button>
    </div>
  )
}
