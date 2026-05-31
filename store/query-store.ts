import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

import {
  createGroup,
  createRootGroup,
  createRule,
} from "@/lib/query-engine/factory"
import { findGroup, findParentGroup } from "@/lib/query-engine/tree-utils"
import type {
  Group,
  LogicOperator,
  Rule,
  SchemaId,
} from "@/lib/query-engine/types"

interface QueryStore {
  tree: Group
  schemaId: SchemaId
  rootId: string

  addRule: (groupId: string) => void
  addGroup: (parentGroupId: string) => void
  removeCondition: (conditionId: string) => void
  updateRule: (ruleId: string, patch: Partial<Rule>) => void
  updateGroupLogic: (groupId: string, logic: LogicOperator) => void
  toggleGroupCollapse: (groupId: string) => void
  setSchema: (schemaId: SchemaId) => void
  clearTree: () => void
  loadQuery: (schemaId: SchemaId, tree: Group) => void
}

function initState() {
  const tree = createRootGroup()
  return { tree, schemaId: "agents" as SchemaId, rootId: tree.id }
}

export const useQueryStore = create<QueryStore>()(
  immer((set, get) => ({
    ...initState(),

    addRule: (groupId) => {
      set((state) => {
        const group = findGroup(state.tree, groupId)
        if (!group) return
        group.conditions.push(createRule())
      })
    },

    addGroup: (parentGroupId) => {
      set((state) => {
        const group = findGroup(state.tree, parentGroupId)
        if (!group) return
        group.conditions.push(createGroup())
      })
    },

    removeCondition: (conditionId) => {
      const { rootId } = get()
      if (conditionId === rootId) return

      set((state) => {
        const parent = findParentGroup(state.tree, conditionId)
        if (!parent) return
        parent.conditions = parent.conditions.filter(
          (condition) => condition.id !== conditionId
        )
      })
    },

    updateRule: (ruleId, patch) => {
      set((state) => {
        const parent = findParentGroup(state.tree, ruleId)
        if (!parent) return

        const rule = parent.conditions.find(
          (condition) => condition.id === ruleId && condition.type === "rule"
        )
        if (!rule || rule.type !== "rule") return

        Object.assign(rule, patch)

        if (patch.field !== undefined) {
          rule.operator = null
          rule.value = null
        }
      })
    },

    updateGroupLogic: (groupId, logic) => {
      set((state) => {
        const group = findGroup(state.tree, groupId)
        if (!group) return
        group.logic = logic
      })
    },

    toggleGroupCollapse: (groupId) => {
      set((state) => {
        const group = findGroup(state.tree, groupId)
        if (!group) return
        group.collapsed = !group.collapsed
      })
    },

    setSchema: (schemaId) => {
      set((state) => {
        state.schemaId = schemaId
        const tree = createRootGroup()
        state.tree = tree
        state.rootId = tree.id
      })
    },

    clearTree: () => {
      set((state) => {
        const tree = createRootGroup()
        state.tree = tree
        state.rootId = tree.id
      })
    },

    loadQuery: (schemaId, tree) => {
      set((state) => {
        state.schemaId = schemaId
        state.tree = tree
        state.rootId = tree.id
      })
    },
  }))
)

export function useActiveSchema() {
  const schemaId = useQueryStore((state) => state.schemaId)
  return schemaId
}
