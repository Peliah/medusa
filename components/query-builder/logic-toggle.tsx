"use client"

import { LayoutGroup, motion } from "framer-motion"

import type { LogicOperator } from "@/lib/query-engine/types"
import { cn } from "@/lib/utils"

interface LogicToggleProps {
  groupId: string
  value: LogicOperator
  onChange: (logic: LogicOperator) => void
}

export function LogicToggle({ groupId, value, onChange }: LogicToggleProps) {
  return (
    <LayoutGroup id={groupId}>
      <div
        className="relative inline-flex rounded-4xl border border-border bg-muted/60 p-0.5"
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
              "relative z-10 rounded-4xl px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-colors",
              value === logic
                ? logic === "AND"
                  ? "text-primary-foreground"
                  : "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {value === logic ? (
              <motion.span
                layoutId={`logic-toggle-${groupId}`}
                className={cn(
                  "absolute inset-0 rounded-4xl",
                  logic === "AND" ? "bg-primary" : "bg-chart-2"
                )}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            ) : null}
            <span className="relative">{logic}</span>
          </button>
        ))}
      </div>
    </LayoutGroup>
  )
}
