import {
  IMPORT_MAX_ARRAY_LENGTH,
  IMPORT_MAX_ID_LENGTH,
  IMPORT_MAX_STRING_LENGTH,
} from "@/lib/import/constants"
import { operatorNeedsValue } from "@/lib/query-engine/operators"
import type {
  DateRange,
  NumberRange,
  OperatorValue,
  RuleValue,
  SchemaField,
} from "@/lib/query-engine/types"

const CONTROL_CHAR_PATTERN = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/

export function sanitizeString(
  value: unknown,
  maxLength = IMPORT_MAX_STRING_LENGTH
): string | null {
  if (typeof value !== "string") return null
  const trimmed = value.trim().replace(CONTROL_CHAR_PATTERN, "")
  if (!trimmed || trimmed.length > maxLength) return null
  return trimmed
}

export function sanitizeId(value: unknown): string | null {
  return sanitizeString(value, IMPORT_MAX_ID_LENGTH)
}

function sanitizeNumber(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null
  return value
}

function sanitizeBoolean(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null
}

function sanitizeNumberRange(value: unknown): NumberRange | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null
  }
  const min = sanitizeNumber((value as NumberRange).min)
  const max = sanitizeNumber((value as NumberRange).max)
  if (min === null || max === null || min > max) return null
  return { min, max }
}

function sanitizeDateRange(value: unknown): DateRange | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null
  }
  const start = sanitizeString((value as DateRange).start, 32)
  const end = sanitizeString((value as DateRange).end, 32)
  if (!start || !end || start > end) return null
  return { start, end }
}

function sanitizeStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  if (value.length === 0 || value.length > IMPORT_MAX_ARRAY_LENGTH) return null

  const items: string[] = []
  for (const item of value) {
    const sanitized = sanitizeString(item)
    if (!sanitized) return null
    items.push(sanitized)
  }
  return items
}

function isValidRegex(pattern: string): boolean {
  try {
    new RegExp(pattern)
    return true
  } catch {
    return false
  }
}

export function sanitizeRuleValue(
  value: unknown,
  field: SchemaField,
  operator: OperatorValue
): RuleValue | null {
  if (!operatorNeedsValue(operator)) return null

  if (operator === "between") {
    if (field.type === "number") return sanitizeNumberRange(value)
    if (field.type === "date") return sanitizeDateRange(value)
    return null
  }

  if (operator === "in" || operator === "not_in") {
    const items = sanitizeStringArray(value)
    if (!items) return null
    if (field.type === "enum" && field.enumValues) {
      return items.every((item) => field.enumValues!.includes(item))
        ? items
        : null
    }
    return items
  }

  if (operator === "regex") {
    const pattern = sanitizeString(value)
    if (!pattern || !isValidRegex(pattern)) return null
    return pattern
  }

  switch (field.type) {
    case "string":
      return sanitizeString(value)
    case "number":
      return sanitizeNumber(value)
    case "boolean":
      return sanitizeBoolean(value)
    case "date":
      return sanitizeString(value, 32)
    case "enum": {
      const enumValue = sanitizeString(value)
      if (!enumValue || !field.enumValues?.includes(enumValue)) return null
      return enumValue
    }
    case "array": {
      if (operator === "contains") return sanitizeString(value)
      return sanitizeStringArray(value)
    }
    default:
      return null
  }
}

export function sanitizeRecordValue(
  value: unknown,
  field: SchemaField
): string | number | boolean | null | string[] {
  switch (field.type) {
    case "string":
    case "date":
    case "enum":
      return sanitizeString(value) ?? ""
    case "number":
      return sanitizeNumber(value) ?? 0
    case "boolean":
      return sanitizeBoolean(value) ?? false
    case "array": {
      const items = sanitizeStringArray(value)
      return items ?? []
    }
    default:
      return ""
  }
}
