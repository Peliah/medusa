"use client"

import {
  BracketsCurlyIcon,
  CodeIcon,
  DatabaseIcon,
} from "@phosphor-icons/react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { countRules } from "@/lib/query-engine/tree-utils"
import { useQueryStore } from "@/store/query-store"
import { useUIStore } from "@/store/ui-store"

export function BuilderPreviewPanel() {
  const tree = useQueryStore((state) => state.tree)
  const previewFormat = useUIStore((state) => state.previewFormat)
  const setPreviewFormat = useUIStore((state) => state.setPreviewFormat)

  const ruleCount = countRules(tree)
  const isEmpty = ruleCount === 0

  return (
    <aside className="builder-panel bg-card">
      <div className="builder-panel__header border-b border-border px-4 py-3">
        <h2 className="font-heading text-sm font-semibold">Query preview</h2>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
        <Tabs
          value={previewFormat}
          onValueChange={(value) =>
            setPreviewFormat(value as "sql" | "mongo" | "graphql")
          }
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden"
        >
          <TabsList className="h-8 w-full shrink-0">
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
              <pre className="h-full overflow-auto overscroll-contain rounded-lg border border-border bg-foreground p-4 font-mono text-xs leading-relaxed text-background">
                {isEmpty ? (
                  <code className="text-background/60">
                    {`-- No conditions added yet\n-- Add rules in the builder to generate a query`}
                  </code>
                ) : (
                  <code>
                    {format === "sql" &&
                      "SELECT *\nFROM …\nWHERE …\n-- Generator coming in next PR"}
                    {format === "mongo" &&
                      '{\n  "$and": []\n}\n// Generator coming in next PR'}
                    {format === "graphql" &&
                      "query Filter {\n  …\n}\n# Generator coming in next PR"}
                  </code>
                )}
              </pre>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </aside>
  )
}
