import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ScanPrescription from "@/pages/scan-prescription";
import Medications from "@/pages/medications";
import MedicationDetails from "@/pages/medication-details";
import Reminders from "@/pages/reminders";
import Prescriptions from "@/pages/prescriptions";
import { OfflineNotification, InstallPrompt } from "@/hooks/use-pwa";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/scan" component={ScanPrescription} />
      <Route path="/medications" component={Medications} />
      <Route path="/medications/:id" component={MedicationDetails} />
      <Route path="/reminders" component={Reminders} />
      <Route path="/prescriptions" component={Prescriptions} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
      <OfflineNotification />
      <InstallPrompt />
    </QueryClientProvider>
  );
}

export default App;
