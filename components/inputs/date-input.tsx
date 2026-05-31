"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarBlankIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import type { ValueInputProps } from "@/components/inputs/types"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { parseIsoDate, toIsoDateString } from "@/lib/query-engine/value-utils"
import { cn } from "@/lib/utils"

export function DateInput({
  value,
  onChange,
  invalid = false,
  className,
}: ValueInputProps) {
  const [open, setOpen] = React.useState(false)
  const isoValue = typeof value === "string" ? value : null
  const selected = isoValue ? parseIsoDate(isoValue) : undefined

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-invalid={invalid}
          className={cn(
            "h-8 flex-1 justify-start gap-2 px-2.5 text-xs font-normal",
            invalid && "border-destructive aria-invalid:border-destructive",
            !isoValue && "text-muted-foreground",
            className
          )}
        >
          <CalendarBlankIcon className="size-3.5 shrink-0 opacity-60" />
          {selected ? format(selected, "PP") : "Pick date…"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            onChange(date ? toIsoDateString(date) : null)
            setOpen(false)
          }}
          defaultMonth={selected}
        />
      </PopoverContent>
    </Popover>
  )
}
