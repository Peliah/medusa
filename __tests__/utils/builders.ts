import type { DataRecord } from "@/lib/data/types"
import {
  createGroup,
  createRule,
  createRootGroup,
} from "@/lib/query-engine/factory"
import type {
  Group,
  LogicOperator,
  Rule,
  Schema,
} from "@/lib/query-engine/types"
import { agentsSchema } from "@/lib/schemas/agents"

export const testSchema: Schema = agentsSchema

export function buildRule(overrides: Partial<Rule> = {}): Rule {
  return { ...createRule(), ...overrides }
}

export function buildGroup(
  conditions: Group["conditions"] = [],
  overrides: Partial<Omit<Group, "conditions">> = {}
): Group {
  return {
    ...createGroup(),
    ...overrides,
    conditions,
  }
}

export function buildRootWithRules(
  rules: Array<Partial<Rule>>,
  logic: LogicOperator = "AND"
): Group {
  const root = createRootGroup()
  root.logic = logic
  root.conditions = rules.map((partial) => buildRule(partial))
  return root
}

export function buildNestedTree(): Group {
  const inner = buildGroup(
    [
      buildRule({
        field: "status",
        operator: "eq",
        value: "active",
      }),
    ],
    { logic: "OR" }
  )

  return buildGroup([
    buildRule({
      field: "compromised",
      operator: "eq",
      value: false,
    }),
    inner,
  ])
}

export function buildRecord(overrides: Partial<DataRecord> = {}): DataRecord {
  return {
    id: "test-1",
    codename: "Nightshade",
    clearanceLevel: "LEVEL_5",
    lastSeen: "2026-05-28",
    missionsCompleted: 42,
    status: "active",
    compromised: false,
    ...overrides,
  }
}
