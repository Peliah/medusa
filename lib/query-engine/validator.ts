import { operatorNeedsValue } from "@/lib/query-engine/operators"
import { countRules, isGroup, isRule } from "@/lib/query-engine/tree-utils"
import type { Group, Rule, Schema } from "@/lib/query-engine/types"

export interface ValidationResult {
  valid: boolean
}

function validateRule(rule: Rule, schema: Schema): boolean {
  if (!rule.field || !rule.operator) return false

  const field = schema.fields.find((item) => item.name === rule.field)
  if (!field) return false

  if (!operatorNeedsValue(rule.operator)) return true

  if (rule.value === null || rule.value === "") return false

  if (field.type === "boolean") return typeof rule.value === "boolean"
  if (field.type === "number") return typeof rule.value === "number"

  return true
}

function validateGroup(group: Group, schema: Schema): ValidationResult {
  if (group.conditions.length === 0) {
    return { valid: false }
  }

  for (const condition of group.conditions) {
    if (isRule(condition)) {
      if (!validateRule(condition, schema)) return { valid: false }
      continue
    }

    if (isGroup(condition) && !validateGroup(condition, schema).valid) {
      return { valid: false }
    }
  }

  return { valid: true }
}

export function validateTree(tree: Group, schema: Schema): ValidationResult {
  if (countRules(tree) === 0) {
    return { valid: false }
  }

  return validateGroup(tree, schema)
}

export function isTreeRunnable(tree: Group, schema: Schema): boolean {
  return validateTree(tree, schema).valid
}
