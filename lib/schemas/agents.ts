import type { Schema } from "@/lib/query-engine/types"

export const agentsSchema: Schema = {
  id: "agents",
  name: "Agents",
  description: "Covert intelligence operatives",
  recordCount: 87,
  fields: [
    { name: "codename", type: "string", label: "Codename" },
    {
      name: "clearanceLevel",
      type: "enum",
      label: "Clearance Level",
      enumValues: ["LEVEL_1", "LEVEL_2", "LEVEL_3", "LEVEL_4", "LEVEL_5"],
    },
    { name: "lastSeen", type: "date", label: "Last Seen" },
    { name: "missionsCompleted", type: "number", label: "Missions Completed" },
    {
      name: "status",
      type: "enum",
      label: "Status",
      enumValues: ["active", "inactive", "compromised", "retired"],
    },
    { name: "compromised", type: "boolean", label: "Compromised" },
  ],
}
