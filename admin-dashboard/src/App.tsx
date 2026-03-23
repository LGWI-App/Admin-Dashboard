import { GitHubBanner, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { liveProvider } from "@refinedev/supabase";
import { BrowserRouter, Route, Routes, Outlet } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import authProvider from "./providers/auth";
import { dataProvider } from "./providers/data";
import { supabaseClient } from "./providers/supabase-client";
import { Layout } from "./components/refine-ui/layout/layout";
import { Gauge, TrendingUp, MapPin } from "lucide-react";

// Import pages
import { Dashboard } from "./pages/dashboard";
import { MetersList } from "./pages/meters/list";
import { MetersCreate } from "./pages/meters/create";
import { MetersEdit } from "./pages/meters/edit";
import { MetersShow } from "./pages/meters/show";
import { MeterReadingsList } from "./pages/meter-readings/list";
import { MeterReadingsCreate } from "./pages/meter-readings/create";
import { MeterReadingsEdit } from "./pages/meter-readings/edit";
import { MeterReadingsShow } from "./pages/meter-readings/show";
import { CommunitiesList } from "./pages/communities/list";
import { CommunitiesCreate } from "./pages/communities/create";
import { CommunitiesEdit } from "./pages/communities/edit";
import { CommunitiesShow } from "./pages/communities/show";

function App() {
  return (
    <BrowserRouter>
      <GitHubBanner />
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              liveProvider={liveProvider(supabaseClient)}
              authProvider={authProvider}
              routerProvider={routerProvider}
              notificationProvider={useNotificationProvider()}
              resources={[
                {
                  name: "METERS",
                  identifier: "METERS",
                  list: "/METERS",
                  create: "/METERS/create",
                  edit: "/METERS/edit/:id",
                  show: "/METERS/show/:id",
                  meta: {
                    schema: "public",
                    label: "Meters",
                    icon: <Gauge className="w-4 h-4" />,
                  },
                },
                {
                  name: "METER_READINGS",
                  identifier: "METER_READINGS",
                  list: "/METER_READINGS",
                  create: "/METER_READINGS/create",
                  edit: "/METER_READINGS/edit/:id",
                  show: "/METER_READINGS/show/:id",
                  meta: {
                    schema: "public",
                    label: "Meter Readings",
                    icon: <TrendingUp className="w-4 h-4" />,
                  },
                },
                {
                  name: "COMMUNITY",
                  identifier: "COMMUNITY",
                  list: "/COMMUNITY",
                  create: "/COMMUNITY/create",
                  edit: "/COMMUNITY/edit/:id",
                  show: "/COMMUNITY/show/:id",
                  meta: {
                    schema: "public",
                    label: "Communities",
                    icon: <MapPin className="w-4 h-4" />,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "varhhvkqabiqctkcdbxa",
              }}
            >
              <Routes>
                <Route
                  element={
                    <Layout>
                      <Outlet />
                    </Layout>
                  }
                >
                  <Route index element={<Dashboard />} />
                  
                  {/* Meters routes */}
                  <Route path="/METERS">
                    <Route index element={<MetersList />} />
                    <Route path="create" element={<MetersCreate />} />
                    <Route path="edit/:id" element={<MetersEdit />} />
                    <Route path="show/:id" element={<MetersShow />} />
                  </Route>

                  {/* Meter Readings routes */}
                  <Route path="/METER_READINGS">
                    <Route index element={<MeterReadingsList />} />
                    <Route path="create" element={<MeterReadingsCreate />} />
                    <Route path="edit/:id" element={<MeterReadingsEdit />} />
                    <Route path="show/:id" element={<MeterReadingsShow />} />
                  </Route>

                  {/* Communities routes */}
                  <Route path="/COMMUNITY">
                    <Route index element={<CommunitiesList />} />
                    <Route path="create" element={<CommunitiesCreate />} />
                    <Route path="edit/:id" element={<CommunitiesEdit />} />
                    <Route path="show/:id" element={<CommunitiesShow />} />
                  </Route>
                </Route>
              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
