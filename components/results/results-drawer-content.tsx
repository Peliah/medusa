"use client"

import * as React from "react"

import { ResultsEmpty } from "@/components/results/results-empty"
import { ResultsLoading } from "@/components/results/results-loading"
import {
  ResultsPagination,
  type PageSize,
} from "@/components/results/results-pagination"
import { ResultsTable } from "@/components/results/results-table"
import { ResultsToolbar } from "@/components/results/results-toolbar"
import { useQueryExecution } from "@/hooks/use-query-execution"
import { sortRecords, type SortDirection } from "@/lib/results/utils"
import { getSchema } from "@/lib/schemas"
import { useQueryStore } from "@/store/query-store"

export function ResultsDrawerContent() {
  const schemaId = useQueryStore((state) => state.schemaId)
  const { status, matches, isLoading, hasResults, lastRunAt } =
    useQueryExecution()
  const schema = getSchema(schemaId)

  const [sortField, setSortField] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc")
  const [page, setPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState<PageSize>(10)
  const [pageRunKey, setPageRunKey] = React.useState(lastRunAt)

  if (lastRunAt !== pageRunKey) {
    setPageRunKey(lastRunAt)
    setPage(1)
  }

  const sortedRecords = React.useMemo(() => {
    if (!sortField) return matches
    const field = schema.fields.find((item) => item.name === sortField)
    if (!field) return matches
    return sortRecords(matches, field, sortDirection)
  }, [matches, schema.fields, sortDirection, sortField])

  const totalPages = Math.max(1, Math.ceil(sortedRecords.length / pageSize))
  const safePage = Math.min(page, totalPages)

  const pageRecords = React.useMemo(() => {
    const start = (safePage - 1) * pageSize
    return sortedRecords.slice(start, start + pageSize)
  }, [pageSize, safePage, sortedRecords])

  function handleSort(fieldName: string) {
    if (sortField === fieldName) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"))
      return
    }
    setSortField(fieldName)
    setSortDirection("asc")
  }

  function handlePageSizeChange(size: PageSize) {
    setPageSize(size)
    setPage(1)
  }

  if (isLoading) {
    return <ResultsLoading />
  }

  if (status === "idle") {
    return <ResultsEmpty hasRun={false} />
  }

  if (hasResults && matches.length === 0) {
    return <ResultsEmpty hasRun />
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ResultsToolbar schema={schema} records={matches} />
      <div className="min-h-0 flex-1 overflow-auto overscroll-contain px-1 py-0.5">
        <ResultsTable
          records={pageRecords}
          fields={schema.fields}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>
      <div className="shrink-0 border-t border-border px-[var(--builder-pad-x)] py-1">
        <ResultsPagination
          page={safePage}
          pageSize={pageSize}
          totalItems={sortedRecords.length}
          onPageChange={setPage}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  )
}
