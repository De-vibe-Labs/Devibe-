import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { AppLayout } from "@/layouts/app-layout"
import { ScrollToTop } from "@/components/app/scroll-to-top"
import { RouteFallback } from "@/components/app/route-fallback"
import { HomePage } from "@/pages/home"
import { DashboardPage } from "@/pages/dashboard"
import { ProjectsPage } from "@/pages/projects"
import { DeploymentsPage } from "@/pages/deployments"
import { MarketplacePage } from "@/pages/marketplace"
import { SettingsPage } from "@/pages/settings"
import { SupportPage } from "@/pages/support"
import { OrchestrationPage } from "@/pages/orchestration"
import { BuilderPage } from "@/pages/builder"

// Monaco is a large dependency, so the workspace route is split out of the main bundle.
const IdePage = lazy(() => import("@/pages/ide"))

export function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dashboard/projects" element={<ProjectsPage />} />
          <Route path="/dashboard/deployments" element={<DeploymentsPage />} />
          <Route path="/dashboard/marketplace" element={<MarketplacePage />} />
          <Route path="/dashboard/settings" element={<SettingsPage />} />
          <Route path="/dashboard/support" element={<SupportPage />} />
          <Route path="/orchestration" element={<OrchestrationPage />} />
          <Route path="/builder" element={<BuilderPage />} />
          <Route
            path="/ide"
            element={
              <Suspense fallback={<RouteFallback label="Loading workspace" />}>
                <IdePage />
              </Suspense>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
