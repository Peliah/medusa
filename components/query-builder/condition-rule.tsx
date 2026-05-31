"use client"

import * as React from "react"
import { TrashIcon } from "@phosphor-icons/react"

import { DragHandle } from "@/components/query-builder/drag-handle"
import {
  RuleFieldSelect,
  RuleOperatorSelect,
} from "@/components/query-builder/rule-selects"
import { RuleValueInput } from "@/components/query-builder/rule-value-input"
import { ValidationError } from "@/components/query-builder/validation-error"
import { Button } from "@/components/ui/button"
import { getRuleValidationMessage } from "@/lib/query-engine/validator"
import type { Rule, SchemaField } from "@/lib/query-engine/types"
import { getSchema } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { useQueryStore } from "@/store/query-store"

interface ConditionRuleProps {
  rule: Rule
  fields: SchemaField[]
  dragHandleRef?: (element: Element | null) => void
}

export const ConditionRule = React.memo(function ConditionRule({
  rule,
  fields,
  dragHandleRef,
}: ConditionRuleProps) {
  const schemaId = useQueryStore((state) => state.schemaId)
  const updateRule = useQueryStore((state) => state.updateRule)
  const removeCondition = useQueryStore((state) => state.removeCondition)

  const schema = getSchema(schemaId)
  const fieldDef = fields.find((field) => field.name === rule.field) ?? null
  const validationMessage = getRuleValidationMessage(rule, schema)
  const isInvalid =
    validationMessage !== null &&
    (rule.field !== null || rule.operator !== null)

  return (
    <div className="group/row">
      <div
        className={cn(
          "flex flex-wrap items-center gap-2 rounded-lg border bg-background px-2 py-2",
          isInvalid ? "border-destructive/60" : "border-border"
        )}
      >
        <DragHandle label="Drag rule to reorder" handleRef={dragHandleRef} />
        <RuleFieldSelect
          fields={fields}
          value={rule.field}
          onChange={(field) => updateRule(rule.id, { field })}
          invalid={isInvalid && !rule.field}
        />
        <RuleOperatorSelect
          field={fieldDef}
          value={rule.operator}
          onChange={(operator) =>
            updateRule(rule.id, { operator, value: null })
          }
          invalid={isInvalid && !!rule.field && !rule.operator}
        />
        <RuleValueInput
          field={fieldDef}
          operator={rule.operator}
          value={rule.value}
          onChange={(value) => updateRule(rule.id, { value })}
          invalid={isInvalid && !!rule.field && !!rule.operator}
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
      <ValidationError message={isInvalid ? validationMessage : null} />
    </div>
  )
})
