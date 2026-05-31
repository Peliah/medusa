"use client"

import type { ReactNode } from "react"
import { useSortable } from "@dnd-kit/react/sortable"

import { cn } from "@/lib/utils"

interface SortableConditionWrapperProps {
  id: string
  index: number
  groupId: string
  disabled?: boolean
  className?: string
  children: (props: {
    handleRef: (element: Element | null) => void
    isDragging: boolean
  }) => ReactNode
}

export function SortableConditionWrapper({
  id,
  index,
  groupId,
  disabled = false,
  className,
  children,
}: SortableConditionWrapperProps) {
  const { ref, handleRef, isDragging } = useSortable({
    id,
    index,
    group: groupId,
    disabled,
  })

  return (
    <div
      ref={ref}
      className={cn(
        "touch-none",
        isDragging && "relative z-10 opacity-60",
        className
      )}
    >
      {children({ handleRef, isDragging })}
    </div>
  )
}
