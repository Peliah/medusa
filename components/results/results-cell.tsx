"use client"

import { Badge } from "@/components/ui/badge"
import { formatCellValue } from "@/lib/results/utils"
import type { SchemaField } from "@/lib/query-engine/types"
import { cn } from "@/lib/utils"

interface ResultsCellProps {
  value: unknown
  field: SchemaField
}

function BooleanPill({ value }: { value: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "h-5 border-transparent px-2 text-[10px] font-medium",
        value
          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
          : "bg-muted text-muted-foreground"
      )}
    >
      {value ? "true" : "false"}
    </Badge>
  )
}

function EnumChip({ value }: { value: string }) {
  return (
    <Badge variant="secondary" className="h-5 px-2 text-[10px] font-normal">
      {value}
    </Badge>
  )
}

export function ResultsCell({ value, field }: ResultsCellProps) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>
  }

  if (field.type === "boolean" && typeof value === "boolean") {
    return <BooleanPill value={value} />
  }

  if (field.type === "enum" && typeof value === "string") {
    return <EnumChip value={value} />
  }

  return (
    <span className="text-xs text-foreground">
      {formatCellValue(value, field)}
    </span>
  )
}
