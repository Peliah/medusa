import {
  endOfWeek,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  parseISO,
  startOfWeek,
} from "date-fns"

import type { DataRecord } from "@/lib/data/types"
import { isRule } from "@/lib/query-engine/tree-utils"
import {
  isDateRange,
  isNumberRange,
  isStringArray,
} from "@/lib/query-engine/value-utils"
import type { Group, Rule, Schema } from "@/lib/query-engine/types"

function parseRecordDate(value: unknown): Date | null {
  if (typeof value !== "string" || !value) return null
  const date = parseISO(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function getFieldValue(record: DataRecord, field: string): unknown {
  return record[field]
}

function isEmptyValue(value: unknown): boolean {
  return value === null || value === undefined
}

function matchRule(record: DataRecord, rule: Rule, schema: Schema): boolean {
  if (!rule.field || !rule.operator) return false

  const fieldDef = schema.fields.find((field) => field.name === rule.field)
  if (!fieldDef) return false

  const raw = getFieldValue(record, rule.field)

  switch (rule.operator) {
    case "is_null":
      return isEmptyValue(raw)
    case "is_not_null":
      return !isEmptyValue(raw)
    case "eq":
      return raw === rule.value
    case "neq":
      return raw !== rule.value
    case "contains":
      if (Array.isArray(raw)) {
        return raw.some(
          (item) =>
            String(item).toLowerCase() === String(rule.value).toLowerCase()
        )
      }
      return String(raw)
        .toLowerCase()
        .includes(String(rule.value).toLowerCase())
    case "gt":
      return Number(raw) > Number(rule.value)
    case "lt":
      return Number(raw) < Number(rule.value)
    case "gte":
      return Number(raw) >= Number(rule.value)
    case "lte":
      return Number(raw) <= Number(rule.value)
    case "regex": {
      if (typeof rule.value !== "string") return false
      try {
        return new RegExp(rule.value, "i").test(String(raw))
      } catch {
        return false
      }
    }
    case "between": {
      if (fieldDef.type === "number" && isNumberRange(rule.value)) {
        const num = Number(raw)
        return num >= rule.value.min! && num <= rule.value.max!
      }
      if (fieldDef.type === "date" && isDateRange(rule.value)) {
        const date = parseRecordDate(raw)
        if (!date || !rule.value.start || !rule.value.end) return false
        const start = parseISO(rule.value.start)
        const end = parseISO(rule.value.end)
        return isWithinInterval(date, { start, end })
      }
      return false
    }
    case "is_today": {
      const date = parseRecordDate(raw)
      return date ? isSameDay(date, new Date()) : false
    }
    case "is_this_week": {
      const date = parseRecordDate(raw)
      if (!date) return false
      const now = new Date()
      return isWithinInterval(date, {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      })
    }
    case "is_this_month": {
      const date = parseRecordDate(raw)
      if (!date) return false
      return isSameMonth(date, new Date())
    }
    case "in": {
      if (!isStringArray(rule.value)) return false
      if (Array.isArray(raw)) {
        return rule.value.some((item) => raw.includes(item))
      }
      return rule.value.includes(String(raw))
    }
    case "not_in": {
      if (!isStringArray(rule.value)) return false
      if (Array.isArray(raw)) {
        return !rule.value.some((item) => raw.includes(item))
      }
      return !rule.value.includes(String(raw))
    }
    default:
      return false
  }
}

function matchGroup(record: DataRecord, group: Group, schema: Schema): boolean {
  if (group.conditions.length === 0) return false

  const results = group.conditions.map((condition) => {
    if (isRule(condition)) return matchRule(record, condition, schema)
    return matchGroup(record, condition, schema)
  })

  return group.logic === "AND" ? results.every(Boolean) : results.some(Boolean)
}

export function filterRecords(
  records: DataRecord[],
  group: Group,
  schema: Schema
): DataRecord[] {
  return records.filter((record) => matchGroup(record, group, schema))
}

export function executeQuery(
  records: DataRecord[],
  group: Group,
  schema: Schema
): DataRecord[] {
  return filterRecords(records, group, schema)
}
