import { isRuleValid } from "@/lib/query-engine/validator"
import {
  isDateRange,
  isNumberRange,
  isStringArray,
} from "@/lib/query-engine/value-utils"
import { isRule } from "@/lib/query-engine/tree-utils"
import type {
  Condition,
  Group,
  Rule,
  RuleValue,
  Schema,
  SchemaField,
} from "@/lib/query-engine/types"

export function getFieldDef(
  schema: Schema,
  fieldName: string
): SchemaField | undefined {
  return schema.fields.find((field) => field.name === fieldName)
}

export function getCompleteRules(group: Group, schema: Schema): Condition[] {
  return group.conditions
    .map((condition) => {
      if (isRule(condition)) {
        return isRuleValid(condition, schema) ? condition : null
      }

      const nested = getCompleteRules(condition, schema)
      if (nested.length === 0) return null

      return { ...condition, conditions: nested } satisfies Group
    })
    .filter((condition): condition is Condition => condition !== null)
}

export function filterCompleteGroup(
  group: Group,
  schema: Schema
): Group | null {
  const conditions = getCompleteRules(group, schema)
  if (conditions.length === 0) return null
  return { ...group, conditions }
}

export function sqlStringLiteral(value: string): string {
  return `'${value.replace(/'/g, "''")}'`
}

export function graphqlStringLiteral(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`
}

export function formatSqlValue(value: RuleValue, field?: SchemaField): string {
  if (value === null) return "NULL"
  if (typeof value === "boolean") return value ? "TRUE" : "FALSE"
  if (typeof value === "number") return String(value)
  if (typeof value === "string") {
    if (field?.type === "date") return sqlStringLiteral(value)
    return sqlStringLiteral(value)
  }
  return "NULL"
}

export function formatGraphQLValue(
  value: RuleValue,
  field?: SchemaField
): string {
  if (value === null) return "null"
  if (typeof value === "boolean") return value ? "true" : "false"
  if (typeof value === "number") return String(value)
  if (typeof value === "string") {
    if (field?.type === "enum") return graphqlStringLiteral(value)
    return graphqlStringLiteral(value)
  }
  return "null"
}

export function formatMongoValue(
  value: RuleValue,
  field?: SchemaField
): unknown {
  if (value === null) return null
  if (typeof value === "boolean") return value
  if (typeof value === "number") return value
  if (typeof value === "string") {
    if (field?.type === "date") return value
    return value
  }
  if (isStringArray(value)) return value
  if (isNumberRange(value)) return { $gte: value.min, $lte: value.max }
  if (isDateRange(value)) return { $gte: value.start, $lte: value.end }
  return null
}

export function getGraphQLQueryName(schema: Schema): string {
  return `Filter${schema.name.replace(/\s+/g, "")}`
}

export function getGraphQLSelectionField(schema: Schema): string {
  return schema.fields.find((field) => field.type === "string")?.name ?? "id"
}

export function getTableName(schema: Schema): string {
  return schema.id
}

export type RuleGenerator<T> = (rule: Rule, schema: Schema) => T | null

export type GroupGenerator<T> = (
  group: Group,
  schema: Schema,
  ruleGen: RuleGenerator<T>,
  join: (logic: Group["logic"], parts: T[]) => T
) => T | null

export function generateFromGroup<T>(
  group: Group,
  schema: Schema,
  ruleGen: RuleGenerator<T>,
  join: (logic: Group["logic"], parts: T[]) => T
): T | null {
  const filtered = filterCompleteGroup(group, schema)
  if (!filtered) return null

  const parts = filtered.conditions
    .map((condition) => {
      if (isRule(condition)) return ruleGen(condition, schema)
      return generateFromGroup(condition, schema, ruleGen, join)
    })
    .filter((part): part is T => part !== null)

  if (parts.length === 0) return null
  if (parts.length === 1) return parts[0]
  return join(filtered.logic, parts)
}
