"use client"

import { ExportIcon } from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import type { DataRecord } from "@/lib/data/types"
import { exportRecordsToCsv } from "@/lib/results/utils"
import type { Schema } from "@/lib/query-engine/types"

interface ResultsToolbarProps {
  schema: Schema
  records: DataRecord[]
  disabled?: boolean
}

export function ResultsToolbar({
  schema,
  records,
  disabled = false,
}: ResultsToolbarProps) {
  function handleExport() {
    exportRecordsToCsv(records, schema.fields, `${schema.id}-results.csv`)
  }

  return (
    <div className="flex shrink-0 items-center justify-end border-b border-border px-4 py-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-7 gap-1.5 text-xs"
        onClick={handleExport}
        disabled={disabled || records.length === 0}
      >
        <ExportIcon className="size-3.5" />
        Export CSV
      </Button>
    </div>
  )
}
