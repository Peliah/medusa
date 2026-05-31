import {
  operatorNeedsValue,
  operatorLabels,
} from "@/lib/query-engine/operators"
import { countRules, isGroup, isRule } from "@/lib/query-engine/tree-utils"
import type { Group, Rule, Schema } from "@/lib/query-engine/types"

export interface ValidationResult {
  valid: boolean
}

export function getRuleValidationMessage(
  rule: Rule,
  schema: Schema
): string | null {
  if (!rule.field) return "Select a field"
  if (!rule.operator) return "Select an operator"

  const field = schema.fields.find((item) => item.name === rule.field)
  if (!field) return "Unknown field"

  if (!operatorNeedsValue(rule.operator)) return null

  if (rule.value === null || rule.value === "") {
    return `Enter a value for ${field.label}`
  }

  if (field.type === "boolean" && typeof rule.value !== "boolean") {
    return "Choose true or false"
  }

  if (field.type === "number" && typeof rule.value !== "number") {
    return "Enter a valid number"
  }

  return null
}

export function isRuleValid(rule: Rule, schema: Schema): boolean {
  return getRuleValidationMessage(rule, schema) === null
}

function validateRule(rule: Rule, schema: Schema): boolean {
  return isRuleValid(rule, schema)
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

export function getOperatorLabel(operator: Rule["operator"]): string {
  if (!operator) return "operator"
  return operatorLabels[operator]
}
