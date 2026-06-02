import { nanoid } from "nanoid"

import {
  IMPORT_MAX_TREE_DEPTH,
  IMPORT_MAX_TREE_NODES,
} from "@/lib/import/constants"
import { getOperatorsForType } from "@/lib/query-engine/operators"
import { sanitizeRuleValue } from "@/lib/import/sanitize-values"
import type { ImportIssue, ImportResult } from "@/lib/import/types"
import type {
  Group,
  LogicOperator,
  OperatorValue,
  Rule,
  Schema,
} from "@/lib/query-engine/types"

const LOGIC_VALUES = new Set<LogicOperator>(["AND", "OR"])
const OPERATOR_VALUES = new Set<OperatorValue>([
  "eq",
  "neq",
  "contains",
  "gt",
  "lt",
  "gte",
  "lte",
  "is_null",
  "is_not_null",
  "regex",
  "between",
  "is_today",
  "is_this_week",
  "is_this_month",
  "in",
  "not_in",
])

interface WalkState {
  nodeCount: number
  issues: ImportIssue[]
}

function pushIssue(state: WalkState, path: string, message: string) {
  state.issues.push({ path, message })
}

function parseOperator(value: unknown): OperatorValue | null {
  return typeof value === "string" &&
    OPERATOR_VALUES.has(value as OperatorValue)
    ? (value as OperatorValue)
    : null
}

function parseRule(
  raw: unknown,
  path: string,
  schema: Schema,
  state: WalkState
): Rule | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    pushIssue(state, path, "Rule must be an object")
    return null
  }

  const record = raw as Record<string, unknown>
  if (record.type !== "rule") {
    pushIssue(state, path, 'Rule must have type "rule"')
    return null
  }

  const field =
    record.field === null
      ? null
      : typeof record.field === "string"
        ? record.field
        : null

  if (record.field !== null && field === null) {
    pushIssue(state, path, "Rule field must be a string or null")
    return null
  }

  const operator =
    record.operator === null ? null : parseOperator(record.operator)

  if (record.operator !== null && operator === null) {
    pushIssue(state, path, "Rule operator is invalid")
    return null
  }

  let value: Rule["value"] = null
  if (field && operator) {
    const fieldDef = schema.fields.find((item) => item.name === field)
    if (!fieldDef) {
      pushIssue(state, path, `Unknown field "${field}"`)
      return null
    }

    if (!getOperatorsForType(fieldDef.type).includes(operator)) {
      pushIssue(state, path, `Operator "${operator}" is invalid for ${field}`)
      return null
    }

    const sanitized = sanitizeRuleValue(record.value, fieldDef, operator)
    if (sanitized === null && record.value !== null) {
      pushIssue(state, path, "Rule value is invalid for field and operator")
      return null
    }
    value = sanitized
  } else if (record.value !== null && record.value !== undefined) {
    value = null
  }

  return {
    id: nanoid(),
    type: "rule",
    field,
    operator,
    value,
  }
}

function parseGroup(
  raw: unknown,
  path: string,
  depth: number,
  schema: Schema,
  state: WalkState
): Group | null {
  if (depth > IMPORT_MAX_TREE_DEPTH) {
    pushIssue(
      state,
      path,
      `Maximum nesting depth of ${IMPORT_MAX_TREE_DEPTH} exceeded`
    )
    return null
  }

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    pushIssue(state, path, "Group must be an object")
    return null
  }

  state.nodeCount += 1
  if (state.nodeCount > IMPORT_MAX_TREE_NODES) {
    pushIssue(state, path, `Maximum of ${IMPORT_MAX_TREE_NODES} nodes exceeded`)
    return null
  }

  const record = raw as Record<string, unknown>
  if (record.type !== "group") {
    pushIssue(state, path, 'Group must have type "group"')
    return null
  }

  if (
    typeof record.logic !== "string" ||
    !LOGIC_VALUES.has(record.logic as LogicOperator)
  ) {
    pushIssue(state, path, 'Group logic must be "AND" or "OR"')
    return null
  }

  if (!Array.isArray(record.conditions)) {
    pushIssue(state, path, "Group conditions must be an array")
    return null
  }

  const conditions: Group["conditions"] = []
  record.conditions.forEach((condition, index) => {
    if (
      typeof condition !== "object" ||
      condition === null ||
      Array.isArray(condition)
    ) {
      pushIssue(
        state,
        `${path}.conditions[${index}]`,
        "Condition must be an object"
      )
      return
    }

    const type = (condition as Record<string, unknown>).type
    if (type === "rule") {
      const rule = parseRule(
        condition,
        `${path}.conditions[${index}]`,
        schema,
        state
      )
      if (rule) conditions.push(rule)
      return
    }

    if (type === "group") {
      const group = parseGroup(
        condition,
        `${path}.conditions[${index}]`,
        depth + 1,
        schema,
        state
      )
      if (group) conditions.push(group)
      return
    }

    pushIssue(
      state,
      `${path}.conditions[${index}]`,
      'Condition type must be "rule" or "group"'
    )
  })

  return {
    id: nanoid(),
    type: "group",
    logic: record.logic as LogicOperator,
    conditions,
    collapsed: record.collapsed === true,
  }
}

export function normalizeQueryTree(
  raw: unknown,
  schema: Schema
): ImportResult<Group> {
  const state: WalkState = { nodeCount: 0, issues: [] }
  const tree = parseGroup(raw, "$.tree", 0, schema, state)

  if (state.issues.length > 0) {
    return { ok: false, issues: state.issues }
  }

  if (!tree) {
    return {
      ok: false,
      issues: [{ path: "$.tree", message: "Query tree is invalid" }],
    }
  }

  return { ok: true, data: tree }
}
