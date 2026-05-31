"use client"

import { Input } from "@/components/ui/input"
import type { ValueInputProps } from "@/components/inputs/types"
import { cn } from "@/lib/utils"

export function NumberInput({
  value,
  onChange,
  invalid = false,
  className,
}: ValueInputProps) {
  return (
    <Input
      type="number"
      value={typeof value === "number" ? value : ""}
      onChange={(event) => {
        const raw = event.target.value
        onChange(raw === "" ? null : Number(raw))
      }}
      placeholder="Number…"
      className={cn(
        "h-8 flex-1 text-xs",
        invalid && "border-destructive aria-invalid:border-destructive",
        className
      )}
      aria-label="Number value"
      aria-invalid={invalid}
    />
  )
}
