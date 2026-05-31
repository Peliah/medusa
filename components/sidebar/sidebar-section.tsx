"use client"

import * as React from "react"
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react"

import { cn } from "@/lib/utils"

interface SidebarSectionProps {
  title: React.ReactNode
  defaultOpen?: boolean
  children: React.ReactNode
  className?: string
}

export function SidebarSection({
  title,
  defaultOpen = true,
  children,
  className,
}: SidebarSectionProps) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <section
      className={cn("border-b border-border last:border-b-0", className)}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-xs font-semibold tracking-[0.08em] uppercase transition-colors hover:bg-muted/50"
      >
        <span className="flex min-w-0 items-center gap-1">{title}</span>
        {open ? (
          <CaretUpIcon className="size-3.5 shrink-0 text-muted-foreground" />
        ) : (
          <CaretDownIcon className="size-3.5 shrink-0 text-muted-foreground" />
        )}
      </button>
      {open ? <div className="px-3 pb-3">{children}</div> : null}
    </section>
  )
}
