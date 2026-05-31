import type { Group } from "@/lib/query-engine/types"

const DEPTH_TOKENS = [
  "var(--depth-0)",
  "var(--depth-1)",
  "var(--depth-2)",
  "var(--depth-3)",
  "var(--depth-4)",
] as const

export function getDepthColor(depth: number): string {
  return DEPTH_TOKENS[Math.min(depth, DEPTH_TOKENS.length - 1)]
}

const GROUP_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export function getGroupLabel(index: number): string {
  return `Group ${GROUP_LETTERS[index % 26]}`
}

export function countVisibleConditions(group: Group): number {
  return group.conditions.length
}

export function getCollapsedSummary(count: number): string {
  return `▸ collapsed · ${count} condition${count === 1 ? "" : "s"}`
}
