"use client"

import * as React from "react"

import {
  countRules,
  findCondition,
  findParentGroup,
  isGroup,
} from "@/lib/query-engine/tree-utils"
import { useCanRedo, useCanUndo, useQueryStore } from "@/store/query-store"
import { useUIStore } from "@/store/ui-store"

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

interface UseBuilderKeyboardShortcutsOptions {
  onRunQuery: () => void
  onOpenShortcuts: () => void
  canRunQuery: boolean
}

export function useBuilderKeyboardShortcuts({
  onRunQuery,
  onOpenShortcuts,
  canRunQuery,
}: UseBuilderKeyboardShortcutsOptions) {
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()
  const tree = useQueryStore((state) => state.tree)
  const undo = useQueryStore((state) => state.undo)
  const redo = useQueryStore((state) => state.redo)
  const duplicateRule = useQueryStore((state) => state.duplicateRule)
  const wrapRuleInGroup = useQueryStore((state) => state.wrapRuleInGroup)
  const collapseGroup = useQueryStore((state) => state.collapseGroup)
  const focusedConditionId = useUIStore((state) => state.focusedConditionId)
  const setFocusedConditionId = useUIStore(
    (state) => state.setFocusedConditionId
  )
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen)
  const requestSavePresetFocus = useUIStore(
    (state) => state.requestSavePresetFocus
  )

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) return

      if (
        event.key === "?" &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        event.preventDefault()
        onOpenShortcuts()
        return
      }

      if (event.key === "Escape" && !isTypingTarget(event.target)) {
        if (!focusedConditionId) return

        const focused = findCondition(tree, focusedConditionId)
        if (!focused) return

        event.preventDefault()

        if (isGroup(focused)) {
          collapseGroup(focused.id)
          return
        }

        const parent = findParentGroup(tree, focusedConditionId)
        if (parent) collapseGroup(parent.id)
        return
      }

      if (isTypingTarget(event.target)) return

      const modifier = event.metaKey || event.ctrlKey
      if (!modifier) return

      const key = event.key.toLowerCase()

      if (key === "enter" && canRunQuery) {
        event.preventDefault()
        onRunQuery()
        return
      }

      if (key === "z" && event.shiftKey && canRedo) {
        event.preventDefault()
        redo()
        return
      }

      if (key === "z" && !event.shiftKey && canUndo) {
        event.preventDefault()
        undo()
        return
      }

      if (key === "s") {
        event.preventDefault()
        if (countRules(tree) === 0) return
        if (window.matchMedia("(max-width: 1023px)").matches) {
          setSidebarOpen(true)
        }
        requestSavePresetFocus()
        return
      }

      if (!focusedConditionId) return

      const focused = findCondition(tree, focusedConditionId)
      if (!focused || isGroup(focused)) return

      if (key === "d") {
        event.preventDefault()
        const newRuleId = duplicateRule(focusedConditionId)
        if (newRuleId) setFocusedConditionId(newRuleId)
        return
      }

      if (key === "g") {
        event.preventDefault()
        const groupId = wrapRuleInGroup(focusedConditionId)
        if (groupId) setFocusedConditionId(groupId)
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [
    canRedo,
    canRunQuery,
    canUndo,
    collapseGroup,
    duplicateRule,
    focusedConditionId,
    onOpenShortcuts,
    onRunQuery,
    redo,
    requestSavePresetFocus,
    setFocusedConditionId,
    setSidebarOpen,
    tree,
    undo,
    wrapRuleInGroup,
  ])
}
