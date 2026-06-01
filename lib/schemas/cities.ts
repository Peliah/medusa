import type { Schema } from "@/lib/query-engine/types"

export const citiesSchema: Schema = {
  id: "cities",
  name: "Cities",
  description: "Global urban analytics data",
  recordCount: 124,
  fields: [
    { name: "name", type: "string", label: "City Name" },
    { name: "country", type: "string", label: "Country" },
    { name: "population", type: "number", label: "Population" },
    { name: "crimeIndex", type: "number", label: "Crime Index" },
    { name: "isCapital", type: "boolean", label: "Is Capital" },
  ],
}
