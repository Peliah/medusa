"use client"

import {
  calculateComplexity,
  getComplexityDotClass,
} from "@/lib/query-engine/complexity"
import type { Group } from "@/lib/query-engine/types"
import { cn } from "@/lib/utils"

interface ComplexityBannerProps {
  tree: Group
}

export function ComplexityBanner({ tree }: ComplexityBannerProps) {
  const { score, level, label } = calculateComplexity(tree)

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs">
      <span
        className={cn(
          "size-2 shrink-0 rounded-full",
          getComplexityDotClass(level)
        )}
        aria-hidden
      />
      <span className="font-medium">{label}</span>
      <span className="text-muted-foreground">· score {score}</span>
    </div>
  )
}
