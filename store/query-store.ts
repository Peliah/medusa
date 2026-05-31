import { create } from "zustand"
import { current, isDraft } from "immer"
import { nanoid } from "nanoid"
import { immer } from "zustand/middleware/immer"

import {
  createGroup,
  createRootGroup,
  createRule,
} from "@/lib/query-engine/factory"
import {
  findGroup,
  findParentGroup,
  isRule,
} from "@/lib/query-engine/tree-utils"
import type {
  Group,
  LogicOperator,
  Rule,
  SchemaId,
} from "@/lib/query-engine/types"
import { useUIStore } from "@/store/ui-store"

const HISTORY_LIMIT = 50

interface QueryStore {
  tree: Group
  schemaId: SchemaId
  rootId: string
  past: Group[]
  future: Group[]

  addRule: (groupId: string) => void
  addGroup: (parentGroupId: string) => void
  removeCondition: (conditionId: string) => void
  updateRule: (ruleId: string, patch: Partial<Rule>) => void
  updateGroupLogic: (groupId: string, logic: LogicOperator) => void
  toggleGroupCollapse: (groupId: string) => void
  reorderCondition: (
    groupId: string,
    fromIndex: number,
    toIndex: number
  ) => void
  moveCondition: (
    conditionId: string,
    targetGroupId: string,
    targetIndex: number
  ) => void
  setSchema: (schemaId: SchemaId) => void
  clearTree: () => void
  loadQuery: (schemaId: SchemaId, tree: Group) => void
  duplicateRule: (ruleId: string) => string | null
  wrapRuleInGroup: (ruleId: string) => string | null
  collapseGroup: (groupId: string) => void
  undo: () => void
  redo: () => void
}

function initState() {
  const tree = createRootGroup()
  return {
    tree,
    schemaId: "agents" as SchemaId,
    rootId: tree.id,
    past: [] as Group[],
    future: [] as Group[],
  }
}

function cloneTree(tree: Group): Group {
  const snapshot = isDraft(tree) ? current(tree) : tree
  return structuredClone(snapshot)
}

function pushHistory(state: { past: Group[]; future: Group[]; tree: Group }) {
  state.past.push(cloneTree(state.tree))
  if (state.past.length > HISTORY_LIMIT) state.past.shift()
  state.future = []
}

function resetHistory(state: { past: Group[]; future: Group[] }) {
  state.past = []
  state.future = []
}

