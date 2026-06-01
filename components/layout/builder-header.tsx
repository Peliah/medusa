"use client"

import Link from "next/link"
import * as React from "react"
import { PlayIcon, QuestionIcon, SidebarIcon } from "@phosphor-icons/react"

import { MedusaHexLogo } from "@/components/layout/medusa-hex-logo"
import { KeyboardShortcutModal } from "@/components/modals/keyboard-shortcut-modal"
import { ThemeToggle } from "@/components/landing/theme-toggle"
import { Button } from "@/components/ui/button"
import { useBuilderKeyboardShortcuts } from "@/hooks/use-builder-keyboard-shortcuts"
import { useQueryExecution } from "@/hooks/use-query-execution"
import { useSchemaSwitch } from "@/hooks/use-schema-switch"
import { isTreeRunnable } from "@/lib/query-engine/validator"
import { getSchema, schemas } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { useQueryStore } from "@/store/query-store"
import { useHistoryStore } from "@/store/history-store"
import { useUIStore } from "@/store/ui-store"

export function BuilderHeader() {
  const tree = useQueryStore((state) => state.tree)
  const { schemaId, switchSchema } = useSchemaSwitch()
  const setResultsOpen = useUIStore((state) => state.setResultsOpen)
  const shortcutsOpen = useUIStore((state) => state.shortcutsOpen)
  const setShortcutsOpen = useUIStore((state) => state.setShortcutsOpen)
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen)
  const recordRun = useHistoryStore((state) => state.recordRun)
  const execute = useQueryExecution().execute

  const canRunQuery = React.useMemo(
    () => isTreeRunnable(tree, getSchema(schemaId)),
    [tree, schemaId]
  )

  const handleRunQuery = React.useCallback(() => {
    if (!canRunQuery) return
    recordRun(schemaId, tree)
    setResultsOpen(true)
    void execute(schemaId, tree)
  }, [canRunQuery, execute, recordRun, schemaId, setResultsOpen, tree])

  const handleOpenShortcuts = React.useCallback(() => {
    setShortcutsOpen(true)
  }, [setShortcutsOpen])

  useBuilderKeyboardShortcuts({
    onRunQuery: handleRunQuery,
    onOpenShortcuts: handleOpenShortcuts,
    canRunQuery,
  })

  return (
    <>
      <header className="flex h-full shrink-0 items-center justify-between gap-2 border-b border-border bg-card px-[var(--builder-pad-x)]">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0 lg:hidden"
            aria-label="Open sidebar"
            onClick={() => setSidebarOpen(true)}
          >
            <SidebarIcon className="size-4" />
          </Button>

          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-2 font-heading text-lg font-semibold tracking-tight"
          >
            <MedusaHexLogo />
            <span className="hidden min-[480px]:inline">MEDUSA</span>
          </Link>

          <div className="min-w-0 flex-1 scrollbar-none overflow-x-auto [-ms-overflow-style:none] lg:hidden [&::-webkit-scrollbar]:hidden">
            <div className="flex w-max items-center rounded-4xl border border-border bg-muted/50 p-1">
              {schemas.map((schema) => (
                <button
                  key={schema.id}
                  type="button"
                  onClick={() => switchSchema(schema.id)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-4xl px-2.5 py-1 text-xs transition-colors sm:px-3",
                    schemaId === schema.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {schema.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button
            size="sm"
            disabled={!canRunQuery}
            onClick={handleRunQuery}
            className="gap-1.5"
            title={
              canRunQuery
                ? "Run query (Ctrl+Enter)"
                : "Add valid rules before running"
            }
          >
            <PlayIcon className="size-3.5" />
            <span className="hidden sm:inline">Run query</span>
            <span className="sm:hidden">Run</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Keyboard shortcuts"
            onClick={handleOpenShortcuts}
          >
            <QuestionIcon className="size-4" />
          </Button>

          <ThemeToggle />
        </div>
      </header>

      <KeyboardShortcutModal
        open={shortcutsOpen}
        onOpenChange={setShortcutsOpen}
      />
    </>
  )
}
