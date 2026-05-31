"use client"

import { Input } from "@/components/ui/input"
import type { ValueInputProps } from "@/components/inputs/types"
import {
  createEmptyNumberRange,
  isNumberRange,
} from "@/lib/query-engine/value-utils"
import { cn } from "@/lib/utils"

export function NumberRangeInput({
  value,
  onChange,
  invalid = false,
  className,
}: ValueInputProps) {
  const range = isNumberRange(value) ? value : createEmptyNumberRange()

  return (
    <div
      className={cn("flex min-w-0 flex-1 items-center gap-1.5", className)}
      aria-label="Number range"
    >
      <Input
        type="number"
        value={range.min ?? ""}
        onChange={(event) => {
          const raw = event.target.value
          onChange({
            ...range,
            min: raw === "" ? null : Number(raw),
          })
        }}
        placeholder="Min"
        className={cn(
          "h-8 w-20 text-xs",
          invalid && "border-destructive aria-invalid:border-destructive"
        )}
        aria-label="Minimum value"
        aria-invalid={invalid}
      />
      <span className="shrink-0 text-xs text-muted-foreground">to</span>
      <Input
        type="number"
        value={range.max ?? ""}
        onChange={(event) => {
          const raw = event.target.value
          onChange({
            ...range,
            max: raw === "" ? null : Number(raw),
          })
        }}
        placeholder="Max"
        className={cn(
          "h-8 w-20 text-xs",
          invalid && "border-destructive aria-invalid:border-destructive"
        )}
        aria-label="Maximum value"
        aria-invalid={invalid}
      />
    </div>
  )
}
