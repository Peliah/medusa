"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getOperatorsForType,
  operatorLabels,
} from "@/lib/query-engine/operators"
import type { OperatorValue } from "@/lib/query-engine/types"
import type { SchemaField } from "@/lib/query-engine/types"

interface RuleFieldSelectProps {
  fields: SchemaField[]
  value: string | null
  onChange: (field: string) => void
}

export function RuleFieldSelect({
  fields,
  value,
  onChange,
}: RuleFieldSelectProps) {
  return (
    <Select value={value ?? ""} onValueChange={onChange}>
      <SelectTrigger className="h-8 w-[140px] text-xs" aria-label="Field">
        <SelectValue placeholder="Field…" />
      </SelectTrigger>
      <SelectContent>
        {fields.map((field) => (
          <SelectItem key={field.name} value={field.name} className="text-xs">
            {field.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

interface RuleOperatorSelectProps {
  field: SchemaField | null
  value: OperatorValue | null
  onChange: (operator: OperatorValue) => void
}

export function RuleOperatorSelect({
  field,
  value,
  onChange,
}: RuleOperatorSelectProps) {
  const operators = field ? getOperatorsForType(field.type) : []

  return (
    <Select
      value={value ?? ""}
      onValueChange={(next) => onChange(next as OperatorValue)}
      disabled={!field}
    >
      <SelectTrigger className="h-8 w-[130px] text-xs" aria-label="Operator">
        <SelectValue placeholder="Operator…" />
      </SelectTrigger>
      <SelectContent>
        {operators.map((operator) => (
          <SelectItem key={operator} value={operator} className="text-xs">
            {operatorLabels[operator]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
