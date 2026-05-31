"use client"

import { PlusIcon, TrashIcon } from "@phosphor-icons/react"
import * as React from "react"

import { LogicToggle } from "@/components/query-builder/logic-toggle"
import {
  RuleFieldSelect,
  RuleOperatorSelect,
} from "@/components/query-builder/rule-selects"
import { RuleValueInput } from "@/components/query-builder/rule-value-input"
import { Button } from "@/components/ui/button"
import { getDepthColor, getGroupLabel } from "@/lib/query-engine/display-utils"
import { isGroup } from "@/lib/query-engine/tree-utils"
import type { Group, Rule, SchemaField } from "@/lib/query-engine/types"
import { getSchema } from "@/lib/schemas"
import { useQueryStore } from "@/store/query-store"

interface ConditionGroupProps {
  group: Group
  depth?: number
  index?: number
  isRoot?: boolean
}

export const ConditionGroup = React.memo(function ConditionGroup({
  group,
  depth = 0,
  index = 0,
  isRoot = false,
}: ConditionGroupProps) {
  const schemaId = useQueryStore((state) => state.schemaId)
  const addRule = useQueryStore((state) => state.addRule)
  const addGroup = useQueryStore((state) => state.addGroup)
  const removeCondition = useQueryStore((state) => state.removeCondition)
  const updateGroupLogic = useQueryStore((state) => state.updateGroupLogic)
  const toggleGroupCollapse = useQueryStore(
    (state) => state.toggleGroupCollapse
  )

  const schema = getSchema(schemaId)
  const depthColor = getDepthColor(depth)

  return (
    <div
      className="rounded-lg border p-3"
      style={{
        borderColor: `color-mix(in oklch, ${depthColor} 25%, var(--border))`,
        background: `color-mix(in oklch, ${depthColor} 6%, transparent)`,
        borderLeftWidth: 3,
        borderLeftColor: depthColor,
      }}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <LogicToggle
          value={group.logic}
          onChange={(logic) => updateGroupLogic(group.id, logic)}
        />
        <span className="text-xs text-muted-foreground italic">
          {isRoot ? "Root group" : getGroupLabel(index)}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => toggleGroupCollapse(group.id)}
            aria-label={group.collapsed ? "Expand group" : "Collapse group"}
          >
            {group.collapsed ? "+" : "−"}
          </Button>
          {!isRoot && (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={() => removeCondition(group.id)}
              aria-label="Remove group"
            >
              <TrashIcon className="size-3.5 text-destructive" />
            </Button>
          )}
        </div>
      </div>

      {!group.collapsed && (
        <>
          <div className="space-y-2">
            {group.conditions.length === 0 ? (
              <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
                No conditions yet. Add a rule or nested group.
              </p>
            ) : (
              group.conditions.map((condition, conditionIndex) =>
                isGroup(condition) ? (
                  <ConditionGroup
                    key={condition.id}
                    group={condition}
                    depth={depth + 1}
                    index={conditionIndex}
                  />
                ) : (
                  <ConditionRule
                    key={condition.id}
                    rule={condition}
                    fields={schema.fields}
                  />
                )
              )
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-dashed text-xs"
              onClick={() => addRule(group.id)}
            >
              <PlusIcon className="size-3.5" />
              Add rule
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 border-dashed text-xs"
              onClick={() => addGroup(group.id)}
            >
              <PlusIcon className="size-3.5" />
              Add group
            </Button>
          </div>
        </>
      )}

      {group.collapsed && (
        <p className="text-xs text-muted-foreground">
          Collapsed · {group.conditions.length} condition
          {group.conditions.length === 1 ? "" : "s"}
        </p>
      )}
    </div>
  )
})

interface ConditionRuleProps {
  rule: Rule
  fields: SchemaField[]
}

const ConditionRule = React.memo(function ConditionRule({
  rule,
  fields,
}: ConditionRuleProps) {
  const updateRule = useQueryStore((state) => state.updateRule)
  const removeCondition = useQueryStore((state) => state.removeCondition)

  const fieldDef = fields.find((field) => field.name === rule.field) ?? null

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
      <RuleFieldSelect
        fields={fields}
        value={rule.field}
        onChange={(field) => updateRule(rule.id, { field })}
      />
      <RuleOperatorSelect
        field={fieldDef}
        value={rule.operator}
        onChange={(operator) => updateRule(rule.id, { operator, value: null })}
      />
      <RuleValueInput
        field={fieldDef}
        operator={rule.operator}
        value={rule.value}
        onChange={(value) => updateRule(rule.id, { value })}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        className="ml-auto"
        onClick={() => removeCondition(rule.id)}
        aria-label="Remove rule"
      >
        <TrashIcon className="size-3.5 text-muted-foreground" />
      </Button>
    </div>
  )
})
