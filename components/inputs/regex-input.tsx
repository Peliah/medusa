"use client"

import { Input } from "@/components/ui/input"
import type { ValueInputProps } from "@/components/inputs/types"
import { cn } from "@/lib/utils"

export function RegexInput({
  value,
  onChange,
  invalid = false,
  className,
}: ValueInputProps) {
  return (
    <Input
      type="text"
      value={typeof value === "string" ? value : ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Regex pattern…"
      className={cn(
        "h-8 flex-1 font-mono text-xs",
        invalid && "border-destructive aria-invalid:border-destructive",
        className
      )}
      aria-label="Regex pattern"
      aria-invalid={invalid}
      spellCheck={false}
    />
  )
}
