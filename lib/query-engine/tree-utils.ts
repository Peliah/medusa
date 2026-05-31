import type { Condition, Group, Rule } from "@/lib/query-engine/types"

export function isGroup(condition: Condition): condition is Group {
  return condition.type === "group"
}

export function isRule(condition: Condition): condition is Rule {
  return condition.type === "rule"
}

export function findGroup(root: Group, groupId: string): Group | null {
  if (root.id === groupId) return root

  for (const condition of root.conditions) {
    if (isGroup(condition)) {
      const found = findGroup(condition, groupId)
      if (found) return found
    }
  }

  return null
}

export function findParentGroup(
  root: Group,
  conditionId: string
): Group | null {
  for (const condition of root.conditions) {
    if (condition.id === conditionId) return root

    if (isGroup(condition)) {
      const found = findParentGroup(condition, conditionId)
      if (found) return found
    }
  }

  return null
}

export function countRules(group: Group): number {
  return group.conditions.reduce((total, condition) => {
    if (isRule(condition)) return total + 1
    return total + countRules(condition)
  }, 0)
}

export function countGroups(group: Group): number {
  return group.conditions.reduce((total, condition) => {
    if (isGroup(condition)) return total + 1 + countGroups(condition)
    return total
  }, 0)
}

export function getMaxDepth(group: Group, depth = 0): number {
  if (group.conditions.length === 0) return depth

  return Math.max(
    ...group.conditions.map((condition) =>
      isGroup(condition) ? getMaxDepth(condition, depth + 1) : depth
    )
  )
}
