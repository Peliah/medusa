"use client"

import * as React from "react"

import type { LogicOperator } from "@/lib/query-engine/types"
import { cn } from "@/lib/utils"

interface LogicToggleProps {
  value: LogicOperator
  onChange: (logic: LogicOperator) => void
}

export function LogicToggle({ value, onChange }: LogicToggleProps) {
  return (
    <div
      className="inline-flex rounded-4xl border border-border bg-muted/60 p-0.5"
      role="radiogroup"
      aria-label="Group logic"
    >
      {(["AND", "OR"] as const).map((logic) => (
        <button
          key={logic}
          type="button"
          role="radio"
          aria-checked={value === logic}
          onClick={() => onChange(logic)}
          className={cn(
            "rounded-4xl px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-colors",
            value === logic
              ? logic === "AND"
                ? "bg-primary text-primary-foreground"
                : "bg-chart-2 text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {logic}
        </button>
      ))}
    </div>
  )
}
