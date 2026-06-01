export type FieldType =
  | "string"
  | "number"
  | "enum"
  | "boolean"
  | "date"
  | "array"

export type LogicOperator = "AND" | "OR"

export type SchemaId = "agents" | "cities" | "incidents"

export type OperatorValue =
  | "eq"
  | "neq"
  | "contains"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "is_null"
  | "is_not_null"
  | "regex"
  | "between"
  | "is_today"
  | "is_this_week"
  | "is_this_month"
  | "in"
  | "not_in"

export interface NumberRange {
  min: number | null
  max: number | null
}

export interface DateRange {
  start: string | null
  end: string | null
}

export type RuleValue =
  | string
  | number
  | boolean
  | null
  | string[]
  | NumberRange
  | DateRange

export interface Rule {
  id: string
  type: "rule"
  field: string | null
  operator: OperatorValue | null
  value: RuleValue
}

export interface Group {
  id: string
  type: "group"
  logic: LogicOperator
  conditions: Condition[]
  collapsed?: boolean
}

export type Condition = Rule | Group

export interface SchemaField {
  name: string
  type: FieldType
  label: string
  enumValues?: string[]
}

export interface Schema {
  id: SchemaId
  name: string
  description: string
  recordCount: number
  fields: SchemaField[]
}
