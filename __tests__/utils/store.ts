import { createRootGroup } from "@/lib/query-engine/factory"
import { useDatasetStore } from "@/store/dataset-store"
import { useExecutionStore } from "@/store/execution-store"
import { useHistoryStore } from "@/store/history-store"
import { useQueryStore } from "@/store/query-store"
import { useUIStore } from "@/store/ui-store"

export function resetQueryStore() {
  const tree = createRootGroup()
  useQueryStore.setState({
    tree,
    schemaId: "agents",
    rootId: tree.id,
    past: [],
    future: [],
  })
}

export function resetHistoryStore() {
  useHistoryStore.setState({
    history: [],
    presets: [],
  })
}

export function resetExecutionStore() {
  useExecutionStore.setState({
    status: "idle",
    matches: [],
    lastRunAt: null,
  })
}

export function resetDatasetStore() {
  useDatasetStore.setState({ imported: {} })
}

export function resetUIStore() {
  useUIStore.setState({
    resultsOpen: false,
    previewFormat: "sql",
    shortcutsOpen: false,
    sidebarOpen: false,
    presetsSectionOpen: true,
    focusedConditionId: null,
    savePresetFocusNonce: 0,
  })
}

export function resetAllStores() {
  resetQueryStore()
  resetHistoryStore()
  resetExecutionStore()
  resetDatasetStore()
  resetUIStore()
}
