"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { operatorNeedsValue } from "@/lib/query-engine/operators"
import type {
  OperatorValue,
  RuleValue,
  SchemaField,
} from "@/lib/query-engine/types"

interface RuleValueInputProps {
  field: SchemaField | null
  operator: OperatorValue | null
  value: RuleValue
  onChange: (value: RuleValue) => void
}

export function RuleValueInput({
  field,
  operator,
  value,
  onChange,
}: RuleValueInputProps) {
  if (!field || !operator || !operatorNeedsValue(operator)) {
    return (
      <div className="flex h-8 flex-1 items-center text-xs text-muted-foreground">
        No value needed
      </div>
    )
  }

  if (field.type === "boolean") {
    return (
      <div className="flex h-8 flex-1 items-center gap-2">
        <Switch
          checked={value === true}
          onCheckedChange={(checked) => onChange(checked)}
          aria-label="Boolean value"
        />
        <span className="text-xs text-muted-foreground">
          {value === true ? "true" : "false"}
        </span>
      </div>
    )
  }

  if (field.type === "enum" && field.enumValues) {
    return (
      <Select
        value={typeof value === "string" ? value : ""}
        onValueChange={(next) => onChange(next)}
      >
        <SelectTrigger className="h-8 flex-1 text-xs">
          <SelectValue placeholder="Select value…" />
        </SelectTrigger>
        <SelectContent>
          {field.enumValues.map((option) => (
            <SelectItem key={option} value={option} className="text-xs">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }

  return (
    <Input
      type={
        field.type === "number"
          ? "number"
          : field.type === "date"
            ? "date"
            : "text"
      }
      value={value === null ? "" : String(value)}
      onChange={(event) => {
        const raw = event.target.value
        if (field.type === "number") {
          onChange(raw === "" ? null : Number(raw))
          return
        }
        onChange(raw)
      }}
      placeholder="Value…"
      className="h-8 flex-1 text-xs"
      aria-label="Rule value"
    />
  )
}
