"use client"

import type { ReactNode } from "react"
import { DragDropProvider } from "@dnd-kit/react"
import { isSortable } from "@dnd-kit/react/sortable"

import { useQueryStore } from "@/store/query-store"

interface QueryBuilderDndProviderProps {
  children: ReactNode
}

export function QueryBuilderDndProvider({
  children,
}: QueryBuilderDndProviderProps) {
  const reorderCondition = useQueryStore((state) => state.reorderCondition)
  const moveCondition = useQueryStore((state) => state.moveCondition)

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return

        const { source } = event.operation
        if (!source || !isSortable(source)) return

        const { initialIndex, index, initialGroup, group } = source
        if (group == null || initialGroup == null) return
        if (initialIndex === index && initialGroup === group) return

        if (initialGroup === group) {
          reorderCondition(String(group), initialIndex, index)
          return
        }

        moveCondition(String(source.id), String(group), index)
      }}
    >
      {children}
    </DragDropProvider>
  )
}
