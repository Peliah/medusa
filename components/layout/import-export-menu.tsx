"use client"

import * as React from "react"
import {
  ArrowLineDownIcon,
  ArrowLineUpIcon,
  DotsThreeVerticalIcon,
} from "@phosphor-icons/react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getRecords } from "@/lib/data"
import {
  exportDatasetJson,
  exportQueryJson,
  importFromJson,
} from "@/lib/import"
import { useQueryExecution } from "@/hooks/use-query-execution"
import { useDatasetStore } from "@/store/dataset-store"
import { useQueryStore } from "@/store/query-store"

function downloadJson(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function formatImportError(issues: Array<{ path: string; message: string }>) {
  const preview = issues
    .slice(0, 3)
    .map((issue) => `${issue.path}: ${issue.message}`)
  if (issues.length > 3) {
    preview.push(`…and ${issues.length - 3} more`)
  }
  return `${preview.join("\n")}\n\nTip: use a sample JSON template from this menu.`
}

const SAMPLE_QUERY_BY_SCHEMA = {
  agents: {
    kind: "query",
    schemaId: "agents",
    tree: {
      type: "group",
      logic: "AND",
      conditions: [
        {
          type: "rule",
          field: "status",
          operator: "eq",
          value: "active",
        },
        {
          type: "rule",
          field: "missionsCompleted",
          operator: "gte",
          value: 10,
        },
      ],
    },
  },
  cities: {
    kind: "query",
    schemaId: "cities",
    tree: {
      type: "group",
      logic: "AND",
      conditions: [
        {
          type: "rule",
          field: "population",
          operator: "gte",
          value: 1000000,
        },
        {
          type: "rule",
          field: "isCapital",
          operator: "eq",
          value: true,
        },
      ],
    },
  },
  incidents: {
    kind: "query",
    schemaId: "incidents",
    tree: {
      type: "group",
      logic: "AND",
      conditions: [
        {
          type: "rule",
          field: "severity",
          operator: "eq",
          value: "high",
        },
        {
          type: "rule",
          field: "status",
          operator: "not_in",
          value: ["resolved", "closed"],
        },
      ],
    },
  },
} as const

const SAMPLE_DATASET_BY_SCHEMA = {
  agents: {
    kind: "dataset",
    schemaId: "agents",
    records: [
      {
        id: "ag-sample-001",
        codename: "Lyra",
        clearanceLevel: "LEVEL_4",
        lastSeen: "2026-06-01",
        missionsCompleted: 21,
        status: "active",
        compromised: false,
      },
      {
        id: "ag-sample-002",
        codename: "Orion",
        clearanceLevel: "LEVEL_3",
        lastSeen: "2026-05-15",
        missionsCompleted: 12,
        status: "inactive",
        compromised: false,
      },
    ],
  },
  cities: {
    kind: "dataset",
    schemaId: "cities",
    records: [
      {
        id: "ct-sample-001",
        name: "Solaria",
        country: "Spain",
        population: 1450000,
        crimeIndex: 38,
        isCapital: false,
      },
      {
        id: "ct-sample-002",
        name: "Novera",
        country: "Canada",
        population: 820000,
        crimeIndex: 24,
        isCapital: true,
      },
    ],
  },
  incidents: {
    kind: "dataset",
    schemaId: "incidents",
    records: [
      {
        id: "inc-sample-001",
        title: "API error spike",
        severity: "high",
        reportedAt: "2026-06-01",
        status: "investigating",
        responseTime: 18,
      },
      {
        id: "inc-sample-002",
        title: "Login timeout",
        severity: "medium",
        reportedAt: "2026-05-30",
        status: "open",
        responseTime: 33,
      },
    ],
  },
} as const

export function ImportExportMenu() {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const schemaId = useQueryStore((state) => state.schemaId)
  const tree = useQueryStore((state) => state.tree)
  const loadQuery = useQueryStore((state) => state.loadQuery)
  const setSchema = useQueryStore((state) => state.setSchema)
  const setImported = useDatasetStore((state) => state.setImported)
  const clearImported = useDatasetStore((state) => state.clearImported)
  const hasImported = useDatasetStore((state) => state.hasImported)
  const resetExecution = useQueryExecution().reset

  const handleImportClick = React.useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      event.target.value = ""

      if (!file) return

      void file.text().then((text) => {
        const result = importFromJson(text, schemaId)

        if (!result.ok) {
          toast.error("Import failed", {
            description: formatImportError(result.issues),
          })
          return
        }

        if (result.data.kind === "query") {
          loadQuery(result.data.schemaId, result.data.tree)
          resetExecution()
          toast.success("Query imported", {
            description: `Loaded ${result.data.schemaId} query tree`,
          })
          return
        }

        setImported(result.data.schemaId, result.data.records)
        if (result.data.schemaId !== schemaId) {
          setSchema(result.data.schemaId)
        }
        resetExecution()
        toast.success("Dataset imported", {
          description: `${result.data.records.length} ${result.data.schemaId} records loaded`,
        })
      })
    },
    [loadQuery, resetExecution, schemaId, setImported, setSchema]
  )

  const handleExportQuery = React.useCallback(() => {
    downloadJson(
      `medusa-query-${schemaId}.json`,
      exportQueryJson(schemaId, tree)
    )
    toast.success("Query exported")
  }, [schemaId, tree])

  const handleExportDataset = React.useCallback(() => {
    const records = getRecords(schemaId)
    downloadJson(
      `medusa-dataset-${schemaId}.json`,
      exportDatasetJson(schemaId, records)
    )
    toast.success("Dataset exported", {
      description: `${records.length} records`,
    })
  }, [schemaId])

  const handleResetDataset = React.useCallback(() => {
    clearImported(schemaId)
    resetExecution()
    toast.success("Dataset reset", {
      description: `Using default ${schemaId} records`,
    })
  }, [clearImported, resetExecution, schemaId])

  const handleDownloadSampleQuery = React.useCallback(() => {
    downloadJson(
      `medusa-sample-query-${schemaId}.json`,
      JSON.stringify(SAMPLE_QUERY_BY_SCHEMA[schemaId], null, 2)
    )
    toast.success("Sample query downloaded")
  }, [schemaId])

  const handleDownloadSampleDataset = React.useCallback(() => {
    downloadJson(
      `medusa-sample-dataset-${schemaId}.json`,
      JSON.stringify(SAMPLE_DATASET_BY_SCHEMA[schemaId], null, 2)
    )
    toast.success("Sample dataset downloaded")
  }, [schemaId])

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        aria-hidden
        onChange={handleFileChange}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Import and export"
          >
            <DotsThreeVerticalIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={handleImportClick}>
            <ArrowLineUpIcon className="size-4" />
            Import JSON
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDownloadSampleQuery}>
            <ArrowLineDownIcon className="size-4" />
            Download sample query
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadSampleDataset}>
            <ArrowLineDownIcon className="size-4" />
            Download sample dataset
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleExportQuery}>
            <ArrowLineDownIcon className="size-4" />
            Export query
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleExportDataset}>
            <ArrowLineDownIcon className="size-4" />
            Export dataset
          </DropdownMenuItem>
          {hasImported(schemaId) ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleResetDataset}>
                Reset to default dataset
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
