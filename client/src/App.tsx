import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import ChangeRequests from "./pages/ChangeRequests";
import NewChangeRequest from "./pages/NewChangeRequest";
import ChangeRequestDetail from "./pages/ChangeRequestDetail";
import { LayoutDashboard, FileText, Plus } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Change Requests", href: "/change-requests", icon: FileText },
  { name: "New CR", href: "/new-change-request", icon: Plus },
];

function Router() {
  return (
    <Switch>
      <Route path={"/"}>
        <DashboardLayout navigation={navigation}>
          <Dashboard />
        </DashboardLayout>
      </Route>
      <Route path={"/change-requests"}>
        <DashboardLayout navigation={navigation}>
          <ChangeRequests />
        </DashboardLayout>
      </Route>
      <Route path={"/new-change-request"}>
        <DashboardLayout navigation={navigation}>
          <NewChangeRequest />
        </DashboardLayout>
      </Route>
      <Route path={"/change-requests/:id"}>
        <DashboardLayout navigation={navigation}>
          <ChangeRequestDetail />
        </DashboardLayout>
      </Route>
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
