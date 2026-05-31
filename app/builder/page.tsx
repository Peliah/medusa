import type { Metadata } from "next"

import { AppShell } from "@/components/layout/app-shell"

export const metadata: Metadata = {
  title: "Builder · MEDUSA",
  description:
    "Visual query builder — construct nested filters and preview output.",
}

export default function BuilderPage() {
  return (
    <div className="h-svh overflow-hidden">
      <AppShell />
    </div>
  )
}
