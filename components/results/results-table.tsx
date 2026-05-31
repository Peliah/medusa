"use client"

import * as React from "react"
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react"
import { motion } from "framer-motion"

import { ResultsCell } from "@/components/results/results-cell"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DataRecord } from "@/lib/data/types"
import type { SortDirection } from "@/lib/results/utils"
import type { SchemaField } from "@/lib/query-engine/types"
import { cn } from "@/lib/utils"

interface ResultsTableProps {
  records: DataRecord[]
  fields: SchemaField[]
  sortField: string | null
  sortDirection: SortDirection
  onSort: (fieldName: string) => void
}

export function ResultsTable({
  records,
  fields,
  sortField,
  sortDirection,
  onSort,
}: ResultsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          {fields.map((field) => {
            const isActive = sortField === field.name
            return (
              <TableHead key={field.name} className="h-9 px-3 text-xs">
                <button
                  type="button"
                  onClick={() => onSort(field.name)}
                  className="inline-flex items-center gap-1 font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {field.label}
                  <span className="inline-flex size-3.5 items-center justify-center">
                    {isActive ? (
                      sortDirection === "asc" ? (
                        <CaretUpIcon className="size-3" />
                      ) : (
                        <CaretDownIcon className="size-3" />
                      )
                    ) : null}
                  </span>
                </button>
              </TableHead>
            )
          })}
        </TableRow>
      </TableHeader>
      <TableBody>
        {records.map((record, index) => (
          <motion.tr
            key={String(record.id ?? index)}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.2,
              delay: Math.min(index, 9) * 0.03,
            }}
            className={cn(
              "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            )}
          >
            {fields.map((field) => (
              <TableCell key={field.name} className="px-3 py-2">
                <ResultsCell value={record[field.name]} field={field} />
              </TableCell>
            ))}
          </motion.tr>
        ))}
      </TableBody>
    </Table>
  )
}
