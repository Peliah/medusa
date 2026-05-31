"use client"

import * as React from "react"
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

interface SidebarSectionProps {
  title: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
  contentClassName?: string
}

export function SidebarSection({
  title,
  defaultOpen = true,
  children,
  className,
  actions,
  contentClassName,
}: SidebarSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <section
      className={cn("border-b border-border last:border-b-0", className)}
    >
      <div className="flex items-center gap-1 pr-1">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center justify-between gap-2 px-3 py-2.5 text-left text-xs font-semibold tracking-[0.08em] uppercase transition-colors hover:bg-muted/50"
        >
          <span className="flex min-w-0 items-center gap-1">{title}</span>
          {open ? (
            <CaretUpIcon className="size-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <CaretDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
          )}
        </button>
        {actions ? (
          <div className="flex shrink-0 items-center">{actions}</div>
        ) : null}
      </div>
      {open ? (
        <div className={cn("px-3 pb-3", contentClassName)}>{children}</div>
      ) : null}
    </section>
  )
}
