import { nanoid } from "nanoid"

import type { Group, LogicOperator, Rule } from "@/lib/query-engine/types"

export function createRule(): Rule {
  return {
    id: nanoid(),
    type: "rule",
    field: null,
    operator: null,
    value: null,
  }
}

export function createGroup(logic: LogicOperator = "AND"): Group {
  return {
    id: nanoid(),
    type: "group",
    logic,
    conditions: [],
    collapsed: false,
  }
}

export function createRootGroup(): Group {
  return createGroup("AND")
}
