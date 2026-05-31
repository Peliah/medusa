import {
  formatMongoValue,
  generateFromGroup,
} from "@/lib/query-engine/generators/shared"
import {
  isDateRange,
  isNumberRange,
  isStringArray,
} from "@/lib/query-engine/value-utils"
import type { Group, Rule, Schema } from "@/lib/query-engine/types"

type MongoFilter = Record<string, unknown>

function joinMongoConditions(
  logic: Group["logic"],
  parts: MongoFilter[]
): MongoFilter {
  if (parts.length === 1) return parts[0]
  return { [logic === "AND" ? "$and" : "$or"]: parts }
}

function generateMongoRule(rule: Rule, schema: Schema): MongoFilter | null {
  if (!rule.field || !rule.operator) return null

  const field = schema.fields.find((item) => item.name === rule.field)
  if (!field) return null

  const key = rule.field

  switch (rule.operator) {
    case "eq":
      return { [key]: formatMongoValue(rule.value, field) }
    case "neq":
      return { [key]: { $ne: formatMongoValue(rule.value, field) } }
    case "contains":
      return {
        [key]: { $regex: String(rule.value), $options: "i" },
      }
    case "gt":
      return { [key]: { $gt: formatMongoValue(rule.value, field) } }
    case "lt":
      return { [key]: { $lt: formatMongoValue(rule.value, field) } }
    case "gte":
      return { [key]: { $gte: formatMongoValue(rule.value, field) } }
    case "lte":
      return { [key]: { $lte: formatMongoValue(rule.value, field) } }
    case "is_null":
      return { [key]: null }
    case "is_not_null":
      return { [key]: { $ne: null } }
    case "regex":
      return { [key]: { $regex: String(rule.value) } }
    case "between":
      if (field.type === "number" && isNumberRange(rule.value)) {
        return {
          [key]: { $gte: rule.value.min, $lte: rule.value.max },
        }
      }
      if (field.type === "date" && isDateRange(rule.value)) {
        return {
          [key]: { $gte: rule.value.start, $lte: rule.value.end },
        }
      }
      return null
    case "is_today":
      return {
        [key]: {
          $gte: "$$TODAY_START",
          $lt: "$$TODAY_END",
        },
      }
    case "is_this_week":
      return {
        [key]: {
          $gte: "$$WEEK_START",
          $lt: "$$WEEK_END",
        },
      }
    case "is_this_month":
      return {
        [key]: {
          $gte: "$$MONTH_START",
          $lt: "$$MONTH_END",
        },
      }
    case "in":
      if (!isStringArray(rule.value)) return null
      return { [key]: { $in: rule.value } }
    case "not_in":
      if (!isStringArray(rule.value)) return null
      return { [key]: { $nin: rule.value } }
    default:
      return null
  }
}

function flattenAndFilter(filter: MongoFilter): MongoFilter {
  if ("$and" in filter && Array.isArray(filter.$and)) {
    const items = filter.$and as MongoFilter[]
    if (items.length === 1) return flattenAndFilter(items[0])

    const flattened: MongoFilter[] = []
    for (const item of items) {
      const next = flattenAndFilter(item)
      if ("$and" in next && Array.isArray(next.$and) && !("$or" in next)) {
        flattened.push(...(next.$and as MongoFilter[]))
      } else {
        flattened.push(next)
      }
    }

    if (flattened.length === 1) return flattened[0]
    return { $and: flattened }
  }

  return filter
}

export function generateMongo(group: Group, schema: Schema): string {
  const filter = generateFromGroup(
    group,
    schema,
    generateMongoRule,
    joinMongoConditions
  )

  if (!filter) {
    return `{\n  "_comment": "Add valid conditions to generate a filter"\n}`
  }

  const output = flattenAndFilter(filter)
  return JSON.stringify(output, null, 2)
}
