"use client"

import {
  BooleanToggle,
  DateInput,
  DateRangeInput,
  EnumSelect,
  NumberInput,
  NumberRangeInput,
  RegexInput,
  TagInput,
  TextInput,
} from "@/components/inputs"
import { operatorNeedsValue } from "@/lib/query-engine/operators"
import type {
  OperatorValue,
  RuleValue,
  SchemaField,
} from "@/lib/query-engine/types"
import { cn } from "@/lib/utils"

interface RuleValueInputProps {
  field: SchemaField | null
  operator: OperatorValue | null
  value: RuleValue
  onChange: (value: RuleValue) => void
  invalid?: boolean
}

export function RuleValueInput({
  field,
  operator,
  value,
  onChange,
  invalid = false,
}: RuleValueInputProps) {
  if (!field || !operator || !operatorNeedsValue(operator)) {
    return (
      <div className="flex h-8 flex-1 items-center text-xs text-muted-foreground">
        No value needed
      </div>
    )
  }

  const inputProps = { value, onChange, invalid, className: "flex-1" }

  if (field.type === "boolean") {
    return <BooleanToggle {...inputProps} />
  }

  if (operator === "between") {
    if (field.type === "number") {
      return <NumberRangeInput {...inputProps} />
    }
    if (field.type === "date") {
      return <DateRangeInput {...inputProps} />
    }
  }

  if (operator === "in" || operator === "not_in") {
    return (
      <TagInput
        {...inputProps}
        options={field.type === "enum" ? field.enumValues : undefined}
        placeholder={field.type === "enum" ? "Select values…" : "Add values…"}
      />
    )
  }

  if (operator === "regex") {
    return <RegexInput {...inputProps} />
  }

  if (field.type === "enum" && field.enumValues) {
    return <EnumSelect {...inputProps} options={field.enumValues} />
  }

  if (field.type === "number") {
    return <NumberInput {...inputProps} />
  }

  if (field.type === "date") {
    return <DateInput {...inputProps} />
  }

  return (
    <TextInput
      {...inputProps}
      className={cn("flex-1", invalid && "border-destructive")}
    />
  )
}
