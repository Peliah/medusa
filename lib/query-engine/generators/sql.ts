import {
  formatSqlValue,
  generateFromGroup,
  getTableName,
  sqlStringLiteral,
} from "@/lib/query-engine/generators/shared"
import {
  isDateRange,
  isNumberRange,
  isStringArray,
} from "@/lib/query-engine/value-utils"
import type { Group, Rule, Schema } from "@/lib/query-engine/types"

function joinSqlConditions(logic: Group["logic"], parts: string[]): string {
  if (parts.length === 1) return parts[0]
  const joined = parts.join(`\n  ${logic} `)
  return `(${joined})`
}

function generateSqlRule(rule: Rule, schema: Schema): string | null {
  if (!rule.field || !rule.operator) return null

  const field = schema.fields.find((item) => item.name === rule.field)
  if (!field) return null

  const column = rule.field

  switch (rule.operator) {
    case "eq":
      return `${column} = ${formatSqlValue(rule.value, field)}`
    case "neq":
      return `${column} <> ${formatSqlValue(rule.value, field)}`
    case "contains":
      return `${column} LIKE ${sqlStringLiteral(`%${String(rule.value)}%`)}`
    case "gt":
      return `${column} > ${formatSqlValue(rule.value, field)}`
    case "lt":
      return `${column} < ${formatSqlValue(rule.value, field)}`
    case "gte":
      return `${column} >= ${formatSqlValue(rule.value, field)}`
    case "lte":
      return `${column} <= ${formatSqlValue(rule.value, field)}`
    case "is_null":
      return `${column} IS NULL`
    case "is_not_null":
      return `${column} IS NOT NULL`
    case "regex":
      return `${column} REGEXP ${sqlStringLiteral(String(rule.value))}`
    case "between":
      if (field.type === "number" && isNumberRange(rule.value)) {
        return `${column} BETWEEN ${rule.value.min} AND ${rule.value.max}`
      }
      if (field.type === "date" && isDateRange(rule.value)) {
        return `${column} BETWEEN ${sqlStringLiteral(rule.value.start!)} AND ${sqlStringLiteral(rule.value.end!)}`
      }
      return null
    case "is_today":
      return `DATE(${column}) = CURRENT_DATE`
    case "is_this_week":
      return `${column} >= DATE_TRUNC('week', CURRENT_DATE) AND ${column} < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '7 days'`
    case "is_this_month":
      return `DATE_TRUNC('month', ${column}) = DATE_TRUNC('month', CURRENT_DATE)`
    case "in":
      if (!isStringArray(rule.value) || rule.value.length === 0) return null
      return `${column} IN (${rule.value.map((item) => formatSqlValue(item, field)).join(", ")})`
    case "not_in":
      if (!isStringArray(rule.value) || rule.value.length === 0) return null
      return `${column} NOT IN (${rule.value.map((item) => formatSqlValue(item, field)).join(", ")})`
    default:
      return null
  }
}

export function generateSQL(group: Group, schema: Schema): string {
  const table = getTableName(schema)
  const where = generateFromGroup(
    group,
    schema,
    generateSqlRule,
    joinSqlConditions
  )

  if (!where) {
    return `SELECT *\nFROM ${table}\n-- Add valid conditions to generate a WHERE clause`
  }

  return `SELECT *\nFROM ${table}\nWHERE ${where}`
}
