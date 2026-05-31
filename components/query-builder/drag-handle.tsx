"use client"

import { DotsSixVerticalIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

interface DragHandleProps {
  label?: string
  className?: string
  handleRef?: (element: Element | null) => void
}

export function DragHandle({
  label = "Drag to reorder",
  className,
  handleRef,
}: DragHandleProps) {
  return (
    <button
      type="button"
      ref={handleRef}
      aria-label={label}
      className={cn(
        "flex size-7 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover/row:opacity-100 group-hover/toolbar:opacity-100 active:cursor-grabbing",
        className
      )}
    >
      <DotsSixVerticalIcon className="size-3.5" />
    </button>
  )
}
