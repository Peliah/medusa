import {
  formatGraphQLValue,
  generateFromGroup,
  getGraphQLQueryName,
  getGraphQLSelectionField,
  getTableName,
  graphqlStringLiteral,
} from "@/lib/query-engine/generators/shared"
import {
  isDateRange,
  isNumberRange,
  isStringArray,
} from "@/lib/query-engine/value-utils"
import type { Group, Rule, Schema } from "@/lib/query-engine/types"

type GraphQLValue =
  | string
  | number
  | boolean
  | null
  | GraphQLValue[]
  | { [key: string]: GraphQLValue }

type GraphQLFilter = Record<string, GraphQLValue>

function joinGraphQLConditions(
  logic: Group["logic"],
  parts: GraphQLFilter[]
): GraphQLFilter {
  if (parts.length === 1) return parts[0]
  return { [logic === "AND" ? "_and" : "_or"]: parts }
}

function wrapFieldFilter(field: string, filter: GraphQLFilter): GraphQLFilter {
  return { [field]: filter }
}

function generateGraphQLRule(rule: Rule, schema: Schema): GraphQLFilter | null {
  if (!rule.field || !rule.operator) return null

  const field = schema.fields.find((item) => item.name === rule.field)
  if (!field) return null

  const key = rule.field

  switch (rule.operator) {
    case "eq":
      return wrapFieldFilter(key, {
        _eq: formatGraphQLValue(rule.value, field),
      })
    case "neq":
      return wrapFieldFilter(key, {
        _neq: formatGraphQLValue(rule.value, field),
      })
    case "contains":
      return wrapFieldFilter(key, {
        _ilike: graphqlStringLiteral(`%${String(rule.value)}%`),
      })
    case "gt":
      return wrapFieldFilter(key, {
        _gt: formatGraphQLValue(rule.value, field),
      })
    case "lt":
      return wrapFieldFilter(key, {
        _lt: formatGraphQLValue(rule.value, field),
      })
    case "gte":
      return wrapFieldFilter(key, {
        _gte: formatGraphQLValue(rule.value, field),
      })
    case "lte":
      return wrapFieldFilter(key, {
        _lte: formatGraphQLValue(rule.value, field),
      })
    case "is_null":
      return wrapFieldFilter(key, { _is_null: true })
    case "is_not_null":
      return wrapFieldFilter(key, { _is_null: false })
    case "regex":
      return wrapFieldFilter(key, {
        _regex: graphqlStringLiteral(String(rule.value)),
      })
    case "between":
      if (field.type === "number" && isNumberRange(rule.value)) {
        return wrapFieldFilter(key, {
          _gte: rule.value.min!,
          _lte: rule.value.max!,
        })
      }
      if (field.type === "date" && isDateRange(rule.value)) {
        return wrapFieldFilter(key, {
          _gte: graphqlStringLiteral(rule.value.start!),
          _lte: graphqlStringLiteral(rule.value.end!),
        })
      }
      return null
    case "is_today":
      return wrapFieldFilter(key, { _eq: "CURRENT_DATE" })
    case "is_this_week":
      return wrapFieldFilter(key, { _gte: "WEEK_START", _lt: "WEEK_END" })
    case "is_this_month":
      return wrapFieldFilter(key, { _gte: "MONTH_START", _lt: "MONTH_END" })
    case "in":
      if (!isStringArray(rule.value)) return null
      return wrapFieldFilter(key, { _in: rule.value })
    case "not_in":
      if (!isStringArray(rule.value)) return null
      return wrapFieldFilter(key, { _nin: rule.value })
    default:
      return null
  }
}

function serializeGraphQLValue(value: GraphQLValue, indent: number): string {
  if (value === null) return "null"
  if (typeof value === "boolean") return value ? "true" : "false"
  if (typeof value === "number") return String(value)
  if (typeof value === "string") {
    if (value.startsWith('"') && value.endsWith('"')) return value
    if (
      value === "CURRENT_DATE" ||
      value === "WEEK_START" ||
      value === "WEEK_END" ||
      value === "MONTH_START" ||
      value === "MONTH_END"
    ) {
      return value
    }
    return graphqlStringLiteral(value)
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]"
    const items = value.map((item) => serializeGraphQLValue(item, indent))
    return `[${items.join(", ")}]`
  }

  const pad = " ".repeat(indent)
  const innerPad = " ".repeat(indent + 2)
  const lines = Object.entries(value).map(
    ([key, nested]) =>
      `${innerPad}${key}: ${serializeGraphQLValue(nested, indent + 2)}`
  )
  return `{\n${lines.join("\n")}\n${pad}}`
}

function formatGraphQLFilter(filter: GraphQLFilter, indent = 4): string {
  const pad = " ".repeat(indent)
  const lines = Object.entries(filter).map(([field, value]) => {
    return `${pad}${field}: ${serializeGraphQLValue(value, indent + 2)}`
  })
  return lines.join("\n")
}

export function generateGraphQL(group: Group, schema: Schema): string {
  const collection = getTableName(schema)
  const queryName = getGraphQLQueryName(schema)
  const selectionField = getGraphQLSelectionField(schema)
  const filter = generateFromGroup(
    group,
    schema,
    generateGraphQLRule,
    joinGraphQLConditions
  )

  if (!filter) {
    return `query ${queryName} {\n  ${collection} {\n    ${selectionField}\n  }\n}\n# Add valid conditions to generate a where clause`
  }

  const whereBlock = formatGraphQLFilter(filter, 4)

  return `query ${queryName} {\n  ${collection}(where: {\n${whereBlock}\n  }) {\n    ${selectionField}\n  }\n}`
}
