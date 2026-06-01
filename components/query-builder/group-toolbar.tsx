"use client"

import type { ReactNode } from "react"
import { CaretRightIcon, TrashIcon } from "@phosphor-icons/react"
import { motion } from "framer-motion"

import { DragHandle } from "@/components/query-builder/drag-handle"
import { LogicToggle } from "@/components/query-builder/logic-toggle"
import { Button } from "@/components/ui/button"
import {
  getCollapsedSummary,
  getGroupLabel,
} from "@/lib/query-engine/display-utils"
import type { LogicOperator } from "@/lib/query-engine/types"
import { cn } from "@/lib/utils"

interface GroupToolbarProps {
  groupId: string
  logic: LogicOperator
  collapsed: boolean
  isRoot: boolean
  index: number
  conditionCount: number
  focused?: boolean
  dragHandleRef?: (element: Element | null) => void
  onLogicChange: (logic: LogicOperator) => void
  onToggleCollapse: () => void
  onFocus?: () => void
  onRemove?: () => void
}

export function GroupToolbar({
  groupId,
  logic,
  collapsed,
  isRoot,
  index,
  conditionCount,
  focused = false,
  dragHandleRef,
  onLogicChange,
  onToggleCollapse,
  onFocus,
  onRemove,
}: GroupToolbarProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onFocus}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onFocus?.()
        }
      }}
      className={cn(
        "group/toolbar mb-1.5 flex flex-wrap items-center gap-1.5 rounded-sm transition-shadow outline-none",
        focused && "ring-1 ring-ring ring-offset-1 ring-offset-background"
      )}
    >
      {dragHandleRef ? (
        <DragHandle label="Drag group to reorder" handleRef={dragHandleRef} />
      ) : null}
      <LogicToggle groupId={groupId} value={logic} onChange={onLogicChange} />
      <span className="text-xs text-muted-foreground italic">
        {isRoot ? "Root group" : getGroupLabel(index)}
      </span>

      {collapsed ? (
        <span className="text-xs text-muted-foreground">
          {getCollapsedSummary(conditionCount)}
        </span>
      ) : null}

      <div className="ml-auto flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={(event) => {
            event.stopPropagation()
            onToggleCollapse()
          }}
          aria-label={collapsed ? "Expand group" : "Collapse group"}
          aria-expanded={!collapsed}
        >
          <motion.span
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className="inline-flex"
          >
            <CaretRightIcon className="size-3.5" />
          </motion.span>
        </Button>
        {!isRoot && onRemove ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={(event) => {
              event.stopPropagation()
              onRemove()
            }}
            aria-label="Remove group"
          >
            <TrashIcon className="size-3.5 text-destructive" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}

interface GroupShellProps {
  depthColor: string
  isRoot?: boolean
  className?: string
  children: ReactNode
}

export function GroupShell({
  depthColor,
  isRoot = false,
  className,
  children,
}: GroupShellProps) {
  if (isRoot) {
    return <div className={cn("min-w-0", className)}>{children}</div>
  }

  return (
    <div
      className={cn("rounded-md border py-1.5 pr-1.5 pl-2", className)}
      style={{
        borderColor: `color-mix(in oklch, ${depthColor} 20%, var(--border))`,
        background: `color-mix(in oklch, ${depthColor} 4%, transparent)`,
        borderLeftWidth: 2,
        borderLeftColor: depthColor,
      }}
    >
      {children}
    </div>
  )
}
