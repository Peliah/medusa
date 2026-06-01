"use client"

import {
  calculateComplexity,
  getComplexityDotClass,
  getComplexityDotCount,
} from "@/lib/query-engine/complexity"
import { countRules } from "@/lib/query-engine/tree-utils"
import type { Group } from "@/lib/query-engine/types"
import { cn } from "@/lib/utils"

interface ComplexityIndicatorProps {
  tree: Group
}

export function ComplexityIndicator({ tree }: ComplexityIndicatorProps) {
  const ruleCount = countRules(tree)
  const { score, level, label } = calculateComplexity(tree)
  const filledDots = getComplexityDotCount(score, ruleCount)
  const dotColor = getComplexityDotClass(level)

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border px-[var(--builder-pad-x)] py-1.5">
      <span className="text-[11px] text-muted-foreground">
        {ruleCount === 0 ? "Complexity" : label}
      </span>
      <div
        className="flex items-center gap-1"
        aria-label={`Complexity ${filledDots} of 5`}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "size-1.5 rounded-full transition-colors",
              index < filledDots ? dotColor : "bg-muted"
            )}
          />
        ))}
      </div>
    </div>
  )
}
