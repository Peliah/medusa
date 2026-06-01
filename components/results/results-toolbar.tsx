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
    <div className="flex shrink-0 items-center justify-end border-b border-border px-[var(--builder-pad-x)] py-1">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-6 gap-1 px-2 text-[11px]"
        onClick={handleExport}
        disabled={disabled || records.length === 0}
      >
        <ExportIcon className="size-3.5" />
        Export CSV
      </Button>
    </div>
  )
}
