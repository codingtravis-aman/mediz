import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useLocation, Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { OfflineNotification, InstallPrompt } from "./hooks/use-pwa";
import Home from '@/pages/home'; // Added import
import Onboarding from '@/pages/onboarding'; // Added import

function App() {
  const [location, navigate] = useLocation();

  useEffect(() => {
    // Check if it's first time app use
    const hasCompletedOnboarding = localStorage.getItem('mediz-onboarding-complete');

    if (!hasCompletedOnboarding && location === '/') {
      // Redirect to onboarding flow
      navigate('/onboarding');
    }
  }, [location, navigate]);

  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/onboarding" component={Onboarding} /> {/* Added onboarding route */}
        <Route path="/" component={Home} /> {/* Modified to handle default route */}
      </Switch>
      <Toaster />
      <OfflineNotification />
      <InstallPrompt />
    </QueryClientProvider>
  );
}

export default App;

// Onboarding component is imported from features/onboarding/splash-screen