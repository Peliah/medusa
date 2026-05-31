import {
  countGroups,
  countRules,
  getMaxDepth,
} from "@/lib/query-engine/tree-utils"
import type { Group } from "@/lib/query-engine/types"

export type ComplexityLevel = "low" | "medium" | "high" | "extreme"

export interface ComplexityResult {
  score: number
  level: ComplexityLevel
  label: string
}

function getLevel(score: number): ComplexityLevel {
  if (score >= 18) return "extreme"
  if (score >= 11) return "high"
  if (score >= 5) return "medium"
  return "low"
}

function getLabel(level: ComplexityLevel): string {
  switch (level) {
    case "low":
      return "Simple"
    case "medium":
      return "Moderate"
    case "high":
      return "Complex"
    case "extreme":
      return "Very complex"
  }
}

export function calculateComplexity(tree: Group): ComplexityResult {
  const rules = countRules(tree)
  const groups = countGroups(tree)
  const depth = getMaxDepth(tree)
  const score = rules + groups * 2 + depth * 3

  const level = rules === 0 ? "low" : getLevel(score)

  return {
    score,
    level,
    label: rules === 0 ? "Empty" : getLabel(level),
  }
}

export function getComplexityDotClass(level: ComplexityLevel): string {
  switch (level) {
    case "low":
      return "bg-emerald-500"
    case "medium":
      return "bg-amber-500"
    case "high":
      return "bg-orange-500"
    case "extreme":
      return "bg-destructive"
  }
}

/** Maps complexity score to 1–5 filled dots (§7.13). Returns 0 when empty. */
export function getComplexityDotCount(
  score: number,
  ruleCount: number
): number {
  if (ruleCount === 0) return 0
  if (score <= 2) return 1
  if (score <= 5) return 2
  if (score <= 10) return 3
  if (score <= 17) return 4
  return 5
}
