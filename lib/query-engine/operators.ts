import type { FieldType, OperatorValue } from "@/lib/query-engine/types"

export const operatorLabels: Record<OperatorValue, string> = {
  eq: "Equals",
  neq: "Not equals",
  contains: "Contains",
  gt: "Greater than",
  lt: "Less than",
  gte: "Greater or equal",
  lte: "Less or equal",
  is_null: "Is null",
  is_not_null: "Is not null",
  regex: "Matches regex",
  between: "Between",
  is_today: "Is today",
  is_this_week: "Is this week",
  is_this_month: "Is this month",
  in: "In",
  not_in: "Not in",
}

const VALUELESS_OPERATORS = new Set<OperatorValue>([
  "is_null",
  "is_not_null",
  "is_today",
  "is_this_week",
  "is_this_month",
])

const operatorsByType: Record<FieldType, OperatorValue[]> = {
  string: ["eq", "neq", "contains", "regex", "is_null", "is_not_null"],
  number: [
    "eq",
    "neq",
    "gt",
    "lt",
    "gte",
    "lte",
    "between",
    "is_null",
    "is_not_null",
  ],
  enum: ["eq", "neq", "in", "not_in", "is_null", "is_not_null"],
  boolean: ["eq", "is_null", "is_not_null"],
  date: [
    "eq",
    "neq",
    "gt",
    "lt",
    "between",
    "is_today",
    "is_this_week",
    "is_this_month",
    "is_null",
    "is_not_null",
  ],
  array: ["contains", "in", "not_in", "is_null", "is_not_null"],
}

export function getOperatorsForType(type: FieldType): OperatorValue[] {
  return operatorsByType[type]
}

export function operatorNeedsValue(operator: OperatorValue | null): boolean {
  if (!operator) return false
  return !VALUELESS_OPERATORS.has(operator)
}