export const useQueryStore = create<QueryStore>()(
  immer((set, get) => ({
    ...initState(),

    addRule: (groupId) => {
      set((state) => {
        pushHistory(state)
        const group = findGroup(state.tree, groupId)
        if (!group) return
        group.conditions.push(createRule())
      })
    },

    addGroup: (parentGroupId) => {
      set((state) => {
        pushHistory(state)
        const group = findGroup(state.tree, parentGroupId)
        if (!group) return
        group.conditions.push(createGroup())
      })
    },

    removeCondition: (conditionId) => {
      const { rootId } = get()
      if (conditionId === rootId) return

      set((state) => {
        pushHistory(state)
        const parent = findParentGroup(state.tree, conditionId)
        if (!parent) return
        parent.conditions = parent.conditions.filter(
          (condition) => condition.id !== conditionId
        )
      })

      if (useUIStore.getState().focusedConditionId === conditionId) {
        useUIStore.getState().setFocusedConditionId(null)
      }
    },

    updateRule: (ruleId, patch) => {
      set((state) => {
        pushHistory(state)
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
        pushHistory(state)
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

    reorderCondition: (groupId, fromIndex, toIndex) => {
      if (fromIndex === toIndex) return

      set((state) => {
        const group = findGroup(state.tree, groupId)
        if (!group) return

        const { conditions } = group
        if (
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= conditions.length ||
          toIndex >= conditions.length
        ) {
          return
        }

        pushHistory(state)
        const [item] = conditions.splice(fromIndex, 1)
        conditions.splice(toIndex, 0, item)
      })
    },

    moveCondition: (conditionId, targetGroupId, targetIndex) => {
      const { rootId } = get()
      if (conditionId === rootId) return

      set((state) => {
        const parent = findParentGroup(state.tree, conditionId)
        const targetGroup = findGroup(state.tree, targetGroupId)
        if (!parent || !targetGroup || parent.id === targetGroupId) return

        const fromIndex = parent.conditions.findIndex(
          (condition) => condition.id === conditionId
        )
        if (fromIndex === -1) return

        pushHistory(state)
        const [item] = parent.conditions.splice(fromIndex, 1)
        const clampedIndex = Math.max(
          0,
          Math.min(targetIndex, targetGroup.conditions.length)
        )
        targetGroup.conditions.splice(clampedIndex, 0, item)
      })
    },

    setSchema: (schemaId) => {
      set((state) => {
        state.schemaId = schemaId
        const tree = createRootGroup()
        state.tree = tree
        state.rootId = tree.id
        resetHistory(state)
      })
    },

    clearTree: () => {
      set((state) => {
        const tree = createRootGroup()
        state.tree = tree
        state.rootId = tree.id
        resetHistory(state)
      })
    },

    loadQuery: (schemaId, tree) => {
      set((state) => {
        state.schemaId = schemaId
        state.tree = cloneTree(tree)
        state.rootId = tree.id
        resetHistory(state)
      })
    },

    duplicateRule: (ruleId) => {
      const newRuleId = nanoid()

      set((state) => {
        const parent = findParentGroup(state.tree, ruleId)
        if (!parent) return

        const index = parent.conditions.findIndex(
          (condition) => condition.id === ruleId
        )
        if (index === -1) return

        const rule = parent.conditions[index]
        if (!isRule(rule)) return

        pushHistory(state)
        const snapshot = isDraft(rule) ? current(rule) : rule
        parent.conditions.splice(index + 1, 0, {
          ...structuredClone(snapshot),
          id: newRuleId,
        })
      })

      const parent = findParentGroup(get().tree, ruleId)
      const duplicated = parent?.conditions.some(
        (condition) => condition.id === newRuleId
      )

      return duplicated ? newRuleId : null
    },

    wrapRuleInGroup: (ruleId) => {
      const wrapperId = nanoid()

      set((state) => {
        const parent = findParentGroup(state.tree, ruleId)
        if (!parent) return

        const index = parent.conditions.findIndex(
          (condition) => condition.id === ruleId
        )
        if (index === -1) return

        const rule = parent.conditions[index]
        if (!isRule(rule)) return

        pushHistory(state)
        const snapshot = isDraft(rule) ? current(rule) : rule
        const wrapper = createGroup("AND")
        wrapper.id = wrapperId
        wrapper.conditions = [structuredClone(snapshot)]
        parent.conditions[index] = wrapper
      })

      return findGroup(get().tree, wrapperId) ? wrapperId : null
    },

    collapseGroup: (groupId) => {
      set((state) => {
        const group = findGroup(state.tree, groupId)
        if (!group || group.collapsed) return
        group.collapsed = true
      })
    },

    undo: () => {
      set((state) => {
        if (state.past.length === 0) return
        state.future.unshift(cloneTree(state.tree))
        const previous = state.past.pop()
        if (!previous) return
        state.tree = previous
        state.rootId = previous.id
      })
    },

    redo: () => {
      set((state) => {
        if (state.future.length === 0) return
        state.past.push(cloneTree(state.tree))
        const next = state.future.shift()
        if (!next) return
        state.tree = next
        state.rootId = next.id
      })
    },
  }))
)

export function useActiveSchema() {
  const schemaId = useQueryStore((state) => state.schemaId)
  return schemaId
}

export function useCanUndo() {
  return useQueryStore((state) => state.past.length > 0)
}

export function useCanRedo() {
  return useQueryStore((state) => state.future.length > 0)
}
