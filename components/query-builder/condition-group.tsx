"use client"

import { PlusIcon } from "@phosphor-icons/react"
import { AnimatePresence, motion } from "framer-motion"
import * as React from "react"

import { ConditionRule } from "@/components/query-builder/condition-rule"
import {
  GroupShell,
  GroupToolbar,
} from "@/components/query-builder/group-toolbar"
import { SortableConditionWrapper } from "@/components/query-builder/sortable-condition-wrapper"
import { Button } from "@/components/ui/button"
import { getDepthColor } from "@/lib/query-engine/display-utils"
import { isGroup } from "@/lib/query-engine/tree-utils"
import type { Group } from "@/lib/query-engine/types"
import { getSchema } from "@/lib/schemas"
import { useQueryStore } from "@/store/query-store"
import { useUIStore } from "@/store/ui-store"

interface ConditionGroupProps {
  group: Group
  depth?: number
  index?: number
  isRoot?: boolean
  dragHandleRef?: (element: Element | null) => void
}

const listItemMotion = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.2 },
}

export const ConditionGroup = React.memo(function ConditionGroup({
  group,
  depth = 0,
  index = 0,
  isRoot = false,
  dragHandleRef,
}: ConditionGroupProps) {
  const schemaId = useQueryStore((state) => state.schemaId)
  const addRule = useQueryStore((state) => state.addRule)
  const addGroup = useQueryStore((state) => state.addGroup)
  const removeCondition = useQueryStore((state) => state.removeCondition)
  const updateGroupLogic = useQueryStore((state) => state.updateGroupLogic)
  const toggleGroupCollapse = useQueryStore(
    (state) => state.toggleGroupCollapse
  )
  const focusedConditionId = useUIStore((state) => state.focusedConditionId)
  const setFocusedConditionId = useUIStore(
    (state) => state.setFocusedConditionId
  )

  const schema = getSchema(schemaId)
  const depthColor = getDepthColor(depth)
  const isFocused = focusedConditionId === group.id

  return (
    <GroupShell depthColor={depthColor} isRoot={isRoot}>
      <GroupToolbar
        groupId={group.id}
        logic={group.logic}
        collapsed={!!group.collapsed}
        isRoot={isRoot}
        index={index}
        conditionCount={group.conditions.length}
        focused={isFocused}
        dragHandleRef={dragHandleRef}
        onLogicChange={(logic) => updateGroupLogic(group.id, logic)}
        onToggleCollapse={() => toggleGroupCollapse(group.id)}
        onFocus={() => setFocusedConditionId(group.id)}
        onRemove={isRoot ? undefined : () => removeCondition(group.id)}
      />

      <motion.div
        initial={false}
        animate={{
          height: group.collapsed ? 0 : "auto",
          opacity: group.collapsed ? 0 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="overflow-hidden"
        aria-hidden={group.collapsed}
      >
        <div className="flex flex-col gap-1">
          {group.conditions.length === 0 ? (
            <p className="py-1 text-[11px] text-muted-foreground">
              No conditions in this group.
            </p>
          ) : (
            <AnimatePresence mode="popLayout" initial={false}>
              {group.conditions.map((condition, conditionIndex) => (
                <SortableConditionWrapper
                  key={condition.id}
                  id={condition.id}
                  index={conditionIndex}
                  groupId={group.id}
                >
                  {({ handleRef }) => (
                    <motion.div {...listItemMotion}>
                      {isGroup(condition) ? (
                        <ConditionGroup
                          group={condition}
                          depth={depth + 1}
                          index={conditionIndex}
                          dragHandleRef={handleRef}
                        />
                      ) : (
                        <ConditionRule
                          rule={condition}
                          fields={schema.fields}
                          dragHandleRef={handleRef}
                        />
                      )}
                    </motion.div>
                  )}
                </SortableConditionWrapper>
              ))}
            </AnimatePresence>
          )}
        </div>

        {!isRoot ? (
          <div className="mt-1.5 flex flex-wrap gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 border-dashed px-2 text-[11px]"
              onClick={() => addRule(group.id)}
            >
              <PlusIcon className="size-3" />
              Add condition
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 border-dashed px-2 text-[11px]"
              onClick={() => addGroup(group.id)}
            >
              <PlusIcon className="size-3" />
              Add group
            </Button>
          </div>
        ) : null}
      </motion.div>
    </GroupShell>
  )
})
