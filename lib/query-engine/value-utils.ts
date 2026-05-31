import { operatorNeedsValue } from "@/lib/query-engine/operators"
import type {
  DateRange,
  NumberRange,
  OperatorValue,
  RuleValue,
  SchemaField,
} from "@/lib/query-engine/types"

export function isNumberRange(value: RuleValue): value is NumberRange {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "min" in value &&
    "max" in value
  )
}

export function isDateRange(value: RuleValue): value is DateRange {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "start" in value &&
    "end" in value
  )
}

export function isStringArray(value: RuleValue): value is string[] {
  return Array.isArray(value)
}

export function createEmptyNumberRange(): NumberRange {
  return { min: null, max: null }
}

export function createEmptyDateRange(): DateRange {
  return { start: null, end: null }
}

export function getDefaultValueForOperator(
  field: SchemaField | null,
  operator: OperatorValue | null
): RuleValue {
  if (!operator || !operatorNeedsValue(operator)) return null

  if (operator === "between") {
    if (field?.type === "number") return createEmptyNumberRange()
    if (field?.type === "date") return createEmptyDateRange()
  }

  if (operator === "in" || operator === "not_in") return []

  if (field?.type === "boolean") return false

  return null
}

export function parseIsoDate(value: string): Date | undefined {
  if (!value) return undefined
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export function toIsoDateString(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
