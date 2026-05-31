import type { Group } from "@/lib/query-engine/types"

const depthColors = [
  "var(--primary)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--destructive)",
] as const

export function getDepthColor(depth: number): string {
  return depthColors[Math.min(depth, depthColors.length - 1)]
}

const GROUP_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export function getGroupLabel(index: number): string {
  return `Group ${GROUP_LETTERS[index % 26]}`
}

export function countVisibleConditions(group: Group): number {
  return group.conditions.length
}
