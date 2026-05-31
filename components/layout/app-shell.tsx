import { BuilderHeader } from "@/components/layout/builder-header"
import { BuilderMain } from "@/components/layout/builder-main"
import { BuilderResultsDrawer } from "@/components/layout/builder-results-drawer"
import { BuilderSidebarDrawer } from "@/components/sidebar/builder-sidebar-drawer"

export function AppShell() {
  return (
    <div className="builder-shell">
      <BuilderHeader />

      <div className="builder-main">
        <BuilderMain />
      </div>

      <BuilderResultsDrawer />
      <BuilderSidebarDrawer />
    </div>
  )
}
