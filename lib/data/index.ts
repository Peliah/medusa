import { agentsRecords } from "@/lib/data/agents"
import { citiesRecords } from "@/lib/data/cities"
import { incidentsRecords } from "@/lib/data/incidents"
import type { DataRecord, Dataset } from "@/lib/data/types"
import type { SchemaId } from "@/lib/query-engine/types"
import { useDatasetStore } from "@/store/dataset-store"

const datasets: Record<SchemaId, DataRecord[]> = {
  agents: agentsRecords,
  cities: citiesRecords,
  incidents: incidentsRecords,
}

export function getDataset(schemaId: SchemaId): Dataset {
  return {
    schemaId,
    records: getRecords(schemaId),
  }
}

export function getRecords(schemaId: SchemaId): DataRecord[] {
  const imported = useDatasetStore.getState().imported[schemaId]
  if (imported?.length) return imported
  return datasets[schemaId]
}
