"use client"

import { ArrowCounterClockwiseIcon, PlusIcon } from "@phosphor-icons/react"

import { ConditionGroup } from "@/components/query-builder/condition-group"
import { Button } from "@/components/ui/button"
import {
  countGroups,
  countRules,
  getMaxDepth,
} from "@/lib/query-engine/tree-utils"
import { useQueryStore } from "@/store/query-store"

export function QueryBuilderPanel() {
  const tree = useQueryStore((state) => state.tree)
  const rootId = useQueryStore((state) => state.rootId)
  const addRule = useQueryStore((state) => state.addRule)
  const addGroup = useQueryStore((state) => state.addGroup)
  const clearTree = useQueryStore((state) => state.clearTree)

  const ruleCount = countRules(tree)
  const groupCount = countGroups(tree)
  const maxDepth = getMaxDepth(tree)

  return (
    <main className="builder-panel bg-background">
      <div className="builder-panel__header flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h1 className="font-heading text-base font-semibold">
            Query builder
          </h1>
          <p className="text-xs text-muted-foreground">
            {ruleCount} rule{ruleCount === 1 ? "" : "s"} · {groupCount} nested
            group{groupCount === 1 ? "" : "s"} · depth {maxDepth}
          </p>
        </div>
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

      <div className="builder-panel__body p-4">
        {ruleCount === 0 && groupCount === 0 ? (
          <div className="mb-4 rounded-xl border border-dashed border-border bg-card/50 px-4 py-8 text-center">
            <p className="font-heading text-lg font-medium">
              Build your first query
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Add a rule to filter your dataset, or create a nested group for
              complex AND/OR logic.
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
  )
}
