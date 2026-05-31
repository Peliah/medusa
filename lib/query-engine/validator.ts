import {
  operatorNeedsValue,
  operatorLabels,
} from "@/lib/query-engine/operators"
import {
  isDateRange,
  isNumberRange,
  isStringArray,
} from "@/lib/query-engine/value-utils"
import { countRules, isGroup, isRule } from "@/lib/query-engine/tree-utils"
import type { Group, Rule, Schema } from "@/lib/query-engine/types"

export interface ValidationResult {
  valid: boolean
}

function isValidRegex(pattern: string): boolean {
  try {
    new RegExp(pattern)
    return true
  } catch {
    return false
  }
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

  if (rule.operator === "between") {
    if (field.type === "number") {
      if (!isNumberRange(rule.value)) {
        return `Enter a range for ${field.label}`
      }
      if (rule.value.min === null || rule.value.max === null) {
        return `Enter both bounds for ${field.label}`
      }
      if (rule.value.min > rule.value.max) {
        return "Minimum must be less than or equal to maximum"
      }
      return null
    }

    if (field.type === "date") {
      if (!isDateRange(rule.value)) {
        return `Enter a date range for ${field.label}`
      }
      if (!rule.value.start || !rule.value.end) {
        return `Select both dates for ${field.label}`
      }
      if (rule.value.start > rule.value.end) {
        return "Start date must be before end date"
      }
      return null
    }
  }

  if (rule.operator === "in" || rule.operator === "not_in") {
    if (!isStringArray(rule.value) || rule.value.length === 0) {
      return `Add at least one value for ${field.label}`
    }
    return null
  }

  if (rule.operator === "regex") {
    if (typeof rule.value !== "string" || rule.value === "") {
      return "Enter a regex pattern"
    }
    if (!isValidRegex(rule.value)) {
      return "Enter a valid regex pattern"
    }
    return null
  }

  if (rule.value === null || rule.value === "") {
    return `Enter a value for ${field.label}`
  }

  if (field.type === "boolean" && typeof rule.value !== "boolean") {
    return "Choose true or false"
  }

  if (field.type === "number" && typeof rule.value !== "number") {
    return "Enter a valid number"
  }

  if (field.type === "date" && typeof rule.value !== "string") {
    return "Select a date"
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
