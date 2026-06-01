"use client"

import * as React from "react"
import {
  BracketsCurlyIcon,
  CheckIcon,
  CodeIcon,
  CopyIcon,
  DatabaseIcon,
  ExportIcon,
} from "@phosphor-icons/react"

import { CodeBlock } from "@/components/preview/code-block"
import { ComplexityIndicator } from "@/components/preview/complexity-indicator"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useClipboard } from "@/hooks/use-clipboard"
import { useDebounce } from "@/hooks/use-debounce"
import {
  generatePreview,
  getPreviewFileExtension,
  getPreviewMimeType,
  type PreviewFormat,
} from "@/lib/query-engine/generators"
import { countRules } from "@/lib/query-engine/tree-utils"
import { getSchema } from "@/lib/schemas"
import { useQueryStore } from "@/store/query-store"
import { useUIStore } from "@/store/ui-store"

const EMPTY_MESSAGES: Record<PreviewFormat, string> = {
  sql: "-- No conditions added yet\n-- Add rules in the builder to generate a query",
  mongo: '{\n  "_comment": "No conditions added yet"\n}',
  graphql:
    "# No conditions added yet\n# Add rules in the builder to generate a query",
}

function exportPreview(
  text: string,
  format: PreviewFormat,
  schemaId: string
): void {
  const extension = getPreviewFileExtension(format)
  const blob = new Blob([text], { type: getPreviewMimeType(format) })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = `${schemaId}-query.${extension}`
  anchor.click()
  URL.revokeObjectURL(url)
}

export function BuilderPreviewPanel() {
  const tree = useQueryStore((state) => state.tree)
  const schemaId = useQueryStore((state) => state.schemaId)
  const previewFormat = useUIStore((state) => state.previewFormat)
  const setPreviewFormat = useUIStore((state) => state.setPreviewFormat)

  const debouncedTree = useDebounce(tree, 100)
  const schema = getSchema(schemaId)
  const ruleCount = countRules(debouncedTree)
  const isEmpty = ruleCount === 0

  const previewText = React.useMemo(
    () =>
      isEmpty
        ? EMPTY_MESSAGES[previewFormat]
        : generatePreview(previewFormat, debouncedTree, schema),
    [debouncedTree, isEmpty, previewFormat, schema]
  )

  const { copied, copy } = useClipboard(1500)

  function handleCopy() {
    void copy(previewText)
  }

  function handleExport() {
    exportPreview(previewText, previewFormat, schemaId)
  }

  return (
    <aside className="builder-panel bg-card">
      <div className="builder-panel__header flex items-center justify-between gap-2 border-b border-border px-[var(--builder-pad-x)] py-[var(--builder-pad-y)]">
        <span className="builder-section-label">Preview</span>
        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 gap-1 px-1.5 text-[11px]"
            onClick={handleCopy}
            disabled={isEmpty}
          >
            {copied ? (
              <>
                <CheckIcon className="size-3.5 text-emerald-500" />
                Copied ✓
              </>
            ) : (
              <>
                <CopyIcon className="size-3.5" />
                Copy
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-6 gap-1 px-1.5 text-[11px]"
            onClick={handleExport}
            disabled={isEmpty}
          >
            <ExportIcon className="size-3.5" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-[var(--builder-pad-x)] pt-2 pb-2">
        <Tabs
          value={previewFormat}
          onValueChange={(value) => setPreviewFormat(value as PreviewFormat)}
          className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden"
        >
          <TabsList className="h-7 w-full shrink-0">
            <TabsTrigger value="sql" className="flex-1 gap-1 text-xs">
              <DatabaseIcon className="size-3" />
              SQL
            </TabsTrigger>
            <TabsTrigger value="mongo" className="flex-1 gap-1 text-xs">
              <BracketsCurlyIcon className="size-3" />
              Mongo
            </TabsTrigger>
            <TabsTrigger value="graphql" className="flex-1 gap-1 text-xs">
              <CodeIcon className="size-3" />
              GQL
            </TabsTrigger>
          </TabsList>

          {(["sql", "mongo", "graphql"] as const).map((format) => (
            <TabsContent
              key={format}
              value={format}
              className="mt-0 min-h-0 flex-1 overflow-hidden outline-none"
            >
              <CodeBlock
                key={format === previewFormat ? previewText : format}
                code={
                  format === previewFormat
                    ? previewText
                    : isEmpty
                      ? EMPTY_MESSAGES[format]
                      : generatePreview(format, debouncedTree, schema)
                }
                format={format}
                flash={format === previewFormat}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <ComplexityIndicator tree={debouncedTree} />
    </aside>
  )
}
