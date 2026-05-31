"use client"

import * as React from "react"
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

interface SidebarSectionProps {
  title: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
  contentClassName?: string
}

export function SidebarSection({
  title,
  defaultOpen = true,
  open,
  onOpenChange,
  children,
  className,
  actions,
  contentClassName,
}: SidebarSectionProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  function toggleOpen() {
    const next = !isOpen
    if (isControlled) onOpenChange?.(next)
    else setInternalOpen(next)
  }

  return (
    <section
      className={cn("border-b border-border last:border-b-0", className)}
    >
      <div className="flex items-center gap-1 pr-1">
        <button
          type="button"
          onClick={toggleOpen}
          aria-expanded={isOpen}
          className="flex min-w-0 flex-1 items-center justify-between gap-2 px-3 py-2.5 text-left text-xs font-semibold tracking-[0.08em] uppercase transition-colors hover:bg-muted/50"
        >
          <span className="flex min-w-0 items-center gap-1">{title}</span>
          {isOpen ? (
            <CaretUpIcon className="size-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <CaretDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
          )}
        </button>
        {actions ? (
          <div className="flex shrink-0 items-center">{actions}</div>
        ) : null}
      </div>
      {isOpen ? (
        <div className={cn("px-3 pb-3", contentClassName)}>{children}</div>
      ) : null}
    </section>
  )
}
