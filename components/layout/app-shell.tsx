import { BuilderHeader } from "@/components/layout/builder-header"
import { Toaster } from "@/components/ui/sonner"
import { BuilderMain } from "@/components/layout/builder-main"
import { BuilderResultsDrawer } from "@/components/layout/builder-results-drawer"
import { SchemaSwitchDialog } from "@/components/modals/schema-switch-dialog"
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
      <SchemaSwitchDialog />
      <Toaster richColors closeButton />
    </div>
  )
}
