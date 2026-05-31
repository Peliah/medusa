"use client"

import {
  ArrowCounterClockwiseIcon,
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  PlusIcon,
} from "@phosphor-icons/react"
import * as React from "react"

import { ComplexityBanner } from "@/components/query-builder/complexity-banner"
import { ConditionGroup } from "@/components/query-builder/condition-group"
import { QueryBuilderDndProvider } from "@/components/query-builder/query-builder-dnd-provider"
import { Button } from "@/components/ui/button"
import {
  countGroups,
  countRules,
  getMaxDepth,
} from "@/lib/query-engine/tree-utils"
import { getSchema } from "@/lib/schemas"
import { useCanRedo, useCanUndo, useQueryStore } from "@/store/query-store"

export function QueryBuilderPanel() {
  const tree = useQueryStore((state) => state.tree)
  const schemaId = useQueryStore((state) => state.schemaId)
  const rootId = useQueryStore((state) => state.rootId)
  const addRule = useQueryStore((state) => state.addRule)
  const addGroup = useQueryStore((state) => state.addGroup)
  const clearTree = useQueryStore((state) => state.clearTree)
  const undo = useQueryStore((state) => state.undo)
  const redo = useQueryStore((state) => state.redo)
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  const schema = getSchema(schemaId)
  const ruleCount = countRules(tree)
  const groupCount = countGroups(tree)
  const maxDepth = getMaxDepth(tree)

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!(event.metaKey || event.ctrlKey) || event.altKey) return

      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        return
      }

      if (event.key.toLowerCase() === "z" && event.shiftKey && canRedo) {
        event.preventDefault()
        redo()
        return
      }

      if (event.key.toLowerCase() === "z" && !event.shiftKey && canUndo) {
        event.preventDefault()
        undo()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [canRedo, canUndo, redo, undo])

  return (
    <QueryBuilderDndProvider>
      <main className="builder-panel bg-background">
        <div className="builder-panel__header flex flex-col gap-3 border-b border-border px-4 py-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg" aria-hidden>
                  {schema.emoji}
                </span>
                <div>
                  <h1 className="font-heading text-base font-semibold">
                    {schema.name}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {ruleCount} rule{ruleCount === 1 ? "" : "s"} · {groupCount}{" "}
                    nested group{groupCount === 1 ? "" : "s"} · depth {maxDepth}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={!canUndo}
                onClick={undo}
                aria-label="Undo"
                title="Undo (Ctrl+Z)"
              >
                <ArrowUUpLeftIcon className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={!canRedo}
                onClick={redo}
                aria-label="Redo"
                title="Redo (Ctrl+Shift+Z)"
              >
                <ArrowUUpRightIcon className="size-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={clearTree}
                disabled={ruleCount === 0 && groupCount === 0}
              >
                <ArrowCounterClockwiseIcon className="size-3.5" />
                Clear all
              </Button>
            </div>
          </div>

          {ruleCount > 0 ? <ComplexityBanner tree={tree} /> : null}
        </div>

        <div className="builder-panel__body p-4">
          {ruleCount === 0 && groupCount === 0 ? (
            <div className="mb-4 rounded-xl border border-dashed border-border bg-card/50 px-4 py-8 text-center">
              <p className="font-heading text-lg font-medium">
                Build your first query
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Add a rule to filter {schema.name.toLowerCase()}, or create a
                nested group for complex AND/OR logic.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Button size="sm" onClick={() => addRule(rootId)}>
                  <PlusIcon className="size-3.5" />
                  Add first rule
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addGroup(rootId)}
                >
                  Add nested group
                </Button>
              </div>
            </div>
          ) : null}

          <ConditionGroup group={tree} isRoot depth={0} />

          {(ruleCount > 0 || groupCount > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-dashed"
                onClick={() => addRule(rootId)}
              >
                <PlusIcon className="size-3.5" />
                Add rule
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-dashed"
                onClick={() => addGroup(rootId)}
              >
                <PlusIcon className="size-3.5" />
                Add group
              </Button>
            </div>
          )}
        </div>
      </main>
    </QueryBuilderDndProvider>
  )
}
