import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./auth/AuthProvider";
import { RequireAuth } from "./auth/RequireAuth";
import { LandingPage } from "./pages/LandingPage";
import { WorkspacePage } from "./pages/WorkspacePage";
import { OrchestrationPage } from "./pages/OrchestrationPage";
import { FleetPage } from "./pages/FleetPage";
import { ChatPage } from "./pages/ChatPage";
import { AuthPage } from "./pages/AuthPage";
import { CloudPage } from "./pages/CloudPage";
import { DesignPromptsPage } from "./pages/DesignPromptsPage";
import { McpBuilderPage } from "./pages/McpBuilderPage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { SecurityCenterPage } from "./pages/SecurityCenterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { KubernetesPage } from "./pages/KubernetesPage";
import { SupabaseManagerPage } from "./pages/SupabaseManagerPage";
import { PricingPage } from "./pages/PricingPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/chat" element={<Navigate to="/" replace />} />
          <Route path="/home" element={<LandingPage />} />
          <Route
            path="/mcp"
            element={
              <RequireAuth>
                <McpBuilderPage />
              </RequireAuth>
            }
          />
          <Route path="/marketplace" element={<MarketplacePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/security" element={<SecurityCenterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/kubernetes" element={<KubernetesPage />} />
          <Route path="/supabase" element={<SupabaseManagerPage />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="/orchestration" element={<OrchestrationPage />} />
          <Route path="/fleet" element={<FleetPage />} />
          <Route path="/cloud" element={<CloudPage />} />
          <Route path="/login" element={<AuthPage initial="login" />} />
          <Route path="/signup" element={<AuthPage initial="signup" />} />
          <Route path="/design-prompts" element={<DesignPromptsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
