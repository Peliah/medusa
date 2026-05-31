"use client"

import * as React from "react"
import { format } from "date-fns"
import type { DateRange as DayPickerRange } from "react-day-picker"
import { CalendarBlankIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import type { ValueInputProps } from "@/components/inputs/types"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  createEmptyDateRange,
  isDateRange,
  parseIsoDate,
  toIsoDateString,
} from "@/lib/query-engine/value-utils"
import { cn } from "@/lib/utils"

function toDayPickerRange(
  range: ReturnType<typeof createEmptyDateRange>
): DayPickerRange | undefined {
  const from = range.start ? parseIsoDate(range.start) : undefined
  const to = range.end ? parseIsoDate(range.end) : undefined
  if (!from && !to) return undefined
  return { from, to }
}

export function DateRangeInput({
  value,
  onChange,
  invalid = false,
  className,
}: ValueInputProps) {
  const [open, setOpen] = React.useState(false)
  const range = isDateRange(value) ? value : createEmptyDateRange()
  const selected = toDayPickerRange(range)

  const label =
    range.start && range.end
      ? `${format(parseIsoDate(range.start)!, "PP")} – ${format(parseIsoDate(range.end)!, "PP")}`
      : range.start
        ? `${format(parseIsoDate(range.start)!, "PP")} – …`
        : "Pick range…"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-invalid={invalid}
          className={cn(
            "h-8 min-w-0 flex-1 justify-start gap-2 px-2.5 text-xs font-normal",
            invalid && "border-destructive aria-invalid:border-destructive",
            !range.start && !range.end && "text-muted-foreground",
            className
          )}
        >
          <CalendarBlankIcon className="size-3.5 shrink-0 opacity-60" />
          <span className="truncate">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={(next) => {
            onChange({
              start: next?.from ? toIsoDateString(next.from) : null,
              end: next?.to ? toIsoDateString(next.to) : null,
            })
          }}
          numberOfMonths={2}
          defaultMonth={selected?.from}
        />
      </PopoverContent>
    </Popover>
  )
}
