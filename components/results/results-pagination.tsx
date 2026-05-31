"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]

interface ResultsPaginationProps {
  page: number
  pageSize: PageSize
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: PageSize) => void
  className?: string
}

export function ResultsPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  className,
}: ResultsPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safePage = Math.min(page, totalPages)
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1
  const end = Math.min(safePage * pageSize, totalItems)

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 text-xs",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">Rows per page</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value) as PageSize)}
        >
          <SelectTrigger size="sm" className="h-7 w-[4.5rem] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <SelectItem key={size} value={String(size)} className="text-xs">
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <span className="text-muted-foreground">
        {totalItems === 0 ? "0 results" : `${start}–${end} of ${totalItems}`}
      </span>

      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              text=""
              className="h-7 px-2"
              aria-disabled={safePage <= 1}
              onClick={(event) => {
                event.preventDefault()
                if (safePage > 1) onPageChange(safePage - 1)
              }}
            />
          </PaginationItem>
          <PaginationItem>
            <span className="px-2 text-muted-foreground">
              {safePage} / {totalPages}
            </span>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              href="#"
              text=""
              className="h-7 px-2"
              aria-disabled={safePage >= totalPages}
              onClick={(event) => {
                event.preventDefault()
                if (safePage < totalPages) onPageChange(safePage + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
