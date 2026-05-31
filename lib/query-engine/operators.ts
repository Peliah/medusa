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
}

const operatorsByType: Record<FieldType, OperatorValue[]> = {
  string: ["eq", "neq", "contains", "is_null", "is_not_null"],
  number: ["eq", "neq", "gt", "lt", "gte", "lte", "is_null", "is_not_null"],
  enum: ["eq", "neq", "is_null", "is_not_null"],
  boolean: ["eq", "is_null", "is_not_null"],
  date: ["eq", "neq", "gt", "lt", "is_null", "is_not_null"],
  array: ["contains", "is_null", "is_not_null"],
}

export function getOperatorsForType(type: FieldType): OperatorValue[] {
  return operatorsByType[type]
}

export function operatorNeedsValue(operator: OperatorValue | null): boolean {
  if (!operator) return false
  return operator !== "is_null" && operator !== "is_not_null"
}
