"use client"

import {
  ArrowCounterClockwiseIcon,
  ArrowUUpLeftIcon,
  ArrowUUpRightIcon,
  PlusIcon,
} from "@phosphor-icons/react"

import { ConditionGroup } from "@/components/query-builder/condition-group"
import { QueryBuilderDndProvider } from "@/components/query-builder/query-builder-dnd-provider"
import { Button } from "@/components/ui/button"
import { calculateComplexity } from "@/lib/query-engine/complexity"
import {
  countGroups,
  countRules,
  getMaxDepth,
} from "@/lib/query-engine/tree-utils"
import { useCanRedo, useCanUndo, useQueryStore } from "@/store/query-store"

export function QueryBuilderPanel() {
  const tree = useQueryStore((state) => state.tree)
  const rootId = useQueryStore((state) => state.rootId)
  const addRule = useQueryStore((state) => state.addRule)
  const addGroup = useQueryStore((state) => state.addGroup)
  const clearTree = useQueryStore((state) => state.clearTree)
  const undo = useQueryStore((state) => state.undo)
  const redo = useQueryStore((state) => state.redo)
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  const ruleCount = countRules(tree)
  const groupCount = countGroups(tree)
  const maxDepth = getMaxDepth(tree)
  const complexity = ruleCount > 0 ? calculateComplexity(tree) : null

  return (
    <QueryBuilderDndProvider>
      <main className="builder-panel bg-background">
        <div className="builder-panel__header flex items-center justify-between gap-2 border-b border-border px-[var(--builder-pad-x)] py-[var(--builder-pad-y)]">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="builder-section-label">Query</span>
            <span className="text-xs text-muted-foreground">
              {ruleCount} rule{ruleCount === 1 ? "" : "s"}
              {groupCount > 0
                ? ` · ${groupCount} group${groupCount === 1 ? "" : "s"}`
                : ""}
              {maxDepth > 0 ? ` · depth ${maxDepth}` : ""}
              {complexity ? ` · ${complexity.label}` : ""}
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7"
              disabled={!canUndo}
              onClick={undo}
              aria-label="Undo"
              title="Undo (Ctrl+Z)"
            >
              <ArrowUUpLeftIcon className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-7"
              disabled={!canRedo}
              onClick={redo}
              aria-label="Redo"
              title="Redo (Ctrl+Shift+Z)"
            >
              <ArrowUUpRightIcon className="size-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2 text-xs text-muted-foreground"
              onClick={clearTree}
              disabled={ruleCount === 0 && groupCount === 0}
            >
              <ArrowCounterClockwiseIcon className="size-3" />
              Clear all
            </Button>
          </div>
        </div>

        <div className="builder-panel__body px-[var(--builder-pad-x)] py-[var(--builder-pad-y)]">
          {ruleCount === 0 && groupCount === 0 ? (
            <p className="mb-2 text-xs text-muted-foreground">
              No rules yet — add a condition or a nested group.
            </p>
          ) : null}

          <ConditionGroup group={tree} isRoot depth={0} />

          <div className="mt-2 flex flex-wrap gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 border-dashed px-2 text-xs"
              onClick={() => addRule(rootId)}
            >
              <PlusIcon className="size-3" />
              Add condition
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 border-dashed px-2 text-xs"
              onClick={() => addGroup(rootId)}
            >
              <PlusIcon className="size-3" />
              Add group
            </Button>
          </div>
        </div>
      </main>
    </QueryBuilderDndProvider>
  )
}
