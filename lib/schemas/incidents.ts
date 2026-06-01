import type { Schema } from "@/lib/query-engine/types"

export const incidentsSchema: Schema = {
  id: "incidents",
  name: "Incidents",
  description: "System anomaly and event log",
  recordCount: 203,
  fields: [
    { name: "title", type: "string", label: "Title" },
    {
      name: "severity",
      type: "enum",
      label: "Severity",
      enumValues: ["critical", "high", "medium", "low", "info"],
    },
    { name: "reportedAt", type: "date", label: "Reported At" },
    {
      name: "status",
      type: "enum",
      label: "Status",
      enumValues: ["open", "investigating", "resolved", "closed"],
    },
    { name: "responseTime", type: "number", label: "Response Time (mins)" },
  ],
}
