"use client"

import { Switch } from "@/components/ui/switch"
import type { ValueInputProps } from "@/components/inputs/types"
import { cn } from "@/lib/utils"

export function BooleanToggle({ value, onChange, className }: ValueInputProps) {
  const checked = value === true

  return (
    <div className={cn("flex h-8 flex-1 items-center gap-2", className)}>
      <Switch
        checked={checked}
        onCheckedChange={(next) => onChange(next)}
        aria-label="Boolean value"
      />
      <span className="text-xs text-muted-foreground">
        {checked ? "true" : "false"}
      </span>
    </div>
  )
}
