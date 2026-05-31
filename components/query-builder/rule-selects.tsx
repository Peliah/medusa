"use client"

import * as React from "react"
import { CaretUpDownIcon, CheckIcon } from "@phosphor-icons/react"

import {
  FieldTypeIcon,
  getFieldTypeLabel,
} from "@/components/query-builder/field-type-icon"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import type { OperatorValue, SchemaField } from "@/lib/query-engine/types"
import { cn } from "@/lib/utils"

interface RuleFieldSelectProps {
  fields: SchemaField[]
  value: string | null
  onChange: (field: string) => void
  invalid?: boolean
}

export function RuleFieldSelect({
  fields,
  value,
  onChange,
  invalid = false,
}: RuleFieldSelectProps) {
  const [open, setOpen] = React.useState(false)
  const selected = fields.find((field) => field.name === value) ?? null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          className={cn(
            "h-8 w-[160px] justify-between px-2.5 text-xs font-normal",
            invalid && "border-destructive aria-invalid:border-destructive"
          )}
        >
          {selected ? (
            <span className="flex min-w-0 items-center gap-1.5">
              <FieldTypeIcon
                type={selected.type}
                className="size-3.5 shrink-0 text-muted-foreground"
              />
              <span className="truncate">{selected.label}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Field…</span>
          )}
          <CaretUpDownIcon className="size-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search fields…" className="h-9" />
          <CommandList>
            <CommandEmpty>No fields found.</CommandEmpty>
            <CommandGroup>
              {fields.map((field) => (
                <CommandItem
                  key={field.name}
                  value={`${field.label} ${field.name} ${getFieldTypeLabel(field.type)}`}
                  onSelect={() => {
                    onChange(field.name)
                    setOpen(false)
                  }}
                  className="text-xs"
                >
                  <FieldTypeIcon
                    type={field.type}
                    className="size-3.5 text-muted-foreground"
                  />
                  <span className="flex-1 truncate">{field.label}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">
                    {getFieldTypeLabel(field.type)}
                  </span>
                  <CheckIcon
                    className={cn(
                      "size-3.5",
                      value === field.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface RuleOperatorSelectProps {
  field: SchemaField | null
  value: OperatorValue | null
  onChange: (operator: OperatorValue) => void
  invalid?: boolean
}

export function RuleOperatorSelect({
  field,
  value,
  onChange,
  invalid = false,
}: RuleOperatorSelectProps) {
  const operators = field ? getOperatorsForType(field.type) : []

  return (
    <Select
      value={value ?? ""}
      onValueChange={(next) => onChange(next as OperatorValue)}
      disabled={!field}
    >
      <SelectTrigger
        className={cn(
          "h-8 w-[130px] text-xs",
          invalid && "border-destructive aria-invalid:border-destructive"
        )}
        aria-label="Operator"
        aria-invalid={invalid}
      >
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
