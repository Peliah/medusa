"use client"

import { HistoryItem } from "@/components/sidebar/history-item"
import { PresetItem } from "@/components/sidebar/preset-item"
import { SavePresetInput } from "@/components/sidebar/save-preset-input"
import { SchemaCard } from "@/components/sidebar/schema-card"
import { SidebarSection } from "@/components/sidebar/sidebar-section"
import { Button } from "@/components/ui/button"
import { useSchemaSwitch } from "@/hooks/use-schema-switch"
import { schemas } from "@/lib/schemas"
import { useHistoryStore } from "@/store/history-store"
import { useQueryStore } from "@/store/query-store"
import { useUIStore } from "@/store/ui-store"

interface SidebarPanelContentProps {
  onNavigate?: () => void
}

function SectionCount({ count }: { count: number }) {
  if (count === 0) return null

  return (
    <span className="font-normal tracking-normal text-muted-foreground normal-case">
      ({count})
    </span>
  )
}

export function SidebarPanelContent({ onNavigate }: SidebarPanelContentProps) {
  const { schemaId, switchSchema } = useSchemaSwitch()
  const tree = useQueryStore((state) => state.tree)
  const history = useHistoryStore((state) => state.history)
  const presets = useHistoryStore((state) => state.presets)
  const restoreHistory = useHistoryStore((state) => state.restoreHistory)
  const clearHistory = useHistoryStore((state) => state.clearHistory)
  const loadPreset = useHistoryStore((state) => state.loadPreset)
  const deletePreset = useHistoryStore((state) => state.deletePreset)
  const presetsSectionOpen = useUIStore((state) => state.presetsSectionOpen)
  const setPresetsSectionOpen = useUIStore(
    (state) => state.setPresetsSectionOpen
  )

  function selectSchema(id: (typeof schemas)[number]["id"]) {
    switchSchema(id, { onConfirmed: onNavigate })
  }

  return (
    <div className="flex flex-col">
      <SidebarSection title="Schemas">
        <div className="space-y-1">
          {schemas.map((schema) => (
            <SchemaCard
              key={schema.id}
              schema={schema}
              active={schemaId === schema.id}
              onSelect={() => selectSchema(schema.id)}
            />
          ))}
        </div>
      </SidebarSection>

      <SidebarSection
        title={
          <>
            History <SectionCount count={history.length} />
          </>
        }
        actions={
          history.length > 0 ? (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="h-7 px-2 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase"
              onClick={clearHistory}
            >
              Clear
            </Button>
          ) : null
        }
        contentClassName="h-48 overflow-y-auto overscroll-contain"
      >
        {history.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No queries run yet. Run a valid query to see history here.
          </p>
        ) : (
          <div className="space-y-1">
            {history.map((entry) => (
              <HistoryItem
                key={entry.id}
                entry={entry}
                onRestore={() => {
                  restoreHistory(entry.id)
                  onNavigate?.()
                }}
              />
            ))}
          </div>
        )}
      </SidebarSection>

      <SidebarSection
        title={
          <>
            Presets <SectionCount count={presets.length} />
          </>
        }
        open={presetsSectionOpen}
        onOpenChange={setPresetsSectionOpen}
      >
        <div className="space-y-3">
          <SavePresetInput schemaId={schemaId} tree={tree} />
          {presets.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Save named presets to reload query trees quickly.
            </p>
          ) : (
            <div className="space-y-1">
              {presets.map((preset) => (
                <PresetItem
                  key={preset.id}
                  preset={preset}
                  onLoad={() => {
                    loadPreset(preset.id)
                    onNavigate?.()
                  }}
                  onDelete={() => deletePreset(preset.id)}
                />
              ))}
            </div>
          )}
        </div>
      </SidebarSection>
    </div>
  )
}
